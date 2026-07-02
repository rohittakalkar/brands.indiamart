import React, { useState } from 'react';
import { Heart, Trash2, Send, ChevronRight, Layers, Building2, Package, ShieldCheck, Star, Search, X } from 'lucide-react';
import { Brand, Product } from '../types';
import { PRODUCTS, BRANDS, CATEGORIES } from '../data';
import { BrandLogo } from './BrandLogo';

interface InlineSectionSearchProps {
  value: string;
  onChange: (val: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  placeholder?: string;
}

function InlineSectionSearch({
  value,
  onChange,
  isExpanded,
  setIsExpanded,
  placeholder = "Search..."
}: InlineSectionSearchProps) {
  return (
    <div className="flex items-center gap-1.5 transition-all duration-300 ml-auto">
      <div 
        className={`flex items-center bg-slate-50 border rounded-lg overflow-hidden transition-all duration-300 ${
          isExpanded 
            ? 'w-36 px-2 py-1 border-slate-300 bg-white' 
            : 'w-0 border-transparent p-0'
        }`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[10px] text-slate-700 placeholder-slate-400 outline-none font-bold h-4"
          autoFocus={isExpanded}
        />
        {isExpanded && value && (
          <button 
            type="button"
            onClick={() => onChange('')} 
            className="text-slate-400 hover:text-slate-600 font-extrabold text-[10px] shrink-0 ml-1"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          if (isExpanded) {
            onChange('');
          }
          setIsExpanded(!isExpanded);
        }}
        className={`p-1.5 rounded-lg transition duration-200 ${
          isExpanded 
            ? 'bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100/60' 
            : 'bg-slate-50 border border-slate-200/50 text-slate-500 hover:bg-[#f2faf9] hover:text-[#028384]'
        }`}
        title={isExpanded ? "Close search" : "Search this section"}
      >
        {isExpanded ? (
          <X className="w-3.5 h-3.5" />
        ) : (
          <Search className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

interface ShortlistedViewProps {
  shortlistedBrands: string[];
  shortlistedProducts: string[];
  shortlistedCategories: string[];
  onToggleShortlistBrand: (id: string) => void;
  onToggleShortlistProduct: (id: string) => void;
  onToggleShortlistCategory: (id: string) => void;
  onSelectBrand: (brand: Brand) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenBuyLeadForm: (data: Partial<any>) => void;
  onBrowseMore: () => void;
}

export default function ShortlistedView({
  shortlistedBrands,
  shortlistedProducts,
  shortlistedCategories,
  onToggleShortlistBrand,
  onToggleShortlistProduct,
  onToggleShortlistCategory,
  onSelectBrand,
  onSelectProduct,
  onSelectCategory,
  onOpenBuyLeadForm,
  onBrowseMore
}: ShortlistedViewProps) {
  // Section search query states
  const [productsSearchQuery, setProductsSearchQuery] = useState('');
  const [isProductsSearchExpanded, setIsProductsSearchExpanded] = useState(false);

  const [brandsSearchQuery, setBrandsSearchQuery] = useState('');
  const [isBrandsSearchExpanded, setIsBrandsSearchExpanded] = useState(false);

  const [categoriesSearchQuery, setCategoriesSearchQuery] = useState('');
  const [isCategoriesSearchExpanded, setIsCategoriesSearchExpanded] = useState(false);
  
  // Resolve object arrays from state lists
  const baseProducts = PRODUCTS.filter(p => shortlistedProducts.includes(p.id));
  const baseBrands = BRANDS.filter(b => shortlistedBrands.includes(b.id));
  const baseCategories = CATEGORIES.filter(c => shortlistedCategories.includes(c.id));

  const products = baseProducts.filter(p => 
    p.name.toLowerCase().includes(productsSearchQuery.toLowerCase()) ||
    p.brandName.toLowerCase().includes(productsSearchQuery.toLowerCase())
  );
  
  const brands = baseBrands.filter(b => 
    b.name.toLowerCase().includes(brandsSearchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(brandsSearchQuery.toLowerCase())
  );

  const categories = baseCategories.filter(c => 
    c.name.toLowerCase().includes(categoriesSearchQuery.toLowerCase())
  );

  const totalItemsCount = baseProducts.length + baseBrands.length + baseCategories.length;

  return (
    <div className="flex-1 bg-[#f4f6f8] flex flex-col overflow-hidden select-none font-sans text-slate-800">
      
      {/* Header bar (styled like brands header with white background) */}
      <div className="bg-white border-b border-slate-100 p-4 shrink-0">
        <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
          <span>My B2B Shortlist</span>
        </h2>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
          Manage saved brands, categories, and products to submit bulk inquiries
        </span>
      </div>

      {/* Main scroll container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {totalItemsCount === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 max-w-sm mx-auto shadow-sm mt-12">
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <Heart className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-sm">Your Shortlist is Empty</h3>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Explore verified products & brands, then click the heart icon to save them here for consolidated price quotes.
              </p>
            </div>
            <button
              onClick={onBrowseMore}
              className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl text-xs transition"
            >
              Browse Catalog Directory
            </button>
          </div>
        ) : (
          <>
            {/* Shortlisted Products Section */}
            {baseProducts.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>Shortlisted Products ({products.length})</span>
                  </h3>
                  <InlineSectionSearch 
                    value={productsSearchQuery}
                    onChange={setProductsSearchQuery}
                    isExpanded={isProductsSearchExpanded}
                    setIsExpanded={setIsProductsSearchExpanded}
                    placeholder="Search products..."
                  />
                </div>
                <div className="space-y-3">
                  {products.length === 0 ? (
                    <div className="text-slate-400 text-[10.5px] font-bold py-6 px-3 bg-white border border-slate-200/80 rounded-2xl text-center italic">
                      No matching products in your shortlist
                    </div>
                  ) : (
                    products.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-[#028384]/40 transition duration-200 flex"
                    >
                      {/* Image side */}
                      <div 
                        onClick={() => onSelectProduct(prod)}
                        className="w-24 bg-slate-50 flex items-center justify-center p-2 shrink-0 border-r border-slate-100 relative cursor-pointer"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-16 max-w-full object-contain rounded"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Details side */}
                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 
                              onClick={() => onSelectProduct(prod)}
                              className="font-bold text-[11px] text-slate-900 leading-snug line-clamp-2 hover:text-[#028384] cursor-pointer"
                            >
                              {prod.name}
                            </h4>
                            <button
                              onClick={() => onToggleShortlistProduct(prod.id)}
                              className="text-slate-400 hover:text-rose-500 transition shrink-0 p-1 bg-slate-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">
                            By: {prod.brandName.split(' ')[0]}
                          </p>
                          <span className="text-xs font-black text-[#028384] block">
                            {prod.priceRange.split(' - ')[0]}
                          </span>
                        </div>

                        <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() =>
                              onOpenBuyLeadForm({
                                productName: prod.name,
                                brandName: prod.brandName,
                                requirement: `Hello, we would like to procure ${prod.name} with standard industrial requirements. Please provide FOB price quote and delivery lead-time details.`
                              })
                            }
                            className="flex-1 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-[9.5px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <Send className="w-3 h-3" />
                            Get Custom Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </div>
            )}

            {/* Shortlisted Brands Section */}
            {baseBrands.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Shortlisted Manufacturers ({brands.length})</span>
                  </h3>
                  <InlineSectionSearch 
                    value={brandsSearchQuery}
                    onChange={setBrandsSearchQuery}
                    isExpanded={isBrandsSearchExpanded}
                    setIsExpanded={setIsBrandsSearchExpanded}
                    placeholder="Search brands..."
                  />
                </div>
                <div className="space-y-3">
                  {brands.length === 0 ? (
                    <div className="text-slate-400 text-[10.5px] font-bold py-6 px-3 bg-white border border-slate-200/80 rounded-2xl text-center italic">
                      No matching manufacturers in your shortlist
                    </div>
                  ) : (
                    brands.map((brand) => (
                    <div
                      key={brand.id}
                      className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs hover:border-[#028384]/40 transition duration-200 space-y-3"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div 
                          onClick={() => onSelectBrand(brand)}
                          className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                        >
                          <div className="w-9 h-9 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center font-black text-[#028384] text-[10px] shrink-0 overflow-hidden p-0.5 bg-white">
                            <BrandLogo logo={brand.logo} name={brand.name} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-[12px] text-slate-900 truncate flex items-center gap-1 leading-tight hover:text-[#028384] transition">
                              {brand.name}
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                            </h4>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold mt-0.5">
                              <span className="flex items-center gap-0.5 text-amber-500 font-extrabold">
                                <Star className="w-2.5 h-2.5 fill-amber-500" /> {brand.rating}
                              </span>
                              <span>•</span>
                              <span>Est. {brand.establishedYear}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onToggleShortlistBrand(brand.id)}
                          className="text-slate-400 hover:text-rose-500 transition shrink-0 p-1.5 bg-slate-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] text-slate-600 leading-relaxed font-medium">
                        {brand.description}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelectBrand(brand)}
                          className="flex-1 py-1.5 border border-[#2563eb] text-[#2563eb] hover:bg-blue-50/10 rounded-lg text-[10px] font-extrabold text-center transition"
                        >
                          View Catalog
                        </button>
                        <button
                          onClick={() =>
                            onOpenBuyLeadForm({
                              brandName: brand.name,
                              requirement: `Dear Sales Team, we wish to connect with ${brand.name} regarding industrial supplies. Please contact us back with OEM pricing catalogs.`
                            })
                          }
                          className="flex-1 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send Bulk Inquiry
                        </button>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </div>
            )}

            {/* Shortlisted Categories Section */}
            {baseCategories.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Shortlisted Categories ({categories.length})</span>
                  </h3>
                  <InlineSectionSearch 
                    value={categoriesSearchQuery}
                    onChange={setCategoriesSearchQuery}
                    isExpanded={isCategoriesSearchExpanded}
                    setIsExpanded={setIsCategoriesSearchExpanded}
                    placeholder="Search categories..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {categories.length === 0 ? (
                    <div className="text-slate-400 text-[10.5px] font-bold py-6 px-3 bg-white border border-slate-200/80 rounded-2xl text-center italic">
                      No matching categories in your shortlist
                    </div>
                  ) : (
                    categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-xs hover:border-[#028384]/40 transition"
                    >
                      <div 
                        onClick={() => onSelectCategory(cat.id)}
                        className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                      >
                        <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center text-[#028384] shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 truncate hover:text-[#028384] transition">{cat.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onToggleShortlistCategory(cat.id)}
                          className="text-slate-400 hover:text-rose-500 transition shrink-0 p-1.5 bg-slate-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectCategory(cat.id)}
                          className="p-1.5 bg-slate-50 border border-slate-200 hover:border-[#028384] hover:text-[#028384] text-slate-500 rounded transition"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
