import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Upload, ChevronRight } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import { ALL_STAGES } from '@/lib/pipeline';
import type { StageName } from '@/types';

export default function CandidatesPage() {
  const { candidates, jobs } = useAts();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [jobFilter, setJobFilter] = useState<string>('All');

  const jobMap = useMemo(() => Object.fromEntries(jobs.map((j) => [j.id, j])), [jobs]);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStage = stageFilter === 'All' || c.stage === stageFilter;
      const matchJob = jobFilter === 'All' || c.jobId === jobFilter;
      return matchSearch && matchStage && matchJob;
    });
  }, [candidates, search, stageFilter, jobFilter]);

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total candidates`}
        actions={
          <>
            <Link to="/candidates/import" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              border: '1px solid var(--color-border)', background: 'white',
              fontSize: 13, fontWeight: 500, color: 'var(--color-text)', textDecoration: 'none',
            }}>
              <Upload size={14} /> Import CSV
            </Link>
            <Link to="/candidates/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--color-primary)', color: 'white',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              <Plus size={14} /> Add candidate
            </Link>
          </>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            placeholder="Search candidates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 32px',
              border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 13, outline: 'none',
            }}
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          style={{
            padding: '8px 12px', border: '1px solid var(--color-border)',
            borderRadius: 8, fontSize: 13, outline: 'none', background: 'white', color: 'var(--color-text)',
          }}
        >
          <option value="All">All stages</option>
          {ALL_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          style={{
            padding: '8px 12px', border: '1px solid var(--color-border)',
            borderRadius: 8, fontSize: 13, outline: 'none', background: 'white', color: 'var(--color-text)',
          }}
        >
          <option value="All">All jobs</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-alt)', borderBottom: '1px solid var(--color-border)' }}>
              {['Name', 'Email', 'Job', 'Stage', 'Source', 'Added', ''].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>No candidates found.</td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13, flexShrink: 0,
                    }}>{c.name.charAt(0)}</div>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)' }}>{c.email}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {c.jobId ? jobMap[c.jobId]?.title ?? '—' : '—'}
                </td>
                <td style={{ padding: '12px 16px' }}><StageBadge stage={c.stage} /></td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)' }}>{c.source ?? '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Link to={`/candidates/${c.id}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '5px 10px', borderRadius: 6,
                    background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                    fontSize: 12, fontWeight: 600, textDecoration: 'none',
                  }}>
                    View <ChevronRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
