import React, { useState } from 'react';
import { Building2, Power, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { apiUrl } from '../../config/api';

export const ClientManagement = () => {
  const { token } = useAuth();
  const { clients, refreshClients } = useData();
  const [formData, setFormData] = useState({ name: '', code: '', country: '' });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const request = async (url, options = {}) => {
    const response = await fetch(apiUrl(url), {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Request failed.');
    return result;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      await request('/api/clients', { method: 'POST', body: JSON.stringify(formData) });
      setFormData({ name: '', code: '', country: '' });
      await refreshClients();
      setMessage('Banking client created successfully.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (client, status) => {
    try {
      await request(`/api/clients/${client._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      await refreshClients();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteClient = async (client) => {
    if (!window.confirm(`Delete ${client.name}?`)) return;
    try {
      await request(`/api/clients/${client._id}`, { method: 'DELETE' });
      await refreshClients();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-indigo-500" />
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manage Banking Sites</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Maintain the client environments available in the dashboard selector.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
        {[
          ['name', 'Client Name', 'State Mortgage & Investment Bank'],
          ['code', 'Site Code', 'SMIB-PROD'],
          ['country', 'Country', 'Sri Lanka']
        ].map(([field, label, placeholder]) => (
          <label key={field} className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {label}
            <input
              required
              value={formData[field]}
              placeholder={placeholder}
              onChange={(event) => setFormData({ ...formData, [field]: event.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        ))}
        <button disabled={isSaving} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 md:col-span-3 md:justify-self-end">
          {isSaving ? 'Saving...' : 'Add Client Site'}
        </button>
        {message && <p className="text-sm text-slate-600 dark:text-slate-300 md:col-span-3">{message}</p>}
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
            <tr><th className="px-5 py-3">Client</th><th className="px-5 py-3">Code</th><th className="px-5 py-3">Country</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {clients.map((client) => (
              <tr key={client._id} className="text-slate-700 dark:text-slate-300">
                <td className="px-5 py-4 font-semibold">{client.name}</td>
                <td className="px-5 py-4 font-mono">{client.code}</td>
                <td className="px-5 py-4">{client.country}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{client.status}</span></td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => updateStatus(client, client.status === 'Active' ? 'Inactive' : 'Active')} className="mr-3 text-indigo-600 hover:text-indigo-800" title="Toggle status"><Power className="inline h-4 w-4" /></button>
                  <button onClick={() => deleteClient(client)} className="text-rose-600 hover:text-rose-800" title="Delete client"><Trash2 className="inline h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
