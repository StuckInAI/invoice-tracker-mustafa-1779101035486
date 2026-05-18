import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import Modal from '@/components/Modal';
import { STAGES } from '@/lib/pipeline';
import { renderTemplate, TEMPLATES } from '@/lib/emailTemplates';
import type { StageName } from '@/types';

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const {
    candidates,
    jobs,
    users,
    moveCandidateStage,
    addCandidateNote,
    addCandidateEmail,
  } = useAts();

  const candidate = candidates.find((c) => c.id === candidateId);
  const job = candidate?.jobId ? jobs.find((j) => j.id === candidate.jobId) : undefined;

  const [noteText, setNoteText] = useState('');
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const userMap = useMemo(() => {
    const m: Record<string, { name: string }> = {};
    users.forEach((u) => (m[u.id] = { name: u.name }));
    return m;
  }, [users]);

  if (!candidate) {
    return <div>Candidate not found. <Link to="/candidates">Back</Link></div>;
  }

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    addCandidateEmail(candidate.id, { to: candidate.email, subject: emailSubject, body: emailBody });
    setEmailOpen(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    const tpl = TEMPLATES[key];
    setEmailSubject(renderTemplate(tpl.subject, { candidate, job }));
    setEmailBody(renderTemplate(tpl.body, { candidate, job }));
  };

  return (
    <div>
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back
      </button>
      <PageHeader
        title={candidate.name}
        subtitle={`${candidate.email}${candidate.phone ? ' • ' + candidate.phone : ''}`}
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => setEmailOpen(true)}>
              <Mail size={14} /> Email
            </button>
          </>
        }
      />

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Current stage:</span>
          <StageBadge stage={candidate.stage} />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STAGES.map((s) => (
              <button
                key={s}
                className={`btn ${s === candidate.stage ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => moveCandidateStage(candidate.id, s as StageName)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}><MessageSquare size={14} style={{ verticalAlign: 'middle' }} /> Notes</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <textarea
                className="textarea"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add an interview note..."
                rows={3}
              />
            </div>
            <button
              className="btn btn-primary"
              disabled={!noteText.trim()}
              onClick={() => {
                addCandidateNote(candidate.id, noteText.trim());
                setNoteText('');
              }}
            >
              <Send size={14} /> Add note
            </button>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {candidate.notes.length === 0 && (
                <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No notes yet.</div>
              )}
              {candidate.notes.map((n) => (
                <div key={n.id} style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {n.createdBy} • {new Date(n.createdAt).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 14 }}>{n.content}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 12 }}><Mail size={14} style={{ verticalAlign: 'middle' }} /> Email history</h3>
            {candidate.emails.length === 0 && (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No emails sent.</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {candidate.emails.map((e) => (
                <div key={e.id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    To: {e.to} • {new Date(e.sentAt).toLocaleString()} • by {e.sentBy}
                  </div>
                  <div style={{ fontWeight: 500, fontSize: 14, margin: '4px 0' }}>{e.subject}</div>
                  <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{e.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12 }}>Details</h3>
            <div style={{ fontSize: 13, display: 'grid', gap: 8 }}>
              <div><strong>Job:</strong> {job ? <Link to={`/jobs/${job.id}`}>{job.title}</Link> : '—'}</div>
              <div><strong>Source:</strong> {candidate.source ?? '—'}</div>
              <div><strong>LinkedIn:</strong> {candidate.linkedin ? <a href={candidate.linkedin} target="_blank" rel="noreferrer">Profile</a> : '—'}</div>
              <div><strong>Created:</strong> {new Date(candidate.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Stage history</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {candidate.stageHistory.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <StageBadge stage={h.stage} /> <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{new Date(h.at).toLocaleString()}</span>
                  {userMap[h.changedBy] ? null : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        title={`Email ${candidate.name}`}
        width={600}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEmailOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSendEmail}>
              <Send size={14} /> Send
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map((k) => (
            <button key={k} className="btn btn-ghost" onClick={() => applyTemplate(k)}>
              {TEMPLATES[k].name}
            </button>
          ))}
        </div>
        <div className="form-group">
          <label className="label">To</label>
          <input className="input" value={candidate.email} disabled />
        </div>
        <div className="form-group">
          <label className="label">Subject</label>
          <input className="input" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Body</label>
          <textarea className="textarea" rows={10} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
