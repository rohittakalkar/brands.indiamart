'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Send, BookOpen, HelpCircle, GitCompare, ShieldCheck, Search, Building2, ChevronRight, Check, TrendingUp, MessageSquare, ArrowRight } from 'lucide-react';
import { MCat, Brand, Product, Supplier, BrandMCat, Review } from '../types';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';
import { TrustBadge } from './TrustBadge';
import { AnimatedIcon } from './AnimatedIcon';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import { useSearchHistory } from './SearchHistoryProvider';
import { BackButton } from './BackButton';
import { Breadcrumb } from './Breadcrumb';
import { buildRfqRequirement } from '../lib/rfq';
import { scrollToSection } from '../lib/anchorScroll';

interface CategoryBrandsViewProps {
  category: MCat;
  industryName: string;
  brands: Brand[];
  products: Product[];
  suppliers: Supplier[];
  brandMCats: BrandMCat[];
  // Pooled across every brand in this category (reviews are stored per-brand, not
  // per-category) so buyer testimonials can appear here without a data-model change.
  reviews: Review[];
  // Sibling categories under the same parent industry (e.g. Laptops next to Mobile Phones).
  relatedCategories: MCat[];
  // Read from the URL by the page.tsx route on load, so a shared/reloaded filtered link
  // reproduces the same view instead of resetting to unfiltered.
  initialSelectedBrandIds?: string[];
  initialSpecValue?: string;
  initialPriceBucket?: number;
  initialCertification?: string;
}

