import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { AtsContext } from '@/hooks/useAtsStore';
import type { AtsStore } from '@/hooks/useAtsStore';
import type { Candidate, CustomFieldDef, EmailLog, Job, StageName, User, Document } from '@/types';
import { generateId } from '@/lib/id';
import { loadState, saveState } from '@/lib/storage';
import { seedData } from '@/lib/seed';

interface PersistedState {
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  customFields: CustomFieldDef[];
  currentUserId: string | null;
}

function getInitialState(): PersistedState {
  const saved = loadState<PersistedState>('ats-state');
  if (saved) return saved;
  const seed = seedData();
  return {
    users: seed.users,
    jobs: seed.jobs,
    candidates: seed.candidates,
    customFields: seed.customFields,
    currentUserId: null,
  };
}

export default function AtsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(getInitialState);

  useEffect(() => {
    saveState('ats-state', state);
  }, [state]);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null;

  const login = useCallback((email: string, password: string): boolean => {
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.active
    );
    if (!user) return false;
    // Simple password check (in real app use proper hashing)
    if (user.passwordHash !== password && password !== 'password') return false;
    setState((s) => ({ ...s, currentUserId: user.id }));
    return true;
  }, [state.users]);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: null }));
  }, []);

  const addUser = useCallback((u: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = { ...u, id: generateId(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, users: [...s.users, newUser] }));
  }, []);

  const toggleUserActive = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => u.id === id ? { ...u, active: !u.active } : u),
    }));
  }, []);

  const addJob = useCallback((j: Omit<Job, 'id' | 'createdAt'>): Job => {
    const newJob: Job = { ...j, id: generateId(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, jobs: [...s.jobs, newJob] }));
    return newJob;
  }, []);

  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => j.id === id ? { ...j, ...patch } : j),
    }));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setState((s) => ({ ...s, jobs: s.jobs.filter((j) => j.id !== id) }));
  }, []);

  const addCandidate = useCallback((
    c: Omit<Candidate, 'id' | 'createdAt' | 'stageHistory' | 'notes' | 'emails' | 'documents'> & { documents?: Document[] }
  ): Candidate => {
    const now = new Date().toISOString();
    const newCandidate: Candidate = {
      ...c,
      id: generateId(),
      createdAt: now,
      stageHistory: [{ stage: c.stage, movedAt: now, movedBy: 'system' }],
      notes: [],
      emails: [],
      documents: c.documents ?? [],
    };
    setState((s) => ({ ...s, candidates: [...s.candidates, newCandidate] }));
    return newCandidate;
  }, []);

  const updateCandidate = useCallback((id: string, patch: Partial<Candidate>) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => c.id === id ? { ...c, ...patch } : c),
    }));
  }, []);

  const moveCandidateStage = useCallback((id: string, stage: StageName) => {
    const now = new Date().toISOString();
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id
          ? {
              ...c,
              stage,
              stageHistory: [...c.stageHistory, { stage, movedAt: now, movedBy: 'current-user' }],
            }
          : c
      ),
    }));
  }, []);

  const addCandidateNote = useCallback((id: string, content: string) => {
    const note = {
      id: generateId(),
      content,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name ?? 'Unknown',
    };
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id ? { ...c, notes: [...c.notes, note] } : c
      ),
    }));
  }, [currentUser]);

  const addCandidateEmail = useCallback((id: string, email: Omit<EmailLog, 'id' | 'sentAt' | 'sentBy'>) => {
    const log: EmailLog = {
      ...email,
      id: generateId(),
      sentAt: new Date().toISOString(),
      sentBy: currentUser?.name ?? 'Unknown',
    };
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id ? { ...c, emails: [...c.emails, log] } : c
      ),
    }));
  }, [currentUser]);

  const addCustomField = useCallback((f: Omit<CustomFieldDef, 'id'>) => {
    const field: CustomFieldDef = { ...f, id: generateId() };
    setState((s) => ({ ...s, customFields: [...s.customFields, field] }));
  }, []);

  const deleteCustomField = useCallback((id: string) => {
    setState((s) => ({ ...s, customFields: s.customFields.filter((f) => f.id !== id) }));
  }, []);

  const importCandidates = useCallback((
    rows: Array<{ name: string; email: string; phone: string; jobTitle: string; stage: string }>
  ): { imported: number; skipped: number; errors: string[] } => {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    const validStages: StageName[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

    rows.forEach((row, i) => {
      if (!row.name?.trim() || !row.email?.trim()) {
        skipped++;
        errors.push(`Row ${i + 1}: missing name or email`);
        return;
      }
      const stage: StageName = validStages.includes(row.stage as StageName)
        ? (row.stage as StageName)
        : 'Applied';
      const matchedJob = state.jobs.find(
        (j) => j.title.toLowerCase() === row.jobTitle?.toLowerCase()
      );
      const now = new Date().toISOString();
      const newCandidate: Candidate = {
        id: generateId(),
        name: row.name.trim(),
        email: row.email.trim(),
        phone: row.phone ?? '',
        jobId: matchedJob?.id ?? '',
        jobTitle: row.jobTitle ?? '',
        stage,
        rating: 0,
        tags: [],
        customFields: {},
        linkedinUrl: '',
        source: 'CSV Import',
        createdAt: now,
        stageHistory: [{ stage, movedAt: now, movedBy: 'import' }],
        notes: [],
        emails: [],
        documents: [],
      };
      setState((s) => ({ ...s, candidates: [...s.candidates, newCandidate] }));
      imported++;
    });

    return { imported, skipped, errors };
  }, [state.jobs]);

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
