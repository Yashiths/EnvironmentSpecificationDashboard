import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ShieldCheck, UserCheck, KeyRound, Mail, Sun, Moon, ArrowRight, Server, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [loginType, setLoginType] = useState('ADMIN'); // 'ADMIN' or 'USER'
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [customName, setCustomName] = useState('');

  const handleTabSwitch = (type) => {
    setLoginType(type);
    if (type === 'ADMIN') {
      setUsername('admin');
      setCustomName('Alex Vance (Lead SysAdmin)');
    } else {
      setUsername('user');
      setCustomName('Sam Taylor (Audit / Operations)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  const handleQuickLogin = (role) => {
    login(role === 'ADMIN' ? 'admin' : 'user', password);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Dynamic Animated Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-lg backdrop-blur-md"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/20 mb-4 border border-indigo-400/30">
            <Server className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Core Banking Ops Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Production Incident & Environment Specification Dashboard
          </p>
        </div>

        {/* Card Panel */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/80 rounded-xl mb-6 border border-slate-700/60">
            <button
              type="button"
              onClick={() => handleTabSwitch('USER')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                loginType === 'USER'
                  ? 'bg-slate-800 text-emerald-400 shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Client / Viewer
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('ADMIN')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                loginType === 'ADMIN'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Role Context
              </label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-xs font-medium flex items-center justify-between">
                <span className="text-slate-300">Target Role:</span>
                {loginType === 'ADMIN' ? (
                  <span className="text-indigo-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ADMIN (Full CRUD)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> VIEWER (Read-Only)
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                loginType === 'ADMIN'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
              }`}
            >
              Sign In as {loginType === 'ADMIN' ? 'Administrator' : 'Viewer'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <div className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              ⚡ Quick Demo One-Click Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="px-3 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/80 text-indigo-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Demo Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('USER')}
                className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 text-emerald-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Demo Viewer
              </button>
            </div>
          </div>
        </div>

        {/* Footer Security Pill */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5" />
          Enterprise Banking Infrastructure Guard v2.4 (TLS 1.3)
        </div>
      </motion.div>
    </div>
  );
};
