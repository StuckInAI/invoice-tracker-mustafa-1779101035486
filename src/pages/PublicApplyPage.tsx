import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import type { StageName } from '@/types';

export default function PublicApplyPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, addCandidate } = useAts();
  const job = jobs.find((j) => j.id === jobId);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    linkedIn: '',
    source: 'Public Apply',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!job) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Job not found</h2>
        <p>This position may no longer be available.</p>
        <Link to="/">Return home</Link>
      </div>
    );
  }

  if (job.status !== 'Open') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Position Closed</h2>
        <p>This position is no longer accepting applications.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Name and email are required.');
      return;
    }
    addCandidate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      jobId: job.id,
      jobTitle: job.title,
      stage: 'Applied' as StageName,
      linkedIn: form.linkedIn,
      source: form.source,
      tags: [],
      customFields: [],
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Application Received!</h2>
        <p>Thank you for applying for <strong>{job.title}</strong>. We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{job.title}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>{job.department} · {job.location}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}
        {(['name', 'email', 'phone', 'linkedIn'] as const).map((field) => (
          <div key={field}>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>
              {field === 'linkedIn' ? 'LinkedIn URL' : field.charAt(0).toUpperCase() + field.slice(1)}
              {(field === 'name' || field === 'email') && ' *'}
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6,
                border: '1px solid var(--color-border)', fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            padding: '10px 20px', borderRadius: 6, border: 'none',
            background: 'var(--color-primary)', color: 'white',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
