import type { SessionContext } from '@mgbos/domain';
import { loginSchema, type LoginInput } from '@mgbos/validation';

export const SESSION_COOKIE_NAME = 'mgbos_session' as const;
export const ACTIVE_BRAND_COOKIE_NAME = 'mgbos_active_brand' as const;

export interface AuthSuccess {
  success: true;
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface AuthFailure {
  success: false;
  error: string;
}

export type AuthResult = AuthSuccess | AuthFailure;

export interface AuthClientConfig {
  supabaseUrl: string;
  publishableKey: string;
}

export async function authenticateWithPassword(
  credentials: LoginInput,
  config: AuthClientConfig,
): Promise<AuthResult> {
  const validated = loginSchema.safeParse(credentials);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message ?? 'Invalid credentials format',
    };
  }

  const endpoint = `${config.supabaseUrl.replace(/\/+$/, '')}/auth/v1/token?grant_type=password`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: config.publishableKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validated.data.email,
        password: validated.data.password,
      }),
    });

    const data = (await response.json()) as {
      access_token?: string;
      user?: { id: string; email: string };
      error_description?: string;
      msg?: string;
      message?: string;
    };

    if (!response.ok || !data.access_token || !data.user) {
      return {
        success: false,
        error:
          data.error_description ??
          data.msg ??
          data.message ??
          'Invalid email or password',
      };
    }

    return {
      success: true,
      accessToken: data.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Network error during authentication';
    return {
      success: false,
      error: message,
    };
  }
}

export async function verifySessionToken(
  token: string,
  config: AuthClientConfig,
): Promise<
  | { valid: true; user: { id: string; email: string } }
  | { valid: false; error: string }
> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Missing token' };
  }

  const endpoint = `${config.supabaseUrl.replace(/\/+$/, '')}/auth/v1/user`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { valid: false, error: 'Invalid or expired session' };
    }

    const data = (await response.json()) as { id: string; email: string };
    return {
      valid: true,
      user: {
        id: data.id,
        email: data.email,
      },
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Verification network error';
    return { valid: false, error: message };
  }
}

export type { SessionContext };
export * from './permissions';
