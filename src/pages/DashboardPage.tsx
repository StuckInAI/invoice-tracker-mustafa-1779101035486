import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Briefcase, Users, TrendingUp, Clock } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import { STAGES, STAGE_COLORS } from '@/lib/pipeline';
import styles from './DashboardPage.module.css';

function daysBetween(a: string, b: string) {
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)));
}

export default function DashboardPage() {
  const { jobs, candidates } = useAts();

  const openJobs = jobs.filter((j) => j.status === 'Open').length;
  const activeCandidates = candidates.filter((c) => c.stage !== 'Hired' && c.stage !== 'Rejected').length;
  const hired = candidates.filter((c) => c.stage === 'Hired').length;

  const stageData = useMemo(
    () =>
      STAGES.map((s) => ({
        stage: s,
        count: candidates.filter((c) => c.stage === s).length,
      })),
    [candidates],
  );

  const avgTimeToHire = useMemo(() => {
    const hiredCandidates = candidates.filter((c) => c.stage === 'Hired');
    if (hiredCandidates.length === 0) return 0;
    const total = hiredCandidates.reduce((sum, c) => {
      const applied = c.stageHistory.find((h) => h.stage === 'Applied') ?? c.stageHistory[0];
      const hiredEntry = c.stageHistory.find((h) => h.stage === 'Hired');
      if (!applied || !hiredEntry) return sum;
      return sum + daysBetween(applied.at, hiredEntry.at);
    }, 0);
    return Math.round(total / hiredCandidates.length);
  }, [candidates]);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach((c) => {
      const s = c.source ?? 'Unknown';
      counts[s] = (counts[s] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [candidates]);

  const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Hiring pipeline overview"
        actions={
          <>
            <Link to="/jobs" className="btn btn-secondary">View jobs</Link>
            <Link to="/candidates/new" className="btn btn-primary">Add candidate</Link>
          </>
        }
      />

      <div className={styles.kpiGrid}>
        <div className={styles.kpi}>
          <div className={styles.kpiIcon} style={{ background: '#eef2ff', color: '#6366f1' }}>
            <Briefcase size={18} />
          </div>
          <div>
            <div className={styles.kpiLabel}>Open jobs</div>
            <div className={styles.kpiValue}>{openJobs}</div>
          </div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiIcon} style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Users size={18} />
          </div>
          <div>
            <div className={styles.kpiLabel}>Active candidates</div>
            <div className={styles.kpiValue}>{activeCandidates}</div>
          </div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <div className={styles.kpiLabel}>Hired this period</div>
            <div className={styles.kpiValue}>{hired}</div>
          </div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiIcon} style={{ background: '#fef2f2', color: '#ef4444' }}>
            <Clock size={18} />
          </div>
          <div>
            <div className={styles.kpiLabel}>Avg. time-to-hire</div>
            <div className={styles.kpiValue}>{avgTimeToHire}d</div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Candidates by stage</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
              <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {stageData.map((d) => (
                  <Cell key={d.stage} fill={STAGE_COLORS[d.stage]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Source of hire</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={sourceData} dataKey="value" nameKey="name" outerRadius={90} label>
                {sourceData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
