'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Layers, Building2, GitCompare, Heart, FileText, Send, ShoppingBag, User } from 'lucide-react';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useQuoteBasket } from './QuoteBasketProvider';
import { useSearchHistory } from './SearchHistoryProvider';

const NAV_LINKS = [
  { href: '/categories', label: 'Categories', icon: Layers },
  { href: '/brands', label: 'Brands', icon: Building2 },
  { href: '/compare', label: 'Compare', icon: GitCompare },
];

export default function DesktopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { shortlistedBrands, shortlistedProducts, shortlistedCategories } = useShortlist();
  const { leadsCount, open: openBuyLeadForm } = useBuyLeadModal();
  const { items: basketItems } = useQuoteBasket();
  const { trackSearch } = useSearchHistory();
  const [query, setQuery] = useState('');

  const shortlistedTotalCount = shortlistedBrands.length + shortlistedProducts.length + shortlistedCategories.length;

  if (pathname === '/leads/success') return null;

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      trackSearch(query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="hidden md:flex sticky top-0 z-30 bg-primary text-white shadow-sm">
      <div className="mx-auto w-full max-w-7xl px-6 h-16 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-heading font-extrabold text-lg tracking-tight text-white">Brands</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">by IndiaMART</span>
        </Link>

        <nav className="flex items-center gap-1 shrink-0">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition ${
                isActive(href) ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, brand, model or specification"
              className="w-full bg-white text-slate-800 rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none placeholder-slate-400 font-medium"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/shortlist"
            className={`relative p-2 rounded-lg transition ${isActive('/shortlist') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            title="Shortlist"
          >
            <Heart className={`w-4.5 h-4.5 ${isActive('/shortlist') ? 'fill-rose-400 text-rose-400' : ''}`} />
            {shortlistedTotalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-cta text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-primary">
                {shortlistedTotalCount}
              </span>
            )}
          </Link>
          <Link
            href="/leads"
            className={`relative p-2 rounded-lg transition ${isActive('/leads') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            title="My Quote Requests"
          >
            <FileText className="w-4.5 h-4.5" />
            {leadsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-slate-300 text-primary text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-primary">
                {leadsCount}
              </span>
            )}
          </Link>
          <Link
            href="/quote-basket"
            className={`relative p-2 rounded-lg transition ${isActive('/quote-basket') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            title="Quote Basket"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {basketItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-cta text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-primary">
                {basketItems.length}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className={`p-2 rounded-lg transition ${isActive('/profile') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            title="My Profile"
          >
            <User className="w-4.5 h-4.5" />
          </Link>
          <button
            onClick={() => openBuyLeadForm({})}
            className="ml-2 flex items-center gap-1.5 bg-cta hover:bg-cta-hover text-white font-bold text-[13px] px-4 py-2 rounded-lg transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Get Quotes
          </button>
        </div>
      </div>
    </header>
  );
}
