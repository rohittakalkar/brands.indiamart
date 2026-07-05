'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useScrollChrome } from './ScrollChromeProvider';

// Closes a real gap: before this, search only existed on the Home page — every other
// mobile page had no way to search without navigating back. Collapsed to an icon by
// default (matches the "default" state in the scroll-behavior spec), expands on
// scroll-down, collapses on scroll-up — except while focused or mid-query, which always
// wins over the scroll signal.
export default function MobileSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { searchExpanded } = useScrollChrome();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  // Home already has its own full hero search; the success screen hides all chrome.
  // Category pages now carry their own inline search in the header row (next to the
  // breadcrumb), so the floating pill would just duplicate it.
  if (pathname === '/' || pathname === '/leads/success' || pathname.startsWith('/categories/')) return null;

  const expanded = searchExpanded || focused || query.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setFocused(false);
    }
  };

  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 z-30 flex justify-end px-3 pointer-events-none"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <form
        onSubmit={handleSubmit}
        className={`pointer-events-auto mt-2 flex items-center bg-surface border border-line rounded-full shadow-sm overflow-hidden ${
          expanded ? 'w-full px-1 search-expand' : 'w-9 px-0 search-collapse'
        }`}
      >
        <button
          type={expanded ? 'submit' : 'button'}
          onClick={() => !expanded && setFocused(true)}
          className="w-9 h-9 shrink-0 flex items-center justify-center text-slate-500"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
        {expanded && (
          <input
            type="text"
            autoFocus={focused}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search products, brands, models…"
            className="flex-1 bg-transparent outline-none text-xs pr-3 py-2 min-w-0"
          />
        )}
      </form>
    </div>
  );
}
