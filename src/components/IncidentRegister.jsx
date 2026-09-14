import React, { useState } from 'react';
import { AlertTriangle, Eye, FileText, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Modal } from './common/Modal';
import { SeverityBadge, StatusBadge } from './common/Badge';
import { ExportPdfButton } from './common/ExportPdfButton';

const formFields = [
  ['Incident ID', 'incidentId'], ['Client', 'client'], ['Site / Country', 'siteCountry'],
  ['Incident Date', 'incidentDate'], ['Resolved Date', 'resolvedDate'], ['Environment', 'environment'],
  ['Component', 'component'], ['Module', 'module'], ['Severity', 'severity'], ['Summary', 'summary'],
  ['Business Impact', 'impact'], ['Symptoms / Error', 'symptoms'], ['Initial Analysis', 'initialAnalysis'],
  ['Root Cause Category', 'rootCauseCategory'], ['Root Cause', 'rootCause'], ['Immediate Resolution', 'immediateResolution'],
  ['Permanent Resolution', 'permanentResolution'], ['Workaround', 'workaround'], ['Resolution Owner', 'resolutionOwner'],
  ['Infra Owner', 'infraOwner'], ['Client Contact', 'clientContact'], ['Deployment ID', 'deploymentId'],
  ['RCA Required', 'rcaRequired'], ['RCA Document', 'rcaDocument'], ['Preventive Action', 'preventiveAction'],
  ['Monitoring Added', 'monitoringAdded'], ['Knowledge Article', 'knowledgeArticle'], ['Status', 'status'],
  ['Lessons Learned', 'lessonsLearned'], ['Closure Approval', 'closureApproval']
];

const textAreas = new Set(['summary', 'impact', 'symptoms', 'initialAnalysis', 'rootCause', 'immediateResolution', 'permanentResolution', 'workaround', 'preventiveAction', 'lessonsLearned']);
const emptyForm = () => Object.fromEntries(formFields.map(([, key]) => [key, key === 'severity' ? 'Medium' : key === 'status' ? 'Open' : key === 'rcaRequired' || key === 'monitoringAdded' ? 'No' : '']));
const valueOf = (incident, key) => incident[key] || incident[{ incidentId: 'id', summary: 'title', incidentDate: 'reportedDate' }[key]] || 'N/A';
const detailGroups = [
  ['Overview', ['incidentId', 'client', 'siteCountry', 'incidentDate', 'resolvedDate', 'environment', 'component', 'module', 'severity', 'summary', 'status']],
  ['Diagnostics & Analysis', ['impact', 'symptoms', 'initialAnalysis', 'rootCauseCategory', 'rootCause']],
  ['Resolution Details', ['immediateResolution', 'permanentResolution', 'workaround', 'preventiveAction', 'monitoringAdded']],
  ['Ownership & Governance', ['resolutionOwner', 'infraOwner', 'clientContact', 'closureApproval', 'deploymentId', 'rcaRequired', 'rcaDocument', 'knowledgeArticle', 'lessonsLearned']]
];
const labelFor = (key) => formFields.find(([, field]) => field === key)?.[0] || key;

