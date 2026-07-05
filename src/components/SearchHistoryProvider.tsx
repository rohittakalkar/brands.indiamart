'use client';

import React, { createContext, useContext, useState } from 'react';

interface SearchHistoryContextValue {
  /** Most recent first, deduped case-insensitively. */
  searchHistory: string[];
  trackSearch: (query: string) => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

const MAX_ENTRIES = 12;

// Session-scoped (in-memory only), matching this app's existing pattern for Recently
// Viewed / Shortlist / Quote Basket — a distinct signal from Recently Viewed (what was
// typed, not just what was opened), used to personalize guided-discovery ordering without
// requiring a buyer to have actually landed on a product/brand/category page first.
export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const trackSearch = (query: string) => {
    const q = query.trim();
    if (!q) return;
    setSearchHistory(prev => {
      const withoutDupe = prev.filter(s => s.toLowerCase() !== q.toLowerCase());
      return [q, ...withoutDupe].slice(0, MAX_ENTRIES);
    });
  };

  return (
    <SearchHistoryContext.Provider value={{ searchHistory, trackSearch }}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const ctx = useContext(SearchHistoryContext);
  if (!ctx) throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  return ctx;
}
