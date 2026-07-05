'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Send, ChevronRight, HelpCircle, ShieldCheck, Check, Download, FileText, GitCompare, Search, Layers, Package, ListChecks, ArrowUpDown } from 'lucide-react';
import { BrandMCat, Brand, Product, Supplier, Review } from '../types';
import { TrustBadge } from './TrustBadge';
import { ConnectButton } from './ConnectButton';
import { NearbyOptionsEngine } from './NearbyOptionsEngine';
import { AnimatedIcon } from './AnimatedIcon';
import { useScrollChrome } from './ScrollChromeProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useShortlist } from './ShortlistProvider';
import { useSearchHistory } from './SearchHistoryProvider';
import { buildRfqRequirement } from '../lib/rfq';
import { scrollToSection } from '../lib/anchorScroll';
import { BackButton } from './BackButton';
import { WhatsAppFloatingButton } from './WhatsAppFloatingButton';

interface BrandMCatViewProps {
  brandMCat: BrandMCat;
  brand: Brand;
  categoryName: string;
  products: Product[];
  suppliers: Supplier[];
  reviews: Review[];
  // Carried forward from a category-page spec filter or the Brand Hub's "Continue with..."
  // link (via ?model=) — preselects the buyer's actual model instead of defaulting to
  // whichever product happens to sit first in the underlying array.
  initialModelId?: string;
}

const FAQ_TEMPLATE = (mcatName: string, brandName: string) => [
  {
    q: `Are all ${mcatName} listed here sold directly by ${brandName}?`,
    a: `No. ${brandName} manufactures these products; the sellers shown are Authorized Dealers verified to sell genuine ${brandName} products in your region. Always check the Authorized Dealer badge before ordering.`
  },
  {
    q: 'How do I choose the right model?',
    a: 'Select a model above to see its full specifications and price, then compare it against other models in the table before requesting quotes.'
  },
  {
    q: 'How is pricing determined?',
    a: 'Listed price ranges are indicative. Final pricing depends on exact specification, quantity, delivery location, and after-sales terms — confirm with a verified seller via Get Quotes.'
  }
];

