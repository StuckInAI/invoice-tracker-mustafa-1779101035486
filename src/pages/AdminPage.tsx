import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { useAts } from '@/hooks/useAtsStore';
import type { Role } from '@/types';
import { formatDate } from '@/lib/format';

export default function AdminPage() {
  const { users, addUser, toggleUserActive, customFields, addCustomField, deleteCustomField } = useAts();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Recruiter');
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<'text' | 'number' | 'date'>('text');
  const [error, setError] = useState('');

  const submitUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Name and email required.');
      return;
    }
    addUser({ name: name.trim(), email: email.trim(), role, active: true });
    setName('');
    setEmail('');
    setRole('Recruiter');
  };

  const submitField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) return;
    addCustomField({ name: fieldName.trim(), type: fieldType });
    setFieldName('');
    setFieldType('text');
  };

  return (
    <div>
      <PageHeader title="Admin" subtitle="Manage users and custom fields" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Add user</h3>
          <form onSubmit={submitUser}>
            {error && <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-3)', fontSize: 13 }}>{error}</div>}
            <div className="form-group">
              <label className="label">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Role</label>
              <select className="select" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="Admin">Admin</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Create user</button>
          </form>

          <div style={{ marginTop: 'var(--space-5)' }}>
            <h4 style={{ marginBottom: 'var(--space-2)', fontSize: 13 }}>Existing users</h4>
            <table className="table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th></th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.active ? 'Yes' : 'No'}</td>
                    <td><button className="btn btn-ghost" onClick={() => toggleUserActive(u.id)}>Toggle</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Custom fields</h3>
          <form onSubmit={submitField}>
            <div className="form-group">
              <label className="label">Field name</label>
              <input className="input" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Type</label>
              <select className="select" value={fieldType} onChange={(e) => setFieldType(e.target.value as 'text' | 'number' | 'date')}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add field</button>
          </form>
          <div style={{ marginTop: 'var(--space-5)' }}>
            <h4 style={{ marginBottom: 'var(--space-2)', fontSize: 13 }}>Existing fields</h4>
            <table className="table">
              <thead><tr><th>Name</th><th>Type</th><th></th></tr></thead>
              <tbody>
                {customFields.map((f) => (
                  <tr key={f.id}>
                    <td>{f.name}</td>
                    <td>{f.type}</td>
                    <td><button className="btn btn-ghost" onClick={() => deleteCustomField(f.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Loaded {formatDate(new Date().toISOString())}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
