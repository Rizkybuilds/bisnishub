'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  authenticateWithPassword,
  SESSION_COOKIE_NAME,
  ACTIVE_BRAND_COOKIE_NAME,
} from '@mgbos/auth';
import { publicEnvironment } from '@/lib/env.client';

export interface FormState {
  error?: string;
}

export async function handleLogin(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Email and password are required' };
  }

  const supabaseUrl = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return {
      error: 'Supabase authentication service is not configured in environment',
    };
  }

  const result = await authenticateWithPassword(
    { email, password },
    { supabaseUrl, publishableKey },
  );

  if (!result.success) {
    return { error: result.error };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600 * 24, // 24 hours
  });

  if (!cookieStore.has(ACTIVE_BRAND_COOKIE_NAME)) {
    cookieStore.set(ACTIVE_BRAND_COOKIE_NAME, 'TS', {
      path: '/',
      sameSite: 'lax',
    });
  }

  redirect('/dashboard');
}

export async function handleLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/login');
}

export async function handleSwitchBrand(formData: FormData): Promise<void> {
  const brandCode = formData.get('brandCode');
  if (typeof brandCode === 'string') {
    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_BRAND_COOKIE_NAME, brandCode, {
      path: '/',
      sameSite: 'lax',
    });
  }
  redirect('/dashboard');
}
