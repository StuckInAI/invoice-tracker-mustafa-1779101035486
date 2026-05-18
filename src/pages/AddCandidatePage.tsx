import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import { STAGE_ORDER } from '@/lib/pipeline';
import PageHeader from '@/components/PageHeader';
import type { StageName } from '@/types';

export default function AddCandidatePage() {
  const { addCandidate, jobs } = useAts();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [jobId, setJobId] = useState(jobs[0]?.id ?? '');
  const [stage, setStage] = useState<StageName>('Applied');
  const [source, setSource] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!jobId) {
      setError('Please select a job.');
      return;
    }
    const c = addCandidate({
      name: name.trim(),
      email: email.trim(),
      phone,
      linkedin,
      jobId,
      stage,
      source,
      customFields: [],
    });
    navigate(`/candidates/${c.id}`);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 6,
    border: '1px solid var(--color-border)', fontSize: 14,
    background: 'var(--color-surface)', color: 'var(--color-text)',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 500,
    marginBottom: 4, color: 'var(--color-text)',
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <PageHeader title="Add Candidate" subtitle="Manually add a new candidate" />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: 13 }}>
            {error}
          </div>
        )}
        <div><label style={labelStyle}>Full Name *</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" /></div>
        <div><label style={labelStyle}>Email *</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" /></div>
        <div><label style={labelStyle}>Phone</label>
          <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" /></div>
        <div><label style={labelStyle}>LinkedIn URL</label>
          <input style={inputStyle} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
        <div><label style={labelStyle}>Job *</label>
          <select style={inputStyle} value={jobId} onChange={(e) => setJobId(e.target.value)}>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select></div>
        <div><label style={labelStyle}>Stage</label>
          <select style={inputStyle} value={stage} onChange={(e) => setStage(e.target.value as StageName)}>
            {STAGE_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select></div>
        <div><label style={labelStyle}>Source</label>
          <input style={inputStyle} value={source} onChange={(e) => setSource(e.target.value)} placeholder="LinkedIn, Referral, Website..." /></div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate(-1)}
            style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', fontSize: 14, cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="submit"
            style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Add Candidate
          </button>
        </div>
      </form>
    </div>
  );
}
