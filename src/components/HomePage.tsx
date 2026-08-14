import React, { useState, useRef } from 'react';
import { 
  Globe, 
  Search, 
  BookOpen, 
  Code, 
  Newspaper, 
  Compass, 
  Monitor,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Sparkles,
  ExternalLink,
  Shield,
  Video,
  Gamepad2,
  ShoppingBag,
  Music
} from 'lucide-react';
import { QuickAccessItem } from '../types';
import { QuickAccessModal } from './QuickAccessModal';

interface HomePageProps {
  onNavigate: (url: string, useProxy?: boolean) => void;
  onToggleFullscreen: () => void;
  quickAccessItems: QuickAccessItem[];
  onSaveQuickAccessItem: (item: QuickAccessItem) => void;
  onDeleteQuickAccessItem: (id: string) => void;
  onResetQuickAccessDefaults: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  globe: Globe,
  search: Search,
  book: BookOpen,
  code: Code,
  news: Newspaper,
  compass: Compass,
  video: Video,
  game: Gamepad2,
  sparkles: Sparkles,
  shopping: ShoppingBag,
  music: Music,
};

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onToggleFullscreen,
  quickAccessItems,
  onSaveQuickAccessItem,
  onDeleteQuickAccessItem,
  onResetQuickAccessDefaults
}) => {
  const [query, setQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState<'duckduckgo' | 'google' | 'bing' | 'wikipedia'>('duckduckgo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      onNavigate(trimmed);
    } else if (trimmed.includes('.') && !trimmed.includes(' ')) {
      onNavigate(`https://${trimmed}`);
    } else {
      // Search engines
      if (searchEngine === 'google') {
        // Use proxy for google search or direct
        onNavigate(`https://www.google.com/search?q=${encodeURIComponent(trimmed)}`, true);
      } else if (searchEngine === 'duckduckgo') {
        onNavigate(`https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}&k1=-1&kam=osm`);
      } else if (searchEngine === 'bing') {
        onNavigate(`https://www.bing.com/search?q=${encodeURIComponent(trimmed)}`);
      } else if (searchEngine === 'wikipedia') {
        onNavigate(`https://ja.wikipedia.org/w/index.php?search=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-full bg-zinc-50 text-zinc-900 px-3 md:px-6 py-6 md:py-10 pb-24 md:pb-12 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* Browser Branding & Intro */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-zinc-200 text-black shadow-sm mb-1">
            <Globe className="w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            大画面ブラウザ
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm max-w-md mx-auto">
            スライド対応クイックアクセス＆Google対応プロキシ搭載
          </p>
        </div>

        {/* Search / URL Box */}
        <div className="max-w-2xl mx-auto w-full space-y-2">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="flex items-center bg-white border-2 border-zinc-200 rounded-2xl px-3 md:px-4 py-2.5 shadow-sm focus-within:border-black focus-within:ring-4 focus-within:ring-black/5 transition-all">
              <Search className="w-5 h-5 text-zinc-400 mr-2 md:mr-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="URL または キーワード検索..."
                className="w-full bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none text-sm md:text-base"
                autoFocus
              />
              <button
                type="submit"
                className="ml-2 px-4 md:px-5 py-2 bg-black hover:bg-zinc-800 text-white font-medium rounded-xl text-xs md:text-sm transition-colors shadow-md shrink-0"
              >
                開く
              </button>
            </div>
          </form>

          {/* Search Engine Selector Pills */}
          <div className="flex items-center justify-center space-x-1.5 overflow-x-auto py-1">
            <span className="text-[11px] text-zinc-400 mr-1 hidden sm:inline">検索エンジン:</span>
            <button
              type="button"
              onClick={() => setSearchEngine('duckduckgo')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                searchEngine === 'duckduckgo'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              DuckDuckGo (埋め込み推奨)
            </button>
            <button
              type="button"
              onClick={() => setSearchEngine('google')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                searchEngine === 'google'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Google (プロキシ経由)
            </button>
            <button
              type="button"
              onClick={() => setSearchEngine('bing')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                searchEngine === 'bing'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Bing
            </button>
            <button
              type="button"
              onClick={() => setSearchEngine('wikipedia')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                searchEngine === 'wikipedia'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Wikipedia
            </button>
          </div>
        </div>

        {/* Quick Access Carousel Header */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                クイックアクセス (左右にスライド可能)
              </h2>
              <span className="text-[10px] bg-zinc-200/80 text-zinc-700 px-1.5 py-0.5 rounded-full font-medium">
                {quickAccessItems.length}件
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Left / Right Scroll Buttons */}
              <button
                type="button"
                onClick={scrollLeft}
                className="p-1.5 rounded-lg bg-white border border-zinc-200 hover:border-black text-zinc-600 hover:text-black transition-colors shadow-sm"
                title="左にスクロール"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="p-1.5 rounded-lg bg-white border border-zinc-200 hover:border-black text-zinc-600 hover:text-black transition-colors shadow-sm"
                title="右にスクロール"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Edit Quick Access Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-black text-zinc-700 hover:text-black transition-colors text-xs font-medium shadow-sm ml-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>編集・追加</span>
              </button>
            </div>
          </div>

          {/* Horizontally Slidable / Scrollable Row */}
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-3 overflow-x-auto py-2 px-1 scroll-smooth snap-x scrollbar-none select-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {quickAccessItems.map((site) => {
              const IconComp = (site.iconType && ICON_MAP[site.iconType]) || Globe;
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => onNavigate(site.url, site.useProxy)}
                  className="flex items-center space-x-3 p-3.5 rounded-2xl border bg-white border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all text-left group shadow-sm shrink-0 w-48 sm:w-56 snap-start"
                >
                  <div className="p-2.5 rounded-xl bg-zinc-100 group-hover:bg-zinc-200 text-black shrink-0 transition-colors">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-zinc-800 group-hover:text-black truncate">
                      {site.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {site.url.replace(/^https?:\/\//, '')}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Quick Add Card on the end of the carousel */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 p-3.5 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-black bg-zinc-50/50 hover:bg-white transition-all text-zinc-500 hover:text-black shrink-0 w-36 sm:w-44 snap-start"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">ショートカット追加</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Highlight & Helper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Fullscreen Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 rounded-xl bg-zinc-100 text-black shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">大画面 (フルスクリーン)</h3>
                <p className="text-xs text-zinc-500">ゲームや動画を画面いっぱいに表示</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-medium transition-colors shrink-0 shadow"
            >
              大画面にする
            </button>
          </div>

          {/* Google & Proxy Helper Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 rounded-xl bg-zinc-100 text-emerald-700 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Google等の閲覧について</h3>
                <p className="text-xs text-zinc-500">ブロックされるサイトはプロキシで表示可能</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('https://www.google.com', true)}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-medium transition-colors shrink-0"
            >
              Googleを開く
            </button>
          </div>
        </div>

      </div>

      {/* Quick Access Edit Modal */}
      <QuickAccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={quickAccessItems}
        onSaveItem={onSaveQuickAccessItem}
        onDeleteItem={onDeleteQuickAccessItem}
        onResetDefaults={onResetQuickAccessDefaults}
      />
    </div>
  );
};
