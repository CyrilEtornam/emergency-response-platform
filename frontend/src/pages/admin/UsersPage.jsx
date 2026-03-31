import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { createUser, updateUserRole, updateUserStatus, deleteUser } from '../../api/authApi';
import { Table, Pagination } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { Card } from '../../components/common/Card';
import { toast } from '../../components/common/Toast';
import { ROLE_LABELS } from '../../utils/constants';
import { formatDateShort } from '../../utils/formatters';

const ASSIGNABLE_ROLES = ['HOSPITAL_ADMIN', 'POLICE_ADMIN', 'FIRE_ADMIN'];

const inputCls = 'w-full px-3 py-2.5 text-[13px] bg-input border border-subtle text-primary rounded-[4px] focus:outline-none focus:ring-1 focus:ring-accent';

function AddUserModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function reset() { setForm({ fullName: '', email: '', password: '', role: '' }); setError(''); }

  function handleClose() { reset(); onClose(); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await createUser(form);
      toast('User created successfully', 'success');
      reset();
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  }

  const field = (label, name, type = 'text', opts = {}) => (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-widest text-secondary mb-1.5">{label}</label>
      <input
        type={type}
        required
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        className={inputCls}
        {...opts}
      />
    </div>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Add User"
      description="Create a new agency admin account."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button loading={loading} onClick={handleSubmit} type="submit">Create User</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {field('Full Name', 'fullName')}
        {field('Email', 'email', 'email')}
        {field('Password', 'password', 'password', { minLength: 8 })}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-widest text-secondary mb-1.5">Role</label>
          <select
            required
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="w-full px-3 py-2.5 text-[13px] bg-input border border-subtle text-primary rounded-[4px] focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
          >
            <option value="">Select role</option>
            {ASSIGNABLE_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </div>
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </form>
    </Modal>
  );
}

export function UsersPage() {
  const {
    users, totalUsers, loading, error, refetch,
    search, setSearch,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    page, setPage, totalPages,
  } = useUsers();

  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      toast('User deleted', 'success');
      refetch();
      setDeleteTarget(null);
    } catch (err) {
      toast(err?.message || 'Failed to delete user', 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleStatus(user) {
    try {
      await updateUserStatus(user.id, !user.active);
      toast(`User ${user.active ? 'deactivated' : 'activated'}`, 'success');
      refetch();
    } catch (err) {
      toast(err?.message || 'Failed to update status', 'error');
    }
  }

  async function handleRoleChange(user, newRole) {
    try {
      await updateUserRole(user.id, newRole);
      toast('Role updated', 'success');
      refetch();
    } catch (err) {
      toast(err?.message || 'Failed to update role', 'error');
    }
  }

  const columns = [
    { key: 'fullName', label: 'Full Name', render: (v, row) => (
      <span className="font-medium text-primary">{v || row.name || '—'}</span>
    )},
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (v) => <Badge variant="role" value={v} /> },
    { key: 'active', label: 'Status', render: (v) => (
      <Badge variant="status" value={v !== false ? 'ACTIVE' : 'INACTIVE'} />
    )},
    { key: 'createdAt', label: 'Created', render: (v) => formatDateShort(v) },
    { key: 'id', label: 'Actions', render: (_, row) => (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <select
          defaultValue={row.role}
          onChange={(e) => handleRoleChange(row, e.target.value)}
          className="text-[12px] bg-input border border-subtle text-primary rounded-[4px] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
        >
          {ASSIGNABLE_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
        <button
          onClick={() => handleToggleStatus(row)}
          className={`w-9 h-5 rounded-full transition-colors ${row.active !== false ? 'bg-success' : 'bg-subtle'}`}
          title={row.active !== false ? 'Deactivate' : 'Activate'}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${row.active !== false ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
        <button
          onClick={() => setDeleteTarget(row)}
          className="text-danger hover:text-primary text-[12px] font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    )},
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-primary">User Management</h1>
          <p className="text-[13px] text-secondary mt-0.5">{totalUsers} users total</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>Add User</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 text-[13px] bg-input border border-subtle text-primary placeholder:text-muted rounded-[4px] focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-[13px] bg-input border border-subtle text-primary rounded-[4px] focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
        >
          <option value="">All roles</option>
          {ASSIGNABLE_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-[13px] bg-input border border-subtle text-primary rounded-[4px] focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-surface border border-danger/30 rounded-[4px] text-[13px] text-danger">
          {error}
        </div>
      )}

      <Card>
        <Table
          columns={columns}
          data={users}
          loading={loading}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters."
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>

      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={refetch} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}
        title={`Delete ${deleteTarget?.fullName || deleteTarget?.email}?`}
        description="The user will lose access immediately."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
