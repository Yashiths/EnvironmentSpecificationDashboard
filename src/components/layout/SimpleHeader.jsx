import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Landmark,
  Cpu,
  ChevronDown,
  Sun,
  Moon,
  ShieldCheck,
  Globe,
  RotateCcw,
  Check,
  LogOut
} from 'lucide-react';

export const SimpleHeader = ({ isAdminPortal = false }) => {
  const { activeClient, activeClientId, clients, setActiveClient, resetToDefaultData } = useData();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

  const activeClientObj = clients.find(client => client._id === activeClientId)
    || clients.find(client => client.code === activeClient)
    || { name: activeClient, code: activeClient, country: '' };

  const getClientIcon = (iconName) => {
    switch (iconName) {
      case 'Landmark': return <Landmark className="w-4 h-4 text-emerald-500" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-cyan-500" />;
      default: return <Building2 className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Title & Client Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Environment Specification Dashboard
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Structured Data Table Viewer {isAdminPortal ? '• Admin Mode' : ''}
                </p>
              </div>
            </div>

            {/* Client Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold transition-all"
              >
                {getClientIcon(activeClientObj.icon)}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {activeClientObj.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isClientMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Client Menu */}
              {isClientMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsClientMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Active Banking Client
                      </p>
                    </div>
                    {clients.map((client) => {
                      const isSelected = client._id === activeClientId;
                      return (
                        <button
                          key={client._id}
                          onClick={() => {
                            setActiveClient(client._id);
                            setIsClientMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {getClientIcon(client.icon)}
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {client.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {client.code} • {client.country}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-500" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Theme Switcher & Admin Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdminPortal && (
              <button
                onClick={() => {
                  if (window.confirm('Reset all mock client datasets back to original defaults?')) {
                    resetToDefaultData();
                  }
                }}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
                title="Reset Mock Dataset to Defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Portal Switcher Button */}
            {isAdminPortal ? (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Switch to User View</span>
              </button>
            ) : user?.role?.toLowerCase() === 'admin' ? (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            ) : null}

            {user && (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
