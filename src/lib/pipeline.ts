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
  Applied: '#eef2ff',
  Screening: '#fef3c7',
  Interview: '#eff6ff',
  Offer: '#f5f3ff',
  Hired: '#ecfdf5',
  Rejected: '#fef2f2',
};

export const STAGE_LABELS: Record<StageName, string> = {
  Applied: 'Applied',
  Screening: 'Screening',
  Interview: 'Interview',
  Offer: 'Offer',
  Hired: 'Hired',
  Rejected: 'Rejected',
};
