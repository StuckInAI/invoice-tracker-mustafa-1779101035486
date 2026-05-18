import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import { STAGES } from '@/lib/pipeline';
import type { StageName } from '@/types';

export default function AddCandidatePage() {
  const { jobs, addCandidate } = useAts();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobId, setJobId] = useState(jobs[0]?.id ?? '');
  const [stage, setStage] = useState<StageName>('Applied');
  const [source, setSource] = useState('Manual');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !jobId) {
      setError('Name, email and job are required.');
      return;
    }
    const c = addCandidate({ name: name.trim(), email: email.trim(), phone, jobId, stage, source, customFields: {} });
    navigate(`/candidates/${c.id}`);
  };

  return (
    <div>
      <Link to="/candidates" className="btn btn-ghost" style={{ marginBottom: 'var(--space-3)' }}>
        <ArrowLeft size={14} /> Back
      </Link>
      <PageHeader title="Add candidate" subtitle="Manually add a candidate to a job" />
      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div>
          <label className="label">Full name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="label">Job</label>
          <select className="input" value={jobId} onChange={(e) => setJobId(e.target.value)} required>
            <option value="">Select a job</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Stage</label>
          <select className="input" value={stage} onChange={(e) => setStage(e.target.value as StageName)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Source</label>
          <input className="input" value={source} onChange={(e) => setSource(e.target.value)} />
        </div>
        {error && <div style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
          <Link to="/candidates" className="btn btn-ghost">Cancel</Link>
          <button type="submit" className="btn btn-primary">Add candidate</button>
        </div>
      </form>
    </div>
  );
}
