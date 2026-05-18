import type { StageName } from '@/types';

export const STAGES: StageName[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Onboarded',
  'Rejected',
];

export const ALL_STAGES = STAGES;

export const STAGE_COLORS: Record<StageName, string> = {
  Applied: '#6366f1',
  Screening: '#f59e0b',
  Interview: '#3b82f6',
  Offer: '#8b5cf6',
  Hired: '#10b981',
  Onboarded: '#059669',
  Rejected: '#ef4444',
};

export const STAGE_BG: Record<StageName, string> = {
  Applied: '#eef2ff',
  Screening: '#fffbeb',
  Interview: '#eff6ff',
  Offer: '#f5f3ff',
  Hired: '#ecfdf5',
  Onboarded: '#d1fae5',
  Rejected: '#fef2f2',
};

export const STAGE_LABELS: Record<StageName, string> = {
  Applied: 'Applied',
  Screening: 'Screening',
  Interview: 'Interview',
  Offer: 'Offer',
  Hired: 'Hired',
  Onboarded: 'Onboarded',
  Rejected: 'Rejected',
};

export function getPipeline(stages: StageName[]): StageName[] {
  return stages;
}
