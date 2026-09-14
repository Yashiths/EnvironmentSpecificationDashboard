import React, { useState } from 'react';
import { Building2, Edit } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from './common/Modal';
import { ExportPdfButton } from './common/ExportPdfButton';

const fields = [
  ['Client', 'client'],
  ['Country', 'country'],
  ['Site', 'site'],
  ['Environment', 'environment'],
  ['Environment Type', 'environmentType'],
  ['DR Site', 'drSite'],
  ['Go-Live Date', 'goLiveDate'],
  ['Last Reviewed', 'lastReviewed'],
  ['Next Review Date', 'nextReviewDate'],
  ['Environment Owner', 'owner'],
  ['Application Owner', 'applicationOwner']
];

export const ClientInfo = ({ readOnly = false }) => {
  const { currentClientData, updateClientInfo, activeClient } = useData();
  const { isAdmin } = useAuth();
  const clientInfo = currentClientData.clientInfo || {};
  const clientSiteInfo = Array.isArray(currentClientData.clientSiteInfo)
    ? currentClientData.clientSiteInfo
    : fields.map(([field, key]) => ({
      field,
      value: clientInfo[key] || 'N/A'
    }));
  const canEdit = !readOnly && isAdmin;
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(clientInfo);

  const openEditor = () => {
    setFormData({ ...clientInfo });
    setIsOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateClientInfo(formData);
    setIsOpen(false);
  };

  return (
    <section className="space-y-4" id="client-info-specification">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-slate-100">
            <Building2 className="h-5 w-5 text-indigo-500" />
            Client Information Data Table
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Environment profile specs and site details for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportPdfButton targetId="client-info-specification" filename={`${activeClient}-client-info`} categoryLabel="Client Information" activeClient={activeClient} />
          {canEdit && <button type="button" onClick={openEditor} className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"><Edit className="h-3.5 w-3.5" />Edit Properties</button>}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 bg-slate-100 font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
              <tr>
                <th scope="col" className="w-1/3 border-r border-slate-200 px-6 py-3.5 dark:border-slate-800">
                  Field / Parameter
                </th>
                <th scope="col" className="px-6 py-3.5">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {clientSiteInfo.map((row) => (
                <tr key={row.field} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="border-r border-slate-200 px-6 py-3.5 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300">{row.field}</td>
                  <td className="px-6 py-3.5 font-mono font-medium text-slate-900 dark:text-slate-100">{row.value || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Edit Client Information for ${activeClient}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map(([label, key]) => (
              <label key={key} className="text-sm font-semibold text-slate-700">
                {label}
                <input
                  value={formData[key] || ''}
                  onChange={(event) => setFormData({ ...formData, [key]: event.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default ClientInfo;