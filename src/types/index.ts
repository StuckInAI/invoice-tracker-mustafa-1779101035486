export type Role = 'Admin' | 'Recruiter' | 'Hiring Manager';

export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interviews'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
  createdAt: string;
};

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  status: 'Open' | 'On Hold' | 'Closed';
  description: string;
  requirements: string;
  hiringManagerId: string;
  recruiterId: string;
  createdAt: string;
};

export type CustomFieldType = 'text' | 'number' | 'date' | 'select';

export type CustomFieldDef = {
  id: string;
  label: string;
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
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

export type EmailLog = {
  id: string;
  subject: string;
  body: string;
  to: string;
  sentAt: string;
  sentBy: string;
};

export type CandidateDocument = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  stage: StageName;
  source: string;
  resumeText?: string;
  customFields: Record<string, string | number>;
  stageHistory: StageHistoryEntry[];
  notes: InterviewNote[];
  emails: EmailLog[];
  documents: CandidateDocument[];
  createdAt: string;
};
