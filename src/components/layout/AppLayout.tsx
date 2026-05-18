import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
