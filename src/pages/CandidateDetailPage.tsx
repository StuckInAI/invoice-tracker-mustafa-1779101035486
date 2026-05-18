import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, FileText, MessageSquare,
  ChevronDown, Paperclip, Send, Plus, Trash2, Calendar,
} from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import { fmtDate } from '@/lib/format';
import StageBadge from '@/components/StageBadge';
import Modal from '@/components/Modal';
import { ALL_STAGES } from '@/lib/pipeline';
import type { StageName } from '@/types';

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const {
    candidates, jobs, moveCandidateStage,
    addCandidateNote, addCandidateEmail, updateCandidate,
  } = useAts();

  const candidate = candidates.find((c) => c.id === candidateId);
  const job = jobs.find((j) => j.id === candidate?.jobId);

  const [tab, setTab] = useState<'overview' | 'notes' | 'emails' | 'history'>('overview');
  const [noteText, setNoteText] = useState('');
  const [emailModal, setEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [stageDropdown, setStageDropdown] = useState(false);

  if (!candidate) {
    return (
      <div style={{ padding: 32 }}>
        <button onClick={() => navigate('/candidates')} style={backBtnStyle}>
          <ArrowLeft size={16} /> Back to Candidates
        </button>
        <p style={{ marginTop: 24, color: 'var(--color-text-muted)' }}>Candidate not found.</p>
      </div>
    );
  }

  const handleStageChange = (stage: StageName) => {
    moveCandidateStage(candidate.id, stage);
    setStageDropdown(false);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addCandidateNote(candidate.id, noteText.trim());
    setNoteText('');
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    addCandidateEmail(candidate.id, { subject: emailSubject, body: emailBody });
    setEmailSubject('');
    setEmailBody('');
    setEmailModal(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Back */}
      <button onClick={() => navigate('/candidates')} style={backBtnStyle}>
        <ArrowLeft size={16} /> Back to Candidates
      </button>

      {/* Header card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={avatarStyle}>{candidate.name.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{candidate.name}</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                {candidate.jobTitle} {job ? `· ${job.title}` : ''}
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                {candidate.email && (
                  <span style={metaItemStyle}><Mail size={13} /> {candidate.email}</span>
                )}
                {candidate.phone && (
                  <span style={metaItemStyle}><Phone size={13} /> {candidate.phone}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stage selector */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StageBadge stage={candidate.currentStage} />
              <button
                onClick={() => setStageDropdown(!stageDropdown)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '6px 10px', borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  background: 'transparent', cursor: 'pointer', fontSize: 12,
                }}
              >
                Move stage <ChevronDown size={14} />
              </button>
            </div>
            {stageDropdown && (
              <div style={dropdownStyle}>
                {ALL_STAGES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStageChange(s)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '8px 12px', background: 'transparent',
                      border: 'none', cursor: 'pointer', fontSize: 13,
                      color: s === candidate.currentStage ? 'var(--color-primary)' : 'var(--color-text)',
                      fontWeight: s === candidate.currentStage ? 600 : 400,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border)', marginBottom: 20 }}>
        {(['overview', 'notes', 'emails', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: tab === t ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Candidate Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            <InfoRow label="Email" value={candidate.email} />
            <InfoRow label="Phone" value={candidate.phone ?? '—'} />
            <InfoRow label="Job" value={job?.title ?? candidate.jobTitle} />
            <InfoRow label="Stage" value={candidate.currentStage} />
            <InfoRow label="Source" value={candidate.source ?? '—'} />
            <InfoRow label="Applied" value={fmtDate(candidate.createdAt)} />
            {candidate.linkedIn && <InfoRow label="LinkedIn" value={candidate.linkedIn} />}
          </div>
        </div>
      )}

      {tab === 'notes' && (
        <div>
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Add Note</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note about this candidate..."
              rows={4}
              style={textareaStyle}
            />
            <button onClick={handleAddNote} style={primaryBtnStyle}>
              <Plus size={14} /> Add Note
            </button>
          </div>
          {candidate.notes.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: 24 }}>No notes yet.</p>
          ) : (
            candidate.notes.slice().reverse().map((n) => (
              <div key={n.id} style={{ ...cardStyle, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{fmtDate(n.createdAt)}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{n.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'emails' && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => setEmailModal(true)} style={primaryBtnStyle}>
              <Send size={14} /> Send Email
            </button>
          </div>
          {candidate.emails.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: 24 }}>No emails sent yet.</p>
          ) : (
            candidate.emails.slice().reverse().map((e) => (
              <div key={e.id} style={{ ...cardStyle, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong style={{ fontSize: 14 }}>{e.subject}</strong>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{fmtDate(e.sentAt)}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>{e.body}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'history' && (
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Stage History</h3>
          {candidate.stageHistory.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No history yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {candidate.stageHistory.slice().reverse().map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Calendar size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{h.stage}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 8 }}>{fmtDate(h.movedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Email modal */}
      <Modal
        open={emailModal}
        onClose={() => setEmailModal(false)}
        title="Send Email"
        footer={
          <>
            <button onClick={() => setEmailModal(false)} style={ghostBtnStyle}>Cancel</button>
            <button onClick={handleSendEmail} style={primaryBtnStyle}>Send</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Subject</label>
            <input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={inputStyle}
              placeholder="Email subject"
            />
          </div>
          <div>
            <label style={labelStyle}>Body</label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              style={textareaStyle}
              rows={6}
              placeholder="Email body..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 10,
  padding: '20px',
  marginBottom: 16,
};

const backBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 16,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--color-text-muted)',
  fontSize: 13,
  padding: 0,
};

const avatarStyle: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: '50%',
  background: 'var(--color-primary)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  fontWeight: 700,
  flexShrink: 0,
};

const metaItemStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 13,
  color: 'var(--color-text-muted)',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 4,
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  zIndex: 50,
  minWidth: 140,
  overflow: 'hidden',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 16,
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  fontSize: 13,
  resize: 'vertical',
  boxSizing: 'border-box',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
};

const primaryBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  borderRadius: 6,
  background: 'var(--color-primary)',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  marginTop: 8,
};

const ghostBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 6,
  background: 'transparent',
  border: '1px solid var(--color-border)',
  cursor: 'pointer',
  fontSize: 13,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  fontSize: 13,
  boxSizing: 'border-box',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  marginBottom: 4,
  color: 'var(--color-text-muted)',
};
