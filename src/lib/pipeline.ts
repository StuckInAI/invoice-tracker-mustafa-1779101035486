import type { StageName } from '@/types';

export const STAGE_ORDER: StageName[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export const STAGE_COLORS: Record<StageName, string> = {
  Applied: '#6366f1',
  Screening: '#f59e0b',
  Interview: '#3b82f6',
  Offer: '#8b5cf6',
  Hired: '#10b981',
  Rejected: '#ef4444',
};

export const STAGE_BG: Record<StageName, string> = {
  Applied: '#ede9fe',
  Screening: '#fef3c7',
  Interview: '#dbeafe',
  Offer: '#ede9fe',
  Hired: '#d1fae5',
  Rejected: '#fee2e2',
};

export function getPipeline(jobId: string, candidates: import('@/types').Candidate[]) {
  return STAGE_ORDER.map((stage) => ({
    stage,
    candidates: candidates.filter((c) => c.jobId === jobId && c.stage === stage),
  }));
}
