import { createContext, useContext } from 'react';
import type {
  Candidate,
  CustomFieldDef,
  EmailLog,
  Job,
  StageName,
  User,
} from '@/types';

export type AtsStore = {
  currentUser: User | null;
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  customFields: CustomFieldDef[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (u: Omit<User, 'id' | 'createdAt'>) => void;
  toggleUserActive: (id: string) => void;
  addJob: (j: Omit<Job, 'id' | 'createdAt'>) => Job;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addCandidate: (c: Omit<Candidate, 'id' | 'createdAt' | 'stageHistory' | 'notes' | 'emails' | 'documents'> & { documents?: Candidate['documents'] }) => Candidate;
  updateCandidate: (id: string, patch: Partial<Candidate>) => void;
  moveCandidateStage: (id: string, stage: StageName) => void;
  addCandidateNote: (id: string, content: string) => void;
  addCandidateEmail: (id: string, email: Omit<EmailLog, 'id' | 'sentAt' | 'sentBy'>) => void;
  addCustomField: (f: Omit<CustomFieldDef, 'id'>) => void;
  deleteCustomField: (id: string) => void;
  importCandidates: (rows: Array<{ name: string; email: string; phone: string; jobTitle: string; stage: string }>) => { imported: number; skipped: number; errors: string[] };
};

export const AtsContext = createContext<AtsStore | null>(null);

export function useAts(): AtsStore {
  const ctx = useContext(AtsContext);
  if (!ctx) throw new Error('useAts must be used within AtsProvider');
  return ctx;
}
