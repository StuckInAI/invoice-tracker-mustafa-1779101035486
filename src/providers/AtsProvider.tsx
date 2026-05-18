import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Candidate,
  CustomFieldDef,
  EmailLog,
  Job,
  Session,
  StageName,
  User,
} from '@/types';
import { AtsContext } from '@/hooks/useAtsStore';
import type { AtsStore } from '@/hooks/useAtsStore';
import { loadFromStorage, saveToStorage, removeFromStorage } from '@/lib/storage';
import { uid } from '@/lib/id';
import {
  SEED_CANDIDATES,
  SEED_CUSTOM_FIELDS,
  SEED_JOBS,
  SEED_USERS,
} from '@/lib/seed';

type Props = { children: ReactNode };

export default function AtsProvider({ children }: Props) {
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage<User[]>('users', SEED_USERS),
  );
  const [jobs, setJobs] = useState<Job[]>(() =>
    loadFromStorage<Job[]>('jobs', SEED_JOBS),
  );
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    loadFromStorage<Candidate[]>('candidates', SEED_CANDIDATES),
  );
  const [customFields, setCustomFields] = useState<CustomFieldDef[]>(() =>
    loadFromStorage<CustomFieldDef[]>('customFields', SEED_CUSTOM_FIELDS),
  );
  const [session, setSession] = useState<Session | null>(() =>
    loadFromStorage<Session | null>('session', null),
  );

  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => saveToStorage('jobs', jobs), [jobs]);
  useEffect(() => saveToStorage('candidates', candidates), [candidates]);
  useEffect(() => saveToStorage('customFields', customFields), [customFields]);
  useEffect(() => {
    if (session) saveToStorage('session', session);
    else removeFromStorage('session');
  }, [session]);

  const currentUser = useMemo<User | null>(
    () => (session ? users.find((u) => u.id === session.userId) ?? null : null),
    [session, users],
  );

  const login = useCallback(
    (email: string, password: string): boolean => {
      const u = users.find(
        (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password && x.active,
      );
      if (!u) return false;
      setSession({ userId: u.id });
      return true;
    },
    [users],
  );

  const logout = useCallback(() => setSession(null), []);

  const addUser = useCallback((u: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = { ...u, id: uid('user'), createdAt: new Date().toISOString() };
    setUsers((prev) => [...prev, newUser]);
  }, []);

  const toggleUserActive = useCallback((id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  }, []);

  const addJob = useCallback((j: Omit<Job, 'id' | 'createdAt'>): Job => {
    const job: Job = { ...j, id: uid('job'), createdAt: new Date().toISOString() };
    setJobs((prev) => [job, ...prev]);
    return job;
  }, []);

  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setCandidates((prev) => prev.filter((c) => c.jobId !== id));
  }, []);

  const addCandidate = useCallback<AtsStore['addCandidate']>((c) => {
    const now = new Date().toISOString();
    const cand: Candidate = {
      ...c,
      id: uid('cand'),
      createdAt: now,
      documents: c.documents ?? [],
      stageHistory: [{ stage: c.stage, changedAt: now, changedBy: 'System' }],
      notes: [],
      emails: [],
    };
    setCandidates((prev) => [cand, ...prev]);
    return cand;
  }, []);

  const updateCandidate = useCallback((id: string, patch: Partial<Candidate>) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const moveCandidateStage = useCallback(
    (id: string, stage: StageName) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          if (c.stage === stage) return c;
          const entry = {
            stage,
            changedAt: new Date().toISOString(),
            changedBy: currentUser?.name ?? 'System',
          };
          return { ...c, stage, stageHistory: [...c.stageHistory, entry] };
        }),
      );
    },
    [currentUser],
  );

  const addCandidateNote = useCallback(
    (id: string, content: string) => {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                notes: [
                  ...c.notes,
                  {
                    id: uid('note'),
                    authorId: currentUser?.id ?? 'unknown',
                    authorName: currentUser?.name ?? 'Unknown',
                    content,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : c,
        ),
      );
    },
    [currentUser],
  );

  const addCandidateEmail = useCallback(
    (id: string, email: Omit<EmailLog, 'id' | 'sentAt' | 'sentBy'>) => {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                emails: [
                  ...c.emails,
                  {
                    ...email,
                    id: uid('email'),
                    sentAt: new Date().toISOString(),
                    sentBy: currentUser?.name ?? 'System',
                  },
                ],
              }
            : c,
        ),
      );
    },
    [currentUser],
  );

  const addCustomField = useCallback((f: Omit<CustomFieldDef, 'id'>) => {
    setCustomFields((prev) => [...prev, { ...f, id: uid('cf') }]);
  }, []);

  const deleteCustomField = useCallback((id: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const importCandidates = useCallback<AtsStore['importCandidates']>(
    (rows) => {
      const errors: string[] = [];
      let imported = 0;
      let skipped = 0;
      const validStages: StageName[] = ['Applied', 'Screening', 'Interviews', 'Offer', 'Hired', 'Rejected', 'Onboarded'];
      setCandidates((prev) => {
        const next = [...prev];
        const existingEmails = new Set(next.map((c) => c.email.toLowerCase()));
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
          if (!job) {
            errors.push(`Row ${idx + 1}: unknown job title "${row.jobTitle}"`);
            skipped++;
            return;
          }
          const stage = (validStages.includes(row.stage as StageName) ? row.stage : 'Applied') as StageName;
          const now = new Date().toISOString();
          next.unshift({
            id: uid('cand'),
            jobId: job.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            linkedin: '',
            source: 'CSV Import',
            stage,
            customFields: {},
            documents: [],
            stageHistory: [{ stage, changedAt: now, changedBy: 'CSV Import' }],
            notes: [],
            emails: [],
            createdAt: now,
          });
          existingEmails.add(row.email.toLowerCase());
          imported++;
        });
        return next;
      });
      return { imported, skipped, errors };
    },
    [jobs],
  );

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
