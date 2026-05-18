import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AtsContext } from '@/hooks/useAtsStore';
import type {
  Candidate,
  CustomFieldDef,
  EmailLog,
  Job,
  Note,
  StageName,
  User,
} from '@/types';
import { generateId as nanoid } from '@/lib/id';
import { loadState, saveState } from '@/lib/storage';
import { SEED_USERS, SEED_JOBS, buildSeedCandidates } from '@/lib/seed';

type State = {
  currentUserId: string | null;
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  customFields: CustomFieldDef[];
};

const STORAGE_KEY = 'ats_state';

function getInitial(): State {
  const saved = loadState<State>(STORAGE_KEY);
  if (saved) return saved;
  const jobs = SEED_JOBS;
  return {
    currentUserId: null,
    users: SEED_USERS,
    jobs,
    candidates: buildSeedCandidates(jobs),
    customFields: [],
  };
}

export default function AtsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(getInitial);

  useEffect(() => {
    saveState(STORAGE_KEY, state);
  }, [state]);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null;

  function login(email: string, password: string): boolean {
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password && u.active,
    );
    if (!user) return false;
    setState((s) => ({ ...s, currentUserId: user.id }));
    return true;
  }

  function logout() {
    setState((s) => ({ ...s, currentUserId: null }));
  }

  function addUser(u: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = { ...u, id: nanoid(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, users: [...s.users, newUser] }));
  }

  function toggleUserActive(id: string) {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)),
    }));
  }

  function addJob(j: Omit<Job, 'id' | 'createdAt'>): Job {
    const newJob: Job = { ...j, id: nanoid(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, jobs: [...s.jobs, newJob] }));
    return newJob;
  }

  function updateJob(id: string, patch: Partial<Job>) {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
    }));
  }

  function deleteJob(id: string) {
    setState((s) => ({ ...s, jobs: s.jobs.filter((j) => j.id !== id) }));
  }

  function addCandidate(
    c: Omit<Candidate, 'id' | 'createdAt' | 'stageHistory' | 'notes' | 'emails' | 'documents'> & {
      documents?: Candidate['documents'];
    },
  ): Candidate {
    const now = new Date().toISOString();
    const newCandidate: Candidate = {
      ...c,
      id: nanoid(),
      createdAt: now,
      stageHistory: [{ stage: c.stage, enteredAt: now }],
      notes: [],
      emails: [],
      documents: c.documents ?? [],
      customFields: c.customFields ?? [],
    };
    setState((s) => ({ ...s, candidates: [...s.candidates, newCandidate] }));
    return newCandidate;
  }

  function updateCandidate(id: string, patch: Partial<Candidate>) {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }

  function moveCandidateStage(id: string, stage: StageName) {
    const now = new Date().toISOString();
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id
          ? {
              ...c,
              stage,
              stageHistory: [...c.stageHistory, { stage, enteredAt: now }],
            }
          : c,
      ),
    }));
  }

  function addCandidateNote(id: string, content: string) {
    const note: Note = {
      id: nanoid(),
      content,
      authorId: state.currentUserId ?? '',
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id ? { ...c, notes: [...c.notes, note] } : c,
      ),
    }));
  }

  function addCandidateEmail(id: string, email: Omit<EmailLog, 'id' | 'sentAt' | 'sentBy'>) {
    const log: EmailLog = {
      ...email,
      id: nanoid(),
      sentAt: new Date().toISOString(),
      sentBy: state.currentUserId ?? '',
    };
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === id ? { ...c, emails: [...c.emails, log] } : c,
      ),
    }));
  }

  function addCustomField(f: Omit<CustomFieldDef, 'id'>) {
    const field: CustomFieldDef = { ...f, id: nanoid() };
    setState((s) => ({ ...s, customFields: [...s.customFields, field] }));
  }

  function deleteCustomField(id: string) {
    setState((s) => ({
      ...s,
      customFields: s.customFields.filter((f) => f.id !== id),
    }));
  }

  function importCandidates(
    rows: Array<{ name: string; email: string; phone: string; jobTitle: string; stage: string }>,
  ): { imported: number; skipped: number; errors: string[] } {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    const now = new Date().toISOString();
    const newCandidates: Candidate[] = [];

    for (const row of rows) {
      if (!row.name || !row.email) {
        skipped++;
        errors.push(`Row skipped: missing name or email (${JSON.stringify(row)})`);
        continue;
      }
      const job = state.jobs.find((j) => j.title.toLowerCase() === row.jobTitle?.toLowerCase());
      const jobId = job?.id ?? state.jobs[0]?.id ?? '';
      const validStages: StageName[] = [
        'Applied', 'Screening', 'Interview', 'Technical', 'Offer', 'Hired', 'Onboarded', 'Rejected',
      ];
      const stage: StageName = validStages.includes(row.stage as StageName)
        ? (row.stage as StageName)
        : 'Applied';
      newCandidates.push({
        id: nanoid(),
        name: row.name,
        email: row.email,
        phone: row.phone ?? '',
        linkedin: '',
        jobId,
        stage,
        source: 'Import',
        customFields: [],
        stageHistory: [{ stage, enteredAt: now }],
        notes: [],
        emails: [],
        documents: [],
        createdAt: now,
      });
      imported++;
    }

    setState((s) => ({ ...s, candidates: [...s.candidates, ...newCandidates] }));
    return { imported, skipped, errors };
  }

  const store = {
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
