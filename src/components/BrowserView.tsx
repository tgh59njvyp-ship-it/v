import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, ExternalLink, Shield, ShieldCheck, BookOpen, Monitor, Globe, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { Tab, QuickAccessItem } from '../types';
import { HomePage } from './HomePage';

interface BrowserViewProps {
  activeTab: Tab;
  onNavigate: (url: string, useProxy?: boolean) => void;
  onUpdateLoading: (isLoading: boolean) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenExternal: (url: string) => void;
  onToggleProxy: () => void;
  onToggleReaderMode: () => void;
  quickAccessItems: QuickAccessItem[];
  onSaveQuickAccessItem: (item: QuickAccessItem) => void;
  onDeleteQuickAccessItem: (id: string) => void;
  onResetQuickAccessDefaults: () => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({
  activeTab,
  onNavigate,
  onUpdateLoading,
  onToggleFullscreen,
  isFullscreen,
  onOpenExternal,
  onToggleProxy,
  onToggleReaderMode,
  quickAccessItems,
  onSaveQuickAccessItem,
  onDeleteQuickAccessItem,
  onResetQuickAccessDefaults,
}) => {
  const [hasIframeLoaded, setHasIframeLoaded] = useState(false);
  const [showHelperBanner, setShowHelperBanner] = useState(false);

  useEffect(() => {
    if (activeTab.url && activeTab.url !== 'about:blank') {
      setHasIframeLoaded(false);
      setShowHelperBanner(false);
      
      // Auto-detect if it's Google or other strict iframe blockers and recommend proxy
      const isGoogle = activeTab.url.includes('google.com') || activeTab.url.includes('google.co.jp');
      if (isGoogle && !activeTab.useProxy) {
        setShowHelperBanner(true);
      }

      if (!activeTab.isReaderMode && !activeTab.isReaderLoading) {
        onUpdateLoading(true);
        const timer = setTimeout(() => {
          onUpdateLoading(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    } else {
      onUpdateLoading(false);
    }
  }, [activeTab.url, activeTab.useProxy, activeTab.isReaderMode, activeTab.isReaderLoading]);

  if (!activeTab.url || activeTab.url === 'about:blank') {
    return (
      <HomePage 
        onNavigate={onNavigate} 
        onToggleFullscreen={onToggleFullscreen}
        quickAccessItems={quickAccessItems}
        onSaveQuickAccessItem={onSaveQuickAccessItem}
        onDeleteQuickAccessItem={onDeleteQuickAccessItem}
        onResetQuickAccessDefaults={onResetQuickAccessDefaults}
      />
    );
  }

  const zoomFactor = activeTab.zoomLevel / 100;
  const isGoogle = activeTab.url.includes('google.com') || activeTab.url.includes('google.co.jp');

  const effectiveIframeSrc = activeTab.useProxy
    ? `/api/proxy?url=${encodeURIComponent(activeTab.url)}`
    : activeTab.url;

  return (
    <div className={`relative flex-1 bg-white overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'}`}>
      {/* Floating Fullscreen Exit Bar when in fullscreen mode */}
      {isFullscreen && (
        <div className="absolute top-3 right-3 z-50 flex items-center space-x-2 bg-white/95 border border-zinc-200 shadow-xl rounded-xl px-3 py-1.5 text-zinc-900 backdrop-blur-md hover:opacity-100 opacity-60 transition-opacity">
          <span className="text-xs text-zinc-500 font-mono truncate max-w-xs">{activeTab.url}</span>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="px-3 py-1 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors shadow"
          >
            大画面を解除
          </button>
        </div>
      )}

      {/* Mode / Proxy Control Bar (Always accessible, compact) */}
      {!isFullscreen && (
        <div className="bg-zinc-100/90 border-b border-zinc-200 px-3 py-1.5 flex items-center justify-between text-xs text-zinc-600">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="inline-flex items-center space-x-1 font-medium truncate">
              {activeTab.useProxy ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-medium">プロキシ表示中 (X-Frame制限解除)</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>通常表示</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleProxy}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                activeTab.useProxy
                  ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
              title="Googleやセキュリティ制限のあるサイトを直接表示できるように切り替えます"
            >
              {activeTab.useProxy ? '通常表示に戻す' : 'プロキシに切替 (表示できない時)'}
            </button>
            <button
              type="button"
              onClick={() => onOpenExternal(activeTab.url)}
              className="p-1 text-zinc-500 hover:text-black rounded hover:bg-zinc-200 transition-colors"
              title="ブラウザの別タブで直接開く"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Helpful banner for Google when not in proxy mode */}
      {showHelperBanner && !activeTab.useProxy && !isFullscreen && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Googleなどの一部サイトはセキュリティ制限(X-Frame-Options)により通常表示で拒否される場合があります。</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={onToggleProxy}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm"
            >
              プロキシで開く
            </button>
            <button
              type="button"
              onClick={() => setShowHelperBanner(false)}
              className="text-amber-700 hover:text-amber-950 px-1"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Loading bar */}
      {(activeTab.isLoading || activeTab.isReaderLoading) && (
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-black/10 overflow-hidden">
          <div className="h-full bg-black animate-pulse w-2/3" />
        </div>
      )}

      {/* Main View Area (Reader mode or Iframe) */}
      {activeTab.isReaderMode ? (
        <div className="flex-1 overflow-y-auto bg-zinc-50 p-6 md:p-12 text-zinc-900 w-full flex justify-center pb-24 md:pb-12">
          <div className="w-full max-w-3xl">
            {activeTab.isReaderLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <p>ページの内容を取得中...</p>
              </div>
            ) : activeTab.readerError ? (
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm space-y-3">
                <p className="font-bold flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>リーダー表示のエラー</span>
                </p>
                <p>{activeTab.readerError}</p>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={onToggleProxy}
                    className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors"
                  >
                    プロキシ表示で試す
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenExternal(activeTab.url)}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 rounded-xl text-xs font-medium transition-colors"
                  >
                    新しいタブで直接開く
                  </button>
                </div>
              </div>
            ) : activeTab.readerContent ? (
              <div className="space-y-6">
                <div className="border-b border-zinc-200 pb-4">
                  <div className="text-xs text-zinc-500 font-mono mb-1 truncate">{activeTab.url}</div>
                  <h1 className="text-2xl font-bold text-zinc-900">{activeTab.readerContent.title}</h1>
                </div>
                <div className="markdown-body prose prose-zinc max-w-none text-zinc-700 leading-relaxed">
                  <Markdown>{activeTab.readerContent.markdown}</Markdown>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative overflow-hidden bg-white">
          <iframe
            key={`${activeTab.id}-${effectiveIframeSrc}`}
            src={effectiveIframeSrc}
            title={activeTab.title || activeTab.url}
            className="w-full h-full border-0 absolute top-0 left-0"
            style={{
              width: `${100 / zoomFactor}%`,
              height: `${100 / zoomFactor}%`,
              transform: `scale(${zoomFactor})`,
              transformOrigin: 'top left',
            }}
            onLoad={() => {
              setHasIframeLoaded(true);
              onUpdateLoading(false);
            }}
            onError={() => onUpdateLoading(false)}
          />
        </div>
      )}
    </div>
  );
};
