import { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import { useAts } from '@/hooks/useAtsStore';
import type { Role } from '@/types';
import { formatDate } from '@/lib/format';

export default function AdminPage() {
  const { users, addUser, toggleUserActive, customFields, addCustomField, deleteCustomField } = useAts();
  const [showUser, setShowUser] = useState(false);
  const [showField, setShowField] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Recruiter');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<'text' | 'number' | 'date' | 'select'>('text');
  const [fieldOptions, setFieldOptions] = useState('');

  const submitUser = () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    addUser({ name: name.trim(), email: email.trim(), password: password.trim(), role, active: true });
    setName('');
    setEmail('');
    setPassword('');
    setRole('Recruiter');
    setShowUser(false);
  };

  const submitField = () => {
    if (!fieldLabel.trim()) return;
    addCustomField({
      label: fieldLabel.trim(),
      type: fieldType,
      options: fieldType === 'select' ? fieldOptions.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
    });
    setFieldLabel('');
    setFieldType('text');
    setFieldOptions('');
    setShowField(false);
  };

  return (
    <div>
      <PageHeader
        title="Admin Settings"
        subtitle="Manage users, roles, and custom candidate fields"
      />

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16 }}>Users</h2>
          <button className="btn btn-primary" onClick={() => setShowUser(true)}>
            <UserPlus size={14} /> Add user
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.active ? 'Active' : 'Disabled'}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td>
                  <button className="btn btn-ghost" onClick={() => toggleUserActive(u.id)}>
                    {u.active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16 }}>Custom Candidate Fields</h2>
          <button className="btn btn-primary" onClick={() => setShowField(true)}>
            <Plus size={14} /> Add field
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Type</th>
              <th>Options</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customFields.map((f) => (
              <tr key={f.id}>
                <td>{f.label}</td>
                <td>{f.type}</td>
                <td>{f.options?.join(', ') ?? '—'}</td>
                <td>
                  <button className="btn btn-ghost" onClick={() => deleteCustomField(f.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={showUser}
        onClose={() => setShowUser(false)}
        title="Add user"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowUser(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitUser}>Create</button>
          </>
        }
      >
        <div className="form-grid">
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="select" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="Admin">Admin</option>
              <option value="Recruiter">Recruiter</option>
              <option value="HiringManager">Hiring Manager</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        open={showField}
        onClose={() => setShowField(false)}
        title="Add custom field"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowField(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={submitField}>Create</button>
          </>
        }
      >
        <div className="form-grid">
          <div>
            <label className="label">Label</label>
            <input className="input" value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="select" value={fieldType} onChange={(e) => setFieldType(e.target.value as 'text' | 'number' | 'date' | 'select')}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Select</option>
            </select>
          </div>
          {fieldType === 'select' && (
            <div>
              <label className="label">Options (comma separated)</label>
              <input className="input" value={fieldOptions} onChange={(e) => setFieldOptions(e.target.value)} />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
