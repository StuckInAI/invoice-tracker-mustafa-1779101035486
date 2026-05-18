import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import { STAGE_ORDER } from '@/lib/pipeline';
import PageHeader from '@/components/PageHeader';

export default function AddCandidatePage() {
  const { addCandidate, jobs } = useAts();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobId, setJobId] = useState('');
  const [stage, setStage] = useState<import('@/types').StageName>('Applied');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const job = jobs.find((j) => j.id === jobId);
    addCandidate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      jobId: jobId,
      jobTitle: job?.title ?? '',
      stage,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      rating: 0,
      customFields: {},
      source: source.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
    });
    navigate('/candidates');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid var(--color-border)', fontSize: 13,
    background: 'var(--color-surface)', boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <PageHeader title="Add Candidate" subtitle="Create a new candidate profile" />
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--color-surface)', padding: 24, borderRadius: 12, border: '1px solid var(--color-border)' }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Full Name *</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Email *</label>
            <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Phone</label>
            <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Job</label>
            <select style={inputStyle} value={jobId} onChange={(e) => setJobId(e.target.value)}>
              <option value="">-- No job --</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Stage</label>
            <select style={inputStyle} value={stage} onChange={(e) => setStage(e.target.value as import('@/types').StageName)}>
              {STAGE_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
            <input style={inputStyle} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="remote, senior" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Source</label>
            <input style={inputStyle} value={source} onChange={(e) => setSource(e.target.value)} placeholder="LinkedIn, Referral..." />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>LinkedIn URL</label>
            <input style={inputStyle} value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={() => navigate('/candidates')} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Add Candidate</button>
          </div>
        </div>
      </form>
    </div>
  );
}
