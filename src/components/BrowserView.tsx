import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, ExternalLink, RefreshCw, Home, Monitor, BookOpen, Globe } from 'lucide-react';
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
  const [loadError, setLoadError] = useState(false);
  const [useReaderMode, setUseReaderMode] = useState(false);
  const [readerContent, setReaderContent] = useState<{ title: string; markdown: string } | null>(null);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);

  useEffect(() => {
    setLoadError(false);
    setUseReaderMode(false);
    setReaderContent(null);
    setReaderError(null);

    if (activeTab.url && activeTab.url !== 'about:blank') {
      onUpdateLoading(true);
      const timer = setTimeout(() => {
        onUpdateLoading(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      onUpdateLoading(false);
    }
  }, [activeTab.url]);

  const fetchReaderContent = async () => {
    setReaderLoading(true);
    setReaderError(null);
    try {
      const res = await fetch('/api/fetch-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: activeTab.url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch page');
      }
      setReaderContent({ title: data.title, markdown: data.markdown });
      setUseReaderMode(true);
    } catch (err: any) {
      setReaderError(err.message || 'ページの取得に失敗しました');
    } finally {
      setReaderLoading(false);
    }
  };

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
        <div className="absolute top-3 right-3 z-50 flex items-center space-x-2 bg-slate-900/95 border border-slate-700 shadow-2xl rounded-xl px-4 py-2 text-white backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-indigo-400 font-mono truncate max-w-xs">{activeTab.url}</span>
          </div>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors shadow"
          >
            大画面を解除 (Esc)
          </button>
        </div>
      )}

      {/* Loading bar or spinner */}
      {activeTab.isLoading && (
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-indigo-500/20 overflow-hidden">
          <div className="h-full bg-indigo-500 animate-pulse w-2/3" />
        </div>
      )}

      {/* Security restriction warning & Reader Mode toggle bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center space-x-2 truncate">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">
            ※サイトがiframe表示を拒否している場合は「リーダー表示で読む」または「新しいタブで開く」をご利用ください。
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={fetchReaderContent}
            disabled={readerLoading}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {readerLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookOpen className="w-3.5 h-3.5" />}
            <span>{useReaderMode ? 'iframe表示に戻す' : 'リーダー表示で読む'}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenExternal(activeTab.url)}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors shadow-sm border border-slate-700"
          >
            <ExternalLink className="w-3 h-3" />
            <span>別タブで開く</span>
          </button>
        </div>
      </div>

      {/* Main View Area (Reader mode or Iframe) */}
      {useReaderMode ? (
        <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-12 text-slate-100 max-w-4xl mx-auto w-full">
          {readerLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p>ページの内容を安全に取得中...</p>
            </div>
          ) : readerError ? (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm space-y-3">
              <p className="font-bold flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>リーダー表示のエラー</span>
              </p>
              <p>{readerError}</p>
              <button
                type="button"
                onClick={() => onOpenExternal(activeTab.url)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-medium"
              >
                新しいタブで直接開く
              </button>
            </div>
          ) : readerContent ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-xs text-indigo-400 font-mono mb-1 truncate">{activeTab.url}</div>
                <h1 className="text-2xl font-bold text-white">{readerContent.title}</h1>
              </div>
              <div className="markdown-body prose prose-invert max-w-none text-slate-300 leading-relaxed">
                <Markdown>{readerContent.markdown}</Markdown>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex-1 relative overflow-auto bg-white">
          <iframe
            src={activeTab.url}
            title={activeTab.title || activeTab.url}
            className="w-full h-full border-0"
            style={{
              width: `${100 / zoomFactor}%`,
              height: `${100 / zoomFactor}%`,
              transform: `scale(${zoomFactor})`,
              transformOrigin: 'top left',
            }}
            onLoad={() => onUpdateLoading(false)}
            onError={() => {
              setLoadError(true);
              onUpdateLoading(false);
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />

          {(loadError || true) && (
            <div className="absolute bottom-4 right-4 z-30 bg-slate-900/95 border border-slate-700 shadow-2xl rounded-xl p-4 max-w-sm text-slate-200 backdrop-blur-md flex flex-col space-y-3">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-white mb-0.5">サイトが表示されない場合</p>
                  <p className="text-slate-400">Google等の多くのサイトはセキュリティによりiframe内表示をブロックします。その場合は上の「リーダー表示で読む」または「別タブで開く」をご活用ください。</p>
                </div>
              </div>
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={fetchReaderContent}
                  className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors text-center"
                >
                  リーダー表示
                </button>
                <button
                  type="button"
                  onClick={() => onOpenExternal(activeTab.url)}
                  className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors text-center border border-slate-700"
                >
                  別タブで開く
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
