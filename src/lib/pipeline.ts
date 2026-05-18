import type { StageName } from '@/types';

export const STAGE_NAMES: StageName[] = [
  'Applied',
  'Screening',
  'Interview',
  'Technical',
  'Offer',
  'Hired',
  'Onboarded',
  'Rejected',
];

export const STAGE_COLORS: Record<StageName, string> = {
  Applied: '#6366f1',
  Screening: '#8b5cf6',
  Interview: '#3b82f6',
  Technical: '#06b6d4',
  Offer: '#f59e0b',
  Hired: '#10b981',
  Onboarded: '#059669',
  Rejected: '#ef4444',
};

export const STAGE_BG: Record<StageName, string> = {
  Applied: '#eef2ff',
  Screening: '#f5f3ff',
  Interview: '#eff6ff',
  Technical: '#ecfeff',
  Offer: '#fffbeb',
  Hired: '#ecfdf5',
  Onboarded: '#d1fae5',
  Rejected: '#fef2f2',
};

export const STAGE_LABELS: Record<StageName, string> = {
  Applied: 'Applied',
  Screening: 'Screening',
  Interview: 'Interview',
  Technical: 'Technical',
  Offer: 'Offer',
  Hired: 'Hired',
  Onboarded: 'Onboarded',
  Rejected: 'Rejected',
};

export const STAGE_ORDER = STAGE_NAMES;

export interface Pipeline {
  stages: StageName[];
}

export function getPipeline(pipelineType: string): Pipeline {
  // All pipeline types use the same stage set for now
  return { stages: STAGE_NAMES };
}
