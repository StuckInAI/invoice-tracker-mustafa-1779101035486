import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  Building2,
} from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';

const linkBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderRadius: 8,
  fontWeight: 500,
  fontSize: 13,
  color: 'var(--color-text-muted)',
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',
};

export default function Sidebar() {
  const { currentUser } = useAts();

  const getClass = (isActive: boolean): React.CSSProperties => ({
    ...linkBase,
    background: isActive ? 'var(--color-primary-soft)' : 'transparent',
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
  });

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'var(--color-primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Building2 size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>TalentATS</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Internal MVP</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NavLink to="/dashboard" style={({ isActive }) => getClass(isActive)}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/jobs" style={({ isActive }) => getClass(isActive)}>
          <Briefcase size={16} /> Jobs
        </NavLink>
        <NavLink to="/candidates" style={({ isActive }) => getClass(isActive)}>
          <Users size={16} /> Candidates
        </NavLink>
        {currentUser?.role === 'Admin' && (
          <NavLink to="/admin" style={({ isActive }) => getClass(isActive)}>
            <Settings size={16} /> Admin
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--color-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, fontSize: 13, flexShrink: 0,
          }}>
            {currentUser?.name.charAt(0) ?? '?'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{currentUser?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
