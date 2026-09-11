import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Server, Plus, Edit, Trash2 } from 'lucide-react';
import { ExportPdfButton } from '../common/ExportPdfButton';

export const InfraSpecTable = ({ readOnly = false }) => {
  const { currentClientData, addInfraSpec, updateInfraSpec, deleteInfraSpec, activeClient } = useData();
  const infrastructure = currentClientData.infrastructure || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    component: '',
    spec: '',
    quantity: '2 Active Nodes',
    hostname: '',
    version: '',
    notes: ''
    ,customFields: []
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      component: '',
      spec: '32 vCPU, 64 GB DDR5 RAM, RHEL 9.3 LTS',
      quantity: '2 Active Nodes',
      hostname: '',
      version: 'WildFly 27 / Java 17',
      notes: ''
      ,customFields: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      component: item.component || '',
      spec: item.spec || '',
      quantity: item.quantity || '',
      hostname: item.hostname || '',
      version: item.version || '',
      notes: item.notes || ''
      ,customFields: item.customFields || []
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
    if (window.confirm(`Delete infrastructure spec row ${id}?`)) {
      deleteInfraSpec(id);
    }
  };

  return (
    <div id="infrastructure-specification" className="space-y-4">
      
      {/* Table Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            Infrastructure Specification Data Table
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hardware compute specs, memory allocations, hostnames, and notes for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportPdfButton targetId="infrastructure-specification" filename={`${activeClient}-infrastructure`} categoryLabel="Infrastructure Specification" activeClient={activeClient} />
          {!readOnly && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Infrastructure Row
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
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Component</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Specification</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Quantity / Nodes</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Hostname / Identifier</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Version / OS</th>
                <th className="px-4 py-3.5">Notes</th>
                {!readOnly && <th className="px-4 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {infrastructure.length === 0 ? (
                <tr>
                  <td colSpan={readOnly ? 6 : 7} className="px-6 py-8 text-center text-slate-400">
                    No infrastructure rows recorded for {activeClient}.
                  </td>
                </tr>
              ) : (
                infrastructure.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                      {item.component}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                      {item.spec}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-800">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-indigo-600 dark:text-indigo-400 border-r border-slate-200 dark:border-slate-800">
                      {item.hostname}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {item.version}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                      {item.notes || '-'}
                    </td>
                    {!readOnly && (
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            title="Edit Row"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            title="Delete Row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                    </tr>
                    {item.customFields?.length > 0 && (
                      <tr className="bg-indigo-50/40 dark:bg-indigo-950/20">
                        <td colSpan={readOnly ? 6 : 7} className="px-4 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold">Custom fields:</span>{' '}
                          {item.customFields.map((field) => `${field.label}: ${field.value || 'N/A'}`).join(' | ')}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {!readOnly && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? `Edit Node ${editingItem.component}` : 'Add Infrastructure Specification Row'}
        >
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Component Name *
              </label>
              <input
                type="text"
                required
                value={formData.component}
                onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                placeholder="e.g. Application Server Node 01"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Specification Details *
              </label>
              <input
                type="text"
                required
                value={formData.spec}
                onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                placeholder="e.g. 32 vCPU, 64 GB DDR5 RAM, RHEL 9.3 LTS"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity / Cluster Nodes
                </label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 2 Active Nodes"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hostname / Identifier
                </label>
                <input
                  type="text"
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  placeholder="e.g. smib-app-prod-01.internal"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Version / OS Release
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="e.g. WildFly 27.0.1 / Java 17 LTS"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Primary host behind HAProxy"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Custom Fields</label>
                <button type="button" onClick={() => setFormData({ ...formData, customFields: [...formData.customFields, { label: `Custom Field ${formData.customFields.length + 1}`, value: 'N/A' }] })} className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300"><Plus className="h-3.5 w-3.5" /> Add Custom Field</button>
              </div>
              {formData.customFields.map((field, index) => (
                <div key={`${field.label}-${index}`} className="flex items-center gap-2">
                  <input value={field.label} onChange={(event) => setFormData({ ...formData, customFields: formData.customFields.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) })} placeholder="Field name" className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                  <input value={field.value} onChange={(event) => setFormData({ ...formData, customFields: formData.customFields.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item) })} placeholder="Value" className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
                  <button type="button" onClick={() => setFormData({ ...formData, customFields: formData.customFields.filter((_, itemIndex) => itemIndex !== index) })} className="text-rose-600" title="Remove custom field"><Trash2 className="h-4 w-4" /></button>
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
                {editingItem ? 'Save Changes' : 'Add Row'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
