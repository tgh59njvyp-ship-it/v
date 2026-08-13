export interface Tab {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  zoomLevel: number; // e.g. 100, 125, 150, 75
  isReaderMode: boolean;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  visitedAt: number;
}
