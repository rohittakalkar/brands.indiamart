'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Sparkles, ShieldCheck, MapPin, Star, Globe, Calendar, Users, Heart, Send, GitCompare, Download, FileText, Wrench, Phone, Clock, LayoutGrid } from 'lucide-react';
import { Brand, Product, Supplier, Review, BrandMCat, ServiceCenter } from '../types';
import { BrandLogo } from './BrandLogo';
import { TrustBadge } from './TrustBadge';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';

interface BrandProfileViewProps {
  brand: Brand;
  brandMCats: BrandMCat[];
  brandProducts: Product[];
  brandSuppliers: Supplier[];
  serviceCenters: ServiceCenter[];
  reviews: Review[];
  // Present only when the buyer arrived here from a filtered category page — lets the
  // Brand Hub surface "you were exploring X" instead of losing that intent on navigation.
  contextCategory?: { id: string; name: string };
  contextProduct?: Product;
}

export default function BrandProfileView({ brand, brandMCats, brandProducts, brandSuppliers, serviceCenters, reviews, contextCategory, contextProduct }: BrandProfileViewProps) {
  const router = useRouter();
  const { shortlistedBrands, toggleShortlistBrand } = useShortlist();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const { trackView } = useRecentlyViewed();
  // Arriving with category context means the buyer already has purchase intent for a
  // specific product line — open straight to Products instead of making them find the tab.
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'suppliers' | 'trust'>(contextCategory ? 'products' : 'overview');

  useEffect(() => {
    trackView('brand', brand.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand.id]);

  const handleInquireAll = () => {
    openBuyLeadForm({
      brandName: brand.name,
      productName: brand.topProducts[0] || 'Industrial Spec Machinery',
      requirement: `Requesting standard quotes for ${brand.name} solutions. Please share product catalogs, pricing guidelines, and nearest dealership locations.`
    });
  };

  const handleExploreProducts = () => {
    setActiveSubTab('products');
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
        <div className="bg-gradient-to-r from-primary to-secondary px-5 py-6 text-white relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-accent-blue font-extrabold text-base border-2 border-white shadow-md overflow-hidden p-1.5">
                <BrandLogo logo={brand.logo} name={brand.name} />
              </div>
              <h1 className="text-base font-extrabold tracking-tight mt-3">{brand.name}</h1>
              <p className="text-[10px] text-white/70 leading-snug">{brand.description}</p>
            </div>
            <div className="flex flex-col gap-1 items-end shrink-0">
              <TrustBadge type="manufacturer-oem" who={brand.name} className="!bg-white/20 !text-white !border-white/40" />
              {brand.verified && (
                <TrustBadge type="verified-supplier" who="IndiaMART" since={brand.verifiedSince} className="!bg-white/20 !text-white !border-white/40" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-5 border-t border-white/20 pt-4 text-center">
            <div>
              <div className="text-sm font-extrabold">{brand.reviewsCount}+</div>
              <div className="text-[8px] text-white/70 font-bold uppercase tracking-wide">Reviews</div>
            </div>
            <div className="border-x border-white/20">
              <div className="text-sm font-extrabold">{brand.rating} / 5</div>
              <div className="text-[8px] text-white/70 font-bold uppercase tracking-wide">Avg Rating</div>
            </div>
            <div>
              <div className="text-sm font-extrabold">30K+</div>
              <div className="text-[8px] text-white/70 font-bold uppercase tracking-wide">Buyers Connected</div>
            </div>
          </div>
        </div>

        {/* Intent-continuity banner — only renders when the buyer arrived from a
            filtered category page, so it's purely additive and never shown on a
            cold/search-driven visit to this brand. */}
        {contextCategory && (
          <div className="bg-accent-blue/5 border-b border-accent-blue/15 px-4 py-3">
            <div className="flex items-start gap-2 text-[11px] text-slate-700 font-semibold leading-snug">
              <Sparkles className="w-3.5 h-3.5 text-accent-blue shrink-0 mt-0.5" />
              <span>
                You were exploring{' '}
                <strong className="text-slate-900">
                  {brand.name.split(' ')[0]}{contextProduct ? ` ${contextProduct.keySpecValue.split(',')[0]}` : ''} {contextCategory.name}
                </strong>
              </span>
            </div>
            {contextProduct && (
              <Link
                href={`/brands/${brand.id}/${contextCategory.id}?model=${contextProduct.id}`}
                className="inline-flex items-center gap-1 mt-1.5 ml-5 text-[11px] font-bold text-accent-blue hover:text-primary transition"
              >
                Continue with {contextProduct.modelNumber}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}

        {/* Quick Horizontal Scroll Sub Tabs */}
        <div className="bg-white border-b border-slate-100 flex text-xs select-none sticky top-0 z-10 shadow-xs px-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-3 font-bold relative transition ${activeSubTab === 'overview' ? 'text-accent-blue' : 'text-slate-500'}`}
          >
            Overview
            {activeSubTab === 'overview' && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-3 font-bold relative transition ${activeSubTab === 'products' ? 'text-accent-blue' : 'text-slate-500'}`}
          >
            Products ({brandProducts.length})
            {activeSubTab === 'products' && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveSubTab('suppliers')}
            className={`px-4 py-3 font-bold relative transition ${activeSubTab === 'suppliers' ? 'text-accent-blue' : 'text-slate-500'}`}
          >
            Sellers ({brandSuppliers.length})
            {activeSubTab === 'suppliers' && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveSubTab('trust')}
            className={`px-4 py-3 font-bold relative transition ${activeSubTab === 'trust' ? 'text-accent-blue' : 'text-slate-500'}`}
          >
            Trust & Credentials
            {activeSubTab === 'trust' && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-blue rounded-full"></div>}
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

              {/* Downloadable Catalogue */}
              {brand.catalogueUrl && (
                <a
                  href={brand.catalogueUrl}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3 hover:border-accent-blue/40 transition"
                >
                  <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shrink-0 text-rose-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-900 text-xs truncate">{brand.name} Product Catalogue</h4>
                    <span className="text-[9.5px] text-slate-400 font-semibold">PDF &middot; {brand.catalogueSizeMb} MB &middot; Updated {brand.catalogueUpdated}</span>
                  </div>
                  <Download className="w-4 h-4 text-accent-blue shrink-0" />
                </a>
              )}
            </div>
          )}

          {activeSubTab === 'products' && (
            <div className="space-y-5">
              {brandMCats.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Product Lines</h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {brandMCats.map((mcat) => {
                      const isContextMatch = contextCategory?.id === mcat.mcatId;
                      const href = isContextMatch && contextProduct
                        ? `/brands/${brand.id}/${mcat.mcatId}?model=${contextProduct.id}`
                        : `/brands/${brand.id}/${mcat.mcatId}`;
                      return (
                        <Link
                          key={mcat.id}
                          href={href}
                          className={`bg-white border rounded-xl p-3 flex items-center justify-between transition ${
                            isContextMatch ? 'border-accent-blue ring-1 ring-accent-blue/30' : 'border-slate-200/80 hover:border-accent-blue/40'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-[11px] text-slate-900 truncate">{mcat.name}</h4>
                              {isContextMatch && (
                                <span className="text-[7.5px] font-black text-accent-blue uppercase bg-accent-blue/10 px-1.5 py-0.5 rounded-full shrink-0">You were here</span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5 truncate">{mcat.tagline}</p>
                          </div>
                          <span className="text-[9px] font-extrabold text-accent-blue uppercase tracking-wider shrink-0 ml-2">View</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
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
                      className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:border-accent-blue/40 transition cursor-pointer"
                    >
                      <div>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-24 object-contain rounded-xl bg-slate-50 mix-blend-multiply"
                        />
                        <h4 className="font-bold text-[11px] text-slate-900 mt-2 line-clamp-2 leading-tight">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="border-t border-slate-100 pt-2 mt-2">
                        <span className="text-[10px] font-extrabold text-accent-blue block">{prod.priceRange}</span>
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
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Dealer Network</h3>
                {brandSuppliers.length > 0 && (
                  <Link
                    href={`/compare?brandId=${brand.id}`}
                    className="flex items-center gap-1 px-2.5 py-1 bg-accent-blue/10 hover:bg-accent-blue/15 border border-accent-blue/20 text-accent-blue text-[9.5px] font-black uppercase tracking-wider rounded-lg transition"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    Compare Sellers
                  </Link>
                )}
              </div>
              {brandSuppliers.length > 0 && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl px-3.5 py-2.5 flex items-center gap-4 text-[10px]">
                  <span className="font-bold text-primary">{brandSuppliers.length} Authorized Dealer{brandSuppliers.length !== 1 ? 's' : ''}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="font-bold text-primary">{new Set(brandSuppliers.map(s => s.location.split(',').pop()?.trim())).size} States Covered</span>
                </div>
              )}
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
                          <a href={`tel:${supp.contactPhone.replace(/\s+/g, '')}`} className="text-[9px] text-accent-blue font-bold flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {supp.contactPhone}
                          </a>
                        </div>
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          {supp.verified && <TrustBadge type="verified-supplier" who="IndiaMART" />}
                          {supp.isAuthorizedDealer && <TrustBadge type="authorized-dealer" who={brand.name} since={supp.authorizedSince} />}
                        </div>
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

              {/* Service Network */}
              {serviceCenters.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-accent-purple" />
                    Service Network
                  </h3>
                  <div className="space-y-3">
                    {serviceCenters.map((svc) => (
                      <div key={svc.id} className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">{svc.name}</h4>
                          <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {svc.location}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {svc.servicesOffered.map((s, idx) => (
                            <span key={idx} className="bg-accent-purple/10 border border-accent-purple/20 text-accent-purple rounded-full px-2 py-0.5 text-[9px] font-bold">
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-[10px] text-slate-600 font-medium">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {svc.contactPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {svc.workingHours}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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

      {/* Sticky CTA — primary action is exploring products by category, Get Quotes stays available as a secondary path */}
      <div className="border-t border-slate-100 p-4 bg-white shrink-0 flex items-center gap-2.5">
        <button
          onClick={handleExploreProducts}
          className="flex-1 bg-cta hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Explore Products by Category</span>
        </button>
        <button
          onClick={handleInquireAll}
          className="shrink-0 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden md:inline">Get Quotes</span>
        </button>
      </div>
    </div>
  );
}
