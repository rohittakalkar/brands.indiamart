'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ScrollChromeContextValue {
  /** Bottom Nav visibility — true on scroll-up, at true top, or at true bottom. */
  navVisible: boolean;
  /** Mobile search bar's expanded state — true on scroll-down; the search bar itself
   * additionally forces this true while focused or mid-query, which is local state it
   * owns, not tracked here. */
  searchExpanded: boolean;
  /** Suspends all scroll-driven chrome changes — called while a modal/sheet has focus. */
  setFrozen: (frozen: boolean) => void;
}

const ScrollChromeContext = createContext<ScrollChromeContextValue | null>(null);

// Cumulative scroll distance, in one direction, required before the chrome flips state.
// Large enough to ignore momentum jitter, small enough to feel immediate.
const THRESHOLD = 24;
const EDGE_GUARD = 4;

export function ScrollChromeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navVisible, setNavVisible] = useState(true);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const lastScrollTop = useRef(0);
  const deltaSinceFlip = useRef(0);
  const directionRef = useRef<'up' | 'down' | null>(null);
  const frozenRef = useRef(false);

  // This app's page views each carry a "flex-1 overflow-y-auto" wrapper, but none of
  // them are actually height-constrained by an ancestor (AppShell uses min-h-screen, not
  // a capped height) — confirmed directly: documentElement.scrollHeight exceeds
  // clientHeight and a real scroll moves window.scrollY, not any inner div's scrollTop.
  // The window is what actually scrolls, so that's what this listens to.
  useEffect(() => {
    const handleScroll = () => {
      if (frozenRef.current) return;
      const scrollTop = window.scrollY;
      const doc = document.documentElement;
      const atTop = scrollTop <= EDGE_GUARD;
      const atBottom = scrollTop + window.innerHeight >= doc.scrollHeight - EDGE_GUARD;

      if (atTop) {
        setNavVisible(true);
        setSearchExpanded(false);
        lastScrollTop.current = scrollTop;
        deltaSinceFlip.current = 0;
        directionRef.current = null;
        return;
      }
      if (atBottom) {
        // Nav forced visible at the true bottom — nothing left to read, buyer needs a
        // way out. Search keeps its last state; reaching the bottom isn't itself a
        // "wants to redirect" signal the way scrolling up is.
        setNavVisible(true);
        lastScrollTop.current = scrollTop;
        return;
      }

      const diff = scrollTop - lastScrollTop.current;
      const newDirection = diff > 0 ? 'down' : diff < 0 ? 'up' : directionRef.current;

      if (newDirection !== directionRef.current) {
        // Direction reversed — reset the counter so a hide/reveal already in progress
        // doesn't get caught mid-transition by an immediate re-reversal.
        deltaSinceFlip.current = 0;
        directionRef.current = newDirection;
      }

      deltaSinceFlip.current += Math.abs(diff);
      lastScrollTop.current = scrollTop;

      if (deltaSinceFlip.current >= THRESHOLD) {
        if (directionRef.current === 'down') {
          setNavVisible(false);
          setSearchExpanded(true);
        } else if (directionRef.current === 'up') {
          setNavVisible(true);
          setSearchExpanded(false);
        }
        deltaSinceFlip.current = 0;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const setFrozen = useCallback((frozen: boolean) => {
    frozenRef.current = frozen;
  }, []);

  // A freshly-loaded page has shown no scroll intent yet — always start with full chrome.
  useEffect(() => {
    setNavVisible(true);
    setSearchExpanded(false);
    lastScrollTop.current = window.scrollY;
    deltaSinceFlip.current = 0;
    directionRef.current = null;
  }, [pathname]);

  return (
    <ScrollChromeContext.Provider value={{ navVisible, searchExpanded, setFrozen }}>
      {children}
    </ScrollChromeContext.Provider>
  );
}

export function useScrollChrome() {
  const ctx = useContext(ScrollChromeContext);
  if (!ctx) throw new Error('useScrollChrome must be used within a ScrollChromeProvider');
  return ctx;
}
