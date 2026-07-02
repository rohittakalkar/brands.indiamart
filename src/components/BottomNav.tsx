'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, GitCompare, Heart, FileText, Building2 } from 'lucide-react';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';

export default function BottomNav() {
  const pathname = usePathname();
  const { shortlistedBrands, shortlistedProducts, shortlistedCategories } = useShortlist();
  const { leadsCount } = useBuyLeadModal();

  const shortlistedTotalCount = shortlistedBrands.length + shortlistedProducts.length + shortlistedCategories.length;

  if (pathname === '/leads/success') return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="h-[52px] bg-white border-t border-slate-200 grid grid-cols-6 select-none shrink-0 z-20">
      {/* 1. Home */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-0.5 transition w-full ${
          isActive('/') ? 'text-[#028384] font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[8px] font-black tracking-tighter uppercase">Home</span>
      </Link>

      {/* 2. Categories */}
      <Link
        href="/categories"
        className={`flex flex-col items-center justify-center gap-0.5 transition w-full ${
          isActive('/categories') ? 'text-[#028384] font-black' : 'text-slate-400 hover:text-slate-600'
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
              ? 'bg-[#2563eb] border-[#2563eb] text-white'
              : 'bg-[#3b82f6] border-[#3b82f6] text-white hover:bg-[#1d4ed8]'
          }`}
          title="Compare Industrial Suppliers side-by-side"
        >
          <GitCompare className="w-4.5 h-4.5 animate-bounce-slow" />
        </Link>
        <span className="absolute bottom-[-13px] text-[8px] text-slate-500 font-extrabold tracking-tighter uppercase">Compare</span>
      </div>

      {/* 4. Shortlist */}
      <Link
        href="/shortlist"
        className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
          isActive('/shortlist') ? 'text-[#028384] font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Heart className={`w-4 h-4 ${isActive('/shortlist') ? 'fill-rose-500 text-rose-500' : ''}`} />
        <span className="text-[8px] font-black tracking-tighter uppercase">Shortlist</span>
        {shortlistedTotalCount > 0 && (
          <span className="absolute top-1 right-1.5 bg-[#2563eb] text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90 ring-1 ring-white">
            {shortlistedTotalCount}
          </span>
        )}
      </Link>

      {/* 5. Brands */}
      <Link
        href="/brands"
        className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
          isActive('/brands') ? 'text-[#028384] font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span className="text-[8px] font-black tracking-tighter uppercase">Brands</span>
      </Link>

      {/* 6. Leads */}
      <Link
        href="/leads"
        className={`flex flex-col items-center justify-center gap-0.5 transition relative w-full ${
          isActive('/leads') ? 'text-[#028384] font-black' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span className="text-[8px] font-black tracking-tighter uppercase">Leads</span>
        {leadsCount > 0 && (
          <span className="absolute top-1 right-2 bg-slate-400 text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90 ring-1 ring-white">
            {leadsCount}
          </span>
        )}
      </Link>
    </nav>
  );
}
