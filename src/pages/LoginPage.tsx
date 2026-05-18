import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';

export default function LoginPage() {
  const { login, currentUser } = useAts();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@talent.co');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) navigate('/dashboard', { replace: true });
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (!login(email, password)) {
        setError('Invalid credentials or inactive account.');
        setLoading(false);
        return;
      }
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: 'white', borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        width: '100%', maxWidth: 400,
        padding: '40px 36px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'var(--color-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Building2 size={28} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>TalentATS</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Sign in to your recruiter account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-muted)' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '10px 12px 10px 34px',
                  border: '1px solid var(--color-border)', borderRadius: 8,
                  fontSize: 14, outline: 'none',
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-muted)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '10px 12px 10px 34px',
                  border: '1px solid var(--color-border)', borderRadius: 8,
                  fontSize: 14, outline: 'none',
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 14px',
              color: '#dc2626', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? '#a5b4fc' : 'var(--color-primary)',
              color: 'white', border: 'none', borderRadius: 8,
              fontWeight: 600, fontSize: 14, cursor: loading ? 'wait' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{
          marginTop: 24, padding: '14px 16px',
          background: '#f8fafc', borderRadius: 8, border: '1px solid var(--color-border)',
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>Demo accounts</p>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            <div><strong>Admin:</strong> admin@talent.co / admin123</div>
            <div><strong>Recruiter:</strong> riley@talent.co / recruiter123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
