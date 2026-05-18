import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';

export default function PublicApplyPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, addCandidate } = useAts();

  const job = jobs.find((j) => j.id === jobId);

  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedinUrl: '', source: 'Public Apply' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Job Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>This position may no longer be available.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setError('');
    addCandidate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      jobId: job.id,
      jobTitle: job.title,
      stage: 'Applied',
      tags: [],
      customFields: {},
      linkedinUrl: form.linkedinUrl,
      source: form.source,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Application Submitted!</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Thank you for applying to <strong>{job.title}</strong>. We'll be in touch soon.</p>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid var(--color-border)',
    fontSize: 14,
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{job.title}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            {job.department}{job.location ? ` · ${job.location}` : ''}
          </p>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Apply for this position</h2>
          {error && <div style={{ padding: '10px 14px', borderRadius: 7, background: '#fee2e2', color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Jane Smith" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="jane@example.com" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="+1 555 000 0000" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>LinkedIn URL</label>
                <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} style={inputStyle} placeholder="https://linkedin.com/in/..." />
              </div>
              <button
                type="submit"
                style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
