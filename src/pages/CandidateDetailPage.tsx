import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, FileText, Tag, Plus, Send, ChevronRight } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import { EMAIL_TEMPLATES } from '@/lib/emailTemplates';
import { STAGES, STAGE_COLORS, STAGE_BG } from '@/lib/pipeline';
import StageBadge from '@/components/StageBadge';
import Modal from '@/components/Modal';
import PageHeader from '@/components/PageHeader';
import type { StageName } from '@/types';

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const { candidates, moveCandidateStage, addCandidateNote, addCandidateEmail, currentUser } = useAts();

  const candidate = candidates.find((c) => c.id === candidateId);

  const [noteText, setNoteText] = useState('');
  const [emailModal, setEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'emails' | 'documents'>('overview');

  if (!candidate) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Candidate not found.</p>
        <button onClick={() => navigate('/candidates')} style={{ marginTop: 12 }}>Back to Candidates</button>
      </div>
    );
  }

  const handleStageChange = (stage: StageName) => {
    moveCandidateStage(candidate.id, stage);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addCandidateNote(candidate.id, noteText);
    setNoteText('');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      const subject = tpl.subject
        .replace('{{name}}', candidate.name)
        .replace('{{jobTitle}}', candidate.jobTitle ?? '');
      const body = tpl.body
        .replace('{{name}}', candidate.name)
        .replace('{{jobTitle}}', candidate.jobTitle ?? '');
      setEmailSubject(subject);
      setEmailBody(body);
    }
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    addCandidateEmail(candidate.id, { subject: emailSubject, body: emailBody });
    setEmailModal(false);
    setEmailSubject('');
    setEmailBody('');
    setSelectedTemplate('');
  };

  const btnBase: React.CSSProperties = {
    padding: '7px 16px',
    borderRadius: 7,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ ...btnBase, background: 'transparent', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, padding: '6px 0' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <PageHeader
        title={candidate.name}
        subtitle={candidate.jobTitle ? `Applied for: ${candidate.jobTitle}` : undefined}
        actions={
          <button
            onClick={() => setEmailModal(true)}
            style={{ ...btnBase, background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Send size={14} /> Send Email
          </button>
        }
      />

      {/* Stage pipeline */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        padding: '16px 20px',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pipeline Stage</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STAGES.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => handleStageChange(s as StageName)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  border: s === candidate.stage ? `2px solid ${STAGE_COLORS[s as StageName]}` : '2px solid transparent',
                  background: s === candidate.stage ? STAGE_BG[s as StageName] : 'var(--color-surface-alt)',
                  color: s === candidate.stage ? STAGE_COLORS[s as StageName] : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: s === candidate.stage ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {s}
              </button>
              {i < STAGES.length - 1 && <ChevronRight size={14} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        {candidate.email && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Mail size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Email</div>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.email}</div>
            </div>
          </div>
        )}
        {candidate.phone && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Phone size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Phone</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{candidate.phone}</div>
            </div>
          </div>
        )}
        {candidate.source && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Tag size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Source</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{candidate.source}</div>
            </div>
          </div>
        )}
        <div style={{ background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Stage</div>
            <StageBadge stage={candidate.stage} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 0 }}>
        {(['overview', 'notes', 'emails', 'documents'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Candidate Information</h3>
          <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px 16px', fontSize: 13 }}>
            <dt style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Full Name</dt>
            <dd>{candidate.name}</dd>
            <dt style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Email</dt>
            <dd>{candidate.email}</dd>
            {candidate.phone && <><dt style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Phone</dt><dd>{candidate.phone}</dd></>}
            {candidate.jobTitle && <><dt style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Applied For</dt><dd>{candidate.jobTitle}</dd></>}
            {candidate.source && <><dt style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Source</dt><dd>{candidate.source}</dd></>}
            {candidate.linkedinUrl && <><dt style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>LinkedIn</dt><dd><a href={candidate.linkedinUrl} target="_blank" rel="noreferrer">{candidate.linkedinUrl}</a></dd></>}
          </dl>
          {candidate.tags && candidate.tags.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {candidate.tags.map((tag) => (
                  <span key={tag} style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--color-surface-alt)', fontSize: 12, fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', padding: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 7,
                border: '1px solid var(--color-border)',
                fontSize: 13, resize: 'vertical',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
            />
            <button
              onClick={handleAddNote}
              style={{ ...btnBase, background: 'var(--color-primary)', color: 'white', alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {candidate.notes.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No notes yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...candidate.notes].reverse().map((note) => (
                <div key={note.id} style={{ padding: '12px 16px', borderRadius: 8, background: 'var(--color-surface-alt)', fontSize: 13 }}>
                  <div style={{ marginBottom: 4 }}>{note.content}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{new Date(note.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'emails' && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', padding: 20 }}>
          {candidate.emails.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No emails sent yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...candidate.emails].reverse().map((email) => (
                <div key={email.id} style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{email.subject}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>{email.body}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>{new Date(email.sentAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', padding: 20 }}>
          {(!candidate.documents || candidate.documents.length === 0) ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No documents uploaded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {candidate.documents.map((doc) => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <FileText size={16} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
                  <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>{doc.name}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Email Modal */}
      <Modal
        open={emailModal}
        onClose={() => setEmailModal(false)}
        title="Send Email"
        footer={
          <>
            <button onClick={() => setEmailModal(false)} style={{ ...btnBase, background: 'var(--color-surface-alt)', color: 'var(--color-text)' }}>Cancel</button>
            <button onClick={handleSendEmail} style={{ ...btnBase, background: 'var(--color-primary)', color: 'white' }}>Send</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--color-border)', fontSize: 13, background: 'var(--color-bg)', color: 'var(--color-text)' }}
            >
              <option value="">-- Select a template --</option>
              {EMAIL_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Subject</label>
            <input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--color-border)', fontSize: 13, background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Body</label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={6}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--color-border)', fontSize: 13, resize: 'vertical', background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
