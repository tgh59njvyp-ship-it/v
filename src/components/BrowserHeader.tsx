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
  ZoomIn, 
  ZoomOut, 
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { Tab, Bookmark } from '../types';

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
  onZoomChange: (zoom: number) => void;
  onOpenExternal: (url: string) => void;
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
  onZoomChange,
  onOpenExternal,
}) => {
  const [inputUrl, setInputUrl] = useState(activeTab.url);

  useEffect(() => {
    setInputUrl(activeTab.url);
  }, [activeTab.url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target) return;

    // Check if it's a URL or search query
    if (target.startsWith('http://') || target.startsWith('https://')) {
      onNavigate(target);
    } else if (target.includes('.') && !target.includes(' ') && !target.startsWith('localhost')) {
      onNavigate(`https://${target}`);
    } else {
      // Search via Google
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(target)}`);
    }
  };

  const isSecure = activeTab.url.startsWith('https://');

  return (
    <div className="flex flex-col bg-slate-900 border-b border-slate-800 text-slate-200 px-3 py-2 space-y-2">
      <div className="flex items-center space-x-2">
        {/* Navigation Controls */}
        <div className="flex items-center space-x-1">
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
        <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner">
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
            placeholder="URLを入力するか、Googleで検索 (例: wikipedia.org)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          {/* Bookmark Toggle inside URL bar */}
          {activeTab.url && activeTab.url !== 'about:blank' && (
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`p-1 rounded-md ml-1 transition-colors ${
                isBookmarked ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'ブックマーク登録済み' : 'ブックマークに追加'}
            >
              <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          )}

          {/* Open External */}
          {activeTab.url && activeTab.url !== 'about:blank' && (
            <button
              type="button"
              onClick={() => onOpenExternal(activeTab.url)}
              className="p-1 rounded-md ml-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="新しいタブで開く (別ウィンドウ)"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
          {/* AI Summarizer */}
          <button
            type="button"
            onClick={onOpenAiSummary}
            disabled={!activeTab.url || activeTab.url === 'about:blank'}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="AIでページを要約"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">AI要約</span>
          </button>

          {/* Bookmarks Drawer */}
          <button
            type="button"
            onClick={onOpenBookmarks}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
            title="ブックマーク一覧"
          >
            <BookmarkIcon className="w-4 h-4" />
          </button>

          {/* History Drawer */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="閲覧履歴"
          >
            <HistoryIcon className="w-4 h-4" />
          </button>

          {/* Zoom controls */}
          <div className="hidden lg:flex items-center space-x-0.5 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/50">
            <button
              type="button"
              onClick={() => onZoomChange(Math.max(50, activeTab.zoomLevel - 15))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="縮小 (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-300">{activeTab.zoomLevel}%</span>
            <button
              type="button"
              onClick={() => onZoomChange(Math.min(200, activeTab.zoomLevel + 15))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="拡大 (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
