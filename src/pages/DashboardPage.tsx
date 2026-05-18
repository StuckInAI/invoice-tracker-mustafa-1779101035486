import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Cell,
} from 'recharts';
import { Briefcase, Users, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import { ALL_STAGES, STAGE_COLORS } from '@/lib/pipeline';
import type { StageName } from '@/types';

function daysBetween(a: string, b: string) {
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function KpiCard({ label, value, icon, color, bg }: { label: string; value: string | number; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 12, padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: bg, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { jobs, candidates } = useAts();

  const openJobs = jobs.filter((j) => j.status === 'Open').length;
  const activeCandidates = candidates.filter((c) => c.stage !== 'Hired' && c.stage !== 'Rejected' && c.stage !== 'Onboarded').length;
  const hired = candidates.filter((c) => c.stage === 'Hired' || c.stage === 'Onboarded').length;

  const stageData = useMemo(
    () => ALL_STAGES.map((s) => ({
      stage: s,
      count: candidates.filter((c) => c.stage === s).length,
    })),
    [candidates],
  );

  const avgTimeToHire = useMemo(() => {
    const hiredCandidates = candidates.filter((c) => c.stage === 'Hired' || c.stage === 'Onboarded');
    if (!hiredCandidates.length) return 0;
    const total = hiredCandidates.reduce((sum, c) => {
      const getAt = (e: any) => e.at ?? e.changedAt ?? '';
      const applied = c.stageHistory.find((h) => h.stage === 'Applied');
      const hiredEntry = c.stageHistory.find((h) => h.stage === 'Hired' || h.stage === 'Onboarded');
      if (!applied || !hiredEntry) return sum;
      return sum + daysBetween(getAt(applied), getAt(hiredEntry));
    }, 0);
    return Math.round(total / hiredCandidates.length);
  }, [candidates]);

  const recentCandidates = useMemo(
    () => [...candidates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [candidates],
  );

  const jobMap = useMemo(() => Object.fromEntries(jobs.map((j) => [j.id, j])), [jobs]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Hiring pipeline overview"
        actions={
          <>
            <Link to="/jobs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)', fontSize: 13, fontWeight: 500,
              color: 'var(--color-text)', textDecoration: 'none',
            }}>View jobs</Link>
            <Link to="/candidates/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--color-primary)', fontSize: 13, fontWeight: 500,
              color: 'white', textDecoration: 'none',
            }}>+ Add candidate</Link>
          </>
        }
      />

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard label="Open jobs" value={openJobs} icon={<Briefcase size={20} />} color="#6366f1" bg="#eef2ff" />
        <KpiCard label="Active candidates" value={activeCandidates} icon={<Users size={20} />} color="#10b981" bg="#ecfdf5" />
        <KpiCard label="Hired / Onboarded" value={hired} icon={<TrendingUp size={20} />} color="#f59e0b" bg="#fffbeb" />
        <KpiCard label="Avg. time-to-hire" value={`${avgTimeToHire}d`} icon={<Clock size={20} />} color="#ef4444" bg="#fef2f2" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Bar chart */}
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 12, padding: '20px 24px',
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Candidates by stage</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {stageData.map((d) => (
                  <Cell key={d.stage} fill={STAGE_COLORS[d.stage as StageName] ?? '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent candidates */}
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 12, padding: '20px 24px',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent candidates</h3>
            <Link to="/candidates" style={{ fontSize: 12, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 2 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentCandidates.map((c) => (
              <Link key={c.id} to={`/candidates/${c.id}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                textDecoration: 'none', padding: '10px 0',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {jobMap[c.jobId ?? '']?.title ?? 'No job assigned'}
                  </div>
                </div>
                <StageBadge stage={c.stage} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
