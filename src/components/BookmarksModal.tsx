import React from 'react';
import { X, Bookmark, Trash2, ExternalLink, Globe } from 'lucide-react';
import { Bookmark as BookmarkType } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onSelectBookmark: (url: string) => void;
  onDeleteBookmark: (id: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onDeleteBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2 text-white font-semibold">
            <Bookmark className="w-5 h-5 text-indigo-400" />
            <span>ブックマーク一覧 ({bookmarks.length})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">ブックマークされたページはありません。</p>
              <p className="text-xs text-slate-600 mt-1">URLバーの星マークをクリックして追加できます。</p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                onClick={() => {
                  onSelectBookmark(bm.url);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-800/60 cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                  <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                      {bm.title || bm.url}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{bm.url}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBookmark(bm.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
