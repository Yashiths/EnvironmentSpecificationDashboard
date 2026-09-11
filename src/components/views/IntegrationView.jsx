import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Workflow,
  Plus,
  Edit,
  Trash2,
  Link,
  Zap
} from 'lucide-react';

export const IntegrationView = ({ searchQuery, readOnly = false }) => {
  const { currentClientData, addIntegrationSpec, updateIntegrationSpec, deleteIntegrationSpec, activeClient } = useData();
  const { isAdmin } = useAuth();

  const canEdit = !readOnly && isAdmin;
  const integrations = currentClientData.integrations || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    protocol: 'REST / HTTPS',
    endpointUrl: '',
    partnerSystem: '',
    authMethod: 'OAuth2 + TLS',
    status: 'Active',
    latencyMs: '35 ms',
    avgDailyTx: '500,000 tx/day'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      protocol: 'REST / HTTPS',
      endpointUrl: 'https://api.partner-bank.org/v1/clearing',
      partnerSystem: 'National Clearing House',
      authMethod: 'OAuth2 + X509 Cert',
      status: 'Active',
      latencyMs: '35 ms',
      avgDailyTx: '250,000 tx/day'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      protocol: item.protocol || 'REST / HTTPS',
      endpointUrl: item.endpointUrl || '',
      partnerSystem: item.partnerSystem || '',
      authMethod: item.authMethod || '',
      status: item.status || 'Active',
      latencyMs: item.latencyMs || '35 ms',
      avgDailyTx: item.avgDailyTx || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateIntegrationSpec(editingItem.id, formData);
    } else {
      addIntegrationSpec(formData);
    }
    setIsModalOpen(false);
  };

  const handleStatusToggle = (item) => {
    if (!canEdit) return;
    const nextStatus = item.status === 'Active' ? 'Degraded' : item.status === 'Degraded' ? 'Inactive' : 'Active';
    updateIntegrationSpec(item.id, { status: nextStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete integration spec endpoint ${id}?`)) {
      deleteIntegrationSpec(id);
    }
  };

  const filteredIntegrations = integrations.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.endpointUrl.toLowerCase().includes(q) ||
      item.partnerSystem.toLowerCase().includes(q) ||
      item.protocol.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-6 h-6 text-cyan-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Integration & Channel Endpoint Specifications
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            External clearing gateways, SWIFT MQ brokers, SMS gateways, and partner REST APIs for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Endpoint Integration
          </button>
        )}
      </div>

      {/* Grid of Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-2.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
                    {item.protocol}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {item.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusToggle(item)}
                  title={canEdit ? "Click to toggle endpoint health status" : "Status Indicator"}
                  className={canEdit ? "cursor-pointer hover:scale-105 transition-transform" : "cursor-default"}
                >
                  <StatusBadge status={item.status} />
                </button>
              </div>

              {/* Endpoint URL Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1 font-mono text-xs">
                <div className="text-slate-400 text-[11px] font-sans font-medium flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-indigo-500" /> Target Endpoint / Channel URL
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 font-semibold break-all">
                  {item.endpointUrl}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-400 block text-[11px] font-medium">Partner System</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
                    {item.partnerSystem}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-400 block text-[11px] font-medium">Authentication Method</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                    {item.authMethod}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Zap className="w-4 h-4" />
                  <span>Latency: {item.latencyMs}</span>
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  Throughput: {item.avgDailyTx}
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">{item.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? `Edit Integration ${editingItem.name}` : 'Add New Integration Endpoint'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Integration Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Central Bank ACH Gateway"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Protocol / Transport *
                </label>
                <input
                  type="text"
                  required
                  value={formData.protocol}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                  placeholder="e.g. REST / HTTPS (Mutual TLS)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Endpoint URL / Broker Address *
              </label>
              <input
                type="text"
                required
                value={formData.endpointUrl}
                onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                placeholder="e.g. https://api.gateway.gov/v2/clearing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Partner System / Provider
                </label>
                <input
                  type="text"
                  value={formData.partnerSystem}
                  onChange={(e) => setFormData({ ...formData, partnerSystem: e.target.value })}
                  placeholder="e.g. SWIFT Financial Network"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Authentication & Security Scheme
                </label>
                <input
                  type="text"
                  value={formData.authMethod}
                  onChange={(e) => setFormData({ ...formData, authMethod: e.target.value })}
                  placeholder="e.g. OAuth2 + HSM Signing"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Latency SLA
                </label>
                <input
                  type="text"
                  value={formData.latencyMs}
                  onChange={(e) => setFormData({ ...formData, latencyMs: e.target.value })}
                  placeholder="e.g. 35 ms"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Avg Daily Throughput
                </label>
                <input
                  type="text"
                  value={formData.avgDailyTx}
                  onChange={(e) => setFormData({ ...formData, avgDailyTx: e.target.value })}
                  placeholder="e.g. 150,000 tx/day"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Endpoint Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Degraded">Degraded</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                {editingItem ? 'Save Integration Specs' : 'Add Endpoint'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
