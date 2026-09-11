import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Edit, Building2, Plus, Trash2 } from 'lucide-react';
import { ExportPdfButton } from '../common/ExportPdfButton';

export const ClientInfoTable = ({ readOnly = false }) => {
  const { currentClientData, updateClientInfo, activeClient } = useData();
  const clientInfo = currentClientData.clientInfo || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...clientInfo });
  const [customRows, setCustomRows] = useState([]);

  const handleOpenEdit = () => {
    setFormData({ ...clientInfo });
    setCustomRows(Object.entries(clientInfo.customFields || {}).map(([label, value]) => ({ label, value })));
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateClientInfo({ ...formData, customFields: Object.fromEntries(customRows.filter(row => row.label.trim()).map(row => [row.label.trim(), row.value])) });
    setIsModalOpen(false);
  };

  const tableRows = [
    { label: 'Client / Legal Entity Name', value: clientInfo.client },
    { label: 'Country / Regional Location', value: clientInfo.country },
    { label: 'Site / Datacenter Footprint', value: clientInfo.site },
    { label: 'Environment Deployment Topology', value: clientInfo.environment },
    { label: 'Target Go-Live Date', value: clientInfo.goLiveDate },
    { label: 'Primary Owner / Technical Contact', value: clientInfo.owner },
    { label: '24/7 Support Escalation Contact', value: clientInfo.supportContact },
    { label: 'Temenos Software Licensing Tier', value: clientInfo.licenseTier },
    ...Object.entries(clientInfo.customFields || {}).map(([label, value]) => ({ label, value })),
  ];

  return (
    <div id="client-info-specification" className="space-y-4">
      
      {/* Table Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            Client Information Specification Table
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key-value specification for client environment topology <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportPdfButton targetId="client-info-specification" filename={`${activeClient}-client-info`} categoryLabel="Client Information Specification" activeClient={activeClient} />
          {!readOnly && (
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Client Specifications
          </button>
          )}
        </div>
      </div>

      {/* HTML Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              <tr>
                <th className="px-6 py-3.5 w-1/3 border-r border-slate-200 dark:border-slate-800">
                  Specification Field
                </th>
                <th className="px-6 py-3.5">Configured Specification Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {tableRows.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                    {row.label}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-900 dark:text-slate-100 font-medium">
                    {row.value || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal for Admin */}
      {!readOnly && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Edit Client Specifications for ${activeClient}`}
        >
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Client / Legal Entity Name
              </label>
              <input
                type="text"
                value={formData.client || ''}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Country / Regional Location
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Go-Live Date
                </label>
                <input
                  type="text"
                  value={formData.goLiveDate || ''}
                  onChange={(e) => setFormData({ ...formData, goLiveDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Site / Datacenter Footprint
              </label>
              <input
                type="text"
                value={formData.site || ''}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Environment Deployment Topology
              </label>
              <input
                type="text"
                value={formData.environment || ''}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Owner / Contact
                </label>
                <input
                  type="text"
                  value={formData.owner || ''}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  24/7 Support Contact
                </label>
                <input
                  type="text"
                  value={formData.supportContact || ''}
                  onChange={(e) => setFormData({ ...formData, supportContact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Temenos Licensing Tier
              </label>
              <input
                type="text"
                value={formData.licenseTier || ''}
                onChange={(e) => setFormData({ ...formData, licenseTier: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Custom Fields</label>
                <button type="button" onClick={() => setCustomRows([...customRows, { label: `Custom Field ${customRows.length + 1}`, value: 'N/A' }])} className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                  <Plus className="h-3.5 w-3.5" /> Add Custom Field
                </button>
              </div>
              {customRows.map((row, index) => (
                <div key={`${row.label}-${index}`} className="flex items-center gap-2">
                  <input value={row.label} onChange={(event) => setCustomRows(customRows.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} placeholder="Field name" className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                  <input value={row.value} onChange={(event) => setCustomRows(customRows.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} placeholder="Value" className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                  <button type="button" onClick={() => setCustomRows(customRows.filter((_, itemIndex) => itemIndex !== index))} className="text-rose-600" title="Remove custom field"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                Save Client Specs
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
