import React, { useState } from 'react';
import { Building2, Edit } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from './common/Modal';

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
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Client Information</h2>
          </div>
          <p className="mt-1 text-sm text-slate-600">Environment profile for {activeClient}.</p>
        </div>
        {canEdit && (
          <button type="button" onClick={openEditor} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
            <Edit className="h-4 w-4" />
            Edit Properties
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th scope="col" className="w-1/3 border-r border-slate-200 px-5 py-3.5 font-semibold">
                  Field / Parameter
                </th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clientSiteInfo.map((row, index) => (
                <tr key={row.field} className={index % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                  <td className="border-r border-slate-200 px-5 py-3.5 font-medium text-slate-700">{row.field}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">{row.value || 'N/A'}</td>
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