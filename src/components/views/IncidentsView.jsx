import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, SeverityBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ExportPdfButton } from '../common/ExportPdfButton';
import {
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Filter,
  FileText,
  UserCheck
} from 'lucide-react';

export const IncidentsView = ({ searchQuery, readOnly = false }) => {
  const { currentClientData, addIncident, updateIncident, deleteIncident, activeClient } = useData();
  const { isAdmin } = useAuth();

  const canEdit = !readOnly && isAdmin;
  const incidents = currentClientData.incidents || [];

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    severity: 'High',
    environment: 'PROD',
    status: 'Open',
    impact: '',
    rootCause: '',
    resolution: '',
    owner: '',
    rcaId: ''
  });

  const handleOpenAddModal = () => {
    setEditingIncident(null);
    setFormData({
      title: '',
      severity: 'High',
      environment: 'PROD',
      status: 'Open',
      impact: '',
      rootCause: '',
      resolution: '',
      owner: '',
      rcaId: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (inc) => {
    setEditingIncident(inc);
    setFormData({
      title: inc.title || '',
      severity: inc.severity || 'High',
      environment: inc.environment || 'PROD',
      status: inc.status || 'Open',
      impact: inc.impact || '',
      rootCause: inc.rootCause || '',
      resolution: inc.resolution || '',
      owner: inc.owner || '',
      rcaId: inc.rcaId || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIncident) {
      updateIncident(editingIncident.id, formData);
    } else {
      addIncident(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete incident ${id}?`)) {
      deleteIncident(id);
    }
  };

  // Filter Logic
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      !searchQuery ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.impact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div id="incident-register" className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Production Incident & Resolution Register
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time track of outages, severity ratings, resolution details, and RCA refs for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportPdfButton targetId="incident-register" filename={`${activeClient}-incident-register`} categoryLabel="Production Incident Register" activeClient={activeClient} />
          {canEdit ? (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add New Incident
          </button>
          ) : (
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Public Client View-Only Mode</span>
          </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="text-slate-500 dark:text-slate-400 font-medium">
          Showing <strong>{filteredIncidents.length}</strong> of {incidents.length} incidents
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-5 py-3.5">Ref ID / Title</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-4 py-3.5">Environment</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Impact & Root Cause</th>
                <th className="px-4 py-3.5">Owner & Dates</th>
                {canEdit && <th className="px-4 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                    No matching production incidents found for this client.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4 align-top">
                      <div className="font-mono font-bold text-slate-500 dark:text-slate-400">
                        {inc.id}
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1 max-w-xs">
                        {inc.title}
                      </div>
                      {inc.rcaId && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          <FileText className="w-3 h-3" />
                          RCA: {inc.rcaId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <SeverityBadge severity={inc.severity} />
                    </td>
                    <td className="px-4 py-4 align-top font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {inc.environment}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusBadge status={inc.status} />
                    </td>
                    <td className="px-4 py-4 align-top max-w-sm space-y-1">
                      <div className="text-slate-800 dark:text-slate-200">
                        <strong className="text-slate-500 font-semibold">Impact:</strong> {inc.impact}
                      </div>
                      {inc.rootCause && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          <strong className="text-slate-400 font-medium">Root Cause:</strong> {inc.rootCause}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top text-xs space-y-1 text-slate-500 dark:text-slate-400">
                      <div className="font-medium text-slate-900 dark:text-slate-200">
                        {inc.owner}
                      </div>
                      <div className="font-mono text-[11px]">
                        Rep: {inc.reportedDate}
                      </div>
                      {inc.resolvedDate && (
                        <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                          Res: {inc.resolvedDate}
                        </div>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(inc)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                            title="Edit Incident"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(inc.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Delete Incident"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Incident Form Modal */}
      {canEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingIncident ? `Edit Incident ${editingIncident.id}` : 'Add New Production Incident'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Incident Summary / Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. PostgreSQL HikariCP connection pool timeout during batch processing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Severity *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Environment *
                </label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="PROD">PROD</option>
                  <option value="UAT">UAT</option>
                  <option value="DEV">DEV</option>
                  <option value="DR">DR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Business & Technical Impact *
              </label>
              <textarea
                required
                rows={2}
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                placeholder="Describe business SLA impact, affected users, or transaction drop rate"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Root Cause Description
              </label>
              <textarea
                rows={2}
                value={formData.rootCause}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                placeholder="Underlying technical root cause identified during analysis"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resolution Steps & Hotfixes Applied
              </label>
              <textarea
                rows={2}
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                placeholder="Action taken to restore services"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner / Assigned Engineer
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g. Alex Vance (Lead DBA)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Linked RCA Document Ref
                </label>
                <input
                  type="text"
                  value={formData.rcaId}
                  onChange={(e) => setFormData({ ...formData, rcaId: e.target.value })}
                  placeholder="e.g. RCA-2026-041"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                {editingIncident ? 'Save Changes' : 'Create Incident'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
