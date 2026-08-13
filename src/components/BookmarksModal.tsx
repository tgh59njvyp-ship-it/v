import React from 'react';
import { X, Bookmark, Trash2, Globe } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold">
            <Bookmark className="w-5 h-5 text-black" />
            <span>ブックマーク一覧 ({bookmarks.length})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2 bg-white">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-20 text-black" />
              <p className="text-sm">ブックマークされたページはありません。</p>
              <p className="text-xs text-zinc-400 mt-1">URLバーの星マークをクリックして追加できます。</p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                onClick={() => {
                  onSelectBookmark(bm.url);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-black hover:bg-white cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                  <div className="p-2 rounded-lg bg-zinc-200 text-black shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-zinc-900 truncate">
                      {bm.title || bm.url}
                    </h4>
                    <p className="text-xs text-zinc-500 truncate">{bm.url}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBookmark(bm.id);
                    }}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

