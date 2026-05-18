import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Briefcase } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import type { Job, PipelineType, EmploymentType } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';

function initForm(initial?: Partial<Job>) {
  return {
    title: initial?.title ?? '',
    department: initial?.department ?? '',
    location: initial?.location ?? '',
    description: initial?.description ?? '',
    requirements: initial?.requirements ?? '',
    status: (initial?.status ?? 'Open') as Job['status'],
    employmentType: (initial?.employmentType ?? 'Full-time') as EmploymentType,
    pipelineType: (initial?.pipelineType ?? 'Standard') as PipelineType,
  };
}

export default function JobsPage() {
  const navigate = useNavigate();
  const { jobs, addJob, updateJob, deleteJob, candidates } = useAts();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState(initForm());

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (mode: 'add' | 'edit', job?: Job) => {
    setEditingJob(job ?? null);
    setForm(initForm(job));
    setModal(mode);
  };

  const closeModal = () => {
    setModal(null);
    setEditingJob(null);
    setForm(initForm());
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (modal === 'add') {
      const job = addJob({
        ...form,
        createdBy: 'current-user',
      });
      navigate(`/jobs/${job.id}`);
    } else if (modal === 'edit' && editingJob) {
      updateJob(editingJob.id, form);
    }
    closeModal();
  };

  const btnBase: React.CSSProperties = {
    padding: '7px 14px',
    borderRadius: 7,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 7,
    border: '1px solid var(--color-border)',
    fontSize: 13,
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} job${jobs.length !== 1 ? 's' : ''}`}
        actions={
          <button
            onClick={() => openModal('add')}
            style={{ ...btnBase, background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> New Job
          </button>
        }
      />

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 360, marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs..."
          style={{ ...inputStyle, paddingLeft: 32 }}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={24} />}
          title="No jobs found"
          description={search ? 'Try a different search.' : 'Create your first job posting.'}
          action={
            !search ? (
              <button
                onClick={() => openModal('add')}
                style={{ ...btnBase, background: 'var(--color-primary)', color: 'white' }}
              >
                New Job
              </button>
            ) : undefined
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((job) => {
            const count = candidates.filter((c) => c.jobId === job.id).length;
            return (
              <div
                key={job.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 10,
                  border: '1px solid var(--color-border)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s',
                }}
                onClick={() => navigate(`/jobs/${job.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: 'var(--color-primary-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Briefcase size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{job.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {job.department}{job.location ? ` · ${job.location}` : ''}
                    {job.employmentType && <span> · {job.employmentType}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                    background: job.status === 'Open' ? '#dcfce7' : job.status === 'Draft' ? '#fef3c7' : '#fee2e2',
                    color: job.status === 'Open' ? '#16a34a' : job.status === 'Draft' ? '#d97706' : '#dc2626',
                  }}>
                    {job.status}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{count} candidate{count !== 1 ? 's' : ''}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); openModal('edit', job); }}
                    style={{ ...btnBase, padding: '5px 10px', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this job?')) deleteJob(job.id); }}
                    style={{ ...btnBase, padding: '5px 10px', background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={!!modal}
        onClose={closeModal}
        title={modal === 'add' ? 'New Job' : 'Edit Job'}
        width={560}
        footer={
          <>
            <button onClick={closeModal} style={{ ...btnBase, background: 'var(--color-surface-alt)', color: 'var(--color-text)' }}>Cancel</button>
            <button onClick={handleSave} style={{ ...btnBase, background: 'var(--color-primary)', color: 'white' }}>Save</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Job Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="e.g. Senior Engineer" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} style={inputStyle} placeholder="Engineering" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="Remote" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Employment Type</label>
              <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value as EmploymentType })} style={inputStyle}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Job['status'] })} style={inputStyle}>
                <option>Open</option>
                <option>Draft</option>
                <option>Closed</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Pipeline Type</label>
            <select value={form.pipelineType} onChange={(e) => setForm({ ...form, pipelineType: e.target.value as PipelineType })} style={inputStyle}>
              <option>Standard</option>
              <option>Technical</option>
              <option>Executive</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Role overview..." />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Requirements</label>
            <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Key requirements..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
