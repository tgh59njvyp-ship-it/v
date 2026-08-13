import React from 'react';
import { X, History as HistoryIcon, Trash2, Globe, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (url: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2 text-white font-semibold">
            <HistoryIcon className="w-5 h-5 text-indigo-400" />
            <span>閲覧履歴 ({history.length})</span>
          </div>
          <div className="flex items-center space-x-3">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>履歴をクリア</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <HistoryIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">閲覧履歴はありません。</p>
            </div>
          ) : (
            history.map((item) => {
              const timeStr = new Date(item.visitedAt).toLocaleString('ja-JP', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistory(item.url);
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
                        {item.title || item.url}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span className="truncate">{item.url}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{timeStr}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
