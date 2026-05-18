import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import { useAts } from '@/hooks/useAtsStore';
import { STAGE_ORDER } from '@/lib/pipeline';
import type { StageName } from '@/types';
import { formatDate } from '@/lib/format';

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { candidates, jobs, users, moveCandidateStage, addCandidateNote, addCandidateEmail } = useAts();
  const candidate = candidates.find((c) => c.id === candidateId);
  const [noteContent, setNoteContent] = useState('');
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
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addCandidateNote(candidate.id, noteContent.trim());
    setNoteContent('');
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;
    addCandidateEmail(candidate.id, { subject: emailSubject, body: emailBody });
    setEmailSubject('');
    setEmailBody('');
  };

  return (
    <div>
      <Link to="/candidates" className="btn btn-ghost" style={{ marginBottom: 'var(--space-3)' }}><ArrowLeft size={14} /> Back to candidates</Link>
      <PageHeader
        title={candidate.name}
        subtitle={`${candidate.email} • ${job?.title ?? 'No job'}`}
        actions={
          <select className="select" style={{ width: 180 }} value={candidate.stage} onChange={(e) => moveCandidateStage(candidate.id, e.target.value as StageName)}>
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Add note</h3>
            <form onSubmit={submitNote}>
              <textarea
                className="textarea"
                placeholder="Interview feedback, observations, etc."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={3}
              />
              <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary"><MessageSquare size={14} /> Save note</button>
              </div>
            </form>
          </div>

          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Notes ({candidate.notes.length})</h3>
            {candidate.notes.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No notes yet.</p>
            ) : (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {candidate.notes.map((n) => (
                  <li key={n.id} style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 13, marginBottom: 4 }}>{n.content}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {userMap[n.authorId]?.name ?? 'Unknown'} • {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Send email</h3>
            <form onSubmit={sendEmail}>
              <div className="form-group">
                <label className="label">Subject</label>
                <input className="input" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">Body</label>
                <textarea className="textarea" rows={5} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary"><Mail size={14} /> Send (mock)</button>
              </div>
            </form>
          </div>

          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Email history ({candidate.emails.length})</h3>
            {candidate.emails.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No emails sent.</p>
            ) : (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {candidate.emails.map((e) => (
                  <li key={e.id} style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{e.subject}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                      To: {candidate.email} • {new Date(e.sentAt).toLocaleString()} • by {userMap[e.sentBy]?.name ?? 'Unknown'}
                    </div>
                    <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{e.body}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 13 }}>
              <div><strong>Stage:</strong> <StageBadge stage={candidate.stage} /></div>
              <div><strong>Phone:</strong> {candidate.phone || '—'}</div>
              <div><strong>LinkedIn:</strong> {candidate.linkedin || '—'}</div>
              <div><strong>Source:</strong> {candidate.source}</div>
              <div><strong>Applied:</strong> {formatDate(candidate.createdAt)}</div>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Stage history</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {candidate.stageHistory.map((h, i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <StageBadge stage={h.stage} /> <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{new Date(h.changedAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
