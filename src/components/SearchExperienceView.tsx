'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Clock, Package, Building2, Layers, X } from 'lucide-react';
import { Brand, Product, MCat, BrandMCat } from '../types';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';
import { AnimatedIcon } from './AnimatedIcon';
import { BackButton } from './BackButton';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import { useSearchHistory } from './SearchHistoryProvider';
import { getCatalogSuggestions, CatalogSuggestion } from '../lib/searchMatch';

interface SearchExperienceViewProps {
  initialQuery: string;
  brands: Brand[];
  products: Product[];
  categories: MCat[];
  brandMCats: BrandMCat[];
}

const TYPE_ICON = { product: Package, brand: Building2, brandMCat: Package, category: Layers } as const;
const TYPE_LABEL = { product: 'Product', brand: 'Brand', brandMCat: 'Product Line', category: 'Category' } as const;

// A dedicated search screen (not an inline dropdown) — tapping the search bar anywhere in
// the app lands here, matching a "search as its own place" pattern rather than an overlay
// competing for space on whatever page triggered it. Before typing, it surfaces Recently
// Viewed plus brands/product-lines derived from that same signal (never a separate,
// invented "search history" log) so there's always something useful on screen, not a blank
// input. Once typing resumes, live suggestions replace that landing content immediately —
// no debounce needed since matching runs client-side against the already-loaded catalog.
export default function SearchExperienceView({ initialQuery, brands, products, categories, brandMCats }: SearchExperienceViewProps) {
  const router = useRouter();
  const { recentlyViewed } = useRecentlyViewed();
  const { trackSearch } = useSearchHistory();
  const [query, setQuery] = useState(initialQuery);
  const trimmedQuery = query.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmedQuery) {
      trackSearch(trimmedQuery);
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const suggestions = useMemo(
    () => (trimmedQuery ? getCatalogSuggestions(trimmedQuery, { products, brands, categories, brandMCats }, 12) : []),
    [trimmedQuery, products, brands, categories, brandMCats]
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
      const category = categories.find(c => c.id === entry.id);
      return category ? { href: `/categories/${category.id}`, name: category.name, sub: 'Category', icon: category.icon } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  // Recommended brands/product-lines derive entirely from Recently Viewed — no separate
  // "search history" tracking. Falls back to top-rated/first-listed when a buyer has
  // nothing viewed yet, so a first-time visit still shows something useful, not a void.
  const { recommendedBrands, recommendedBrandMCats } = useMemo(() => {
    const recentCategoryIds = new Set<string>();
    const recentBrandIds = new Set<string>();
    recentlyViewed.forEach(entry => {
      if (entry.type === 'brand') recentBrandIds.add(entry.id);
      else if (entry.type === 'category') recentCategoryIds.add(entry.id);
      else {
        const product = products.find(p => p.id === entry.id);
        if (product) recentBrandIds.add(product.brandId);
      }
    });
    // A viewed category is a real signal too — brands active in that category are
    // relevant even if the buyer never opened one of their specific product pages.
    recentCategoryIds.forEach(mcatId => {
      brandMCats.filter(m => m.mcatId === mcatId).forEach(m => recentBrandIds.add(m.brandId));
    });

    const recBrands = recentBrandIds.size > 0
      ? brands.filter(b => recentBrandIds.has(b.id))
      : [...brands].sort((a, b) => b.rating - a.rating).slice(0, 6);

    const recentBrandMCatIds = new Set<string>();
    recentlyViewed.forEach(entry => {
      if (entry.type === 'product') {
        const product = products.find(p => p.id === entry.id);
        if (product?.brandMCatId) recentBrandMCatIds.add(product.brandMCatId);
      }
    });
    recentCategoryIds.forEach(mcatId => {
      brandMCats.filter(m => m.mcatId === mcatId).forEach(m => recentBrandMCatIds.add(m.id));
    });
    recentBrandIds.forEach(brandId => {
      brandMCats.filter(m => m.brandId === brandId).forEach(m => recentBrandMCatIds.add(m.id));
    });

    const recMCats = recentBrandMCatIds.size > 0
      ? brandMCats.filter(m => recentBrandMCatIds.has(m.id)).slice(0, 6)
      : brandMCats.slice(0, 6);

    return { recommendedBrands: recBrands.slice(0, 6), recommendedBrandMCats: recMCats };
  }, [recentlyViewed, brands, products, brandMCats]);

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      <div className="bg-surface border-b border-line px-3 py-2.5 flex items-center gap-2 shrink-0">
        <BackButton fallbackHref="/" title="Back to Home" className="p-1.5 hover:bg-slate-100 rounded-full transition shrink-0" />
        <form onSubmit={handleSubmit} className="relative flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product, brand, model or specification"
            className="w-full bg-canvas border border-line rounded-full pl-8 pr-8 py-2 text-xs outline-none focus:border-accent-blue/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-5 space-y-7">
          {trimmedQuery ? (
            /* Live suggestions — replaces the landing content the instant typing starts */
            suggestions.length === 0 ? (
              <div className="bg-surface border border-line rounded-2xl p-8 text-center text-slate-400 text-xs">
                No matches for &ldquo;{trimmedQuery}&rdquo;. Try a broader term, or{' '}
                <Link href="/categories" className="text-accent-blue font-bold hover:underline">browse categories</Link>.
              </div>
            ) : (
              <section>
                <h2 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5">Suggestions</h2>
                <div className="space-y-1.5">
                  {suggestions.map((s: CatalogSuggestion) => {
                    const Icon = TYPE_ICON[s.type];
                    return (
                      <Link
                        key={`${s.type}-${s.id}`}
                        href={s.href}
                        onClick={() => trackSearch(trimmedQuery)}
                        className="flex items-center gap-2.5 bg-surface border border-line rounded-xl px-3 py-2.5 hover:border-accent-blue/40 transition"
                      >
                        <div className="w-8 h-8 rounded-lg bg-canvas border border-line overflow-hidden flex items-center justify-center shrink-0 p-1">
                          {s.image ? (
                            <img src={s.image} alt={s.label} className="w-full h-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                          ) : s.logo ? (
                            <BrandLogo logo={s.logo} name={s.label} />
                          ) : (
                            <Icon className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-slate-900 truncate">{s.label}</p>
                          <p className="text-[9.5px] text-slate-400 truncate">{s.sublabel}</p>
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide shrink-0">{TYPE_LABEL[s.type]}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )
          ) : (
            /* Landing state — Recently Viewed + recommendations derived from it */
            <>
              {recentItems.length > 0 && (
                <section>
                  <h2 className="font-heading font-bold text-sm text-primary mb-3 flex items-center gap-1.5">
                    <AnimatedIcon icon={Clock} variant="tick" className="w-4 h-4 text-slate-400" />
                    Recently Viewed
                  </h2>
                  <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5">
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
                            <Package className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 truncate leading-tight">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {recommendedBrands.length > 0 && (
                <section>
                  <h2 className="font-heading font-bold text-sm text-primary mb-3">
                    {recentItems.length > 0 ? 'Recommended Brands' : 'Popular Brands'}
                  </h2>
                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
                    {recommendedBrands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/brands/${brand.id}`}
                        className="bg-surface border border-line rounded-xl p-3 w-[110px] shrink-0 flex flex-col items-center gap-2 hover:border-accent-blue/40 transition"
                      >
                        <div className="w-12 h-12 bg-white border border-line rounded-lg flex items-center justify-center overflow-hidden p-1.5">
                          <BrandLogo logo={brand.logo} name={brand.name} />
                        </div>
                        <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight line-clamp-2">
                          {brand.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {recommendedBrandMCats.length > 0 && (
                <section>
                  <h2 className="font-heading font-bold text-sm text-primary mb-3">
                    {recentItems.length > 0 ? 'Recommended Product Lines' : 'Popular Product Lines'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {recommendedBrandMCats.map((mcat) => (
                      <Link
                        key={mcat.id}
                        href={`/brands/${mcat.brandId}/${mcat.mcatId}`}
                        className="bg-surface border border-line rounded-xl p-3 flex items-center justify-between hover:border-accent-blue/40 transition"
                      >
                        <div className="min-w-0">
                          <h3 className="font-bold text-[11px] text-slate-900 truncate">{mcat.name}</h3>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">{mcat.tagline}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="font-heading font-bold text-sm text-primary mb-3">Browse Categories</h2>
                <div className="grid grid-cols-2 min-[420px]:grid-cols-3 gap-2.5">
                  {categories.slice(0, 6).map((cat) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
