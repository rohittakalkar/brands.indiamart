'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

// Reserves top clearance for the collapsed MobileSearchBar — which hides itself on '/',
// '/leads/success', and every category page (those carry their own inline header search
// instead), so this padding must match that same condition exactly, or those pages end up
// with dead space above their own header.
export default function PageContentFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showsSearchBar = pathname !== '/' && pathname !== '/leads/success' && !pathname.startsWith('/categories/');

  return (
    <div
      className={`flex-1 flex flex-col md:pb-0 ${showsSearchBar ? 'pt-11 md:pt-0' : ''}`}
      style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  );
}
