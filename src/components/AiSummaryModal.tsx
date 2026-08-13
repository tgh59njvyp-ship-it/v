import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Bot, Globe, CheckCircle } from 'lucide-react';
import { Tab } from '../types';

interface AiSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
}

export const AiSummaryModal: React.FC<AiSummaryModalProps> = ({
  isOpen,
  onClose,
  activeTab,
}) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab.url && activeTab.url !== 'about:blank') {
      fetchSummary();
    } else {
      setSummary(null);
      setError(null);
    }
  }, [isOpen, activeTab.url]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: activeTab.url, title: activeTab.title }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold">
            <div className="p-1.5 rounded-lg bg-zinc-200 text-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Gemini AI ページ要約</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Site info */}
        <div className="px-6 py-3 bg-white border-b border-zinc-100 flex items-center space-x-2 text-xs text-zinc-500">
          <Globe className="w-3.5 h-3.5 text-black shrink-0" />
          <span className="truncate font-mono">{activeTab.url}</span>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-zinc-800 text-sm leading-relaxed space-y-4 bg-white">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
              <p>AIがページの内容を分析・要約しています...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
              <p className="font-semibold mb-1 text-red-600">要約エラー</p>
              <p>{error}</p>
              <p className="mt-2 text-red-500">※APIキー（GEMINI_API_KEY）が正しく設定されているかご確認ください。</p>
            </div>
          )}

          {!loading && !error && summary && (
            <div className="space-y-4 whitespace-pre-wrap font-sans text-zinc-800">
              {summary}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

