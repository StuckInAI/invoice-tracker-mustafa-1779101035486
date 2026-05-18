import type { Candidate, Job, User, StageName } from '@/types';
import { nanoid } from '@/lib/id';

const now = new Date().toISOString();

const USERS: User[] = [
  {
    id: 'u1',
    name: 'Alice Admin',
    email: 'alice@company.com',
    password: 'password',
    role: 'Admin',
    active: true,
    createdAt: now,
  },
  {
    id: 'u2',
    name: 'Bob Recruiter',
    email: 'bob@company.com',
    password: 'password',
    role: 'Recruiter',
    active: true,
    createdAt: now,
  },
  {
    id: 'u3',
    name: 'Carol Manager',
    email: 'carol@company.com',
    password: 'password',
    role: 'Hiring Manager',
    active: true,
    createdAt: now,
  },
];

const JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    status: 'Open',
    employmentType: 'Full-time',
    pipelineType: 'Technical',
    description: 'Build amazing UIs.',
    requirements: '5+ years React experience.',
    createdAt: now,
  },
  {
    id: 'j2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    status: 'Open',
    employmentType: 'Full-time',
    pipelineType: 'Standard',
    description: 'Drive product vision.',
    requirements: '3+ years PM experience.',
    createdAt: now,
  },
  {
    id: 'j3',
    title: 'UX Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    status: 'Open',
    employmentType: 'Full-time',
    pipelineType: 'Standard',
    description: 'Design delightful experiences.',
    requirements: 'Portfolio required.',
    createdAt: now,
  },
  {
    id: 'j4',
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Remote',
    status: 'Closed',
    employmentType: 'Full-time',
    pipelineType: 'Standard',
    description: 'Analyze data pipelines.',
    requirements: 'SQL proficiency required.',
    createdAt: now,
  },
];

const stages: StageName[] = ['Applied', 'Screening', 'Interview', 'Technical', 'Offer', 'Hired', 'Rejected'];

function makeCandidate(
  id: string,
  name: string,
  email: string,
  phone: string,
  jobId: string,
  jobTitle: string,
  stage: StageName,
): Candidate {
  return {
    id,
    name,
    email,
    phone,
    jobId,
    jobTitle,
    stage,
    stageHistory: [{ stage, timestamp: now, changedBy: 'Seed' }],
    notes: [],
    emails: [],
    documents: [],
    createdAt: now,
  };
}

const CANDIDATES: Candidate[] = [
  makeCandidate('c1', 'Diana Prince', 'diana@example.com', '555-0101', 'j1', 'Senior Frontend Engineer', 'Applied'),
  makeCandidate('c2', 'Ethan Hunt', 'ethan@example.com', '555-0102', 'j1', 'Senior Frontend Engineer', 'Screening'),
  makeCandidate('c3', 'Fiona Green', 'fiona@example.com', '555-0103', 'j1', 'Senior Frontend Engineer', 'Interview'),
  makeCandidate('c4', 'George Ball', 'george@example.com', '555-0104', 'j1', 'Senior Frontend Engineer', 'Technical'),
  makeCandidate('c5', 'Hannah Lee', 'hannah@example.com', '555-0105', 'j1', 'Senior Frontend Engineer', 'Offer'),
  makeCandidate('c6', 'Ivan Drago', 'ivan@example.com', '555-0106', 'j2', 'Product Manager', 'Applied'),
  makeCandidate('c7', 'Julia Roberts', 'julia@example.com', '555-0107', 'j2', 'Product Manager', 'Screening'),
  makeCandidate('c8', 'Kevin Hart', 'kevin@example.com', '555-0108', 'j2', 'Product Manager', 'Hired'),
  makeCandidate('c9', 'Laura Palmer', 'laura@example.com', '555-0109', 'j3', 'UX Designer', 'Applied'),
  makeCandidate('c10', 'Mike Ross', 'mike@example.com', '555-0110', 'j3', 'UX Designer', 'Interview'),
  makeCandidate('c11', 'Nina Simone', 'nina@example.com', '555-0111', 'j3', 'UX Designer', 'Rejected'),
  makeCandidate('c12', 'Oscar Wilde', 'oscar@example.com', '555-0112', 'j4', 'Data Analyst', 'Hired'),
];

export function generateSeedData() {
  return {
    users: USERS,
    jobs: JOBS,
    candidates: CANDIDATES,
    customFields: [],
  };
}
