export type Role = 'Admin' | 'Recruiter' | 'Viewer';

export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'Open' | 'Closed' | 'Draft';
  description: string;
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
  tags: string[];
  resumeUrl?: string;
  linkedinUrl?: string;
  source?: string;
  rating: number;
  customFields: Record<string, string>;
  stageHistory: StageHistoryEntry[];
  notes: Note[];
  emails: EmailLog[];
  documents: Document[];
  createdAt: string;
}

export interface CustomFieldDef {
  id: string;
  name: string;
  fieldType: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}
