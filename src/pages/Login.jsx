import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const Login = ({ admin = false }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(admin ? '' : 'user');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const loggedInUser = await login(username, password);
      if (admin && !['admin', 'super admin'].includes(loggedInUser.role.toLowerCase())) throw new Error('Administrator access required.');
      navigate(admin ? '/admin' : '/dashboard');
    } catch (loginError) {
      setError(loginError.message || 'Authentication failed.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-6 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><ShieldCheck className="h-7 w-7" /></div><h1 className="text-2xl font-bold">Core Banking Environment Dashboard</h1><p className="mt-1 text-sm text-slate-600">{admin ? 'Administrator sign in to the enterprise environment monitoring portal' : 'Client and operations sign in to the enterprise environment monitoring portal'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"><LockKeyhole className="h-4 w-4 text-indigo-600" /> {admin ? 'Admin access' : 'Read-only client access'}</div>
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Username<div className="relative mt-1.5"><UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input required value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div></label>
            <label className="block text-sm font-semibold text-slate-700">Password<div className="relative mt-1.5"><KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
            {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">Sign In <ArrowRight className="h-4 w-4" /></button>
          </form>
          <div className="mt-5 border-t border-slate-200 pt-5 text-center">
            <Link
              to={admin ? '/login' : '/admin/login'}
              className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {admin ? 'Move to User Login' : 'Move to Admin Login'}
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default Login;