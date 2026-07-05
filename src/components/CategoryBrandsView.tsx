'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Send, BookOpen, HelpCircle, GitCompare, SlidersHorizontal, X, ShieldCheck, Search } from 'lucide-react';
import { MCat, Brand, Product, Supplier, BrandMCat } from '../types';
import { BrandLogo } from './BrandLogo';
import { TrustBadge } from './TrustBadge';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useScrollChrome } from './ScrollChromeProvider';
import { BackButton } from './BackButton';
import { Breadcrumb } from './Breadcrumb';
import { buildRfqRequirement } from '../lib/rfq';

interface CategoryBrandsViewProps {
  category: MCat;
  industryName: string;
  brands: Brand[];
  products: Product[];
  suppliers: Supplier[];
  brandMCats: BrandMCat[];
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

export default function CategoryBrandsView({
  category, industryName, brands, products, suppliers, brandMCats,
  initialSelectedBrandIds, initialSpecValue, initialPriceBucket, initialCertification
}: CategoryBrandsViewProps) {
  const router = useRouter();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const { setFrozen } = useScrollChrome();
  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<string>>(new Set(initialSelectedBrandIds));
  const [selectedSpecValue, setSelectedSpecValue] = useState<string | null>(initialSpecValue ?? null);
  const [selectedPriceBucket, setSelectedPriceBucket] = useState<number | null>(
    initialPriceBucket !== undefined && !isNaN(initialPriceBucket) ? initialPriceBucket : null
  ); // bucket index
  const [selectedCertification, setSelectedCertification] = useState<string | null>(initialCertification ?? null);
  // Filters now live in a bottom-sheet triggered from the header's filter icon, not an
  // inline collapsible — never auto-opens (even with a filter already applied via a
  // shared link, the active-count badge on the icon is enough of a signal on its own).
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Lets a buyer with many options (e.g. a category with a dozen certifications) jump
  // straight to the one they want instead of scanning every chip row.
  const [filterSearch, setFilterSearch] = useState('');
  // Header search — separate from filterSearch above; this one is the site-wide product/
  // brand/model search (replaces the floating MobileSearchBar on this page, moved inline
  // with the breadcrumb so it doesn't cost its own row of vertical space).
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  // Freeze scroll-driven chrome (BottomNav/search-bar hide-on-scroll) while the filter
  // sheet has focus — same pattern already used for the RFQ modal and Compare's Add-Seller sheet.
  useEffect(() => {
    setFrozen(filtersOpen);
    return () => setFrozen(false);
  }, [filtersOpen, setFrozen]);

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

  const displayedBrands = useMemo(() => {
    if (!certifiedBrandIds) return brands;
    return brands.filter(b => certifiedBrandIds.has(b.id));
  }, [brands, certifiedBrandIds]);

  const sortedByRating = [...displayedBrands].sort((a, b) => b.rating - a.rating);

  // Seller availability per brand, scoped to this MCat's products only
  const sellerCountByBrand = useMemo(() => {
    const map = new Map<string, number>();
    suppliers.forEach(s => map.set(s.brandId, (map.get(s.brandId) || 0) + 1));
    return map;
  }, [suppliers]);

  // One representative product image per brand for the brand card — a real photo reads
  // far better than a text/logo tile, and gives the buyer a concrete sense of what the
  // brand actually makes in this category. Independent of the spec/price filters (those
  // only affect Top Model/comparison sections below).
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

  // Aggregated real-world applications across every brand's line in this MCat
  const allApplications = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    brandMCats.forEach(m => m.applications.forEach(a => {
      if (!seen.has(a)) { seen.add(a); result.push(a); }
    }));
    return result.slice(0, 8);
  }, [brandMCats]);

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

  // One representative (highest-priced / most capable) model per brand
  const topModelPerBrand = useMemo(() => {
    const byBrand = new Map<string, Product>();
    filteredProducts.forEach(p => {
      const existing = byBrand.get(p.brandId);
      if (!existing || leadingPrice(p.priceRange) > leadingPrice(existing.priceRange)) {
        byBrand.set(p.brandId, p);
      }
    });
    return [...byBrand.values()];
  }, [filteredProducts]);

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

  const hasActiveFilters = selectedBrandIds.size > 0 || !!selectedSpecValue || selectedPriceBucket !== null || !!selectedCertification;
  const activeFilterCount = selectedBrandIds.size + (selectedSpecValue ? 1 : 0) + (selectedPriceBucket !== null ? 1 : 0) + (selectedCertification ? 1 : 0);

  // Search narrows every filter-chip row at once (spec ranges, brands, price bands,
  // certifications) so a buyer with many options can jump straight to the one they want.
  const filterSearchQuery = filterSearch.trim().toLowerCase();
  const searchedSpecValues = filterSearchQuery ? specValues.filter(v => v.toLowerCase().includes(filterSearchQuery)) : specValues;
  const searchedBrands = filterSearchQuery ? brands.filter(b => b.name.toLowerCase().includes(filterSearchQuery)) : brands;
  const searchedPriceBuckets = filterSearchQuery ? priceBuckets.filter(b => b.label.toLowerCase().includes(filterSearchQuery)) : priceBuckets;
  const searchedCertifications = filterSearchQuery ? availableCertifications.filter(c => c.toLowerCase().includes(filterSearchQuery)) : availableCertifications;

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
      router.push(`/search?q=${encodeURIComponent(headerSearchQuery)}`);
    }
  };

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      {/* Header — search and filters live in the same row as the breadcrumb (replaces the
          separate floating search pill this page used to show above it), so orientation,
          search, and filtering are all one compact block instead of three. */}
      <div className="bg-surface border-b border-line px-4 md:px-8 py-2.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <BackButton fallbackHref="/categories" title="Back to all categories" className="p-1.5 hover:bg-slate-100 rounded-full transition shrink-0" />
          {headerSearchOpen ? (
            <form onSubmit={handleHeaderSearchSubmit} className="flex-1 flex items-center gap-2 min-w-0">
              <div className="relative flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                className="text-[10.5px] font-bold text-slate-500 shrink-0 px-1"
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
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 shrink-0 transition"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 shrink-0 transition"
                aria-label="Filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-cta text-white text-[8px] font-black rounded-full flex items-center justify-center ring-1 ring-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
        {!headerSearchOpen && (
          <p className="font-heading font-extrabold text-sm text-primary tracking-tight truncate mt-1">
            {category.name} Brands
            <span className="font-semibold text-slate-400 text-[10px] ml-1.5">
              · {brands.length} {brands.length === 1 ? 'brand' : 'brands'} · {products.length} {products.length === 1 ? 'model' : 'models'}
            </span>
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 space-y-5">
          {brands.length === 0 ? (
            <div className="bg-surface border border-line rounded-2xl p-8 text-center text-slate-400 text-xs">
              No branded catalog is listed for {category.name} yet. Send a requirement and we'll match you with verified manufacturers.
            </div>
          ) : (
            <>
              {/* Feature teaser — Compare Brands and Top Model From Each Brand both exist
                  further down but aren't visible until scrolled to; advertise + jump now. */}
              <div className="flex gap-2">
                <a href="#brand-comparison" className="flex-1 bg-surface border border-line rounded-xl px-3 py-2 text-center text-[10.5px] font-bold text-accent-blue hover:border-accent-blue/40 transition">
                  ⇄ Compare Brands
                </a>
                <a href="#top-models" className="flex-1 bg-surface border border-line rounded-xl px-3 py-2 text-center text-[10.5px] font-bold text-accent-blue hover:border-accent-blue/40 transition">
                  ★ Top Models
                </a>
              </div>

              {/* Brand Cards — a horizontally-scrolling rail (2.5 cards visible, matching Top
                  Models below) rather than a vertical grid, so a buyer sees more of the
                  category — comparison table, top models, buying guide — without endless
                  scrolling past every brand card first. */}
              <section>
                <h2 className="font-heading font-bold text-sm text-primary mb-2.5">
                  Brands in {category.name}{selectedCertification ? ` — ${selectedCertification}` : ''}
                </h2>
                {displayedBrands.length === 0 ? (
                  <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 text-xs">
                    No brands in {category.name} hold {selectedCertification} yet.{' '}
                    <button onClick={() => setSelectedCertification(null)} className="text-accent-blue font-bold hover:underline">Clear this filter</button> to see all brands.
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
                            <div className="w-10 h-10 bg-white border border-line rounded-xl flex items-center justify-center overflow-hidden p-1.5">
                              <BrandLogo logo={brand.logo} name={brand.name} />
                            </div>
                          )}
                        </div>
                        <div className="p-2 flex-1 flex flex-col min-w-0">
                          <h3 className="font-extrabold text-[10.5px] text-slate-900 truncate leading-tight">{brand.name}</h3>
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

              {/* Brand Comparison */}
              {displayedBrands.length > 1 && (
                <section id="brand-comparison" className="scroll-mt-16">
                  <h2 className="font-heading font-bold text-sm text-primary mb-2.5">Brand Comparison</h2>
                  {/* Capped to ~5 rows visible, scrollable for the rest — a category with
                      10 brands shouldn't force a buyer to scroll past a 10-row table just to
                      reach what's below it. Header stays pinned while scrolling through rows. */}
                  <div className="bg-surface border border-line rounded-2xl overflow-auto shadow-xs max-h-[230px]">
                    <table className="w-full text-left text-[11px] border-collapse min-w-[520px]">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-canvas">
                          <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Brand</th>
                          <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Rating</th>
                          <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Established</th>
                          <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Mfg. Units</th>
                          <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Countries</th>
                          <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Verified</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedByRating.map((brand, idx) => (
                          <tr key={brand.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-canvas/50'}>
                            <td className="px-3 py-2.5 font-bold text-primary border-b border-line whitespace-nowrap">
                              <Link href={brandHref(brand.id)} className="hover:text-accent-blue">{brand.name}</Link>
                            </td>
                            <td className="px-3 py-2.5 text-slate-700 border-b border-line whitespace-nowrap">
                              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{brand.rating}</span>
                            </td>
                            <td className="px-3 py-2.5 text-slate-700 border-b border-line whitespace-nowrap">{brand.establishedYear}</td>
                            <td className="px-3 py-2.5 text-slate-700 border-b border-line whitespace-nowrap">{brand.manufacturingUnits}</td>
                            <td className="px-3 py-2.5 text-slate-700 border-b border-line whitespace-nowrap">{brand.countriesServed}+</td>
                            <td className="px-3 py-2.5 border-b border-line whitespace-nowrap">
                              {brand.verified ? <span className="text-accent-green font-bold">Yes</span> : <span className="text-slate-400">Pending</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Secondary CTA — a second, softer nudge right after the comparison table,
                      visually distinct from the sticky footer bar so it reads as a fresh
                      prompt rather than a duplicate. One compact row at every width — no
                      icon circle or stacked layout eating extra height on mobile. */}
                  <div className="mt-2.5 bg-accent-green/5 border border-accent-green/20 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-accent-green shrink-0" />
                    <p className="flex-1 min-w-0 text-[10.5px] font-bold text-slate-800 leading-snug">
                      Done comparing? <span className="text-slate-500 font-medium">One request reaches every seller.</span>
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

              {/* Top Model From Each Brand — same 2.5-cards-visible rail treatment as the
                  Brand Cards above it, for a consistent horizontal-scroll language. */}
              {topModelPerBrand.length > 0 && (
                <section id="top-models" className="scroll-mt-16">
                  <h2 className="font-heading font-bold text-sm text-primary mb-2.5">Top Model From Each Brand{hasActiveFilters ? ' (Filtered)' : ''}</h2>
                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
                    {topModelPerBrand.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.id}`}
                        className="bg-surface border border-line rounded-xl p-2.5 w-[138px] shrink-0 hover:border-accent-blue/40 transition"
                      >
                        <div className="h-16 bg-canvas rounded-lg flex items-center justify-center mb-2">
                          <img src={prod.image} alt={prod.name} className="max-h-14 max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{prod.brandName.split(' ')[0]}</p>
                        <p className="text-[10.5px] font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">{prod.name}</p>
                        <p className="text-[10px] font-black text-primary mt-1">
                          {prod.priceRange.split(' - ')[0]}
                          {prod.priceRange.includes(' - ') && <span className="text-[8.5px] font-semibold text-slate-400"> onwards</span>}
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
              {topModelPerBrand.length === 0 && hasActiveFilters && (
                <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 text-xs">
                  No models match these filters. <button onClick={clearFilters} className="text-accent-blue font-bold hover:underline">Clear filters</button> to see all models.
                </div>
              )}
            </>
          )}

          {/* Buying Guide */}
          <section>
            <h2 className="font-heading font-bold text-sm text-primary mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-accent-purple" />
              Buying Guide
            </h2>
            <div className="bg-surface border border-line rounded-2xl p-4 space-y-2.5 text-[11px] text-slate-600 leading-relaxed">
              <p><strong className="text-slate-900">1. Confirm the exact model &amp; specification</strong> — match your requirement to the exact model, not just the brand, before requesting quotes.</p>
              <p><strong className="text-slate-900">2. Check trust badges</strong> — look for Verified Supplier, Authorized Dealer, and Manufacturer/OEM badges to confirm who you're really buying from.</p>
              <p><strong className="text-slate-900">3. Compare at least 2-3 brands</strong> — use the brand comparison table above to weigh rating, manufacturing scale, and years in business.</p>
              <p><strong className="text-slate-900">4. Get quotes from multiple verified sellers</strong> — pricing, delivery time, and after-sales support can vary meaningfully between sellers of the same brand.</p>
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="font-heading font-bold text-sm text-primary mb-2.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-accent-blue" />
              Frequently Asked Questions
            </h2>
            <div className="bg-surface border border-line rounded-2xl divide-y divide-line">
              <div className="p-4">
                <p className="text-[12px] font-bold text-slate-800">How many verified brands are available for {category.name}?</p>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{brands.length} verified {brands.length === 1 ? 'brand is' : 'brands are'} currently listed, each with authorized sellers you can compare directly.</p>
              </div>
              <div className="p-4">
                <p className="text-[12px] font-bold text-slate-800">What's the difference between comparing brands here vs. comparing sellers?</p>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">This page compares manufacturers (brands). Once you pick a brand and model, the product page lets you compare the specific sellers authorized to sell it.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky CTA — primary action is Compare Brands, Get Quotes stays available as a secondary path */}
      <div className="border-t border-line p-4 bg-surface shrink-0">
        <div className="max-w-5xl mx-auto flex items-center gap-2.5">
          <Link
            href={`/compare?category=${category.id}`}
            className="flex-1 md:flex-none md:px-10 bg-cta hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
          >
            <GitCompare className="w-4 h-4" />
            Compare Brands
          </Link>
          <button
            onClick={handleGetQuotes}
            className="shrink-0 px-4 py-3.5 bg-canvas hover:bg-line border border-line text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden md:inline">Get Quotes</span>
          </button>
        </div>
      </div>

      {/* Refine Results — bottom sheet, triggered by the header's filter icon. Replaces the
          old inline collapsible so filtering is opt-in via a real UI control, not a card
          competing for space in the page's own scroll flow. */}
      {filtersOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative w-full max-w-5xl bg-surface rounded-t-3xl max-h-[82vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
              <h3 className="font-heading font-bold text-sm text-primary flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-accent-blue" />
                Refine Results
                {activeFilterCount > 0 && (
                  <span className="bg-accent-blue text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </h3>
              <button onClick={() => setFiltersOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Search narrows every chip row below at once — faster than scanning/
                  scrolling through them for categories with many options. */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search brand, spec or certification..."
                  className="w-full bg-canvas border border-line rounded-xl pl-9 pr-8 py-2.5 text-[11px] font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-medium outline-none focus:border-accent-blue/50"
                />
                {filterSearch && (
                  <button onClick={() => setFilterSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {(searchedSpecValues.length > 0 || allApplications.length > 0) && (
                <div className="bg-canvas border border-line rounded-2xl p-4 space-y-2.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Popular {keySpecLabel} Ranges &amp; Applications</span>
                  {searchedSpecValues.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
                      {searchedSpecValues.map((val) => (
                        <button
                          key={val}
                          onClick={() => setSelectedSpecValue(prev => prev === val ? null : val)}
                          className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold border transition ${
                            selectedSpecValue === val
                              ? 'bg-accent-blue text-white border-accent-blue'
                              : 'bg-surface border-line text-slate-700 hover:border-accent-blue/40'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}
                  {allApplications.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
                      {allApplications.map((app, idx) => (
                        <span key={idx} className="shrink-0 bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-full px-2.5 py-1 text-[10px] font-bold whitespace-nowrap">
                          {app}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(searchedBrands.length > 0 || searchedPriceBuckets.length > 0 || searchedCertifications.length > 0) && (
                <div className="bg-canvas border border-line rounded-2xl p-4 space-y-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Filter by Brand, Price &amp; Certification</span>
                  {searchedBrands.length > 0 && (
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Brand</span>
                      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
                        {searchedBrands.map((brand) => (
                          <button
                            key={brand.id}
                            onClick={() => toggleBrandFilter(brand.id)}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold border transition ${
                              selectedBrandIds.has(brand.id)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface border-line text-slate-700 hover:border-accent-blue/40'
                            }`}
                          >
                            {brand.name.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchedPriceBuckets.length > 0 && (
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Price</span>
                      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
                        {searchedPriceBuckets.map((bucket) => {
                          const idx = priceBuckets.indexOf(bucket);
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedPriceBucket(prev => prev === idx ? null : idx)}
                              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold border transition whitespace-nowrap ${
                                selectedPriceBucket === idx
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-surface border-line text-slate-700 hover:border-accent-blue/40'
                              }`}
                            >
                              {bucket.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {searchedCertifications.length > 0 && (
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Certification</span>
                      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
                        {searchedCertifications.map((cert) => (
                          <button
                            key={cert}
                            onClick={() => setSelectedCertification(prev => prev === cert ? null : cert)}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold border transition whitespace-nowrap ${
                              selectedCertification === cert
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface border-line text-slate-700 hover:border-accent-blue/40'
                            }`}
                          >
                            {cert}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {filterSearchQuery && searchedSpecValues.length === 0 && searchedBrands.length === 0 && searchedPriceBuckets.length === 0 && searchedCertifications.length === 0 && (
                <div className="text-center text-[11px] text-slate-400 py-2">No filters match &quot;{filterSearch}&quot;.</div>
              )}
            </div>

            <div className="p-4 border-t border-line shrink-0 flex gap-2">
              {hasActiveFilters && (
                <button onClick={clearFilters} className="px-4 py-3 border border-line rounded-xl text-xs font-bold text-slate-600 hover:bg-canvas transition">
                  Clear
                </button>
              )}
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex-1 bg-cta hover:bg-cta-hover text-white py-3 rounded-xl font-bold text-xs transition"
              >
                Show {displayedBrands.length} {displayedBrands.length === 1 ? 'Brand' : 'Brands'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
