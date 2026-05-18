import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
    }}>
      {icon && <div style={{ marginBottom: 12, color: 'var(--color-text-muted)', opacity: 0.5 }}>{icon}</div>}
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      {description && <p style={{ color: 'var(--color-text-muted)', fontSize: 13, maxWidth: 320 }}>{description}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
