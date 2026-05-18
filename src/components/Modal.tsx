import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
};

export default function Modal({ open, onClose, title, children, footer, width = 520 }: Props) {
  if (!open) return null;
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
