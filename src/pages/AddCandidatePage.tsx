import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import { STAGE_ORDER } from '@/lib/pipeline';
import PageHeader from '@/components/PageHeader';
import type { StageName } from '@/types';

export default function AddCandidatePage() {
  const { jobs, addCandidate } = useAts();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobId, setJobId] = useState('');
  const [stage, setStage] = useState<StageName>('Applied');
  const [source, setSource] = useState('');
  const [error, setError] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid var(--color-border)',
    fontSize: 13,
    color: 'var(--color-text)',
    background: 'var(--color-surface)',
    boxSizing: 'border-box',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    const candidate = addCandidate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      jobId: jobId || undefined,
      stage,
      source: source.trim() || undefined,
    });
    navigate(`/candidates/${candidate.id}`);
  };

  return (
    <div>
      <PageHeader title="Add Candidate" subtitle="Manually add a new candidate to the pipeline" />
      <div style={{
        background: 'var(--color-surface)', borderRadius: 10,
        border: '1px solid var(--color-border)', padding: 24, maxWidth: 560,
      }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 6,
              background: '#fee2e2', color: '#991b1b',
              fontSize: 13, marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name *</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email *</label>
            <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
            <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Job Position</label>
            <select style={inputStyle} value={jobId} onChange={(e) => setJobId(e.target.value)}>
              <option value="">— No specific job —</option>
              {jobs.filter((j) => j.status === 'Open').map((j) => (
                <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Stage</label>
            <select style={inputStyle} value={stage} onChange={(e) => setStage(e.target.value as StageName)}>
              {STAGE_ORDER.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Source</label>
            <input style={inputStyle} value={source} onChange={(e) => setSource(e.target.value)} placeholder="LinkedIn, Referral, etc." />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="submit"
              style={{
                padding: '8px 20px', borderRadius: 6,
                background: 'var(--color-primary)', color: 'white',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}
            >
              Add Candidate
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: '8px 20px', borderRadius: 6,
                background: 'transparent', color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: 13,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
