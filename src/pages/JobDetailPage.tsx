import { useParams, useNavigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import { getPipeline, STAGE_ORDER } from '@/lib/pipeline';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import EmptyState from '@/components/EmptyState';
import { Users } from 'lucide-react';
import type { StageName } from '@/types';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, candidates, moveCandidateStage } = useAts();

  const job = jobs.find((j) => j.id === jobId);
  if (!job) return <div style={{ padding: 24 }}>Job not found.</div>;

  const jobCandidates = candidates.filter((c) => c.jobId === jobId);
  const totalCandidates = jobCandidates.length;

  const stages = getPipeline(STAGE_ORDER);

  const byStage = (stage: StageName) => jobCandidates.filter((c) => c.stage === stage);

  const btnStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    padding: '7px 14px',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: variant === 'primary' ? 'none' : '1px solid var(--color-border)',
    background: variant === 'primary' ? 'var(--color-primary)' : 'transparent',
    color: variant === 'primary' ? 'white' : 'var(--color-text-muted)',
  });

  return (
    <div>
      <PageHeader
        title={job.title}
        subtitle={`${job.department} · ${job.location}${job.type ? ` · ${job.type}` : ''}`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btnStyle('secondary')} onClick={() => navigate('/candidates/new')}>
              + Add Candidate
            </button>
          </div>
        }
      />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[{ label: 'Total Candidates', value: totalCandidates }, { label: 'Department', value: job.department }, { label: 'Location', value: job.location }, { label: 'Type', value: job.type ?? '—' }].map((item) => (
          <div key={item.label} style={{
            background: 'var(--color-surface)', borderRadius: 8,
            border: '1px solid var(--color-border)',
            padding: '12px 16px', minWidth: 120, flex: 1,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>{item.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ display: 'flex', gap: 12, minWidth: 'max-content' }}>
          {stages.map((stage) => {
            const stageCandidates = byStage(stage);
            return (
              <div key={stage} style={{
                width: 220, flexShrink: 0,
                background: 'var(--color-surface)',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  padding: '10px 14px', borderBottom: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <StageBadge stage={stage} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    {stageCandidates.length}
                  </span>
                </div>
                <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 100 }}>
                  {stageCandidates.length === 0 ? (
                    <EmptyState title="No candidates" icon={<Users size={20} />} />
                  ) : (
                    stageCandidates.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => navigate(`/candidates/${c.id}`)}
                        style={{
                          background: 'var(--color-bg)',
                          borderRadius: 8, padding: '10px 12px',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.15s',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: 'var(--color-text)' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                          {c.email}
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {stages
                            .filter((s) => s !== stage && s !== 'Rejected')
                            .slice(0, 2)
                            .map((s) => (
                              <button
                                key={s}
                                onClick={(e) => { e.stopPropagation(); moveCandidateStage(c.id, s); }}
                                style={{
                                  fontSize: 10, padding: '2px 6px', borderRadius: 4,
                                  border: '1px solid var(--color-border)',
                                  background: 'var(--color-surface)',
                                  cursor: 'pointer', color: 'var(--color-text-muted)',
                                }}
                              >
                                → {s}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
