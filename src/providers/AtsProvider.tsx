import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AtsContext } from '@/hooks/useAtsStore';
import type { AtsStore } from '@/hooks/useAtsStore';
import type {
  Candidate,
  CustomFieldDef,
  EmailLog,
  Job,
  Note,
  StageName,
  StageHistoryEntry,
  User,
} from '@/types';
import { generateId } from '@/lib/id';
import { loadState, saveState } from '@/lib/storage';
import { SEED_STATE } from '@/lib/seed';
import { STAGE_ORDER } from '@/lib/pipeline';

type State = {
  candidates: Candidate[];
  currentUserId: string | null;
  users: User[];
  jobs: Job[];
  customFields: CustomFieldDef[];
};

const STORAGE_KEY = 'ats_state';

function initState(): State {
  const saved = loadState<State>(STORAGE_KEY);
  if (saved) return saved;
  return SEED_STATE;
}

export default function AtsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initState);

  useEffect(() => {
    saveState(STORAGE_KEY, state);
  }, [state]);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null;

  const login = useCallback((email: string, password: string): boolean => {
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.active,
    );
    if (!user) return false;
    setState((s) => ({ ...s, currentUserId: user.id }));
    return true;
  }, [state.users]);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: null }));
  }, []);

  const addUser = useCallback((u: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...u,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, users: [...s.users, newUser] }));
  }, []);

  const toggleUserActive = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)),
    }));
  }, []);

  const addJob = useCallback((j: Omit<Job, 'id' | 'createdAt'>): Job => {
    const newJob: Job = { ...j, id: generateId(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, jobs: [...s.jobs, newJob] }));
    return newJob;
  }, []);

  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setState((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) }));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setState((s) => ({ ...s, jobs: s.jobs.filter((j) => j.id !== id) }));
  }, []);

  const addCandidate = useCallback(
    (c: Omit<Candidate, 'id' | 'createdAt' | 'stageHistory' | 'notes' | 'emails' | 'documents'> & { documents?: Candidate['documents'] }): Candidate => {
      const now = new Date().toISOString();
      const newCandidate: Candidate = {
        ...c,
        id: generateId(),
        createdAt: now,
        notes: [],
        emails: [],
        documents: c.documents ?? [],
        customFields: c.customFields ?? {},
        stageHistory: [{ stage: c.stage, movedAt: now, movedBy: 'system' }],
      };
      setState((s) => ({ ...s, candidates: [...s.candidates, newCandidate] }));
      return newCandidate;
    },
    [],
  );

  const updateCandidate = useCallback((id: string, patch: Partial<Candidate>) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const moveCandidateStage = useCallback((id: string, stage: StageName) => {
    const now = new Date().toISOString();
    const movedBy = state.currentUserId ?? 'system';
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id
          ? {
              ...c,
              stage,
              stageHistory: [
                ...c.stageHistory,
                { stage, movedAt: now, movedBy } as StageHistoryEntry,
              ],
            }
          : c,
      ),
    }));
  }, [state.currentUserId]);

  const addCandidateNote = useCallback((id: string, content: string) => {
    const note: Note = {
      id: generateId(),
      content,
      createdAt: new Date().toISOString(),
      createdBy: state.currentUserId ?? '',
    };
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id ? { ...c, notes: [...c.notes, note] } : c,
      ),
    }));
  }, [state.currentUserId]);

  const addCandidateEmail = useCallback(
    (id: string, email: Omit<EmailLog, 'id' | 'sentAt' | 'sentBy'>) => {
      const log: EmailLog = {
        ...email,
        id: generateId(),
        sentAt: new Date().toISOString(),
        sentBy: state.currentUserId ?? '',
      };
      setState((s) => ({
        ...s,
        candidates: s.candidates.map((c) =>
          c.id === id ? { ...c, emails: [...c.emails, log] } : c,
        ),
      }));
    },
    [state.currentUserId],
  );

  const addCustomField = useCallback((f: Omit<CustomFieldDef, 'id'>) => {
    const field: CustomFieldDef = { ...f, id: generateId() };
    setState((s) => ({ ...s, customFields: [...s.customFields, field] }));
  }, []);

  const deleteCustomField = useCallback((id: string) => {
    setState((s) => ({ ...s, customFields: s.customFields.filter((f) => f.id !== id) }));
  }, []);

  const importCandidates = useCallback(
    (rows: Array<{ name: string; email: string; phone: string; jobTitle: string; stage: string }>) => {
      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];
      const now = new Date().toISOString();

      const newCandidates: Candidate[] = [];
      for (const row of rows) {
        const stage = STAGE_ORDER.includes(row.stage as StageName)
          ? (row.stage as StageName)
          : 'Applied';
        if (!row.name || !row.email) {
          skipped++;
          errors.push(`Row missing name or email: ${JSON.stringify(row)}`);
          continue;
        }
        newCandidates.push({
          id: generateId(),
          name: row.name,
          email: row.email,
          phone: row.phone ?? '',
          jobId: '',
          jobTitle: row.jobTitle ?? '',
          stage,
          tags: [],
          rating: 0,
          customFields: {},
          stageHistory: [{ stage, movedAt: now, movedBy: 'import' }],
          notes: [],
          emails: [],
          documents: [],
          createdAt: now,
        });
        imported++;
      }

      setState((s) => ({ ...s, candidates: [...s.candidates, ...newCandidates] }));
      return { imported, skipped, errors };
    },
    [],
  );

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
