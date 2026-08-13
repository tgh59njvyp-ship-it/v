import React from 'react';
import { Plus, X, Globe, Monitor } from 'lucide-react';
import { Tab } from '../types';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 pt-2 select-none border-b border-slate-800">
      {/* Tabs list */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar max-w-[calc(100%-120px)]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const displayTitle = tab.title || (tab.url ? tab.url.replace(/^https?:\/\//, '') : '新しいタブ');
          
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center space-x-2 px-3 py-2 text-xs rounded-t-lg max-w-[200px] min-w-[120px] cursor-pointer transition-all ${
                isActive
                  ? 'bg-slate-800 text-white font-medium shadow-sm border-t-2 border-indigo-500'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="truncate flex-1">{displayTitle}</span>
              
              {/* Close tab button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`p-0.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ${
                  tabs.length === 1 ? 'opacity-40 cursor-not-allowed' : 'opacity-70 group-hover:opacity-100'
                }`}
                disabled={tabs.length === 1}
                title="タブを閉じる"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          type="button"
          onClick={onNewTab}
          className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="新しいタブを開く"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Fullscreen Toggle in Tab Header */}
      <div className="flex items-center space-x-2 pb-1">
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            isFullscreen 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
          title="大画面モード切替 (F11 / ボタン)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{isFullscreen ? '大画面解除' : '大画面で見る'}</span>
        </button>
      </div>
    </div>
  );
};
