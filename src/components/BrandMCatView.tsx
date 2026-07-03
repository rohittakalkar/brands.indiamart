'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Send, ChevronRight, HelpCircle, ShieldCheck, Check, Download, FileText, X } from 'lucide-react';
import { BrandMCat, Brand, Product, Supplier, Review } from '../types';
import { TrustBadge } from './TrustBadge';
import { ConnectButton } from './ConnectButton';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useShortlist } from './ShortlistProvider';
import { buildRfqRequirement } from '../lib/rfq';

interface BrandMCatViewProps {
  brandMCat: BrandMCat;
  brand: Brand;
  categoryName: string;
  products: Product[];
  suppliers: Supplier[];
  reviews: Review[];
  // Carried forward from a category-page spec filter or the Brand Hub's "Continue with..."
  // link (via ?model=) — preselects the buyer's actual model instead of defaulting to
  // whichever product happens to sit first in the underlying array.
  initialModelId?: string;
}

const FAQ_TEMPLATE = (mcatName: string, brandName: string) => [
  {
    q: `Are all ${mcatName} listed here sold directly by ${brandName}?`,
    a: `No. ${brandName} manufactures these products; the sellers shown are Authorized Dealers verified to sell genuine ${brandName} products in your region. Always check the Authorized Dealer badge before ordering.`
  },
  {
    q: 'How do I choose the right model?',
    a: 'Select a model above to see its full specifications and price, then compare it against other models in the table before requesting quotes.'
  },
  {
    q: 'How is pricing determined?',
    a: 'Listed price ranges are indicative. Final pricing depends on exact specification, quantity, delivery location, and after-sales terms — confirm with a verified seller via Get Quotes.'
  }
];

