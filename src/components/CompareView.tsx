'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ShieldCheck, Clock, Star, ThumbsUp, Send, X, Plus, Search, Sparkles } from 'lucide-react';
import { Supplier, Brand } from '../types';
import { useBuyLeadModal } from './BuyLeadModalProvider';

interface CompareViewProps {
  suppliers: Supplier[];
  brands: Brand[];
  brandName?: string;
}

export default function CompareView({ suppliers, brands, brandName = 'Industrial Pumps' }: CompareViewProps) {
  const router = useRouter();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  // Use state for compared suppliers, initialized with preset suppliers
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>(suppliers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRemoveSupplier = (id: string) => {
    setSelectedSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const handleAddBrand = (brand: Brand) => {
    // Check if already added
    if (selectedSuppliers.some(s => s.brandId === brand.id)) return;

    // See if there's an existing supplier for this brand in the supplier database
    const existingSupp = suppliers.find(s => s.brandId === brand.id);

    let newSupplier: Supplier;
    if (existingSupp) {
      newSupplier = { ...existingSupp, id: `${existingSupp.id}-dyn-${Date.now()}` };
    } else {
      // Create high fidelity Supplier object from Brand details
      newSupplier = {
        id: `${brand.id}-dyn-supp-${Date.now()}`,
        name: `${brand.name} (Corporate Dealer)`,
        brandId: brand.id,
        brandName: brand.name,
        location: brand.headquarters || 'India',
        rating: brand.rating,
        reviewsCount: brand.reviewsCount,
        experienceYears: new Date().getFullYear() - brand.establishedYear,
        verified: brand.verified,
        responseTime: '2.5 hrs',
        deliveryTimeRange: '3-7 Days',
        priceEstimate: brand.topProducts && brand.topProducts.length > 0 ? '₹15,000 onwards' : 'On Request'
      };
    }

    setSelectedSuppliers(prev => [...prev, newSupplier]);
    setIsAddOpen(false);
    setSearchQuery('');
  };

  const handleCompareQuotes = () => {
    if (selectedSuppliers.length === 0) return;

    const names = selectedSuppliers.map(s => s.brandName).join(' & ');
    openBuyLeadForm({
      productName: 'OEM Supply Contract - Direct Quote Request',
      brandName: names,
      requirement: `Please provide competitive quotation with catalogs and pricing sheets for side-by-side compared suppliers: ${names}.`
    });
  };

  // Dynamic statistics for comparison summary
  const getComparisonStats = () => {
    if (selectedSuppliers.length === 0) return null;

    // Sort suppliers by rating
    const sortedByRating = [...selectedSuppliers].sort((a, b) => b.rating - a.rating);
    // Find fastest response
    const sortedByResponse = [...selectedSuppliers].sort((a, b) => {
      const aVal = parseFloat(a.responseTime) || 99;
      const bVal = parseFloat(b.responseTime) || 99;
      return aVal - bVal;
    });
    // Find most experienced
    const sortedByExperience = [...selectedSuppliers].sort((a, b) => b.experienceYears - a.experienceYears);

    return {
      bestRated: sortedByRating[0],
      fastest: sortedByResponse[0],
      mostExperienced: sortedByExperience[0],
      averageRating: (selectedSuppliers.reduce((sum, s) => sum + s.rating, 0) / selectedSuppliers.length).toFixed(1)
    };
  };

  const stats = getComparisonStats();

  // Filter available brands to add (search query & exclude already selected brand ids)
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          brand.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          brand.subCategories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Header bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft className="w-4 h-4 text-slate-800" />
          </button>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Compare Suppliers ({selectedSuppliers.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{brandName}</span>
          </div>
        </div>

        {selectedSuppliers.length < 5 && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100/80 border border-teal-100 text-[#028384] text-[10px] font-black uppercase tracking-wider rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Brand</span>
          </button>
        )}
      </div>

      {/* Main body scrollable list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intro */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[#028384] font-bold text-xs">
            <ThumbsUp className="w-4 h-4 text-[#028384]" />
            <span>Smart Side-by-Side Comparison</span>
          </div>
          <p className="text-[10px] text-teal-800 leading-relaxed font-medium">
            Evaluate response times, delivery capabilities, and reviews to find the best fit before connecting. Scroll horizontally to view more brands.
          </p>
        </div>

        {/* Side by side columns - Horizontally scrollable to avoid column squeeze */}
        <div className="overflow-x-auto pb-3 -mx-4 px-4 scrollbar-thin flex gap-3 select-none">
          {selectedSuppliers.map((supp, sIdx) => (
            <div
              key={supp.id}
              className="w-[145px] bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs shrink-0 relative hover:border-[#028384]/40 transition duration-200"
            >
              {/* Delete button */}
              <button
                onClick={() => handleRemoveSupplier(supp.id)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full text-slate-300 hover:text-rose-500 hover:bg-slate-100 transition z-10"
                title="Remove from comparison"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-2">
                {/* Header Logo Name */}
                <div className="text-center pb-2 border-b border-slate-100 pt-1.5">
                  <div className={`w-9 h-9 mx-auto rounded-full font-extrabold text-[10px] flex items-center justify-center ${
                    sIdx % 3 === 0 ? 'bg-teal-50 text-[#028384]' :
                    sIdx % 3 === 1 ? 'bg-amber-50 text-amber-600' :
                    'bg-indigo-50 text-indigo-600'
                  }`}>
                    {supp.brandName.substring(0, 3).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-[9px] text-slate-900 mt-1.5 line-clamp-2 leading-tight min-h-[24px]">
                    {supp.name}
                  </h3>
                </div>

                {/* Rating Parameter */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Rating</span>
                  <div className="flex items-center justify-center gap-0.5 text-[10px] font-extrabold text-slate-900 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{supp.rating}</span>
                    <span className="text-[8px] text-slate-400 font-normal">({supp.reviewsCount})</span>
                  </div>
                </div>

                {/* Experience Parameter */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Experience</span>
                  <div className="text-[10px] font-extrabold text-slate-900 mt-0.5">
                    {supp.experienceYears} Years
                  </div>
                </div>

                {/* Verified Parameter */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Verified</span>
                  <div className="flex justify-center mt-0.5">
                    {supp.verified ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <span className="text-[8px] text-slate-400">Standard</span>
                    )}
                  </div>
                </div>

                {/* Response Time */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Resp. Time</span>
                  <div className="text-[10px] font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-0.5">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    <span>{supp.responseTime}</span>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Delivery</span>
                  <div className="text-[9px] font-extrabold text-slate-900 mt-0.5">
                    {supp.deliveryTimeRange}
                  </div>
                </div>
              </div>

              {/* View Profile Action */}
              <div className="pt-2 border-t border-slate-100 mt-2.5 text-center">
                <Link
                  href={`/brands/${supp.brandId}`}
                  className="text-[9px] font-extrabold text-[#028384] hover:underline cursor-pointer"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}

          {/* Inline Add Brand Card at the end of scrollable list */}
          {selectedSuppliers.length < 5 && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="w-[145px] min-h-[340px] bg-white border-2 border-dashed border-slate-200 hover:border-[#028384]/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 group transition text-center shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#028384] group-hover:border-[#028384]/30 group-hover:bg-[#028384]/5 transition">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-[#028384] transition">Add Manufacturer</span>
            </button>
          )}
        </div>

        {/* Dynamic comparison summary card */}
        {selectedSuppliers.length > 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#028384]" />
              <span>Smart Comparison Insights</span>
            </h3>

            <div className="space-y-2.5 text-[11px] text-slate-600 font-medium">
              <div className="flex items-start gap-2 text-slate-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{stats?.bestRated.name}</strong> has the highest rating of{' '}
                  <strong className="text-slate-900">{stats?.bestRated.rating} ★</strong> ({stats?.bestRated.reviewsCount} verified buyers).
                </span>
              </div>

              <div className="flex items-start gap-2 text-slate-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{stats?.fastest.name}</strong> responds quickest in{' '}
                  <strong className="text-[#028384] font-bold">{stats?.fastest.responseTime}</strong>, compared to the group average.
                </span>
              </div>

              <div className="flex items-start gap-2 text-slate-600">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{stats?.mostExperienced.name}</strong> offers the longest industry tenure of{' '}
                  <strong className="text-slate-900">{stats?.mostExperienced.experienceYears} Years</strong>.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs shadow-xs italic">
            Add manufacturers above to compare them side-by-side
          </div>
        )}
      </div>

      {/* Persistent Compare CTA */}
      <div className="border-t border-slate-100 p-4 bg-white shrink-0 z-10">
        <button
          disabled={selectedSuppliers.length === 0}
          onClick={handleCompareQuotes}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Generate BuyLeads - Get Quotes From All</span>
        </button>
      </div>

      {/* Add Brand Bottom Sheet Modal */}
      {isAddOpen && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end z-30 transition duration-300">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsAddOpen(false)} />

          <div className="bg-white rounded-t-3xl max-h-[80%] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="font-extrabold text-xs text-slate-900">Add Manufacturer to Compare</h3>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Select from registered Indian brands</span>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-100 bg-white shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by brand name, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 focus:bg-white text-[11px] font-semibold text-slate-800 rounded-xl outline-none border border-transparent focus:border-[#028384]/30 transition"
                />
              </div>
            </div>

            {/* Brand Options List */}
            <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50 space-y-1">
              {filteredBrands.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-[10.5px] font-bold italic">
                  No matching brands found
                </div>
              ) : (
                filteredBrands.map((brand) => {
                  const isAlreadyAdded = selectedSuppliers.some(s => s.brandId === brand.id);
                  return (
                    <button
                      key={brand.id}
                      disabled={isAlreadyAdded}
                      onClick={() => handleAddBrand(brand)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition text-left ${
                        isAlreadyAdded
                          ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-slate-200/60 hover:border-[#028384]/30 hover:bg-teal-50/20 text-slate-800 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-white rounded-lg border border-slate-150 p-0.5 flex items-center justify-center shrink-0">
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="text-[8px] font-bold text-slate-400">
                              {brand.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[10.5px] text-slate-900 leading-tight">{brand.name}</h4>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{brand.headquarters}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-slate-500">
                          {brand.rating} ★
                        </span>
                        {isAlreadyAdded ? (
                          <span className="text-[8px] font-black text-[#028384] uppercase bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">Added</span>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 hover:bg-[#028384]/10 hover:text-[#028384] flex items-center justify-center text-slate-400 transition">
                            <Plus className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
