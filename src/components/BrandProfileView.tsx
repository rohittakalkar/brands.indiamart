'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, ShieldCheck, MapPin, Star, Globe, Calendar, Users, Heart, GitCompare, Download, FileText, Wrench, Phone, Clock, Gauge, Search, Package, Building2, MessageSquare, Send } from 'lucide-react';
import { Brand, Product, Supplier, Review, BrandMCat, ServiceCenter, MCat } from '../types';
import { BrandLogo } from './BrandLogo';
import { TrustBadge } from './TrustBadge';
import { AnimatedIcon } from './AnimatedIcon';
import { useShortlist } from './ShortlistProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import { useScrollChrome } from './ScrollChromeProvider';
import { useSearchHistory } from './SearchHistoryProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { BackButton } from './BackButton';
import { Breadcrumb } from './Breadcrumb';
import { scrollToSection } from '../lib/anchorScroll';

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
  const router = useRouter();
  const { shortlistedBrands, toggleShortlistBrand } = useShortlist();
  const { trackView } = useRecentlyViewed();
  const { navVisible } = useScrollChrome();
  const { trackSearch } = useSearchHistory();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  // Inline in this page's own header rather than the floating MobileSearchBar (hidden on
  // every /brands/* route) — same pattern as Category pages, so search is always reachable
  // without a separate overlay competing for the same top-of-screen real estate.
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  // A brand's full catalog can run to 40-150+ items now that every category carries a real
  // multi-brand catalog — rendering all of them by default turned this section into one that
  // scrolled for several thousand pixels. "Product Lines" above already lets a buyer jump
  // straight to one category's models; this cap keeps the flat list itself scannable too.
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const [activeSection, setActiveSection] = useState('products');

  useEffect(() => {
    trackView('brand', brand.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand.id]);

  const isBrandSaved = shortlistedBrands.includes(brand.id);

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      trackSearch(headerSearchQuery);
      router.push(`/search?q=${encodeURIComponent(headerSearchQuery)}`);
    }
  };

  // "Why Choose {brand}" — real numbers reframed as reasons to buy, not invented marketing
  // copy: years in business, on-time delivery rate, and verification status are all data
  // already collected elsewhere on this page, just narrated here as the buyer's "why trust
  // this OEM" beat rather than left as bare stat tiles.
  const whyChooseReasons = useMemo(() => {
    const reasons: { label: string; detail: string }[] = [];
    reasons.push({ label: `${new Date().getFullYear() - brand.establishedYear}+ years in business`, detail: `Manufacturing since ${brand.establishedYear}, with ${brand.manufacturingUnits} production unit${brand.manufacturingUnits !== 1 ? 's' : ''}.` });
    reasons.push({ label: `${brand.serviceMetrics.deliveryRate}% on-time delivery`, detail: `Tracked across ${brand.reviewsCount}+ buyer reviews and real seller performance data.` });
    if (brand.verified) {
      reasons.push({ label: 'Verified Manufacturer / OEM', detail: `Business identity and GST registration confirmed by IndiaMART${brand.verifiedSince ? ` since ${brand.verifiedSince}` : ''}.` });
    }
    reasons.push({ label: `${brand.countriesServed}+ countries served`, detail: `A track record beyond the domestic market backs the same quality standard sold here.` });
    return reasons;
  }, [brand]);

  // Page map for the fixed jump-nav below the header — one entry per section that actually
  // renders, in the same order they appear on the page. The story: what they make (Products)
  // → who's behind it (About) → why trust their execution (Why Choose) → where to buy
  // (Sellers) → deeper credentials (Trust) → third-party proof (Reviews). Products comes
  // first on purpose — real IndiaMART supplier profile pages lead with the product catalog,
  // not a company description, since that's what a buyer actually came here to see.
  const pageSections = [
    { id: 'products', label: 'Products', icon: Package, show: true },
    { id: 'about', label: 'About', icon: Building2, show: true },
    { id: 'why-choose', label: 'Why Choose', icon: Sparkles, show: true },
    { id: 'sellers', label: 'Sellers', icon: MapPin, show: brandSuppliers.length > 0 || serviceCenters.length > 0 },
    { id: 'trust', label: 'Trust', icon: ShieldCheck, show: brand.certifications.length > 0 },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, show: reviews.length > 0 },
  ].filter(s => s.show);

  // Scroll-spy — this page also scrolls at the document level rather than inside a clipped
  // container (confirmed via computed styles, same as Category/Brand-MCat), so a plain
  // window scroll listener is what actually tracks position here, not IntersectionObserver
  // rootMargin tuning.
  useEffect(() => {
    const ids = pageSections.map(s => s.id);
    let ticking = false;
    const computeActive = () => {
      const triggerLine = 130;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - triggerLine <= 0) {
          current = id;
        }
      }
      setActiveSection(current);
      ticking = false;
    };
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };
    computeActive();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSections.map(s => s.id).join(',')]);

  useEffect(() => {
    const pill = document.querySelector(`[data-pill="${activeSection}"]`);
    pill?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeSection]);

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 flex flex-col h-full overflow-hidden">
      {/* Header + page-map nav, pinned together as real fixed chrome on mobile — same
          treatment as Category/Brand-MCat (this page's layout scrolls at the document level,
          not inside a clipped flex/overflow-y-auto region, so position: sticky here would
          have no scrolling ancestor to stick against). Desktop reverts to normal in-flow
          positioning via md:static since DesktopNav already owns persistent top chrome there. */}
      <div className="fixed top-0 inset-x-0 z-30 md:static md:z-auto">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-1.5">
          {/* alwaysCanonical — see CategoryBrandsView's BackButton for why every level of
              Home > Category > Brand > Brand-MCat > Product needs it, not just the product
              page. Falls back to the category the buyer actually arrived from when that
              context exists (matching the breadcrumb below), not always the flat /brands
              listing — a buyer who filtered into Diesel Generators first should land back
              there, not lose that context. */}
          <BackButton
            fallbackHref={contextCategory ? `/categories/${contextCategory.id}` : '/brands'}
            title={contextCategory ? `Back to ${contextCategory.name}` : 'Back to all brands'}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition shrink-0"
            alwaysCanonical
          />
          {headerSearchOpen ? (
            <form onSubmit={handleHeaderSearchSubmit} className="flex-1 flex items-center gap-2 min-w-0">
              <div className="relative flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  placeholder="Search products, brands, models…"
                  className="w-full bg-canvas border border-line rounded-full pl-8 pr-3 py-1.5 text-[11px] outline-none focus:border-accent-blue/50"
                />
              </div>
              <button
                type="button"
                onClick={() => { setHeaderSearchOpen(false); setHeaderSearchQuery(''); }}
                className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 shrink-0 px-1"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="min-w-0">
                  <h1 className="font-extrabold text-sm text-slate-900 dark:text-slate-50 tracking-tight truncate">{brand.name}</h1>
                  <div className="flex items-center gap-1 text-[9.5px] text-slate-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-0.5 text-slate-700 dark:text-slate-300">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {brand.rating}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span>{brand.reviewsCount}+ Reviews</span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span>30K+ Buyers</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setHeaderSearchOpen(true)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleShortlistBrand(brand.id)}
                  className="p-1.5 hover:bg-rose-50 rounded-full text-rose-500 transition"
                  title={isBrandSaved ? "Remove Brand from Shortlist" : "Shortlist Brand"}
                >
                  <Heart className={`w-4.5 h-4.5 ${isBrandSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-400 dark:text-slate-500'}`} />
                </button>
                {brand.website && (
                  <a
                    href={`https://${brand.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition"
                    title="Visit Official Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <nav className="flex gap-2 overflow-x-auto scrollbar-none py-2.5 px-4">
            {pageSections.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                data-pill={id}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold transition whitespace-nowrap border ${
                  activeSection === id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-accent-blue/40 hover:text-accent-blue'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* pt-[112px] clears the fixed header+nav pair above (measured, matches Category/
          Brand-MCat); md:pt-0 since that pair reverts to normal flow on desktop. pb-24
          clears the truly-fixed footer below. */}
      <div className="flex-1 overflow-y-auto pt-[112px] md:pt-0 pb-24 md:pb-0">
        {/* Breadcrumb — states Home ▸ Category ▸ Brand so a cold-landed buyer has an
            immediate sense of hierarchy; the hero below no longer repeats the brand name,
            so the header's h1 and this trail are the only two places it appears. */}
        <div className="bg-white dark:bg-slate-900 px-5 pt-3 pb-1">
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
              both real, useful features that used to be buried below the fold. Surfacing
              both here means they're advertised, not just available. */}
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
            <div className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-semibold leading-snug">
              <Sparkles className="w-3.5 h-3.5 text-accent-blue shrink-0 mt-0.5" />
              <span>
                You were exploring{' '}
                <strong className="text-slate-900 dark:text-slate-50">
                  {brand.name.split(' ')[0]}{contextProduct ? ` ${contextProduct.keySpecValue.split(',')[0]}` : ''} {contextCategory.name}
                </strong>
              </span>
            </div>
            {contextProduct && (
              <Link
                href={`/brands/${brand.id}/${contextCategory.id}?model=${contextProduct.id}`}
                className="inline-flex items-center gap-1 mt-1.5 ml-5 text-[11px] font-bold text-accent-blue hover:text-heading transition"
              >
                Continue with {contextProduct.modelNumber}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}

        <div className="p-4 space-y-5">
          {/* Products — leads the page on purpose: real B2B supplier profiles (this is
              modeled directly on IndiaMART's own company-page structure) put the product
              catalog before a company description, since that's what a buyer actually came
              here to see. "What {brand} makes" is the opening beat of the story. */}
          <section id="products" className="scroll-mt-[120px] space-y-4">
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm">What {brand.name.split(' ')[0]} Makes</h2>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">Browse by product line, or the full catalog below.</p>
            </div>
            {brandMCats.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs uppercase tracking-wider">Product Lines</h3>
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
                        className={`bg-white dark:bg-slate-900 border rounded-xl p-3 flex items-center justify-between transition ${
                          isContextMatch ? 'border-accent-blue ring-1 ring-accent-blue/30' : 'border-slate-200/80 dark:border-slate-700/80 hover:border-accent-blue/40'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-[11px] text-slate-900 dark:text-slate-50 truncate">{mcat.name}</h4>
                            {isContextMatch && (
                              <span className="text-[7.5px] font-black text-accent-blue uppercase bg-accent-blue/10 px-1.5 py-0.5 rounded-full shrink-0">You were here</span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{mcat.tagline}</p>
                        </div>
                        <span className="text-[9px] font-extrabold text-accent-blue uppercase tracking-wider shrink-0 ml-2">View</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs uppercase tracking-wider">Active Standard Catalog</h3>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{brandProducts.length} Models</span>
            </div>
            {brandProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border text-center text-slate-400 dark:text-slate-500 text-xs">
                No direct product records listed yet. Use inquiry form to ask brand.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                  {(showAllProducts ? brandProducts : brandProducts.slice(0, 8)).map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.id}`}
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:border-accent-blue/40 transition cursor-pointer"
                    >
                      <div>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-24 object-contain rounded-xl bg-slate-50 dark:bg-slate-800/60 mix-blend-multiply"
                        />
                        <h4 className="font-bold text-[11px] text-slate-900 dark:text-slate-50 mt-2 line-clamp-2 leading-tight">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                        <span className="text-[10px] font-extrabold text-accent-blue block">{prod.priceRange}</span>
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5 uppercase font-mono">MOQ: {prod.moq}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                {!showAllProducts && brandProducts.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setShowAllProducts(true)}
                    className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-accent-blue/40 text-accent-blue rounded-xl text-[11px] font-bold transition"
                  >
                    Show All {brandProducts.length} Products
                  </button>
                )}
              </>
            )}
          </section>

          {/* About the Brand — now that the buyer has seen what they make, this answers
              "who's behind it": long description + the same quick facts (established,
              headquarters, reach, headcount) that used to open the page. */}
          <section id="about" className="scroll-mt-[120px] space-y-4">
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm">About {brand.name}</h2>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">Who's behind the products above.</p>
            </div>
            {brand.longDescription && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs">
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{brand.longDescription}</p>
              </div>
            )}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs uppercase tracking-wider">Company Highlights</h3>
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Established</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-50 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    Year {brand.establishedYear}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Headquarters</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-50 mt-0.5 flex items-center gap-1 truncate" title={brand.headquarters}>
                    <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    {brand.headquarters.split(',')[0]}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Global Reach</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-50 mt-0.5 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    {brand.countriesServed}+ Countries
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Employees</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-50 mt-0.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    {brand.employees}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose {brand} — real numbers (see whyChooseReasons above) reframed as
              buyer-facing reasons, the connective bridge between "who they are" and "here's
              where to actually buy" below. */}
          <section id="why-choose" className="scroll-mt-[120px] space-y-3">
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm flex items-center gap-1.5">
                <AnimatedIcon icon={Sparkles} variant="pulse" className="w-4 h-4 text-accent-purple" />
                Why Choose {brand.name.split(' ')[0]}?
              </h2>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">The track record behind those company highlights.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
              {whyChooseReasons.map((reason, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex gap-2.5">
                  <span className="w-5 h-5 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] text-slate-900 dark:text-slate-50">{reason.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{reason.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Service Performance — the quantified breakdown behind the on-time-delivery
                reason above, answering three separate buyer questions: does the seller
                reply, is the product as described, does delivery happen on time. */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs uppercase tracking-wider flex items-center gap-1">
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
                      <span className="font-bold text-slate-700 dark:text-slate-300">{metric.label}</span>
                      <span className="font-extrabold text-slate-900 dark:text-slate-50">{metric.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-green rounded-full" style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sellers & Dealers — "where to actually buy it", right after the trust-building
              beat above. Compare Sellers is the one path onward from here; per-seller Call/
              Chat only appears once a model is selected, on Brand-MCat or the product page. */}
          {(brandSuppliers.length > 0 || serviceCenters.length > 0) && (
            <section id="sellers" className="scroll-mt-[120px] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm">Sellers &amp; Dealer Network</h2>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">Convinced? Here's where to actually buy.</p>
                </div>
                {brandSuppliers.length > 0 && (
                  <Link
                    href={`/compare?brandId=${brand.id}`}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-accent-blue/10 hover:bg-accent-blue/15 border border-accent-blue/20 text-accent-blue text-[9.5px] font-black uppercase tracking-wider rounded-lg transition"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    Compare
                  </Link>
                )}
              </div>
              {brandSuppliers.length > 0 && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl px-3.5 py-2.5 flex items-center gap-4 text-[10px]">
                  <span className="font-bold text-heading">{brandSuppliers.length} Authorized Dealer{brandSuppliers.length !== 1 ? 's' : ''}</span>
                  <span className="text-slate-400 dark:text-slate-500">&bull;</span>
                  <span className="font-bold text-heading">{new Set(brandSuppliers.map(s => s.location.split(',').pop()?.trim())).size} States Covered</span>
                </div>
              )}
              {brandSuppliers.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border text-center text-slate-400 dark:text-slate-500 text-xs">
                  No local authorized supplier recorded. Inquire directly to match nearest dealer.
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {(showAllSuppliers ? brandSuppliers : brandSuppliers.slice(0, 6)).map((supp) => (
                      <div key={supp.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-50 leading-tight">{supp.name}</h4>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                              {supp.location}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 items-end shrink-0">
                            {supp.verified && <TrustBadge type="verified-supplier" who="IndiaMART" />}
                            {supp.isAuthorizedDealer && <TrustBadge type="authorized-dealer" who={brand.name} since={supp.authorizedSince} />}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-2 text-center text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                          <div>
                            <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Experience</span>
                            <span className="font-bold text-slate-900 dark:text-slate-50 block mt-0.5">{supp.experienceYears} Years</span>
                          </div>
                          <div className="border-x border-slate-100 dark:border-slate-800">
                            <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Resp. Time</span>
                            <span className="font-bold text-slate-900 dark:text-slate-50 block mt-0.5">{supp.responseTime}</span>
                            <span className="text-[7.5px] text-accent-green font-bold block mt-0.5">{supp.responseRate}% reply rate</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Rating</span>
                            <span className="font-bold text-slate-900 dark:text-slate-50 block mt-0.5 flex items-center justify-center gap-0.5">
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
                      className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-accent-blue/40 text-accent-blue rounded-xl text-[11px] font-bold transition"
                    >
                      Show All {brandSuppliers.length} Dealers
                    </button>
                  )}
                </>
              )}

              {/* Service Network */}
              {serviceCenters.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-accent-purple" />
                    Service Network
                  </h3>
                  <div className="space-y-3">
                    {serviceCenters.map((svc) => (
                      <div key={svc.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-50 leading-tight">{svc.name}</h4>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
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
                        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-2 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            {svc.contactPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            {svc.workingHours}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Trust & Credentials — deepens the trust established in Sellers above with the
              formal paperwork: certifications and the legal/business factsheet. */}
          {brand.certifications.length > 0 && (
            <section id="trust" className="scroll-mt-[120px] space-y-3">
              <div>
                <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm">Trust &amp; Credentials</h2>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">The paperwork behind the badges you've already seen.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs uppercase tracking-wider">Quality Certifications</h3>
                <div className="space-y-2">
                  {brand.certifications.map((cert, idx) => (
                    <div key={idx} className="flex gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs uppercase tracking-wider flex items-center gap-1">
                  <AnimatedIcon icon={ShieldCheck} variant="pulse" className="w-4 h-4 text-emerald-600" />
                  <span>Business Authenticity Proof</span>
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  {brand.gstNumber && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400 dark:text-slate-500">GST Registration:</span>
                      <span className="text-slate-900 dark:text-slate-50 font-mono font-bold flex items-center gap-1">
                        {brand.gstNumber}
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-sans font-bold">VERIFIED</span>
                      </span>
                    </div>
                  )}
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Legal Status:</span>
                    <span className="text-slate-900 dark:text-slate-50 font-bold">{brand.businessType}</span>
                  </div>
                  {brand.annualTurnover && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400 dark:text-slate-500">Annual Turnover:</span>
                      <span className="text-slate-900 dark:text-slate-50 font-bold">{brand.annualTurnover}</span>
                    </div>
                  )}
                  {brand.panNumber && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400 dark:text-slate-500">PAN Card ID:</span>
                      <span className="text-slate-900 dark:text-slate-50 font-mono font-bold">{brand.panNumber}</span>
                    </div>
                  )}
                  {brand.cinNumber && (
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400 dark:text-slate-500">Corporate Identification (CIN):</span>
                      <span className="text-slate-900 dark:text-slate-50 font-mono font-bold truncate max-w-[140px]">{brand.cinNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {brand.catalogueUrl && (
                <a
                  href={brand.catalogueUrl}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs flex items-center gap-3 hover:border-accent-blue/40 transition"
                >
                  <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shrink-0 text-rose-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-50 text-xs truncate">{brand.name} Product Catalogue</h4>
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold">PDF &middot; {brand.catalogueSizeMb} MB &middot; Updated {brand.catalogueUpdated}</span>
                  </div>
                  <Download className="w-4 h-4 text-accent-blue shrink-0" />
                </a>
              )}
            </section>
          )}

          {/* Buyer Reviews — closes the trust loop with third-party validation, the last
              beat before the buyer either explores further via the jump-nav or acts via the
              sticky footer below. */}
          {reviews.length > 0 && (
            <section id="reviews" className="scroll-mt-[120px] space-y-3">
              <div>
                <h2 className="font-extrabold text-slate-900 dark:text-slate-50 text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-accent-blue" />
                  Buyer Reviews
                </h2>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">Real feedback, not just the credentials above.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[11px] text-slate-900 dark:text-slate-50 block leading-tight">{rev.userName}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{rev.userRole}, {rev.companyName}</span>
                      </div>
                      <div className="flex gap-0.5 items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* No floating WhatsApp/Call launcher on this page — Brand Hub's job is helping a
          buyer decide which product line fits, not converting them before they've picked
          a model. Contact-seller actions (Quote/Call/Chat) only appear once a buyer has
          committed to a specific model, on Brand-MCat or the product page. */}

      {/* Sticky CTA — Get Quotes (primary) is the one action available at the brand level
          without having picked a specific model yet; Compare (secondary) is a real
          decision-support move for a buyer still validating the brand itself. Genuinely
          fixed to the viewport rather than a flex-flow sibling that only looked pinned on
          short pages. */}
      <div
        className={`md:static md:bottom-auto fixed left-0 right-0 z-30 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-2.5 transition-[bottom] duration-200 ${
          navVisible ? 'bottom-14' : 'bottom-0'
        }`}
      >
        <button
          onClick={() => openBuyLeadForm({
            productName: `${brand.name} Products`,
            brandName: brand.name,
            requirement: `Looking for ${brand.name} products. Please share available models, technical datasheets, and best pricing for my requirement.`
          })}
          className="flex-1 bg-cta hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Get Quotes</span>
        </button>
        <Link
          href={`/compare?brandId=${brand.id}`}
          className="shrink-0 px-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
        >
          <GitCompare className="w-4 h-4" />
          <span>Compare</span>
        </Link>
      </div>
    </div>
  );
}
