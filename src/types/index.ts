export type Role = 'Admin' | 'Recruiter' | 'Hiring Manager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  password?: string;
};

export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected'
  | 'Onboarded';

export type PipelineType = 'Standard' | 'Onboarding';

export type JobStatus = 'Open' | 'On Hold' | 'Closed';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  status: JobStatus;
  description: string;
  requirements?: string;
  pipelineType: PipelineType;
  hiringManagerId?: string;
  recruiterId?: string;
  createdAt: string;
};

export type DocumentRef = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

export type StageHistoryEntry = {
  stage: StageName;
  at?: string;
  changedAt?: string;
  changedBy: string;
};

export type InterviewNote = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  authorName?: string;
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
  label?: string;
  name?: string;
  type: 'text' | 'number' | 'date' | 'select' | 'dropdown';
  options?: string[];
};
