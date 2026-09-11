import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { CLIENTS } from '../../data/mockData';
import { RoleBadge } from '../common/Badge';
import {
  Building2,
  Landmark,
  Cpu,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  RotateCcw,
  Search,
  Check,
  ShieldCheck,
  Globe,
  ExternalLink
} from 'lucide-react';

export const AdminNavbar = ({ searchQuery, setSearchQuery }) => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activeClient, setActiveClient, resetToDefaultData } = useData();
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
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-indigo-500/30 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand & Target Client Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-extrabold text-base tracking-tight text-white hidden sm:flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span>Admin Console</span>
            </div>

            {/* Target Client Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-100 text-sm font-semibold transition-all shadow-sm"
              >
                {getClientIcon(activeClientObj.icon)}
                <span className="truncate max-w-[130px] sm:max-w-[180px]">
                  {activeClientObj.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Admin Management Client
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
                              ? 'bg-indigo-950/60 text-indigo-300 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getClientIcon(client.icon)}
                            <div>
                              <div className="font-medium text-slate-100">
                                {client.name}
                              </div>
                              <div className="text-xs text-slate-400 font-mono">
                                {client.code}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Middle: Global Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search incidents, hardware IPs, Temenos versions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Admin Controls & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Client Portal Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold transition-colors"
              title="View Public Client Dashboard"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Client Portal</span>
            </button>

            {/* Reset Dataset Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all mock client datasets back to original defaults?')) {
                  resetToDefaultData();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors hidden sm:block"
              title="Reset Mock Dataset to Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/50"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-100 truncate max-w-[130px]">
                    {user?.name}
                  </div>
                  <RoleBadge role={role} />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {/* Profile Menu */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-20 p-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800 mb-2">
                      <div className="font-semibold text-sm text-slate-100">
                        {user?.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {user?.email}
                      </div>
                      <div className="mt-2">
                        <RoleBadge role={role} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          navigate('/dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <Globe className="w-4 h-4 text-emerald-400" />
                        View Public Client Portal
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                          navigate('/admin/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out Admin
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
