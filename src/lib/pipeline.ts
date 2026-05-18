export const STAGES = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
] as const;

export const ALL_STAGES = STAGES;

export type StageName = (typeof STAGES)[number];

export const STAGE_COLORS: Record<string, string> = {
  Applied: '#2563eb',
  Screening: '#7c3aed',
  Interview: '#d97706',
  Offer: '#059669',
  Hired: '#16a34a',
  Rejected: '#dc2626',
};

export const STAGE_BG: Record<string, string> = {
  Applied: '#dbeafe',
  Screening: '#ede9fe',
  Interview: '#fef3c7',
  Offer: '#d1fae5',
  Hired: '#dcfce7',
  Rejected: '#fee2e2',
};
