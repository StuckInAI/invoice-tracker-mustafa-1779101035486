import { useState, useEffect, type ReactNode } from 'react';
import type {
  Candidate,
  CustomFieldDef,
  CustomFieldValue,
  EmailLog,
  InterviewNote,
  Job,
  Note,
  StageName,
  StageHistoryEntry,
  User,
} from '@/types';
import { AtsContext, type AtsStore } from '@/hooks/useAtsStore';
import { loadState, saveState } from '@/lib/storage';
import { generateSeedData } from '@/lib/seed';
import { nanoid } from '@/lib/id';

const STORAGE_KEY = 'ats_state_v2';

interface PersistedState {
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  customFields: CustomFieldDef[];
}

function getInitial(): PersistedState {
  const saved = loadState<PersistedState>(STORAGE_KEY);
  if (saved) return saved;
  return generateSeedData();
}

export default function AtsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(getInitial);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const id = sessionStorage.getItem('ats_user_id');
    if (!id) return null;
    const s = loadState<PersistedState>(STORAGE_KEY);
    return s?.users.find((u) => u.id === id) ?? null;
  });

  useEffect(() => {
    saveState(STORAGE_KEY, state);
  }, [state]);

  const login = (email: string, password: string): boolean => {
    const user = state.users.find(
      (x) => x.email.toLowerCase() === email.toLowerCase() && x.active && (x.password ?? 'password') === password,
    );
    if (!user) return false;
    setCurrentUser(user);
    sessionStorage.setItem('ats_user_id', user.id);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('ats_user_id');
  };

  const addUser = (u: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = { ...u, id: nanoid(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, users: [...s.users, user] }));
  };

  const toggleUserActive = (id: string) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)),
    }));
  };

  const addJob = (j: Omit<Job, 'id' | 'createdAt'>): Job => {
    const job: Job = { ...j, id: nanoid(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, jobs: [...s.jobs, job] }));
    return job;
  };

  const updateJob = (id: string, patch: Partial<Job>) => {
    setState((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) }));
  };

  const deleteJob = (id: string) => {
    setState((s) => ({ ...s, jobs: s.jobs.filter((j) => j.id !== id) }));
  };

  const addCandidate = (
    c: Omit<Candidate, 'id' | 'createdAt' | 'stageHistory' | 'notes' | 'emails' | 'documents'> & { documents?: Candidate['documents'] },
  ): Candidate => {
    const now = new Date().toISOString();
    const candidate: Candidate = {
      ...c,
      id: nanoid(),
      createdAt: now,
      documents: c.documents ?? [],
      notes: [],
      emails: [],
      stageHistory: [{ stage: c.stage, timestamp: now, changedBy: currentUser?.name ?? 'System' }],
    };
    setState((s) => ({ ...s, candidates: [...s.candidates, candidate] }));
    return candidate;
  };

  const updateCandidate = (id: string, patch: Partial<Candidate>) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  const moveCandidateStage = (id: string, stage: StageName) => {
    const now = new Date().toISOString();
    const entry: StageHistoryEntry = { stage, timestamp: now, changedBy: currentUser?.name ?? 'System' };
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id
          ? { ...c, stage, stageHistory: [...c.stageHistory, entry] }
          : c,
      ),
    }));
  };

  const addCandidateNote = (id: string, content: string) => {
    const note: Note = {
      id: nanoid(),
      content,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name ?? 'System',
    };
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id ? { ...c, notes: [...c.notes, note] } : c,
      ),
    }));
  };

  const addCandidateEmail = (id: string, email: Omit<EmailLog, 'id' | 'sentAt' | 'sentBy'>) => {
    const log: EmailLog = {
      ...email,
      id: nanoid(),
      sentAt: new Date().toISOString(),
      sentBy: currentUser?.name ?? 'System',
    };
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id ? { ...c, emails: [...c.emails, log] } : c,
      ),
    }));
  };

  const addCustomField = (f: Omit<CustomFieldDef, 'id'>) => {
    const field: CustomFieldDef = { ...f, id: nanoid() };
    setState((s) => ({ ...s, customFields: [...s.customFields, field] }));
  };

  const deleteCustomField = (id: string) => {
    setState((s) => ({ ...s, customFields: s.customFields.filter((f) => f.id !== id) }));
  };

  const importCandidates = (
    rows: Array<{ name: string; email: string; phone: string; jobTitle: string; stage: string }>,
  ): { imported: number; skipped: number; errors: string[] } => {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    const now = new Date().toISOString();

    const newCandidates: Candidate[] = [];
    for (const row of rows) {
      if (!row.name || !row.email) {
        skipped++;
        errors.push(`Skipped row: missing name or email`);
        continue;
      }
      const exists = state.candidates.some((c) => c.email.toLowerCase() === row.email.toLowerCase());
      if (exists) {
        skipped++;
        errors.push(`Skipped ${row.email}: already exists`);
        continue;
      }
      const stage = (row.stage as StageName) || 'Applied';
      const candidate: Candidate = {
        id: nanoid(),
        name: row.name,
        email: row.email,
        phone: row.phone ?? '',
        jobTitle: row.jobTitle ?? '',
        jobId: '',
        stage,
        createdAt: now,
        notes: [],
        emails: [],
        documents: [],
        stageHistory: [{ stage, timestamp: now, changedBy: 'CSV Import' }],
      };
      newCandidates.push(candidate);
      imported++;
    }

    if (newCandidates.length > 0) {
      setState((s) => ({ ...s, candidates: [...s.candidates, ...newCandidates] }));
    }

    return { imported, skipped, errors };
  };

  const store: AtsStore = {
    currentUser,
    users: state.users,
    jobs: state.jobs,
    candidates: state.candidates,
    customFields: state.customFields,
    login,
    logout,
    addUser,
    toggleUserActive,
    addJob,
    updateJob,
    deleteJob,
    addCandidate,
    updateCandidate,
    moveCandidateStage,
    addCandidateNote,
    addCandidateEmail,
    addCustomField,
    deleteCustomField,
    importCandidates,
  };

  return <AtsContext.Provider value={store}>{children}</AtsContext.Provider>;
}
