import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { CLIENTS } from '../../data/mockData';
import {
  Building2,
  Landmark,
  Cpu,
  ChevronDown,
  Sun,
  Moon,
  Search,
  Check,
  ShieldCheck,
  LogOut,
  UserCheck
} from 'lucide-react';

export const ClientNavbar = ({ searchQuery, setSearchQuery }) => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activeClient, setActiveClient } = useData();
  const navigate = useNavigate();

  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const activeClientObj = CLIENTS.find(c => c.id === activeClient) || CLIENTS[0];

  const getClientIcon = (iconName) => {
    switch (iconName) {
      case 'Landmark': return <Landmark className="w-4 h-4 text-emerald-500" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-cyan-500" />;
      default: return <Building2 className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Client Selector & Brand */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-all shadow-sm"
              >
                {getClientIcon(activeClientObj.icon)}
                <span className="truncate max-w-[140px] sm:max-w-[200px]">
                  {activeClientObj.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  {activeClientObj.id}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isClientMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Client Menu Dropdown */}
              {isClientMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsClientMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Target Bank Environment
                      </p>
                    </div>
                    {CLIENTS.map((client) => {
                      const isSelected = client.id === activeClient;
                      return (
                        <button
                          key={client.id}
                          onClick={() => {
                            setActiveClient(client.id);
                            setIsClientMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getClientIcon(client.icon)}
                            <div>
                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                {client.name}
                              </div>
                              <div className="text-xs text-slate-400 font-mono">
                                {client.code}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Middle: Global Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search incidents, specs, IPs, Temenos versions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Theme Toggle & Admin Login CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Admin Portal Nav Link Button */}
            <button
              onClick={() => navigate(isAdmin ? '/admin' : '/admin/login')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Go to Admin Portal' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
