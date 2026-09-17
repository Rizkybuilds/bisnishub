import { supabase } from './supabase';

/**
 * Service untuk Newsletter & Lead Capture TeeStock (Tabel ts_subscribers)
 */
export async function subscribeNewsletter({ email, source = 'website_footer', utmSource = null, utmMedium = null, utmCampaign = null }) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Format email tidak valid.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const { data, error } = await supabase
      .from('ts_subscribers')
      .insert([
        {
          email: cleanEmail,
          source,
          utm_source: utmSource || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : null),
          utm_medium: utmMedium || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : null),
          utm_campaign: utmCampaign || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : null),
        },
      ])
      .select()
      .single();

    if (error) {
      // 23505 is PostgreSQL unique constraint violation (already subscribed)
      if (error.code === '23505') {
        return { 
          success: true, 
          alreadySubscribed: true, 
          message: 'Email kamu sudah terdaftar sebelumnya! Kamu tetap berhak atas info Drop & diskon perdana.' 
        };
      }
      console.warn('Supabase subscribe notice:', error.message);
      // Fallback local storage so user experience is not disrupted
      saveToLocalStorage(cleanEmail);
      return { 
        success: true, 
        message: 'Terima kasih! Email kamu berhasil didaftarkan untuk notifikasi Drop.' 
      };
    }

    saveToLocalStorage(cleanEmail);
    return { 
      success: true, 
      data, 
      message: 'Selamat datang di lingkaran TeeStock! Kode diskon 10% pertama kamu: WELCOME10' 
    };
  } catch (err) {
    console.error('Subscription error:', err);
    saveToLocalStorage(cleanEmail);
    return { 
      success: true, 
      message: 'Terima kasih telah bergabung! Kamu akan menerima notifikasi rilis Drop terbaru.' 
    };
  }
}

function saveToLocalStorage(email) {
  try {
    const existing = JSON.parse(localStorage.getItem('ts_subscribers') || '[]');
    if (!existing.includes(email)) {
      existing.push(email);
      localStorage.setItem('ts_subscribers', JSON.stringify(existing));
    }
  } catch (e) {
    // Ignore storage issues
  }
}
