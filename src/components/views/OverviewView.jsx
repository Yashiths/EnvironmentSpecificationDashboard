import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, SeverityBadge } from '../common/Badge';
import {
  AlertTriangle,
  Server,
  Layers,
  Database,
  Workflow,
  Building2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const OverviewView = ({ setActiveTab, readOnly = false }) => {
  const { currentClientData, activeClient } = useData();

  const clientInfo = currentClientData.clientInfo || {};
  const incidents = currentClientData.incidents || [];
  const infrastructure = currentClientData.infrastructure || [];
  const appSpecs = currentClientData.appSpecs || [];
  const dbSpecs = currentClientData.dbSpecs || {};
  const integrations = currentClientData.integrations || [];

  const openIncidentsCount = incidents.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length;
  const criticalIncidentsCount = incidents.filter(i => i.severity === 'Critical').length;
  const healthyServersCount = infrastructure.filter(s => s.status === 'Healthy').length;
  const activeIntegrationsCount = integrations.filter(i => i.status === 'Active').length;

  return (
    <div className="space-y-6">
      
      {/* Client Overview Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-6 sm:p-8 text-white shadow-xl border border-indigo-500/30">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <Building2 className="w-64 h-64 text-indigo-300" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Client Environment Dashboard • {clientInfo.code || activeClient}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {clientInfo.name || activeClient}
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {clientInfo.environmentType} • {clientInfo.datacenterLocation}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-slate-400">Target SLA:</span>
              <span className="font-semibold text-emerald-400">{clientInfo.slaTarget || '99.99%'}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-slate-400">Current Uptime:</span>
              <span className="font-semibold text-emerald-400">{clientInfo.currentUptime || '99.98%'}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-slate-400">Temenos License:</span>
              <span className="font-semibold text-indigo-300">{clientInfo.temenosLicenseTier || 'Enterprise'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => setActiveTab('incidents')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Incidents
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {openIncidentsCount}
            </span>
            <span className="text-xs text-rose-500 font-medium">
              ({criticalIncidentsCount} Critical)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
            View incident register <ArrowUpRight className="w-3.5 h-3.5" />
          </p>
        </div>

        <div
          onClick={() => setActiveTab('infrastructure')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Infrastructure
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {healthyServersCount} / {infrastructure.length}
            </span>
            <span className="text-xs text-emerald-500 font-medium">
              Healthy
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
            View infrastructure specs <ArrowUpRight className="w-3.5 h-3.5" />
          </p>
        </div>

        <div
          onClick={() => setActiveTab('app-specs')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Temenos Stack
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {appSpecs.length}
            </span>
            <span className="text-xs text-indigo-500 font-medium truncate max-w-[120px]">
              {appSpecs[0]?.version || 'Active'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
            View application matrix <ArrowUpRight className="w-3.5 h-3.5" />
          </p>
        </div>

        <div
          onClick={() => setActiveTab('integrations')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Integrations
            </span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
              <Workflow className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {activeIntegrationsCount} / {integrations.length}
            </span>
            <span className="text-xs text-cyan-500 font-medium">
              Active Endpoints
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
            View integration specs <ArrowUpRight className="w-3.5 h-3.5" />
          </p>
        </div>

      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recent Incidents ({incidents.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 3).map((incident) => (
              <div
                key={incident.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {incident.id}
                    </span>
                    <SeverityBadge severity={incident.severity} />
                  </div>
                  <StatusBadge status={incident.status} />
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {incident.title}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {incident.impact}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Database & Engine Specification
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('db-specs')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {readOnly ? 'View Specs' : 'Configure'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-slate-400 font-medium">DB Engine</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1 truncate">
                {dbSpecs.engine || 'N/A'}
              </div>
              <div className="text-[11px] text-indigo-500 font-mono mt-0.5">
                {dbSpecs.version}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-slate-400 font-medium">Nodes & Cluster</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1 truncate">
                {dbSpecs.nodesCount || 'N/A'}
              </div>
              <div className="text-[11px] text-emerald-500 font-mono mt-0.5">
                {dbSpecs.maxConnections}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-slate-400 font-medium">Compute Specs</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {dbSpecs.vcpu} • {dbSpecs.ram}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Buffer: {dbSpecs.bufferPoolSize}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-slate-400 font-medium">Storage Utilization</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {dbSpecs.storageUsed}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                Allocated: {dbSpecs.storageAllocated}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Clock className="w-4 h-4" />
              <span>Maintenance Window: <strong>{dbSpecs.maintenanceWindow}</strong></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
