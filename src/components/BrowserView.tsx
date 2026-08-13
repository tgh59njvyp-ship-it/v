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
    <div className={`relative flex-1 bg-slate-950 overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950' : 'h-full'}`}>
      {/* Floating Fullscreen Exit Bar when in fullscreen mode */}
      {isFullscreen && (
        <div className="absolute top-3 right-3 z-50 flex items-center space-x-2 bg-slate-900/95 border border-slate-700 shadow-2xl rounded-xl px-4 py-2 text-white backdrop-blur-md hover:opacity-100 opacity-30 transition-opacity">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-indigo-400 font-mono truncate max-w-xs">{activeTab.url}</span>
          </div>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors shadow"
          >
            大画面を解除
          </button>
        </div>
      )}

      {/* Loading bar or spinner */}
      {(activeTab.isLoading || activeTab.isReaderLoading) && (
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-indigo-500/20 overflow-hidden">
          <div className="h-full bg-indigo-500 animate-pulse w-2/3" />
        </div>
      )}

      {/* Main View Area (Reader mode or Iframe) */}
      {activeTab.isReaderMode ? (
        <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-12 text-slate-100 w-full flex justify-center">
          <div className="w-full max-w-3xl">
            {activeTab.isReaderLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <p>ページの内容を取得中...</p>
              </div>
            ) : activeTab.readerError ? (
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm space-y-3">
                <p className="font-bold flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>リーダー表示のエラー</span>
                </p>
                <p>{activeTab.readerError}</p>
                <button
                  type="button"
                  onClick={() => onOpenExternal(activeTab.url)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors"
                >
                  新しいタブで直接開く
                </button>
              </div>
            ) : activeTab.readerContent ? (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs text-indigo-400 font-mono mb-1 truncate">{activeTab.url}</div>
                  <h1 className="text-2xl font-bold text-white">{activeTab.readerContent.title}</h1>
                </div>
                <div className="markdown-body prose prose-invert max-w-none text-slate-300 leading-relaxed">
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
