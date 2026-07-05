'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationHistoryContextValue {
  /** True once the buyer has navigated to at least one other in-app route this session —
   * meaning a real browser history entry exists for `router.back()` to land on (and
   * restore scroll position for), as opposed to a cold landing (search engine, direct
   * link, new tab) where there's nothing in-app to go back to. */
  hasHistory: boolean;
}

const NavigationHistoryContext = createContext<NavigationHistoryContextValue | null>(null);

export function NavigationHistoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const visitedCount = useRef(0);
  const lastPathname = useRef<string | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    if (lastPathname.current === null) {
      visitedCount.current = 1;
    } else if (lastPathname.current !== pathname) {
      visitedCount.current += 1;
    }
    lastPathname.current = pathname;
    if (visitedCount.current > 1) setHasHistory(true);
  }, [pathname]);

  return (
    <NavigationHistoryContext.Provider value={{ hasHistory }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useNavigationHistory() {
  const ctx = useContext(NavigationHistoryContext);
  if (!ctx) throw new Error('useNavigationHistory must be used within a NavigationHistoryProvider');
  return ctx;
}
