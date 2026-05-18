import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import styles from './Topbar.module.css';

export default function Topbar() {
  const { currentUser, logout } = useAts();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className={styles.topbar}>
      <div className={styles.title}>Welcome back, {currentUser?.name.split(' ')[0]}</div>
      <button className="btn btn-ghost" onClick={handleLogout}>
        <LogOut size={14} /> Sign out
      </button>
    </header>
  );
}
