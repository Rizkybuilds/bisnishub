'use client';

import { useActionState } from 'react';
import { handleLogin, type FormState } from './actions';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    handleLogin,
    {},
  );

  return (
    <form action={formAction}>
      {state?.error ? (
        <div className="error-banner" role="alert">
          {state.error}
        </div>
      ) : null}

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email Akun Founder
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue="founder@multigraph.id"
          className="form-input"
          placeholder="nama@multigraph.id"
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          defaultValue="mgbos-founder-2026"
          className="form-input"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
        style={{ width: '100%', marginTop: '8px' }}
      >
        {isPending ? 'Memverifikasi...' : 'Masuk ke MGBOS Command Center'}
      </button>
    </form>
  );
}
