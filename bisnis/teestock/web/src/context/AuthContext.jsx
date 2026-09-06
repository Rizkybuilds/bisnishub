import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

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

    try {
      const { data, error } = await supabase
        .from('ts_user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
        return data;
      }

      // Jika data profil belum ada di DB (misal trigger belum dibuat di Supabase), buat profil default
      const currentUser = currentSession?.user;
      const defaultProfile = {
        id: userId,
        full_name: currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'Member',
        role: currentUser?.email?.toLowerCase().includes('admin') ? 'admin' : 'member',
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
        role: currentSession?.user?.email?.toLowerCase().includes('admin') ? 'admin' : 'member',
      };
      setProfile(fallback);
      return fallback;
    }
  }, []);

  useEffect(() => {
    // 1. Cek active session saat pertama kali mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id, currentSession).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Dengarkan perubahan state auth (login, logout, refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id, newSession);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
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
   * Perbarui data profil pengguna
   */
  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('User belum login') };

    try {
      const { data, error } = await supabase
        .from('ts_user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
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
  const currentRole = profile?.role || (user ? 'member' : 'visitor');
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
