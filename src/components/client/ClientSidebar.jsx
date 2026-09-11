import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../layout/Sidebar';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientSidebar = ({ activeTab, setActiveTab }) => {
  const { currentClientData } = useData();
  const { user, isAdmin } = useAuth();
  const isSuperAdmin = user?.role?.toLowerCase() === 'super admin';

  const getBadgeCount = (key) => {
    if (!key || !currentClientData || !currentClientData[key]) return null;
    return currentClientData[key].length;
  };

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 transition-colors">
      <div className="p-4 space-y-6">
        
        {/* Client Viewer Banner */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
            <span>👁️ Public Client Portal</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            View-only access to operational specifications and real-time incident registers.
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Portal Views
          </div>

          {NAV_ITEMS.map((item) => {
            if ((item.adminOnly && !isAdmin) || (item.superAdminOnly && !isSuperAdmin)) return null;

            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const count = getBadgeCount(item.countKey);

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-semibold'
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

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Client Portal Info
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Data is synchronized live from the Bank Operations Control Center.
          </p>
        </div>

      </div>
    </aside>
  );
};