export default function BrandMCatView({ brandMCat, brand, categoryName, products, suppliers, reviews, initialModelId }: BrandMCatViewProps) {
  const router = useRouter();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const { shortlistedProducts, toggleShortlistProduct } = useShortlist();
  const { navVisible } = useScrollChrome();
  const { trackSearch } = useSearchHistory();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Inline in this page's own header rather than the floating MobileSearchBar (hidden on
  // every /brands/* route) — same pattern as Category and Brand Hub pages.
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  // Prefer the buyer's carried-forward model selection; fall back to the first product
  // only when there's no prior context (e.g. a cold visit via search or direct link).
  const initialProductExists = initialModelId && products.some(p => p.id === initialModelId);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    initialProductExists ? initialModelId : products[0]?.id
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showAllModelsDealers, setShowAllModelsDealers] = useState(false);
  const [specFilterIdx, setSpecFilterIdx] = useState<number | null>(null);
  const [priceFilterIdx, setPriceFilterIdx] = useState<number | null>(null);
  const [showAllCompareModels, setShowAllCompareModels] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('select-model');

  const faqs = FAQ_TEMPLATE(brandMCat.name, brand.name);

  const prices = products.map(p => parseInt(p.priceRange.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n));
  const minPrice = prices.length ? Math.min(...prices) : null;

  // Leading numeric token out of a spec/price string — "7.5 HP (5.5 kW)" -> 7.5,
  // "₹18,500 - ₹1,25,000" -> 18500 (first number in the string; a range's low end is a
  // reasonable sort/bucket key, distinct from parsing every number out of it).
  const parseLeadingNumber = (str: string): number | null => {
    const match = str.match(/[\d,]*\.?\d+/);
    if (!match) return null;
    const n = parseFloat(match[0].replace(/,/g, ''));
    return isNaN(n) ? null : n;
  };

  // Splits products into evenly-sized Low/Mid/High buckets by a numeric key, labeled with
  // the real values at each bucket's edges (not invented round numbers) — works for whatever
  // unit this line happens to use (HP, kVA, DN, m³/hr) without hardcoding any of them. Only
  // offered when there's enough data to make filtering meaningful: every product in the line
  // must parse to a number, and there must be at least 3 distinct values (otherwise "Low"
  // and "High" would be arbitrary slices of an undifferentiated list).
  const makeBuckets = (key: (p: Product) => string, unit: string) => {
    if (products.length < 6) return null;
    const parsed = products.map(p => ({ p, n: parseLeadingNumber(key(p)) }));
    if (parsed.some(x => x.n === null)) return null;
    const distinct = new Set(parsed.map(x => x.n));
    if (distinct.size < 3) return null;
    const sorted = [...parsed].sort((a, b) => (a.n as number) - (b.n as number));
    const chunkSize = Math.ceil(sorted.length / 3);
    const chunks = [sorted.slice(0, chunkSize), sorted.slice(chunkSize, chunkSize * 2), sorted.slice(chunkSize * 2)].filter(c => c.length > 0);
    const fmt = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)}${unit}`;
    return chunks.map((chunk, idx) => {
      const lo = chunk[0].n as number;
      const hi = chunk[chunk.length - 1].n as number;
      const label = idx === 0 ? `Up to ${fmt(hi)}` : idx === chunks.length - 1 ? `${fmt(lo)}+` : `${fmt(lo)} – ${fmt(hi)}`;
      const ids = new Set(chunk.map(x => x.p.id));
      return { label, ids };
    });
  };

  // Unit suffix for the spec buckets comes from whatever follows the number in the first
  // product's own keySpecValue ("7.5 HP (5.5 kW)" -> " HP") — self-adapting per line instead
  // of hardcoding "HP" for a filter that's also used on generator/valve/compressor lines.
  const specUnit = products[0]?.keySpecValue.match(/[\d.]+\s*([A-Za-z]+)/)?.[1];
  const specBuckets = useMemo(
    () => (specUnit ? makeBuckets(p => p.keySpecValue, ` ${specUnit}`) : null),
    [products, specUnit]
  );
  const priceBuckets = useMemo(
    () => makeBuckets(p => p.priceRange, ''),
    [products]
  );
  // Price bucket labels read oddly with the raw parsed number (no currency symbol) — rebuild
  // them with ₹ + Indian digit grouping instead of reusing makeBuckets' generic formatter.
  const priceBucketsFormatted = useMemo(() => {
    if (!priceBuckets) return null;
    return priceBuckets.map((b, idx) => {
      const nums = [...b.ids].map(id => {
        const p = products.find(pr => pr.id === id);
        return p ? parseLeadingNumber(p.priceRange) : null;
      }).filter((n): n is number => n !== null);
      const lo = Math.min(...nums);
      const hi = Math.max(...nums);
      const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
      const label = idx === 0 ? `Under ${fmt(hi)}` : idx === priceBuckets.length - 1 ? `${fmt(lo)}+` : `${fmt(lo)} – ${fmt(hi)}`;
      return { label, ids: b.ids };
    });
  }, [priceBuckets, products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (specFilterIdx !== null && specBuckets?.[specFilterIdx]) {
      result = result.filter(p => specBuckets[specFilterIdx].ids.has(p.id));
    }
    if (priceFilterIdx !== null && priceBucketsFormatted?.[priceFilterIdx]) {
      result = result.filter(p => priceBucketsFormatted[priceFilterIdx].ids.has(p.id));
    }
    return result;
  }, [products, specFilterIdx, priceFilterIdx, specBuckets, priceBucketsFormatted]);

  const selectedProduct = useMemo(
    () => products.find(p => p.id === selectedModelId) || products[0],
    [products, selectedModelId]
  );

  // If an active filter drops the currently-selected model out of view, fall back to the
  // first model still visible rather than leaving Specifications showing a filtered-out
  // model the buyer can no longer see or tap on above.
  useEffect(() => {
    if (filteredProducts.length === 0) return;
    if (!filteredProducts.some(p => p.id === selectedModelId)) {
      setSelectedModelId(filteredProducts[0].id);
    }
  }, [filteredProducts, selectedModelId]);

  // Selecting a model (from the picker or the comparison list) is the buyer committing to
  // one option — jump them straight to its full specs rather than leaving them to scroll and
  // find the panel themselves, matching the section's new position right below the picker.
  const handleSelectModel = (id: string) => {
    setSelectedModelId(id);
    document.getElementById('specifications')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Page map for the fixed jump-nav below the header — one entry per section that actually
  // renders on this line (mirrors each section's own conditional further down), so a buyer
  // gets an honest at-a-glance list of what's on the page instead of dead links to sections
  // that got skipped for having no data. Order matches the page's actual visual order —
  // Specs sits right after Models (where the buyer lands after selecting one), Compare after
  // that — so pill order reads the same top-to-bottom as the page itself.
  const pageSections = [
    { id: 'applications', label: 'Applications', icon: Layers, show: brandMCat.applications.length > 0 },
    { id: 'select-model', label: 'Models', icon: Package, show: true },
    { id: 'specifications', label: 'Specs', icon: ListChecks, show: !!selectedProduct },
    { id: 'compare-models', label: 'Compare', icon: GitCompare, show: filteredProducts.length > 1 },
    { id: 'nearby-options', label: 'Nearby', icon: ArrowUpDown, show: !!selectedProduct && products.length > 1 },
    { id: 'verified-dealers', label: 'Dealers', icon: MapPin, show: true },
    { id: 'reviews', label: 'Reviews', icon: Star, show: reviews.length > 0 },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, show: true },
  ].filter(s => s.show);

  // Scroll-spy — highlights whichever pill matches the section currently under the fixed
  // header+nav chrome, and keeps that pill scrolled into view within the horizontally
  // scrolling pill row, so the nav reflects (and can be steered by) where the buyer actually
  // is on a long page, not just where they started. This page scrolls at the document level
  // (see the fixed-chrome comment below), so a plain window scroll listener is the natural
  // fit — no nested-container scroll-tracking needed.
  useEffect(() => {
    const ids = pageSections.map(s => s.id);
    let ticking = false;
    const computeActive = () => {
      const triggerLine = 130; // just past the fixed header+nav height
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

  // Dealer availability by location — buyer can narrow the exact model's sellers to their region
  const dealerLocations = useMemo(() => {
    const states = new Set(suppliers.map(s => s.location.split(',').pop()?.trim()).filter(Boolean) as string[]);
    return [...states].sort();
  }, [suppliers]);

  const visibleDealers = useMemo(() => {
    let result = suppliers;
    if (!showAllModelsDealers && selectedProduct) {
      result = result.filter(s => s.productId === selectedProduct.id);
    }
    if (selectedLocation) {
      result = result.filter(s => s.location.split(',').pop()?.trim() === selectedLocation);
    }
    return result;
  }, [suppliers, showAllModelsDealers, selectedProduct, selectedLocation]);

  const handleGetQuotes = () => {
    openBuyLeadForm({
      productName: selectedProduct ? `${selectedProduct.name} (${selectedProduct.modelNumber})` : brandMCat.name,
      brandName: brand.name,
      requirement: selectedProduct
        ? buildRfqRequirement(selectedProduct)
        : `Interested in ${brandMCat.name}. Please share available models, technical datasheets, and best pricing for my requirement.`
    });
  };

  const handleRequestQuoteForProduct = (prod: Product) => {
    openBuyLeadForm({
      productName: `${prod.name} (${prod.modelNumber})`,
      brandName: brand.name,
      requirement: buildRfqRequirement(prod)
    });
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      trackSearch(headerSearchQuery);
      router.push(`/search?q=${encodeURIComponent(headerSearchQuery)}`);
    }
  };

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      {/* Header + page-map nav, pinned together as real fixed chrome on mobile (this page's
          layout scrolls at the document level, not inside a clipped flex/overflow-y-auto
          region — confirmed via computed styles — so `position: sticky` here would have no
          scrolling ancestor to stick against and silently do nothing). Desktop reverts to
          the original static-in-flow behavior via md:static since DesktopNav already owns
          persistent top chrome there and this page's own header never needed to float on
          top of it. The scroll content below carries matching pt-[112px] to clear this pair
          once it's taken out of flow, and every jump-nav target's scroll-mt is sized to the
          same height so an anchor jump doesn't land underneath the fixed bar. */}
      <div className="fixed top-0 inset-x-0 z-30 md:static md:z-auto">
      {/* Header */}
      <div className="bg-surface border-b border-line px-4 md:px-8 py-3 flex items-center justify-between shrink-0 gap-1.5">
        {/* alwaysCanonical — see CategoryBrandsView's BackButton for why every level of
            this chain needs it, not just the product page. Carries this line's own
            category forward as ?fromCategory= so Brand Hub's *own* back button can keep
            climbing to the real category instead of falling back to the flat /brands
            listing — without this, going back from here would silently drop the exact
            context the buyer arrived with. */}
        <BackButton
          fallbackHref={`/brands/${brand.id}?fromCategory=${brandMCat.mcatId}`}
          title={`Back to ${brand.name}`}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition shrink-0"
          alwaysCanonical
        />
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
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate">
                <Link href={`/categories/${brandMCat.mcatId}`} className="hover:text-accent-blue">{categoryName}</Link>
                <ChevronRight className="w-2.5 h-2.5 shrink-0" />
                <Link href={`/brands/${brand.id}`} className="hover:text-accent-blue">{brand.name}</Link>
              </div>
              {/* Page heading lives once, in the hero below — this is a compact sticky
                  restatement, not a second <h1>. */}
              <p className="font-heading font-extrabold text-sm md:text-base text-heading tracking-tight truncate">{brandMCat.name}</p>
            </div>
            <button
              type="button"
              onClick={() => setHeaderSearchOpen(true)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition shrink-0"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Page-map jump nav — pinned directly beneath the header (part of the same fixed
          chrome pair above) so the whole page's structure is visible at a glance the instant
          this page loads, and stays reachable at every scroll depth, not just the first
          fold. Replaces the old 2-link "Compare/Dealers" teaser with a full map of every
          section that's actually rendering on this line; each pill jumps straight to its
          section. */}
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
      </div>

      {/* pt-[112px] clears the fixed header+nav pair above (58.5px + 50.75px measured,
          rounded up); md:pt-0 since that pair reverts to normal flow on desktop. pb-24
          clears the now-truly-fixed footer below (previously just a flow sibling that
          happened to land near the fold on short pages — on a line with many models, it sat
          thousands of pixels down, unreachable without a full scroll; real position:fixed
          fixes that, so this padding is now required to avoid covering the last content). */}
      <div className="flex-1 overflow-y-auto pt-[112px] md:pt-0 pb-24 md:pb-0 scroll-smooth">
        {/* Category Hero */}
        <div className="bg-gradient-to-r from-primary to-secondary px-4 md:px-8 py-7 md:py-10 text-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-1.5 mb-2">
              <TrustBadge type="manufacturer-oem" who={brand.name} className="!bg-white/15 !text-white !border-white/25" />
              {brand.verified && <TrustBadge type="verified-supplier" who="IndiaMART" since={brand.verifiedSince} className="!bg-white/15 !text-white !border-white/25" />}
            </div>
            <h1 className="font-heading font-extrabold text-xl md:text-3xl tracking-tight">{brandMCat.name}</h1>
            <p className="text-sm md:text-base text-white/80 mt-2 max-w-xl">{brandMCat.tagline}</p>
            <p className="text-[11px] md:text-xs text-white/60 mt-3 max-w-2xl leading-relaxed">{brandMCat.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {products.length > 0 && (
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold">{products.length} Models Available</span>
              )}
              {suppliers.length > 0 && (
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold">{suppliers.length} Verified Sellers</span>
              )}
              {minPrice && (
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold">From ₹{minPrice.toLocaleString('en-IN')}</span>
              )}
              {brand.catalogueUrl && (
                <a
                  href={brand.catalogueUrl}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3" /> Download Catalogue
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8">
          {/* Applications */}
          <section id="applications" className="scroll-mt-[120px]">
            <h2 className="font-heading font-bold text-sm text-heading mb-3">Popular Applications</h2>
            <div className="flex flex-wrap gap-2">
              {brandMCat.applications.map((app, idx) => (
                <span key={idx} className="bg-surface border border-line rounded-full px-3 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {app}
                </span>
              ))}
            </div>
          </section>

          {/* Model Picker */}
          <section id="select-model" className="scroll-mt-[120px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-sm text-heading">Select a Model</h2>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{filteredProducts.length} of {products.length}</span>
            </div>
            {/* Filter chips — only rendered when there's enough spread in this line's data to
                make filtering meaningful (see makeBuckets); a 3-model line just shows all 3,
                no filter UI needed. Both filters compose (spec AND price) and share the same
                filteredProducts feeding both this grid and the comparison list below it. */}
            {(specBuckets || priceBucketsFormatted) && (
              <div className="space-y-2 mb-3">
                {specBuckets && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">{products[0].keySpecLabel}:</span>
                    <button
                      onClick={() => setSpecFilterIdx(null)}
                      className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold border transition ${specFilterIdx === null ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'}`}
                    >
                      All
                    </button>
                    {specBuckets.map((bucket, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSpecFilterIdx(prev => prev === idx ? null : idx)}
                        className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold border transition ${specFilterIdx === idx ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'}`}
                      >
                        {bucket.label}
                      </button>
                    ))}
                  </div>
                )}
                {priceBucketsFormatted && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">Price:</span>
                    <button
                      onClick={() => setPriceFilterIdx(null)}
                      className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold border transition ${priceFilterIdx === null ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'}`}
                    >
                      All
                    </button>
                    {priceBucketsFormatted.map((bucket, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPriceFilterIdx(prev => prev === idx ? null : idx)}
                        className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold border transition ${priceFilterIdx === idx ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'}`}
                      >
                        {bucket.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {products.length === 0 ? (
              <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                No models currently listed in this line. Send a requirement and we'll match you with {brand.name}.
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 text-xs space-y-2">
                <p>No models match these filters.</p>
                <button onClick={() => { setSpecFilterIdx(null); setPriceFilterIdx(null); }} className="text-accent-blue font-bold hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredProducts.map((prod) => {
                  const isSaved = shortlistedProducts.includes(prod.id);
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectModel(prod.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectModel(prod.id); } }}
                      className={`text-left bg-surface border rounded-2xl overflow-hidden shadow-xs transition flex cursor-pointer ${
                        isSelected ? 'border-cta ring-2 ring-cta/20' : 'border-line hover:border-accent-blue/40'
                      }`}
                    >
                      <div className="w-24 bg-canvas border-r border-line flex items-center justify-center p-2 shrink-0 relative">
                        <img src={prod.image} alt={prod.name} className="max-h-16 max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                        {isSelected && (
                          <span className="absolute top-1 left-1 w-4 h-4 bg-cta rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[11px] text-slate-900 dark:text-slate-50 leading-snug line-clamp-2">
                              {prod.name}
                            </span>
                            <span
                              role="button"
                              onClick={(e) => { e.stopPropagation(); toggleShortlistProduct(prod.id); }}
                              className={`shrink-0 text-[9px] font-black uppercase ${isSaved ? 'text-rose-500' : 'text-slate-300 dark:text-slate-600 hover:text-rose-500'}`}
                            >
                              ♥
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1">{prod.modelNumber}</p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">{prod.keySpecLabel}: <strong className="text-slate-700 dark:text-slate-300">{prod.keySpecValue}</strong></p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-line">
                          <span className="text-[11px] font-black text-heading">{prod.priceRange.split(' - ')[0]}</span>
                          <Link href={`/products/${prod.id}`} onClick={(e) => e.stopPropagation()} className="text-[9px] font-bold text-accent-blue hover:underline">
                            Details →
                          </Link>
                        </div>
                        {/* No per-card Quote action here on purpose — this card's job is
                            picking a model to compare, not closing a sale. Tapping the card
                            already IS the "compare" action (jumps straight to the
                            Specifications panel below); Quote lives once, in the page's
                            sticky footer, scoped to whichever model is selected. */}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Selected Model Detail — conversion centre: full spec + get-quotes context without
              leaving the page. Sits directly after the picker (not after the comparison list)
              since selecting a model is the buyer committing to inspect *that one* — the
              comparison list is the "still deciding" surface and now comes after this, not
              before it. */}
          {selectedProduct && (
            <section id="specifications" className="scroll-mt-[120px]">
              <h2 className="font-heading font-bold text-sm text-heading mb-3">Specifications — {selectedProduct.modelNumber}</h2>
              <div className="bg-surface border border-line rounded-2xl p-4 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-canvas rounded-xl border border-line flex items-center justify-center shrink-0 p-1.5">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-slate-50 leading-snug">{selectedProduct.name}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                    <div key={key} className="bg-canvas rounded-lg p-2 border border-line">
                      <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide block">{key}</span>
                      <span className="text-[10.5px] font-bold text-slate-900 dark:text-slate-50">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
                  <div>
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Price</span>
                    <span className="text-[11px] font-black text-heading">{selectedProduct.priceRange}</span>
                  </div>
                  <div className="border-x border-line">
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Delivery</span>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-slate-50">{selectedProduct.deliveryTime}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Warranty</span>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-slate-50">{selectedProduct.warranty}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Model Comparison — the "still deciding between a few" surface, so it follows
              Specifications rather than preceding it: a buyer who already picked one model
              to inspect is weighing it against the others, not starting from a blank table.
              Redesigned from a dense horizontal-scrolling 5-column table (Model/Spec/Price/
              Delivery/Warranty, up to 15 rows on a long line) into a vertical list of compact
              rows — Delivery/Warranty are dropped here since they're already visible in the
              Specifications panel above the moment a row is tapped, and a vertical list needs
              no horizontal scroll on a 390px screen. Long lines start collapsed to 6 rows
              (plus the selected row if it'd otherwise be hidden) with a "Show all" expand,
              instead of dumping every variant into view at once. Shares filteredProducts with
              the picker above, so an active filter narrows both consistently. */}
          {filteredProducts.length > 1 && (
            <section id="compare-models" className="scroll-mt-[120px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-bold text-sm text-heading">Compare Models in This Line</h2>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{filteredProducts.length} models</span>
              </div>
              <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-xs divide-y divide-line">
                {(showAllCompareModels || filteredProducts.length <= 6
                  ? filteredProducts
                  : (() => {
                      const first6 = filteredProducts.slice(0, 6);
                      return selectedProduct && !first6.some(p => p.id === selectedProduct.id)
                        ? [...first6, selectedProduct]
                        : first6;
                    })()
                ).map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectModel(prod.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 text-left transition ${isSelected ? 'bg-cta/10' : 'hover:bg-canvas'}`}
                    >
                      <div className="w-10 h-10 bg-canvas rounded-lg border border-line flex items-center justify-center shrink-0 p-1">
                        <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10.5px] font-bold text-heading">{prod.modelNumber}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{prod.keySpecValue}</p>
                      </div>
                      <span className="text-[10.5px] font-black text-slate-900 dark:text-slate-50 shrink-0">{prod.priceRange.split(' - ')[0]}</span>
                      {isSelected && (
                        <span className="w-4 h-4 bg-cta rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!showAllCompareModels && filteredProducts.length > 6 && (
                <button onClick={() => setShowAllCompareModels(true)} className="text-[10px] text-accent-blue font-bold hover:underline mt-2">
                  Show all {filteredProducts.length} models
                </button>
              )}
            </section>
          )}

          {/* Nearby Options — the immediate higher/lower-capacity sibling within this same
              line, right after the buyer has settled on one model, so weighing "do I need
              slightly more/less" never requires leaving the page or re-reading the full
              comparison table above. */}
          {selectedProduct && products.length > 1 && (
            <div id="nearby-options" className="scroll-mt-[120px]">
              <NearbyOptionsEngine
                currentProduct={selectedProduct}
                siblings={products}
                onRequestQuote={handleRequestQuoteForProduct}
              />
            </div>
          )}

          {/* Verified Dealers */}
          <section id="verified-dealers" className="scroll-mt-[120px]">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-heading font-bold text-sm text-heading">
                Verified Dealers{!showAllModelsDealers && selectedProduct ? ` — ${selectedProduct.modelNumber}` : ''}
              </h2>
              {dealerLocations.length > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold border transition ${
                      !selectedLocation ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'
                    }`}
                  >
                    All Locations
                  </button>
                  {dealerLocations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(prev => prev === loc ? null : loc)}
                      className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold border transition ${
                        selectedLocation === loc ? 'bg-primary text-white border-primary' : 'bg-canvas border-line text-slate-700 dark:text-slate-300 hover:border-accent-blue/40'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {visibleDealers.length === 0 ? (
              <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 text-xs space-y-2">
                <p>
                  {!showAllModelsDealers && selectedProduct
                    ? `No dealer recorded for ${selectedProduct.modelNumber} in this location yet.`
                    : 'No local authorized dealer recorded yet.'}
                </p>
                {!showAllModelsDealers && suppliers.length > 0 && (
                  <button onClick={() => setShowAllModelsDealers(true)} className="text-accent-blue font-bold hover:underline">
                    Show dealers for all models in this line
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleDealers.map((supp) => (
                  <div key={supp.id} className="bg-surface border border-line rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-50 leading-tight">{supp.name}</h4>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          {supp.location}
                        </span>
                        <ConnectButton supplierId={supp.id} brandName={brand.name} />
                      </div>
                      <div className="flex flex-col gap-1 items-end shrink-0">
                        {supp.verified && <TrustBadge type="verified-supplier" who="IndiaMART" />}
                        {supp.isAuthorizedDealer && <TrustBadge type="authorized-dealer" who={brand.name} since={supp.authorizedSince} />}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-line pt-2 text-center text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                      <div>
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Rating</span>
                        <span className="font-bold text-slate-900 dark:text-slate-50 flex items-center justify-center gap-0.5 mt-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{supp.rating}</span>
                      </div>
                      <div className="border-x border-line">
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Response</span>
                        <span className="font-bold text-slate-900 dark:text-slate-50 block mt-0.5">{supp.responseTime}</span>
                        <span className="text-[7.5px] text-accent-green font-bold block mt-0.5">{supp.responseRate}% reply rate</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Experience</span>
                        <span className="font-bold text-slate-900 dark:text-slate-50 block mt-0.5">{supp.experienceYears} Yrs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showAllModelsDealers && (
              <button onClick={() => setShowAllModelsDealers(false)} className="text-[10px] text-accent-blue font-bold hover:underline mt-2">
                Show only {selectedProduct?.modelNumber} dealers
              </button>
            )}
            {/* Secondary CTA — a second, softer nudge right after the dealer list, visually
                distinct from the sticky footer bar, naming the selected model for continuity. */}
            <div className="mt-3 bg-accent-green/5 border border-accent-green/20 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-accent-green/10 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-accent-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] font-extrabold text-slate-900 dark:text-slate-50">
                  {selectedProduct ? `Ready to order the ${selectedProduct.modelNumber}?` : 'Ready to order?'}
                </p>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5">Get quotes from every authorized dealer above in one request.</p>
              </div>
              <button
                type="button"
                onClick={handleGetQuotes}
                className="shrink-0 px-3.5 py-2 bg-accent-green hover:bg-accent-green/90 text-white rounded-lg text-[10px] font-bold transition"
              >
                Get Quotes
              </button>
            </div>
          </section>

          {/* Downloadable Catalogue */}
          {brand.catalogueUrl && (
            <section>
              <a
                href={brand.catalogueUrl}
                className="bg-surface border border-line rounded-2xl p-4 shadow-xs flex items-center gap-3 hover:border-accent-blue/40 transition"
              >
                <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shrink-0 text-rose-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs truncate">{brandMCat.name} Catalogue</h4>
                  <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold">PDF &middot; {brand.catalogueSizeMb} MB &middot; Updated {brand.catalogueUpdated}</span>
                </div>
                <Download className="w-4 h-4 text-accent-blue shrink-0" />
              </a>
            </section>
          )}

          {/* Mid-scroll breadcrumb repetition — a buyer this far down a long page may have
              lost track of navigational context; the header trail above has long scrolled
              out of view (it lives in the non-sticky top bar, not a fixed chrome element). */}
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            <Link href={`/categories/${brandMCat.mcatId}`} className="hover:text-accent-blue">{categoryName}</Link>
            <ChevronRight className="w-2.5 h-2.5 shrink-0" />
            <Link href={`/brands/${brand.id}`} className="hover:text-accent-blue">{brand.name}</Link>
            <ChevronRight className="w-2.5 h-2.5 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400 normal-case truncate">{brandMCat.name}</span>
          </div>

          {/* Ratings & Reviews */}
          {reviews.length > 0 && (
            <section id="reviews" className="scroll-mt-[120px]">
              <h2 className="font-heading font-bold text-sm text-heading mb-3 flex items-center gap-1.5">
                <AnimatedIcon icon={ShieldCheck} variant="pulse" className="w-4 h-4 text-accent-green" />
                Buyer Ratings &amp; Reviews
              </h2>
              <div className="bg-surface border border-line rounded-2xl p-4 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-heading font-extrabold text-heading">{brand.rating}</span>
                  <div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(brand.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{brand.reviewsCount}+ reviews for {brand.name}</span>
                  </div>
                </div>
                <div className="divide-y divide-line">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[11px] text-slate-900 dark:text-slate-50">{rev.userName}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block">{rev.userRole}, {rev.companyName}</span>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed italic mt-1">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQs */}
          <section id="faq" className="scroll-mt-[120px]">
            <h2 className="font-heading font-bold text-sm text-heading mb-3 flex items-center gap-1.5">
              <AnimatedIcon icon={HelpCircle} variant="pulse" className="w-4 h-4 text-accent-blue" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-surface border border-line rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="px-4 pb-3 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating WhatsApp launcher — persists regardless of scroll position, scoped to
          whichever model is currently selected (falls back to the brand line itself if
          none is). The sticky footer below isn't fixed, so it doesn't stack with this for
          most of the scroll — but it's the last element on the page, so at true-bottom
          scroll it ends up directly above the BottomNav; clearance accounts for both. */}
      <WhatsAppFloatingButton
        contactId={selectedProduct?.id || brand.id}
        message={
          selectedProduct
            ? `Hi, I'm interested in ${selectedProduct.name} (${selectedProduct.modelNumber}). Please share pricing and availability.`
            : `Hi, I'm interested in ${brandMCat.name} by ${brand.name}. Please share available models and pricing.`
        }
        className="bottom-36 md:bottom-6"
      />

      {/* Sticky CTA — Compare (primary) is this page's actual job: helping a buyer weigh
          models against each other. Quote (secondary) stays reachable for a buyer who's
          already decided, scoped to whichever model is currently selected, without
          demanding a bare "Call/Chat" before they've committed to one. Genuinely fixed to
          the viewport (not just a flex-flow sibling that happened to sit near the fold on
          short pages) — on a 15-model line this bar previously sat ~5000px down the
          document, unreachable without scrolling all the way through every model. */}
      <div
        className={`md:static md:bottom-auto fixed left-0 right-0 z-30 border-t border-line bg-surface p-4 transition-[bottom] duration-200 ${
          navVisible ? 'bottom-14' : 'bottom-0'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* A condensed one-line context above the buttons — the buttons themselves stay
              short ("Compare"/"Quote") per the two-word CTA rule, but a buyer scrolled deep
              into a long model list shouldn't lose track of which model "Quote" refers to. */}
          {selectedProduct && (
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 truncate">
              Quoting <span className="text-slate-700 dark:text-slate-300">{selectedProduct.modelNumber}</span> · {selectedProduct.priceRange.split(' - ')[0]} onwards
            </p>
          )}
          <div className="flex items-center gap-2.5">
            <a
              href={filteredProducts.length > 1 ? '#compare-models' : `/compare?productId=${selectedProduct?.id ?? ''}`}
              onClick={(e) => { if (filteredProducts.length > 1) scrollToSection(e, 'compare-models'); }}
              className="flex-1 md:flex-none md:px-10 bg-cta hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
            >
              <GitCompare className="w-4 h-4" />
              Compare
            </a>
            <button
              onClick={handleGetQuotes}
              className="shrink-0 px-4 py-3.5 bg-canvas hover:bg-line border border-line text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
