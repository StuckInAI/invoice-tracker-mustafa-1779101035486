export type Role = 'Admin' | 'Recruiter' | 'Hiring Manager';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
  createdAt: string;
};

export type Session = {
  userId: string;
};

export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interviews'
  | 'Offer'
  | 'Hired'
  | 'Rejected'
  | 'Onboarded';

export type JobStatus = 'Open' | 'On Hold' | 'Closed';

export type PipelineType = 'Standard' | 'Engineering' | 'Sales' | 'Executive';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  status: JobStatus;
  pipelineType: PipelineType;
  employmentType?: string;
  description?: string;
  requirements?: string;
  hiringManagerId?: string;
  recruiterId?: string;
  createdAt: string;
};

export type StageHistoryEntry = {
  stage: StageName;
  at: string;
  by?: string;
};

export type InterviewNote = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
};

export type CandidateDocument = {
  id: string;
  name: string;
  url?: string;
  uploadedAt: string;
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
  jobId: string;
  stage: StageName;
  source?: string;
  customFields: Record<string, string>;
  stageHistory: StageHistoryEntry[];
  notes: InterviewNote[];
  emails: EmailLog[];
  documents: CandidateDocument[];
  createdAt: string;
};

export type CustomFieldDef = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
};
