import { useState } from 'react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import type { CustomFieldDef } from '@/types';

export default function AdminPage() {
  const { users, addUser, toggleUserActive, customFields, addCustomField, deleteCustomField, currentUser } = useAts();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Recruiter' | 'Hiring Manager'>('Recruiter');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldDef['type']>('text');

  if (currentUser?.role !== 'Admin') {
    return (
      <div>
        <PageHeader title="Admin" subtitle="Admin-only area" />
        <div className="card">You do not have permission to view this page.</div>
      </div>
    );
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addUser({ name: name.trim(), email: email.trim(), role, active: true });
    setName('');
    setEmail('');
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel.trim()) return;
    addCustomField({ label: fieldLabel.trim(), type: fieldType });
    setFieldLabel('');
  };

  return (
    <div>
      <PageHeader title="Admin" subtitle="Manage users and custom fields" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Users</h3>
          <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="input" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
              <option value="Admin">Admin</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Hiring Manager">Hiring Manager</option>
            </select>
            <button className="btn btn-primary" type="submit">Add user</button>
          </form>
          <table className="table">
            <thead><tr><th>Name</th><th>Role</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}<div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{u.email}</div></td>
                  <td>{u.role}</td>
                  <td>{u.active ? 'Active' : 'Inactive'}</td>
                  <td><button className="btn btn-ghost" onClick={() => toggleUserActive(u.id)}>{u.active ? 'Deactivate' : 'Activate'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Custom fields</h3>
          <form onSubmit={handleAddField} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <input className="input" placeholder="Field label" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} />
            <select className="input" value={fieldType} onChange={(e) => setFieldType(e.target.value as CustomFieldDef['type'])}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Select</option>
            </select>
            <button className="btn btn-primary" type="submit">Add field</button>
          </form>
          <table className="table">
            <thead><tr><th>Label</th><th>Type</th><th></th></tr></thead>
            <tbody>
              {customFields.map((f) => (
                <tr key={f.id}>
                  <td>{f.label}</td>
                  <td>{f.type}</td>
                  <td><button className="btn btn-ghost" onClick={() => deleteCustomField(f.id)}>Delete</button></td>
                </tr>
              ))}
              {customFields.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>No custom fields yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
