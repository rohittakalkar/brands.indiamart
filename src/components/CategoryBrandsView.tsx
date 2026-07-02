'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Send, BookOpen, HelpCircle, GitCompare, SlidersHorizontal, X, ShieldCheck } from 'lucide-react';
import { MCat, Brand, Product, Supplier, BrandMCat } from '../types';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';
import { TrustBadge } from './TrustBadge';
import { useBuyLeadModal } from './BuyLeadModalProvider';

interface CategoryBrandsViewProps {
  category: MCat;
  industryName: string;
  brands: Brand[];
  products: Product[];
  suppliers: Supplier[];
  brandMCats: BrandMCat[];
}

function leadingPrice(priceRange: string): number {
  const match = priceRange.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function CategoryBrandsView({ category, industryName, brands, products, suppliers, brandMCats }: CategoryBrandsViewProps) {
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<string>>(new Set());
  const [selectedSpecValue, setSelectedSpecValue] = useState<string | null>(null);
  const [selectedPriceBucket, setSelectedPriceBucket] = useState<number | null>(null); // bucket index

  const sortedByRating = [...brands].sort((a, b) => b.rating - a.rating);

  // Seller availability per brand, scoped to this MCat's products only
  const sellerCountByBrand = useMemo(() => {
    const map = new Map<string, number>();
    suppliers.forEach(s => map.set(s.brandId, (map.get(s.brandId) || 0) + 1));
    return map;
  }, [suppliers]);

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
      if (selectedPriceBucket !== null) {
        const bucket = priceBuckets[selectedPriceBucket];
        const price = leadingPrice(p.priceRange);
        if (!bucket || price < bucket.min || price >= bucket.max) return false;
      }
      return true;
    });
  }, [products, selectedBrandIds, selectedSpecValue, selectedPriceBucket, priceBuckets]);

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
  };

  const hasActiveFilters = selectedBrandIds.size > 0 || !!selectedSpecValue || selectedPriceBucket !== null;

  const handleGetQuotes = () => {
    openBuyLeadForm({
      productName: category.name,
      requirement: `Looking for verified brands and sellers in ${category.name}. Please share options with pricing and availability.`
    });
  };

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-surface border-b border-line px-4 md:px-8 py-3 flex items-center gap-3 shrink-0">
        <Link href="/categories" className="p-1.5 hover:bg-slate-100 rounded-full transition shrink-0">
          <ArrowLeft className="w-4 h-4 text-slate-800" />
        </Link>
        <div className="min-w-0">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block truncate">{industryName}</span>
          <h1 className="font-heading font-extrabold text-sm md:text-base text-primary tracking-tight truncate">{category.name} Brands</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Category Hero */}
        <div className="bg-gradient-to-r from-primary to-secondary px-4 md:px-8 py-7 md:py-10 text-white">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <CategoryIcon icon={category.icon} className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl md:text-3xl tracking-tight">Compare {category.name} Brands</h1>
              <p className="text-sm md:text-base text-white/75 mt-1">
                {brands.length} verified {brands.length === 1 ? 'brand' : 'brands'} · {products.length} {products.length === 1 ? 'model' : 'models'} available
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8">
          {brands.length === 0 ? (
            <div className="bg-surface border border-line rounded-2xl p-8 text-center text-slate-400 text-xs">
              No branded catalog is listed for {category.name} yet. Send a requirement and we'll match you with verified manufacturers.
            </div>
          ) : (
            <>
              {/* Popular Capacity Ranges & Applications */}
              {(specValues.length > 0 || allApplications.length > 0) && (
                <section>
                  <h2 className="font-heading font-bold text-sm text-primary mb-3">Popular {keySpecLabel} Ranges &amp; Applications</h2>
                  <div className="space-y-2.5">
                    {specValues.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {specValues.map((val) => (
                          <button
                            key={val}
                            onClick={() => setSelectedSpecValue(prev => prev === val ? null : val)}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold border transition ${
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
                      <div className="flex flex-wrap gap-1.5">
                        {allApplications.map((app, idx) => (
                          <span key={idx} className="bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-full px-2.5 py-1 text-[10px] font-bold">
                            {app}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Filters */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-heading font-bold text-sm text-primary flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-accent-blue" />
                    Filter by Brand &amp; Price
                  </h2>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="flex items-center gap-1 text-[10px] font-bold text-accent-blue hover:underline">
                      <X className="w-3 h-3" /> Clear Filters
                    </button>
                  )}
                </div>
                <div className="bg-surface border border-line rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Brand</span>
                    <div className="flex flex-wrap gap-2">
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => toggleBrandFilter(brand.id)}
                          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold border transition ${
                            selectedBrandIds.has(brand.id)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-canvas border-line text-slate-700 hover:border-accent-blue/40'
                          }`}
                        >
                          {brand.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  {priceBuckets.length > 0 && (
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Price</span>
                      <div className="flex flex-wrap gap-2">
                        {priceBuckets.map((bucket, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPriceBucket(prev => prev === idx ? null : idx)}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold border transition ${
                              selectedPriceBucket === idx
                                ? 'bg-primary text-white border-primary'
                                : 'bg-canvas border-line text-slate-700 hover:border-accent-blue/40'
                            }`}
                          >
                            {bucket.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Brand Cards */}
              <section>
                <h2 className="font-heading font-bold text-sm text-primary mb-3">Brands in {category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${brand.id}`}
                      className="bg-surface border border-line rounded-2xl p-3.5 flex items-start gap-3 hover:border-accent-blue/40 transition shadow-xs"
                    >
                      <div className="w-11 h-11 bg-canvas border border-line rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-1.5 bg-white">
                        <BrandLogo logo={brand.logo} name={brand.name} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-[12px] text-slate-900 truncate">{brand.name}</h3>
                        <p className="text-[9.5px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">{brand.description}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <TrustBadge type="manufacturer-oem" who={brand.name} />
                          {brand.verified && <TrustBadge type="verified-supplier" who="IndiaMART" since={brand.verifiedSince} />}
                        </div>
                        {(sellerCountByBrand.get(brand.id) || 0) > 0 && (
                          <div className="flex items-center gap-1 mt-1.5 text-[10px] font-bold text-accent-green">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{sellerCountByBrand.get(brand.id)} Authorized Seller{sellerCountByBrand.get(brand.id) !== 1 ? 's' : ''} Available</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Brand Comparison */}
              {brands.length > 1 && (
                <section>
                  <h2 className="font-heading font-bold text-sm text-primary mb-3">Brand Comparison</h2>
                  <div className="bg-surface border border-line rounded-2xl overflow-x-auto shadow-xs">
                    <table className="w-full text-left text-[11px] border-collapse min-w-[520px]">
                      <thead>
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
                              <Link href={`/brands/${brand.id}`} className="hover:text-accent-blue">{brand.name}</Link>
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
                </section>
              )}

              {/* Top Model From Each Brand */}
              {topModelPerBrand.length > 0 && (
                <section>
                  <h2 className="font-heading font-bold text-sm text-primary mb-3">Top Model From Each Brand{hasActiveFilters ? ' (Filtered)' : ''}</h2>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {topModelPerBrand.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.id}`}
                        className="bg-surface border border-line rounded-xl p-2.5 w-[150px] shrink-0 hover:border-accent-blue/40 transition"
                      >
                        <div className="h-16 bg-canvas rounded-lg flex items-center justify-center mb-2">
                          <img src={prod.image} alt={prod.name} className="max-h-14 max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{prod.brandName.split(' ')[0]}</p>
                        <p className="text-[10.5px] font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">{prod.name}</p>
                        <p className="text-[10px] font-black text-primary mt-1">{prod.priceRange.split(' - ')[0]}</p>
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
            <h2 className="font-heading font-bold text-sm text-primary mb-3 flex items-center gap-1.5">
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
            <h2 className="font-heading font-bold text-sm text-primary mb-3 flex items-center gap-1.5">
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
    </div>
  );
}
