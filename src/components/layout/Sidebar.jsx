import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  AlertTriangle,
  Building2,
  Server,
  Layers,
  Database,
  Workflow,
  BookOpen,
  ShieldAlert,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview & Status', icon: LayoutDashboard, badge: null },
  { id: 'client-info', label: 'Client & Site Info', icon: Building2, countKey: null },
  { id: 'incidents', label: 'Production Incident Register', icon: AlertTriangle, countKey: 'incidents' },
  { id: 'infrastructure', label: 'Infrastructure Specs', icon: Server, countKey: 'infrastructure' },
  { id: 'app-specs', label: 'Temenos & App Specs', icon: Layers, countKey: 'appSpecs' },
  { id: 'db-specs', label: 'Database Specs', icon: Database, countKey: null },
  { id: 'integrations', label: 'Integration Specs', icon: Workflow, countKey: 'integrations' },
  { id: 'rca-kb', label: 'Release & RCA KB', icon: BookOpen, countKey: 'rcaKb' },
  { id: 'user-management', label: 'User Management', icon: ShieldAlert, countKey: null, adminOnly: true },
  { id: 'client-management', label: 'Manage Banking Sites', icon: Building2, countKey: null, adminOnly: true },
  { id: 'audit-logs', label: 'Audit Logs', icon: ClipboardList, countKey: null, superAdminOnly: true },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentClientData } = useData();
  const { user, isAdmin } = useAuth();

  // Super Admin Role Check
  const isSuperAdmin = user?.role?.toLowerCase() === 'super admin';

  const getBadgeCount = (key) => {
    if (!key || !currentClientData || !currentClientData[key]) return null;
    return currentClientData[key].length;
  };

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 transition-colors">
      <div className="p-4 space-y-6">
        
        {/* Admin / Super Admin Ribbon */}
        {isSuperAdmin ? (
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/20 text-xs">
            <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-300">
              <ShieldAlert className="w-4 h-4 text-purple-500" />
              <span>Super Admin Mode</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Full control & Audit Logs access enabled.
            </p>
          </div>
        ) : isAdmin ? (
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-300">
              <ShieldAlert className="w-4 h-4 text-indigo-500" />
              <span>Admin Mode Active</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Full CRUD enabled. Action buttons visible across all tables.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
              <span>👁️ Viewer Mode</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Read-only view of environment specifications and incidents.
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Dashboard Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            if ((item.adminOnly && !isAdmin) || (item.superAdminOnly && !isSuperAdmin)) {
              return null;
            }

            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const count = getBadgeCount(item.countKey);

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                    }`}>
                      {count}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-white opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`} />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Help / Environment Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Environment Status
          </div>
          <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span>Primary Datacenter:</span>
              <span className="font-semibold text-emerald-500">ONLINE</span>
            </div>
            <div className="flex items-center justify-between">
              <span>DR Sync Lag:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">&lt; 200 ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Temenos License:</span>
              <span className="font-semibold text-indigo-500">VERIFIED</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};