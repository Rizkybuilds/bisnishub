import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

// Whitelist resmi email admin TeeStock (dapat ditambahkan via VITE_ADMIN_EMAILS di .env)
const DEFAULT_ADMIN_EMAILS = [
  'admin@teestock.id',
  'teestock.apparel@gmail.com',
  'owner@teestock.id'
];

function getAdminEmails() {
  const envEmails = import.meta.env.VITE_ADMIN_EMAILS 
    ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) 
    : [];
  return [...new Set([...DEFAULT_ADMIN_EMAILS, ...envEmails])];
}

export function checkIsAdminEmail(email) {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return getAdminEmails().includes(clean);
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRedirect, setAuthModalRedirect] = useState(null);

  /**
   * Fetch atau inisialisasi profil pengguna dari tabel ts_user_profiles
   */
  const fetchProfile = useCallback(async (userId, currentSession) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    const currentUser = currentSession?.user;

    try {
      const { data, error } = await supabase
        .from('ts_user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const resolved = data;
        setProfile(resolved);
        return resolved;
      }

      // Clients can only create member profiles; administrators are assigned on the server.
      const defaultProfile = {
        id: userId,
        full_name: currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'Member',
        role: 'member',
        avatar_url: currentUser?.user_metadata?.avatar_url || currentUser?.user_metadata?.picture || null,
      };

      // Coba simpan ke database
      const { data: inserted } = await supabase
        .from('ts_user_profiles')
        .insert([defaultProfile])
        .select()
        .maybeSingle();

      const resolved = inserted || defaultProfile;
      setProfile(resolved);
      return resolved;
    } catch (err) {
      console.warn('Profile fetch notice:', err.message);
      // Fallback in-memory profile
      const fallback = {
        id: userId,
        full_name: currentSession?.user?.email?.split('@')[0] || 'Member',
        role: 'member',
      };
      setProfile(fallback);
      return fallback;
    }
  }, []);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const acceptSession = (currentSession) => {
      if (!active) return;
      const currentRevision = ++revision;
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setProfile(null);
      setLoading(!!currentUser);
      if (currentUser) {
        // Run outside Supabase's auth callback lock.
        setTimeout(() => {
          if (!active || revision !== currentRevision) return;
          fetchProfile(currentUser.id, currentSession).finally(() => {
            if (active && revision === currentRevision) setLoading(false);
          });
        }, 0);
      }
    };
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (revision === 0) acceptSession(error ? null : currentSession);
    }).catch(() => { if (revision === 0) acceptSession(null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => acceptSession(newSession)
    );
    return () => { active = false; revision++; subscription.unsubscribe(); };
  }, [fetchProfile]);

  /**
   * Login via Google OAuth (Frictionless untuk Member & Mitra)
   * @param {string} redirectTo - URL tujuan setelah berhasil login
   */
  const signInWithGoogle = async (redirectTo = window.location.href) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    return { data, error };
  };

  /**
   * Login via Magic Link Email (Tanpa Password)
   * @param {string} email - Email pengguna/admin
   * @param {string} redirectTo - URL redirect setelah link di klik
   */
  const signInWithMagicLink = async (email, redirectTo = `${window.location.origin}/admin`) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    return { data, error };
  };

  /**
   * Perbarui data profil pengguna (dengan sanitasi kolom)
   */
  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('User belum login') };

    // 🛡️ Whitelist kolom yang diizinkan untuk diubah oleh pengguna
    // Melarang keras injeksi kolom 'role', 'id', dll. dari browser klien
    const ALLOWED_COLUMNS = [
      'full_name',
      'phone',
      'default_address',
      'city',
      'province',
      'postal_code',
      'avatar_url'
    ];

    const sanitized = {};
    ALLOWED_COLUMNS.forEach(col => {
      if (updates[col] !== undefined) {
        sanitized[col] = updates[col];
      }
    });
    sanitized.updated_at = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from('ts_user_profiles')
        .update(sanitized)
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) {
        setProfile(prev => ({ ...prev, ...data }));
      }
      return { data, error };
    } catch (err) {
      return { error: err };
    }
  };

  /**
   * Logout
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    return { error };
  };

  // Helper roles
  const currentRole = user && session ? (profile?.id === user.id ? profile.role : 'member') : 'visitor';
  const isAdmin = currentRole === 'admin';
  const isPartner = currentRole === 'partner';
  const isMember = !!user;

  const openAuthModal = (redirectTo = null) => {
    setAuthModalRedirect(redirectTo);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalRedirect(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role: currentRole,
        isAdmin,
        isPartner,
        isMember,
        loading,
        isAuthenticated: !!session,
        isAuthModalOpen,
        authModalRedirect,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithMagicLink,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>');
  }
  return context;
}
