import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Pencil, Archive, Trash2, ExternalLink } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { useAts } from '@/hooks/useAtsStore';
import { formatDate } from '@/lib/format';
import type { Job, JobStatus, PipelineType } from '@/types';
import styles from './JobsPage.module.css';

type JobForm = {
  title: string;
  department: string;
  location: string;
  description: string;
  status: JobStatus;
  pipelineType: PipelineType;
};

const EMPTY_FORM: JobForm = {
  title: '',
  department: '',
  location: '',
  description: '',
  status: 'Open',
  pipelineType: 'Standard',
};

export default function JobsPage() {
  const { jobs, candidates, addJob, updateJob, deleteJob } = useAts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(EMPTY_FORM);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description,
      status: job.status,
      pipelineType: job.pipelineType,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      updateJob(editingId, form);
    } else {
      addJob(form);
    }
    setModalOpen(false);
  };

  const handleArchive = (job: Job) => {
    updateJob(job.id, { status: job.status === 'Open' ? 'Closed' : 'Open' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this job and all linked candidates?')) deleteJob(id);
  };

  const countFor = (jobId: string) => candidates.filter((c) => c.jobId === jobId).length;

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Manage open roles and requisitions"
        actions={
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} /> New Job
          </button>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={20} />}
          title="No jobs yet"
          description="Create your first open role to start tracking candidates."
          action={<button className="btn btn-primary" onClick={openCreate}><Plus size={14} /> New Job</button>}
        />
      ) : (
        <div className={styles.grid}>
          {jobs.map((job) => (
            <div key={job.id} className={`card ${styles.jobCard}`}>
              <div className={styles.cardTop}>
                <span className={job.status === 'Open' ? styles.statusOpen : styles.statusClosed}>
                  {job.status}
                </span>
                <span className={styles.pipelineTag}>{job.pipelineType}</span>
              </div>
              <Link to={`/jobs/${job.id}`} className={styles.jobTitle}>
                {job.title}
              </Link>
              <div className={styles.jobMeta}>
                {job.department} • {job.location}
              </div>
              <div className={styles.jobDesc}>{job.description || 'No description provided.'}</div>
              <div className={styles.jobFooter}>
                <div className={styles.jobStat}>
                  <strong>{countFor(job.id)}</strong> candidates
                </div>
                <div className={styles.jobActions}>
                  <Link to={`/apply/${job.id}`} className="btn btn-ghost" target="_blank" title="Public apply link">
                    <ExternalLink size={14} />
                  </Link>
                  <button className="btn btn-ghost" onClick={() => openEdit(job)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button className="btn btn-ghost" onClick={() => handleArchive(job)} title="Toggle status">
                    <Archive size={14} />
                  </button>
                  <button className="btn btn-ghost" onClick={() => handleDelete(job.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className={styles.createdAt}>Created {formatDate(job.createdAt)}</div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Job' : 'New Job'}
        footer={
          <>
            <button className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{editingId ? 'Save' : 'Create'}</button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Department</label>
            <input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className={styles.full}>
            <label className="label">Pipeline Type</label>
            <select className="select" value={form.pipelineType} onChange={(e) => setForm({ ...form, pipelineType: e.target.value as PipelineType })}>
              <option value="Standard">Standard (ends with Rejected)</option>
              <option value="Onboarding">Onboarding (ends with Onboarded)</option>
            </select>
          </div>
          <div className={styles.full}>
            <label className="label">Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
