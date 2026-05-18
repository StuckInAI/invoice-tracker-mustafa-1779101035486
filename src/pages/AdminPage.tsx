import { useState } from 'react';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import type { Role } from '@/types';
import type { CustomFieldDef } from '@/types';

export default function AdminPage() {
  const { users, customFields, addUser, toggleUserActive, addCustomField, deleteCustomField } = useAts();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<Role>('Recruiter');
  const [userPassword, setUserPassword] = useState('');
  const [userError, setUserError] = useState('');

  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldDef['type']>('text');
  const [fieldOptions, setFieldOptions] = useState('');
  const [fieldError, setFieldError] = useState('');

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) {
      setUserError('All fields required.');
      return;
    }
    addUser({
      name: userName.trim(),
      email: userEmail.trim(),
      role: userRole,
      active: true,
      passwordHash: userPassword.trim(),
    });
    setUserName('');
    setUserEmail('');
    setUserPassword('');
    setUserError('');
  }

  function handleAddField(e: React.FormEvent) {
    e.preventDefault();
    if (!fieldLabel.trim()) {
      setFieldError('Label is required.');
      return;
    }
    addCustomField({
      label: fieldLabel.trim(),
      type: fieldType,
      options: fieldType === 'select' ? fieldOptions.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
    });
    setFieldLabel('');
    setFieldOptions('');
    setFieldError('');
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 6,
    border: '1px solid var(--color-border)', fontSize: 14,
    background: 'var(--color-surface)', color: 'var(--color-text)',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4,
  };

  return (
    <div>
      <PageHeader title="Admin" subtitle="Manage users and custom fields" />

      {/* Users section */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Users</h2>
        <div style={{ marginBottom: 20, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Email</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Role</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '8px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px 12px' }}>{u.name}</td>
                  <td style={{ padding: '8px 12px' }}>{u.email}</td>
                  <td style={{ padding: '8px 12px' }}>{u.role}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: u.active ? '#dcfce7' : '#fee2e2',
                      color: u.active ? '#16a34a' : '#dc2626',
                    }}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <button
                      onClick={() => toggleUserActive(u.id)}
                      style={{
                        padding: '4px 10px', borderRadius: 4, border: '1px solid var(--color-border)',
                        background: 'transparent', fontSize: 12, cursor: 'pointer',
                      }}
                    >
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Add User</h3>
        <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 560 }}>
          {userError && (
            <div style={{ gridColumn: '1/-1', padding: '8px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: 13 }}>
              {userError}
            </div>
          )}
          <div><label style={labelStyle}>Name</label>
            <input style={inputStyle} value={userName} onChange={(e) => setUserName(e.target.value)} /></div>
          <div><label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} /></div>
          <div><label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} /></div>
          <div><label style={labelStyle}>Role</label>
            <select style={inputStyle} value={userRole} onChange={(e) => setUserRole(e.target.value as Role)}>
              <option value="Admin">Admin</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Interviewer">Interviewer</option>
              <option value="Viewer">Viewer</option>
            </select></div>
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{
              padding: '8px 20px', borderRadius: 6, border: 'none',
              background: 'var(--color-primary)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Add User</button>
          </div>
        </form>
      </section>

      {/* Custom Fields section */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Custom Fields</h2>
        <div style={{ marginBottom: 20 }}>
          {customFields.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No custom fields defined.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, maxWidth: 560 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Label</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '8px 12px' }}></th>
                </tr>
              </thead>
              <tbody>
                {customFields.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '8px 12px' }}>{f.label}</td>
                    <td style={{ padding: '8px 12px' }}>{f.type}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <button
                        onClick={() => deleteCustomField(f.id)}
                        style={{
                          padding: '4px 10px', borderRadius: 4, border: '1px solid #fecaca',
                          background: '#fee2e2', color: '#b91c1c', fontSize: 12, cursor: 'pointer',
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
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Add Custom Field</h3>
        <form onSubmit={handleAddField} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 560 }}>
          {fieldError && (
            <div style={{ gridColumn: '1/-1', padding: '8px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: 13 }}>
              {fieldError}
            </div>
          )}
          <div><label style={labelStyle}>Label</label>
            <input style={inputStyle} value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} /></div>
          <div><label style={labelStyle}>Type</label>
            <select style={inputStyle} value={fieldType} onChange={(e) => setFieldType(e.target.value as CustomFieldDef['type'])}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Select</option>
            </select></div>
          {fieldType === 'select' && (
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Options (comma separated)</label>
              <input style={inputStyle} value={fieldOptions} onChange={(e) => setFieldOptions(e.target.value)} placeholder="Option 1, Option 2" />
            </div>
          )}
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{
              padding: '8px 20px', borderRadius: 6, border: 'none',
              background: 'var(--color-primary)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Add Field</button>
          </div>
        </form>
      </section>
    </div>
  );
}
