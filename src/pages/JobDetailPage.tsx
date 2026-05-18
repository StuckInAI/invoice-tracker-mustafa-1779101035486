import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Briefcase, MapPin, Users, ChevronRight } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import { getPipeline } from '@/lib/pipeline';
import type { StageName } from '@/types';
import StageBadge from '@/components/StageBadge';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, candidates, moveCandidateStage } = useAts();
  const job = jobs.find((j) => j.id === jobId);

  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');

  if (!job) {
    return (
      <div>
        <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back to Jobs
        </Link>
        <p>Job not found.</p>
      </div>
    );
  }

  const pipeline = getPipeline(job.pipelineType);
  const jobCandidates = candidates.filter((c) => c.jobId === job.id);

  return (
    <div>
      <Link
        to="/jobs"
        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: 16 }}
      >
        <ArrowLeft size={14} /> Back to Jobs
      </Link>

      <PageHeader
        title={job.title}
        subtitle={`${job.department} · ${job.location}`}
        actions={
          <Link
            to={`/apply/${job.id}`}
            target="_blank"
            style={{
              padding: '7px 14px', borderRadius: 6,
              border: '1px solid var(--color-border)',
              fontSize: 13, color: 'var(--color-text)',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            Public Apply Link
          </Link>
        }
      />

      {/* Job meta */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        padding: '14px 20px',
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        fontSize: 13,
        color: 'var(--color-text-muted)',
        marginBottom: 24,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Briefcase size={14} /> {job.employmentType ?? 'Full-time'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={14} /> {job.location}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Users size={14} /> {jobCandidates.length} candidates
        </span>
        <span style={{
          padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          background: job.status === 'Open' ? '#dcfce7' : '#fee2e2',
          color: job.status === 'Open' ? '#166534' : '#991b1b',
        }}>
          {job.status}
        </span>
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['pipeline', 'list'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 13,
              border: '1px solid var(--color-border)',
              background: view === v ? 'var(--color-primary)' : 'transparent',
              color: view === v ? 'white' : 'var(--color-text-muted)',
              cursor: 'pointer', fontWeight: view === v ? 600 : 400,
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {jobCandidates.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No candidates yet"
          description="Share the public apply link or add candidates manually."
        />
      ) : view === 'pipeline' ? (
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12 }}>
          {pipeline.stages.map((stage) => {
            const stageCandidates = jobCandidates.filter((c) => c.stage === stage);
            return (
              <div
                key={stage}
                style={{
                  minWidth: 200,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: 12,
                  flex: '0 0 auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)' }}>{stage}</span>
                  <span style={{
                    background: 'var(--color-surface-alt)',
                    borderRadius: 999, fontSize: 11, fontWeight: 600,
                    padding: '1px 7px', color: 'var(--color-text-muted)',
                  }}>{stageCandidates.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stageCandidates.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>Empty</div>
                  ) : (
                    stageCandidates.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 8,
                          padding: 10,
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>{c.email}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {pipeline.stages
                            .filter((s) => s !== stage)
                            .slice(0, 3)
                            .map((s) => (
                              <button
                                key={s}
                                onClick={() => moveCandidateStage(c.id, s as StageName)}
                                style={{
                                  fontSize: 10, padding: '2px 6px', borderRadius: 4,
                                  border: '1px solid var(--color-border)',
                                  background: 'transparent', cursor: 'pointer',
                                  color: 'var(--color-text-muted)',
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
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {jobCandidates.map((c) => (
            <Link
              key={c.id}
              to={`/candidates/${c.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'var(--color-text)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.email}</div>
              </div>
              <StageBadge stage={c.stage} />
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