export const IncidentRegister = ({ readOnly = false }) => {
  const { currentClientData, activeClient, addIncident } = useData();
  const incidents = currentClientData.incidents || [];
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm());

  const openAddModal = () => {
    setFormData({ ...emptyForm(), client: activeClient });
    setIsAddOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addIncident({ ...formData, client: formData.client || activeClient });
    setIsAddOpen(false);
    setFormData(emptyForm());
  };

  return (
    <section className="space-y-4" id="incident-register">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-slate-100"><AlertTriangle className="h-5 w-5 text-rose-500" />Production Incident Register</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Tracked operational incidents, root cause analyses, and resolution registers for <strong className="text-indigo-500">{activeClient}</strong>.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportPdfButton targetId="incident-register" filename={`${activeClient}-incident-register`} categoryLabel="Production Incident Register" activeClient={activeClient} />
          {!readOnly && <button type="button" onClick={openAddModal} className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"><Plus className="h-3.5 w-3.5" />Log New Incident</button>}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="overflow-x-auto"><table className="w-full min-w-[1100px] border-collapse text-left text-xs sm:text-sm"><thead className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wide text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"><tr>{['Incident ID', 'Client', 'Site / Country', 'Incident Date', 'Resolved Date', 'Environment', 'Severity', 'Summary', 'Status', 'Action'].map((label) => <th key={label} className="px-4 py-3.5">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{incidents.length === 0 ? <tr><td colSpan="10" className="px-4 py-10 text-center text-slate-500">No production incidents recorded.</td></tr> : incidents.map((incident) => <tr key={incident.id || incident.incidentId} className="align-top transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="whitespace-nowrap px-4 py-3.5 font-mono font-semibold text-indigo-700 dark:text-indigo-400">{valueOf(incident, 'incidentId')}</td><td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">{valueOf(incident, 'client')}</td><td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">{valueOf(incident, 'siteCountry')}</td><td className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-300">{valueOf(incident, 'incidentDate')}</td><td className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-300">{valueOf(incident, 'resolvedDate')}</td><td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">{valueOf(incident, 'environment')}</td><td className="px-4 py-3.5"><SeverityBadge severity={incident.severity} /></td><td className="min-w-64 px-4 py-3.5 text-slate-700 dark:text-slate-300">{valueOf(incident, 'summary')}</td><td className="px-4 py-3.5"><StatusBadge status={incident.status} /></td><td className="px-4 py-3.5"><button type="button" onClick={() => setSelectedIncident(incident)} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"><Eye className="h-3.5 w-3.5" />View Details</button></td></tr>)}</tbody></table></div></div>

      <Modal isOpen={Boolean(selectedIncident)} onClose={() => setSelectedIncident(null)} title={selectedIncident ? `Incident ${valueOf(selectedIncident, 'incidentId')}` : 'Incident Details'} maxWidth="max-w-4xl">{selectedIncident && <div className="space-y-5"><div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4"><SeverityBadge severity={selectedIncident.severity} /><StatusBadge status={selectedIncident.status} />{selectedIncident.rcaDocument && <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600"><FileText className="h-3.5 w-3.5" />{selectedIncident.rcaDocument}</span>}</div>{detailGroups.map(([group, keys]) => <section key={group}><h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-bold text-slate-900">{group}</h3><dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{keys.map((key) => <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{labelFor(key)}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-900">{valueOf(selectedIncident, key)}</dd></div>)}</dl></section>)}</div>}</Modal>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Log New Production Incident" maxWidth="max-w-5xl"><form onSubmit={handleSubmit} className="space-y-5"><div className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">{formFields.map(([label, key]) => <label key={key} className={`block text-sm font-semibold text-slate-700 ${textAreas.has(key) ? 'sm:col-span-2' : ''}`}>{label}{textAreas.has(key) ? <textarea required={['incidentId', 'client', 'summary'].includes(key)} rows="3" value={formData[key]} onChange={(event) => setFormData({ ...formData, [key]: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /> : key === 'severity' ? <select value={formData[key]} onChange={(event) => setFormData({ ...formData, [key]: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900"><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select> : key === 'status' ? <select value={formData[key]} onChange={(event) => setFormData({ ...formData, [key]: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900"><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select> : key === 'rcaRequired' || key === 'monitoringAdded' ? <select value={formData[key]} onChange={(event) => setFormData({ ...formData, [key]: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900"><option>Yes</option><option>No</option></select> : <input required={['incidentId', 'client'].includes(key)} value={formData[key]} onChange={(event) => setFormData({ ...formData, [key]: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />}</label>)}</div><div className="flex justify-end gap-2 border-t border-slate-200 pt-4"><button type="button" onClick={() => setIsAddOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save Incident</button></div></form></Modal>
    </section>
  );
};

export default IncidentRegister;