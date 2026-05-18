import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AtsContext,
  type AtsStore,
} from '@/hooks/useAtsStore';
import type {
  Candidate,
  CustomFieldDef,
  EmailLog,
  InterviewNote,
  Job,
  StageHistoryEntry,
  StageName,
  User,
} from '@/types';
import { loadState, saveState } from '@/lib/storage';
import { seedData } from '@/lib/seed';
import { uid } from '@/lib/id';

type Persisted = {
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  customFields: CustomFieldDef[];
  currentUserId: string | null;
};

const STORAGE_KEY = 'ats-mvp-state-v1';

function initialState(): Persisted {
  const existing = loadState<Persisted>(STORAGE_KEY);
  if (existing) return existing;
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
  const init = useMemo(() => initialState(), []);
  const [users, setUsers] = useState<User[]>(init.users);
  const [jobs, setJobs] = useState<Job[]>(init.jobs);
  const [candidates, setCandidates] = useState<Candidate[]>(init.candidates);
  const [customFields, setCustomFields] = useState<CustomFieldDef[]>(init.customFields);
  const [currentUserId, setCurrentUserId] = useState<string | null>(init.currentUserId);

  useEffect(() => {
    saveState<Persisted>(STORAGE_KEY, {
      users,
      jobs,
      candidates,
      customFields,
      currentUserId,
    });
  }, [users, jobs, candidates, customFields, currentUserId]);

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? null,
    [users, currentUserId],
  );

  const login = useCallback(
    (email: string, password: string) => {
      const u = users.find(
        (x) => x.email.toLowerCase() === email.toLowerCase() && x.active && (x.password ?? 'password') === password,
      );
      if (u) {
        setCurrentUserId(u.id);
        return true;
      }
      return false;
    },
    [users],
  );

  const logout = useCallback(() => setCurrentUserId(null), []);

  const addUser: AtsStore['addUser'] = (u) => {
    setUsers((prev) => [
      ...prev,
      { ...u, id: uid('u'), createdAt: new Date().toISOString() },
    ]);
  };

  const toggleUserActive: AtsStore['toggleUserActive'] = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  const addJob: AtsStore['addJob'] = (j) => {
    const job: Job = { ...j, id: uid('j'), createdAt: new Date().toISOString() };
    setJobs((prev) => [job, ...prev]);
    return job;
  };

  const updateJob: AtsStore['updateJob'] = (id, patch) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  };

  const deleteJob: AtsStore['deleteJob'] = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const addCandidate: AtsStore['addCandidate'] = (c) => {
    const now = new Date().toISOString();
    const candidate: Candidate = {
      ...c,
      id: uid('c'),
      createdAt: now,
      stageHistory: [{ stage: c.stage, at: now, changedBy: 'System' }],
      notes: [],
      emails: [],
      documents: c.documents ?? [],
    };
    setCandidates((prev) => [candidate, ...prev]);
    return candidate;
  };

  const updateCandidate: AtsStore['updateCandidate'] = (id, patch) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const moveCandidateStage: AtsStore['moveCandidateStage'] = (id, stage) => {
    const now = new Date().toISOString();
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const entry: StageHistoryEntry = {
          stage,
          at: now,
          changedBy: currentUser?.name ?? 'System',
        };
        return { ...c, stage, stageHistory: [...c.stageHistory, entry] };
      }),
    );
  };

  const addCandidateNote: AtsStore['addCandidateNote'] = (id, content) => {
    const note: InterviewNote = {
      id: uid('n'),
      content,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name ?? 'System',
    };
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              notes: [note, ...c.notes],
            }
          : c,
      ),
    );
  };

  const addCandidateEmail: AtsStore['addCandidateEmail'] = (id, email) => {
    const log: EmailLog = {
      id: uid('e'),
      ...email,
      sentAt: new Date().toISOString(),
      sentBy: currentUser?.name ?? 'System',
    };
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, emails: [log, ...c.emails] } : c)),
    );
  };

  const addCustomField: AtsStore['addCustomField'] = (f) => {
    setCustomFields((prev) => [...prev, { ...f, id: uid('cf') }]);
  };

  const deleteCustomField: AtsStore['deleteCustomField'] = (id) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  };

  const importCandidates: AtsStore['importCandidates'] = (rows) => {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    const now = new Date().toISOString();
    const newCandidates: Candidate[] = [];
    const existingEmails = new Set(candidates.map((c) => c.email.toLowerCase()));
    const validStages: StageName[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

    rows.forEach((row, idx) => {
      if (!row.name || !row.email) {
        errors.push(`Row ${idx + 1}: missing name or email`);
        skipped++;
        return;
      }
      if (existingEmails.has(row.email.toLowerCase())) {
        errors.push(`Row ${idx + 1}: duplicate email ${row.email}`);
        skipped++;
        return;
      }
      const job = jobs.find((j) => j.title.toLowerCase() === row.jobTitle.toLowerCase());
      const stage = (validStages.includes(row.stage as StageName) ? row.stage : 'Applied') as StageName;
      newCandidates.push({
        id: uid('c'),
        name: row.name,
        email: row.email,
        phone: row.phone || undefined,
        jobId: job?.id,
        stage,
        documents: [],
        notes: [],
        emails: [],
        stageHistory: [{ stage, at: now, changedBy: 'CSV Import' }],
        createdAt: now,
      });
      existingEmails.add(row.email.toLowerCase());
      imported++;
    });

    if (newCandidates.length) {
      setCandidates((prev) => [...newCandidates, ...prev]);
    }
    return { imported, skipped, errors };
  };

  const value: AtsStore = {
    currentUser,
    users,
    jobs,
    candidates,
    customFields,
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

  return <AtsContext.Provider value={value}>{children}</AtsContext.Provider>;
}
