export type Role = 'Admin' | 'Recruiter' | 'Hiring Manager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  // Demo-only password (client-side, not secure)
  password?: string;
};

export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export type JobStatus = 'Open' | 'On Hold' | 'Closed';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  status: JobStatus;
  description: string;
  requirements: string;
  hiringManagerId?: string;
  recruiterId?: string;
  createdAt: string;
};

export type DocumentRef = {
  id: string;
  name: string;
  type: string;
  size: number;
  addedAt: string;
};

export type StageHistoryEntry = {
  stage: StageName;
  at: string;
  changedBy: string;
};

export type InterviewNote = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
};

export type EmailLog = {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  jobId?: string;
  stage: StageName;
  source?: string;
  rating?: number;
  resumeText?: string;
  documents: DocumentRef[];
  stageHistory: StageHistoryEntry[];
  notes: InterviewNote[];
  emails: EmailLog[];
  customFields?: Record<string, string | number>;
  createdAt: string;
};

export type CustomFieldDef = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: string[];
};
