'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, Star, Send, Heart, X, SlidersHorizontal } from 'lucide-react';
import { Brand, Product } from '../types';
import { Category } from '../services/categories';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';

interface InlineSectionSearchProps {
  value: string;
  onChange: (val: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  placeholder?: string;
}

export function InlineSectionSearch({
  value,
  onChange,
  isExpanded,
  setIsExpanded,
  placeholder = "Search..."
}: InlineSectionSearchProps) {
  return (
    <div className="flex items-center gap-1.5 transition-all duration-300">
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

interface InlineSectionFilterButtonProps {
  activeFilter: string;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export function InlineSectionFilterButton({
  activeFilter,
  isExpanded,
  setIsExpanded
}: InlineSectionFilterButtonProps) {
  const hasActiveFilter = activeFilter !== 'all';
  return (
    <button
      type="button"
      onClick={() => setIsExpanded(!isExpanded)}
      className={`p-1.5 rounded-lg border transition duration-200 relative ${
        isExpanded
          ? 'bg-teal-50 border-teal-300 text-[#028384] hover:bg-teal-100/40'
          : hasActiveFilter
            ? 'bg-teal-50 border-[#028384]/40 text-[#028384] hover:bg-teal-100/40 font-bold'
            : 'bg-slate-50 border-slate-200/50 text-slate-500 hover:bg-[#f2faf9] hover:text-[#028384]'
      }`}
      title={isExpanded ? "Close filters" : "Filter this section"}
    >
      <SlidersHorizontal className="w-3.5 h-3.5" />
      {hasActiveFilter && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white"></span>
      )}
    </button>
  );
}

interface DiscoverViewProps {
  brands: Brand[];
  products: Product[];
  categories: Category[];
}

function categoryHref(catId: string) {
  return catId === 'all' ? '/brands' : `/categories/${catId}`;
}

export default function DiscoverView({ brands, products, categories }: DiscoverViewProps) {
  const router = useRouter();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const {
    shortlistedBrands,
    shortlistedProducts,
    shortlistedCategories,
    toggleShortlistBrand,
    toggleShortlistProduct,
    toggleShortlistCategory
  } = useShortlist();

  const [localSearch, setLocalSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Section search query states
  const [brandsSearchQuery, setBrandsSearchQuery] = useState('');
  const [isBrandsSearchExpanded, setIsBrandsSearchExpanded] = useState(false);
  const [brandsFilter, setBrandsFilter] = useState('all');
  const [isBrandsFilterExpanded, setIsBrandsFilterExpanded] = useState(false);

  const [productsSearchQuery, setProductsSearchQuery] = useState('');
  const [isProductsSearchExpanded, setIsProductsSearchExpanded] = useState(false);
  const [productsFilter, setProductsFilter] = useState('all');
  const [isProductsFilterExpanded, setIsProductsFilterExpanded] = useState(false);

  const [categoriesSearchQuery, setCategoriesSearchQuery] = useState('');
  const [isCategoriesSearchExpanded, setIsCategoriesSearchExpanded] = useState(false);
  const [categoriesFilter, setCategoriesFilter] = useState('all');
  const [isCategoriesFilterExpanded, setIsCategoriesFilterExpanded] = useState(false);

  const searchHints = [
    'Search for "Voltas Water Cooler"...',
    'Search for "Kirloskar Monoblock Pump"...',
    'Search for "Siemens VFD Converter"...',
    'Search for "Atlas Copco Compressor"...',
    'Search for "Sokkia Total Station"...'
  ];

  // Moving search hint placeholder timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchHints.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const runSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchFocused(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(localSearch);
  };

  const BrandMarquee = ({ reverse = false }: { reverse?: boolean }) => {
    const doubleBrands = [...brands, ...brands, ...brands];
    return (
      <div className="relative w-full overflow-hidden bg-slate-50 border-y border-slate-200/50 py-3 select-none shrink-0 my-3">
        <div className={`${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} flex gap-5 items-center`}>
          {doubleBrands.map((brand, idx) => (
            <Link
              key={`${brand.id}-${reverse ? 'rev' : 'fwd'}-${idx}`}
              href={`/brands/${brand.id}`}
              className="flex items-center justify-center bg-white border border-slate-200 hover:border-[#028384]/50 rounded-lg p-2 shadow-xs hover:shadow-sm transition shrink-0 w-20 h-10 cursor-pointer group"
              title={`View ${brand.name}`}
            >
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <BrandLogo logo={brand.logo} name={brand.name} className="w-full h-full object-contain group-hover:scale-105 transition duration-200" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Pick some top products to showcase
  const baseProductsToShow = products.filter(p =>
    p.id === 'voltas-water-cooler' || p.id === 'atlas-copco-compressor' || p.id === 'siemens-plc-s71200'
  );
  let topProductsToShow = baseProductsToShow.filter(p =>
    p.name.toLowerCase().includes(productsSearchQuery.toLowerCase()) ||
    p.brandName.toLowerCase().includes(productsSearchQuery.toLowerCase())
  );
  if (productsFilter === 'under-25k') {
    topProductsToShow = topProductsToShow.filter(p => {
      const cleanPrice = parseInt(p.priceRange.replace(/[^0-9]/g, ''), 10);
      return cleanPrice < 25000;
    });
  } else if (productsFilter === 'over-25k') {
    topProductsToShow = topProductsToShow.filter(p => {
      const cleanPrice = parseInt(p.priceRange.replace(/[^0-9]/g, ''), 10);
      return cleanPrice >= 25000;
    });
  }

  // similar / Top Brands to showcase on home
  const baseBrandsToShow = brands.filter(b => b.id === 'atlascopco' || b.id === 'voltas' || b.id === 'kirloskar' || b.id === 'ksb' || b.id === 'siemens');
  let topBrandsToShow = baseBrandsToShow.filter(b =>
    b.name.toLowerCase().includes(brandsSearchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(brandsSearchQuery.toLowerCase())
  );
  if (brandsFilter === 'high-rating') {
    topBrandsToShow = topBrandsToShow.filter(b => b.rating >= 4.5);
  } else if (brandsFilter === 'verified') {
    topBrandsToShow = topBrandsToShow.filter(b => b.verified);
  } else if (brandsFilter === 'north-west') {
    topBrandsToShow = topBrandsToShow.filter(b =>
      b.headquarters.toLowerCase().includes('delhi') ||
      b.headquarters.toLowerCase().includes('mumbai') ||
      b.headquarters.toLowerCase().includes('pune') ||
      b.headquarters.toLowerCase().includes('gujarat')
    );
  }

  return (
    <div className="flex-1 bg-[#f4f6f8] overflow-y-auto pb-16 select-none font-sans text-slate-800 relative">

      {/* 1. Official Branded IndiaMART Top Header with Profile Initials "RT" */}
      <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          {/* IndiaMART Official Logo */}
          <img src="/indiamart-logo.png" alt="IndiaMART" className="h-8 w-auto select-none" />
        </div>

        {/* Profile Avatar with RT initials for Rohit Takalkar */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center text-[11px] font-black shadow-sm ring-2 ring-blue-50 hover:scale-105 transition cursor-pointer"
            title="Rohit Takalkar"
          >
            RT
          </div>
        </div>
      </div>

      {/* 2. Custom Clean B2B Search Section */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 shrink-0">
        <div className="relative space-y-3.5 max-w-lg mx-auto">
          {/* Sourcing Search Input with Dynamic Moving Hint */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full shadow-sm border border-slate-200 rounded-xl overflow-hidden">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={localSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    if (!isSearchFocused) setIsSearchFocused(true);
                  }}
                  placeholder={searchHints[placeholderIndex]}
                  className="w-full bg-slate-50 text-slate-800 rounded-l-xl pl-9 pr-7 py-3 text-xs outline-none transition placeholder-slate-400 font-bold"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <button
                type="submit"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-3 rounded-r-xl flex items-center justify-center transition border border-[#2563eb] font-bold text-xs shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Brand Collaborations Showcase */}
          <div className="pt-2.5 border-t border-slate-100">
            <p className="text-[7.5px] uppercase font-extrabold tracking-widest text-slate-400 text-center mb-1.5">
              Authorized B2B Brand Partners
            </p>
            <div className="flex justify-between items-center px-1 text-[8.5px] font-black text-slate-600">
              {['Kirloskar', 'Voltas', 'Siemens', 'Atlas Copco', 'Crompton'].map((brand, bidx) => (
                <span
                  key={bidx}
                  onClick={() => runSearch(brand)}
                  className="px-2 py-1 bg-slate-50 rounded border border-slate-150 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer truncate max-w-[68px]"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Interactive Search Suggestions Overlay */}
      {isSearchFocused && (
        <div className="absolute inset-0 bg-slate-50 z-50 flex flex-col select-none">
          {/* Active Search Sticky Bar */}
          <div className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center gap-3 shrink-0 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  autoFocus
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={searchHints[placeholderIndex]}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#028384] focus:bg-white rounded-l-xl pl-9 pr-8 py-2.5 text-xs outline-none transition font-semibold text-slate-800"
                />
                <Search className="w-4 h-4 text-[#028384] absolute left-3 top-3" />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => setLocalSearch('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 font-extrabold text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-r-xl flex items-center justify-center transition border border-[#2563eb] shrink-0 font-extrabold text-xs"
              >
                Go
              </button>
            </form>
            <button
              onClick={() => setIsSearchFocused(false)}
              className="text-slate-500 hover:text-slate-800 font-extrabold text-[11px] px-2.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition shrink-0"
            >
              Cancel
            </button>
          </div>

          {/* Suggestions Directory Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Recent Queries */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
                Recent Sourcing Searches
              </h4>
              <div className="flex flex-col gap-1.5">
                {[
                  { name: 'Voltas Water Cooler 40/80 PSS', search: 'Voltas Water Cooler' },
                  { name: 'Atlas Copco Compressors GA 30 VSD', search: 'Atlas Copco Air Compressors' },
                  { name: 'Sokkia Total Station CX-105', search: 'Sokkia Total Station' },
                  { name: 'Siemens VFD SINAMICS V20', search: 'Siemens VFD' },
                  { name: 'Kirloskar 125 kVA Silent Diesel Genset', search: 'Kirloskar 125 kVA' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setLocalSearch(item.search);
                      runSearch(item.search);
                    }}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200/60 rounded-xl hover:border-[#028384]/40 transition text-left shadow-xs"
                  >
                    <span className="text-xs font-semibold text-slate-700 truncate">{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trending B2B Brands */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#028384]"></span>
                Trending Verified Brands
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.id}`}
                    onClick={() => setIsSearchFocused(false)}
                    className="bg-white border border-slate-200/80 hover:border-[#028384]/40 rounded-xl p-2.5 flex items-center gap-2 transition text-left shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-lg font-black text-[#028384] text-[9px] flex items-center justify-center shrink-0 overflow-hidden p-0.5 bg-white">
                      <BrandLogo logo={brand.logo} name={brand.name} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-extrabold text-slate-900 leading-tight truncate">{brand.name.split(' ')[0]}</div>
                      <span className="text-[8px] bg-emerald-50 text-emerald-600 font-extrabold px-1 rounded block mt-0.5 w-fit">Verified</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Brands Infinite Marquee */}
      <BrandMarquee />

      {/* 4. Similar Brands Section (KEPT ON THE TOP, BELOW HERO!) */}
      <div className="mt-4 bg-white border-y border-slate-200/60 py-4">
        <div className="px-4 flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-[12px] text-slate-900 tracking-tight uppercase">Similar Brands</h2>
            <div className="flex items-center gap-1">
              <InlineSectionSearch
                value={brandsSearchQuery}
                onChange={setBrandsSearchQuery}
                isExpanded={isBrandsSearchExpanded}
                setIsExpanded={setIsBrandsSearchExpanded}
                placeholder="Search brands..."
              />
              <InlineSectionFilterButton
                activeFilter={brandsFilter}
                isExpanded={isBrandsFilterExpanded}
                setIsExpanded={setIsBrandsFilterExpanded}
              />
            </div>
          </div>
          {!isBrandsSearchExpanded && !isBrandsFilterExpanded && (
            <Link
              href="/brands"
              className="text-[10px] font-bold text-[#028384] hover:text-[#007072] transition cursor-pointer"
            >
              Explore All
            </Link>
          )}
        </div>

        {isBrandsFilterExpanded && (
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 pt-0.5 select-none scrollbar-none">
            {[
              { id: 'all', label: 'All Brands' },
              { id: 'high-rating', label: 'Rating 4.5+ ★' },
              { id: 'verified', label: 'Verified Only' },
              { id: 'north-west', label: 'North/West HQ' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setBrandsFilter(pill.id)}
                className={`px-2.5 py-1 text-[9.5px] font-bold rounded-full border transition whitespace-nowrap shrink-0 cursor-pointer ${
                  brandsFilter === pill.id
                    ? 'bg-[#028384] border-[#028384] text-white font-extrabold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-bold'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        {/* Horizontal scroll where the next card is partially visible (w-[152px] cards) */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none select-none snap-x scroll-smooth">
          {topBrandsToShow.length === 0 ? (
            <div className="text-slate-400 text-[11px] font-bold py-6 px-2 italic">
              No matching brands in this section
            </div>
          ) : (
            topBrandsToShow.map((brand) => {
              const isShortlisted = shortlistedBrands.includes(brand.id);
              return (
              <div
                key={brand.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#028384]/40 transition duration-200 flex flex-col justify-between shadow-xs cursor-pointer w-[152px] shrink-0 snap-start relative"
              >
                {/* Shortlist trigger inside Brand Card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShortlistBrand(brand.id);
                  }}
                  className={`absolute top-2 right-2 p-1.5 rounded-full z-10 border transition ${
                    isShortlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500 hover:text-rose-600'
                      : 'bg-white/85 border-slate-200 text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${isShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Brand Logo & cover */}
                <Link
                  href={`/brands/${brand.id}`}
                  className="h-20 bg-slate-50 flex items-center justify-center p-2 border-b border-slate-100"
                >
                  <div className="bg-white border border-[#028384]/20 rounded px-1.5 py-0.5 text-[10px] font-extrabold text-[#2e3192] tracking-tight shadow-xs w-20 h-10 flex items-center justify-center overflow-hidden p-1.5">
                    <BrandLogo logo={brand.logo} name={brand.name} />
                  </div>
                </Link>

                {/* Content */}
                <Link
                  href={`/brands/${brand.id}`}
                  className="p-2.5 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-extrabold text-[10.5px] text-slate-900 leading-tight truncate">
                      {brand.name.replace(' Limited', '').replace(' India', '')}
                    </h3>
                    <p className="text-[8.5px] text-slate-400 font-medium leading-tight mt-1 line-clamp-1">
                      {brand.description}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-50 flex items-center justify-between">
                    {brand.verified && (
                      <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-1 rounded">
                        Verified
                      </span>
                    )}
                    <span className="text-[9px] font-extrabold text-[#028384] uppercase tracking-wider ml-auto">
                      View
                    </span>
                  </div>
                </Link>
              </div>
            );
          })
          )}
        </div>
      </div>

      {/* 5. Top Products Carousel (Horizontal Slide) */}
      <div className="mt-4 bg-white border-y border-slate-200/60 py-4">
        <div className="px-4 flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-[12px] text-slate-900 tracking-tight uppercase">Top Products</h2>
            <div className="flex items-center gap-1">
              <InlineSectionSearch
                value={productsSearchQuery}
                onChange={setProductsSearchQuery}
                isExpanded={isProductsSearchExpanded}
                setIsExpanded={setIsProductsSearchExpanded}
                placeholder="Search products..."
              />
              <InlineSectionFilterButton
                activeFilter={productsFilter}
                isExpanded={isProductsFilterExpanded}
                setIsExpanded={setIsProductsFilterExpanded}
              />
            </div>
          </div>
          {!isProductsSearchExpanded && !isProductsFilterExpanded && (
            <Link
              href="/categories"
              className="border border-[#028384] text-[#028384] hover:bg-[#f2faf9] px-2.5 py-1 rounded-md text-[10px] font-bold transition"
            >
              Categories
            </Link>
          )}
        </div>

        {isProductsFilterExpanded && (
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 pt-0.5 select-none scrollbar-none">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'under-25k', label: 'Under ₹25k' },
              { id: 'over-25k', label: '₹25k & Over' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setProductsFilter(pill.id)}
                className={`px-2.5 py-1 text-[9.5px] font-bold rounded-full border transition whitespace-nowrap shrink-0 cursor-pointer ${
                  productsFilter === pill.id
                    ? 'bg-[#028384] border-[#028384] text-white font-extrabold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-bold'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        {/* Horizontal scroll layout with card peeking */}
        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 scrollbar-none select-none snap-x scroll-smooth">
          {topProductsToShow.length === 0 ? (
            <div className="text-slate-400 text-[11px] font-bold py-6 px-2 italic">
              No matching products in this section
            </div>
          ) : (
            topProductsToShow.map((product) => {
              const isShortlisted = shortlistedProducts.includes(product.id);
              return (
              <div
                key={product.id}
                className="bg-white border border-slate-200/80 rounded-xl flex flex-row w-[255px] shrink-0 overflow-hidden hover:border-[#028384]/40 transition shadow-xs snap-start relative"
              >
                {/* Shortlist button for Top Product */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShortlistProduct(product.id);
                  }}
                  className={`absolute top-2 right-2 p-1.5 rounded-full z-10 border transition ${
                    isShortlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500 hover:text-rose-600'
                      : 'bg-white/90 border-slate-200 text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${isShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Product Left Side */}
                <Link
                  href={`/products/${product.id}`}
                  className="w-[95px] relative bg-slate-50 border-r border-slate-100 flex flex-col justify-between p-1.5 shrink-0 cursor-pointer"
                >
                  <div className="absolute top-1.5 left-1.5 bg-[#028384] text-white text-[7px] font-black uppercase px-1 py-0.5 rounded tracking-wider">
                    Top
                  </div>

                  <div className="flex-1 flex items-center justify-center mt-3 p-0.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-20 max-w-full object-contain rounded-md"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="bg-white border border-slate-150 rounded px-1 mt-1 text-center truncate">
                    <span className="text-[7.5px] font-black text-blue-900 block truncate">
                      {product.brandName.split(' ')[0]}
                    </span>
                  </div>
                </Link>

                {/* Product Right Side */}
                <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
                  <Link href={`/products/${product.id}`} className="cursor-pointer">
                    <h4 className="font-bold text-[10.5px] text-slate-900 leading-snug line-clamp-2 hover:text-[#028384]">
                      {product.name}
                    </h4>
                    <p className="text-[8.5px] text-slate-400 mt-1 truncate">
                      By: <span className="text-slate-600 font-bold">{product.brandName.split(' ')[0]}</span>
                    </p>
                  </Link>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between mt-1">
                    <div>
                      <span className="text-[11px] font-black text-slate-900">
                        {product.priceRange.split(' - ')[0]}
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded px-2.5 py-1 text-[9px] transition shrink-0"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>

      {/* 6. Custom Quick RFQ Requirement Banner */}
      <div className="px-4 mt-4">
        <div
          onClick={() => openBuyLeadForm({})}
          className="bg-gradient-to-r from-[#028384] to-[#017075] hover:from-[#007072] hover:to-[#005e60] rounded-xl p-4 text-white flex items-center justify-between gap-4 cursor-pointer shadow-sm transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs tracking-tight">Post Your B2B Requirement</h3>
              <p className="text-[9.5px] text-teal-50 mt-0.5 font-medium leading-tight">Receive competitive price quotes from manufacturers directly.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white shrink-0" />
        </div>
      </div>

      {/* 7. Browse by Industry (Categories) */}
      <div className="mt-5 px-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Browse by Industry</h2>
            <div className="flex items-center gap-1">
              <InlineSectionSearch
                value={categoriesSearchQuery}
                onChange={setCategoriesSearchQuery}
                isExpanded={isCategoriesSearchExpanded}
                setIsExpanded={setIsCategoriesSearchExpanded}
                placeholder="Search industries..."
              />
              <InlineSectionFilterButton
                activeFilter={categoriesFilter}
                isExpanded={isCategoriesFilterExpanded}
                setIsExpanded={setIsCategoriesFilterExpanded}
              />
            </div>
          </div>
          {!isCategoriesSearchExpanded && !isCategoriesFilterExpanded && (
            <Link
              href="/categories"
              className="text-[10px] font-bold text-[#028384] hover:text-[#007072] transition cursor-pointer"
            >
              View All
            </Link>
          )}
        </div>

        {isCategoriesFilterExpanded && (
          <div className="flex gap-1.5 overflow-x-auto pb-2.5 pt-0.5 select-none scrollbar-none">
            {[
              { id: 'all', label: 'All Industries' },
              { id: 'heavy', label: 'Industrial / Heavy' },
              { id: 'tech', label: 'Tech & Automation' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setCategoriesFilter(pill.id)}
                className={`px-2.5 py-1 text-[9.5px] font-bold rounded-full border transition whitespace-nowrap shrink-0 cursor-pointer ${
                  categoriesFilter === pill.id
                    ? 'bg-[#028384] border-[#028384] text-white font-extrabold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-bold'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        {/* Horizontal scroll where cards peek out! */}
        <div className="flex gap-2.5 overflow-x-auto pb-2.5 scrollbar-none snap-x scroll-smooth select-none">
          {(() => {
            let filteredCats = categories.filter(cat =>
              cat.name.toLowerCase().includes(categoriesSearchQuery.toLowerCase())
            );
            if (categoriesFilter === 'heavy') {
              filteredCats = filteredCats.filter(cat =>
                cat.id === 'machinery' || cat.id === 'construction' || cat.id === 'pipes' || cat.id === 'tools'
              );
            } else if (categoriesFilter === 'tech') {
              filteredCats = filteredCats.filter(cat =>
                cat.id === 'electrical' || cat.id === 'automation' || cat.id === 'solar'
              );
            }
            if (filteredCats.length === 0) {
              return (
                <div className="text-slate-400 text-[11px] font-bold py-6 px-2 italic">
                  No matching industries in this section
                </div>
              );
            }
            return filteredCats.map((cat) => {
              const isShortlisted = shortlistedCategories.includes(cat.id);
              return (
              <div
                key={cat.id}
                className="bg-white border border-slate-200/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-between gap-1 hover:border-[#028384]/40 transition shadow-xs w-[82px] shrink-0 snap-start relative min-h-[90px]"
              >
                {/* Micro Heart Shortlist Toggle for Category */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShortlistCategory(cat.id);
                  }}
                  className={`absolute top-1 right-1 p-0.5 rounded transition ${
                    isShortlisted ? 'text-rose-500' : 'text-slate-300 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-2.5 h-2.5 ${isShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <Link
                  href={categoryHref(cat.id)}
                  className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center text-[#028384] shrink-0 mt-1 cursor-pointer"
                >
                  <CategoryIcon icon={cat.icon} />
                </Link>

                <Link
                  href={categoryHref(cat.id)}
                  className="text-[8px] font-bold text-slate-700 leading-tight block truncate w-full max-w-[70px] whitespace-normal cursor-pointer"
                >
                  {cat.name.replace(' & Allied', '')}
                </Link>
              </div>
            );
          });
          })()}
        </div>
      </div>

      {/* Bottom Brands Infinite Marquee (Reverse Scroll for dynamic feel) */}
      <div className="mt-5">
        <p className="text-[8px] uppercase font-extrabold tracking-widest text-slate-400 text-center mb-1">
          Top Branded OEM Advertisers
        </p>
        <BrandMarquee reverse={true} />
      </div>

    </div>
  );
}
