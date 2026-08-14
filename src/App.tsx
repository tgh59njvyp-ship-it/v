import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Home, Bookmark as BookmarkIcon, History as HistoryIcon, LayoutGrid, Monitor, RotateCw } from 'lucide-react';
import { Tab, Bookmark, HistoryItem, QuickAccessItem } from './types';
import { TabBar } from './components/TabBar';
import { BrowserHeader } from './components/BrowserHeader';
import { BrowserView } from './components/BrowserView';
import { BookmarksModal } from './components/BookmarksModal';
import { HistoryModal } from './components/HistoryModal';
import { AiSummaryModal } from './components/AiSummaryModal';

const STORAGE_KEYS = {
  BOOKMARKS: 'web_browser_bookmarks_v1',
  HISTORY: 'web_browser_history_v1',
  QUICK_ACCESS: 'web_browser_quick_access_v2',
};

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'Wikipedia', url: 'https://ja.wikipedia.org/wiki/メインページ', createdAt: Date.now() },
  { id: '2', title: 'Hacker News', url: 'https://news.ycombinator.com', createdAt: Date.now() },
  { id: '3', title: 'GitHub', url: 'https://github.com', createdAt: Date.now() },
  { id: '4', title: 'Google', url: 'https://www.google.com', createdAt: Date.now() },
];

const DEFAULT_QUICK_ACCESS: QuickAccessItem[] = [
  { id: '1', name: 'Google', url: 'https://www.google.com', iconType: 'search', useProxy: true },
  { id: '2', name: 'DuckDuckGo', url: 'https://duckduckgo.com', iconType: 'search' },
  { id: '3', name: 'Wikipedia', url: 'https://ja.wikipedia.org/wiki/メインページ', iconType: 'book' },
  { id: '4', name: 'Yahoo! JAPAN', url: 'https://www.yahoo.co.jp', iconType: 'news', useProxy: true },
  { id: '5', name: 'GitHub', url: 'https://github.com', iconType: 'code', useProxy: true },
  { id: '6', name: 'Hacker News', url: 'https://news.ycombinator.com', iconType: 'news' },
  { id: '7', name: 'MDN Web Docs', url: 'https://developer.mozilla.org/ja/', iconType: 'globe' },
  { id: '8', name: 'Example.com', url: 'https://example.com', iconType: 'compass' },
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
      useProxy: false,
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

  // Quick Access
  const [quickAccessItems, setQuickAccessItems] = useState<QuickAccessItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUICK_ACCESS);
      return saved ? JSON.parse(saved) : DEFAULT_QUICK_ACCESS;
    } catch {
      return DEFAULT_QUICK_ACCESS;
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS, JSON.stringify(quickAccessItems));
  }, [quickAccessItems]);

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

  const handleNavigate = (url: string, useProxy?: boolean) => {
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    // If useProxy is not explicitly provided, auto-enable for Google / Yahoo
    const shouldProxy = useProxy !== undefined 
      ? useProxy 
      : (finalUrl.includes('google.com') || finalUrl.includes('google.co.jp') || finalUrl.includes('yahoo.co.jp'));

    updateActiveTab({
      url: finalUrl,
      title: finalUrl,
      isLoading: true,
      canGoBack: true,
      useProxy: shouldProxy,
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

  const handleToggleProxy = () => {
    updateActiveTab({ useProxy: !activeTab.useProxy });
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
      useProxy: false,
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
    updateActiveTab({ url: '', title: '新しいタブ', canGoBack: false, useProxy: false });
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
    updateActiveTab({ url: '', title: '新しいタブ', canGoBack: false, useProxy: false });
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

  const handleSaveQuickAccessItem = (item: QuickAccessItem) => {
    setQuickAccessItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? item : i));
      }
      return [...prev, item];
    });
  };

  const handleDeleteQuickAccessItem = (id: string) => {
    setQuickAccessItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResetQuickAccessDefaults = () => {
    setQuickAccessItems(DEFAULT_QUICK_ACCESS);
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
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-white font-sans text-zinc-900 select-none">
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
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          isFullscreen={isFullscreen}
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
        onToggleProxy={handleToggleProxy}
        onToggleReaderMode={handleToggleReaderMode}
        quickAccessItems={quickAccessItems}
        onSaveQuickAccessItem={handleSaveQuickAccessItem}
        onDeleteQuickAccessItem={handleDeleteQuickAccessItem}
        onResetQuickAccessDefaults={handleResetQuickAccessDefaults}
      />

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
