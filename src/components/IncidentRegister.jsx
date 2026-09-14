import React, { useState } from 'react';
import { Eye, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Modal } from './common/Modal';
import { SeverityBadge, StatusBadge } from './common/Badge';

const detailFields = [
  ['Component', 'component'], ['Module', 'module'], ['Business Impact', 'impact'], ['Symptoms / Error', 'symptoms'],
  ['Initial Analysis', 'initialAnalysis'], ['Root Cause Category', 'rootCauseCategory'], ['Root Cause', 'rootCause'],
  ['Immediate Resolution', 'immediateResolution'], ['Permanent Resolution', 'permanentResolution'], ['Workaround', 'workaround'],
  ['Resolution Owner', 'resolutionOwner'], ['Infra Owner', 'infraOwner'], ['Client Contact', 'clientContact'],
  ['Closure Approval', 'closureApproval'], ['Deployment ID', 'deploymentId'], ['RCA Required', 'rcaRequired'],
  ['RCA Document', 'rcaDocument'], ['Preventive Action', 'preventiveAction'], ['Monitoring Added', 'monitoringAdded'],
  ['Knowledge Article', 'knowledgeArticle'], ['Lessons Learned', 'lessonsLearned']
];

const valueOf = (incident, key) => incident[key] || incident[{
  incidentId: 'id', summary: 'title', incidentDate: 'reportedDate'
}[key]] || 'N/A';

export const IncidentRegister = ({ readOnly = false }) => {
  const { currentClientData, activeClient } = useData();
  const incidents = currentClientData.incidents || [];
  const [selectedIncident, setSelectedIncident] = useState(null);

  return (
    <section className="space-y-4" id="incident-register">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Production Incident Register</h2>
        <p className="mt-1 text-sm text-slate-600">Summary of production incidents for {activeClient}. Select an incident to inspect its full record.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
              <tr>
                {['Incident ID', 'Client', 'Site / Country', 'Incident Date', 'Resolved Date', 'Environment', 'Severity', 'Summary', 'Status', 'Action'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.length === 0 ? (
                <tr><td colSpan="10" className="px-4 py-10 text-center text-slate-500">No production incidents recorded.</td></tr>
              ) : incidents.map((incident) => (
                <tr key={incident.id || incident.incidentId} className="align-top hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4 font-mono font-semibold text-slate-800">{valueOf(incident, 'incidentId')}</td>
                  <td className="px-4 py-4 text-slate-700">{valueOf(incident, 'client')}</td>
                  <td className="px-4 py-4 text-slate-700">{valueOf(incident, 'siteCountry')}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">{valueOf(incident, 'incidentDate')}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">{valueOf(incident, 'resolvedDate')}</td>
                  <td className="px-4 py-4 text-slate-700">{valueOf(incident, 'environment')}</td>
                  <td className="px-4 py-4"><SeverityBadge severity={incident.severity} /></td>
                  <td className="min-w-64 px-4 py-4 text-slate-700">{valueOf(incident, 'summary')}</td>
                  <td className="px-4 py-4"><StatusBadge status={incident.status} /></td>
                  <td className="px-4 py-4"><button type="button" onClick={() => setSelectedIncident(incident)} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"><Eye className="h-3.5 w-3.5" /> View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={Boolean(selectedIncident)} onClose={() => setSelectedIncident(null)} title={selectedIncident ? `Incident ${valueOf(selectedIncident, 'incidentId')}` : 'Incident Details'} maxWidth="max-w-4xl">
        {selectedIncident && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
              <SeverityBadge severity={selectedIncident.severity} />
              <StatusBadge status={selectedIncident.status} />
              {selectedIncident.rcaDocument && <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600"><FileText className="h-3.5 w-3.5" />{selectedIncident.rcaDocument}</span>}
            </div>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {detailFields.map(([label, key]) => <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-900">{valueOf(selectedIncident, key)}</dd></div>)}
            </dl>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default IncidentRegister;