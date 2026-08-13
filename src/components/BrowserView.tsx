import React, { useEffect } from 'react';
import { Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import Markdown from 'react-markdown';
import { Tab } from '../types';
import { HomePage } from './HomePage';

interface BrowserViewProps {
  activeTab: Tab;
  onNavigate: (url: string) => void;
  onUpdateLoading: (isLoading: boolean) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenExternal: (url: string) => void;
}

export const BrowserView: React.FC<BrowserViewProps> = ({
  activeTab,
  onNavigate,
  onUpdateLoading,
  onToggleFullscreen,
  isFullscreen,
  onOpenExternal,
}) => {

  useEffect(() => {
    if (activeTab.url && activeTab.url !== 'about:blank') {
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
  }, [activeTab.url, activeTab.isReaderMode, activeTab.isReaderLoading]);

  if (!activeTab.url || activeTab.url === 'about:blank') {
    return (
      <HomePage 
        onNavigate={onNavigate} 
        onToggleFullscreen={onToggleFullscreen} 
      />
    );
  }

  const zoomFactor = activeTab.zoomLevel / 100;

  return (
    <div className={`relative flex-1 bg-white overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'}`}>
      {/* Floating Fullscreen Exit Bar when in fullscreen mode */}
      {isFullscreen && (
        <div className="absolute top-3 right-3 z-50 flex items-center space-x-2 bg-white/95 border border-zinc-200 shadow-xl rounded-xl px-4 py-2 text-zinc-900 backdrop-blur-md hover:opacity-100 opacity-40 transition-opacity">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-500 font-mono truncate max-w-xs">{activeTab.url}</span>
          </div>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="px-3 py-1 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors shadow"
          >
            大画面を解除
          </button>
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
                <button
                  type="button"
                  onClick={() => onOpenExternal(activeTab.url)}
                  className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors"
                >
                  新しいタブで直接開く
                </button>
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
            src={activeTab.url}
            title={activeTab.title || activeTab.url}
            className="w-full h-full border-0 absolute top-0 left-0"
            style={{
              width: `${100 / zoomFactor}%`,
              height: `${100 / zoomFactor}%`,
              transform: `scale(${zoomFactor})`,
              transformOrigin: 'top left',
            }}
            onLoad={() => onUpdateLoading(false)}
            onError={() => onUpdateLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        </div>
      )}
    </div>
  );
};

