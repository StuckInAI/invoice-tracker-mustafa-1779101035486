import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';

function parseCsv(text: string): Array<Record<string, string>> {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? '';
    });
    return row;
  });
}

export default function ImportCsvPage() {
  const { importCandidates } = useAts();
  const [csvText, setCsvText] = useState('name,email,phone,jobTitle,stage\n');
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);

  const handleImport = () => {
    const rows = parseCsv(csvText).map((r) => ({
      name: r.name ?? '',
      email: r.email ?? '',
      phone: r.phone ?? '',
      jobTitle: r.jobtitle ?? r['job title'] ?? '',
      stage: r.stage ?? 'Applied',
    }));
    const res = importCandidates(rows);
    setResult(res);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result ?? ''));
    reader.readAsText(file);
  };

  return (
    <div>
      <Link to="/candidates" className="btn btn-ghost" style={{ marginBottom: 'var(--space-3)' }}>
        <ArrowLeft size={14} /> Back
      </Link>
      <PageHeader title="Import candidates" subtitle="Upload a CSV with columns: name, email, phone, jobTitle, stage" />
      <div className="card" style={{ maxWidth: 800 }}>
        <input type="file" accept=".csv,text/csv" onChange={handleFile} style={{ marginBottom: 'var(--space-3)' }} />
        <textarea
          className="input"
          rows={12}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: 12 }}
        />
        <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleImport}>
            <Upload size={14} /> Import
          </button>
        </div>
        {result && (
          <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
            <div><strong>Imported:</strong> {result.imported}</div>
            <div><strong>Skipped:</strong> {result.skipped}</div>
            {result.errors.length > 0 && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <strong>Errors:</strong>
                <ul style={{ marginLeft: 'var(--space-4)' }}>
                  {result.errors.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
