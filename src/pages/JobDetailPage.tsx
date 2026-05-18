import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Users, Copy, CheckCheck, ExternalLink } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import StageBadge from '@/components/StageBadge';
import PageHeader from '@/components/PageHeader';
import { getPipeline, STAGE_COLORS, STAGE_BG } from '@/lib/pipeline';
import type { StageName } from '@/types';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, candidates, moveCandidateStage } = useAts();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<StageName | null>(null);

  const job = jobs.find((j) => j.id === jobId);
  if (!job) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>Job not found.</p>
      <Link to="/jobs">← Back to jobs</Link>
    </div>
  );

  const pipeline = getPipeline(job.pipelineType);
  const jobCandidates = candidates.filter((c) => c.jobId === jobId);

  const applyUrl = `${window.location.origin}/apply/${jobId}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(applyUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragStart = (candidateId: string) => setDraggedId(candidateId);
  const handleDragOver = (e: React.DragEvent, stage: StageName) => {
    e.preventDefault();
    setDragOverStage(stage);
  };
  const handleDrop = (e: React.DragEvent, stage: StageName) => {
    e.preventDefault();
    if (draggedId) moveCandidateStage(draggedId, stage);
    setDraggedId(null);
    setDragOverStage(null);
  };
  const handleDragEnd = () => { setDraggedId(null); setDragOverStage(null); };

  return (
    <div>
      <PageHeader
        title={job.title}
        subtitle={`${job.department} · ${job.location}`}
        actions={
          <Link to="/jobs" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: '1px solid var(--color-border)', background: 'white',
            fontSize: 13, fontWeight: 500, color: 'var(--color-text)', textDecoration: 'none',
          }}>
            <ArrowLeft size={14} /> Back to jobs
          </Link>
        }
      />

      {/* Job meta */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 12, padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>
              <MapPin size={14} /> {job.location}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>
              <Briefcase size={14} /> {job.employmentType ?? 'Full-time'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>
              <Users size={14} /> {jobCandidates.length} candidates
            </div>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              background: job.status === 'Open' ? '#ecfdf5' : '#f3f4f6',
              color: job.status === 'Open' ? '#10b981' : '#6b7280',
            }}>{job.status}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleCopyLink}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 7,
                border: '1px solid var(--color-border)', background: 'white',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--color-text)',
              }}
            >
              {copied ? <><CheckCheck size={13} /> Copied!</> : <><Copy size={13} /> Copy apply link</>}
            </button>
            <a
              href={applyUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 7,
                background: 'var(--color-primary)', color: 'white',
                fontSize: 12, fontWeight: 500, textDecoration: 'none',
              }}
            >
              <ExternalLink size={13} /> Public form
            </a>
            <Link
              to={`/candidates/new?jobId=${jobId}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 7,
                background: 'var(--color-primary)', color: 'white',
                fontSize: 12, fontWeight: 500, textDecoration: 'none',
              }}
            >+ Add candidate</Link>
          </div>
        </div>
        {job.description && (
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{job.description}</p>
        )}
      </div>

      {/* Kanban */}
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Pipeline board</h3>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
        {pipeline.map((stage) => {
          const stageCandidates = jobCandidates.filter((c) => c.stage === stage);
          const isOver = dragOverStage === stage;
          return (
            <div
              key={stage}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDrop={(e) => handleDrop(e, stage)}
              onDragLeave={() => setDragOverStage(null)}
              style={{
                minWidth: 200, width: 200, flexShrink: 0,
                background: isOver ? '#f0f4ff' : 'var(--color-surface-alt)',
                borderRadius: 10,
                border: `2px ${isOver ? 'dashed #6366f1' : 'solid transparent'}`,
                transition: 'border-color 0.15s, background 0.15s',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Stage header */}
              <div style={{
                padding: '10px 12px 8px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STAGE_COLORS[stage] }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)' }}>{stage}</span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 999,
                  background: STAGE_BG[stage], color: STAGE_COLORS[stage],
                }}>{stageCandidates.length}</span>
              </div>

              {/* Candidate cards */}
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 80 }}>
                {stageCandidates.map((c) => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={() => handleDragStart(c.id)}
                    onDragEnd={handleDragEnd}
                    style={{
                      background: 'white',
                      border: `1px solid ${draggedId === c.id ? '#6366f1' : 'var(--color-border)'}`,
                      borderRadius: 8, padding: '10px',
                      cursor: 'grab', opacity: draggedId === c.id ? 0.5 : 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>{c.source ?? 'Unknown source'}</div>
                    <Link
                      to={`/candidates/${c.id}`}
                      style={{
                        fontSize: 11, color: 'var(--color-primary)',
                        fontWeight: 500, textDecoration: 'none',
                      }}
                    >View profile →</Link>
                  </div>
                ))}
                {stageCandidates.length === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>No candidates</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
