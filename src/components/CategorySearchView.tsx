import React, { useState } from 'react';
import { Search, Layers, ChevronRight, Heart, Send, CheckCircle2, Building2 } from 'lucide-react';
import { CATEGORIES, BRANDS, PRODUCTS } from '../data';
import { Brand, Product } from '../types';

interface CategorySearchViewProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenBuyLeadForm: (data: Partial<any>) => void;
  shortlistedCategories: string[];
  onToggleShortlistCategory: (id: string) => void;
}

export default function CategorySearchView({
  onSelectCategory,
  onOpenBuyLeadForm,
  shortlistedCategories,
  onToggleShortlistCategory
}: CategorySearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter categories based on search input
  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to get number of brands in a category
  const getBrandCount = (catId: string) => {
    return BRANDS.filter(b => b.category === catId).length;
  };

  // Helper to get top products in a category
  const getProductsForCategory = (catId: string) => {
    return PRODUCTS.filter(p => p.category === catId).slice(0, 2);
  };

  return (
    <div className="flex-1 bg-[#f4f6f8] flex flex-col overflow-hidden select-none font-sans text-slate-800">
      
      {/* Header & Search Section (styled like brands header with white background) */}
      <div className="bg-white border-b border-slate-100 p-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#028384]" />
              <span>Category Search Hub</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
              Browse by industry directory or query specific OEM manufacturers
            </span>
          </div>
        </div>

        {/* Category Sourcing Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all B2B categories & industry divisions..."
            className="w-full bg-slate-50 border border-slate-300 focus:border-[#028384] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition font-semibold"
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
            const brandCount = getBrandCount(cat.id);
            const categoryProducts = getProductsForCategory(cat.id);

            return (
              <div
                key={cat.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-[#028384]/40 transition duration-200"
              >
                {/* Category Main Bar */}
                <div className="p-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <div 
                    onClick={() => onSelectCategory(cat.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-9 h-9 bg-teal-50 border border-teal-100/60 rounded-xl flex items-center justify-center text-[#028384] shrink-0 shadow-xs">
                      <Layers className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-[12px] text-slate-900 leading-tight truncate hover:text-[#028384] transition">
                        {cat.name}
                      </h3>
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                        {brandCount > 0 ? `${brandCount} Verified OEMs` : 'Direct Factory Catalogs'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Shortlist Category Button */}
                    <button
                      onClick={() => onToggleShortlistCategory(cat.id)}
                      className={`p-2 rounded-lg border transition ${
                        isShortlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                      }`}
                      title={isShortlisted ? "Remove from shortlist" : "Shortlist Category"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* View All Button */}
                    <button
                      onClick={() => onSelectCategory(cat.id)}
                      className="p-2 bg-white border border-slate-200 hover:border-[#028384] hover:text-[#028384] text-slate-500 rounded-lg transition"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-featured Products inside Category Card for Premium Sourcing */}
                {categoryProducts.length > 0 && (
                  <div className="p-3.5 space-y-3 bg-white">
                    <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#028384] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                      Top Verified Products
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {categoryProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-slate-50 border border-slate-200/50 rounded-xl p-2.5 flex flex-col justify-between space-y-2 relative"
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold text-[10px] text-slate-800 leading-snug line-clamp-2">
                              {prod.name}
                            </h4>
                            <span className="text-[8.5px] text-[#028384] font-black block">
                              {prod.priceRange.split(' - ')[0]}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              onOpenBuyLeadForm({
                                productName: prod.name,
                                brandName: prod.brandName,
                                requirement: `Hi, I am interested in procuring ${prod.name} from standard manufacturers. Please share delivery timeline & price quote.`
                              })
                            }
                            className="w-full py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <Send className="w-2.5 h-2.5" />
                            Get Quote
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
