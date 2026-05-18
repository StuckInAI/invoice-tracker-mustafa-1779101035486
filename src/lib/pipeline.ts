import type { PipelineType, StageName } from '@/types';

export const STANDARD_PIPELINE: StageName[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export const ONBOARDING_PIPELINE: StageName[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Onboarded',
];

export const ALL_STAGES: StageName[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
  'Onboarded',
];

// Legacy alias
export const STAGES = ALL_STAGES;

export function getPipeline(type: PipelineType): StageName[] {
  return type === 'Onboarding' ? ONBOARDING_PIPELINE : STANDARD_PIPELINE;
}

export const STAGE_COLORS: Record<StageName, string> = {
  Applied: '#6366f1',
  Screening: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#8b5cf6',
  Hired: '#10b981',
  Rejected: '#ef4444',
  Onboarded: '#06b6d4',
};

export const STAGE_BG: Record<StageName, string> = {
  Applied: '#eef2ff',
  Screening: '#eff6ff',
  Interview: '#fffbeb',
  Offer: '#f5f3ff',
  Hired: '#ecfdf5',
  Rejected: '#fef2f2',
  Onboarded: '#ecfeff',
};
