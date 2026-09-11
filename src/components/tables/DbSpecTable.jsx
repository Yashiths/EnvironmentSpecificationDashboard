import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Edit, Database } from 'lucide-react';
import { ExportPdfButton } from '../common/ExportPdfButton';

export const DbSpecTable = ({ readOnly = false }) => {
  const { currentClientData, updateDbSpecs, activeClient } = useData();
  const dbSpecs = currentClientData.dbSpecs || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState([...dbSpecs]);

  const handleOpenEdit = () => {
    setFormData([...dbSpecs]);
    setIsModalOpen(true);
  };

  const handleChange = (index, newValue) => {
    const updated = [...formData];
    updated[index].value = newValue;
    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDbSpecs(formData);
    setIsModalOpen(false);
  };

  return (
    <div id="database-specification" className="space-y-4">
      
      {/* Table Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            Database Specification Data Table
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Database parameters, instance details, memory allocations, and backup strategy for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportPdfButton targetId="database-specification" filename={`${activeClient}-database`} categoryLabel="Database Specification" activeClient={activeClient} />
          {!readOnly && (
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit DB Parameters
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
                  Database Parameter
                </th>
                <th className="px-6 py-3.5">Configured Specification Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {dbSpecs.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                    {row.parameter}
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
          title={`Edit Database Specification Parameters for ${activeClient}`}
        >
          <form onSubmit={handleSubmit} className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
            {formData.map((row, idx) => (
              <div key={idx}>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {row.parameter}
                </label>
                <input
                  type="text"
                  value={row.value || ''}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>
            ))}

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
                Save DB Parameters
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
