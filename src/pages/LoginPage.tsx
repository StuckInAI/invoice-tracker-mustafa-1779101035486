import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, currentUser } = useAts();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@talent.co');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) navigate('/dashboard', { replace: true });
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!login(email, password)) {
      setError('Invalid credentials or inactive account.');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBox}>
          <Building2 size={26} />
        </div>
        <h1 className={styles.title}>TalentATS</h1>
        <p className={styles.subtitle}>Sign in to your internal recruiter account</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign in
          </button>
        </form>
        <div className={styles.hint}>
          <strong>Demo accounts:</strong>
          <div>admin@talent.co / admin123</div>
          <div>riley@talent.co / recruiter123</div>
        </div>
      </div>
    </div>
  );
}
