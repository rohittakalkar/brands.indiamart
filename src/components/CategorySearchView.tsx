'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Layers, ChevronRight, Heart } from 'lucide-react';
import { Category } from '../services/categories';
import type { CategoryFomoSummary } from '../lib/data';
import { CategoryIcon } from './CategoryIcon';
import { BrandLogo } from './BrandLogo';
import { useShortlist } from './ShortlistProvider';

interface CategorySearchViewProps {
  categories: Category[];
  categoryFomo: CategoryFomoSummary[];
}

export default function CategorySearchView({ categories, categoryFomo }: CategorySearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { shortlistedCategories, toggleShortlistCategory } = useShortlist();

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Real, BRAND_MCATS-joined counts (a brand like Havells or Siemens serves several
  // categories, so filtering on a brand's single "primary" mcatId undercounts every
  // category it doesn't happen to be the primary listing for) — same source of truth
  // the homepage FOMO rail and the category page itself already use.
  const fomoById = new Map(categoryFomo.map(f => [f.id, f]));

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden select-none font-sans text-slate-800">

      {/* Header & Search Section (styled like brands header with white background) */}
      <div className="bg-white border-b border-slate-100 p-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent-blue" />
              <span>Browse Categories</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
              Find the right category, then compare verified brands inside it
            </span>
          </div>
        </div>

        {/* Category Sourcing Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-slate-50 border border-slate-300 focus:border-accent-blue focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition font-semibold"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Categories scrollable list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No categories matching "{searchQuery}" found. Try another term or browse general machinery.
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const isShortlisted = shortlistedCategories.includes(cat.id);
            const fomo = fomoById.get(cat.id);
            const brandCount = fomo?.brandCount ?? 0;
            const productCount = fomo?.productCount ?? 0;
            const topBrands = fomo?.topBrands ?? [];

            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="block bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-accent-blue/40 transition duration-200"
              >
                {/* Category Main Bar — this is a category picker, not a product feed, so the
                    whole row is one tap target and nothing inside competes with it for
                    attention. Real per-category counts (brands, models) are the credibility
                    signal here, not individual product prices and buy buttons. */}
                <div className="p-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 bg-accent-blue/10 border border-accent-blue/20 rounded-xl flex items-center justify-center text-accent-blue shrink-0 shadow-xs">
                      <CategoryIcon icon={cat.icon} className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-[12px] text-slate-900 leading-tight truncate">
                        {cat.name}
                      </h3>
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                        {brandCount > 0
                          ? `${brandCount} Verified OEMs · ${productCount} Models`
                          : 'Direct Factory Catalogs'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleShortlistCategory(cat.id);
                      }}
                      className={`p-2 rounded-lg border transition ${
                        isShortlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                      }`}
                      title={isShortlisted ? "Remove from shortlist" : "Shortlist Category"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <div className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Top Brands — a compact credibility strip (who's actually in here), not a
                    product wall. Reinforces "real brands, not a generic catalog" at a glance. */}
                {topBrands.length > 0 && (
                  <div className="px-3.5 py-2.5 bg-white flex items-center gap-2">
                    <div className="flex -space-x-2 shrink-0">
                      {topBrands.map((b) => (
                        <div key={b.id} className="w-6 h-6 rounded-full bg-white ring-2 ring-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          <BrandLogo logo={b.logo} name={b.name} className="w-full h-full object-contain p-0.5" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[9.5px] font-semibold text-slate-500 truncate">
                      {topBrands.map(b => b.name.split(' ')[0]).join(', ')}
                      {brandCount > topBrands.length && ` +${brandCount - topBrands.length} more`}
                    </span>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
