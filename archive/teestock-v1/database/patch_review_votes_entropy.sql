-- ==============================================================================
-- 🛡️ PATCH SECURITY & INTEGRITY: P2 REVIEW HELPFUL VOTING & ENTROPY HARDENING
-- File: bisnis/teestock/database/patch_review_votes_entropy.sql
-- ==============================================================================

-- 1. Buat Tabel ts_review_votes (1-Vote-Per-Identity Constraint)
CREATE TABLE IF NOT EXISTS public.ts_review_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES public.ts_reviews(id) ON DELETE CASCADE,
    voter_identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_review_voter UNIQUE(review_id, voter_identifier)
);

-- Indeks untuk pencarian cepat berdasarkan review_id
CREATE INDEX IF NOT EXISTS idx_ts_review_votes_review_id ON public.ts_review_votes(review_id);

-- Aktifkan RLS
ALTER TABLE public.ts_review_votes ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS: Publik & Member hanya boleh membaca riwayat vote
DROP POLICY IF EXISTS "Allow anon and auth read on ts_review_votes" ON public.ts_review_votes;
CREATE POLICY "Allow anon and auth read on ts_review_votes"
    ON public.ts_review_votes
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

-- 2. Fungsi Atomik vote_review_helpful dengan Idempotency 1-Vote-Per-Identity
CREATE OR REPLACE FUNCTION public.vote_review_helpful(
    p_review_id UUID,
    p_voter_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean_voter TEXT;
    v_inserted BOOLEAN := FALSE;
    v_new_count INTEGER;
BEGIN
    v_clean_voter := TRIM(COALESCE(p_voter_id, ''));
    
    -- Validasi identitas voter minimal 3 karakter untuk mencegah voting string kosong
    IF length(v_clean_voter) < 3 THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Identitas voter tidak valid (minimal 3 karakter)'
        );
    END IF;

    -- Pastikan ulasan sasaran ada
    IF NOT EXISTS (SELECT 1 FROM public.ts_reviews WHERE id = p_review_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Ulasan tidak ditemukan'
        );
    END IF;

    -- Insert vote baru; jika sudah ada pasangan (review_id, voter_identifier), skip
    INSERT INTO public.ts_review_votes (review_id, voter_identifier)
    VALUES (p_review_id, v_clean_voter)
    ON CONFLICT (review_id, voter_identifier) DO NOTHING
    RETURNING true INTO v_inserted;

    -- Hanya naikkan counter jika baris baru berhasil di-insert
    IF v_inserted IS TRUE THEN
        UPDATE public.ts_reviews
        SET helpful_count = COALESCE(helpful_count, 0) + 1
        WHERE id = p_review_id
        RETURNING helpful_count INTO v_new_count;

        RETURN jsonb_build_object(
            'success', true,
            'voted', true,
            'helpful_count', v_new_count
        );
    ELSE
        -- Pengguna sudah pernah vote ulasan ini sebelumnya
        SELECT COALESCE(helpful_count, 0) INTO v_new_count
        FROM public.ts_reviews
        WHERE id = p_review_id;

        RETURN jsonb_build_object(
            'success', true,
            'voted', false,
            'helpful_count', v_new_count,
            'message', 'Sudah pernah memberikan suara membantu'
        );
    END IF;
END;
$$;

-- 3. Kunci RPC Lama increment_review_helpful dari Publik (Hanya Service Role)
REVOKE ALL ON FUNCTION public.increment_review_helpful(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_review_helpful(UUID) TO service_role;

-- 4. Izinkan Publik & Member Mengeksekusi vote_review_helpful yang Berpagar
GRANT EXECUTE ON FUNCTION public.vote_review_helpful(UUID, TEXT) TO anon, authenticated, service_role;
