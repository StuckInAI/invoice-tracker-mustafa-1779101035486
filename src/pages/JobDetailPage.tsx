import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Building, Copy, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StageBadge from '@/components/StageBadge';
import { useAts } from '@/hooks/useAtsStore';
import { getStages } from '@/lib/pipeline';
import type { Candidate, StageName } from '@/types';
import styles from './JobDetailPage.module.css';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, candidates, moveCandidateStage } = useAts();
  const job = jobs.find((j) => j.id === jobId);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!job) {
    return (
      <div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
        <p style={{ marginTop: 24 }}>Job not found.</p>
      </div>
    );
  }

  const stages = getStages(job.pipelineType);
  const jobCandidates = candidates.filter((c) => c.jobId === job.id);

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragEnd = () => setDraggingId(null);
  const handleDrop = (stage: StageName) => {
    if (draggingId) moveCandidateStage(draggingId, stage);
    setDraggingId(null);
  };

  const copyApplyLink = async () => {
    const url = `${window.location.origin}/apply/${job.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <button className="btn btn-ghost" onClick={() => navigate('/jobs')} style={{ marginBottom: 12 }}>
        <ArrowLeft size={14} /> All Jobs
      </button>
      <PageHeader
        title={job.title}
        subtitle={`${job.department} • ${job.location} • ${job.pipelineType} pipeline`}
        actions={
          <>
            <button className="btn" onClick={copyApplyLink}>
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy Apply Link'}
            </button>
            <Link to="/candidates/new" state={{ jobId: job.id }} className="btn btn-primary">
              <Plus size={14} /> Add Candidate
            </Link>
          </>
        }
      />

      <div className={`card ${styles.summary}`}>
        <div className={styles.summaryItem}>
          <Building size={14} /> {job.department}
        </div>
        <div className={styles.summaryItem}>
          <MapPin size={14} /> {job.location}
        </div>
        <div className={styles.summaryItem}>
          Status: <strong style={{ marginLeft: 4 }}>{job.status}</strong>
        </div>
        <div className={styles.summaryItem}>
          {jobCandidates.length} candidate{jobCandidates.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className={styles.board}>
        {stages.map((stage) => {
          const items = jobCandidates.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              className={styles.column}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage)}
            >
              <div className={styles.columnHeader}>
                <StageBadge stage={stage} />
                <span className={styles.count}>{items.length}</span>
              </div>
              <div className={styles.columnBody}>
                {items.map((c) => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    onDragStart={() => handleDragStart(c.id)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
                {items.length === 0 && <div className={styles.emptyCol}>Drop here</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type CardProps = {
  candidate: Candidate;
  onDragStart: () => void;
  onDragEnd: () => void;
};

function CandidateCard({ candidate, onDragStart, onDragEnd }: CardProps) {
  return (
    <Link
      to={`/candidates/${candidate.id}`}
      className={styles.card}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className={styles.cardAvatar}>{candidate.name.charAt(0)}</div>
      <div className={styles.cardInfo}>
        <div className={styles.cardName}>{candidate.name}</div>
        <div className={styles.cardMeta}>{candidate.email}</div>
      </div>
    </Link>
  );
}
