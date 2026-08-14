import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Globe, Search, BookOpen, Code, Newspaper, Compass, Video, Gamepad2, Sparkles, ShoppingBag, Music, RotateCcw } from 'lucide-react';
import { QuickAccessItem } from '../types';

interface QuickAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuickAccessItem[];
  onSaveItem: (item: QuickAccessItem) => void;
  onDeleteItem: (id: string) => void;
  onResetDefaults: () => void;
}

const ICON_MAP = {
  globe: Globe,
  search: Search,
  book: BookOpen,
  code: Code,
  news: Newspaper,
  compass: Compass,
  video: Video,
  game: Gamepad2,
  sparkles: Sparkles,
  shopping: ShoppingBag,
  music: Music,
};

export const QuickAccessModal: React.FC<QuickAccessModalProps> = ({
  isOpen,
  onClose,
  items,
  onSaveItem,
  onDeleteItem,
  onResetDefaults,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [iconType, setIconType] = useState<keyof typeof ICON_MAP>('globe');
  const [useProxy, setUseProxy] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setUrl('');
    setIconType('globe');
    setUseProxy(false);
    setIsAddingNew(false);
  };

  const handleStartEdit = (item: QuickAccessItem) => {
    setEditingId(item.id);
    setName(item.name);
    setUrl(item.url);
    setIconType((item.iconType as keyof typeof ICON_MAP) || 'globe');
    setUseProxy(!!item.useProxy);
    setIsAddingNew(false);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAddingNew(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const newItem: QuickAccessItem = {
      id: editingId || `qa-${Date.now()}`,
      name: name.trim(),
      url: finalUrl,
      iconType,
      useProxy,
    };

    onSaveItem(newItem);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center space-x-2 text-zinc-900 font-semibold">
            <Compass className="w-5 h-5" />
            <span>クイックアクセスの編集</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Add / Edit Form */}
          {(isAddingNew || editingId) ? (
            <form onSubmit={handleSubmit} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900">
                  {isAddingNew ? '新しいショートカットを追加' : 'ショートカットを編集'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-zinc-500 hover:text-black"
                >
                  キャンセル
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">サイト名</label>
                <input
                  type="text"
                  required
                  placeholder="例: Google, YouTube, ニュース"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">URL</label>
                <input
                  type="text"
                  required
                  placeholder="例: https://google.com または google.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">アイコンの選択</label>
                <div className="grid grid-cols-6 gap-2">
                  {Object.entries(ICON_MAP).map(([key, IconComponent]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setIconType(key as keyof typeof ICON_MAP)}
                      className={`p-2.5 rounded-lg flex items-center justify-center border transition-all ${
                        iconType === key 
                          ? 'bg-black text-white border-black shadow-sm' 
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 text-xs text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useProxy}
                    onChange={(e) => setUseProxy(e.target.checked)}
                    className="rounded border-zinc-300 text-black focus:ring-black"
                  />
                  <span>プロキシ経由で開く (Googleなどの埋め込みブロック対策)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-200 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition-colors shadow"
                >
                  {isAddingNew ? '追加する' : '保存する'}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={handleStartAdd}
              className="w-full py-2.5 px-4 border-2 border-dashed border-zinc-300 hover:border-black rounded-xl text-xs font-medium text-zinc-600 hover:text-black flex items-center justify-center space-x-1.5 transition-colors bg-zinc-50/50 hover:bg-white"
            >
              <Plus className="w-4 h-4" />
              <span>新しいショートカットを追加</span>
            </button>
          )}

          {/* Existing Items List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              登録済みショートカット ({items.length})
            </h4>

            <div className="space-y-1.5">
              {items.map((item) => {
                const IconComponent = (item.iconType && ICON_MAP[item.iconType as keyof typeof ICON_MAP]) || Globe;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                      <div className="p-2 rounded-lg bg-zinc-100 text-black shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <h5 className="text-sm font-medium text-zinc-900 truncate">{item.name}</h5>
                          {item.useProxy && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded">プロキシ</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate">{item.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                        title="編集"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 bg-zinc-50">
          <button
            type="button"
            onClick={onResetDefaults}
            className="flex items-center space-x-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>初期状態に戻す</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
};
