import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      marginBottom: 24, gap: 16,
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}
