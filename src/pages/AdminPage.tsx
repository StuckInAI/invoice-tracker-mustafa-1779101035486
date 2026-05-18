import { useState } from 'react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import type { CustomFieldDef, User } from '@/types';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  fontSize: 13,
  color: 'var(--color-text)',
  background: 'var(--color-surface)',
  boxSizing: 'border-box',
};

export default function AdminPage() {
  const { users, addUser, toggleUserActive, customFields, addCustomField, deleteCustomField } = useAts();

  // User form
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<User['role']>('Recruiter');

  const handleAddUser = () => {
    if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) return;
    addUser({
      name: userName.trim(),
      email: userEmail.trim(),
      password: userPassword.trim(),
      role: userRole,
      active: true,
    });
    setUserName('');
    setUserEmail('');
    setUserPassword('');
  };

  // Custom field form
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldDef['type']>('text');

  const handleAddField = () => {
    if (!fieldLabel.trim()) return;
    addCustomField({
      label: fieldLabel.trim(),
      type: fieldType,
    });
    setFieldLabel('');
    setFieldType('text');
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    borderRadius: 10,
    border: '1px solid var(--color-border)',
    padding: 24,
    marginBottom: 24,
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid var(--color-border)',
  };

  return (
    <div>
      <PageHeader title="Admin" subtitle="Manage users and system configuration" />

      {/* Users */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Users</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: '8px 12px' }}>{u.name}</td>
                <td style={{ padding: '8px 12px' }}>{u.email}</td>
                <td style={{ padding: '8px 12px' }}>{u.role}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    background: u.active ? '#d1fae5' : '#fee2e2',
                    color: u.active ? '#065f46' : '#991b1b',
                  }}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <button
                    onClick={() => toggleUserActive(u.id)}
                    style={{
                      padding: '4px 10px', fontSize: 12, borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      background: 'transparent', cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {u.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add user form */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Add User</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 8, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Name</label>
              <input style={inputStyle} value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Email</label>
              <input style={inputStyle} type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="email@company.com" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Password</label>
              <input style={inputStyle} type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Password" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Role</label>
              <select style={inputStyle} value={userRole} onChange={(e) => setUserRole(e.target.value as User['role'])}>
                <option>Admin</option>
                <option>Recruiter</option>
                <option>Hiring Manager</option>
              </select>
            </div>
            <button
              onClick={handleAddUser}
              style={{
                padding: '8px 16px', borderRadius: 6,
                background: 'var(--color-primary)', color: 'white',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Custom Fields */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Custom Candidate Fields</h2>
        {customFields.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No custom fields defined yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={thStyle}>Label</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customFields.map((f) => (
                <tr key={f.id}>
                  <td style={{ padding: '8px 12px' }}>{f.label}</td>
                  <td style={{ padding: '8px 12px' }}>{f.type}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <button
                      onClick={() => deleteCustomField(f.id)}
                      style={{
                        padding: '4px 10px', fontSize: 12, borderRadius: 6,
                        border: '1px solid #fca5a5',
                        background: '#fee2e2', cursor: 'pointer',
                        color: '#991b1b',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add field form */}
        <div style={{ paddingTop: customFields.length > 0 ? 0 : 8 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Add Custom Field</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Field Label</label>
              <input style={inputStyle} value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} placeholder="e.g. LinkedIn URL" />
            </div>
            <div style={{ width: 140 }}>
              <label style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Type</label>
              <select style={inputStyle} value={fieldType} onChange={(e) => setFieldType(e.target.value as CustomFieldDef['type'])}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="select">Select</option>
              </select>
            </div>
            <button
              onClick={handleAddField}
              style={{
                padding: '8px 16px', borderRadius: 6,
                background: 'var(--color-primary)', color: 'white',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Add Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
