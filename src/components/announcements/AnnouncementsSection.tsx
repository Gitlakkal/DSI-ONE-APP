import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Megaphone,
  Pin,
  Plus,
  Search,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Announcement } from '../../types';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  onCreateAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteAnnouncement?: (id: string) => Promise<void>;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements,
  onCreateAnnouncement,
  onDeleteAnnouncement,
}) => {
  const { effectiveRole, currentEmployee } = useAuth();
  const isAdmin = ['hr_admin', 'super_admin'].includes(effectiveRole);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('General');
  const [priority, setPriority] = useState<Announcement['priority']>('normal');
  const [targetDepartment, setTargetDepartment] = useState('All Departments');
  const [pinned, setPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateAnnouncement({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        authorName: currentEmployee?.name || 'DSI Administration',
        authorUid: currentEmployee?.userId || 'admin-usr',
        targetDepartment,
        pinned,
      });

      setTitle('');
      setContent('');
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to publish announcement:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAnnouncements = announcements.filter((ann) => {
    if (categoryFilter !== 'all' && ann.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!ann.title.toLowerCase().includes(q) && !ann.content.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Company Announcements</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Official circulars, HSE safety briefings, HR policies, and holiday schedules for DSI personnel.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            Publish Announcement
          </button>
        )}
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['all', 'Safety', 'HR', 'Operations', 'Holiday', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#0B2545] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Notice' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            <Megaphone className="w-12 h-12 mx-auto opacity-30 mb-2" />
            <p className="text-sm font-semibold">No announcements found in this category.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setSelectedAnnouncement(ann)}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all cursor-pointer relative ${
                ann.pinned ? 'border-orange-200 bg-gradient-to-r from-white to-orange-50/20' : 'border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {ann.pinned && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FF6B00] text-white">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : ann.category === 'Safety'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-[#0B2545]'
                    }`}
                  >
                    {ann.category}
                  </span>
                  {ann.priority === 'urgent' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3 h-3" /> Urgent Notice
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(ann.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  {isAdmin && onDeleteAnnouncement && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this announcement?')) {
                          onDeleteAnnouncement(ann.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded ml-2"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {ann.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {ann.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-600">{ann.authorName}</span>
                  {ann.targetDepartment && (
                    <span className="text-slate-400">• Target: {ann.targetDepartment}</span>
                  )}
                </div>
                <span className="text-[#0B2545] font-bold hover:underline">
                  Read Full Notice →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Full Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#FF6B00]" />
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  {selectedAnnouncement.category} Circular
                </span>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-3">
              {selectedAnnouncement.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
              <span>Author: <strong className="text-slate-800">{selectedAnnouncement.authorName}</strong></span>
              <span>•</span>
              <span>Published: {new Date(selectedAnnouncement.createdAt).toLocaleDateString('en-GB')}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selectedAnnouncement.content}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2545] text-white hover:bg-[#123966]"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">Broadcast New Announcement</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Circular Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramadan Working Hours & Mid-Day Summer Shift Schedule"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  >
                    <option value="General">General Corporate</option>
                    <option value="Safety">HSE & Site Safety</option>
                    <option value="HR">HR & Government Affairs</option>
                    <option value="Operations">Operations & Fleet</option>
                    <option value="Holiday">Holiday & Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  >
                    <option value="normal">Standard Priority</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent / Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                >
                  <option value="All Departments">All Departments & Sites</option>
                  <option value="Heavy Fleet & Logistics">Heavy Fleet & Logistics Only</option>
                  <option value="Civil & Construction">Civil & Construction Only</option>
                  <option value="HSE Safety & Quality">HSE Site Inspectors</option>
                  <option value="Head Office Staff">Dammam Head Office Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Announcement Body *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type official details, directives, safety instructions, or company circular text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinnedCheck"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                />
                <label htmlFor="pinnedCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Pin announcement to top of dashboard
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
