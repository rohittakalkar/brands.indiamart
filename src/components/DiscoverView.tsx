'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Search, ChevronRight, ChevronDown, Send, Phone, Clock, Package, BookOpen, TrendingUp, ShoppingBag, Layers, Award, Flame, ShieldCheck } from 'lucide-react';
import { Brand, Product } from '../types';
import { Category } from '../services/categories';
import type { CategoryFomoSummary, CatalogStats } from '../lib/data';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';
import { TrustBadge, TrustBadgeType } from './TrustBadge';
import { AnimatedIcon } from './AnimatedIcon';
import { ThemeToggle } from './ThemeToggle';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import { useSearchHistory } from './SearchHistoryProvider';
import { useQuoteBasket } from './QuoteBasketProvider';
import { buildRfqRequirement } from '../lib/rfq';
import { getMaskedConnectNumber } from '../lib/connect';

interface DiscoverViewProps {
  brands: Brand[];
  products: Product[];
  categories: Category[];
  categoryFomo: CategoryFomoSummary[];
  catalogStats: CatalogStats;
}

const BADGE_TYPES: TrustBadgeType[] = ['verified-supplier', 'authorized-dealer', 'manufacturer-oem', 'certified-product'];

const BUYING_GUIDES = [
  { title: 'How to Choose the Right Pump for Your Application', tag: 'Guide' },
  { title: 'Understanding IndiaMART Trust Badges', tag: 'Guide' },
  { title: 'Diesel Generator Sizing Checklist', tag: 'Guide' }
];

// Guided discovery for buyers who know their problem, not the product-category vocabulary
// to search for it — maps a plain-language situation to the real category that solves it.
const PROBLEM_SOLUTIONS: { problem: string; mcatId: string }[] = [
  { problem: 'My factory floor gets too hot for workers or equipment', mcatId: 'water-coolers-chillers' },
  { problem: 'I need backup power during outages', mcatId: 'diesel-generators' },
  { problem: "My compressed air system isn't keeping up with demand", mcatId: 'air-compressors' },
  { problem: 'I need to automate or control a production line', mcatId: 'plc-drives' },
  { problem: 'I need to move water from a borewell or tank', mcatId: 'industrial-pumps' },
  { problem: 'My electrical panel needs an upgrade or better protection', mcatId: 'switchgear' },
  { problem: 'I need to control flow or pressure in a pipeline', mcatId: 'industrial-valves' },
  { problem: 'My motors draw too much power or run hot', mcatId: 'induction-motors' },
  { problem: 'I want to cut electricity costs with renewable power', mcatId: 'solar-equipment' },
  { problem: 'I need precise on-site measurements', mcatId: 'measuring-instruments' }
];

