'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { floatingSearchBarHidden } from '../lib/searchBarVisibility';

// Reserves top clearance for the collapsed MobileSearchBar. Must use the exact same
// condition as MobileSearchBar's own hide check (shared, not duplicated) — the two drifted
// out of sync once already, when MobileSearchBar was updated to also hide on /products/*
// but this component's own copy of the condition wasn't, leaving a blank reserved gap with
// nothing left to clear on those pages.
export default function PageContentFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showsSearchBar = !floatingSearchBarHidden(pathname);

  return (
    <div
      className={`flex-1 flex flex-col md:pb-0 ${showsSearchBar ? 'pt-11 md:pt-0' : ''}`}
      style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  );
}
