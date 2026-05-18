import { useState } from 'react';
import type { CustomFieldDef, User } from '@/types';
import { useAts } from '@/hooks/useAtsStore';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

export default function AdminPage() {
  const { users, addUser, toggleUserActive, customFields, addCustomField, deleteCustomField } = useAts();

  const [showUserModal, setShowUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<User['role']>('Recruiter');

  const [showFieldModal, setShowFieldModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldDef['fieldType']>('text');

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
    setUserRole('Recruiter');
    setShowUserModal(false);
  };

  const handleAddField = () => {
    if (!fieldName.trim()) return;
    addCustomField({
      name: fieldName.trim(),
      fieldType,
    });
    setFieldName('');
    setFieldType('text');
    setShowFieldModal(false);
  };

  const btnPrimary: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 8, border: 'none',
    background: 'var(--color-primary)', color: 'white',
    fontWeight: 600, fontSize: 13, cursor: 'pointer',
  };
  const btnSecondary: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 8,
    border: '1px solid var(--color-border)',
    background: 'transparent', fontSize: 13, cursor: 'pointer',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid var(--color-border)', fontSize: 13,
    background: 'var(--color-surface)', boxSizing: 'border-box',
  };

  return (
    <div>
      <PageHeader
        title="Admin"
        subtitle="Manage users and custom fields"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btnPrimary} onClick={() => setShowUserModal(true)}>+ Add User</button>
            <button style={btnPrimary} onClick={() => setShowFieldModal(true)}>+ Add Field</button>
          </div>
        }
      />

      {/* Users table */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Users</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>Name</th>
              <th style={{ padding: '8px 12px' }}>Email</th>
              <th style={{ padding: '8px 12px' }}>Role</th>
              <th style={{ padding: '8px 12px' }}>Status</th>
              <th style={{ padding: '8px 12px' }}>Actions</th>
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
                    padding: '2px 8px', borderRadius: 999, fontSize: 11,
                    background: u.active ? '#d1fae5' : '#fee2e2',
                    color: u.active ? '#065f46' : '#991b1b',
                  }}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <button
                    onClick={() => toggleUserActive(u.id)}
                    style={{ ...btnSecondary, padding: '4px 10px', fontSize: 12 }}
                  >
                    {u.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Custom fields table */}
      <section>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Custom Fields</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>Name</th>
              <th style={{ padding: '8px 12px' }}>Type</th>
              <th style={{ padding: '8px 12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customFields.map((f) => (
              <tr key={f.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px 12px' }}>{f.name}</td>
                <td style={{ padding: '8px 12px' }}>{f.fieldType}</td>
                <td style={{ padding: '8px 12px' }}>
                  <button
                    onClick={() => deleteCustomField(f.id)}
                    style={{ ...btnSecondary, padding: '4px 10px', fontSize: 12, color: '#dc2626' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Add User Modal */}
      <Modal
        open={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Add User"
        footer={
          <>
            <button style={btnSecondary} onClick={() => setShowUserModal(false)}>Cancel</button>
            <button style={btnPrimary} onClick={handleAddUser}>Add User</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Name</label>
            <input style={inputStyle} value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Email</label>
            <input style={inputStyle} type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Email address" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Password</label>
            <input style={inputStyle} type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Password" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Role</label>
            <select style={inputStyle} value={userRole} onChange={(e) => setUserRole(e.target.value as User['role'])}>
              <option value="Admin">Admin</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Add Field Modal */}
      <Modal
        open={showFieldModal}
        onClose={() => setShowFieldModal(false)}
        title="Add Custom Field"
        footer={
          <>
            <button style={btnSecondary} onClick={() => setShowFieldModal(false)}>Cancel</button>
            <button style={btnPrimary} onClick={handleAddField}>Add Field</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Field Name</label>
            <input style={inputStyle} value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder="e.g. LinkedIn Score" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Field Type</label>
            <select style={inputStyle} value={fieldType} onChange={(e) => setFieldType(e.target.value as CustomFieldDef['fieldType'])}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Select</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
