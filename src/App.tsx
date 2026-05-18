import { Navigate, Route, Routes } from 'react-router-dom';
import AtsProvider from '@/providers/AtsProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import CandidatesPage from '@/pages/CandidatesPage';
import CandidateDetailPage from '@/pages/CandidateDetailPage';
import AddCandidatePage from '@/pages/AddCandidatePage';
import ImportCsvPage from '@/pages/ImportCsvPage';
import AdminPage from '@/pages/AdminPage';
import PublicApplyPage from '@/pages/PublicApplyPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <AtsProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/apply/:jobId" element={<PublicApplyPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidates/new" element={<AddCandidatePage />} />
          <Route path="/candidates/import" element={<ImportCsvPage />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AtsProvider>
  );
}
