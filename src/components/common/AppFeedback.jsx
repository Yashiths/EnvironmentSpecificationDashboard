import React, { useEffect, useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AppFeedback = () => {
  const { isLoading } = useData();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (event) => {
      setToast(event.detail);
      window.setTimeout(() => setToast(null), 3200);
    };
    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl dark:bg-slate-900 dark:text-slate-200">
            <LoaderCircle className="h-4 w-4 animate-spin text-indigo-500" /> Loading live specifications...
          </div>
        </div>
      )}
      {toast && (
        <div className={`fixed right-5 top-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${toast.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification"><X className="h-4 w-4" /></button>
        </div>
      )}
    </>
  );
};
