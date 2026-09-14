import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { ExportPdfButton } from '../common/ExportPdfButton';
import { Edit, Layers, Plus, Trash2 } from 'lucide-react';
import { smibEnvironmentData } from '../../../mockData.js';

const toRows = (clientData) => {
  if (Array.isArray(clientData.applicationTemenosSpecs) && clientData.applicationTemenosSpecs.length > 0) {
    return clientData.applicationTemenosSpecs;
  }

  const appRows = Object.entries(clientData.appSpecs || {}).map(([parameter, value]) => ({
    parameter,
    value
  }));

  if (appRows.length > 0) return appRows;

  return smibEnvironmentData.applicationTemenosSpecs.map(({ parameter }) => ({
    parameter,
    value: 'N/A'
  }));
};

export const TemenosSpecTable = ({ readOnly = false, searchQuery = '' }) => {
  const { currentClientData, updateAppSpecs, activeClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(() => toRows(currentClientData));
  const rows = toRows(currentClientData);
  const query = searchQuery.trim().toLowerCase();
  const visibleRows = rows.filter((row) => (
    !query || `${row.parameter} ${row.value}`.toLowerCase().includes(query)
  ));

  useEffect(() => {
    setFormData(rows);
  }, [currentClientData]);

  const handleOpenEdit = () => {
    setFormData(rows.map((row) => ({ ...row })));
    setIsModalOpen(true);
  };

  const handleChange = (index, value) => {
    setFormData((current) => current.map((row, rowIndex) => (
      rowIndex === index ? { ...row, value } : row
    )));
  };

  const handleAddRow = () => {
    setFormData((current) => [...current, { parameter: `Custom Field ${current.length + 1}`, value: 'N/A' }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateAppSpecs(formData);
    setIsModalOpen(false);
  };

  return (
    <div id="application-specification" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Application & Temenos Specifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete Temenos application parameter matrix for <strong className="text-indigo-500">{activeClient}</strong>.
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

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              <tr>
                <th className="px-6 py-3.5 w-1/3 border-r border-slate-200 dark:border-slate-800">Application Parameter</th>
                <th className="px-6 py-3.5">Configured Specification Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {visibleRows.map((row) => (
                <tr key={row.parameter} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">{row.parameter}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-900 dark:text-slate-100 font-medium">{row.value || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!readOnly && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit Temenos Specifications for ${activeClient}`}>
          <form onSubmit={handleSubmit} className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
            {formData.map((row, index) => (
              <div key={`${row.parameter}-${index}`} className="flex items-end gap-2">
                <div className="flex-1">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Field name</label>
                <input type="text" value={row.parameter} onChange={(event) => setFormData((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, parameter: event.target.value } : item))} className="mb-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                <input
                  type="text"
                  value={row.value || ''}
                  onChange={(event) => handleChange(index, event.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                </div>
                <button type="button" onClick={() => setFormData((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="mb-2 text-rose-600" title="Remove custom field"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={handleAddRow} className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1.5 font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300"><Plus className="h-3.5 w-3.5" /> Add Custom Field</button>
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all">Save App Specs</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
