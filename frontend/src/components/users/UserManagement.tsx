import React, { useEffect, useState } from 'react';
import { userService, User } from '../../services/userService';
import { authService } from '../../services/authService';
import './UserManagement.css';

interface CreateUserForm {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  roleName: string;
}

const ROLES = ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'POLICE_ADMIN', 'FIRE_ADMIN'];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    roleName: 'HOSPITAL_ADMIN'
  });
  const [createError, setCreateError] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const updated = await userService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? updated : u));
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleStatusChange = async (userId: string, active: boolean) => {
    try {
      const updated = await userService.updateUserStatus(userId, active);
      setUsers(users.map(u => u.id === userId ? updated : u));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      await authService.register({
        email: createForm.email,
        password: createForm.password,
        fullName: createForm.fullName,
        phone: createForm.phone || undefined,
        roleName: createForm.roleName
      });
      setShowCreateForm(false);
      setCreateForm({ email: '', password: '', fullName: '', phone: '', roleName: 'HOSPITAL_ADMIN' });
      await loadUsers();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return '#f44336';
      case 'HOSPITAL_ADMIN': return '#9c27b0';
      case 'POLICE_ADMIN': return '#2196f3';
      case 'FIRE_ADMIN': return '#ff9800';
      default: return '#666';
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management-container">
      <div className="header">
        <h1>User Management</h1>
        <button
          className="create-btn"
          onClick={() => { setShowCreateForm(!showCreateForm); setCreateError(''); }}
        >
          {showCreateForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form">
          <h3>Add New User</h3>
          {createError && <div className="error-message">{createError}</div>}
          <form onSubmit={handleCreateSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={createForm.fullName}
                  onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                  minLength={8}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={createForm.roleName}
                onChange={e => setCreateForm({ ...createForm, roleName: e.target.value })}
              >
                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                  </select>
                </td>
                <td>
                  <select
                    value={user.active ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) => handleStatusChange(user.id, e.target.value === 'ACTIVE')}
                    className="status-select"
                    style={{ backgroundColor: user.active ? '#4caf50' : '#9e9e9e' }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="no-users">No users found.</div>
      )}
    </div>
  );
};

export default UserManagement;
