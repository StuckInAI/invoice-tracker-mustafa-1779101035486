import type { PipelineType, StageName } from '@/types';

export const STANDARD_STAGES: StageName[] = [
  'Applied',
  'Screening',
  'Interviews',
  'Offer',
  'Hired',
  'Rejected',
];

export const ONBOARDING_STAGES: StageName[] = [
  'Applied',
  'Screening',
  'Interviews',
  'Offer',
  'Hired',
  'Onboarded',
];

export function getStages(type: PipelineType): StageName[] {
  return type === 'Onboarding' ? ONBOARDING_STAGES : STANDARD_STAGES;
}

export const STAGE_COLORS: Record<StageName, string> = {
  Applied: '#3b82f6',
  Screening: '#8b5cf6',
  Interviews: '#f59e0b',
  Offer: '#10b981',
  Hired: '#059669',
  Rejected: '#ef4444',
  Onboarded: '#0ea5e9',
};
