import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAts } from '@/hooks/useAtsStore';
import StageBadge from '@/components/StageBadge';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import { STAGE_ORDER } from '@/lib/pipeline';
import { fmtDate } from '@/lib/format';
import type { StageName } from '@/types';
import { EMAIL_TEMPLATES } from '@/lib/emailTemplates';

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: 8 }}>
      <span style={{ color: 'var(--color-text-muted)', width: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--color-text)', wordBreak: 'break-all' }}>{value || '—'}</span>
    </div>
  );
}

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const {
    candidates,
    jobs,
    customFields,
    moveCandidateStage,
    addCandidateNote,
    addCandidateEmail,
    updateCandidate,
  } = useAts();

  const candidate = candidates.find((c) => c.id === candidateId);
  const job = candidate ? jobs.find((j) => j.id === candidate.jobId) : null;

  const [noteText, setNoteText] = useState('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(candidate?.name ?? '');
  const [editEmail, setEditEmail] = useState(candidate?.email ?? '');
  const [editPhone, setEditPhone] = useState(candidate?.phone ?? '');
  const [editLinkedin, setEditLinkedin] = useState(candidate?.linkedin ?? '');
  const [editSource, setEditSource] = useState(candidate?.source ?? '');

  if (!candidate) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Candidate not found.
        <br />
        <button onClick={() => navigate('/candidates')} style={{ marginTop: 12, cursor: 'pointer' }}>Back to Candidates</button>
      </div>
    );
  }

  function handleMoveStage(s: StageName) {
    moveCandidateStage(candidateId!, s);
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    addCandidateNote(candidateId!, noteText.trim());
    setNoteText('');
  }

  function handleSendEmail() {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    addCandidateEmail(candidateId!, { subject: emailSubject.trim(), body: emailBody.trim() });
    setEmailModalOpen(false);
    setEmailSubject('');
    setEmailBody('');
  }

  function handleSaveEdit() {
    updateCandidate(candidateId!, {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      linkedin: editLinkedin.trim(),
      source: editSource.trim(),
    });
    setEditModalOpen(false);
  }

  const btnStyle: React.CSSProperties = {
    padding: '6px 14px', borderRadius: 6, border: '1px solid var(--color-border)',
    background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--color-text)',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <button onClick={() => navigate('/candidates')} style={{ ...btnStyle, marginBottom: 12, fontSize: 12 }}>
            ← Back
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{candidate.name}</h1>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <StageBadge stage={candidate.stage} />
            {job && <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{job.title}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={btnStyle} onClick={() => {
            setEditName(candidate.name);
            setEditEmail(candidate.email);
            setEditPhone(candidate.phone ?? '');
            setEditLinkedin(candidate.linkedin ?? '');
            setEditSource(candidate.source ?? '');
            setEditModalOpen(true);
          }}>Edit</button>
          <button style={{ ...btnStyle, background: 'var(--color-primary)', color: 'white', border: 'none' }}
            onClick={() => setEmailModalOpen(true)}>Send Email</button>
        </div>
      </div>

      {/* Stage pipeline */}
      <div style={{
        background: 'var(--color-surface)', borderRadius: 10, padding: '12px 16px',
        marginBottom: 24, display: 'flex', gap: 4, flexWrap: 'wrap',
      }}>
        {STAGE_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => handleMoveStage(s)}
            style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              border: s === candidate.stage ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: s === candidate.stage ? 'var(--color-primary-soft)' : 'transparent',
              cursor: 'pointer',
              color: s === candidate.stage ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: s === candidate.stage ? 600 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Basic info */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Candidate Info</h3>
            <InfoRow label="Email" value={candidate.email} />
            <InfoRow label="Phone" value={candidate.phone} />
            <InfoRow label="LinkedIn" value={candidate.linkedin} />
            <InfoRow label="Source" value={candidate.source} />
            <InfoRow label="Stage" value={candidate.stage} />
            <InfoRow label="Applied" value={fmtDate(candidate.createdAt)} />
            {customFields.map((cf) => {
              const val = candidate.customFields?.find((v) => v.fieldId === cf.id);
              return <InfoRow key={cf.id} label={cf.label} value={val ? String(val.value) : undefined} />;
            })}
          </div>

          {/* Stage history */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Stage History</h3>
            {candidate.stageHistory.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No history yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {candidate.stageHistory.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StageBadge stage={h.stage} />
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 8 }}>{fmtDate(h.enteredAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Notes, Emails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Notes */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Notes</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                style={{
                  flex: 1, padding: '8px 10px', borderRadius: 6,
                  border: '1px solid var(--color-border)', fontSize: 13,
                  background: 'var(--color-surface)', color: 'var(--color-text)',
                  resize: 'vertical',
                }}
              />
              <button
                onClick={handleAddNote}
                style={{
                  alignSelf: 'flex-end', padding: '8px 14px', borderRadius: 6,
                  border: 'none', background: 'var(--color-primary)', color: 'white',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Add
              </button>
            </div>
            {candidate.notes.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No notes yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {candidate.notes.map((n) => (
                  <div key={n.id} style={{
                    padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 8, fontSize: 13,
                  }}>
                    <div style={{ marginBottom: 4 }}>{n.content}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{fmtDate(n.createdAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email log */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Email Log</h3>
            {candidate.emails.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No emails sent yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {candidate.emails.map((em) => (
                  <div key={em.id} style={{
                    padding: '10px 12px', background: 'var(--color-surface-alt)', borderRadius: 8, fontSize: 13,
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{em.subject}</div>
                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-muted)' }}>{em.body}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>{fmtDate(em.sentAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <Modal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Send Email"
        footer={
          <>
            <button onClick={() => setEmailModalOpen(false)} style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSendEmail} style={{ padding: '7px 16px', borderRadius: 6, border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Send</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Template</label>
            <select
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13, background: 'var(--color-surface)' }}
              onChange={(e) => {
                const tpl = EMAIL_TEMPLATES.find((t) => t.id === e.target.value);
                if (tpl) {
                  setEmailSubject(tpl.subject.replace('{{name}}', candidate.name));
                  setEmailBody(tpl.body.replace('{{name}}', candidate.name));
                }
              }}
            >
              <option value="">— Select template —</option>
              {EMAIL_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Subject</label>
            <input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13, background: 'var(--color-surface)', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Body</label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={6}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13, background: 'var(--color-surface)', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Candidate"
        footer={
          <>
            <button onClick={() => setEditModalOpen(false)} style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSaveEdit} style={{ padding: '7px 16px', borderRadius: 6, border: 'none', background: 'var(--color-primary)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[['Name', editName, setEditName], ['Email', editEmail, setEditEmail], ['Phone', editPhone, setEditPhone], ['LinkedIn', editLinkedin, setEditLinkedin], ['Source', editSource, setEditSource]] .map(([lbl, val, setter]) => (
            <div key={lbl as string}>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>{lbl as string}</label>
              <input
                value={val as string}
                onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: 13, background: 'var(--color-surface)', boxSizing: 'border-box' }}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
