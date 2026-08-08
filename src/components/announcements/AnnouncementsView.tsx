'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  X,
  AlertTriangle,
  Building2,
  Clock,
  Globe,
  Send,
  ChevronDown,
} from 'lucide-react';
import { Announcement, Directorate, User } from '../../types';
import { WorkspaceStorageService } from '../../lib/storage';

interface AnnouncementsViewProps {
  directorates: Directorate[];
  users: User[];
  currentUser: User;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  directorates,
  users,
  currentUser,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [filterDirectorate, setFilterDirectorate] = useState<string>('all');

  // Create form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [targetDirs, setTargetDirs] = useState<string[]>([]);

  useEffect(() => {
    setAnnouncements(WorkspaceStorageService.getAnnouncements());
  }, []);

  const toggleTargetDir = (id: string) => {
    setTargetDirs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return;
    const newAnc = WorkspaceStorageService.addAnnouncement({
      workspaceId: WorkspaceStorageService.getCurrentWorkspaceId(),
      title: title.trim(),
      content: content.trim(),
      authorId: currentUser.id,
      targetDirectorateIds: targetDirs,
      priority,
    });
    setAnnouncements((prev) => [newAnc, ...prev]);
    setTitle('');
    setContent('');
    setPriority('normal');
    setTargetDirs([]);
    setShowCreate(false);
  };

  const filtered = announcements.filter((a) => {
    if (filterDirectorate === 'all') return true;
    if (filterDirectorate === 'global') return a.targetDirectorateIds.length === 0;
    return a.targetDirectorateIds.includes(filterDirectorate);
  });

  const getAuthor = (id: string) => users.find((u) => u.id === id);
  const getRelativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            Announcements
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast updates to the whole organisation or specific directorates.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'all', label: 'All' },
          { id: 'global', label: 'Organisation-wide' },
          ...directorates.map((d) => ({ id: d.id, label: d.name })),
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterDirectorate(f.id)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition ${
              filterDirectorate === f.id
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700 bg-slate-900/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Create Announcement</h3>
            <button onClick={() => setShowCreate(false)}>
              <X className="w-4 h-4 text-slate-500 hover:text-slate-300" />
            </button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title..."
            className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement..."
            rows={4}
            className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition resize-none"
          />

          <div className="flex flex-wrap gap-3">
            {/* Priority */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Priority:</span>
              {(['normal', 'urgent'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold border capitalize transition ${
                    priority === p
                      ? p === 'urgent'
                        ? 'bg-red-600/20 text-red-400 border-red-500/40'
                        : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                      : 'text-slate-500 border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Target directorates */}
          <div>
            <p className="text-xs text-slate-400 mb-2">
              Target directorates (leave empty for organisation-wide):
            </p>
            <div className="flex flex-wrap gap-2">
              {directorates.map((d) => (
                <button
                  key={d.id}
                  onClick={() => toggleTargetDir(d.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                    targetDirs.includes(d.id)
                      ? 'bg-slate-800 text-slate-100 border-slate-600'
                      : 'text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!title.trim() || !content.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Send className="w-3.5 h-3.5" />
              Post
            </button>
          </div>
        </div>
      )}

      {/* Announcements list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Megaphone className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No announcements yet.</p>
          </div>
        ) : (
          filtered.map((anc) => {
            const author = getAuthor(anc.authorId);
            const isGlobal = anc.targetDirectorateIds.length === 0;
            const targetDirNames = anc.targetDirectorateIds
              .map((id) => directorates.find((d) => d.id === id)?.name)
              .filter(Boolean);

            return (
              <div
                key={anc.id}
                className={`relative bg-slate-900 border rounded-2xl p-5 transition hover:border-slate-700 ${
                  anc.priority === 'urgent'
                    ? 'border-red-500/30 bg-red-950/10'
                    : 'border-slate-800'
                }`}
              >
                {/* Priority badge */}
                {anc.priority === 'urgent' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-red-600/20 border border-red-500/30 rounded-lg">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                      Urgent
                    </span>
                  </div>
                )}

                <h3 className="text-sm font-bold text-slate-100 mb-1.5 pr-24">
                  {anc.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {anc.content}
                </p>

                {/* Footer meta */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={
                        author?.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${author?.displayName || 'U'}&background=1e293b&color=94a3b8&size=32`
                      }
                      alt={author?.displayName || 'Unknown'}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="text-slate-400 font-medium">
                      {author?.displayName || 'Unknown'}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getRelativeTime(anc.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    {isGlobal ? (
                      <>
                        <Globe className="w-3 h-3 text-indigo-400" />
                        <span className="text-indigo-400">Organisation-wide</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-3 h-3" />
                        {targetDirNames.join(', ')}
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