export default function BrandMCatView({ brandMCat, brand, categoryName, products, suppliers, reviews, initialModelId }: BrandMCatViewProps) {
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const { shortlistedProducts, toggleShortlistProduct } = useShortlist();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Prefer the buyer's carried-forward model selection; fall back to the first product
  // only when there's no prior context (e.g. a cold visit via search or direct link).
  const initialProductExists = initialModelId && products.some(p => p.id === initialModelId);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    initialProductExists ? initialModelId : products[0]?.id
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showAllModelsDealers, setShowAllModelsDealers] = useState(false);

  const faqs = FAQ_TEMPLATE(brandMCat.name, brand.name);

  const prices = products.map(p => parseInt(p.priceRange.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n));
  const minPrice = prices.length ? Math.min(...prices) : null;

  const selectedProduct = useMemo(
    () => products.find(p => p.id === selectedModelId) || products[0],
    [products, selectedModelId]
  );

  // Dealer availability by location — buyer can narrow the exact model's sellers to their region
  const dealerLocations = useMemo(() => {
    const states = new Set(suppliers.map(s => s.location.split(',').pop()?.trim()).filter(Boolean) as string[]);
    return [...states].sort();
  }, [suppliers]);

  const visibleDealers = useMemo(() => {
    let result = suppliers;
    if (!showAllModelsDealers && selectedProduct) {
      result = result.filter(s => s.productId === selectedProduct.id);
    }
    if (selectedLocation) {
      result = result.filter(s => s.location.split(',').pop()?.trim() === selectedLocation);
    }
    return result;
  }, [suppliers, showAllModelsDealers, selectedProduct, selectedLocation]);

  const handleGetQuotes = () => {
    openBuyLeadForm({
      productName: selectedProduct ? `${selectedProduct.name} (${selectedProduct.modelNumber})` : brandMCat.name,
      brandName: brand.name,
      requirement: selectedProduct
        ? buildRfqRequirement(selectedProduct)
        : `Interested in ${brandMCat.name}. Please share available models, technical datasheets, and best pricing for my requirement.`
    });
  };

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-surface border-b border-line px-4 md:px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/brands/${brand.id}`} className="p-1.5 hover:bg-slate-100 rounded-full transition shrink-0">
            <ArrowLeft className="w-4 h-4 text-slate-800" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate">
              <Link href={`/categories/${brandMCat.mcatId}`} className="hover:text-accent-blue">{categoryName}</Link>
              <ChevronRight className="w-2.5 h-2.5 shrink-0" />
              <Link href={`/brands/${brand.id}`} className="hover:text-accent-blue">{brand.name}</Link>
            </div>
            {/* Page heading lives once, in the hero below — this is a compact sticky
                restatement, not a second <h1>. */}
            <p className="font-heading font-extrabold text-sm md:text-base text-primary tracking-tight truncate">{brandMCat.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Category Hero */}
        <div className="bg-gradient-to-r from-primary to-secondary px-4 md:px-8 py-7 md:py-10 text-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-1.5 mb-2">
              <TrustBadge type="manufacturer-oem" who={brand.name} className="!bg-white/15 !text-white !border-white/25" />
              {brand.verified && <TrustBadge type="verified-supplier" who="IndiaMART" since={brand.verifiedSince} className="!bg-white/15 !text-white !border-white/25" />}
            </div>
            <h1 className="font-heading font-extrabold text-xl md:text-3xl tracking-tight">{brandMCat.name}</h1>
            <p className="text-sm md:text-base text-white/80 mt-2 max-w-xl">{brandMCat.tagline}</p>
            <p className="text-[11px] md:text-xs text-white/60 mt-3 max-w-2xl leading-relaxed">{brandMCat.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {products.length > 0 && (
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold">{products.length} Models Available</span>
              )}
              {suppliers.length > 0 && (
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold">{suppliers.length} Verified Sellers</span>
              )}
              {minPrice && (
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold">From ₹{minPrice.toLocaleString('en-IN')}</span>
              )}
              {brand.catalogueUrl && (
                <a
                  href={brand.catalogueUrl}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3" /> Download Catalogue
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8">
          {/* Applications */}
          <section>
            <h2 className="font-heading font-bold text-sm text-primary mb-3">Popular Applications</h2>
            <div className="flex flex-wrap gap-2">
              {brandMCat.applications.map((app, idx) => (
                <span key={idx} className="bg-surface border border-line rounded-full px-3 py-1.5 text-[11px] font-semibold text-slate-700">
                  {app}
                </span>
              ))}
            </div>
          </section>

          {/* Model Picker */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-sm text-primary">Select a Model</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{products.length} in this line</span>
            </div>
            {products.length === 0 ? (
              <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 text-xs">
                No models currently listed in this line. Send a requirement and we'll match you with {brand.name}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((prod) => {
                  const isSaved = shortlistedProducts.includes(prod.id);
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedModelId(prod.id)}
                      className={`text-left bg-surface border rounded-2xl overflow-hidden shadow-xs transition flex ${
                        isSelected ? 'border-cta ring-2 ring-cta/20' : 'border-line hover:border-accent-blue/40'
                      }`}
                    >
                      <div className="w-24 bg-canvas border-r border-line flex items-center justify-center p-2 shrink-0 relative">
                        <img src={prod.image} alt={prod.name} className="max-h-16 max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                        {isSelected && (
                          <span className="absolute top-1 left-1 w-4 h-4 bg-cta rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[11px] text-slate-900 leading-snug line-clamp-2">
                              {prod.name}
                            </span>
                            <span
                              role="button"
                              onClick={(e) => { e.stopPropagation(); toggleShortlistProduct(prod.id); }}
                              className={`shrink-0 text-[9px] font-black uppercase ${isSaved ? 'text-rose-500' : 'text-slate-300 hover:text-rose-500'}`}
                            >
                              ♥
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-mono mt-1">{prod.modelNumber}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">{prod.keySpecLabel}: <strong className="text-slate-700">{prod.keySpecValue}</strong></p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-line">
                          <span className="text-[11px] font-black text-primary">{prod.priceRange.split(' - ')[0]}</span>
                          <Link href={`/products/${prod.id}`} onClick={(e) => e.stopPropagation()} className="text-[9px] font-bold text-accent-blue hover:underline">
                            View Full Details →
                          </Link>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Model Comparison — the primary decision surface for a buyer weighing options within
              this brand's range, so it sits directly after model selection, not buried below a
              single-model spec detail buyers may not scroll past. */}
          {products.length > 1 && (
            <section>
              <h2 className="font-heading font-bold text-sm text-primary mb-3">Compare Models in This Line</h2>
              <div className="bg-surface border border-line rounded-2xl overflow-x-auto shadow-xs">
                <table className="w-full text-left text-[11px] border-collapse min-w-[480px]">
                  <thead>
                    <tr className="bg-canvas">
                      <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Model</th>
                      <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">{products[0].keySpecLabel}</th>
                      <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Price Range</th>
                      <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Delivery</th>
                      <th className="px-3 py-2.5 font-bold text-slate-500 border-b border-line">Warranty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod, idx) => (
                      <tr
                        key={prod.id}
                        onClick={() => setSelectedModelId(prod.id)}
                        className={`cursor-pointer transition ${
                          selectedProduct?.id === prod.id ? 'bg-cta/10' : idx % 2 === 0 ? 'bg-white' : 'bg-canvas/50'
                        }`}
                      >
                        <td className="px-3 py-2.5 font-mono text-primary font-bold border-b border-line whitespace-nowrap">
                          {prod.modelNumber}
                        </td>
                        <td className="px-3 py-2.5 text-slate-700 border-b border-line whitespace-nowrap">{prod.keySpecValue}</td>
                        <td className="px-3 py-2.5 text-slate-700 border-b border-line whitespace-nowrap">{prod.priceRange}</td>
                        <td className="px-3 py-2.5 text-slate-700 border-b border-line whitespace-nowrap">{prod.deliveryTime}</td>
                        <td className="px-3 py-2.5 text-slate-700 border-b border-line whitespace-nowrap">{prod.warranty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Selected Model Detail — conversion centre: full spec + get-quotes context without leaving the page */}
          {selectedProduct && (
            <section>
              <h2 className="font-heading font-bold text-sm text-primary mb-3">Specifications — {selectedProduct.modelNumber}</h2>
              <div className="bg-surface border border-line rounded-2xl p-4 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-canvas rounded-xl border border-line flex items-center justify-center shrink-0 p-1.5">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs text-slate-900 leading-snug">{selectedProduct.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                    <div key={key} className="bg-canvas rounded-lg p-2 border border-line">
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wide block">{key}</span>
                      <span className="text-[10.5px] font-bold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
                  <div>
                    <span className="text-[8px] text-slate-400 block font-bold uppercase">Price</span>
                    <span className="text-[11px] font-black text-primary">{selectedProduct.priceRange}</span>
                  </div>
                  <div className="border-x border-line">
                    <span className="text-[8px] text-slate-400 block font-bold uppercase">Delivery</span>
                    <span className="text-[11px] font-bold text-slate-900">{selectedProduct.deliveryTime}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block font-bold uppercase">Warranty</span>
                    <span className="text-[11px] font-bold text-slate-900">{selectedProduct.warranty}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Verified Dealers */}
          <section>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-heading font-bold text-sm text-primary">
                Verified Dealers{!showAllModelsDealers && selectedProduct ? ` — ${selectedProduct.modelNumber}` : ''}
              </h2>
              {dealerLocations.length > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <select
                    value={selectedLocation || ''}
                    onChange={(e) => setSelectedLocation(e.target.value || null)}
                    className="text-[10px] font-bold text-slate-700 bg-surface border border-line rounded-lg px-2 py-1 outline-none"
                  >
                    <option value="">All Locations</option>
                    {dealerLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  {selectedLocation && (
                    <button onClick={() => setSelectedLocation(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
            {visibleDealers.length === 0 ? (
              <div className="bg-surface border border-line rounded-2xl p-6 text-center text-slate-400 text-xs space-y-2">
                <p>
                  {!showAllModelsDealers && selectedProduct
                    ? `No dealer recorded for ${selectedProduct.modelNumber} in this location yet.`
                    : 'No local authorized dealer recorded yet.'}
                </p>
                {!showAllModelsDealers && suppliers.length > 0 && (
                  <button onClick={() => setShowAllModelsDealers(true)} className="text-accent-blue font-bold hover:underline">
                    Show dealers for all models in this line
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleDealers.map((supp) => (
                  <div key={supp.id} className="bg-surface border border-line rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">{supp.name}</h4>
                        <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {supp.location}
                        </span>
                        <ConnectButton supplierId={supp.id} brandName={brand.name} />
                      </div>
                      <div className="flex flex-col gap-1 items-end shrink-0">
                        {supp.verified && <TrustBadge type="verified-supplier" who="IndiaMART" />}
                        {supp.isAuthorizedDealer && <TrustBadge type="authorized-dealer" who={brand.name} since={supp.authorizedSince} />}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-line pt-2 text-center text-[10px] text-slate-600 font-medium">
                      <div>
                        <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Rating</span>
                        <span className="font-bold text-slate-900 flex items-center justify-center gap-0.5 mt-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{supp.rating}</span>
                      </div>
                      <div className="border-x border-line">
                        <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Response</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{supp.responseTime}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Experience</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{supp.experienceYears} Yrs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showAllModelsDealers && (
              <button onClick={() => setShowAllModelsDealers(false)} className="text-[10px] text-accent-blue font-bold hover:underline mt-2">
                Show only {selectedProduct?.modelNumber} dealers
              </button>
            )}
          </section>

          {/* Downloadable Catalogue */}
          {brand.catalogueUrl && (
            <section>
              <a
                href={brand.catalogueUrl}
                className="bg-surface border border-line rounded-2xl p-4 shadow-xs flex items-center gap-3 hover:border-accent-blue/40 transition"
              >
                <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center shrink-0 text-rose-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-xs truncate">{brandMCat.name} Catalogue</h4>
                  <span className="text-[9.5px] text-slate-400 font-semibold">PDF &middot; {brand.catalogueSizeMb} MB &middot; Updated {brand.catalogueUpdated}</span>
                </div>
                <Download className="w-4 h-4 text-accent-blue shrink-0" />
              </a>
            </section>
          )}

          {/* Ratings & Reviews */}
          {reviews.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-sm text-primary mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent-green" />
                Buyer Ratings &amp; Reviews
              </h2>
              <div className="bg-surface border border-line rounded-2xl p-4 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-heading font-extrabold text-primary">{brand.rating}</span>
                  <div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(brand.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{brand.reviewsCount}+ reviews for {brand.name}</span>
                  </div>
                </div>
                <div className="divide-y divide-line">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[11px] text-slate-900">{rev.userName}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold block">{rev.userRole}, {rev.companyName}</span>
                      <p className="text-[10px] text-slate-600 leading-relaxed italic mt-1">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQs */}
          <section>
            <h2 className="font-heading font-bold text-sm text-primary mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-accent-blue" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-surface border border-line rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="text-[12px] font-bold text-slate-800">{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="px-4 pb-3 text-[11px] text-slate-600 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Get Quotes CTA — scoped to whichever model is currently selected */}
      <div className="border-t border-line p-4 bg-surface shrink-0">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleGetQuotes}
            className="w-full md:w-auto md:px-10 bg-cta hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
          >
            <Send className="w-4 h-4" />
            {selectedProduct ? `Get Quotes for ${selectedProduct.modelNumber}` : `Get Quotes for ${brandMCat.name}`}
          </button>
        </div>
      </div>
    </div>
  );
}
