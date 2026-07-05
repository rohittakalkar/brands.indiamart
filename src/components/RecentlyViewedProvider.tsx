'use client';

import React, { createContext, useContext, useState } from 'react';

export interface RecentlyViewedEntry {
  type: 'product' | 'brand' | 'category';
  id: string;
  viewedAt: number;
}

interface RecentlyViewedContextValue {
  recentlyViewed: RecentlyViewedEntry[];
  trackView: (type: RecentlyViewedEntry['type'], id: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

const MAX_ENTRIES = 8;

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedEntry[]>([]);

  const trackView = (type: RecentlyViewedEntry['type'], id: string) => {
    setRecentlyViewed(prev => {
      const withoutDupe = prev.filter(e => !(e.type === type && e.id === id));
      return [{ type, id, viewedAt: Date.now() }, ...withoutDupe].slice(0, MAX_ENTRIES);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, trackView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  return ctx;
}
