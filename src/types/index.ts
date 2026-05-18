export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical'
  | 'Offer'
  | 'Hired'
  | 'Onboarded'
  | 'Rejected';

export type Role = 'Admin' | 'Recruiter' | 'Interviewer' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  passwordHash: string;
}

export interface CustomFieldDef {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}

export interface CustomFieldValue {
  fieldId: string;
  value: string | number;
}

export interface StageHistoryEntry {
  stage: StageName;
  enteredAt: string;
}

export interface Note {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
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
  phone?: string;
  linkedin?: string;
  jobId: string;
  stage: StageName;
  source?: string;
  customFields?: CustomFieldValue[];
  stageHistory: StageHistoryEntry[];
  notes: Note[];
  emails: EmailLog[];
  documents: Document[];
  createdAt: string;
  resumeText?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: 'Open' | 'Closed' | 'Draft';
  pipelineType: string;
  description?: string;
  createdAt: string;
}
