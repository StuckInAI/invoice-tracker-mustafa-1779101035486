import type { Candidate, CustomFieldDef, Job, User } from '@/types';

type SeedState = {
  candidates: Candidate[];
  currentUserId: string | null;
  users: User[];
  jobs: Job[];
  customFields: CustomFieldDef[];
};

const now = new Date().toISOString();

const USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alice Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin',
    active: true,
    createdAt: now,
  },
  {
    id: 'user-2',
    name: 'Bob Recruiter',
    email: 'recruiter@example.com',
    password: 'recruiter123',
    role: 'Recruiter',
    active: true,
    createdAt: now,
  },
];

const JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    status: 'Open',
    description: 'We are looking for an experienced frontend engineer...',
    createdAt: now,
  },
  {
    id: 'job-2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York',
    type: 'Full-time',
    status: 'Open',
    description: 'Lead product strategy and roadmap...',
    createdAt: now,
  },
  {
    id: 'job-3',
    title: 'UX Designer',
    department: 'Design',
    location: 'San Francisco',
    type: 'Contract',
    status: 'Draft',
    description: 'Design beautiful and intuitive user experiences...',
    createdAt: now,
  },
];

const CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 555 100 0001',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    stage: 'Interview',
    tags: ['react', 'typescript'],
    rating: 4,
    customFields: {},
    stageHistory: [
      { stage: 'Applied', movedAt: now, movedBy: 'system' },
      { stage: 'Screening', movedAt: now, movedBy: 'user-1' },
      { stage: 'Interview', movedAt: now, movedBy: 'user-1' },
    ],
    notes: [],
    emails: [],
    documents: [],
    createdAt: now,
  },
  {
    id: 'cand-2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 555 100 0002',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    stage: 'Applied',
    tags: ['vue', 'javascript'],
    rating: 3,
    customFields: {},
    stageHistory: [{ stage: 'Applied', movedAt: now, movedBy: 'system' }],
    notes: [],
    emails: [],
    documents: [],
    createdAt: now,
  },
  {
    id: 'cand-3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    phone: '+1 555 100 0003',
    jobId: 'job-2',
    jobTitle: 'Product Manager',
    stage: 'Offer',
    tags: ['agile', 'b2b'],
    rating: 5,
    customFields: {},
    stageHistory: [
      { stage: 'Applied', movedAt: now, movedBy: 'system' },
      { stage: 'Screening', movedAt: now, movedBy: 'user-2' },
      { stage: 'Interview', movedAt: now, movedBy: 'user-2' },
      { stage: 'Offer', movedAt: now, movedBy: 'user-1' },
    ],
    notes: [],
    emails: [],
    documents: [],
    createdAt: now,
  },
  {
    id: 'cand-4',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+1 555 100 0004',
    jobId: 'job-2',
    jobTitle: 'Product Manager',
    stage: 'Rejected',
    tags: [],
    rating: 2,
    customFields: {},
    stageHistory: [
      { stage: 'Applied', movedAt: now, movedBy: 'system' },
      { stage: 'Rejected', movedAt: now, movedBy: 'user-1' },
    ],
    notes: [],
    emails: [],
    documents: [],
    createdAt: now,
  },
];

export const SEED_STATE: SeedState = {
  candidates: CANDIDATES,
  currentUserId: null,
  users: USERS,
  jobs: JOBS,
  customFields: [],
};
