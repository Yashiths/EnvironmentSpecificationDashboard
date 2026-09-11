import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Workflow, Plus, Edit, Trash2 } from 'lucide-react';
import { ExportPdfButton } from '../common/ExportPdfButton';

export const IntegrationSpecTable = ({ readOnly = false }) => {
  const { currentClientData, addIntegrationSpec, updateIntegrationSpec, deleteIntegrationSpec, activeClient } = useData();
  const integrations = currentClientData.integrations || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    direction: 'Outbound / Inbound',
    protocol: 'REST / HTTPS',
    endpoint: '',
    middleware: 'Integration Framework',
    authentication: 'OAuth2 + Cert',
    status: 'Active'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      direction: 'Outbound / Inbound',
      protocol: 'REST / HTTPS',
      endpoint: 'https://api.partner.org/v1/gateway',
      middleware: 'Integration Framework (TCIB Hub)',
      authentication: 'OAuth2 + X.509 Cert',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      direction: item.direction || 'Outbound',
      protocol: item.protocol || 'REST / HTTPS',
      endpoint: item.endpoint || '',
      middleware: item.middleware || '',
      authentication: item.authentication || '',
      status: item.status || 'Active'
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

  const handleDelete = (id) => {
    if (window.confirm(`Delete integration specification ${id}?`)) {
      deleteIntegrationSpec(id);
    }
  };

  return (
    <div id="integration-specification" className="space-y-4">
      
      {/* Table Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-cyan-500" />
            Integration & Channel Endpoint Specification Table
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            External clearing gateways, SWIFT MQ brokers, and partner REST API channels for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportPdfButton targetId="integration-specification" filename={`${activeClient}-integrations`} categoryLabel="Integration Specification" activeClient={activeClient} />
          {!readOnly && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Integration Row
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
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Integration Name</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Direction</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Protocol</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Endpoint / Partner System</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Middleware</th>
                <th className="px-4 py-3.5 border-r border-slate-200 dark:border-slate-800">Authentication</th>
                <th className="px-4 py-3.5">Status</th>
                {!readOnly && <th className="px-4 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {integrations.length === 0 ? (
                <tr>
                  <td colSpan={readOnly ? 7 : 8} className="px-6 py-8 text-center text-slate-400">
                    No integration endpoints recorded for {activeClient}.
                  </td>
                </tr>
              ) : (
                integrations.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 font-medium">
                      {item.direction}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-cyan-600 dark:text-cyan-400 font-semibold border-r border-slate-200 dark:border-slate-800">
                      {item.protocol}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-indigo-600 dark:text-indigo-400 border-r border-slate-200 dark:border-slate-800 break-all">
                      {item.endpoint}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {item.middleware}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                      {item.authentication}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status} />
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
          title={editingItem ? `Edit Integration ${editingItem.name}` : 'Add Integration Specification Row'}
        >
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Integration Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Central Bank ACH Gateway"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Direction
                </label>
                <input
                  type="text"
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                  placeholder="e.g. Outbound / Inbound"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Protocol
                </label>
                <input
                  type="text"
                  value={formData.protocol}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                  placeholder="e.g. REST / HTTPS (Mutual TLS)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Endpoint URL / Partner System *
              </label>
              <input
                type="text"
                required
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                placeholder="e.g. https://api.gateway.gov/v2/clearing"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Middleware Tier
                </label>
                <input
                  type="text"
                  value={formData.middleware}
                  onChange={(e) => setFormData({ ...formData, middleware: e.target.value })}
                  placeholder="e.g. Integration Framework (TCIB Hub)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Authentication Method
                </label>
                <input
                  type="text"
                  value={formData.authentication}
                  onChange={(e) => setFormData({ ...formData, authentication: e.target.value })}
                  placeholder="e.g. OAuth2 + X.509 Client Cert"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Degraded">Degraded</option>
                <option value="Inactive">Inactive</option>
              </select>
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
                {editingItem ? 'Save Changes' : 'Add Endpoint'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
