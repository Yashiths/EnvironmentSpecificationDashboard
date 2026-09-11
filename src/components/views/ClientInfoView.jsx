import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  Building2,
  Edit,
  Globe,
  MapPin,
  PhoneCall,
  Calendar
} from 'lucide-react';

export const ClientInfoView = ({ readOnly = false }) => {
  const { currentClientData, updateClientInfo, activeClient } = useData();
  const { isAdmin } = useAuth();

  const canEdit = !readOnly && isAdmin;
  const clientInfo = currentClientData.clientInfo || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...clientInfo });

  const handleOpenEdit = () => {
    setFormData({ ...clientInfo });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateClientInfo(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Client Information Specification
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise topology, datacenter locations, primary contacts, and SLA tier configuration for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenEdit}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <Edit className="w-4 h-4" />
            Edit Client Properties
          </button>
        )}
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              General Organization Properties
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {clientInfo.status || 'Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 text-xs font-medium block">Organization Legal Name</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 mt-1 block">
                {clientInfo.name}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 text-xs font-medium block">Client Code Ref</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                {clientInfo.code}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 text-xs font-medium block">Environment Deployment Topology</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                {clientInfo.environmentType}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 text-xs font-medium block">Temenos Software Licensing Tier</span>
              <span className="font-semibold text-indigo-500 mt-1 block">
                {clientInfo.temenosLicenseTier}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              Datacenter & Disaster Recovery Footprint
            </span>
            <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
              {clientInfo.datacenterLocation}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <PhoneCall className="w-5 h-5 text-indigo-500" />
            Operations & Escalation Contacts
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 font-medium block">Primary DevOps Contact</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {clientInfo.primaryContact}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 font-medium block">24/7 L3 Support Escalation</span>
              <p className="font-semibold text-rose-600 dark:text-rose-400 mt-1">
                {clientInfo.supportEscalation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Target SLA Uptime:</span>
                <span className="font-bold text-emerald-500">{clientInfo.slaTarget}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Current SLA Uptime:</span>
                <span className="font-bold text-emerald-500">{clientInfo.currentUptime}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Last Security Audit:
              </span>
              <span className="font-mono text-slate-900 dark:text-slate-100">{clientInfo.lastAudit}</span>
            </div>
          </div>
        </div>

      </div>

      {canEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Edit Properties for ${clientInfo.name || activeClient}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client Code
                </label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Temenos Licensing Tier
                </label>
                <input
                  type="text"
                  value={formData.temenosLicenseTier || ''}
                  onChange={(e) => setFormData({ ...formData, temenosLicenseTier: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Environment Deployment Topology
              </label>
              <input
                type="text"
                value={formData.environmentType || ''}
                onChange={(e) => setFormData({ ...formData, environmentType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Datacenter & DR Footprint
              </label>
              <input
                type="text"
                value={formData.datacenterLocation || ''}
                onChange={(e) => setFormData({ ...formData, datacenterLocation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Contact Details
                </label>
                <input
                  type="text"
                  value={formData.primaryContact || ''}
                  onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Support Escalation Hotlines
                </label>
                <input
                  type="text"
                  value={formData.supportEscalation || ''}
                  onChange={(e) => setFormData({ ...formData, supportEscalation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Uptime SLA
                </label>
                <input
                  type="text"
                  value={formData.slaTarget || ''}
                  onChange={(e) => setFormData({ ...formData, slaTarget: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Uptime
                </label>
                <input
                  type="text"
                  value={formData.currentUptime || ''}
                  onChange={(e) => setFormData({ ...formData, currentUptime: e.target.value })}
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
                Update Properties
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