export default function DiscoverView({ brands, products, categories, categoryFomo, catalogStats }: DiscoverViewProps) {
  const router = useRouter();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const { items: basketItems } = useQuoteBasket();
  const basketCount = basketItems.length;
  const { recentlyViewed } = useRecentlyViewed();
  const { searchHistory } = useSearchHistory();

  // Tapping the search bar opens the dedicated search screen (recently-viewed +
  // recommendations, live suggestions as you type) rather than expanding a dropdown in
  // place — matching a "search is its own place" pattern instead of an inline overlay.
  const goToSearch = () => router.push('/search');

  const [trustBrandsOpen, setTrustBrandsOpen] = useState(false);

  const heroBrands = [...brands].sort((a, b) => b.rating - a.rating).slice(0, 10);

  // Data for the hero's combined stats+trust marquee — kept as plain data so the chip
  // row can be rendered twice back-to-back (an identical second copy is what makes a
  // leftward-scrolling loop read as seamless instead of snapping at the end).
  const heroStatChips: { icon: React.ElementType; value: number; label: string }[] = [
    { icon: Layers, value: catalogStats.totalCategories, label: 'Categories' },
    { icon: Award, value: catalogStats.totalBrands, label: 'Brands' },
    { icon: Package, value: catalogStats.totalProducts, label: 'Models' }
  ];
  const heroTrustLabels = ['Verified Suppliers', 'OEM-Certified', 'Authorized Dealers'];

  const renderHeroChips = (keyPrefix: string) => (
    <React.Fragment key={keyPrefix}>
      {heroStatChips.map((chip) => (
        <div key={`${keyPrefix}-${chip.label}`} className="flex items-center gap-1 bg-white/10 border border-white/15 rounded-full pl-2 pr-2.5 py-1 shrink-0">
          <chip.icon className="w-3 h-3 text-cta shrink-0" />
          <span className="font-mono font-bold text-white text-[11px] tabular-nums">{chip.value}</span>
          <span className="text-white/60 text-[8px] font-bold uppercase tracking-wide">{chip.label}</span>
        </div>
      ))}
      <span key={`${keyPrefix}-divider`} className="w-px h-3.5 bg-white/20 shrink-0" />
      {heroTrustLabels.map((label) => (
        <div key={`${keyPrefix}-${label}`} className="flex items-center gap-1 bg-white/10 border border-white/15 rounded-full pl-2 pr-2.5 py-1 shrink-0">
          <ShieldCheck className="w-3 h-3 text-accent-green shrink-0" />
          <span className="text-white/80 text-[8px] font-bold uppercase tracking-wide">{label}</span>
        </div>
      ))}
      <span key={`${keyPrefix}-gap`} className="w-3 shrink-0" />
    </React.Fragment>
  );

  const recentItems = recentlyViewed
    .slice(0, 4)
    .map(entry => {
      if (entry.type === 'product') {
        const product = products.find(p => p.id === entry.id);
        return product ? { href: `/products/${product.id}`, name: product.name, sub: product.brandName, image: product.image } : null;
      }
      if (entry.type === 'brand') {
        const brand = brands.find(b => b.id === entry.id);
        return brand ? { href: `/brands/${brand.id}`, name: brand.name, sub: brand.businessType, logo: brand.logo } : null;
      }
      const cat = categories.find(c => c.id === entry.id);
      return cat ? { href: `/categories/${cat.id}`, name: cat.name, sub: 'Category', icon: cat.icon } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const popularBrands = [...brands].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const trendingCategories = categories.slice(0, 5);
  const featuredProducts = products.slice(0, 8);

  // Resolve each problem statement against the real catalog, so a stale mapping never
  // silently links to a category that doesn't exist.
  const resolvedProblems = PROBLEM_SOLUTIONS
    .map(p => ({ ...p, category: categories.find(c => c.id === p.mcatId) }))
    .filter((p): p is typeof p & { category: Category } => !!p.category);

  // Reorders (never filters — every card stays reachable) guided-discovery cards toward
  // whatever the buyer has actually searched for, using real search-query tokens rather
  // than an invented ranking. Ties keep the original curated order (Array.sort is stable),
  // so a buyer with no search history yet sees exactly today's order, unchanged.
  const searchTokens = searchHistory.flatMap(q => q.toLowerCase().split(/\s+/)).filter(t => t.length > 2);
  const scoredProblems = searchTokens.length === 0
    ? resolvedProblems
    : [...resolvedProblems].sort((a, b) => {
        const text = (p: typeof a) => `${p.problem} ${p.category.name}`.toLowerCase();
        const score = (p: typeof a) => searchTokens.filter(t => text(p).includes(t)).length;
        return score(b) - score(a);
      });

  return (
    <div className="flex-1 bg-canvas overflow-y-auto select-none font-sans text-slate-800 dark:text-slate-200 relative">

      {/* Mobile-only compact header (desktop uses DesktopNav) */}
      <div className="md:hidden bg-surface border-b border-line px-4 py-2.5 flex items-center justify-between shrink-0">
        <img src="/indiamart-logo.png" alt="IndiaMART" className="h-8 w-auto select-none" />
        <div className="flex items-center gap-1">
          <ThemeToggle className="text-slate-500 dark:text-slate-400 hover:bg-canvas" />
          <Link href="/quote-basket" className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-heading transition" title="Quote Basket">
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

      {/* Hero — deliberately compact (roughly half the fold on mobile): headline, one
          inline stats+trust row, one inline search bar, one scrollable row of brand logos,
          and a collapsed trust-detail accordion. Category exploration and browsing now
          live in the normal-density body below instead of inside the tinted hero band. */}
      <div className="bg-gradient-to-b from-primary to-secondary px-4 md:px-8 pt-6 md:pt-10 pb-4 md:pb-6 relative">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="font-heading font-extrabold text-white text-lg md:text-2xl tracking-tight">
            Verified brands. One search.
          </h1>

          {/* Catalog scale + trust signals combined into one inline row — real computed
              numbers sitting directly beside the trust claims they back, rather than two
              separate rows competing for hero height. Auto-scrolls continuously to the
              left (a looping marquee, not a manual-swipe rail) so every chip is seen
              without requiring a swipe; the track is the chip set rendered twice
              back-to-back, animated exactly -50% so the loop point is invisible. */}
          <div className="mt-3 overflow-hidden -mx-4 md:mx-0">
            <motion.div
              className="flex items-center gap-1.5 w-fit"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              {renderHeroChips('a')}
              {renderHeroChips('b')}
            </motion.div>
          </div>

          {/* Tapping this opens the dedicated search screen — no local dropdown, no
              separate submit button; the whole element is the one tap target. */}
          <motion.button
            type="button"
            onClick={goToSearch}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative mt-3.5 w-full flex items-center bg-white text-left rounded-xl overflow-hidden pl-10 pr-4 py-3"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(255,106,26,0.35), 0 8px 24px rgba(0,0,0,0.15)',
                '0 0 0 6px rgba(255,106,26,0), 0 8px 24px rgba(0,0,0,0.15)',
                '0 0 0 0 rgba(255,106,26,0.35), 0 8px 24px rgba(0,0,0,0.15)'
              ]
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <span className="text-slate-400 text-xs md:text-sm font-semibold truncate">Search by product, brand, model or specification</span>
          </motion.button>

          {/* Trusted brand logos — staggered fade-in on load, then a continuous "chase"
              highlight sweeps through them one at a time, on loop, so the row keeps reading
              as alive rather than settling into a static row after the initial entrance. */}
          <motion.div
            className="flex items-center gap-2 mt-3.5 overflow-x-auto scrollbar-none pb-0.5 justify-start md:justify-center"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {heroBrands.map((brand, idx) => {
              const cycle = 3.2;
              const pulseDuration = 0.9;
              return (
                <motion.div
                  key={brand.id}
                  className="shrink-0"
                  variants={{ hidden: { opacity: 0, y: 6, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.16, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(255,106,26,0)',
                        '0 0 0 5px rgba(255,106,26,0.45)',
                        '0 0 0 0 rgba(255,106,26,0)'
                      ]
                    }}
                    transition={{
                      duration: pulseDuration,
                      delay: 0.6 + idx * (cycle / heroBrands.length),
                      repeat: Infinity,
                      repeatDelay: cycle - pulseDuration,
                      ease: 'easeInOut'
                    }}
                    className="rounded-lg"
                  >
                    <Link
                      href={`/brands/${brand.id}`}
                      title={brand.name}
                      className="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1.5 shadow-sm hover:scale-105 transition"
                    >
                      <BrandLogo logo={brand.logo} name={brand.name} />
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Why Trust Brands — lives in the hero now, directly below the brand logos;
              collapsed by default so it costs nothing toward hero height until opened. */}
          <div className="mt-3.5 text-left">
            <button
              type="button"
              onClick={() => setTrustBrandsOpen(prev => !prev)}
              className="w-full flex items-center justify-between bg-white/10 border border-white/15 rounded-xl px-3 py-2"
              aria-expanded={trustBrandsOpen}
            >
              <span className="text-white text-[11px] font-bold">Why Trust Brands</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${trustBrandsOpen ? 'rotate-180' : ''}`} />
            </button>
            {trustBrandsOpen && (
              <div className="mt-2 bg-white rounded-xl p-3 space-y-2.5">
                <p className="text-[10px] text-slate-500">Every listing shows exactly what's been verified — who verified it, and when.</p>
                <div className="grid grid-cols-1 gap-2">
                  {BADGE_TYPES.map((type) => (
                    <div key={type} className="bg-canvas border border-line rounded-lg p-2.5">
                      <TrustBadge type={type} who="IndiaMART" detail />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 space-y-5">
        {/* Category × Brand rail — real brand density per category, moved out of the hero
            band into normal body flow (shorter label, no longer competing for hero height);
            an honest "Standard Catalog" tag covers categories with no curated brands yet. */}
        <section>
          <div className="flex items-center gap-1.5 mb-2.5">
            <AnimatedIcon icon={Flame} variant="flicker" className="w-3.5 h-3.5 text-cta shrink-0" />
            <h2 className="font-heading font-bold text-sm text-heading">Buyers Are Exploring</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {categoryFomo.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="shrink-0 w-[136px] bg-surface border border-line rounded-xl p-2.5 hover:border-accent-blue/40 transition"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-accent-blue/10 rounded-md flex items-center justify-center text-accent-blue shrink-0">
                    <CategoryIcon icon={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2">{cat.name}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-line">
                  {cat.brandCount > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2">
                        {cat.topBrands.map((b) => (
                          <div key={b.id} className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 ring-2 ring-white border border-line overflow-hidden flex items-center justify-center shrink-0">
                            <BrandLogo logo={b.logo} name={b.name} className="w-full h-full object-contain p-0.5" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[8.5px] font-black text-accent-green tabular-nums">{cat.brandCount} Brand{cat.brandCount !== 1 ? 's' : ''}</span>
                    </div>
                  ) : (
                    <span className="text-[8.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide">Standard Catalog</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Viewed — surfaced first, directly under the search bar, so a buyer who
            searched a specific product, opened its PDP, then bounced back to Home doesn't
            have to scroll past four other sections to pick up where they left off. Omitted
            entirely (not even an empty-state placeholder) for first-time visitors with
            nothing to resume — there's nothing useful to say to them at the very top of
            the page before they've started browsing. */}
        {recentItems.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-sm text-heading mb-2 flex items-center gap-1.5">
              <AnimatedIcon icon={Clock} variant="tick" className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 gap-2.5">
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
                    ) : 'icon' in item && item.icon ? (
                      <CategoryIcon icon={item.icon} className="w-4 h-4 text-accent-blue" />
                    ) : (
                      <Package className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                  <span className="text-[9.5px] font-bold text-slate-700 dark:text-slate-300 truncate leading-tight">{item.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Not Sure What You Need — guided discovery for buyers who know their problem,
            not the product-category vocabulary to search for it */}
        {scoredProblems.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-sm text-heading mb-2">Not Sure What You Need?</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
              {scoredProblems.map((p) => (
                <Link
                  key={p.mcatId}
                  href={`/categories/${p.mcatId}`}
                  className="shrink-0 w-[176px] bg-surface border border-line rounded-xl p-3 flex flex-col gap-2 hover:border-accent-blue/40 transition"
                >
                  <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-snug line-clamp-3">&ldquo;{p.problem}&rdquo;</p>
                  <span className="text-[9px] font-black text-accent-blue uppercase tracking-wide flex items-center gap-1 mt-auto">
                    <CategoryIcon icon={p.category.icon} className="w-3 h-3" />
                    {p.category.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Browse Categories */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading font-bold text-sm text-heading">Browse Categories</h2>
            <Link href="/categories" className="text-[10px] font-bold text-accent-blue hover:text-heading transition">View All</Link>
          </div>
          <div className="grid grid-cols-2 min-[420px]:grid-cols-3 md:grid-cols-5 gap-2.5">
            {categories.slice(0, 9).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="bg-surface border border-line rounded-xl p-3 flex flex-col items-center gap-1.5 text-center hover:border-accent-blue/40 transition"
              >
                <div className="w-8 h-8 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue">
                  <CategoryIcon icon={cat.icon} className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 leading-tight line-clamp-2">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* One Primary CTA — compact chip, not a full banner */}
        <div className="flex justify-center">
          <button
            onClick={() => openBuyLeadForm({})}
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary rounded-full pl-3 pr-3.5 py-2 text-white shadow-sm transition cursor-pointer"
          >
            <Send className="w-3 h-3 text-cta shrink-0" />
            <span className="font-heading font-bold text-[10.5px] tracking-tight whitespace-nowrap">Get Quotes From Verified Sellers</span>
            <ChevronRight className="w-3 h-3 text-white/70 shrink-0" />
          </button>
        </div>

        {/* Trending Categories */}
        <section>
          <h2 className="font-heading font-bold text-sm text-heading mb-2 flex items-center gap-1.5">
            <AnimatedIcon icon={TrendingUp} variant="bounce" className="w-4 h-4 text-accent-green" />
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading font-bold text-sm text-heading">Popular Brands</h2>
            <Link href="/brands" className="text-[10px] font-bold text-accent-blue hover:text-heading transition">View All</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {popularBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.id}`}
                className="bg-surface border border-line rounded-xl p-3 w-[110px] shrink-0 flex flex-col items-center gap-2 hover:border-accent-blue/40 transition"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-line rounded-lg flex items-center justify-center overflow-hidden p-1.5">
                  <BrandLogo logo={brand.logo} name={brand.name} />
                </div>
                <span className="text-[9.5px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight line-clamp-2">{brand.name.split(' ').slice(0, 2).join(' ')}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Models — a horizontally-scrolling 2-row grid (grid-auto-flow: column)
            rather than a vertically-stacked list; card width is tuned so ~1.5 columns show
            by default, an explicit hint that more is reachable with a swipe. */}
        <section>
          <h2 className="font-heading font-bold text-sm text-heading mb-2">Featured Models</h2>
          <div
            className="grid grid-flow-col grid-rows-2 gap-3 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0"
            style={{ gridAutoColumns: 'minmax(200px, 66%)' }}
          >
            {featuredProducts.map((prod) => {
              const maskedNumber = getMaskedConnectNumber(prod.id);
              const telHref = `tel:${maskedNumber.replace(/\s+/g, '')}`;
              return (
                <Link
                  key={prod.id}
                  href={`/products/${prod.id}`}
                  className="bg-surface border border-line rounded-2xl flex flex-col overflow-hidden hover:border-accent-blue/40 transition shadow-xs"
                >
                  <div className="h-28 bg-canvas border-b border-line shrink-0">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="flex-1 p-3 min-w-0 flex flex-col">
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase truncate">{prod.brandName.split(' ')[0]}</p>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-slate-50 line-clamp-2 leading-snug mt-0.5">{prod.name}</p>
                    <p className="text-[11px] font-black text-heading mt-1.5">
                      {prod.priceRange.split(' - ')[0]}
                      {prod.priceRange.includes(' - ') && <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500"> onwards</span>}
                    </p>
                    <div className="mt-2.5 flex gap-1.5">
                      {/* A <button>, not a nested <a> — an anchor can't validly contain
                          another anchor, which caused a hydration mismatch when this was
                          `<a href={telHref}>`; navigating via location.href on click reaches
                          the same tel: link without the invalid nesting. */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = telHref;
                        }}
                        className="px-2.5 py-1.5 border border-cta text-cta hover:bg-accent-blue/10 rounded-lg text-[9.5px] font-bold flex items-center justify-center gap-1 transition shrink-0"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openBuyLeadForm({
                            productName: `${prod.name} (${prod.modelNumber})`,
                            brandName: prod.brandName,
                            requirement: buildRfqRequirement(prod)
                          });
                        }}
                        className="flex-1 min-w-0 py-1.5 bg-cta hover:bg-cta-hover text-white rounded-lg text-[9.5px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Send className="w-3 h-3" />
                        Get Best Price
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Buying Guides */}
        <section className="pb-4">
          <h2 className="font-heading font-bold text-sm text-heading mb-2 flex items-center gap-1.5">
            <AnimatedIcon icon={BookOpen} variant="flip" className="w-4 h-4 text-accent-purple" />
            Buying Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {BUYING_GUIDES.map((guide, idx) => (
              <div key={idx} className="bg-surface border border-line rounded-xl p-3.5">
                <span className="text-[8.5px] font-black text-accent-purple uppercase tracking-wider bg-accent-purple/10 px-1.5 py-0.5 rounded">{guide.tag}</span>
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-2 leading-snug">{guide.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
