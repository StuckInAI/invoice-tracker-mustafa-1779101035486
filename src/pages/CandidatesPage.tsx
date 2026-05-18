import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Search } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import { ALL_STAGES } from '@/lib/pipeline';
import StageBadge from '@/components/StageBadge';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import type { StageName } from '@/types';

export default function CandidatesPage() {
  const navigate = useNavigate();
  const { candidates, jobs } = useAts();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageName | 'All'>('All');
  const [jobFilter, setJobFilter] = useState('All');

  const filtered = candidates.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || c.stage === stageFilter;
    const matchJob = jobFilter === 'All' || c.jobId === jobFilter;
    return matchSearch && matchStage && matchJob;
  });

  const btnBase: React.CSSProperties = {
    padding: '7px 14px',
    borderRadius: 7,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  };

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total`}
        actions={
          <>
            <button
              onClick={() => navigate('/candidates/import')}
              style={{ ...btnBase, background: 'var(--color-surface-alt)', color: 'var(--color-text)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Upload size={14} /> Import CSV
            </button>
            <button
              onClick={() => navigate('/candidates/new')}
              style={{ ...btnBase, background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={14} /> Add Candidate
            </button>
          </>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            style={{
              width: '100%', paddingLeft: 32, padding: '8px 10px 8px 32px',
              border: '1px solid var(--color-border)',
              borderRadius: 7, fontSize: 13,
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as StageName | 'All')}
          style={{ padding: '8px 10px', borderRadius: 7, border: '1px solid var(--color-border)', fontSize: 13, background: 'var(--color-surface)', color: 'var(--color-text)' }}
        >
          <option value="All">All Stages</option>
          {ALL_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: 7, border: '1px solid var(--color-border)', fontSize: 13, background: 'var(--color-surface)', color: 'var(--color-text)' }}
        >
          <option value="All">All Jobs</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description="Try adjusting your filters or add a new candidate."
          action={
            <button
              onClick={() => navigate('/candidates/new')}
              style={{ ...btnBase, background: 'var(--color-primary)', color: 'white' }}
            >
              Add Candidate
            </button>
          }
        />
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-alt)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Job</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Stage</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Applied</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/candidates/${c.id}`)}
                  style={{
                    borderTop: i === 0 ? 'none' : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-alt)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{c.email}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                    {jobs.find((j) => j.id === c.jobId)?.title ?? c.jobTitle ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}><StageBadge stage={c.stage} /></td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
