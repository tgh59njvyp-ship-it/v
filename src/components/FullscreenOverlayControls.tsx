import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  Search, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink, 
  Minimize2, 
  ChevronUp, 
  ChevronDown,
  Globe,
  Home
} from 'lucide-react';
import { Tab } from '../types';

interface FullscreenOverlayControlsProps {
  activeTab: Tab;
  onNavigate: (url: string, useProxy?: boolean) => void;
  onBack: () => void;
  onReload: () => void;
  onHome: () => void;
  onToggleFullscreen: () => void;
  onToggleProxy: () => void;
  onOpenExternal: (url: string) => void;
}

export const FullscreenOverlayControls: React.FC<FullscreenOverlayControlsProps> = ({
  activeTab,
  onNavigate,
  onBack,
  onReload,
  onHome,
  onToggleFullscreen,
  onToggleProxy,
  onOpenExternal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(activeTab.url);

  useEffect(() => {
    setUrlInput(activeTab.url);
  }, [activeTab.url]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = urlInput.trim();
    if (!query) return;

    if (query.startsWith('http://') || query.startsWith('https://')) {
      onNavigate(query);
    } else if (query.includes('.') && !query.includes(' ')) {
      onNavigate(`https://${query}`);
    } else {
      // Search with proxy by default for Google
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(query)}`, true);
    }
    setIsSearchOpen(false);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end select-none pointer-events-none">
      <div className="pointer-events-auto">
        {/* Search / URL Input Modal overlay if opened */}
        {isSearchOpen && (
          <div className="mb-2 p-3 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl shadow-2xl w-[88vw] max-w-md animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-700">大画面のままURL/検索</span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-zinc-400 hover:text-black rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Google検索またはURLを入力..."
                className="flex-1 px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow"
              >
                移動
              </button>
            </form>
          </div>
        )}

        {/* Expanded Controls Toolbar */}
        {isExpanded ? (
          <div className="flex items-center space-x-1.5 p-1.5 bg-zinc-900/90 text-white backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-2 duration-150">
            {/* Back */}
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-white/20 text-zinc-200 hover:text-white transition-colors"
              title="戻る"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Home */}
            <button
              type="button"
              onClick={onHome}
              className="p-2 rounded-xl hover:bg-white/20 text-zinc-200 hover:text-white transition-colors"
              title="ホームへ"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* Reload */}
            <button
              type="button"
              onClick={onReload}
              className="p-2 rounded-xl hover:bg-white/20 text-zinc-200 hover:text-white transition-colors"
              title="再読み込み"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Search/URL input */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl hover:bg-white/20 text-zinc-200 hover:text-white transition-colors"
              title="検索 / URL入力"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Proxy Toggle */}
            <button
              type="button"
              onClick={onToggleProxy}
              className={`p-2 rounded-xl transition-colors ${
                activeTab.useProxy ? 'bg-emerald-600 text-white' : 'hover:bg-white/20 text-zinc-200'
              }`}
              title={activeTab.useProxy ? 'プロキシON (解除可能)' : 'プロキシOFF (表示不可時はONに)'}
            >
              {activeTab.useProxy ? <ShieldCheck className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            </button>

            {/* Open External */}
            <button
              type="button"
              onClick={() => onOpenExternal(activeTab.url)}
              className="p-2 rounded-xl hover:bg-white/20 text-zinc-200 hover:text-white transition-colors"
              title="別ブラウザで開く"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-white/20 mx-0.5"></div>

            {/* Exit Fullscreen */}
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="px-2.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 shadow transition-colors"
              title="大画面を終了"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>終了</span>
            </button>

            {/* Collapse button */}
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setIsSearchOpen(false);
              }}
              className="p-1.5 rounded-xl hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
              title="メニューを閉じる"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Floating Mini Bubble (Unobtrusive) */
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-900/80 hover:bg-zinc-900 text-white backdrop-blur-md border border-white/20 rounded-full shadow-2xl hover:scale-105 transition-all text-xs font-medium opacity-80 hover:opacity-100"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>操作メニュー</span>
            <ChevronUp className="w-3 h-3 text-zinc-400" />
          </button>
        )}
      </div>
    </div>
  );
};
