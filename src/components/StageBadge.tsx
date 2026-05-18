import type { StageName } from '@/types';
import { STAGE_COLORS } from '@/lib/pipeline';
import styles from './StageBadge.module.css';

type Props = { stage: StageName };

export default function StageBadge({ stage }: Props) {
  const color = STAGE_COLORS[stage];
  return (
    <span className={styles.badge} style={{ background: `${color}1a`, color }}>
      <span className={styles.dot} style={{ background: color }} />
      {stage}
    </span>
  );
}
