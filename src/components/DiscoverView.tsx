import React, { useState } from 'react';
import { Search, ChevronRight, ShieldCheck, Star, Layers, FileCheck2, Send } from 'lucide-react';
import { CATEGORIES, BRANDS, PRODUCTS } from '../data';
import { Brand, Product } from '../types';

interface DiscoverViewProps {
  onSelectBrand: (brand: Brand) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenRFQForm: () => void;
  onSearch: (query: string) => void;
}

export default function DiscoverView({ onSelectBrand, onSelectCategory, onOpenRFQForm, onSearch }: DiscoverViewProps) {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      onSearch(localSearch);
    }
  };

  const recentlyCreatedPills = [
    { name: 'Voltas Water Cooler 40/80 PSS & FSS, 80 Ltrs Storage, 2 Fucets', search: 'Voltas Water Cooler' },
    { name: 'Atlas Copco Air Compressors GA 30 VSD 30 kW 4 bar(e) Pack Oil-injected Rotary Screw Compressor', search: 'Atlas Copco Air Compressors' },
    { name: 'Sokkia Total Station CX-105 5" Angle Accuracy IP66 Bluetooth', search: 'Sokkia Total Station' },
    { name: 'Siemens VFD SINAMICS V20 22.00 kW Variable Frequency Drive Converter', search: 'Siemens VFD' },
    { name: 'Kirloskar 125 kVA Silent Diesel Genset (LHP)', search: 'Kirloskar 125 kVA' }
  ];

  // Pick some top products to showcase exactly like the image
  const topProductsToShow = PRODUCTS.filter(p => 
    p.id === 'voltas-water-cooler' || p.id === 'atlas-copco-compressor' || p.id === 'siemens-plc-s71200'
  );

  // We can render "Similar Brands" or "Top Brands" exactly like the screenshot
  const topBrandsToShow = BRANDS.filter(b => b.id === 'atlascopco' || b.id === 'voltas' || b.id === 'kirloskar');

  return (
    <div className="flex-1 bg-[#f4f6f8] overflow-y-auto pb-16 select-none font-sans text-slate-800">
      
      {/* 1. Official Branded IndiaMART Top Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex flex-col items-center justify-center shrink-0">
        <div className="flex items-center gap-1">
          {/* Exact replication of IndiaMART M-logo using high-fidelity SVG/CSS */}
          <div className="flex items-end h-8 relative w-9 shrink-0">
            {/* Heads */}
            <div className="absolute top-1.5 left-[4px] w-2 h-2 rounded-full bg-[#e41e26]" />
            <div className="absolute top-1.5 left-[20px] w-2 h-2 rounded-full bg-[#2e3192]" />
            {/* Bodies forming M */}
            <svg className="w-8 h-6 mb-0.5" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 24V14C6 11 9 9 12 9C15 9 18 11 18 14V24" stroke="#e41e26" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M18 24V14C18 11 21 9 24 9C27 9 30 11 30 14V24" stroke="#2e3192" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M12 24V16C12 14.5 13.5 13 15 13C16.5 13 18 14.5 18 16V24" stroke="#e41e26" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-[#2e3192] flex items-center font-sans">
            india<span className="text-[#e41e26] font-black">m</span>art
          </span>
        </div>
      </div>

      {/* 2. Premium Search Box & Action button */}
      <div className="bg-white px-4 py-3 border-b border-slate-200/60 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search product, brand or category"
              className="w-full bg-white border border-slate-300 border-r-0 focus:border-[#028384] rounded-l-md pl-3 pr-4 py-2 text-xs outline-none transition placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            className="bg-[#028384] hover:bg-[#007072] text-white px-4 py-2 rounded-r-md flex items-center justify-center transition border border-[#028384] shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Recently Created Products Tags */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200/60">
        <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2.5">
          Recently Created Products
        </h3>
        <div className="flex flex-col gap-2">
          {recentlyCreatedPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => {
                setLocalSearch(pill.search);
                onSearch(pill.search);
              }}
              className="w-full bg-[#f4f6f8] hover:bg-[#e9ecef] border border-slate-200 text-slate-700 px-3.5 py-2 rounded-full text-[10.5px] font-medium transition text-left truncate leading-tight flex items-center justify-between"
            >
              <span className="truncate pr-2">{pill.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Top Products Carousel (Horizontal Slide) */}
      <div className="mt-4 bg-white border-y border-slate-200/60 py-4">
        <div className="px-4 flex justify-between items-center mb-3">
          <h2 className="font-extrabold text-[13px] text-slate-900 tracking-tight uppercase">Top Products</h2>
          <button
            onClick={() => onSelectCategory('all')}
            className="border border-[#028384] text-[#028384] hover:bg-[#f2faf9] px-2.5 py-1 rounded-md text-[10px] font-bold transition"
          >
            Categories
          </button>
        </div>

        {/* Horizontal scroll matching screenshot card look exactly */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-none select-none">
          {topProductsToShow.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-200/80 rounded-xl flex flex-row w-[320px] shrink-0 overflow-hidden hover:border-[#028384]/40 transition shadow-xs"
            >
              {/* Product Left Side: Image with badges */}
              <div className="w-[110px] relative bg-slate-50 border-r border-slate-100 flex flex-col justify-between p-1.5 shrink-0">
                {/* Top Product Tag */}
                <div className="absolute top-1.5 left-1.5 bg-[#028384] text-white text-[7.5px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider z-10">
                  Top Product
                </div>
                
                {/* Product Photo */}
                <div className="flex-1 flex items-center justify-center p-1 mt-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-24 max-w-full object-contain rounded-md"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Brand watermark badge at bottom */}
                <div className="bg-white border border-slate-200 rounded px-1.5 py-0.5 mt-1 text-center truncate">
                  <span className="text-[8px] font-extrabold text-blue-900 tracking-tight block truncate">
                    {product.brandName.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Product Right Side: Title, Brand, Price and Action */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-[11.5px] text-slate-900 leading-snug line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-1">
                    By: <span className="text-slate-600 font-medium">{product.brandName}</span>
                  </p>

                  {/* Specs labels */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                      <span
                        key={key}
                        className="bg-[#f2faf9] text-[#028384] text-[8px] font-bold px-1.5 py-0.5 rounded border border-teal-50/50"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2.5 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[12px] font-extrabold text-slate-900">
                      {product.priceRange.split(' - ')[0]}
                    </span>
                    <span className="text-[7.5px] text-slate-400 block -mt-0.5">onwards</span>
                  </div>

                  <button
                    onClick={() => onSearch(product.name)}
                    className="bg-[#028384] hover:bg-[#007072] text-white font-bold rounded px-2.5 py-1.5 text-[10px] transition shrink-0"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Custom Quick RFQ Requirement Banner */}
      <div className="px-4 mt-4">
        <div 
          onClick={onOpenRFQForm}
          className="bg-gradient-to-r from-[#028384] to-[#017075] hover:from-[#007072] hover:to-[#005e60] rounded-xl p-4 text-white flex items-center justify-between gap-4 cursor-pointer shadow-sm transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs tracking-tight">Post Your Custom B2B Requirement</h3>
              <p className="text-[9.5px] text-teal-50 mt-0.5 font-medium leading-tight">Receive competitive price quotations from verified OEMs directly.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white shrink-0" />
        </div>
      </div>

      {/* 6. Browse by Industry (Clean Minimal Categories) */}
      <div className="px-4 mt-5 space-y-3">
        <div className="flex justify-between items-end">
          <h2 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Browse by Industry</h2>
          <span 
            onClick={() => onSelectCategory('all')}
            className="text-[10px] font-bold text-[#028384] hover:text-[#007072] transition cursor-pointer"
          >
            View All
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white border border-slate-200/80 rounded-xl p-2 text-center flex flex-col items-center justify-center gap-1 hover:border-[#028384]/40 transition cursor-pointer shadow-xs min-h-[70px]"
            >
              <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center text-[#028384] shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold text-slate-700 leading-tight block truncate w-full max-w-[65px] whitespace-normal hyphens-auto">
                {cat.name.replace(' & Allied', '')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 7. Similar Brands / Top Brands section (Replicating lower portion of the image) */}
      <div className="mt-5 px-4 space-y-3">
        <div className="flex justify-between items-end">
          <h2 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Similar Brands</h2>
          <span 
            onClick={() => onSelectCategory('all')} 
            className="text-[10px] font-bold text-[#028384] hover:text-[#007072] transition cursor-pointer"
          >
            Explore All
          </span>
        </div>

        {/* High-fidelity Brand Cards */}
        <div className="grid grid-cols-2 gap-3">
          {topBrandsToShow.map((brand) => (
            <div
              key={brand.id}
              onClick={() => onSelectBrand(brand)}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#028384]/40 transition duration-200 flex flex-col justify-between shadow-xs cursor-pointer"
            >
              {/* Brand Cover Representing Product */}
              <div className="h-24 bg-slate-50 relative flex items-center justify-center p-2">
                {/* Top Brand Badge */}
                <div className="absolute top-2 left-2 bg-[#028384] text-white text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide z-10">
                  Top Brand
                </div>

                {/* Overlapping Brand Logo Watermark */}
                <div className="absolute bottom-1 left-2 bg-white border border-[#028384]/20 rounded px-1.5 py-0.5 text-[8.5px] font-extrabold text-[#2e3192] tracking-tight shadow-xs">
                  {brand.logo}
                </div>

                {/* Brand Illustration / Representative image */}
                <img
                  src={
                    brand.id === 'voltas'
                      ? 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=200'
                      : brand.id === 'atlascopco'
                      ? 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200'
                      : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200'
                  }
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain rounded opacity-90"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Stats */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-[11px] text-slate-900 leading-tight line-clamp-1">
                    {brand.name.replace(' Limited', '').replace(' India', '')}
                  </h3>
                  <p className="text-[8.5px] text-slate-400 font-medium mt-0.5 leading-tight line-clamp-2">
                    {brand.description}
                  </p>
                </div>

                <div className="border-t border-slate-50 pt-2 mt-2 flex items-center justify-between">
                  <span className="bg-teal-50 text-[#028384] text-[7.5px] font-extrabold px-1.5 py-0.5 rounded border border-teal-100">
                    {brand.id === 'voltas' ? '48 Products' : brand.id === 'atlascopco' ? '113 Products' : '150+ Products'}
                  </span>
                  
                  <span className="text-[8.5px] font-extrabold text-[#028384] uppercase tracking-wider flex items-center gap-0.5">
                    View
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Verified / Trusted Badges Footer Banner */}
      <div className="px-4 mt-5">
        <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-600/10 rounded-full blur-xl"></div>
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full border border-white/10 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
              <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-teal-300">100% Authorized OEMs</span>
            </div>
            <h3 className="font-extrabold text-xs tracking-tight">Direct Factory Sourcing</h3>
            <p className="text-[9px] text-slate-300 leading-normal font-normal">
              Direct access to company GST profiles, official catalog spec sheets, and OEM communication. No intermediate markup commissions.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
