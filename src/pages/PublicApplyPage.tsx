import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import { CheckCircle, Building2 } from 'lucide-react';

export default function PublicApplyPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, addCandidate } = useAts();
  const job = jobs.find((j) => j.id === jobId);

  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedinUrl: '', source: 'Public Apply' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Job not found</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>This position may no longer be available.</p>
          <Link to="/" style={{ color: 'var(--color-primary)', marginTop: 16, display: 'inline-block' }}>Go home</Link>
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
    addCandidate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      jobId: job.id,
      jobTitle: job.title,
      stage: 'Applied',
      rating: 0,
      tags: [],
      customFields: {},
      linkedinUrl: form.linkedinUrl,
      source: form.source,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <CheckCircle size={48} style={{ color: 'var(--color-success)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Application Submitted!</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Thank you for applying to <strong>{job.title}</strong>. We'll be in touch soon.</p>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid var(--color-border)', fontSize: 14,
    background: 'var(--color-bg)', color: 'var(--color-text)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520, background: 'var(--color-surface)', borderRadius: 12, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700 }}>{job.title}</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{job.department} · {job.location}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: 8, fontSize: 13 }}>{error}</div>}

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Full Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Email *</label>
            <input type="email" style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Phone</label>
            <input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 000 0000" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>LinkedIn URL</label>
            <input style={inputStyle} value={form.linkedinUrl} onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>How did you hear about us?</label>
            <select style={inputStyle} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              <option>Public Apply</option>
              <option>LinkedIn</option>
              <option>Indeed</option>
              <option>Referral</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px', borderRadius: 8,
              background: 'var(--color-primary)', color: 'white',
              border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              marginTop: 4,
            }}
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
