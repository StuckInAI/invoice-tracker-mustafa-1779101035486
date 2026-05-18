import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useAts();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
