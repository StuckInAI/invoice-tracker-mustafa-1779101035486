import type { StageName } from '@/types';
import { STAGE_COLORS, STAGE_BG } from '@/lib/pipeline';

export default function StageBadge({ stage }: { stage: StageName }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      background: STAGE_BG[stage] ?? '#f3f4f6',
      color: STAGE_COLORS[stage] ?? '#374151',
    }}>
      {stage}
    </span>
  );
}
