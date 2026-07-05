'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, MapPin, Star, Globe, Calendar, Users, Heart, Compass, GitCompare, Download, FileText, Wrench, Phone, Clock, Gauge } from 'lucide-react';
import { Brand, Product, Supplier, Review, BrandMCat, ServiceCenter, MCat } from '../types';
import { BrandLogo } from './BrandLogo';
import { TrustBadge } from './TrustBadge';
import { AnimatedIcon } from './AnimatedIcon';
import { useShortlist } from './ShortlistProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import { useScrollChrome } from './ScrollChromeProvider';
import { BackButton } from './BackButton';
import { Breadcrumb } from './Breadcrumb';

interface BrandProfileViewProps {
  brand: Brand;
  primaryCategory?: MCat;
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

export default function BrandProfileView({ brand, primaryCategory, brandMCats, brandProducts, brandSuppliers, serviceCenters, reviews, contextCategory, contextProduct }: BrandProfileViewProps) {
  const { shortlistedBrands, toggleShortlistBrand } = useShortlist();
  const { trackView } = useRecentlyViewed();
  const { navVisible } = useScrollChrome();
  const scrollRef = useRef<HTMLDivElement>(null);
  // Arriving with category context means the buyer already has purchase intent for a
  // specific product line — open straight to Products instead of making them find the tab.
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'suppliers' | 'trust'>(contextCategory ? 'products' : 'overview');
  // A brand's full catalog can run to 40-150+ items now that every category carries a real
  // multi-brand catalog — rendering all of them by default turned this tab into a page that
  // scrolled for several thousand pixels. "Product Lines" above already lets a buyer jump
  // straight to one category's models; this cap keeps the flat list itself scannable too.
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);

