export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export type UserRole = 'Admin' | 'Recruiter' | 'Hiring Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: 'Open' | 'Closed' | 'Draft';
  createdAt: string;
  hiringManagerId?: string;
}

export interface StageHistoryEntry {
  stage: StageName;
  movedAt: string;
  movedBy?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy?: string;
}

export interface EmailLog {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy?: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface CustomFieldValue {
  fieldId: string;
  value: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobId?: string;
  stage: StageName;
  stageHistory: StageHistoryEntry[];
  notes: Note[];
  emails: EmailLog[];
  documents: Document[];
  customFields?: CustomFieldValue[];
  source?: string;
  createdAt: string;
}

export interface CustomFieldDef {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}
