import React from 'react';
import Link from 'next/link';
import { Search, Package, Building2, Layers, ChevronRight } from 'lucide-react';
import { Product, Brand, MCat, BrandMCat } from '../types';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';

interface SearchResultsViewProps {
  query: string;
  products: Product[];
  brands: Brand[];
  categories: MCat[];
  brandMCats: BrandMCat[];
}

export default function SearchResultsView({ query, products, brands, categories, brandMCats }: SearchResultsViewProps) {
  const totalCount = products.length + brands.length + categories.length + brandMCats.length;

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      <div className="bg-surface border-b border-line px-4 md:px-8 py-4 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <h1 className="font-heading font-bold text-sm text-primary">
            Results for <span className="text-cta">&ldquo;{query}&rdquo;</span>
          </h1>
        </div>
        <p className="text-[10px] text-slate-400 font-semibold max-w-5xl mx-auto mt-1">{totalCount} matches across products, brands, categories &amp; product lines</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8">
          {totalCount === 0 ? (
            <div className="bg-surface border border-line rounded-2xl p-8 text-center text-slate-400 text-xs">
              No matches for &ldquo;{query}&rdquo;. Try a broader term, or{' '}
              <Link href="/categories" className="text-accent-blue font-bold hover:underline">browse categories</Link>.
            </div>
          ) : (
            <>
              {brandMCats.length > 0 && (
                <section>
                  <h2 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Product Lines
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {brandMCats.map((mcat) => (
                      <Link
                        key={mcat.id}
                        href={`/brands/${mcat.brandId}/${mcat.mcatId}`}
                        className="bg-surface border border-line rounded-xl p-3 flex items-center justify-between hover:border-accent-blue/40 transition"
                      >
                        <div className="min-w-0">
                          <h3 className="font-bold text-[11px] text-slate-900 truncate">{mcat.name}</h3>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">{mcat.tagline}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {products.length > 0 && (
                <section>
                  <h2 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Products
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {products.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.id}`}
                        className="bg-surface border border-line rounded-xl flex overflow-hidden hover:border-accent-blue/40 transition"
                      >
                        <div className="w-16 bg-canvas border-r border-line flex items-center justify-center p-1.5 shrink-0">
                          <img src={prod.image} alt={prod.name} className="max-h-12 max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                        <div className="p-2.5 min-w-0">
                          <p className="text-[8.5px] text-slate-400 font-bold uppercase truncate">{prod.brandName.split(' ')[0]}</p>
                          <p className="text-[10.5px] font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">{prod.name}</p>
                          <p className="text-[10px] font-black text-primary mt-1">{prod.priceRange.split(' - ')[0]}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {brands.length > 0 && (
                <section>
                  <h2 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Brands
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/brands/${brand.id}`}
                        className="bg-surface border border-line rounded-xl p-2.5 flex items-center gap-2 hover:border-accent-blue/40 transition"
                      >
                        <div className="w-8 h-8 bg-white border border-line rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-1">
                          <BrandLogo logo={brand.logo} name={brand.name} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 truncate">{brand.name}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {categories.length > 0 && (
                <section>
                  <h2 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Categories
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.id}`}
                        className="bg-surface border border-line rounded-xl p-2.5 flex items-center gap-2 hover:border-accent-blue/40 transition"
                      >
                        <div className="w-8 h-8 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue shrink-0">
                          <CategoryIcon icon={cat.icon} className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 truncate">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
