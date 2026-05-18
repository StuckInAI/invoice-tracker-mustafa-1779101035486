import type { StageName, PipelineType } from '@/types';

export const STAGE_ORDER: StageName[] = [
  'Applied',
  'Screening',
  'Interviews',
  'Offer',
  'Hired',
  'Onboarded',
  'Rejected',
];

export const STAGE_COLORS: Record<StageName, string> = {
  Applied: '#6366f1',
  Screening: '#0ea5e9',
  Interviews: '#f59e0b',
  Offer: '#8b5cf6',
  Hired: '#10b981',
  Onboarded: '#059669',
  Rejected: '#ef4444',
};

const PIPELINE_STAGES: Record<PipelineType, StageName[]> = {
  Standard: ['Applied', 'Screening', 'Interviews', 'Offer', 'Hired', 'Onboarded', 'Rejected'],
  Engineering: ['Applied', 'Screening', 'Interviews', 'Offer', 'Hired', 'Onboarded', 'Rejected'],
  Sales: ['Applied', 'Screening', 'Interviews', 'Offer', 'Hired', 'Onboarded', 'Rejected'],
  Executive: ['Applied', 'Screening', 'Interviews', 'Offer', 'Hired', 'Onboarded', 'Rejected'],
};

export function getStages(pipelineType?: PipelineType): StageName[] {
  if (pipelineType && PIPELINE_STAGES[pipelineType]) {
    return PIPELINE_STAGES[pipelineType];
  }
  return STAGE_ORDER;
}

export function isActiveStage(stage: StageName): boolean {
  return stage !== 'Hired' && stage !== 'Onboarded' && stage !== 'Rejected';
}
