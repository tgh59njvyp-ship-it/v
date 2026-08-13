import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Star, 
  Bookmark as BookmarkIcon, 
  History as HistoryIcon, 
  Sparkles, 
  ShieldCheck,
  Search,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Tab } from '../types';

interface BrowserHeaderProps {
  activeTab: Tab;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
  onOpenBookmarks: () => void;
  onOpenHistory: () => void;
  onOpenAiSummary: () => void;
  onZoomChange: (zoom: number) => void; // Keeping prop to avoid breaking App.tsx
  onOpenExternal: (url: string) => void;
  onToggleReaderMode: () => void;
}

export const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  activeTab,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  onToggleBookmark,
  isBookmarked,
  onOpenBookmarks,
  onOpenHistory,
  onOpenAiSummary,
  onOpenExternal,
  onToggleReaderMode
}) => {
  const [inputUrl, setInputUrl] = useState(activeTab.url);

  useEffect(() => {
    setInputUrl(activeTab.url);
  }, [activeTab.url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target) return;

    if (target.startsWith('http://') || target.startsWith('https://')) {
      onNavigate(target);
    } else if (target.includes('.') && !target.includes(' ') && !target.startsWith('localhost')) {
      onNavigate(`https://${target}`);
    } else {
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(target)}`);
    }
  };

  const isSecure = activeTab.url.startsWith('https://');

  return (
    <div className="flex items-center bg-slate-900 border-b border-slate-800 text-slate-200 px-3 py-2 space-x-2">
      {/* Navigation Controls */}
      <div className="flex items-center space-x-1 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="戻る"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onForward}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="進む"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onReload}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
            activeTab.isLoading ? 'animate-spin text-indigo-400' : ''
          }`}
          title="再読み込み"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onHome}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="ホーム画面"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* URL Bar */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner min-w-0">
        {activeTab.url === '' ? (
          <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
        ) : isSecure ? (
          <span title="安全な接続 (HTTPS)" className="inline-flex items-center mr-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </span>
        ) : (
          <div className="w-2 h-2 rounded-full bg-amber-400 mr-2 shrink-0" title="安全ではない接続" />
        )}

        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="URLを入力するか、Googleで検索"
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none min-w-0"
        />

        {activeTab.url && activeTab.url !== 'about:blank' && (
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-1 rounded-md ml-1 transition-colors shrink-0 ${
              isBookmarked ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'ブックマーク登録済み' : 'ブックマークに追加'}
          >
            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        )}
      </form>

      {/* Action Buttons Toolbar */}
      <div className="flex items-center space-x-1 shrink-0 border-l border-slate-800 pl-2">
        <button
          type="button"
          onClick={onToggleReaderMode}
          disabled={!activeTab.url || activeTab.url === 'about:blank'}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTab.isReaderMode 
              ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
          title="リーダー表示 (エラー回避/読みやすくする)"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenAiSummary}
          disabled={!activeTab.url || activeTab.url === 'about:blank'}
          className="p-1.5 rounded-lg text-indigo-300 hover:bg-indigo-600/20 hover:text-indigo-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="AIでページを要約"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onOpenExternal(activeTab.url)}
          disabled={!activeTab.url || activeTab.url === 'about:blank'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="新しいタブで開く (別ウィンドウ)"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-800 mx-1"></div>

        <button
          type="button"
          onClick={onOpenBookmarks}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="ブックマーク一覧"
        >
          <BookmarkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onOpenHistory}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="閲覧履歴"
        >
          <HistoryIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
