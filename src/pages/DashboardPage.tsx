import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAts } from '@/hooks/useAtsStore';
import { STAGES, STAGE_COLORS, STAGE_BG } from '@/lib/pipeline';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { candidates, jobs, currentUser } = useAts();

  const openJobs = jobs.filter((j) => j.status === 'Open').length;
  const totalCandidates = candidates.length;

  const stageData = useMemo(() =>
    STAGES.map((s) => ({
      name: s,
      count: candidates.filter((c) => c.stage === s).length,
      color: STAGE_COLORS[s],
    })),
    [candidates]
  );

  const recentCandidates = useMemo(
    () => [...candidates].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [candidates]
  );

  const statCard = (label: string, value: number | string, sub?: string) => (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 10,
      border: '1px solid var(--color-border)',
      padding: '18px 22px',
    }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUser?.name?.split(' ')[0] ?? 'there'} 👋`}
        subtitle="Here's your hiring overview"
      />

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {statCard('Open Jobs', openJobs)}
        {statCard('Total Candidates', totalCandidates)}
        {statCard('Active Pipelines', openJobs)}
        {statCard(
          'Hired (All Time)',
          candidates.filter((c) => c.stage === 'Hired').length
        )}
      </div>

      {/* Charts + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Bar chart */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', padding: '20px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Candidates by Stage</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count">
                {stageData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stage breakdown */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', padding: '20px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Stage Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stageData.map(({ name, count, color }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13 }}>{name}</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{count}</div>
                <div style={{
                  width: 80, height: 6, borderRadius: 3,
                  background: 'var(--color-border)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: totalCandidates ? `${(count / totalCandidates) * 100}%` : '0%',
                    background: color,
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent candidates */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', padding: '20px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Recent Candidates</div>
        {recentCandidates.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No candidates yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentCandidates.map((c, i) => (
              <div
                key={c.id}
                onClick={() => navigate(`/candidates/${c.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 4px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: STAGE_BG[c.stage],
                  color: STAGE_COLORS[c.stage],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                  {c.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.jobTitle}</div>
                </div>
                <StageBadge stage={c.stage} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
