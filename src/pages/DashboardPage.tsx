import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import { useAts } from '@/hooks/useAtsStore';
import { daysBetween, formatDate } from '@/lib/format';
import type { StageName } from '@/types';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { jobs, candidates } = useAts();

  const openRoles = jobs.filter((j) => j.status === 'Open').length;
  const activeCandidates = candidates.filter(
    (c) => c.stage !== 'Rejected' && c.stage !== 'Hired' && c.stage !== 'Onboarded',
  ).length;

  const stageCounts = useMemo(() => {
    const stages: StageName[] = ['Applied', 'Screening', 'Interviews', 'Offer', 'Hired', 'Rejected', 'Onboarded'];
    return stages.map((stage) => ({
      stage,
      count: candidates.filter((c) => c.stage === stage).length,
    }));
  }, [candidates]);

  const avgTimeToHire = useMemo(() => {
    const hired = candidates.filter((c) => c.stage === 'Hired' || c.stage === 'Onboarded');
    if (hired.length === 0) return 0;
    const total = hired.reduce((sum, c) => {
      const applied = c.stageHistory.find((h) => h.stage === 'Applied');
      const hiredEntry = c.stageHistory.find((h) => h.stage === 'Hired');
      if (!applied || !hiredEntry) return sum;
      return sum + daysBetween(applied.changedAt, hiredEntry.changedAt);
    }, 0);
    return Math.round(total / hired.length);
  }, [candidates]);

  const recent = useMemo(
    () => [...candidates].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [candidates],
  );

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Pipeline health at a glance" />

      <div className={styles.statGrid}>
        <StatCard icon={<Briefcase size={18} />} label="Open Roles" value={openRoles} color="#4f46e5" />
        <StatCard icon={<Users size={18} />} label="Active Candidates" value={activeCandidates} color="#10b981" />
        <StatCard icon={<Clock size={18} />} label="Avg. Time to Hire" value={`${avgTimeToHire}d`} color="#f59e0b" />
        <StatCard icon={<TrendingUp size={18} />} label="Total Candidates" value={candidates.length} color="#0ea5e9" />
      </div>

      <div className={styles.grid}>
        <div className="card">
          <div className={styles.cardHeader}>
            <h3>Candidates by Stage</h3>
          </div>
          <div style={{ height: 280, padding: 'var(--space-4)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e6eb" />
                <XAxis dataKey="stage" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className={styles.cardHeader}>
            <h3>Recently Added Candidates</h3>
          </div>
          <div className={styles.recentList}>
            {recent.length === 0 && <div className={styles.empty}>No candidates yet.</div>}
            {recent.map((c) => {
              const job = jobs.find((j) => j.id === c.jobId);
              return (
                <Link key={c.id} to={`/candidates/${c.id}`} className={styles.recentItem}>
                  <div className={styles.avatar}>{c.name.charAt(0)}</div>
                  <div className={styles.recentInfo}>
                    <div className={styles.recentName}>{c.name}</div>
                    <div className={styles.recentMeta}>
                      {job?.title ?? 'Unknown role'} • {formatDate(c.createdAt)}
                    </div>
                  </div>
                  <StageBadge stage={c.stage} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className={`card ${styles.stat}`}>
      <div className={styles.statIcon} style={{ background: `${color}1a`, color }}>
        {icon}
      </div>
      <div>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}
