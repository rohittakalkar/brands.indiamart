'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Heart, Send, GitCompare, ShoppingBag } from 'lucide-react';
import { Product, Brand, Supplier, AlternativeProduct } from '../types';
import { TrustBadge } from './TrustBadge';
import { ConnectButton } from './ConnectButton';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import { useQuoteBasket } from './QuoteBasketProvider';
import { buildRfqRequirement } from '../lib/rfq';

interface ProductDetailViewProps {
  product: Product;
  brand: Brand;
  suppliers: Supplier[];
  alternatives: AlternativeProduct[];
}

export default function ProductDetailView({ product, brand, suppliers, alternatives }: ProductDetailViewProps) {
  const router = useRouter();
  const { shortlistedProducts, toggleShortlistProduct } = useShortlist();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const { trackView } = useRecentlyViewed();
  const { items: basketItems, addToBasket } = useQuoteBasket();
  const [activeTab, setActiveTab] = useState<'specs' | 'sellers' | 'highlights'>('specs');

  useEffect(() => {
    trackView('product', product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const isSaved = shortlistedProducts.includes(product.id);
  const inBasket = basketItems.some(i => i.productId === product.id);

  const handleCompareAlternative = (alt: AlternativeProduct) => {
    openBuyLeadForm({
      productName: `${product.name} (comparing against ${alt.brandName} ${alt.modelNumber})`,
      brandName: product.brandName,
      requirement: `Evaluating ${product.brandName} ${product.modelNumber} against ${alt.brandName} ${alt.modelNumber} (${alt.keySpecLabel}: ${alt.keySpecValue}, ${alt.priceRange}). Please share a competitive quote and help me understand how ${product.brandName}'s offering compares.`
    });
  };

  const handleSendLead = () => {
    openBuyLeadForm({
      productName: product.name,
      brandName: product.brandName,
      requirement: buildRfqRequirement(product)
    });
  };

  const handleAddToBasket = () => {
    addToBasket({
      productId: product.id,
      productName: product.name,
      brandName: product.brandName,
      quantity: product.moq
    });
  };

  const handleSellerQuote = (supplier: Supplier) => {
    openBuyLeadForm({
      productName: product.name,
      brandName: product.brandName,
      requirement: `${buildRfqRequirement(product)} Requesting this specifically from ${supplier.name}.`
    });
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Product Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          {/* Links to the brand, not router.back() — a cold landing (e.g. from a search
              engine) has no in-app history for "back" to rely on, but every product has a
              real, logical parent: the brand that makes it. */}
          <Link href={`/brands/${brand.id}`} className="p-1.5 hover:bg-slate-100 rounded-full transition" title={`Back to ${brand.name}`}>
            <ArrowLeft className="w-4 h-4 text-slate-800" />
          </Link>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight line-clamp-1">{product.name}</h2>
            <Link href={`/brands/${brand.id}`} className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hover:text-accent-blue transition">
              {product.brandName}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleShortlistProduct(product.id)}
            className="p-2 hover:bg-rose-50 rounded-full transition text-rose-500"
            title={isSaved ? "Remove from shortlist" : "Add to shortlist"}
          >
            <Heart className={`w-4.5 h-4.5 ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition">
            <Share2 className="w-4.5 h-4.5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main product scroll area */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Product Image Panel */}
        <div className="relative bg-white border-b border-slate-100 p-6 flex flex-col items-center">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-48 h-48 object-contain rounded-2xl shadow-sm mix-blend-multiply"
          />
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5 max-w-[calc(100%-32px)]">
            <TrustBadge type="manufacturer-oem" who={brand.name} />
            {brand.verified && (
              <TrustBadge type="verified-supplier" who="IndiaMART" since={brand.verifiedSince} />
            )}
            {product.certifications && product.certifications.length > 0 && (
              <TrustBadge type="certified-product" who={product.certifiedBy || brand.name} since={product.certifiedYear} />
            )}
          </div>
        </div>

        {/* Product core info */}
        <div className="bg-white px-5 py-4 space-y-3 shadow-xs">
          <div>
            <Link href={`/brands/${brand.id}`} className="text-[10px] text-accent-blue font-bold tracking-widest uppercase hover:underline">
              {product.brandName}
            </Link>
            <h1 className="text-base font-extrabold text-slate-950 tracking-tight leading-snug mt-0.5">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-semibold">
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">Model: {product.modelNumber}</span>
              <span>&bull;</span>
              <span>{product.keySpecLabel}: <strong className="text-slate-800">{product.keySpecValue}</strong></span>
            </div>
          </div>

          {/* Pricing indicator */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Price</span>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">{product.priceRange}</div>
              <span className="text-[9px] text-slate-400 block mt-0.5">Price varies per custom industrial specification</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">MOQ: {product.moq}</div>
              <div className="text-[10px] text-slate-500 font-semibold mt-1">Delivery: {product.deliveryTime}</div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-white border-y border-slate-100 mt-3 px-5 flex text-xs select-none sticky top-[52px] z-10 shadow-xs">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-3 text-center font-bold relative transition ${activeTab === 'specs' ? 'text-accent-blue' : 'text-slate-500'}`}
          >
            Specifications
            {activeTab === 'specs' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`flex-1 py-3 text-center font-bold relative transition ${activeTab === 'sellers' ? 'text-accent-blue' : 'text-slate-500'}`}
          >
            Sellers ({suppliers.length})
            {activeTab === 'sellers' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`flex-1 py-3 text-center font-bold relative transition ${activeTab === 'highlights' ? 'text-accent-blue' : 'text-slate-500'}`}
          >
            Highlights
            {activeTab === 'highlights' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
        </div>

        {/* Tab content panel */}
        <div className="px-5 py-4">
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Technical Specifications</h3>
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="px-4 py-2.5 font-bold text-slate-500 border-r border-slate-100 w-1/3">{key}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-800">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {product.certifications && product.certifications.length > 0 && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <TrustBadge type="certified-product" who={product.certifiedBy || brand.name} since={product.certifiedYear} detail />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.certifications.map((cert, idx) => (
                      <span key={idx} className="text-[9px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sellers' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Authorized Sellers of This Product</h3>
              {suppliers.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border text-center text-slate-400 text-xs">
                  No authorized seller listed yet for this exact model. Send a requirement and we'll match you with verified sellers.
                </div>
              ) : (
                <div className="space-y-3">
                  {suppliers.map((supp) => (
                    <div key={supp.id} className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">{supp.name}</h4>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{supp.location}</span>
                          <ConnectButton supplierId={supp.id} brandName={brand.name} />
                        </div>
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          {supp.verified && <TrustBadge type="verified-supplier" who="IndiaMART" />}
                          {supp.isAuthorizedDealer && <TrustBadge type="authorized-dealer" who={brand.name} since={supp.authorizedSince} />}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 text-center text-[10px] text-slate-600 font-medium">
                        <div>
                          <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Rating</span>
                          <span className="font-bold text-slate-900 block mt-0.5">{supp.rating} ★</span>
                        </div>
                        <div className="border-x border-slate-100">
                          <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Resp. Time</span>
                          <span className="font-bold text-slate-900 block mt-0.5">{supp.responseTime}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 block font-bold uppercase scale-90">Delivery</span>
                          <span className="font-bold text-slate-900 block mt-0.5">{supp.deliveryTimeRange}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSellerQuote(supp)}
                        className="w-full py-1.5 bg-cta hover:bg-cta-hover text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Send className="w-3 h-3" />
                        Get Quote From This Seller
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3.5 shadow-xs">
                <h3 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Product Highlights</h3>
                <div className="space-y-2.5">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2 text-xs">
                      <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                      <span className="font-semibold text-slate-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {product.useCases && product.useCases.length > 0 && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                  <h3 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Use Cases</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {product.useCases.map((useCase, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] font-semibold text-slate-700">
                        {useCase}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compare Alternatives — similar products from OTHER brands, kept separate from this product's own sellers */}
          {alternatives.length > 0 && (
            <div className="mt-4 bg-accent-blue/10 border border-accent-blue/25 rounded-2xl p-4 space-y-3 shadow-xs">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <GitCompare className="w-3.5 h-3.5 text-accent-blue" />
                  Compare Alternatives from Other Brands
                </h4>
                <p className="text-[10px] text-slate-600 mt-1 leading-relaxed font-medium">
                  Similar products from other manufacturers, for reference — not sellers of this exact item. Tap one to request a comparable quote from {product.brandName.split(' ')[0]}.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => handleCompareAlternative(alt)}
                    className="text-left bg-white border border-slate-200/80 hover:border-accent-blue/50 hover:shadow-sm rounded-xl p-2.5 space-y-1 transition cursor-pointer"
                    title={`Request a comparable quote against ${alt.brandName} ${alt.modelNumber}`}
                  >
                    <span className="text-[10px] font-extrabold text-slate-900 block truncate">{alt.brandName}</span>
                    <span className="text-[8.5px] text-slate-500 font-semibold block truncate">{alt.modelNumber}</span>
                    <span className="text-[8.5px] text-slate-400 block">{alt.keySpecLabel}: {alt.keySpecValue}</span>
                    <span className="text-[10px] font-black text-accent-blue block">{alt.priceRange}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => router.push(`/compare?productId=${product.id}`)}
                className="w-full px-4 py-2 bg-cta hover:bg-cta-hover text-white font-bold rounded-xl text-[11px] transition shadow-xs"
              >
                Compare Offers
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Persistent lead generation footer */}
      <div className="border-t border-slate-100 p-4 bg-white flex gap-2.5 shrink-0">
        <button
          onClick={handleAddToBasket}
          disabled={inBasket}
          className="px-4 bg-white border border-primary text-primary hover:bg-primary/5 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shrink-0"
          title={inBasket ? 'Already in your quote basket' : 'Add to quote basket'}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
        <button
          onClick={handleSendLead}
          className="flex-1 bg-cta hover:bg-cta-hover text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Get Quotes From Sellers</span>
        </button>
      </div>
    </div>
  );
}
