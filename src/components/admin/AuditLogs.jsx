import React, { useEffect, useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../config/api';

export const AuditLogs = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const response = await fetch(apiUrl(`/api/audit-logs${query}`), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Unable to load audit logs.');
        setLogs(result.logs);
        setError('');
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    if (token) loadLogs();
  }, [search, token]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-indigo-500" />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Audit Logs</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Read-only record of sensitive system activity.</p>
          </div>
        </div>
        <label className="relative block w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter username or action"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">Performed By</th>
              <th className="px-5 py-3">Action Type</th>
              <th className="px-5 py-3">Target / Details</th>
              <th className="px-5 py-3">IP / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {logs.map((log) => (
              <tr key={log._id} className="align-top text-slate-700 dark:text-slate-300">
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-5 py-4">{log.performedBy?.email || 'unknown'}</td>
                <td className="px-5 py-4 font-semibold">{log.action}</td>
                <td className="px-5 py-4"><div className="font-medium">{log.target}</div><div className="mt-1 text-xs text-slate-500">{typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}</div></td>
                <td className="px-5 py-4"><div className="font-mono text-xs">{log.ipAddress}</div><span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold ${log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{log.status}</span></td>
              </tr>
            ))}
            {!logs.length && <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400">No audit activity found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
