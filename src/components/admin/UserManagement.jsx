import React, { useEffect, useState } from 'react';
import { KeyRound, Mail, Plus, ShieldCheck, UserRound, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { apiUrl } from '../../config/api';

const API_URL = apiUrl('/api/auth');

export const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const loadUsers = async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Unable to load users.');
    setUsers(result.users);
  };

  useEffect(() => {
    if (!token) return;
    loadUsers().catch((error) => setStatus({ type: 'error', message: error.message }));
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to create user.');

      setFormData({ username: '', email: '', password: '', role: 'user' });
      setStatus({ type: 'success', message: 'User created successfully.' });
      await loadUsers();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setIsResetting(true);

    try {
      const response = await fetch(apiUrl(`/api/users/${resetUser._id}/reset-password`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to reset password.');

      setResetUser(null);
      setNewPassword('');
      window.dispatchEvent(new CustomEvent('app-toast', {
        detail: { type: 'success', message: `Password reset for ${resetUser.username}.` }
      }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('app-toast', {
        detail: { type: 'error', message: error.message }
      }));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">User Management</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create and review accounts with access to the environment dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-4">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Username
          <input
            required
            value={formData.username}
            onChange={(event) => setFormData({ ...formData, username: event.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Email Address
          <input
            required
            type="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Password
          <input
            required
            minLength={8}
            type="password"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Access Portal Role
          <select
            value={formData.role}
            onChange={(event) => setFormData({ ...formData, role: event.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="user">User Interface / Viewer Access</option>
            <option value="admin">Admin Panel / Full Access</option>
                      <option value="super-admin">Super Admin / Audit Access</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-4 lg:justify-self-end"
        >
          <Plus className="h-4 w-4" />
          {isSubmitting ? 'Creating User...' : 'Create User'}
        </button>
        {status.message && (
          <p className={`text-sm lg:col-span-4 ${status.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {status.message}
          </p>
        )}
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Registered System Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Username</th>
                <th className="px-5 py-3">Email Address</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((systemUser) => (
                <tr key={systemUser._id} className="text-slate-700 dark:text-slate-300">
                  <td className="px-5 py-4 font-semibold">{systemUser.username}</td>
                  <td className="px-5 py-4"><span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{systemUser.email}</span></td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${['admin', 'super admin'].includes(systemUser.role?.toLowerCase()) ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'}`}>
                      {['admin', 'super admin'].includes(systemUser.role?.toLowerCase()) ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
                      {systemUser.role === 'Super Admin' ? 'Super Admin' : systemUser.role?.toLowerCase() === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{systemUser.createdAt ? new Date(systemUser.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setResetUser(systemUser);
                        setNewPassword('');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                      title={`Reset password for ${systemUser.username}`}
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-400">No registered users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={Boolean(resetUser)}
        onClose={() => {
          if (!isResetting) {
            setResetUser(null);
            setNewPassword('');
          }
        }}
        title="Reset User Password"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Set a new password for <strong>{resetUser?.username}</strong>.
          </p>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            New Password
            <input
              required
              minLength={8}
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              type="button"
              disabled={isResetting}
              onClick={() => setResetUser(null)}
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isResetting}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {isResetting ? 'Saving...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
