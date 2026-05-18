export type Role = 'Admin' | 'Recruiter';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
  createdAt: string;
};

export type JobStatus = 'Open' | 'Closed';

export type PipelineType = 'Standard' | 'Onboarding';

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  status: JobStatus;
  pipelineType: PipelineType;
  createdAt: string;
};

export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interviews'
  | 'Offer'
  | 'Hired'
  | 'Rejected'
  | 'Onboarded';

export type CustomFieldType = 'text' | 'number' | 'date' | 'dropdown';

export type CustomFieldDef = {
  id: string;
  name: string;
  type: CustomFieldType;
  options?: string[];
};

export type StageHistoryEntry = {
  stage: StageName;
  changedAt: string;
  changedBy: string;
};

export type InterviewNote = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type EmailLog = {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy: string;
  template?: string;
};

export type Document = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

export type Candidate = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  source: string;
  stage: StageName;
  customFields: Record<string, string>;
  documents: Document[];
  stageHistory: StageHistoryEntry[];
  notes: InterviewNote[];
  emails: EmailLog[];
  createdAt: string;
};

export type Session = {
  userId: string;
};
