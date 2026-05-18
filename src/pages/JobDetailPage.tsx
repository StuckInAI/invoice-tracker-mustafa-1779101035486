import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAts } from '@/hooks/useAtsStore';
import { getPipeline, STAGE_ORDER } from '@/lib/pipeline';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import type { StageName } from '@/types';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, candidates, moveCandidateStage, updateJob } = useAts();

  const job = jobs.find((j) => j.id === jobId);
  const pipeline = jobId ? getPipeline(jobId, candidates) : [];

  const [editingStatus, setEditingStatus] = useState(false);

  if (!job) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <h2>Job not found</h2>
        <button onClick={() => navigate('/jobs')} style={{ marginTop: 16, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer' }}>Back to Jobs</button>
      </div>
    );
  }

  const totalCandidates = candidates.filter((c) => c.jobId === jobId).length;

  return (
    <div>
      <PageHeader
        title={job.title}
        subtitle={`${job.department} · ${job.location} · ${job.type}`}
        actions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {editingStatus ? (
              <>
                {(['Open', 'Closed', 'Draft'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { updateJob(job.id, { status: s }); setEditingStatus(false); }}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                      border: '1px solid var(--color-border)',
                      background: job.status === s ? 'var(--color-primary)' : 'transparent',
                      color: job.status === s ? 'white' : 'inherit',
                      fontWeight: job.status === s ? 600 : 400,
                    }}
                  >
                    {s}
                  </button>
                ))}
                <button onClick={() => setEditingStatus(false)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', border: '1px solid var(--color-border)', background: 'transparent' }}>Cancel</button>
              </>
            ) : (
              <button
                onClick={() => setEditingStatus(true)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid var(--color-border)',
                  background: 'transparent', fontSize: 13, cursor: 'pointer',
                }}
              >
                Status: {job.status}
              </button>
            )}
            <button
              onClick={() => navigate('/jobs')}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', fontSize: 13, cursor: 'pointer' }}
            >
              ← Back
            </button>
          </div>
        }
      />

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[{ label: 'Total Candidates', value: totalCandidates }, { label: 'Department', value: job.department }, { label: 'Location', value: job.location }, { label: 'Type', value: job.type }].map((item) => (
          <div key={item.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline board */}
      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Pipeline Board</h2>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {pipeline.map(({ stage, candidates: stageCandidates }) => (
          <div
            key={stage}
            style={{
              minWidth: 220,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: 12,
              flex: '0 0 auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <StageBadge stage={stage} />
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', background: 'var(--color-bg)', borderRadius: 999, padding: '1px 8px', border: '1px solid var(--color-border)' }}>
                {stageCandidates.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stageCandidates.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/candidates/${c.id}`)}
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>{c.email}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {STAGE_ORDER.filter((s) => s !== stage && s !== 'Rejected').map((targetStage) => (
                      <button
                        key={targetStage}
                        onClick={(e) => { e.stopPropagation(); moveCandidateStage(c.id, targetStage as StageName); }}
                        style={{
                          fontSize: 10, padding: '2px 6px', borderRadius: 4,
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-surface)', cursor: 'pointer',
                        }}
                      >
                        → {targetStage}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
