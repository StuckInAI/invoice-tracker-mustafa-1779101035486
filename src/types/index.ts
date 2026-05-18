export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export type Role = 'Admin' | 'Recruiter' | 'Hiring Manager';

export type PipelineType = 'Standard' | 'Technical' | 'Executive';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  passwordHash: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: 'Open' | 'Closed' | 'Draft';
  description: string;
  requirements: string;
  employmentType: EmploymentType;
  pipelineType: PipelineType;
  createdAt: string;
}

export interface StageHistoryEntry {
  stage: StageName;
  movedAt: string;
  movedBy: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface EmailLog {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  stage: StageName;
  rating: number;
  tags: string[];
  customFields: Record<string, string>;
  linkedinUrl: string;
  source: string;
  createdAt: string;
  stageHistory: StageHistoryEntry[];
  notes: Note[];
  emails: EmailLog[];
  documents: Document[];
}

export interface CustomFieldDef {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}
