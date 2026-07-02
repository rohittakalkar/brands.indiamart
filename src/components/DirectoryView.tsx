import React, { useState, useEffect } from 'react';
import { Search, Grid, List, ShieldCheck, Star, Award, Layers, Sparkles } from 'lucide-react';
import { BRANDS, CATEGORIES } from '../data';
import { Brand } from '../types';
import { BrandLogo } from './BrandLogo';

interface DirectoryViewProps {
  onSelectBrand: (brand: Brand) => void;
  onBack?: () => void;
  initialCategory?: string;
  initialSearchQuery?: string;
}

export default function DirectoryView({ onSelectBrand, onBack, initialCategory, initialSearchQuery }: DirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Alphabet letters list for B2B A-Z Directory index
  const alphabet = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // Filter logic
  const filteredBrands = BRANDS.filter((brand) => {
    // 1. Search Query
    const matchesQuery = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.topProducts.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Category
    const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;

    // 3. Alphabetical index
    const matchesLetter = selectedLetter === 'All' || brand.name.startsWith(selectedLetter);

    // 4. Rating filter
    const matchesRating = !selectedRating || brand.rating >= selectedRating;

    return matchesQuery && matchesCategory && matchesLetter && matchesRating;
  });

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Search & Header Section */}
      <div className="bg-white border-b border-slate-100 p-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
              {onBack && (
                <button
                  onClick={onBack}
                  className="mr-1 p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <Layers className="w-4 h-4 text-[#028384]" />
              <span>Brand Directory</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Explore verified B2B brands across industries</span>
          </div>
        </div>

        {/* Input box */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand names, products, certifications..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#028384] focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* A-Z Index Bar */}
      <div className="bg-white border-b border-slate-100 py-2.5 px-3 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none select-none">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 ${
              selectedLetter === letter 
                ? 'bg-[#028384] text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Main Grid content with category filters */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Category Quick Rail */}
        <div className="w-20 bg-white border-r border-slate-100 flex flex-col overflow-y-auto py-3 shrink-0 select-none scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-3 text-center transition flex flex-col items-center gap-1.5 border-l-2 ${
              selectedCategory === 'all' 
                ? 'border-[#028384] bg-teal-50/50 text-[#028384]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-[9px] font-extrabold tracking-wide uppercase text-center block leading-tight">All Industries</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-3 text-center transition flex flex-col items-center gap-1.5 border-l-2 ${
                selectedCategory === cat.id 
                  ? 'border-[#028384] bg-teal-50/50 text-[#028384]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="text-[9px] font-extrabold tracking-wide uppercase text-center block leading-tight whitespace-normal truncate-2-lines">
                {cat.name.replace('& Allied', '').replace('& Electronics', '')}
              </span>
            </button>
          ))}
        </div>

        {/* Right Side Brands List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="flex justify-between items-center px-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Showing {filteredBrands.length} Brands</span>
            {selectedCategory !== 'all' && (
              <button 
                onClick={() => setSelectedCategory('all')} 
                className="text-[#028384] font-extrabold"
              >
                Clear Filter
              </button>
            )}
          </div>

          {filteredBrands.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center text-slate-400 text-xs">
              No brand records found matching parameters. Try searching different keywords.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => onSelectBrand(brand)}
                  className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-3.5 hover:border-[#028384]/40 transition cursor-pointer shadow-xs"
                >
                  {/* Brand Meta */}
                  <div className="flex items-start justify-between">
                    <div className="flex gap-2.5">
                      {/* Logo Frame */}
                      <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl text-[#028384] font-extrabold text-xs flex items-center justify-center shrink-0 overflow-hidden p-1 bg-white">
                        <BrandLogo logo={brand.logo} name={brand.name} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{brand.name}</h4>
                        <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">{brand.businessType}</span>
                      </div>
                    </div>
                    {brand.verified && (
                      <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 border border-emerald-200 rounded-full shrink-0 flex items-center gap-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Rating / Experience Details */}
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5 text-[10px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{brand.rating} ({brand.reviewsCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Est. {brand.establishedYear} ({new Date().getFullYear() - brand.establishedYear} yrs)</span>
                    </div>
                  </div>

                  {/* Highlights block */}
                  <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] text-slate-600">
                    <strong className="text-slate-800 block mb-0.5">Key Capabilities:</strong>
                    <p className="line-clamp-2 leading-relaxed">{brand.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
