import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  Building2,
} from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { currentUser } = useAts();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Building2 size={20} />
        </div>
        <div>
          <div className={styles.brandName}>TalentATS</div>
          <div className={styles.brandSub}>Internal MVP</div>
        </div>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          <Briefcase size={16} /> Jobs
        </NavLink>
        <NavLink to="/candidates" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          <Users size={16} /> Candidates
        </NavLink>
        {currentUser?.role === 'Admin' && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            <Settings size={16} /> Admin
          </NavLink>
        )}
      </nav>
      <div className={styles.footer}>
        <div className={styles.userBlock}>
          <div className={styles.avatar}>{currentUser?.name.charAt(0) ?? '?'}</div>
          <div>
            <div className={styles.userName}>{currentUser?.name}</div>
            <div className={styles.userRole}>{currentUser?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