function leadingPrice(priceRange: string): number {
  const match = priceRange.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

const MAX_COMPARE = 3;

export default function CategoryBrandsView({
  category, industryName, brands, products, suppliers, brandMCats, reviews, relatedCategories,
  initialSelectedBrandIds, initialSpecValue, initialPriceBucket, initialCertification
}: CategoryBrandsViewProps) {
  const router = useRouter();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const { trackView } = useRecentlyViewed();
  const { trackSearch } = useSearchHistory();

  // A category page is very often exactly where an ambiguous, category-shaped search
  // resolves to (e.g. "diesel generator", "pumps") — without this, that whole class of
  // search never registers in Recently Viewed, only the narrower exact-product/brand case did.
  useEffect(() => {
    trackView('category', category.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.id]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<string>>(new Set(initialSelectedBrandIds));
  const [selectedSpecValue, setSelectedSpecValue] = useState<string | null>(initialSpecValue ?? null);
  const [selectedPriceBucket, setSelectedPriceBucket] = useState<number | null>(
    initialPriceBucket !== undefined && !isNaN(initialPriceBucket) ? initialPriceBucket : null
  ); // bucket index
  const [selectedCertification, setSelectedCertification] = useState<string | null>(initialCertification ?? null);
  const hasActiveFilters = selectedBrandIds.size > 0 || !!selectedSpecValue || selectedPriceBucket !== null || !!selectedCertification;
  // Header search — replaces the floating MobileSearchBar on this page, moved inline with
  // the breadcrumb so it doesn't cost its own row of vertical space.
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  // Guide/FAQ collapsed by default — on a category with a full brand catalog, comparison
  // table, and top-models rail already on the page, two more always-expanded text blocks
  // pushed real content further down for no interaction in return; collapsed, they're still
  // one tap away instead of costing permanent scroll length.
  const [guideOpen, setGuideOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('brands-list');

  // Keeps the URL a live, shareable snapshot of the current filter selection — same
  // pattern as Compare's ?sellers=/?category= sync.
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrandIds.size > 0) params.set('brands', [...selectedBrandIds].join(','));
    if (selectedSpecValue) params.set('spec', selectedSpecValue);
    if (selectedPriceBucket !== null) params.set('price', String(selectedPriceBucket));
    if (selectedCertification) params.set('cert', selectedCertification);
    const qs = params.toString();
    router.replace(qs ? `/categories/${category.id}?${qs}` : `/categories/${category.id}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrandIds, selectedSpecValue, selectedPriceBucket, selectedCertification]);

  // Certifications genuinely vary by category/brand rather than following one universal
  // framework — surface whichever certifications the brands actually competing in this
  // category actually hold, not a fixed/invented list.
  const availableCertifications = useMemo(() => {
    const set = new Set<string>();
    brands.forEach(b => b.certifications.forEach(c => set.add(c)));
    return [...set].sort();
  }, [brands]);

  const certifiedBrandIds = useMemo(() => {
    if (!selectedCertification) return null;
    return new Set(brands.filter(b => b.certifications.includes(selectedCertification)).map(b => b.id));
  }, [brands, selectedCertification]);

  // Seller availability per brand, scoped to this MCat's products only
  const sellerCountByBrand = useMemo(() => {
    const map = new Map<string, number>();
    suppliers.forEach(s => map.set(s.brandId, (map.get(s.brandId) || 0) + 1));
    return map;
  }, [suppliers]);

  // One representative product image per brand for the brand card — a real photo reads
  // far better than a text/logo tile, and gives the buyer a concrete sense of what the
  // brand actually makes in this category. Kept off the unfiltered product list on purpose:
  // it's just illustrative art for a brand tile, not a claim about which exact model matched
  // an active filter, so there's no "wrong" image to show regardless of filter state.
  const brandImageByBrand = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => {
      if (!map.has(p.brandId)) map.set(p.brandId, p.image);
    });
    return map;
  }, [products]);

  // Popular capacity ranges — the shared "headline spec" across products in this MCat
  const specValues = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach(p => counts.set(p.keySpecValue, (counts.get(p.keySpecValue) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([value]) => value);
  }, [products]);

  const keySpecLabel = products[0]?.keySpecLabel || 'Capacity';

  // Dynamic price buckets (tertiles) computed from this MCat's own price span, since
  // absolute price bands mean nothing across wildly different product types.
  const priceBuckets = useMemo(() => {
    const prices = products.map(p => leadingPrice(p.priceRange)).filter(n => n > 0).sort((a, b) => a - b);
    if (prices.length < 3) return [] as { label: string; min: number; max: number }[];
    const min = prices[0];
    const max = prices[prices.length - 1];
    const step = (max - min) / 3;
    return [
      { label: `Under ${formatINR(Math.round(min + step))}`, min: 0, max: min + step },
      { label: `${formatINR(Math.round(min + step))} – ${formatINR(Math.round(min + step * 2))}`, min: min + step, max: min + step * 2 },
      { label: `Above ${formatINR(Math.round(min + step * 2))}`, min: min + step * 2, max: Infinity }
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedBrandIds.size > 0 && !selectedBrandIds.has(p.brandId)) return false;
      if (selectedSpecValue && p.keySpecValue !== selectedSpecValue) return false;
      if (certifiedBrandIds && !certifiedBrandIds.has(p.brandId)) return false;
      if (selectedPriceBucket !== null) {
        const bucket = priceBuckets[selectedPriceBucket];
        const price = leadingPrice(p.priceRange);
        if (!bucket || price < bucket.min || price >= bucket.max) return false;
      }
      return true;
    });
  }, [products, selectedBrandIds, selectedSpecValue, selectedPriceBucket, priceBuckets, certifiedBrandIds]);

  // Brand Cards, Brand Comparison and Top Models all derive from the same filtered product
  // set — every filter (brand, spec, price, certification) applies consistently everywhere
  // a "which brands/models" list appears on this page, instead of only affecting one section.
  const displayedBrands = useMemo(() => {
    if (!hasActiveFilters) return brands;
    const idsWithMatches = new Set(filteredProducts.map(p => p.brandId));
    return brands.filter(b => idsWithMatches.has(b.id));
  }, [brands, filteredProducts, hasActiveFilters]);

  const sortedByRating = [...displayedBrands].sort((a, b) => b.rating - a.rating);

  // Trending Models — ranked by each product's brand popularity (buyersConnected, with
  // rating as a tiebreaker), not capped one-per-brand. This is deliberately a different cut
  // from "Brands in {category}" above it: that section is about breadth (every brand that
  // makes this product), this one is about depth (what buyers are actually gravitating to
  // regardless of which brand makes it) — real signal from the data instead of an invented
  // "featured" list.
  const brandById = useMemo(() => new Map(brands.map(b => [b.id, b])), [brands]);
  const trendingProducts = useMemo(() => {
    return [...filteredProducts]
      .sort((a, b) => {
        const ba = brandById.get(a.brandId);
        const bb = brandById.get(b.brandId);
        const popA = (ba?.buyersConnected ?? 0) * 1000 + (ba?.rating ?? 0);
        const popB = (bb?.buyersConnected ?? 0) * 1000 + (bb?.rating ?? 0);
        return popB - popA;
      })
      .slice(0, 8);
  }, [filteredProducts, brandById]);

  // Ratings & Reviews — average is weighted by each brand's real reviewsCount (a business
  // stat, e.g. "1248+ reviews"), not the handful of sample Review objects available for
  // display; those sample objects are real but too few per brand to average meaningfully on
  // their own. Scoped to displayedBrands so it stays consistent with every active filter.
  const reviewStats = useMemo(() => {
    const totalReviews = displayedBrands.reduce((sum, b) => sum + b.reviewsCount, 0);
    const weightedSum = displayedBrands.reduce((sum, b) => sum + b.rating * b.reviewsCount, 0);
    const avgRating = totalReviews > 0 ? weightedSum / totalReviews : 0;
    const displayedBrandIds = new Set(displayedBrands.map(b => b.id));
    const sample = [...reviews]
      .filter(r => displayedBrandIds.has(r.brandId))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    return { totalReviews, avgRating, sample };
  }, [displayedBrands, reviews]);

  // Head-to-head compare picker — starts pre-filled with the top 2 rated (currently
  // displayed) brands so the section shows a real comparison immediately rather than an
  // empty picker on first load.
  const [compareIds, setCompareIds] = useState<string[]>(() => sortedByRating.slice(0, 2).map(b => b.id));

  // Keeps the compare set valid as filters change — drops any selected brand that filtered
  // itself out, and tops back up to 2 if that leaves the comparison empty, so an active
  // filter never leaves the buyer looking at a blank "compare" section.
  useEffect(() => {
    setCompareIds(prev => {
      const stillValid = prev.filter(id => displayedBrands.some(b => b.id === id));
      if (stillValid.length > 0) return stillValid;
      return sortedByRating.slice(0, 2).map(b => b.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedBrands]);

  const toggleCompareId = (brandId: string) => {
    setCompareIds(prev => {
      if (prev.includes(brandId)) return prev.filter(id => id !== brandId);
      if (prev.length >= MAX_COMPARE) return prev; // silently ignored past the cap — buttons for
      // already-full state are visually disabled below, so this path only guards a stray race.
      return [...prev, brandId];
    });
  };

  const compareBrands = compareIds.map(id => displayedBrands.find(b => b.id === id)).filter((b): b is Brand => !!b);

  const toggleBrandFilter = (brandId: string) => {
    setSelectedBrandIds(prev => {
      const next = new Set(prev);
      if (next.has(brandId)) next.delete(brandId); else next.add(brandId);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedBrandIds(new Set());
    setSelectedSpecValue(null);
    setSelectedPriceBucket(null);
    setSelectedCertification(null);
  };

  // Carries "the buyer was just looking at Air Compressors, 15 HP" forward as URL
  // params so the Brand Hub can surface that context instead of losing it on navigation.
  const brandHref = (brandId: string) => {
    const params = new URLSearchParams({ fromCategory: category.id });
    if (selectedSpecValue) params.set('spec', selectedSpecValue);
    return `/brands/${brandId}?${params.toString()}`;
  };

  const handleGetQuotes = () => {
    openBuyLeadForm({
      productName: category.name,
      requirement: `Looking for verified brands and sellers in ${category.name}. Please share options with pricing and availability.`
    });
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      trackSearch(headerSearchQuery);
      router.push(`/search?q=${encodeURIComponent(headerSearchQuery)}`);
    }
  };

  // Page map for the fixed jump-nav below the header — one entry per section that actually
  // renders, in the same order they appear on the page (the story arc: browse who makes it
  // → see what's trending → narrow to a shortlist → hear from other buyers → decide →
  // keep exploring), same pattern as the Brand-MCat page.
  const pageSections = [
    { id: 'brands-list', label: 'Brands', icon: Building2, show: true },
    { id: 'trending', label: 'Trending', icon: TrendingUp, show: trendingProducts.length > 0 },
    { id: 'brand-comparison', label: 'Compare', icon: GitCompare, show: displayedBrands.length > 1 },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, show: reviewStats.totalReviews > 0 },
    { id: 'guide-faq', label: 'Guide & FAQ', icon: HelpCircle, show: true },
  ].filter(s => s.show);

  // Scroll-spy — same approach as Brand-MCat: this page also scrolls at the document level
  // rather than inside a clipped container, so a plain window scroll listener (not
  // IntersectionObserver rootMargin tuning) is what actually tracks position here.
  useEffect(() => {
    const ids = pageSections.map(s => s.id);
    let ticking = false;
    const computeActive = () => {
      const triggerLine = 130;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - triggerLine <= 0) {
          current = id;
        }
      }
      setActiveSection(current);
      ticking = false;
    };
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };
    computeActive();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSections.map(s => s.id).join(',')]);

  useEffect(() => {
    const pill = document.querySelector(`[data-pill="${activeSection}"]`);
    pill?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeSection]);

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      {/* Header + page-map nav, pinned together as real fixed chrome on mobile — same
          treatment as Brand-MCat (this page's layout scrolls at the document level, not
          inside a clipped flex/overflow-y-auto region, so position: sticky here would have
          no scrolling ancestor to stick against). Desktop reverts to normal in-flow
          positioning via md:static since DesktopNav already owns persistent top chrome there. */}
      <div className="fixed top-0 inset-x-0 z-30 md:static md:z-auto">
        <div className="bg-surface border-b border-line px-4 md:px-8 py-2.5">
          <div className="flex items-center gap-1.5">
            {/* alwaysCanonical: every level of Home > Category > Brand > Brand-MCat >
                Product needs to retrace the same taxonomy on every back press, not just
                this one page in isolation — real browser history mixed with canonical
                Link-navigation ("back" pushes a new entry rather than truly going back)
                caused the chain to bounce between two levels instead of climbing it. */}
            <BackButton fallbackHref="/categories" title="Back to all categories" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition shrink-0" alwaysCanonical />
            {headerSearchOpen ? (
              <form onSubmit={handleHeaderSearchSubmit} className="flex-1 flex items-center gap-2 min-w-0">
                <div className="relative flex-1 min-w-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    value={headerSearchQuery}
                    onChange={(e) => setHeaderSearchQuery(e.target.value)}
                    placeholder="Search products, brands, models…"
                    className="w-full bg-canvas border border-line rounded-full pl-8 pr-3 py-1.5 text-[11px] outline-none focus:border-accent-blue/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setHeaderSearchOpen(false); setHeaderSearchQuery(''); }}
                  className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 shrink-0 px-1"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <div className="min-w-0 flex-1">
                  <Breadcrumb segments={[{ label: industryName }, { label: category.name }]} />
                </div>
                <button
                  type="button"
                  onClick={() => setHeaderSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 transition"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {!headerSearchOpen && (
            <p className="font-heading font-extrabold text-sm text-heading tracking-tight truncate mt-1">
              {category.name} Brands
              <span className="font-semibold text-slate-400 dark:text-slate-500 text-[10px] ml-1.5">
                · {brands.length} {brands.length === 1 ? 'brand' : 'brands'} · {products.length} {products.length === 1 ? 'model' : 'models'}
              </span>
            </p>
          )}
        </div>

        {brands.length > 0 && (
          <div className="bg-surface border-b border-line">
            <nav className="max-w-5xl mx-auto px-4 md:px-8 flex gap-2 overflow-x-auto scrollbar-none py-2.5">
              {pageSections.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => scrollToSection(e, id)}
                  data-pill={id}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold transition whitespace-nowrap border ${
                    activeSection === id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40 hover:text-accent-blue'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* pt-[112px] clears the fixed header+nav pair above (measured, matches Brand-MCat);
          md:pt-0 since that pair reverts to normal flow on desktop. */}
      <div className="flex-1 overflow-y-auto pt-[112px] md:pt-0">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 space-y-5">
          {brands.length === 0 ? (
            <div className="bg-surface border border-line rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              No branded catalog is listed for {category.name} yet. Send a requirement and we'll match you with verified manufacturers.
            </div>
          ) : (
            <>
              {/* Refine Results — inline chips instead of a bottom sheet, so every active
                  filter is visible at a glance without an extra tap to open/close a sheet,
                  matching the Brand-MCat page's filter treatment for a consistent pattern
                  across the app. Each row keeps its own "All" reset; a single "Clear all"
                  link only shows once more than one filter is actually active. */}
              <section className="bg-surface border border-line rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Refine Results</span>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-[10px] font-bold text-accent-blue hover:underline">Clear all</button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">Brand:</span>
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-0.5 px-0.5">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => toggleBrandFilter(brand.id)}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border transition whitespace-nowrap ${
                          selectedBrandIds.has(brand.id)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'
                        }`}
                      >
                        {brand.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                {specValues.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">{keySpecLabel}:</span>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-0.5 px-0.5">
                      <button
                        onClick={() => setSelectedSpecValue(null)}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border transition ${!selectedSpecValue ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'}`}
                      >
                        All
                      </button>
                      {specValues.map((val) => (
                        <button
                          key={val}
                          onClick={() => setSelectedSpecValue(prev => prev === val ? null : val)}
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border transition whitespace-nowrap ${
                            selectedSpecValue === val ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {priceBuckets.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">Price:</span>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-0.5 px-0.5">
                      <button
                        onClick={() => setSelectedPriceBucket(null)}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border transition ${selectedPriceBucket === null ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'}`}
                      >
                        All
                      </button>
                      {priceBuckets.map((bucket, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPriceBucket(prev => prev === idx ? null : idx)}
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border transition whitespace-nowrap ${
                            selectedPriceBucket === idx ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'
                          }`}
                        >
                          {bucket.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {availableCertifications.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">Certification:</span>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-0.5 px-0.5">
                      <button
                        onClick={() => setSelectedCertification(null)}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border transition ${!selectedCertification ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'}`}
                      >
                        All
                      </button>
                      {availableCertifications.map((cert) => (
                        <button
                          key={cert}
                          onClick={() => setSelectedCertification(prev => prev === cert ? null : cert)}
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border transition whitespace-nowrap ${
                            selectedCertification === cert ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'
                          }`}
                        >
                          {cert}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Brand Cards — a horizontally-scrolling rail (2.5 cards visible, matching Top
                  Models below) rather than a vertical grid, so a buyer sees more of the
                  category — comparison, top models, guide — without endless scrolling past
                  every brand card first. */}
              <section id="brands-list" className="scroll-mt-[120px]">
                <h2 className="font-heading font-bold text-sm text-heading">
                  Brands in {category.name}{hasActiveFilters ? ' (Filtered)' : ''}
                </h2>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mb-2.5 mt-0.5">Every verified manufacturer selling {category.name.toLowerCase()} here — start with who makes it.</p>
                {displayedBrands.length === 0 ? (
                  <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                    No brands in {category.name} match these filters.{' '}
                    <button onClick={clearFilters} className="text-accent-blue font-bold hover:underline">Clear filters</button> to see all brands.
                  </div>
                ) : (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
                  {displayedBrands.map((brand) => {
                    const repImage = brandImageByBrand.get(brand.id);
                    return (
                      <Link
                        key={brand.id}
                        href={brandHref(brand.id)}
                        className="w-[138px] shrink-0 bg-surface border border-line rounded-2xl overflow-hidden hover:border-accent-blue/40 transition shadow-xs flex flex-col"
                      >
                        <div className="h-20 bg-canvas border-b border-line flex items-center justify-center p-2 shrink-0">
                          {repImage ? (
                            <img
                              src={repImage}
                              alt={brand.name}
                              className="max-h-16 max-w-full object-contain mix-blend-multiply"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-line rounded-xl flex items-center justify-center overflow-hidden p-1.5">
                              <BrandLogo logo={brand.logo} name={brand.name} />
                            </div>
                          )}
                        </div>
                        <div className="p-2 flex-1 flex flex-col min-w-0">
                          <h3 className="font-extrabold text-[10.5px] text-slate-900 dark:text-slate-50 truncate leading-tight">{brand.name}</h3>
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            <TrustBadge type="manufacturer-oem" who={brand.name} className="!px-1 !py-0 !text-[7px]" />
                            {brand.verified && <TrustBadge type="verified-supplier" who="IndiaMART" since={brand.verifiedSince} className="!px-1 !py-0 !text-[7px]" />}
                          </div>
                          {(sellerCountByBrand.get(brand.id) || 0) > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-[8.5px] font-bold text-accent-green">
                              <ShieldCheck className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{sellerCountByBrand.get(brand.id)} Sellers</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openBuyLeadForm({
                                productName: `${brand.name} — ${category.name}`,
                                brandName: brand.name,
                                requirement: `Looking for ${brand.name} products in ${category.name}. Please share options with pricing and availability.`
                              });
                            }}
                            className="mt-1.5 w-full py-1.5 bg-cta hover:bg-cta-hover text-white rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <Send className="w-2.5 h-2.5" />
                            Get Quote
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                )}
              </section>

              {/* Trending Models — cross-brand, ranked by real buyer-connection volume
                  (not one-per-brand like a brand directory would be); this is the "what are
                  other buyers actually choosing" beat that naturally follows "who makes it". */}
              {trendingProducts.length > 0 && (
                <section id="trending" className="scroll-mt-[120px]">
                  <h2 className="font-heading font-bold text-sm text-heading">Trending in {category.name}{hasActiveFilters ? ' (Filtered)' : ''}</h2>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mb-2.5 mt-0.5">What buyers like you are choosing most, across every brand above.</p>
                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
                    {trendingProducts.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.id}`}
                        className="bg-surface border border-line rounded-xl p-2.5 w-[138px] shrink-0 hover:border-accent-blue/40 transition"
                      >
                        <div className="h-16 bg-canvas rounded-lg flex items-center justify-center mb-2">
                          <img src={prod.image} alt={prod.name} className="max-h-14 max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase truncate">{prod.brandName.split(' ')[0]}</p>
                        <p className="text-[10.5px] font-bold text-slate-900 dark:text-slate-50 line-clamp-2 leading-tight mt-0.5">{prod.name}</p>
                        <p className="text-[10px] font-black text-heading mt-1">
                          {prod.priceRange.split(' - ')[0]}
                          {prod.priceRange.includes(' - ') && <span className="text-[8.5px] font-semibold text-slate-400 dark:text-slate-500"> onwards</span>}
                        </p>
                        {/* One action here — call/WhatsApp live on the product page itself, once
                            the buyer has actually seen specs and seller trust signals; stacking
                            three CTAs on a browse-stage card fights the single tap we want. */}
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
                          className="mt-2 w-full py-1.5 bg-cta hover:bg-cta-hover text-white rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition"
                        >
                          <Send className="w-2.5 h-2.5" />
                          Get Best Price
                        </button>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              {trendingProducts.length === 0 && hasActiveFilters && (
                <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                  No models match these filters. <button onClick={clearFilters} className="text-accent-blue font-bold hover:underline">Clear filters</button> to see all models.
                </div>
              )}

              {/* Brand Comparison — head-to-head picker instead of an all-brands table.
                  Buyer taps up to 3 brands; only those render as side-by-side cards, so
                  there's no wide table needing horizontal scroll for every attribute.
                  Starts pre-filled with the top 2 rated brands so the section shows a real
                  comparison immediately. */}
              {displayedBrands.length > 1 && (
                <section id="brand-comparison" className="scroll-mt-[120px]">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-heading font-bold text-sm text-heading">Compare Brands</h2>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{compareIds.length}/{MAX_COMPARE}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mb-2.5">Narrowed it down? Weigh your shortlist side by side.</p>
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 mb-3">
                    {sortedByRating.map((brand) => {
                      const isSelected = compareIds.includes(brand.id);
                      const disabled = !isSelected && compareIds.length >= MAX_COMPARE;
                      return (
                        <button
                          key={brand.id}
                          onClick={() => toggleCompareId(brand.id)}
                          disabled={disabled}
                          className={`shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-bold border transition whitespace-nowrap ${
                            isSelected
                              ? 'bg-cta text-white border-cta'
                              : disabled
                                ? 'bg-canvas border-line text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                          {brand.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                  {compareBrands.length === 0 ? (
                    <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                      Tap up to {MAX_COMPARE} brands above to compare them side by side.
                    </div>
                  ) : (
                    <div className={`grid gap-2.5 ${compareBrands.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {compareBrands.map((brand) => (
                        <div key={brand.id} className="bg-surface border border-line rounded-2xl p-3 shadow-xs flex flex-col">
                          <h3 className="font-extrabold text-[11px] text-slate-900 dark:text-slate-50 leading-tight">
                            <Link href={brandHref(brand.id)} className="hover:text-accent-blue">{brand.name}</Link>
                          </h3>
                          <div className="grid grid-cols-2 gap-1.5 mt-2 text-[10px]">
                            <div className="bg-canvas rounded-lg p-1.5 border border-line">
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Rating</span>
                              <span className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{brand.rating}</span>
                            </div>
                            <div className="bg-canvas rounded-lg p-1.5 border border-line">
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Est.</span>
                              <span className="font-bold text-slate-900 dark:text-slate-50">{brand.establishedYear}</span>
                            </div>
                            <div className="bg-canvas rounded-lg p-1.5 border border-line">
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Mfg. Units</span>
                              <span className="font-bold text-slate-900 dark:text-slate-50">{brand.manufacturingUnits}</span>
                            </div>
                            <div className="bg-canvas rounded-lg p-1.5 border border-line">
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Countries</span>
                              <span className="font-bold text-slate-900 dark:text-slate-50">{brand.countriesServed}+</span>
                            </div>
                          </div>
                          <div className="mt-1.5">
                            {brand.verified ? (
                              <TrustBadge type="verified-supplier" who="IndiaMART" since={brand.verifiedSince} className="!text-[8px] !px-1.5" />
                            ) : (
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">Verification pending</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => openBuyLeadForm({
                              productName: `${brand.name} — ${category.name}`,
                              brandName: brand.name,
                              requirement: `Looking for ${brand.name} products in ${category.name}. Please share options with pricing and availability.`
                            })}
                            className="mt-2 w-full py-1.5 bg-cta hover:bg-cta-hover text-white rounded-lg text-[9.5px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <Send className="w-2.5 h-2.5" />
                            Get Quote
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Secondary CTA — a second, softer nudge right after the comparison,
                      visually distinct from the sticky footer bar so it reads as a fresh
                      prompt rather than a duplicate. */}
                  <div className="mt-2.5 bg-accent-green/5 border border-accent-green/20 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-accent-green shrink-0" />
                    <p className="flex-1 min-w-0 text-[10.5px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
                      Done comparing? <span className="text-slate-500 dark:text-slate-400 font-medium">One request reaches every seller.</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleGetQuotes}
                      className="shrink-0 px-3 py-1.5 bg-accent-green hover:bg-accent-green/90 text-white rounded-lg text-[10px] font-bold transition"
                    >
                      Get Quotes
                    </button>
                  </div>
                </section>
              )}

              {/* Ratings & Reviews — real per-brand review objects pooled across the whole
                  category (brand.rating/reviewsCount are the trustworthy aggregate stats;
                  the sample Review objects are too few per brand to average on their own,
                  but make good real testimonial cards). The trust-building beat that follows
                  narrowing a shortlist and precedes the decision-making Guide/FAQ below. */}
              {reviewStats.totalReviews > 0 && (
                <section id="reviews" className="scroll-mt-[120px]">
                  <h2 className="font-heading font-bold text-sm text-heading">Ratings &amp; Reviews</h2>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mb-2.5 mt-0.5">Hear from buyers who've already purchased in {category.name}.</p>
                  <div className="bg-surface border border-line rounded-2xl p-4 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-heading font-extrabold text-heading">{reviewStats.avgRating.toFixed(1)}</span>
                      <div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(reviewStats.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{reviewStats.totalReviews.toLocaleString('en-IN')}+ reviews across {displayedBrands.length} {displayedBrands.length === 1 ? 'brand' : 'brands'}</span>
                      </div>
                    </div>
                    {reviewStats.sample.length > 0 && (
                      <div className="divide-y divide-line">
                        {reviewStats.sample.map((rev) => (
                          <div key={rev.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0">
                                <span className="font-bold text-[11px] text-slate-900 dark:text-slate-50">{rev.userName}</span>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block">{rev.userRole}, {rev.companyName}</span>
                              </div>
                              <div className="flex gap-0.5 shrink-0">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-[9px] font-bold text-accent-blue uppercase tracking-wide">{brandById.get(rev.brandId)?.name}</p>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Guide & FAQ — both collapsed by default (see guideOpen/faqOpen above); same
              chevron-toggle pattern already used for individual FAQ entries elsewhere in the
              app, just applied one level up to the whole section instead of per-question.
              Follows Reviews on purpose: having heard from other buyers, this is the "how do
              I decide" beat, right before the page hands off to Related Categories / the CTA. */}
          <section id="guide-faq" className="scroll-mt-[120px] space-y-2.5">
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 -mt-2">Still deciding? Here's how other buyers make the call.</p>
            <div className="bg-surface border border-line rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setGuideOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-heading font-bold text-sm text-heading flex items-center gap-1.5">
                  <AnimatedIcon icon={BookOpen} variant="flip" className="w-4 h-4 text-accent-purple" />
                  Buying Guide
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${guideOpen ? 'rotate-90' : ''}`} />
              </button>
              {guideOpen && (
                <div className="px-4 pb-4 space-y-2.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-line pt-3">
                  <p><strong className="text-slate-900 dark:text-slate-50">1. Confirm the exact model &amp; specification</strong> — match your requirement to the exact model, not just the brand, before requesting quotes.</p>
                  <p><strong className="text-slate-900 dark:text-slate-50">2. Check trust badges</strong> — look for Verified Supplier, Authorized Dealer, and Manufacturer/OEM badges to confirm who you're really buying from.</p>
                  <p><strong className="text-slate-900 dark:text-slate-50">3. Compare at least 2-3 brands</strong> — use Compare Brands above to weigh rating, manufacturing scale, and years in business.</p>
                  <p><strong className="text-slate-900 dark:text-slate-50">4. Get quotes from multiple verified sellers</strong> — pricing, delivery time, and after-sales support can vary meaningfully between sellers of the same brand.</p>
                </div>
              )}
            </div>

            <div className="bg-surface border border-line rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setFaqOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-heading font-bold text-sm text-heading flex items-center gap-1.5">
                  <AnimatedIcon icon={HelpCircle} variant="pulse" className="w-4 h-4 text-accent-blue" />
                  Frequently Asked Questions
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${faqOpen ? 'rotate-90' : ''}`} />
              </button>
              {faqOpen && (
                <div className="divide-y divide-line border-t border-line">
                  <div className="p-4">
                    <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">How many verified brands are available for {category.name}?</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{brands.length} verified {brands.length === 1 ? 'brand is' : 'brands are'} currently listed, each with authorized sellers you can compare directly.</p>
                  </div>
                  <div className="p-4">
                    <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">What's the difference between comparing brands here vs. comparing sellers?</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">This page compares manufacturers (brands). Once you pick a brand and model, the product page lets you compare the specific sellers authorized to sell it.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Related Categories — the page's final beat: if this category didn't fully
              cover what the buyer needs, the next-most-relevant place to keep sourcing is
              a sibling under the same parent industry, not a dead end at the FAQ above. */}
          {relatedCategories.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-sm text-heading">Also Sourcing?</h2>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mb-2.5 mt-0.5">Related categories buyers in {industryName} often need too.</p>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
                {relatedCategories.map((rc) => (
                  <Link
                    key={rc.id}
                    href={`/categories/${rc.id}`}
                    className="w-[130px] shrink-0 bg-surface border border-line rounded-2xl p-3 hover:border-accent-blue/40 transition flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-10 h-10 bg-accent-blue/10 text-accent-blue rounded-xl flex items-center justify-center">
                      <CategoryIcon icon={rc.icon} className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-slate-50 leading-tight">{rc.name}</span>
                    <span className="text-[9px] font-bold text-accent-blue flex items-center gap-0.5">Explore <ArrowRight className="w-2.5 h-2.5" /></span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky CTA — primary action jumps to the on-page Compare Brands section (was a
          link out to the separate /compare page; now that comparison lives inline, keeping
          the buyer on this page is one less navigation for the same job), Get Quotes stays
          available as a secondary path. */}
      <div className="border-t border-line p-4 bg-surface shrink-0">
        <div className="max-w-5xl mx-auto flex items-center gap-2.5">
          <a
            href={displayedBrands.length > 1 ? '#brand-comparison' : `/compare?category=${category.id}`}
            onClick={(e) => { if (displayedBrands.length > 1) scrollToSection(e, 'brand-comparison'); }}
            className="flex-1 md:flex-none md:px-10 bg-cta hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
          >
            <GitCompare className="w-4 h-4" />
            Compare Brands
          </a>
          <button
            onClick={handleGetQuotes}
            className="shrink-0 px-4 py-3.5 bg-canvas hover:bg-line border border-line text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden md:inline">Get Quotes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
