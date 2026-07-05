'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, GitCompare, Heart, FileText, Building2 } from 'lucide-react';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useScrollChrome } from './ScrollChromeProvider';

export default function BottomNav() {
  const pathname = usePathname();
  const { shortlistedBrands, shortlistedProducts, shortlistedCategories } = useShortlist();
  const { leadsCount } = useBuyLeadModal();
  const { navVisible } = useScrollChrome();

  const shortlistedTotalCount = shortlistedBrands.length + shortlistedProducts.length + shortlistedCategories.length;

  // The Product page has its own persistent, more specific action bar (Call/WhatsApp/Get
  // Quotes) fixed to the same bottom edge — running both at once meant two competing
  // fixed bars stacked on top of each other for no real navigational benefit there.
  if (pathname === '/leads/success' || pathname.startsWith('/products/')) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-line grid grid-cols-6 select-none shrink-0 z-30 ${
        navVisible ? 'translate-y-0 chrome-reveal' : 'translate-y-full chrome-hide'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', minHeight: 'calc(56px + env(safe-area-inset-bottom))' }}
    >
      {/* 1. Home */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-0.5 transition w-full ${
          isActive('/') ? 'text-accent-blue font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[8px] font-black tracking-tighter uppercase">Home</span>
      </Link>

      {/* 2. Categories */}
      <Link
        href="/categories"
        className={`flex flex-col items-center justify-center gap-0.5 transition w-full ${
          isActive('/categories') ? 'text-accent-blue font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span className="text-[8px] font-black tracking-tighter uppercase">Categories</span>
      </Link>

      {/* 3. Compare (PRIME FEATURE IN THE CENTER!) */}
      <div className="relative flex items-center justify-center -mt-3.5 w-full">
        <Link
          href="/compare"
          className={`flex flex-col items-center justify-center w-11 h-11 rounded-full border-2 transition shadow-md ${
            isActive('/compare')
              ? 'bg-primary border-primary text-white'
              : 'bg-secondary border-secondary text-white hover:bg-primary'
          }`}
          title="Compare brands, models and verified sellers side-by-side"
        >
          <GitCompare className="w-4.5 h-4.5" />
        </Link>
        <span className="absolute bottom-[-13px] text-[8px] text-slate-500 font-extrabold tracking-tighter uppercase">Compare</span>
      </div>

      {/* 4. Shortlist */}
      <Link
        href="/shortlist"
        className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
          isActive('/shortlist') ? 'text-accent-blue font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Heart className={`w-4 h-4 ${isActive('/shortlist') ? 'fill-rose-500 text-rose-500' : ''}`} />
        <span className="text-[8px] font-black tracking-tighter uppercase">Shortlist</span>
        {shortlistedTotalCount > 0 && (
          <span className="absolute top-1 right-1.5 bg-cta text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90 ring-1 ring-white">
            {shortlistedTotalCount}
          </span>
        )}
      </Link>

      {/* 5. Brands */}
      <Link
        href="/brands"
        className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
          isActive('/brands') ? 'text-accent-blue font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span className="text-[8px] font-black tracking-tighter uppercase">Brands</span>
      </Link>

      {/* 6. Leads */}
      <Link
        href="/leads"
        className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
          isActive('/leads') ? 'text-accent-blue font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span className="text-[8px] font-black tracking-tighter uppercase">Quotes</span>
        {leadsCount > 0 && (
          <span className="absolute top-1 right-2 bg-slate-400 text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90 ring-1 ring-white">
            {leadsCount}
          </span>
        )}
      </Link>
    </nav>
  );
}
