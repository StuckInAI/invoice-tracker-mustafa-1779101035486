export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Onboarded'
  | 'Rejected';

export interface StageHistoryEntry {
  stage: StageName;
  movedAt: string;
  movedBy?: string;
  note?: string;
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
  templateId?: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface CustomFieldValue {
  fieldId: string;
  value: string | number | boolean;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  jobTitle: string;
  currentStage: StageName;
  stageHistory: StageHistoryEntry[];
  notes: Note[];
  emails: EmailLog[];
  documents: Document[];
  customFields?: CustomFieldValue[];
  createdAt: string;
  source?: string;
  linkedIn?: string;
  resumeUrl?: string;
  tags?: string[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  status: 'Open' | 'Closed' | 'Draft';
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
  closedAt?: string;
  hiringManagerId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Recruiter' | 'HiringManager' | 'Viewer';
  active: boolean;
  createdAt: string;
  passwordHash?: string;
}

export interface CustomFieldDef {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
  required?: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  stage?: StageName;
}
