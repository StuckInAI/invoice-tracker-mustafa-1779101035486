import type { StageName } from '@/types';

export const STAGES: StageName[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

// Alias for pages that import ALL_STAGES
export const ALL_STAGES = STAGES;

export const STAGE_COLORS: Record<StageName, string> = {
  Applied: '#2563eb',
  Screening: '#7c3aed',
  Interview: '#d97706',
  Offer: '#059669',
  Hired: '#16a34a',
  Rejected: '#dc2626',
};

export const STAGE_BG: Record<StageName, string> = {
  Applied: '#dbeafe',
  Screening: '#ede9fe',
  Interview: '#fef3c7',
  Offer: '#d1fae5',
  Hired: '#dcfce7',
  Rejected: '#fee2e2',
};

export const PIPELINE_STAGES: Record<string, StageName[]> = {
  Standard: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
  Technical: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
  Executive: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
};

export function getStagesForPipeline(pipelineType?: string): StageName[] {
  return PIPELINE_STAGES[pipelineType ?? 'Standard'] ?? STAGES;
}
