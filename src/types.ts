export interface Tab {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  zoomLevel: number;
  isReaderMode: boolean;
  readerContent?: { title: string; markdown: string } | null;
  isReaderLoading?: boolean;
  readerError?: string | null;
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
