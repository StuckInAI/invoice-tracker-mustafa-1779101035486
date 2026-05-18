import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';

type Props = { children: ReactNode; adminOnly?: boolean };

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { currentUser } = useAts();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== 'Admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
