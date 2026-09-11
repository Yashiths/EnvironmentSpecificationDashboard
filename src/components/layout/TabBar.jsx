import React from 'react';
import { useAuth } from '../../context/AuthContext';
export const SPEC_TABS = [
  { id: 'client-info', label: 'Client Information', path: '/client-info' },
  { id: 'incidents', label: 'Production Incident Register', path: '/incidents' },
  { id: 'infrastructure', label: 'Infrastructure Specification', path: '/infrastructure' },
  { id: 'app-specs', label: 'Application Specification', path: '/app-specs' },
  { id: 'db-specs', label: 'Database Specification', path: '/db-specs' },
  { id: 'integrations', label: 'Integration Specification', path: '/integrations' },
  { id: 'user-management', label: 'User Management', path: '/users' },
  { id: 'client-management', label: 'Manage Banking Sites', path: '/clients' },
  { id: 'audit-logs', label: 'Audit Logs', path: '/audit-logs' },
];

export const TabBar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const filteredMenuItems = SPEC_TABS.filter((item) => {
    if (item.id === 'audit-logs') {
      return user?.role?.toLowerCase() === 'super admin';
    }
    if (item.label === 'User Management' || item.path === '/users' || item.id === 'client-management') {
      return ['admin', 'super admin'].includes(user?.role?.toLowerCase());
    }
    return true;
  });

  return (
    <aside className="w-full lg:w-80 lg:min-w-[320px] lg:shrink-0 bg-slate-100 dark:bg-slate-900/80 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible p-3 sm:p-4 lg:sticky lg:top-20 scrollbar-none" aria-label="Specification sections">
        {filteredMenuItems.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-start px-4 py-3 lg:w-full rounded-r-xl border-l-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 text-left ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
