import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';

export default function Topbar() {
  const { logout, currentUser } = useAts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: 56,
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 24px',
      gap: 8,
      flexShrink: 0,
    }}>
      <button
        style={{
          background: 'transparent', border: 'none',
          color: 'var(--color-text-muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', padding: 6, borderRadius: 6,
        }}
        title="Notifications"
      >
        <Bell size={18} />
      </button>
      <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{currentUser?.email}</span>
      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 6,
          border: '1px solid var(--color-border)',
          background: 'transparent',
          fontSize: 13, color: 'var(--color-text-muted)',
          cursor: 'pointer',
        }}
      >
        <LogOut size={14} /> Sign out
      </button>
    </header>
  );
}
