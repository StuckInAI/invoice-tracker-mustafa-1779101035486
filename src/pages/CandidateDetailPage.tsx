import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, FileText, Plus, ChevronDown } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import { STAGE_ORDER } from '@/lib/pipeline';
import { renderTemplate, TEMPLATES } from '@/lib/emailTemplates';
import Modal from '@/components/Modal';
import StageBadge from '@/components/StageBadge';
import { fmtDate } from '@/lib/format';
import type { StageName } from '@/types';

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const {
    candidates, jobs, moveCandidateStage,
    addCandidateNote, addCandidateEmail, currentUser,
  } = useAts();

  const candidate = candidates.find((c) => c.id === candidateId);
  const job = jobs.find((j) => j.id === candidate?.jobId);

  const [noteText, setNoteText] = useState('');
  const [emailModal, setEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  if (!candidate) {
    return (
      <div style={{ padding: 32 }}>
        <p>Candidate not found.</p>
        <button className="btn btn-ghost" onClick={() => navigate('/candidates')}>Back</button>
      </div>
    );
  }

  const handleStageChange = (stage: StageName) => {
    moveCandidateStage(candidate.id, stage);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addCandidateNote(candidate.id, noteText.trim());
    setNoteText('');
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    addCandidateEmail(candidate.id, {
      subject: emailSubject,
      body: emailBody,
      to: candidate.email,
    });
    setEmailModal(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const applyTemplate = (key: string) => {
    const tpl = TEMPLATES[key];
    if (!tpl) return;
    const rendered = renderTemplate(tpl, {
      candidateName: candidate.name,
      jobTitle: job?.title ?? '',
    });
    setEmailSubject(rendered.subject);
    setEmailBody(rendered.body);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 6,
    border: '1px solid var(--color-border)', fontSize: 13,
    background: 'var(--color-bg)', color: 'var(--color-text)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none',
          color: 'var(--color-text-muted)', cursor: 'pointer',
          fontSize: 13, marginBottom: 20, padding: 0,
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header card */}
      <div style={{
        background: 'var(--color-surface)', borderRadius: 12,
        border: '1px solid var(--color-border)', padding: 24, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{candidate.name}</h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--color-text-muted)', fontSize: 13 }}>
              {candidate.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Mail size={13} /> {candidate.email}
                </span>
              )}
              {candidate.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={13} /> {candidate.phone}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StageBadge stage={candidate.currentStage} />
            <div style={{ position: 'relative' }}>
              <select
                value={candidate.currentStage}
                onChange={(e) => handleStageChange(e.target.value as StageName)}
                style={{ ...inputStyle, width: 'auto', paddingRight: 28, cursor: 'pointer' }}
              >
                {STAGE_ORDER.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setEmailModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              background: 'var(--color-primary)', color: 'white',
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Mail size={14} /> Send Email
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Notes */}
        <div style={{
          background: 'var(--color-surface)', borderRadius: 12,
          border: '1px solid var(--color-border)', padding: 20,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Notes</h2>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder="Add a note…"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={handleAddNote}
              style={{
                padding: '8px 14px', borderRadius: 6,
                background: 'var(--color-primary)', color: 'white',
                border: 'none', fontSize: 13, cursor: 'pointer',
              }}
            >
              <Plus size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {candidate.notes.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No notes yet.</p>
            )}
            {[...candidate.notes].reverse().map((note) => (
              <div key={note.id} style={{
                padding: '10px 12px', borderRadius: 8,
                background: 'var(--color-bg)', border: '1px solid var(--color-border)',
              }}>
                <p style={{ fontSize: 13, marginBottom: 4 }}>{note.content}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {note.authorName} · {fmtDate(note.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stage History */}
        <div style={{
          background: 'var(--color-surface)', borderRadius: 12,
          border: '1px solid var(--color-border)', padding: 20,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Stage History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {candidate.stageHistory.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No history yet.</p>
            )}
            {[...candidate.stageHistory].reverse().map((h, i) => (
              <div key={i} style={{
                padding: '8px 12px', borderRadius: 8,
                background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <StageBadge stage={h.stage} />
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{fmtDate(h.movedAt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email Log */}
        <div style={{
          background: 'var(--color-surface)', borderRadius: 12,
          border: '1px solid var(--color-border)', padding: 20,
          gridColumn: '1 / -1',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Email Log</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {candidate.emails.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No emails sent yet.</p>
            )}
            {[...candidate.emails].reverse().map((email) => (
              <div key={email.id} style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'var(--color-bg)', border: '1px solid var(--color-border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 13 }}>{email.subject}</strong>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{fmtDate(email.sentAt)}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>{email.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <Modal
        open={emailModal}
        onClose={() => setEmailModal(false)}
        title="Send Email"
        width={600}
        footer={
          <>
            <button
              onClick={() => setEmailModal(false)}
              style={{
                padding: '7px 16px', borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'transparent', fontSize: 13, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              style={{
                padding: '7px 16px', borderRadius: 6,
                background: 'var(--color-primary)', color: 'white',
                border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Send
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-muted)' }}>Templates</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.keys(TEMPLATES).map((k) => (
                <button key={k} className="btn btn-ghost" onClick={() => applyTemplate(k)}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Subject</label>
            <input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Body</label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={8}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
