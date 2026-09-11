import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Layers,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

export const AppSpecView = ({ searchQuery, readOnly = false }) => {
  const { currentClientData, addAppSpec, updateAppSpec, deleteAppSpec, activeClient } = useData();
  const { isAdmin } = useAuth();

  const canEdit = !readOnly && isAdmin;
  const appSpecs = currentClientData.appSpecs || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Core Banking Engine',
    version: '',
    buildNumber: '',
    tafjVersion: '',
    deploymentPath: '',
    status: 'Active',
    description: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Core Banking Engine',
      version: 'R22.00.04 Enterprise',
      buildNumber: 'Build 2026.08.10',
      tafjVersion: 'TAFJ 2022.08.01',
      deploymentPath: '/opt/temenos/transact',
      status: 'Active',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Core Banking Engine',
      version: item.version || '',
      buildNumber: item.buildNumber || '',
      tafjVersion: item.tafjVersion || '',
      deploymentPath: item.deploymentPath || '',
      status: item.status || 'Active',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateAppSpec(editingItem.id, formData);
    } else {
      addAppSpec(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete application spec item ${id}?`)) {
      deleteAppSpec(id);
    }
  };

  const filteredApps = appSpecs.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.version.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tafjVersion.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Application & Temenos Stack Specifications
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Software matrix for Temenos Transact, TAFJ Runtime, IRIS API Gateways, and UI modules for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add App Stack Component
          </button>
        )}
      </div>

      {/* Grid of App Stack Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {item.name}
                  </h3>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {/* Version Specs Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] font-medium">Software Version</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                    {item.version}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px] font-medium">Build Number / Hash</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1 block truncate">
                    {item.buildNumber}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">TAFJ / Runtime Engine:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.tafjVersion}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Deployment Path:</span>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                    {item.deploymentPath}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            {canEdit && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">{item.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Version
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
          title={editingItem ? `Edit Component ${editingItem.name}` : 'Add New Application Stack Component'}
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Temenos Transact Core"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stack Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Core Banking Engine">Core Banking Engine</option>
                  <option value="API & Microservices">API & Microservices</option>
                  <option value="Frontend / Backoffice">Frontend / Backoffice</option>
                  <option value="Middleware">Middleware</option>
                  <option value="Security / Auth">Security / Auth</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Software Version *
                </label>
                <input
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g. R22.00.04 Enterprise"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Build Number / Release Hash
                </label>
                <input
                  type="text"
                  value={formData.buildNumber}
                  onChange={(e) => setFormData({ ...formData, buildNumber: e.target.value })}
                  placeholder="e.g. Build 2026.04.18"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  TAFJ / Runtime Version
                </label>
                <input
                  type="text"
                  value={formData.tafjVersion}
                  onChange={(e) => setFormData({ ...formData, tafjVersion: e.target.value })}
                  placeholder="e.g. TAFJ 2022.08.01 (Java 17)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deployment File Path
                </label>
                <input
                  type="text"
                  value={formData.deploymentPath}
                  onChange={(e) => setFormData({ ...formData, deploymentPath: e.target.value })}
                  placeholder="e.g. /opt/temenos/transact/R22"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description & Operational Purpose
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Primary responsibilities of this application layer..."
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
                {editingItem ? 'Save Application Specs' : 'Add Component'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
