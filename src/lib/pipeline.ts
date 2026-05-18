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
  Screening: '#0ea5e9',
  Interview: '#f59e0b',
  Offer: '#8b5cf6',
  Hired: '#10b981',
  Rejected: '#ef4444',
};

export const ACTIVE_STAGES: StageName[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
];

export function nextStage(stage: StageName): StageName | null {
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}

export function isTerminalStage(stage: StageName): boolean {
  return stage === 'Hired' || stage === 'Rejected';
}
