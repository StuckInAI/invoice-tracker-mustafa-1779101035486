import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, Search } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import EmptyState from '@/components/EmptyState';
import { useAts } from '@/hooks/useAtsStore';
import { STAGE_ORDER } from '@/lib/pipeline';
import type { StageName } from '@/types';
import { formatDate } from '@/lib/format';

export default function CandidatesPage() {
  const { candidates, jobs } = useAts();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageName | 'All'>('All');
  const [jobFilter, setJobFilter] = useState<string>('All');

  const jobMap = useMemo(() => Object.fromEntries(jobs.map((j) => [j.id, j])), [jobs]);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (stageFilter !== 'All' && c.stage !== stageFilter) return false;
      if (jobFilter !== 'All' && c.jobId !== jobFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (jobMap[c.jobId]?.title.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [candidates, stageFilter, jobFilter, search, jobMap]);

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total candidates`}
        actions={
          <>
            <Link to="/candidates/import" className="btn btn-ghost">
              <Upload size={14} /> Import CSV
            </Link>
            <Link to="/candidates/new" className="btn btn-primary">
              <Plus size={14} /> Add candidate
            </Link>
          </>
        }
      />
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: 32 }}
            placeholder="Search by name, email, or job"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select" style={{ width: 160 }} value={stageFilter} onChange={(e) => setStageFilter(e.target.value as StageName | 'All')}>
          <option value="All">All stages</option>
          {STAGE_ORDER.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="select" style={{ width: 200 }} value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
          <option value="All">All jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <EmptyState title="No candidates match your filters" description="Try adjusting your search or filter criteria." />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Job</th>
                <th>Stage</th>
                <th>Source</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td><Link to={`/candidates/${c.id}`} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{c.name}</Link></td>
                  <td>{c.email}</td>
                  <td>{jobMap[c.jobId]?.title ?? '—'}</td>
                  <td><StageBadge stage={c.stage} /></td>
                  <td>{c.source}</td>
                  <td>{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
