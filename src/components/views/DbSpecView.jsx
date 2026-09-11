import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  Database,
  Edit,
  Cpu,
  HardDrive,
  Clock
} from 'lucide-react';

export const DbSpecView = ({ readOnly = false }) => {
  const { currentClientData, updateDbSpec, activeClient } = useData();
  const { isAdmin } = useAuth();

  const canEdit = !readOnly && isAdmin;
  const dbSpecs = currentClientData.dbSpecs || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...dbSpecs });

  const handleOpenEdit = () => {
    setFormData({ ...dbSpecs });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDbSpec(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Database Engine & Cluster Specification
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Engine versioning, HA replication parameters, buffer pools, and storage IOPS for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenEdit}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <Edit className="w-4 h-4" />
            Edit DB Parameters
          </button>
        )}
      </div>

      {/* Grid of Database Specs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Engine Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Engine & Topology
              </h3>
              <p className="text-xs text-slate-400">Core database software</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block font-medium">Database Engine Name</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5 block">
                {dbSpecs.engine}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block font-medium">Engine Version / Patch</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {dbSpecs.version}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block font-medium">Instance Identifier</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                {dbSpecs.instanceName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block font-medium">Cluster Nodes & HA Topology</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {dbSpecs.nodesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Compute Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Compute & Connection Pools
              </h3>
              <p className="text-xs text-slate-400">Memory & worker limits</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 block font-medium">vCPU Cores</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                  {dbSpecs.vcpu}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 block font-medium">RAM Allocation</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                  {dbSpecs.ram}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block font-medium">Connection Capacity</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Active: {dbSpecs.activeConnections}
                </span>
                <span className="font-mono text-indigo-500 font-bold">
                  Max: {dbSpecs.maxConnections}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block font-medium">Buffer Cache / Shared Buffers</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                {dbSpecs.bufferPoolSize}
              </span>
            </div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Storage & Backup Maintenance
              </h3>
              <p className="text-xs text-slate-400">IOPS, disk & PITR window</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block font-medium">Storage Capacity & Utilization</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">
                {dbSpecs.storageUsed} / {dbSpecs.storageAllocated}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 block font-medium">Backup & Archiving</span>
              <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {dbSpecs.backupStrategy}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                Maintenance Window:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{dbSpecs.maintenanceWindow}</span>
            </div>
          </div>
        </div>

      </div>

      {canEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Edit Database Configuration for ${dbSpecs.instanceName || activeClient}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Database Engine Name
                </label>
                <input
                  type="text"
                  value={formData.engine || ''}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Version / Patchset
                </label>
                <input
                  type="text"
                  value={formData.version || ''}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instance Identifier
                </label>
                <input
                  type="text"
                  value={formData.instanceName || ''}
                  onChange={(e) => setFormData({ ...formData, instanceName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nodes & Topology
                </label>
                <input
                  type="text"
                  value={formData.nodesCount || ''}
                  onChange={(e) => setFormData({ ...formData, nodesCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  vCPU Specs
                </label>
                <input
                  type="text"
                  value={formData.vcpu || ''}
                  onChange={(e) => setFormData({ ...formData, vcpu: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  RAM Size
                </label>
                <input
                  type="text"
                  value={formData.ram || ''}
                  onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Max Connection Limit
                </label>
                <input
                  type="text"
                  value={formData.maxConnections || ''}
                  onChange={(e) => setFormData({ ...formData, maxConnections: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Storage Allocated
                </label>
                <input
                  type="text"
                  value={formData.storageAllocated || ''}
                  onChange={(e) => setFormData({ ...formData, storageAllocated: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Storage Used
                </label>
                <input
                  type="text"
                  value={formData.storageUsed || ''}
                  onChange={(e) => setFormData({ ...formData, storageUsed: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Backup Strategy
              </label>
              <input
                type="text"
                value={formData.backupStrategy || ''}
                onChange={(e) => setFormData({ ...formData, backupStrategy: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Maintenance Window
              </label>
              <input
                type="text"
                value={formData.maintenanceWindow || ''}
                onChange={(e) => setFormData({ ...formData, maintenanceWindow: e.target.value })}
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
                Save Database Parameters
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
