'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Search, ChevronRight, Send, Clock, Package, BookOpen, TrendingUp, ShoppingBag, Layers, Award, Flame } from 'lucide-react';
import { Brand, Product } from '../types';
import { Category } from '../services/categories';
import type { CategoryFomoSummary, CatalogStats } from '../lib/data';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';
import { TrustBadge, TrustBadgeType } from './TrustBadge';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import { useQuoteBasket } from './QuoteBasketProvider';

interface DiscoverViewProps {
  brands: Brand[];
  products: Product[];
  categories: Category[];
  categoryFomo: CategoryFomoSummary[];
  catalogStats: CatalogStats;
}

const RECENT_SEARCHES = [
  { name: 'Kirloskar 62.5 kVA Diesel Generator', search: 'Kirloskar 62.5 kVA' },
  { name: 'Voltas Water Cooler 40/80 PSS', search: 'Voltas Water Cooler' },
  { name: 'Atlas Copco Compressors GA 30 VSD', search: 'Atlas Copco Air Compressors' },
  { name: 'Siemens SIMATIC S7-1200 PLC', search: 'Siemens PLC' }
];

const BADGE_TYPES: TrustBadgeType[] = ['verified-supplier', 'authorized-dealer', 'manufacturer-oem', 'certified-product'];

const BUYING_GUIDES = [
  { title: 'How to Choose the Right Pump for Your Application', tag: 'Guide' },
  { title: 'Understanding IndiaMART Trust Badges', tag: 'Guide' },
  { title: 'Diesel Generator Sizing Checklist', tag: 'Guide' }
];

