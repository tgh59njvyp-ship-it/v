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
  onZoomChange: (zoom: number) => void;
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
    <div className="flex items-center bg-white border-b border-zinc-200 text-zinc-900 px-2 md:px-3 py-2 space-x-2">
      {/* Navigation Controls (Desktop Only) */}
      <div className="hidden md:flex items-center space-x-1 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="戻る"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onForward}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="進む"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onReload}
          className={`p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors ${
            activeTab.isLoading ? 'animate-spin text-black' : ''
          }`}
          title="再読み込み"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onHome}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
          title="ホーム画面"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* URL Bar */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all shadow-sm min-w-0">
        {activeTab.url === '' ? (
          <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
        ) : isSecure ? (
          <span title="安全な接続 (HTTPS)" className="inline-flex items-center mr-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </span>
        ) : (
          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 shrink-0" title="安全ではない接続" />
        )}

        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="検索またはURLを入力"
          className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none min-w-0"
        />

        {/* Favorite/Bookmark Toggle (Inside URL bar for both Mobile and Desktop) */}
        {activeTab.url && activeTab.url !== 'about:blank' && (
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-1 rounded-md ml-1 transition-colors shrink-0 ${
              isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-zinc-400 hover:text-black hover:bg-zinc-200'
            }`}
            title={isBookmarked ? 'お気に入り解除' : 'お気に入りに追加'}
          >
            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        )}
      </form>

      {/* Reader Mode (Visible everywhere) */}
      <button
        type="button"
        onClick={onToggleReaderMode}
        disabled={!activeTab.url || activeTab.url === 'about:blank'}
        className={`p-1.5 rounded-lg transition-colors shrink-0 ${
          activeTab.isReaderMode 
            ? 'bg-black text-white shadow-md' 
            : 'text-zinc-500 hover:text-black hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed'
        }`}
        title="リーダー表示 (エラー回避/読みやすくする)"
      >
        <BookOpen className="w-4 h-4" />
      </button>

      {/* Action Buttons Toolbar (Desktop Only) */}
      <div className="hidden md:flex items-center space-x-1 shrink-0 border-l border-zinc-200 pl-2 ml-1">
        <button
          type="button"
          onClick={onOpenAiSummary}
          disabled={!activeTab.url || activeTab.url === 'about:blank'}
          className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="AIでページを要約"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onOpenExternal(activeTab.url)}
          disabled={!activeTab.url || activeTab.url === 'about:blank'}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="新しいタブで開く (別ウィンドウ)"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-zinc-200 mx-1"></div>

        <button
          type="button"
          onClick={onOpenBookmarks}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
          title="ブックマーク一覧"
        >
          <BookmarkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onOpenHistory}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
          title="閲覧履歴"
        >
          <HistoryIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

