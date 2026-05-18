import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AtsContext } from '@/hooks/useAtsStore';
import type { AtsStore } from '@/hooks/useAtsStore';
import type { Candidate, CustomFieldDef, EmailLog, Job, StageName, User } from '@/types';
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

const STORAGE_KEY = 'ats_state_v1';

function getInitialState(): PersistedState {
  const saved = loadState<PersistedState>(STORAGE_KEY);
  if (saved) return saved;
  return {
    users: seedData.users,
    jobs: seedData.jobs,
    candidates: seedData.candidates,
    customFields: [],
    currentUserId: null,
  };
}

export default function AtsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(getInitialState);

  useEffect(() => {
    saveState(STORAGE_KEY, state);
  }, [state]);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null;

  const login = useCallback((email: string, password: string): boolean => {
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.active
    );
    if (!user) return false;
    setState((prev) => ({ ...prev, currentUserId: user.id }));
    return true;
  }, [state.users]);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, currentUserId: null }));
  }, []);

  const addUser = useCallback((u: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = { ...u, id: generateId(), createdAt: new Date().toISOString() };
    setState((prev) => ({ ...prev, users: [...prev.users, newUser] }));
  }, []);

  const toggleUserActive = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => u.id === id ? { ...u, active: !u.active } : u),
    }));
  }, []);

  const addJob = useCallback((j: Omit<Job, 'id' | 'createdAt'>): Job => {
    const newJob: Job = { ...j, id: generateId(), createdAt: new Date().toISOString() };
    setState((prev) => ({ ...prev, jobs: [...prev.jobs, newJob] }));
    return newJob;
  }, []);

  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) => j.id === id ? { ...j, ...patch } : j),
    }));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setState((prev) => ({ ...prev, jobs: prev.jobs.filter((j) => j.id !== id) }));
  }, []);

  const addCandidate = useCallback((
    c: Omit<Candidate, 'id' | 'createdAt' | 'stageHistory' | 'notes' | 'emails' | 'documents'> & { documents?: Candidate['documents'] }
  ): Candidate => {
    const newCandidate: Candidate = {
      ...c,
      id: generateId(),
      createdAt: new Date().toISOString(),
      stageHistory: [{ stage: c.stage, movedAt: new Date().toISOString() }],
      notes: [],
      emails: [],
      documents: c.documents ?? [],
    };
    setState((prev) => ({ ...prev, candidates: [...prev.candidates, newCandidate] }));
    return newCandidate;
  }, []);

  const updateCandidate = useCallback((id: string, patch: Partial<Candidate>) => {
    setState((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) => c.id === id ? { ...c, ...patch } : c),
    }));
  }, []);

  const moveCandidateStage = useCallback((id: string, stage: StageName) => {
    setState((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) =>
        c.id === id
          ? {
              ...c,
              stage,
              stageHistory: [...c.stageHistory, { stage, movedAt: new Date().toISOString() }],
            }
          : c
      ),
    }));
  }, []);

  const addCandidateNote = useCallback((id: string, content: string) => {
    setState((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) =>
        c.id === id
          ? { ...c, notes: [...c.notes, { id: generateId(), content, createdAt: new Date().toISOString() }] }
          : c
      ),
    }));
  }, []);

  const addCandidateEmail = useCallback((id: string, email: Omit<EmailLog, 'id' | 'sentAt' | 'sentBy'>) => {
    setState((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) =>
        c.id === id
          ? {
              ...c,
              emails: [
                ...c.emails,
                { ...email, id: generateId(), sentAt: new Date().toISOString() },
              ],
            }
          : c
      ),
    }));
  }, []);

  const addCustomField = useCallback((f: Omit<CustomFieldDef, 'id'>) => {
    const newField: CustomFieldDef = { ...f, id: generateId() };
    setState((prev) => ({ ...prev, customFields: [...prev.customFields, newField] }));
  }, []);

  const deleteCustomField = useCallback((id: string) => {
    setState((prev) => ({ ...prev, customFields: prev.customFields.filter((f) => f.id !== id) }));
  }, []);

  const importCandidates = useCallback((
    rows: Array<{ name: string; email: string; phone: string; jobTitle: string; stage: string }>
  ): { imported: number; skipped: number; errors: string[] } => {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    const newCandidates: Candidate[] = [];

    for (const row of rows) {
      if (!row.name || !row.email) {
        skipped++;
        errors.push(`Skipped row: missing name or email (${JSON.stringify(row)})`);
        continue;
      }
      const stage: StageName = (['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].includes(row.stage)
        ? row.stage
        : 'Applied') as StageName;
      const matchedJob = state.jobs.find((j) => j.title.toLowerCase() === row.jobTitle?.toLowerCase());
      newCandidates.push({
        id: generateId(),
        name: row.name,
        email: row.email,
        phone: row.phone || undefined,
        jobId: matchedJob?.id,
        stage,
        stageHistory: [{ stage, movedAt: new Date().toISOString() }],
        notes: [],
        emails: [],
        documents: [],
        createdAt: new Date().toISOString(),
      });
      imported++;
    }

    setState((prev) => ({ ...prev, candidates: [...prev.candidates, ...newCandidates] }));
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
