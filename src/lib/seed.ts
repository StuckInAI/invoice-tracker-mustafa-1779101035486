import { generateId as nanoid } from '@/lib/id';
import type { User, Job, Candidate, StageHistoryEntry } from '@/types';

export const SEED_USERS: User[] = [
  {
    id: nanoid(),
    name: 'Alice Admin',
    email: 'admin@example.com',
    role: 'Admin',
    active: true,
    createdAt: new Date().toISOString(),
    passwordHash: 'admin123',
  },
  {
    id: nanoid(),
    name: 'Bob Recruiter',
    email: 'recruiter@example.com',
    role: 'Recruiter',
    active: true,
    createdAt: new Date().toISOString(),
    passwordHash: 'recruiter123',
  },
];

export const SEED_JOBS: Job[] = [
  {
    id: nanoid(),
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    status: 'Open',
    pipelineType: 'Engineering',
    description: 'Build beautiful UIs.',
    createdAt: new Date().toISOString(),
  },
  {
    id: nanoid(),
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    status: 'Open',
    pipelineType: 'Standard',
    description: 'Own the product roadmap.',
    createdAt: new Date().toISOString(),
  },
  {
    id: nanoid(),
    title: 'Data Analyst',
    department: 'Data',
    location: 'San Francisco, CA',
    status: 'Open',
    pipelineType: 'Standard',
    description: 'Analyze data pipelines.',
    createdAt: new Date().toISOString(),
  },
];

function makeCandidate(
  name: string,
  email: string,
  jobId: string,
  stage: Candidate['stage'],
  source: string,
): Candidate {
  const now = new Date().toISOString();
  const history: StageHistoryEntry[] = [{ stage, enteredAt: now }];
  return {
    id: nanoid(),
    name,
    email,
    phone: '',
    linkedin: '',
    jobId,
    stage,
    source,
    customFields: [],
    stageHistory: history,
    notes: [],
    emails: [],
    documents: [],
    createdAt: now,
  };
}

export function buildSeedCandidates(jobs: Job[]): Candidate[] {
  if (jobs.length === 0) return [];
  const j0 = jobs[0].id;
  const j1 = jobs[1]?.id ?? j0;
  const j2 = jobs[2]?.id ?? j0;

  return [
    makeCandidate('Jane Doe', 'jane@example.com', j0, 'Applied', 'LinkedIn'),
    makeCandidate('John Smith', 'john@example.com', j0, 'Screening', 'Referral'),
    makeCandidate('Emily Chen', 'emily@example.com', j0, 'Interview', 'Website'),
    makeCandidate('Michael Brown', 'michael@example.com', j0, 'Technical', 'LinkedIn'),
    makeCandidate('Sara Lee', 'sara@example.com', j1, 'Applied', 'Job Board'),
    makeCandidate('David Kim', 'david@example.com', j1, 'Offer', 'Referral'),
    makeCandidate('Anna Williams', 'anna@example.com', j2, 'Hired', 'Website'),
    makeCandidate('Tom Harris', 'tom@example.com', j2, 'Rejected', 'LinkedIn'),
  ];
}
