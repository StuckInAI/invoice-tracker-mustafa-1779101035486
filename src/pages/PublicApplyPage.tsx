import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';

export default function PublicApplyPage() {
  const { jobId } = useParams();
  const { jobs, addCandidate } = useAts();
  const job = jobs.find((j) => j.id === jobId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!job) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 'var(--space-6)' }}>
        <div className="card">
          <h2>Job not found</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>This application link is no longer available.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    addCandidate({
      name: name.trim(),
      email: email.trim(),
      phone,
      jobId: job.id,
      stage: 'Applied',
      source: 'Public apply',
      customFields: {},
    });
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 'var(--space-6)' }}>
      <div className="card">
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Apply for {job.title}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 'var(--space-4)' }}>{job.department} • {job.location}</p>
        {submitted ? (
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
            <strong>Thanks for applying!</strong>
            <p style={{ fontSize: 13, marginTop: 4 }}>We have received your application and will be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
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
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</div>}
            <button type="submit" className="btn btn-primary">Submit application</button>
          </form>
        )}
      </div>
    </div>
  );
}
