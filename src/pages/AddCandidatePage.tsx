import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useAts } from '@/hooks/useAtsStore';
import type { StageName } from '@/types';
import { STAGE_ORDER } from '@/lib/pipeline';

export default function AddCandidatePage() {
  const { jobs, addCandidate } = useAts();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [jobId, setJobId] = useState(jobs[0]?.id ?? '');
  const [stage, setStage] = useState<StageName>('Applied');
  const [source, setSource] = useState('Manual');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !jobId) {
      setError('Name, email, and job are required.');
      return;
    }
    const c = addCandidate({ name: name.trim(), email: email.trim(), phone, linkedin, jobId, stage, source, customFields: {} });
    navigate(`/candidates/${c.id}`);
  };

  return (
    <div>
      <PageHeader title="Add candidate" subtitle="Create a new candidate record" />
      <form onSubmit={submit} className="card" style={{ padding: 'var(--space-6)', maxWidth: 640 }}>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-3)', fontSize: 13 }}>{error}</div>}
        <div className="form-group">
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">Phone</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">LinkedIn</label>
          <input className="input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Job</label>
          <select className="select" value={jobId} onChange={(e) => setJobId(e.target.value)} required>
            <option value="">Select job</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Stage</label>
          <select className="select" value={stage} onChange={(e) => setStage(e.target.value as StageName)}>
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Source</label>
          <input className="input" value={source} onChange={(e) => setSource(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary">Create candidate</button>
        </div>
      </form>
    </div>
  );
}
