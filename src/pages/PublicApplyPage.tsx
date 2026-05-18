import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';

export default function PublicApplyPage() {
  const { jobId } = useParams();
  const { jobs, addCandidate } = useAts();
  const job = jobs.find((j) => j.id === jobId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!job) {
    return (
      <div style={{ maxWidth: 520, margin: '80px auto', padding: 'var(--space-6)' }} className="card">
        <h2>Job not found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>The job you are looking for does not exist or is no longer active.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Go to login</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    addCandidate({
      name: name.trim(),
      email: email.trim(),
      phone,
      linkedin,
      jobId: job.id,
      stage: 'Applied',
      source: 'Career site',
      customFields: {},
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 520, margin: '80px auto', padding: 'var(--space-6)' }} className="card">
        <h2>Thanks for applying!</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>We received your application for {job.title}. Our team will be in touch soon.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 'var(--space-6)' }} className="card">
      <h2>Apply for {job.title}</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontSize: 13 }}>{job.department} • {job.location}</p>
      <form onSubmit={submit} style={{ marginTop: 'var(--space-5)' }}>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-3)', fontSize: 13 }}>{error}</div>}
        <div className="form-group">
          <label className="label">Full name</label>
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
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit application</button>
      </form>
    </div>
  );
}
