import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import StageBadge from '@/components/StageBadge';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { getPipeline } from '@/lib/pipeline';
import { fmtDate } from '@/lib/format';
import type { StageName } from '@/types';
import { Users } from 'lucide-react';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, candidates, updateJob } = useAts();

  const job = jobs.find((j) => j.id === jobId);
  const pipeline = job ? getPipeline(job.pipelineType) : getPipeline('Standard');
  const jobCandidates = candidates.filter((c) => c.jobId === jobId);

  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(job?.title ?? '');
  const [editDept, setEditDept] = useState(job?.department ?? '');
  const [editLoc, setEditLoc] = useState(job?.location ?? '');
  const [editStatus, setEditStatus] = useState<Job['status']>(job?.status ?? 'Open');
  const [editDesc, setEditDesc] = useState(job?.description ?? '');
  const [activeStage, setActiveStage] = useState<StageName | 'All'>('All');

  if (!job) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Job not found.
        <button onClick={() => navigate('/jobs')} style={{ marginLeft: 8, cursor: 'pointer' }}>Back to Jobs</button>
      </div>
    );
  }

  const filtered = activeStage === 'All'
    ? jobCandidates
    : jobCandidates.filter((c) => c.stage === activeStage);

  function handleSave() {
    updateJob(jobId!, {
      title: editTitle.trim(),
      department: editDept.trim(),
      location: editLoc.trim(),
      status: editStatus,
      description: editDesc.trim(),
    });
    setEditOpen(false);
  }

  const btnStyle: React.CSSProperties = {
    padding: '6px 14px', borderRadius: 6, border: '1px solid var(--color-border)',
    background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--color-text)',
  };

  type Job = import('@/types').Job;

  return (
    <div>
      <button onClick={() => navigate('/jobs')} style={{ ...btnStyle, marginBottom: 16, fontSize: 12 }}>← Back</button>

      {/* Job header */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>{job.title}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 4 }}>
              {job.department} · {job.location}
            </p>
            <p style={{ fontSize: 13, marginTop: 6 }}>
              Status: <strong>{job.status}</strong> · Pipeline: <strong>{job.pipelineType}</strong>
            </p>
          </div>
          <button style={btnStyle} onClick={() => {
            setEditTitle(job.title);
            setEditDept(job.department);
            setEditLoc(job.location);
            setEditStatus(job.status);
            setEditDesc(job.description ?? '');
            setEditOpen(true);
          }}>Edit</button>
        </div>
        {job.description && <p style={{ marginTop: 12, fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{job.description}</p>}
      </div>

      {/* Stage filter tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          onClick={() => setActiveStage('All')}
          style={{
            ...btnStyle,
            background: activeStage === 'All' ? 'var(--color-primary)' : 'transparent',
            color: activeStage === 'All' ? 'white' : 'var(--color-text)',
            border: activeStage === 'All' ? 'none' : '1px solid var(--color-border)',
          }}
        >
          All ({jobCandidates.length})
        </button>
        {pipeline.stages.map((stage) => {
          const count = jobCandidates.filter((c) => c.stage === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              style={{
                ...btnStyle,
                background: activeStage === stage ? 'var(--color-primary)' : 'transparent',
                color: activeStage === stage ? 'white' : 'var(--color-text)',
                border: activeStage === stage ? 'none' : '1px solid var(--color-border)',
              }}
            >
              {stage} ({count})
            </button>
          );
        })}
      </div>

      {/* Candidates table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No candidates"
          description={activeStage === 'All' ? 'No candidates for this job yet.' : `No candidates in ${activeStage}.`}
        />
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Stage</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Source</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600 }}>Applied</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/candidates/${c.id}`)}
                  style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                >
                  <td style={{ padding: '10px 16px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--color-text-muted)' }}>{c.email}</td>
                  <td style={{ padding: '10px 16px' }}><StageBadge stage={c.stage} /></td>
                  <td style={{ padding: '10px 16px', color: 'var(--color-text-muted)' }}>{c.source ?? '—'}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--color-text-muted)' }}>{fmtDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editOpen && (
        <div
          onClick={() => setEditOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-surface)', borderRadius: 12, padding: 24,
              width: '100%', maxWidth: 480,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Edit Job</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Title', editTitle, setEditTitle],
                ['Department', editDept, setEditDept],
                ['Location', editLoc, setEditLoc],
              ].map(([lbl, val, setter]) => (
                <div key={lbl as string}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>{lbl as string}</label>
                  <input
                    value={val as string}
                    onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: 6,
                      border: '1px solid var(--color-border)', fontSize: 13,
                      background: 'var(--color-surface)', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Job['status'])}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 6,
                    border: '1px solid var(--color-border)', fontSize: 13,
                    background: 'var(--color-surface)',
                  }}
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 6,
                    border: '1px solid var(--color-border)', fontSize: 13,
                    background: 'var(--color-surface)', resize: 'vertical', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setEditOpen(false)} style={btnStyle}>Cancel</button>
              <button
                onClick={handleSave}
                style={{ padding: '7px 18px', borderRadius: 6, border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
