import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 'var(--space-6)', textAlign: 'center' }}>
      <h1 style={{ fontSize: 48, marginBottom: 'var(--space-2)' }}>404</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn btn-primary">Go to dashboard</Link>
    </div>
  );
}
