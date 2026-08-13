import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  BookOpen, 
  Code, 
  Newspaper, 
  Compass, 
  Monitor
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (url: string) => void;
  onToggleFullscreen: () => void;
}

const QUICK_SITES = [
  { name: 'Wikipedia', url: 'https://ja.wikipedia.org/wiki/メインページ', icon: BookOpen },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: Newspaper },
  { name: 'GitHub', url: 'https://github.com', icon: Code },
  { name: 'Google', url: 'https://www.google.com', icon: Search },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/ja/', icon: Globe },
  { name: 'Example.com', url: 'https://example.com', icon: Compass },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onToggleFullscreen }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (query.startsWith('http://') || query.startsWith('https://')) {
      onNavigate(query.trim());
    } else if (query.includes('.') && !query.includes(' ')) {
      onNavigate(`https://${query.trim()}`);
    } else {
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-zinc-50 text-zinc-900 px-4 py-8 md:py-12 pb-24 md:pb-12 overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8">
        {/* Browser Branding & Intro */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-zinc-200 text-black shadow-sm mb-2">
            <Globe className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
            大画面ブラウザ
          </h1>
          <p className="text-zinc-500 text-sm md:text-base max-w-lg mx-auto">
            URLを入力してウェブサイトを素早く表示。フルスクリーン機能で快適に閲覧できます。
          </p>
        </div>

        {/* Search / URL Box */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto w-full">
          <div className="flex items-center bg-white border-2 border-zinc-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-black focus-within:ring-4 focus-within:ring-black/5 transition-all">
            <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="URLまたは検索キーワード (例: wikipedia.org)"
              className="w-full bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none text-base"
              autoFocus
            />
            <button
              type="submit"
              className="ml-2 px-5 py-2 bg-black hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-md shrink-0"
            >
              開く
            </button>
          </div>
        </form>

        {/* Fullscreen Highlight Banner */}
        <div className="max-w-xl mx-auto bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-2 rounded-xl bg-zinc-100 text-black">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">ワンクリック大画面表示</h3>
              <p className="text-xs text-zinc-500">メニューを隠して、サイトを画面いっぱいに拡大表示</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="px-3.5 py-1.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-medium transition-colors shrink-0 shadow"
          >
            大画面にする
          </button>
        </div>

        {/* Quick Access Tiles */}
        <div className="pt-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            クイックアクセス
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_SITES.map((site) => {
              const IconComp = site.icon;
              return (
                <button
                  key={site.name}
                  type="button"
                  onClick={() => onNavigate(site.url)}
                  className="flex items-center space-x-3 p-3.5 rounded-xl border bg-white border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all text-left group shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-zinc-100 group-hover:bg-zinc-200 transition-colors">
                    <IconComp className="w-4 h-4 text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-zinc-800 group-hover:text-black truncate">
                      {site.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {site.url.replace(/^https?:\/\//, '')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

