import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Job, PipelineType, EmploymentType } from '@/types';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { Briefcase, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';

function buildForm(initial?: Partial<Job>) {
  return {
    title: initial?.title ?? '',
    department: initial?.department ?? '',
    location: initial?.location ?? '',
    status: (initial?.status ?? 'Open') as Job['status'],
    description: initial?.description ?? '',
    requirements: initial?.requirements ?? '',
    employmentType: (initial?.employmentType ?? 'Full-time') as EmploymentType,
    pipelineType: (initial?.pipelineType ?? 'Standard') as PipelineType,
  };
}

type JobForm = ReturnType<typeof buildForm>;

export default function JobsPage() {
  const { jobs, addJob, updateJob, deleteJob, currentUser } = useAts();
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(buildForm());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Recruiter';

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setEditJob(null);
    setForm(buildForm());
    setShowModal(true);
  };

  const openEdit = (job: Job) => {
    setEditJob(job);
    setForm(buildForm(job));
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editJob) {
      updateJob(editJob.id, form);
    } else {
      addJob({
        ...form,
        description: form.description,
        requirements: form.requirements,
        employmentType: form.employmentType,
        pipelineType: form.pipelineType,
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this job? All associated candidates will be unlinked.')) {
      deleteJob(id);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid var(--color-border)', fontSize: 14,
    background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box',
  };
  const textarea: React.CSSProperties = { ...inp, resize: 'vertical', minHeight: 80 };

  const statusColor: Record<string, string> = {
    Open: '#16a34a', Closed: '#dc2626', Draft: '#d97706',
  };
  const statusBg: Record<string, string> = {
    Open: '#dcfce7', Closed: '#fee2e2', Draft: '#fef3c7',
  };

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} position${jobs.length !== 1 ? 's' : ''}`}
        actions={
          canEdit ? (
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
          ) : undefined
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 13, width: 220, background: 'var(--color-bg)', color: 'var(--color-text)' }}
        />
        {(['All', 'Open', 'Closed', 'Draft'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: `1px solid ${statusFilter === s ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: statusFilter === s ? 'var(--color-primary-soft)' : 'transparent',
              color: statusFilter === s ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Job list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={28} />}
          title="No jobs found"
          description={search ? 'Try a different search.' : 'Create your first job posting.'}
          action={
            canEdit ? (
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
            ) : undefined
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((job) => (
            <div
              key={job.id}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <Link
                    to={`/jobs/${job.id}`}
                    style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text)', textDecoration: 'none' }}
                  >
                    {job.title}
                  </Link>
                  <span style={{
                    padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: statusBg[job.status], color: statusColor[job.status],
                  }}>
                    {job.status}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {job.department}
                  {job.location && <span> · {job.location}</span>}
                  {job.employmentType && <span> · {job.employmentType}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <Link
                  to={`/apply/${job.id}`}
                  target="_blank"
                  title="Public apply link"
                  style={{
                    padding: 6, borderRadius: 6, color: 'var(--color-text-muted)',
                    background: 'transparent', border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <ExternalLink size={14} />
                </Link>
                {canEdit && (
                  <>
                    <button
                      onClick={() => openEdit(job)}
                      style={{
                        padding: 6, borderRadius: 6, color: 'var(--color-text-muted)',
                        background: 'transparent', border: '1px solid var(--color-border)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      style={{
                        padding: 6, borderRadius: 6, color: '#dc2626',
                        background: 'transparent', border: '1px solid #fecaca',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editJob ? 'Edit Job' : 'New Job'}
        footer={
          <>
            <button
              onClick={() => setShowModal(false)}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--color-text)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              {editJob ? 'Save Changes' : 'Create Job'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Job Title *</label>
            <input style={inp} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Engineer" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Department</label>
              <input style={inp} value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} placeholder="Engineering" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Location</label>
              <input style={inp} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Remote" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Status</label>
              <select style={inp} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Job['status'] }))}>
                <option>Open</option>
                <option>Closed</option>
                <option>Draft</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Employment Type</label>
              <select style={inp} value={form.employmentType} onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value as EmploymentType }))}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Pipeline Type</label>
            <select style={inp} value={form.pipelineType} onChange={(e) => setForm((f) => ({ ...f, pipelineType: e.target.value as PipelineType }))}>
              <option>Standard</option>
              <option>Technical</option>
              <option>Executive</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Description</label>
            <textarea style={textarea} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Role overview..." />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Requirements</label>
            <textarea style={textarea} value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} placeholder="Required skills and experience..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
