import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  BookOpen, 
  Code, 
  Newspaper, 
  Sparkles, 
  Compass, 
  Monitor, 
  ExternalLink 
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (url: string) => void;
  onToggleFullscreen: () => void;
}

const QUICK_SITES = [
  { name: 'Wikipedia', url: 'https://ja.wikipedia.org/wiki/メインページ', icon: BookOpen, color: 'bg-slate-800 text-slate-200 border-slate-700' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: Newspaper, color: 'bg-orange-950/40 text-orange-200 border-orange-800/50' },
  { name: 'GitHub', url: 'https://github.com', icon: Code, color: 'bg-zinc-800 text-zinc-200 border-zinc-700' },
  { name: 'Google', url: 'https://www.google.com', icon: Search, color: 'bg-blue-950/40 text-blue-200 border-blue-800/50' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/ja/', icon: Globe, color: 'bg-indigo-950/40 text-indigo-200 border-indigo-800/50' },
  { name: 'Example.com', url: 'https://example.com', icon: Compass, color: 'bg-emerald-950/40 text-emerald-200 border-emerald-800/50' },
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
    <div className="flex flex-col items-center justify-center min-h-full bg-slate-950 text-slate-100 px-4 py-12">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8">
        {/* Browser Branding & Intro */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shadow-lg mb-2">
            <Globe className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            大画面ブラウザ
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            URLを入力してウェブサイトを素早く表示。上部の「大画面で見る」ボタンを押すと、いつでもフルスクリーンで快適に閲覧できます。
          </p>
        </div>

        {/* Search / URL Box */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto w-full">
          <div className="flex items-center bg-slate-900 border-2 border-indigo-500/50 rounded-2xl px-4 py-3 shadow-2xl focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="URLまたは検索キーワードを入力 (例: wikipedia.org)"
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base"
              autoFocus
            />
            <button
              type="submit"
              className="ml-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-colors shadow-md shrink-0"
            >
              アクセス
            </button>
          </div>
        </form>

        {/* Fullscreen Highlight Banner */}
        <div className="max-w-xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">ワンクリック大画面表示</h3>
              <p className="text-xs text-slate-400">上下のメニューを隠して、サイトを画面いっぱいに拡大表示します</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shrink-0 shadow"
          >
            大画面にする
          </button>
        </div>

        {/* Quick Access Tiles */}
        <div className="pt-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                  className={`flex items-center space-x-3 p-3.5 rounded-xl border ${site.color} hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all text-left group shadow-sm`}
                >
                  <div className="p-2 rounded-lg bg-slate-900/60 group-hover:bg-indigo-600/20 transition-colors">
                    <IconComp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                      {site.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
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
