import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Home, Bookmark as BookmarkIcon, History as HistoryIcon, LayoutGrid, Monitor, RotateCw } from 'lucide-react';
import { Tab, Bookmark, HistoryItem } from './types';
import { TabBar } from './components/TabBar';
import { BrowserHeader } from './components/BrowserHeader';
import { BrowserView } from './components/BrowserView';
import { BookmarksModal } from './components/BookmarksModal';
import { HistoryModal } from './components/HistoryModal';
import { AiSummaryModal } from './components/AiSummaryModal';

const STORAGE_KEYS = {
  BOOKMARKS: 'web_browser_bookmarks_v1',
  HISTORY: 'web_browser_history_v1',
};

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'Wikipedia', url: 'https://ja.wikipedia.org/wiki/メインページ', createdAt: Date.now() },
  { id: '2', title: 'Hacker News', url: 'https://news.ycombinator.com', createdAt: Date.now() },
  { id: '3', title: 'GitHub', url: 'https://github.com', createdAt: Date.now() },
  { id: '4', title: 'Google', url: 'https://www.google.com', createdAt: Date.now() },
];

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      url: '',
      title: '新しいタブ',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      zoomLevel: 100,
      isReaderMode: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  // History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  // Handle Fullscreen keyboard shortcut (F11 / Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const updateActiveTab = (updates: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, ...updates } : t))
    );
  };

  const handleNavigate = (url: string) => {
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    updateActiveTab({
      url: finalUrl,
      title: finalUrl,
      isLoading: true,
      canGoBack: true,
    });

    // Add to history
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      url: finalUrl,
      title: finalUrl,
      visitedAt: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 199)]);
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newId,
      url: '',
      title: '新しいタブ',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      zoomLevel: 100,
      isReaderMode: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length === 1) return; // Keep at least one tab
    const index = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      const nextTab = newTabs[Math.max(0, index - 1)];
      setActiveTabId(nextTab.id);
    }
  };

  const handleBack = () => {
    updateActiveTab({ url: '', title: '新しいタブ', canGoBack: false });
  };

  const handleForward = () => {
    // no-op for simple single-page navigation stack
  };

  const handleReload = () => {
    const currentUrl = activeTab.url;
    if (!currentUrl) return;
    updateActiveTab({ url: '', isLoading: true });
    setTimeout(() => {
      updateActiveTab({ url: currentUrl, isLoading: false });
    }, 100);
  };

  const handleHome = () => {
    updateActiveTab({ url: '', title: '新しいタブ', canGoBack: false });
  };

  const isBookmarked = bookmarks.some((b) => b.url === activeTab.url && activeTab.url !== '');

  const handleToggleBookmark = () => {
    if (!activeTab.url || activeTab.url === 'about:blank') return;
    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.url !== activeTab.url));
    } else {
      const newBm: Bookmark = {
        id: Math.random().toString(36).substring(2, 9),
        url: activeTab.url,
        title: activeTab.title || activeTab.url,
        createdAt: Date.now(),
      };
      setBookmarks((prev) => [newBm, ...prev]);
    }
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleEditBookmark = (id: string, newTitle: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, title: newTitle } : b))
    );
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleOpenExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleToggleReaderMode = async () => {
    if (!activeTab.url || activeTab.url === 'about:blank') return;
    
    if (activeTab.isReaderMode) {
      updateActiveTab({ isReaderMode: false });
      return;
    }

    if (activeTab.readerContent) {
      updateActiveTab({ isReaderMode: true });
      return;
    }

    updateActiveTab({ isReaderLoading: true, readerError: null });
    try {
      const res = await fetch('/api/fetch-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: activeTab.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch page');
      updateActiveTab({
        isReaderMode: true,
        readerContent: { title: data.title, markdown: data.markdown },
        isReaderLoading: false
      });
    } catch (err: any) {
      updateActiveTab({
        isReaderMode: true,
        readerError: err.message || 'ページの取得に失敗しました',
        isReaderLoading: false
      });
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-white font-sans text-zinc-900 select-none pb-[env(safe-area-inset-bottom)]">
      {/* Top Tab Bar (Hidden in Fullscreen mode unless hovered or desired) */}
      {!isFullscreen && (
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onCloseTab={handleCloseTab}
          onNewTab={handleNewTab}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(true)}
        />
      )}

      {/* Browser Header / URL bar */}
      {!isFullscreen && (
        <BrowserHeader
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onBack={handleBack}
          onForward={handleForward}
          onReload={handleReload}
          onHome={handleHome}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={isBookmarked}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenAiSummary={() => setIsAiSummaryOpen(true)}
          onZoomChange={(zoom) => updateActiveTab({ zoomLevel: zoom })}
          onOpenExternal={handleOpenExternal}
          onToggleReaderMode={handleToggleReaderMode}
        />
      )}

      {/* Main Browser View */}
      <BrowserView
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onUpdateLoading={(isLoading) => updateActiveTab({ isLoading })}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        isFullscreen={isFullscreen}
        onOpenExternal={handleOpenExternal}
      />

      {/* Mobile Bottom Navigation (Visible only on mobile) */}
      {!isFullscreen && (
        <div className="md:hidden flex items-center justify-between bg-white border-t border-zinc-200 px-2 py-2 shrink-0">
          <button onClick={handleBack} className="p-1.5 sm:p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={handleForward} className="p-1.5 sm:p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={handleReload} className={`p-1.5 sm:p-2 rounded-xl transition-colors ${activeTab.isLoading ? 'animate-spin text-black' : 'text-zinc-600 hover:text-black hover:bg-zinc-100'}`} title="再読み込み">
            <RotateCw className="w-5 h-5" />
          </button>
          <button onClick={() => setIsFullscreen(true)} className="p-1.5 sm:p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors" title="大画面で見る">
            <Monitor className="w-5 h-5" />
          </button>
          <button onClick={handleHome} className="p-2 sm:p-3 bg-zinc-100 hover:bg-zinc-200 text-black rounded-xl transition-colors shadow-sm -mt-2">
            <Home className="w-5 h-5" />
          </button>
          <button onClick={() => setIsBookmarksOpen(true)} className="p-1.5 sm:p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors">
            <BookmarkIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setIsHistoryOpen(true)} className="p-1.5 sm:p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={handleNavigate}
        onDeleteBookmark={handleDeleteBookmark}
        onEditBookmark={handleEditBookmark}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleNavigate}
        onClearHistory={handleClearHistory}
      />

      <AiSummaryModal
        isOpen={isAiSummaryOpen}
        onClose={() => setIsAiSummaryOpen(false)}
        activeTab={activeTab}
      />
    </div>
  );
}