export default function DiscoverView({ brands, products, categories, categoryFomo, catalogStats }: DiscoverViewProps) {
  const router = useRouter();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const { items: basketItems } = useQuoteBasket();
  const basketCount = basketItems.length;
  const { recentlyViewed } = useRecentlyViewed();

  const [localSearch, setLocalSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const runSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchFocused(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(localSearch);
  };

  const recentItems = recentlyViewed
    .slice(0, 4)
    .map(entry => {
      if (entry.type === 'product') {
        const product = products.find(p => p.id === entry.id);
        return product ? { href: `/products/${product.id}`, name: product.name, sub: product.brandName, image: product.image } : null;
      }
      const brand = brands.find(b => b.id === entry.id);
      return brand ? { href: `/brands/${brand.id}`, name: brand.name, sub: brand.businessType, logo: brand.logo } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const popularBrands = [...brands].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const trendingCategories = categories.slice(0, 5);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex-1 bg-canvas overflow-y-auto select-none font-sans text-slate-800 relative">

      {/* Mobile-only compact header (desktop uses DesktopNav) */}
      <div className="md:hidden bg-surface border-b border-line px-4 py-2.5 flex items-center justify-between shrink-0">
        <img src="/indiamart-logo.png" alt="IndiaMART" className="h-8 w-auto select-none" />
        <div className="flex items-center gap-1">
          <Link href="/quote-basket" className="relative p-1.5 text-slate-500 hover:text-primary transition" title="Quote Basket">
            <ShoppingBag className="w-4.5 h-4.5" />
            {basketCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-cta text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-white">
                {basketCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-black shadow-sm ring-2 ring-line hover:scale-105 transition"
            title="Rohit Takalkar"
          >
            RT
          </Link>
        </div>
      </div>

      {/* Hero Search */}
      <div className="bg-gradient-to-b from-primary to-secondary px-4 md:px-8 pt-8 md:pt-14 pb-6 md:pb-9 relative">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="font-heading font-extrabold text-white text-xl md:text-3xl tracking-tight">
            Shop by category, backed by trusted brands
          </h1>
          <p className="text-white/70 text-[11px] md:text-sm mt-2">
            {catalogStats.brandedCategoryCount} branded categories with verified sellers, plus {catalogStats.standardCategoryCount} standard product categories — all in one place
          </p>

          {/* Real, computed catalog stats — not fabricated urgency counters */}
          <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-3.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full pl-2 pr-2.5 py-1">
              <Layers className="w-3 h-3 text-cta shrink-0" />
              <span className="font-mono font-bold text-white text-[11px] tabular-nums">{catalogStats.brandedCategoryCount}</span>
              <span className="text-white/60 text-[8.5px] font-bold uppercase tracking-wide">Branded Categories</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full pl-2 pr-2.5 py-1">
              <Award className="w-3 h-3 text-cta shrink-0" />
              <span className="font-mono font-bold text-white text-[11px] tabular-nums">{catalogStats.totalBrands}</span>
              <span className="text-white/60 text-[8.5px] font-bold uppercase tracking-wide">Trusted Brands</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full pl-2 pr-2.5 py-1">
              <Package className="w-3 h-3 text-cta shrink-0" />
              <span className="font-mono font-bold text-white text-[11px] tabular-nums">{catalogStats.standardCategoryCount}</span>
              <span className="text-white/60 text-[8.5px] font-bold uppercase tracking-wide">Standard Categories</span>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative mt-4 md:mt-5">
            <motion.div
              className="flex items-center w-full rounded-xl overflow-hidden"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(255,106,26,0.35), 0 8px 24px rgba(0,0,0,0.15)',
                  '0 0 0 6px rgba(255,106,26,0), 0 8px 24px rgba(0,0,0,0.15)',
                  '0 0 0 0 rgba(255,106,26,0.35), 0 8px 24px rgba(0,0,0,0.15)'
                ]
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={localSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search by product, brand, model or specification"
                  className="w-full bg-white text-slate-800 pl-10 pr-7 py-3.5 text-xs md:text-sm outline-none placeholder-slate-400 font-semibold"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => setLocalSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-extrabold text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-cta hover:bg-cta-hover text-white px-5 py-3.5 flex items-center justify-center transition-colors font-bold text-xs md:text-sm shrink-0"
              >
                Search
              </motion.button>
            </motion.div>

            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-line rounded-xl shadow-xl z-40 overflow-hidden text-left">
                <div className="px-3 py-2 border-b border-line">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Recent Sourcing Searches</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {RECENT_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onMouseDown={() => runSearch(item.search)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-canvas transition text-left border-b border-line last:border-b-0"
                    >
                      <span className="text-[11px] font-semibold text-slate-700 truncate">{item.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </motion.div>

        {/* Category × Brand FOMO rail — real brand density per category, and an
            honest "Standard Catalog" tag for categories with no curated brands yet */}
        <motion.div
          className="max-w-5xl mx-auto mt-5 md:mt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-1.5 px-0.5 mb-2">
            <Flame className="w-3.5 h-3.5 text-cta shrink-0" />
            <span className="text-white/80 text-[9.5px] md:text-[10px] font-black uppercase tracking-wider">
              Categories buyers are exploring — with their trusted brands
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {categoryFomo.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="shrink-0 w-[136px] bg-white rounded-xl p-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-accent-blue/10 rounded-md flex items-center justify-center text-accent-blue shrink-0">
                    <CategoryIcon icon={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9.5px] font-bold text-slate-800 leading-tight line-clamp-2">{cat.name}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-line">
                  {cat.brandCount > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2">
                        {cat.topBrands.map((b) => (
                          <div key={b.id} className="w-5 h-5 rounded-full bg-white ring-2 ring-white border border-line overflow-hidden flex items-center justify-center shrink-0">
                            <BrandLogo logo={b.logo} name={b.name} className="w-full h-full object-contain p-0.5" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[8.5px] font-black text-accent-green tabular-nums">{cat.brandCount} Brand{cat.brandCount !== 1 ? 's' : ''}</span>
                    </div>
                  ) : (
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wide">Standard Catalog</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-9">
        {/* One Primary CTA */}
        <button
          onClick={() => openBuyLeadForm({})}
          className="w-full bg-primary hover:bg-secondary rounded-2xl p-4 md:p-5 text-white flex items-center justify-between gap-4 cursor-pointer shadow-sm transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-heading font-bold text-xs md:text-sm tracking-tight">Get quotes from verified sellers</h3>
              <p className="text-[9.5px] md:text-[11px] text-white/70 mt-0.5 font-medium leading-tight">Send your requirement, receive competitive quotes directly.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white shrink-0" />
        </button>

        {/* Browse Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-sm text-primary">Browse Categories</h2>
            <Link href="/categories" className="text-[10px] font-bold text-accent-blue hover:text-primary transition">View All</Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5">
            {categories.slice(0, 9).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="bg-surface border border-line rounded-xl p-3 flex flex-col items-center gap-1.5 text-center hover:border-accent-blue/40 transition"
              >
                <div className="w-8 h-8 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue">
                  <CategoryIcon icon={cat.icon} className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-slate-700 leading-tight line-clamp-2">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Categories */}
        <section>
          <h2 className="font-heading font-bold text-sm text-primary mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-accent-green" />
            Trending Categories
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {trendingCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-full px-3.5 py-2 text-[11px] font-bold whitespace-nowrap hover:bg-accent-green/15 transition shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Brands */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-sm text-primary">Popular Brands</h2>
            <Link href="/brands" className="text-[10px] font-bold text-accent-blue hover:text-primary transition">View All</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {popularBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.id}`}
                className="bg-surface border border-line rounded-xl p-3 w-[110px] shrink-0 flex flex-col items-center gap-2 hover:border-accent-blue/40 transition"
              >
                <div className="w-12 h-12 bg-white border border-line rounded-lg flex items-center justify-center overflow-hidden p-1.5">
                  <BrandLogo logo={brand.logo} name={brand.name} />
                </div>
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight line-clamp-2">{brand.name.split(' ').slice(0, 2).join(' ')}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Models */}
        <section>
          <h2 className="font-heading font-bold text-sm text-primary mb-3">Featured Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {featuredProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/products/${prod.id}`}
                className="bg-surface border border-line rounded-2xl flex overflow-hidden hover:border-accent-blue/40 transition shadow-xs"
              >
                <div className="w-24 bg-canvas border-r border-line flex items-center justify-center p-2 shrink-0">
                  <img src={prod.image} alt={prod.name} className="max-h-16 max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <div className="flex-1 p-3 min-w-0">
                  <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{prod.brandName.split(' ')[0]}</p>
                  <p className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-snug mt-0.5">{prod.name}</p>
                  <p className="text-[11px] font-black text-primary mt-1.5">{prod.priceRange.split(' - ')[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Trust Brands */}
        <section>
          <h2 className="font-heading font-bold text-sm text-primary mb-1">Why Trust Brands</h2>
          <p className="text-[11px] text-slate-500 mb-3">Every listing shows exactly what's been verified — who verified it, and when.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {BADGE_TYPES.map((type) => (
              <div key={type} className="bg-surface border border-line rounded-xl p-3">
                <TrustBadge type={type} who="IndiaMART" detail />
              </div>
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        <section>
          <h2 className="font-heading font-bold text-sm text-primary mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            Recently Viewed
          </h2>
          {recentItems.length === 0 ? (
            <div className="bg-surface border border-line rounded-2xl p-5 text-center text-slate-400 text-[11px]">
              Nothing viewed yet.{' '}
              <Link href="/categories" className="text-accent-blue font-bold hover:underline">Start browsing</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {recentItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="bg-surface border border-line rounded-xl p-2.5 flex items-center gap-2 hover:border-accent-blue/40 transition"
                >
                  <div className="w-8 h-8 rounded-md bg-canvas border border-line overflow-hidden flex items-center justify-center shrink-0 p-1">
                    {'logo' in item && item.logo ? (
                      <BrandLogo logo={item.logo} name={item.name} />
                    ) : 'image' in item && item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                    ) : (
                      <Package className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </div>
                  <span className="text-[9.5px] font-bold text-slate-700 truncate leading-tight">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Buying Guides */}
        <section className="pb-4">
          <h2 className="font-heading font-bold text-sm text-primary mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-accent-purple" />
            Buying Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {BUYING_GUIDES.map((guide, idx) => (
              <div key={idx} className="bg-surface border border-line rounded-xl p-3.5">
                <span className="text-[8.5px] font-black text-accent-purple uppercase tracking-wider bg-accent-purple/10 px-1.5 py-0.5 rounded">{guide.tag}</span>
                <p className="text-[11px] font-bold text-slate-800 mt-2 leading-snug">{guide.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
