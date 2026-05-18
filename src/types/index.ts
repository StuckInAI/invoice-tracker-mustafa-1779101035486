export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical'
  | 'Offer'
  | 'Hired'
  | 'Rejected'
  | 'Onboarded';

export type PipelineType = 'Standard' | 'Technical' | 'Executive';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface StageHistoryEntry {
  stage: StageName;
  timestamp: string;
  changedBy: string;
}

export interface CustomFieldDef {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  createdAt: string;
}

export interface CustomFieldValue {
  fieldId: string;
  value: string | number;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
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

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  stage: StageName;
  stageHistory: StageHistoryEntry[];
  notes: Note[];
  emails: EmailLog[];
  documents: Document[];
  resumeUrl?: string;
  linkedIn?: string;
  source?: string;
  tags?: string[];
  customFields?: CustomFieldValue[];
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: 'Open' | 'Closed' | 'Draft';
  employmentType: EmploymentType;
  pipelineType: PipelineType;
  description?: string;
  requirements?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Recruiter' | 'Hiring Manager';
  active: boolean;
  createdAt: string;
}

export interface InterviewNote {
  id: string;
  candidateId: string;
  interviewerId: string;
  rating: number;
  notes: string;
  createdAt: string;
}
