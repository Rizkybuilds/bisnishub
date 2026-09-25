import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session.server';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Masuk — MultiGraph Business OS',
  description: 'Login ke MultiGraph Business OS Command Center',
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <small
            style={{
              color: '#38bdf8',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            MULTIGRAPH GROUP HOLDING
          </small>
          <h1
            style={{
              fontSize: '1.75rem',
              marginTop: '8px',
              marginBottom: '4px',
            }}
          >
            MultiGraph Business OS
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              margin: '0 0 24px',
            }}
          >
            Akses Founder &amp; Executive Command Center
          </p>
        </header>

        <LoginForm />

        <footer
          style={{
            marginTop: '28px',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          <p style={{ margin: 0 }}>
            Akun lokal bawaan seed: <code>founder@multigraph.id</code>
          </p>
        </footer>
      </div>
    </div>
  );
}
