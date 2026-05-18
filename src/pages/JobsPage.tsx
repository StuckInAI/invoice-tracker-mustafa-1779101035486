import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, MapPin, Users, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import type { Job, PipelineType, EmploymentType } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';

function buildForm(initial?: Partial<Job>) {
  return {
    title: initial?.title ?? '',
    department: initial?.department ?? '',
    location: initial?.location ?? '',
    status: initial?.status ?? 'Open' as Job['status'],
    employmentType: initial?.employmentType ?? 'Full-time' as EmploymentType,
    description: initial?.description ?? '',
    requirements: initial?.requirements ?? '',
    pipelineType: initial?.pipelineType ?? 'Standard' as PipelineType,
  };
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Open: { bg: '#dcfce7', color: '#166534' },
  Closed: { bg: '#fee2e2', color: '#991b1b' },
  Draft: { bg: '#f3f4f6', color: '#4b5563' },
};

export default function JobsPage() {
  const { jobs, candidates, addJob, updateJob, deleteJob } = useAts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState(buildForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setEditJob(null);
    setForm(buildForm());
    setModalOpen(true);
  };

  const openEdit = (job: Job) => {
    setEditJob(job);
    setForm(buildForm(job));
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editJob) {
      updateJob(editJob.id, form);
    } else {
      addJob(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteJob(id);
    setDeleteConfirm(null);
  };

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13, boxSizing: 'border-box' }}
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.filter((j) => j.status === 'Open').length} open positions`}
        actions={
          <button
            onClick={openCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'var(--color-primary)', color: 'white',
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Plus size={15} /> New Job
          </button>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={28} />}
          title="No jobs yet"
          description="Create your first job posting to start receiving applications."
          action={
            <button onClick={openCreate} style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13 }}>
              Create Job
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map((job) => {
            const count = candidates.filter((c) => c.jobId === job.id).length;
            const sc = STATUS_COLORS[job.status] ?? STATUS_COLORS.Draft;
            return (
              <div
                key={job.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{job.title}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: sc.bg, color: sc.color,
                    }}>{job.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={12} /> {job.department}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {count} candidate{count !== 1 ? 's' : ''}</span>
                    {job.employmentType && <span>{job.employmentType}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(job)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' }}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(job.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  <Link
                    to={`/jobs/${job.id}`}
                    style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)', padding: 4 }}
                  >
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Form Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editJob ? 'Edit Job' : 'New Job'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: '7px 16px', borderRadius: 6, border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
          </>
        }
      >
        {field('Job Title *', 'title')}
        {field('Department', 'department')}
        {field('Location', 'location')}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Job['status'] }))}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13 }}
          >
            <option>Open</option>
            <option>Draft</option>
            <option>Closed</option>
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Employment Type</label>
          <select
            value={form.employmentType}
            onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value as EmploymentType }))}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13 }}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Pipeline Type</label>
          <select
            value={form.pipelineType}
            onChange={(e) => setForm((f) => ({ ...f, pipelineType: e.target.value as PipelineType }))}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13 }}
          >
            <option>Standard</option>
            <option>Technical</option>
            <option>Executive</option>
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Requirements</label>
          <textarea
            value={form.requirements}
            onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
            rows={3}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Job"
        footer={
          <>
            <button onClick={() => setDeleteConfirm(null)} style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} style={{ padding: '7px 16px', borderRadius: 6, border: 'none', background: '#ef4444', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
          </>
        }
      >
        <p style={{ fontSize: 14 }}>Are you sure you want to delete this job? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