  useEffect(() => {
    trackView('brand', brand.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand.id]);

  // Brand Hub's job is helping a buyer decide WHICH product line fits, not converting them
  // yet — the buyer hasn't chosen a model, so there's nothing concrete for a seller to
  // quote against. "Explore" jumps straight to the Products tab and resets scroll, since
  // switching tabs alone can otherwise leave the buyer mid-scroll into unrelated content.
  const handleExplore = () => {
    setActiveSubTab('products');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isBrandSaved = shortlistedBrands.includes(brand.id);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden">
      {/* Brand Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          {/* router.back() when the buyer has real in-app history (preserves native scroll
              restoration); falls back to the brand directory on a cold landing (e.g. from
              a search engine), where there's nothing in-app to go back to. */}
          <BackButton fallbackHref="/brands" title="Back to all brands" />
          <div>
            {/* Single source of truth for the brand name — the gradient hero below no
                longer repeats it, so this is the one place it's stated. */}
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight">{brand.name}</h1>
            {/* Compact stat line — replaces the old full-width stat row inside the gradient
                hero below, which took a disproportionate amount of vertical space for three
                numbers a buyer can take in at a glance. */}
            <div className="flex items-center gap-1 text-[9.5px] text-slate-500 font-bold">
              <span className="flex items-center gap-0.5 text-slate-700">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                {brand.rating}
              </span>
              <span className="text-slate-300">·</span>
              <span>{brand.reviewsCount}+ Reviews</span>
              <span className="text-slate-300">·</span>
              <span>30K+ Buyers</span>
            </div>
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

      {/* Main brand scroll area — pb-24 clears the truly-fixed footer below */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {/* Breadcrumb — states Home ▸ Category ▸ Brand so a cold-landed buyer has an
            immediate sense of hierarchy; the hero below no longer repeats the brand name,
            so the header's h1 and this trail are the only two places it appears. */}
        <div className="bg-white px-5 pt-3 pb-1">
          <Breadcrumb
            segments={[
              ...(primaryCategory ? [{ label: primaryCategory.name, href: `/categories/${primaryCategory.id}` }] : []),
              { label: brand.name }
            ]}
          />
        </div>

        {/* Brand Banner Card — logo, tagline, trust badges and quick actions only; the
            name itself lives once, in the header above, not repeated here. */}
        <div className="bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white relative">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-accent-blue font-extrabold text-base border-2 border-white shadow-md overflow-hidden p-1.5">
                <BrandLogo logo={brand.logo} name={brand.name} />
              </div>
              <p className="text-[11px] text-white/75 leading-snug mt-2">{brand.description}</p>
            </div>
            <div className="flex flex-col gap-1 items-end shrink-0">
              <TrustBadge type="manufacturer-oem" who={brand.name} className="!bg-white/20 !text-white !border-white/40" />
              {brand.verified && (
                <TrustBadge type="verified-supplier" who="IndiaMART" since={brand.verifiedSince} className="!bg-white/20 !text-white !border-white/40" />
              )}
            </div>
          </div>
          {/* Quick actions — catalogue download and side-by-side seller comparison are
              both real, useful features that used to be buried below the fold (the PDF a
              full-width card deep in the Products tab, Compare only implied by the "Sellers
              (N)" sub-tab label). Surfacing both here means they're advertised, not just
              available. */}
          <div className="flex flex-wrap gap-2 mt-3">
            {brand.catalogueUrl && (
              <a
                href={brand.catalogueUrl}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1 transition"
              >
                <Download className="w-3 h-3" /> Catalogue &middot; {brand.catalogueSizeMb} MB
              </a>
            )}
            {brandSuppliers.length > 0 && (
              <Link
                href={`/compare?brandId=${brand.id}`}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1 transition"
              >
                <GitCompare className="w-3 h-3" /> Compare {brandSuppliers.length} Sellers
              </Link>
            )}
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
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
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

              {/* Service Performance — quantified breakdown of the single blended `rating`,
                  answering three separate buyer questions: does the seller reply, is the
                  product as described, does delivery happen on time. */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1">
                  <Gauge className="w-4 h-4 text-accent-blue" />
                  <span>Service Performance</span>
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Response Rate', value: brand.serviceMetrics.responseRate },
                    { label: 'Quality Rate', value: brand.serviceMetrics.qualityRate },
                    { label: 'On-Time Delivery', value: brand.serviceMetrics.deliveryRate }
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-slate-700">{metric.label}</span>
                        <span className="font-extrabold text-slate-900">{metric.value}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-green rounded-full" style={{ width: `${metric.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Authenticity Data */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1">
                  <AnimatedIcon icon={ShieldCheck} variant="pulse" className="w-4 h-4 text-emerald-600" />
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
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-400">Legal Status:</span>
                    <span className="text-slate-900 font-bold">{brand.businessType}</span>
                  </div>
                  {brand.annualTurnover && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Annual Turnover:</span>
                      <span className="text-slate-900 font-bold">{brand.annualTurnover}</span>
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
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Active Standard Catalog</h3>
                <span className="text-[9px] font-bold text-slate-400">{brandProducts.length} Models</span>
              </div>
              {brandProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border text-center text-slate-400 text-xs">
                  No direct product records listed yet. Use inquiry form to ask brand.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                    {(showAllProducts ? brandProducts : brandProducts.slice(0, 8)).map((prod) => (
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
                  {!showAllProducts && brandProducts.length > 8 && (
                    <button
                      type="button"
                      onClick={() => setShowAllProducts(true)}
                      className="w-full py-2.5 bg-white border border-slate-200 hover:border-accent-blue/40 text-accent-blue rounded-xl text-[11px] font-bold transition"
                    >
                      Show All {brandProducts.length} Products
                    </button>
                  )}
                </>
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
                <>
                  <div className="space-y-3">
                    {(showAllSuppliers ? brandSuppliers : brandSuppliers.slice(0, 6)).map((supp) => (
                      <div key={supp.id} className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 leading-tight">{supp.name}</h4>
                            <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {supp.location}
                            </span>
                            {/* No direct contact action here on purpose — the buyer hasn't
                                picked a model yet, so there's nothing specific to quote.
                                "Compare Sellers" above is the one path onward from this tab;
                                per-seller Call/Chat only appears once a model is selected,
                                on the Brand-MCat page or the product page itself. */}
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
                            <span className="text-[7.5px] text-accent-green font-bold block mt-0.5">{supp.responseRate}% reply rate</span>
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
                  {!showAllSuppliers && brandSuppliers.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowAllSuppliers(true)}
                      className="w-full py-2.5 bg-white border border-slate-200 hover:border-accent-blue/40 text-accent-blue rounded-xl text-[11px] font-bold transition"
                    >
                      Show All {brandSuppliers.length} Dealers
                    </button>
                  )}
                </>
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

      {/* No floating WhatsApp/Call launcher on this page — Brand Hub's job is helping a
          buyer decide which product line fits, not converting them before they've picked
          a model. Contact-seller actions (Quote/Call/Chat) only appear once a buyer has
          committed to a specific model, on Brand-MCat or the product page. */}

      {/* Sticky CTA — Explore (primary) moves the buyer toward picking a product line;
          Compare (secondary) is a real decision-support move for a buyer still validating
          the brand itself. Neither is a contact-seller action. Genuinely fixed to the
          viewport rather than a flex-flow sibling that only looked pinned on short pages. */}
      <div
        className={`md:static md:bottom-auto fixed left-0 right-0 z-30 border-t border-slate-100 bg-white p-4 flex items-center gap-2.5 transition-[bottom] duration-200 ${
          navVisible ? 'bottom-14' : 'bottom-0'
        }`}
      >
        <button
          onClick={handleExplore}
          className="flex-1 bg-cta hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </button>
        <Link
          href={`/compare?brandId=${brand.id}`}
          className="shrink-0 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
        >
          <GitCompare className="w-4 h-4" />
          <span>Compare</span>
        </Link>
      </div>
    </div>
  );
}
