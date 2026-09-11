import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  User,
  Calendar,
  Lightbulb
} from 'lucide-react';

export const RcaKbView = ({ searchQuery, readOnly = false }) => {
  const { currentClientData, addRcaItem, updateRcaItem, deleteRcaItem, activeClient } = useData();
  const { isAdmin } = useAuth();

  const canEdit = !readOnly && isAdmin;
  const rcaKb = currentClientData.rcaKb || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    incidentRef: '',
    category: 'Database / Connection Pooling',
    author: '',
    summary: '',
    lessonsLearned: '',
    docLink: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      incidentRef: '',
      category: 'Database / Connection Pooling',
      author: 'Alex Vance (Lead DBA)',
      summary: '',
      lessonsLearned: '',
      docLink: 'https://wiki.bank.internal/rca/'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      incidentRef: item.incidentRef || '',
      category: item.category || 'Database / Connection Pooling',
      author: item.author || '',
      summary: item.summary || '',
      lessonsLearned: item.lessonsLearned || '',
      docLink: item.docLink || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateRcaItem(editingItem.id, formData);
    } else {
      addRcaItem(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete RCA Knowledge Base entry ${id}?`)) {
      deleteRcaItem(id);
    }
  };

  const filteredRca = rcaKb.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.incidentRef.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Release & RCA Knowledge Base
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Root cause analyses, lessons learned, and architectural preventive actions for <strong className="text-indigo-500">{activeClient}</strong>.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add RCA Report
          </button>
        )}
      </div>

      {/* RCA Cards List */}
      <div className="space-y-4">
        {filteredRca.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Ref: {item.id}
                  </span>
                  {item.incidentRef && (
                    <span className="text-xs font-mono font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                      Linked: {item.incidentRef}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{item.date}</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                  Executive Incident Summary:
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {item.summary}
              </p>
            </div>

            {/* Lessons Learned */}
            {item.lessonsLearned && (
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  Corrective Actions & Preventive Lessons Learned:
                </div>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20 font-mono text-xs">
                  {item.lessonsLearned}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              {item.docLink ? (
                <a
                  href={item.docLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Full RCA Confluence Document
                </a>
              ) : (
                <span className="text-slate-400 font-mono">No external link attached</span>
              )}

              {canEdit && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {canEdit && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? `Edit RCA Entry ${editingItem.id}` : 'Add RCA Knowledge Base Entry'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RCA Title / Topic *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. EOD PostgreSQL HikariCP Connection Pool Exhaustion RCA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Linked Incident Ref
                </label>
                <input
                  type="text"
                  value={formData.incidentRef}
                  onChange={(e) => setFormData({ ...formData, incidentRef: e.target.value })}
                  placeholder="e.g. INC-2026-8801"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Root Cause Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Database / Connection Pooling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Author / Lead Investigator
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Alex Vance (Lead DBA)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Executive Incident Summary *
              </label>
              <textarea
                required
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Detailed description of what occurred, timeline, and initial trigger"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lessons Learned & Preventive Action Items
              </label>
              <textarea
                rows={3}
                value={formData.lessonsLearned}
                onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
                placeholder="1. Tune HikariCP connection limit&#10;2. Add alert rule at 80% pool capacity"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Wiki / Confluence Document URL
              </label>
              <input
                type="text"
                value={formData.docLink}
                onChange={(e) => setFormData({ ...formData, docLink: e.target.value })}
                placeholder="https://wiki.bank.internal/rca/RCA-2026-041.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                {editingItem ? 'Save RCA Report' : 'Add RCA Entry'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
