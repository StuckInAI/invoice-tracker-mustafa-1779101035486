import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, Search } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import EmptyState from '@/components/EmptyState';
import { STAGES } from '@/lib/pipeline';
import type { StageName } from '@/types';

export default function CandidatesPage() {
  const { candidates, jobs } = useAts();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageName | 'All'>('All');
  const [jobFilter, setJobFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (stageFilter !== 'All' && c.stage !== stageFilter) return false;
      if (jobFilter !== 'All' && c.jobId !== jobFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!c.name.toLowerCase().includes(s) && !c.email.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [candidates, search, stageFilter, jobFilter]);

  const jobMap = useMemo(() => Object.fromEntries(jobs.map((j) => [j.id, j.title])), [jobs]);

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total candidate${candidates.length === 1 ? '' : 's'}`}
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

      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 32 }}
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input" value={stageFilter} onChange={(e) => setStageFilter(e.target.value as StageName | 'All')} style={{ maxWidth: 180 }}>
            <option value="All">All stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="input" value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} style={{ maxWidth: 220 }}>
            <option value="All">All jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState
            title="No candidates found"
            description="Try adjusting your filters or add a new candidate."
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Job</th>
                <th>Stage</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td><Link to={`/candidates/${c.id}`} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{c.name}</Link></td>
                  <td>{c.email}</td>
                  <td>{jobMap[c.jobId] ?? '—'}</td>
                  <td><StageBadge stage={c.stage} /></td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
