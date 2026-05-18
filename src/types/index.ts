export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export type PipelineType = 'Standard' | 'Technical' | 'Executive';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Recruiter' | 'Hiring Manager';
  active: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  status: 'Open' | 'Closed' | 'Draft';
  employmentType: EmploymentType;
  pipelineType: PipelineType;
  createdAt: string;
  createdBy: string;
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
  tags: string[];
  customFields: Record<string, string>;
  stageHistory: StageHistoryEntry[];
  notes: Note[];
  emails: EmailLog[];
  documents: Document[];
  createdAt: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  source?: string;
}

export interface CustomFieldDef {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}
