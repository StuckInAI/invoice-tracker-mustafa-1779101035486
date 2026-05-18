import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Users, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import StageBadge from '@/components/StageBadge';
import PageHeader from '@/components/PageHeader';
import type { StageName } from '@/types';
import { STAGE_COLORS } from '@/lib/pipeline';

const STAGES: StageName[] = ['Applied', 'Screening', 'Interview', 'Technical', 'Offer', 'Hired', 'Rejected'];

export default function DashboardPage() {
  const { candidates, jobs } = useAts();

  const activeCandidates = candidates.filter((c) => c.stage !== 'Hired' && c.stage !== 'Rejected' && c.stage !== 'Onboarded').length;
  const hired = candidates.filter((c) => c.stage === 'Hired' || c.stage === 'Onboarded').length;

  const stageData = useMemo(() =>
    STAGES.map((s) => ({
      name: s,
      count: candidates.filter((c) => c.stage === s).length,
    })),
    [candidates],
  );

  const avgTimeToHire = useMemo(() => {
    const hiredCandidates = candidates.filter((c) => c.stage === 'Hired' || c.stage === 'Onboarded');
    if (!hiredCandidates.length) return null;
    const total = hiredCandidates.reduce((sum, c) => {
      const diff = new Date().getTime() - new Date(c.createdAt).getTime();
      return sum + diff / (1000 * 60 * 60 * 24);
    }, 0);
    return Math.round(total / hiredCandidates.length);
  }, [candidates]);

  const recentCandidates = useMemo(() =>
    [...candidates]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [candidates],
  );

  const openJobs = jobs.filter((j) => j.status === 'Open').length;

  const stats = [
    { label: 'Open Positions', value: openJobs, icon: <Briefcase size={20} />, color: '#6366f1' },
    { label: 'Active Candidates', value: activeCandidates, icon: <Users size={20} />, color: '#0ea5e9' },
    { label: 'Hired (All Time)', value: hired, icon: <CheckCircle size={20} />, color: '#22c55e' },
    { label: 'Avg. Days to Hire', value: avgTimeToHire ?? '—', icon: <TrendingUp size={20} />, color: '#f59e0b' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your hiring overview" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>{s.label}</span>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 10, padding: '20px',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Candidates by Stage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stageData.map((entry) => (
                  <Cell key={entry.name} fill={STAGE_COLORS[entry.name as StageName] ?? '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 10, padding: '20px',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Open Jobs by Department</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from(new Set(jobs.filter(j => j.status === 'Open').map(j => j.department))).map(dept => {
              const count = jobs.filter(j => j.department === dept && j.status === 'Open').length;
              return (
                <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text)', minWidth: 120 }}>{dept}</span>
                  <div style={{ flex: 1, height: 8, background: 'var(--color-surface-alt)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(count / (openJobs || 1)) * 100}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', minWidth: 20, textAlign: 'right' }}>{count}</span>
                </div>
              );
            })}
            {openJobs === 0 && <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No open jobs.</p>}
          </div>
        </div>
      </div>

      {/* Recent Candidates */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 10, padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent Candidates</h3>
          <Link to="/candidates" style={{ fontSize: 13, color: 'var(--color-primary)', textDecoration: 'none' }}>View all</Link>
        </div>
        {recentCandidates.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No candidates yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentCandidates.map((c) => (
              <Link
                key={c.id}
                to={`/candidates/${c.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.jobTitle}</div>
                </div>
                <StageBadge stage={c.stage} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
