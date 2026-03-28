import { useState, useCallback } from "react";

export interface HistoryItem {
  query: string;
  timestamp: number;
  filter?: string;
}

const STORAGE_KEY = "prosearch-history";
const MAX_ITEMS = 50;

const load = (): HistoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const useSearchHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>(load);

  const addToHistory = useCallback((query: string, filter?: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.query !== query);
      const next = [{ query, timestamp: Date.now(), filter }, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  const removeItem = useCallback((query: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.query !== query);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { history, addToHistory, clearHistory, removeItem };
};
