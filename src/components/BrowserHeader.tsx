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
  BookOpen,
  Menu,
  Monitor
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
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
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
  onToggleReaderMode,
  onToggleFullscreen,
  isFullscreen
}) => {
  const [inputUrl, setInputUrl] = useState(activeTab.url);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex items-center bg-white border-b border-zinc-200 text-zinc-900 px-2 md:px-3 py-2 space-x-2 relative z-40">
      
      {/* Back button (Always visible on mobile & desktop) */}
      <button
        type="button"
        onClick={onBack}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors shrink-0"
        title="戻る"
      >
        <ArrowLeft className="w-5 h-5 md:w-4 md:h-4" />
      </button>

      {/* Desktop Navigation Controls (Forward, Reload, Home) */}
      <div className="hidden md:flex items-center space-x-1 shrink-0">
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
          <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0 hidden sm:block" />
        ) : isSecure ? (
          <span title="安全な接続 (HTTPS)" className="inline-flex items-center mr-2 shrink-0 hidden sm:flex">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </span>
        ) : (
          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 shrink-0 hidden sm:block" title="安全ではない接続" />
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

      {/* Reader Mode (Desktop Only) */}
      <button
        type="button"
        onClick={onToggleReaderMode}
        disabled={!activeTab.url || activeTab.url === 'about:blank'}
        className={`hidden md:block p-1.5 rounded-lg transition-colors shrink-0 ${
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

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-1.5 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors shrink-0"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/10 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-[100%] right-2 mt-2 w-64 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 py-2 md:hidden flex flex-col text-sm overflow-hidden">
            
            <div className="flex items-center justify-between px-4 py-2">
              <button onClick={() => { onForward(); setIsMobileMenuOpen(false); }} className="flex-1 flex flex-col items-center justify-center p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors">
                <ArrowRight className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">進む</span>
              </button>
              <button onClick={() => { onReload(); setIsMobileMenuOpen(false); }} className="flex-1 flex flex-col items-center justify-center p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors">
                <RotateCw className={`w-5 h-5 mb-1 ${activeTab.isLoading ? 'animate-spin' : ''}`} />
                <span className="text-[10px] font-medium">更新</span>
              </button>
              <button onClick={() => { onHome(); setIsMobileMenuOpen(false); }} className="flex-1 flex flex-col items-center justify-center p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-black transition-colors">
                <Home className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">ホーム</span>
              </button>
            </div>

            <div className="h-px bg-zinc-100 my-1 mx-4"></div>

            <button onClick={() => { onToggleFullscreen(); setIsMobileMenuOpen(false); }} className="flex items-center space-x-3 px-5 py-3 text-left text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors w-full">
              <Monitor className="w-4 h-4" />
              <span className="font-medium">大画面で見る</span>
            </button>
            <button onClick={() => { onOpenBookmarks(); setIsMobileMenuOpen(false); }} className="flex items-center space-x-3 px-5 py-3 text-left text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors w-full">
              <BookmarkIcon className="w-4 h-4" />
              <span className="font-medium">ブックマーク一覧</span>
            </button>
            <button onClick={() => { onOpenHistory(); setIsMobileMenuOpen(false); }} className="flex items-center space-x-3 px-5 py-3 text-left text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors w-full">
              <HistoryIcon className="w-4 h-4" />
              <span className="font-medium">閲覧履歴</span>
            </button>

            <div className="h-px bg-zinc-100 my-1 mx-4"></div>

            <button 
              onClick={() => { onToggleReaderMode(); setIsMobileMenuOpen(false); }} 
              disabled={!activeTab.url || activeTab.url === 'about:blank'}
              className="flex items-center space-x-3 px-5 py-3 text-left text-zinc-700 hover:bg-zinc-100 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors w-full"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">{activeTab.isReaderMode ? 'リーダー表示を解除' : 'リーダー表示で読む'}</span>
            </button>
            <button 
              onClick={() => { onOpenAiSummary(); setIsMobileMenuOpen(false); }}
              disabled={!activeTab.url || activeTab.url === 'about:blank'}
              className="flex items-center space-x-3 px-5 py-3 text-left text-zinc-700 hover:bg-zinc-100 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors w-full"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">AIでページ要約</span>
            </button>
            <button 
              onClick={() => { onOpenExternal(activeTab.url); setIsMobileMenuOpen(false); }}
              disabled={!activeTab.url || activeTab.url === 'about:blank'}
              className="flex items-center space-x-3 px-5 py-3 text-left text-zinc-700 hover:bg-zinc-100 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors w-full"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="font-medium">別ブラウザで開く</span>
            </button>

          </div>
        </>
      )}
    </div>
  );
};


