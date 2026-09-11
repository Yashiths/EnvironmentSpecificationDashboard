import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Edit, Layers } from 'lucide-react';
import { ExportPdfButton } from '../common/ExportPdfButton';

export const AppSpecTable = ({ readOnly = false }) => {
  const { currentClientData, updateAppSpecs, activeClient } = useData();
  const appSpecs = currentClientData.appSpecs || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...appSpecs });

  const handleOpenEdit = () => {
    setFormData({ ...appSpecs });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAppSpecs(formData);
    setIsModalOpen(false);
  };

  const tableRows = [
    { label: 'Temenos Core Product', value: appSpecs.temenosProduct },
    { label: 'Software Release & Build', value: appSpecs.release },
    { label: 'TAFJ Runtime Engine Version', value: appSpecs.tafjVersion },
    { label: 'IRIS API Gateway Version', value: appSpecs.irisVersion },
    { label: 'Java Development Kit (JDK) Version', value: appSpecs.javaVersion },
    { label: 'Active Cluster Workers / Nodes', value: appSpecs.nodes },
    { label: 'CI/CD Pipeline & Orchestration Tool', value: appSpecs.cicdTool },
    { label: 'Application Deployment File Path', value: appSpecs.deploymentPath },
  ];

  return (
    <div id="application-specification" className="space-y-4">
      
      {/* Table Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Application Specification Table
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Temenos Transact core product versioning and stack specifications for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportPdfButton targetId="application-specification" filename={`${activeClient}-application`} categoryLabel="Application Specification" activeClient={activeClient} />
          {!readOnly && (
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Application Specs
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
                  Temenos Stack Field
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

      {/* Edit Modal */}
      {!readOnly && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Edit Temenos Stack Specifications for ${activeClient}`}
        >
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Temenos Core Product
              </label>
              <input
                type="text"
                value={formData.temenosProduct || ''}
                onChange={(e) => setFormData({ ...formData, temenosProduct: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Software Release
                </label>
                <input
                  type="text"
                  value={formData.release || ''}
                  onChange={(e) => setFormData({ ...formData, release: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  TAFJ Version
                </label>
                <input
                  type="text"
                  value={formData.tafjVersion || ''}
                  onChange={(e) => setFormData({ ...formData, tafjVersion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  IRIS Version
                </label>
                <input
                  type="text"
                  value={formData.irisVersion || ''}
                  onChange={(e) => setFormData({ ...formData, irisVersion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Java Version
                </label>
                <input
                  type="text"
                  value={formData.javaVersion || ''}
                  onChange={(e) => setFormData({ ...formData, javaVersion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Active Worker Nodes
                </label>
                <input
                  type="text"
                  value={formData.nodes || ''}
                  onChange={(e) => setFormData({ ...formData, nodes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CI/CD Tooling
                </label>
                <input
                  type="text"
                  value={formData.cicdTool || ''}
                  onChange={(e) => setFormData({ ...formData, cicdTool: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deployment File Path
              </label>
              <input
                type="text"
                value={formData.deploymentPath || ''}
                onChange={(e) => setFormData({ ...formData, deploymentPath: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
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
                Save App Specs
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
