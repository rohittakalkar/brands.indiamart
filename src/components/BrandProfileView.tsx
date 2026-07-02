'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, MapPin, Star, Globe, Calendar, Users, Heart, Send } from 'lucide-react';
import { Brand, Product, Supplier, Review } from '../types';
import { BrandLogo } from './BrandLogo';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';

interface BrandProfileViewProps {
  brand: Brand;
  brandProducts: Product[];
  brandSuppliers: Supplier[];
  reviews: Review[];
}

export default function BrandProfileView({ brand, brandProducts, brandSuppliers, reviews }: BrandProfileViewProps) {
  const router = useRouter();
  const { shortlistedBrands, toggleShortlistBrand } = useShortlist();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'suppliers' | 'trust'>('overview');

  const handleInquireAll = () => {
    openBuyLeadForm({
      brandName: brand.name,
      productName: brand.topProducts[0] || 'Industrial Spec Machinery',
      requirement: `Requesting standard quotes for ${brand.name} solutions. Please share product catalogs, pricing guidelines, and nearest dealership locations.`
    });
  };

  const isBrandSaved = shortlistedBrands.includes(brand.id);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden">
      {/* Brand Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft className="w-4 h-4 text-slate-800" />
          </button>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">{brand.name}</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{brand.businessType}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleShortlistBrand(brand.id)}
            className="p-1.5 hover:bg-rose-50 rounded-full text-rose-500 transition"
            title={isBrandSaved ? "Remove Brand from Shortlist" : "Shortlist Brand"}
          >
            <Heart className={`w-4.5 h-4.5 ${isBrandSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
          </button>
          {brand.website && (
            <a
              href={`https://${brand.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition"
              title="Visit Official Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Main brand scroll area */}
      <div className="flex-1 overflow-y-auto">
        {/* Brand Banner Card */}
        <div className="bg-gradient-to-r from-[#028384] to-[#005e60] px-5 py-6 text-white relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#028384] font-extrabold text-base border-2 border-white shadow-md overflow-hidden p-1.5">
                <BrandLogo logo={brand.logo} name={brand.name} />
              </div>
              <h1 className="text-base font-extrabold tracking-tight mt-3">{brand.name}</h1>
              <p className="text-[10px] text-teal-100 leading-snug">{brand.description}</p>
            </div>
            {brand.verified && (
              <span className="bg-white/20 border border-white/40 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-white fill-emerald-500/80" />
                Verified Brand
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-5 border-t border-white/20 pt-4 text-center">
            <div>
              <div className="text-sm font-extrabold">{brand.reviewsCount}+</div>
              <div className="text-[8px] text-teal-100 font-bold uppercase tracking-wide">Reviews</div>
            </div>
            <div className="border-x border-white/20">
              <div className="text-sm font-extrabold">{brand.rating} / 5</div>
              <div className="text-[8px] text-teal-100 font-bold uppercase tracking-wide">Avg Rating</div>
            </div>
            <div>
              <div className="text-sm font-extrabold">30K+</div>
              <div className="text-[8px] text-teal-100 font-bold uppercase tracking-wide">Buyers Connected</div>
            </div>
          </div>
        </div>

        {/* Quick Horizontal Scroll Sub Tabs */}
        <div className="bg-white border-b border-slate-100 flex text-xs select-none sticky top-0 z-10 shadow-xs px-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-3 font-bold relative transition ${activeSubTab === 'overview' ? 'text-[#028384]' : 'text-slate-500'}`}
          >
            Overview
            {activeSubTab === 'overview' && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#028384] rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-3 font-bold relative transition ${activeSubTab === 'products' ? 'text-[#028384]' : 'text-slate-500'}`}
          >
            Products ({brandProducts.length})
            {activeSubTab === 'products' && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#028384] rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveSubTab('suppliers')}
            className={`px-4 py-3 font-bold relative transition ${activeSubTab === 'suppliers' ? 'text-[#028384]' : 'text-slate-500'}`}
          >
            Sellers ({brandSuppliers.length})
            {activeSubTab === 'suppliers' && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#028384] rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveSubTab('trust')}
            className={`px-4 py-3 font-bold relative transition ${activeSubTab === 'trust' ? 'text-[#028384]' : 'text-slate-500'}`}
          >
            Trust & Credentials
            {activeSubTab === 'trust' && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#028384] rounded-full"></div>}
          </button>
        </div>

        {/* Tab panels body */}
        <div className="p-4 space-y-4">
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              {/* Long Description */}
              {brand.longDescription && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                  <h3 className="font-extrabold text-slate-900 text-xs mb-1.5 uppercase tracking-wider">About the Brand</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{brand.longDescription}</p>
                </div>
              )}

              {/* Statistics Highlights */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Company Highlights</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Established</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Year {brand.establishedYear}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Headquarters</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1 truncate" title={brand.headquarters}>
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {brand.headquarters.split(',')[0]}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Global Reach</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      {brand.countriesServed}+ Countries
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Employees</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {brand.employees}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business Authenticity Data */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Business Authenticity Proof</span>
                </h3>
                <div className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600">
                  {brand.gstNumber && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">GST Registration:</span>
                      <span className="text-slate-900 font-mono font-bold flex items-center gap-1">
                        {brand.gstNumber}
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-sans font-bold">VERIFIED</span>
                      </span>
                    </div>
                  )}
                  {brand.panNumber && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">PAN Card ID:</span>
                      <span className="text-slate-900 font-mono font-bold">{brand.panNumber}</span>
                    </div>
                  )}
                  {brand.cinNumber && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Corporate Identification (CIN):</span>
                      <span className="text-slate-900 font-mono font-bold truncate max-w-[140px]">{brand.cinNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'products' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Active Standard Catalog</h3>
              {brandProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border text-center text-slate-400 text-xs">
                  No direct product records listed yet. Use inquiry form to ask brand.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {brandProducts.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.id}`}
                      className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:border-[#028384]/40 transition cursor-pointer"
                    >
                      <div>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-contain rounded-xl bg-slate-50 mix-blend-multiply"
                        />
                        <h4 className="font-bold text-[11px] text-slate-900 mt-2 line-clamp-2 leading-tight">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="border-t border-slate-100 pt-2 mt-2">
                        <span className="text-[10px] font-extrabold text-[#028384] block">{prod.priceRange}</span>
                        <span className="text-[8px] text-slate-400 font-bold block mt-0.5 uppercase font-mono">MOQ: {prod.moq}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'suppliers' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Authorized Channels</h3>
              {brandSuppliers.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border text-center text-slate-400 text-xs">
                  No local authorized supplier recorded. Inquire directly to match nearest dealer.
                </div>
              ) : (
                <div className="space-y-3">
                  {brandSuppliers.map((supp) => (
                    <div key={supp.id} className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">{supp.name}</h4>
                          <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {supp.location}
                          </span>
                        </div>
                        {supp.verified && (
                          <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 border border-emerald-200 rounded-full shrink-0 flex items-center gap-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 text-center text-[10px] text-slate-600 font-medium">
                        <div>
                          <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Experience</span>
                          <span className="font-bold text-slate-900 block mt-0.5">{supp.experienceYears} Years</span>
                        </div>
                        <div className="border-x border-slate-100">
                          <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Resp. Time</span>
                          <span className="font-bold text-slate-900 block mt-0.5">{supp.responseTime}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Rating</span>
                          <span className="font-bold text-slate-900 block mt-0.5 flex items-center justify-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {supp.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'trust' && (
            <div className="space-y-4">
              {/* Credentials Grid */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Quality Certifications</h3>
                <div className="space-y-2">
                  {brand.certifications.map((cert, idx) => (
                    <div key={idx} className="flex gap-2 text-xs font-semibold text-slate-700">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews & Client Voices Section */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Buyer Voices</h3>
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="space-y-1.5 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-[11px] text-slate-900 block leading-tight">{rev.userName}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{rev.userRole}, {rev.companyName}</span>
                        </div>
                        <div className="flex gap-0.5 items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-relaxed font-medium italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Persistent brand-wide inquiry trigger */}
      <div className="border-t border-slate-100 p-4 bg-white shrink-0">
        <button
          onClick={handleInquireAll}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Inquire With Brand Distributors</span>
        </button>
      </div>
    </div>
  );
}
