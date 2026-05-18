import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, FileText, Send } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import { STAGES } from '@/lib/pipeline';
import type { StageName } from '@/types';

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { candidates, jobs, moveCandidateStage, addCandidateNote, addCandidateEmail, currentUser } = useAts();
  const candidate = candidates.find((c) => c.id === candidateId);
  const [note, setNote] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  if (!candidate) {
    return (
      <div>
        <PageHeader title="Candidate not found" />
        <Link to="/candidates" className="btn btn-ghost"><ArrowLeft size={14} /> Back to candidates</Link>
      </div>
    );
  }

  const job = jobs.find((j) => j.id === candidate.jobId);

  const handleAddNote = () => {
    if (!note.trim()) return;
    addCandidateNote(candidate.id, note.trim());
    setNote('');
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    addCandidateEmail(candidate.id, { subject: emailSubject, body: emailBody, to: candidate.email });
    setEmailSubject('');
    setEmailBody('');
  };

  return (
    <div>
      <Link to="/candidates" className="btn btn-ghost" style={{ marginBottom: 'var(--space-3)' }}>
        <ArrowLeft size={14} /> Back
      </Link>
      <PageHeader
        title={candidate.name}
        subtitle={`${candidate.email} • ${job?.title ?? 'No job'}`}
        actions={<StageBadge stage={candidate.stage} />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Stage</h3>
            <select
              className="input"
              value={candidate.stage}
              onChange={(e) => moveCandidateStage(candidate.id, e.target.value as StageName)}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-3)' }}><FileText size={14} style={{ verticalAlign: 'middle' }} /> Notes</h3>
            <textarea
              className="input"
              rows={3}
              placeholder="Add interview note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div style={{ marginTop: 'var(--space-2)', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={handleAddNote}>Add note</button>
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {candidate.notes.length === 0 && <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No notes yet.</div>}
              {candidate.notes.map((n) => (
                <div key={n.id} style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                    {n.author} • {new Date(n.createdAt).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 13 }}>{n.content}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-3)' }}><Mail size={14} style={{ verticalAlign: 'middle' }} /> Emails</h3>
            <input
              className="input"
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={{ marginBottom: 'var(--space-2)' }}
            />
            <textarea
              className="input"
              rows={4}
              placeholder="Email body"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
            <div style={{ marginTop: 'var(--space-2)', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={handleSendEmail}><Send size={14} /> Log email</button>
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {candidate.emails.length === 0 && <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No emails logged.</div>}
              {candidate.emails.map((e) => (
                <div key={e.id} style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                    To: {e.to} • {new Date(e.sentAt).toLocaleString()} • by {e.sentBy}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.subject}</div>
                  <div style={{ fontSize: 13, whiteSpace: 'pre-wrap', marginTop: 4 }}>{e.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ alignSelf: 'flex-start' }}>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Details</h3>
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div><strong>Phone:</strong> {candidate.phone || '—'}</div>
            <div><strong>Source:</strong> {candidate.source || '—'}</div>
            <div><strong>Added:</strong> {new Date(candidate.createdAt).toLocaleDateString()}</div>
            <div><strong>Viewing as:</strong> {currentUser?.name}</div>
          </div>
          <h3 style={{ margin: 'var(--space-4) 0 var(--space-2)' }}>Stage history</h3>
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {candidate.stageHistory.map((h, i) => (
              <div key={i}>
                <StageBadge stage={h.stage} /> <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{new Date(h.at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
