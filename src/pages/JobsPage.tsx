import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Building, Users, ChevronRight } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import type { Job, PipelineType } from '@/types';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Open: { bg: '#ecfdf5', color: '#10b981' },
  'On Hold': { bg: '#fffbeb', color: '#f59e0b' },
  Closed: { bg: '#f3f4f6', color: '#6b7280' },
};

function JobForm({ initial, onSave, onCancel }: {
  initial?: Partial<Job>;
  onSave: (data: Omit<Job, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    department: initial?.department ?? '',
    location: initial?.location ?? '',
    employmentType: initial?.employmentType ?? 'Full-time' as Job['employmentType'],
    status: initial?.status ?? 'Open' as Job['status'],
    description: initial?.description ?? '',
    requirements: initial?.requirements ?? '',
    pipelineType: initial?.pipelineType ?? 'Standard' as PipelineType,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form as any);
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)',
    borderRadius: 8, fontSize: 13, outline: 'none', background: 'white',
  };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 5 };
  const gridRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelStyle}>Job title *</label>
        <input style={inputStyle} value={form.title} onChange={(e) => set('title', e.target.value)} required />
      </div>
      <div style={gridRow}>
        <div>
          <label style={labelStyle}>Department</label>
          <input style={inputStyle} value={form.department} onChange={(e) => set('department', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Location</label>
          <input style={inputStyle} value={form.location} onChange={(e) => set('location', e.target.value)} />
        </div>
      </div>
      <div style={gridRow}>
        <div>
          <label style={labelStyle}>Employment type</label>
          <select style={inputStyle} value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)}>
            {['Full-time','Part-time','Contract','Internship'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={(e) => set('status', e.target.value)}>
            {['Open','On Hold','Closed'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Pipeline type</label>
        <select style={inputStyle} value={form.pipelineType} onChange={(e) => set('pipelineType', e.target.value)}>
          <option value="Standard">Standard (→ Hired → Rejected)</option>
          <option value="Onboarding">Onboarding (→ Hired → Onboarded)</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Requirements</label>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form.requirements} onChange={(e) => set('requirements', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 4 }}>
        <button type="button" onClick={onCancel} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)',
          background: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>Cancel</button>
        <button type="submit" style={{
          padding: '8px 16px', borderRadius: 8, border: 'none',
          background: 'var(--color-primary)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Save job</button>
      </div>
    </form>
  );
}

export default function JobsPage() {
  const { jobs, candidates, addJob, updateJob, deleteJob } = useAts();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  const candidateCount = (jobId: string) => candidates.filter((c) => c.jobId === jobId).length;

  return (
    <div>
      <PageHeader
        title="Job Postings"
        subtitle={`${jobs.filter((j) => j.status === 'Open').length} open roles`}
        actions={
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: 'var(--color-primary)', color: 'white',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Plus size={15} /> New job
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 32px',
              border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 13, outline: 'none',
            }}
          />
        </div>
        {['All', 'Open', 'On Hold', 'Closed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: '1px solid',
              borderColor: statusFilter === s ? 'var(--color-primary)' : 'var(--color-border)',
              background: statusFilter === s ? 'var(--color-primary-soft)' : 'white',
              color: statusFilter === s ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >{s}</button>
        ))}
      </div>

      {/* Job cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>No jobs found.</div>
        )}
        {filtered.map((job) => {
          const sc = STATUS_COLORS[job.status] ?? STATUS_COLORS['Closed'];
          return (
            <div key={job.id} style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 12, padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: 'var(--color-primary-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Building size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>{job.title}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: sc.bg, color: sc.color,
                  }}>{job.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 14, color: 'var(--color-text-muted)', fontSize: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Building size={12} /> {job.department || 'No dept'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MapPin size={12} /> {job.location || 'No location'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Users size={12} /> {candidateCount(job.id)} candidates
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setEditJob(job)}
                  style={{
                    padding: '6px 12px', borderRadius: 7, border: '1px solid var(--color-border)',
                    background: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--color-text)',
                  }}
                >Edit</button>
                <button
                  onClick={() => { if (confirm('Delete this job?')) deleteJob(job.id); }}
                  style={{
                    padding: '6px 12px', borderRadius: 7, border: '1px solid #fecaca',
                    background: '#fef2f2', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#dc2626',
                  }}
                >Delete</button>
                <Link
                  to={`/jobs/${job.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 12px', borderRadius: 7,
                    background: 'var(--color-primary)', color: 'white',
                    fontSize: 12, fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  View <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create new job" width={580}>
        <JobForm
          onSave={(data) => { addJob(data); setShowAdd(false); }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      <Modal open={!!editJob} onClose={() => setEditJob(null)} title="Edit job" width={580}>
        {editJob && (
          <JobForm
            initial={editJob}
            onSave={(data) => { updateJob(editJob.id, data); setEditJob(null); }}
            onCancel={() => setEditJob(null)}
          />
        )}
      </Modal>
    </div>
  );
}
