import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Server,
  Plus,
  Edit,
  Trash2,
  Cpu,
  HardDrive
} from 'lucide-react';

export const InfraSpecView = ({ searchQuery, readOnly = false }) => {
  const { currentClientData, addInfraSpec, updateInfraSpec, deleteInfraSpec, activeClient } = useData();
  const { isAdmin } = useAuth();

  const canEdit = !readOnly && isAdmin;
  const infrastructure = currentClientData.infrastructure || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    component: '',
    type: 'Application Server',
    hostname: '',
    ipAddress: '',
    vCpu: '32 vCPU',
    ram: '64 GB',
    os: 'RHEL 9.3 LTS',
    storage: '500 GB NVMe',
    status: 'Healthy',
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      component: '',
      type: 'Application Server',
      hostname: '',
      ipAddress: '',
      vCpu: '32 vCPU',
      ram: '64 GB',
      os: 'RHEL 9.3 LTS',
      storage: '500 GB NVMe',
      status: 'Healthy',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      component: item.component || '',
      type: item.type || 'Application Server',
      hostname: item.hostname || '',
      ipAddress: item.ipAddress || '',
      vCpu: item.vCpu || '32 vCPU',
      ram: item.ram || '64 GB',
      os: item.os || '',
      storage: item.storage || '',
      status: item.status || 'Healthy',
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateInfraSpec(editingItem.id, formData);
    } else {
      addInfraSpec(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete infrastructure spec node ${id}?`)) {
      deleteInfraSpec(id);
    }
  };

  const filteredInfra = infrastructure.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.component.toLowerCase().includes(q) ||
      item.hostname.toLowerCase().includes(q) ||
      item.ipAddress.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Infrastructure & Compute Specifications
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hardware node specifications, IP assignments, OS kernels, and cluster status for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Server Node
          </button>
        )}
      </div>

      {/* Grid of Server Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfra.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {item.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                    {item.component}
                  </h3>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {/* Hostname & IP */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Host:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                    {item.hostname}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">IP:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {item.ipAddress}
                  </span>
                </div>
              </div>

              {/* Spec Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Compute
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                    {item.vCpu} / {item.ram}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-500" /> Storage
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
                    {item.storage}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-slate-400 font-medium">OS / Kernel:</strong> {item.os}
              </div>

              {item.notes && (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {item.notes}
                </div>
              )}
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
          title={editingItem ? `Edit Server ${editingItem.component}` : 'Add New Infrastructure Server Node'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Component Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  placeholder="e.g. Temenos App Server - Node 3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Server Role / Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Application Server">Application Server</option>
                  <option value="Database Engine">Database Engine</option>
                  <option value="Caching Tier">Caching Tier</option>
                  <option value="Messaging Bus">Messaging Bus</option>
                  <option value="Load Balancer">Load Balancer</option>
                  <option value="Container Cluster">Container Cluster</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hostname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  placeholder="e.g. smib-app-prod-03.internal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  IP Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  placeholder="e.g. 10.240.12.103"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  vCPU Count
                </label>
                <input
                  type="text"
                  value={formData.vCpu}
                  onChange={(e) => setFormData({ ...formData, vCpu: e.target.value })}
                  placeholder="e.g. 32 vCPU"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  RAM Size
                </label>
                <input
                  type="text"
                  value={formData.ram}
                  onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                  placeholder="e.g. 64 GB DDR5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Node Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  OS & Kernel Release
                </label>
                <input
                  type="text"
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                  placeholder="e.g. RHEL 9.3 LTS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Storage Allocation
                </label>
                <input
                  type="text"
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  placeholder="e.g. 1.0 TB Enterprise NVMe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Notes / Cluster Info
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Active-Active worker node running WildFly 27"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
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
                {editingItem ? 'Save Node Specs' : 'Add Infrastructure Node'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
