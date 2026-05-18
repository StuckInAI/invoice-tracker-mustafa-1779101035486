import type { StageName } from '@/types';

export const STAGES: StageName[] = [
  'Applied',
  'Screening',
  'Interviews',
  'Offer',
  'Hired',
  'Rejected',
];

export const STAGE_COLORS: Record<StageName, string> = {
  Applied: '#3b82f6',
  Screening: '#8b5cf6',
  Interviews: '#f59e0b',
  Offer: '#10b981',
  Hired: '#059669',
  Rejected: '#ef4444',
};

export const ACTIVE_STAGES: StageName[] = [
  'Applied',
  'Screening',
  'Interviews',
  'Offer',
];

export function getStages(): StageName[] {
  return STAGES;
}

export function isTerminalStage(stage: StageName): boolean {
  return stage === 'Hired' || stage === 'Rejected';
}

export function nextStage(stage: StageName): StageName | null {
  const idx = STAGES.indexOf(stage);
  if (idx === -1 || idx >= STAGES.length - 1) return null;
  return STAGES[idx + 1];
}
