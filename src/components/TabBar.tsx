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
    <div className="flex items-center justify-between bg-zinc-100 text-zinc-600 px-2 pt-2 select-none border-b border-zinc-200">
      {/* Tabs list */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar max-w-full md:max-w-[calc(100%-120px)]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const displayTitle = tab.title || (tab.url ? tab.url.replace(/^https?:\/\//, '') : '新しいタブ');
          
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center space-x-2 px-3 py-2 text-xs rounded-t-xl max-w-[160px] md:max-w-[200px] min-w-[100px] cursor-pointer transition-all ${
                isActive
                  ? 'bg-white text-zinc-900 font-medium shadow-sm border-t-2 border-black'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
              <span className="truncate flex-1">{displayTitle}</span>
              
              {/* Close tab button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`p-0.5 rounded-full hover:bg-zinc-300 text-zinc-400 hover:text-zinc-800 transition-colors ${
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
          className="p-1.5 ml-1 mb-1 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors shrink-0"
          title="新しいタブを開く"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Fullscreen Toggle in Tab Header (Hidden on mobile) */}
      <div className="hidden md:flex items-center space-x-2 pb-1 pr-1 shrink-0">
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            isFullscreen 
              ? 'bg-black text-white shadow-md' 
              : 'bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200'
          }`}
          title="大画面モード切替"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{isFullscreen ? '大画面解除' : '大画面で見る'}</span>
        </button>
      </div>
    </div>
  );
};

