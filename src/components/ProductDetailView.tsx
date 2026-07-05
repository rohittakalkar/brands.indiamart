'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Share2, Heart, Send, GitCompare, ShoppingBag, Phone, MessageCircle } from 'lucide-react';
import { Product, Brand, Supplier, AlternativeProduct, MCat, BrandMCat } from '../types';
import { TrustBadge } from './TrustBadge';
import { ConnectButton } from './ConnectButton';
import { NearbyOptionsEngine } from './NearbyOptionsEngine';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import { useQuoteBasket } from './QuoteBasketProvider';
import { buildRfqRequirement } from '../lib/rfq';
import { scrollToSection } from '../lib/anchorScroll';
import { BackButton } from './BackButton';
import { getMaskedConnectNumber } from '../lib/connect';
import { Breadcrumb } from './Breadcrumb';

interface ProductDetailViewProps {
  product: Product;
  brand: Brand;
  category?: MCat;
  brandMCat?: BrandMCat;
  suppliers: Supplier[];
  alternatives: AlternativeProduct[];
  /** Every model in this product's own Brand-MCat line (including itself) — powers the
   * Nearby Options engine. Distinct from `alternatives`, which is cross-brand. */
  lineSiblings?: Product[];
}

export default function ProductDetailView({ product, brand, category, brandMCat, suppliers, alternatives, lineSiblings = [] }: ProductDetailViewProps) {
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

  // Product-level Call/WhatsApp routing — masked to the product itself (not one specific
  // seller) since a buyer tapping these from the sticky bar hasn't picked a seller yet;
  // same masked-number infrastructure as the per-seller ConnectButton, never a real number.
  const productMaskedNumber = getMaskedConnectNumber(product.id);
  const productTelHref = `tel:${productMaskedNumber.replace(/\s+/g, '')}`;
  const productWaHref = `https://wa.me/${productMaskedNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    `Hi, I'm interested in ${product.name} (${product.modelNumber}). Please share pricing and availability.`
  )}`;

  const handleRequestQuoteForSibling = (sibling: Product) => {
    openBuyLeadForm({
      productName: `${sibling.name} (${sibling.modelNumber})`,
      brandName: sibling.brandName,
      requirement: buildRfqRequirement(sibling)
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
    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 flex flex-col">
      {/* Product Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Always the Brand Model-Line page (this product's real parent in the
              Home > Category > Brand > Brand Model Line > Product chain) — never real
              browser history. A direct product search skips straight past Category/Brand/
              Brand Model Line in the buyer's actual path, and "back" landing on Home in
              that case (which real history would do) breaks the taxonomy the breadcrumb
              above promises; this keeps the two consistent. */}
          <BackButton
            fallbackHref={category && brandMCat ? `/brands/${brand.id}/${category.id}` : `/brands/${brand.id}`}
            title={brandMCat ? `Back to ${brandMCat.name}` : `Back to ${brand.name}`}
            alwaysCanonical
          />
          <div className="min-w-0">
            <h2 className="font-extrabold text-xs text-slate-900 dark:text-slate-50 tracking-tight line-clamp-1">{product.name}</h2>
            <Link href={`/brands/${brand.id}`} className="text-[8.5px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider hover:text-accent-blue transition">
              {product.brandName}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleAddToBasket}
            disabled={inBasket}
            className="p-1.5 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition text-heading"
            title={inBasket ? 'Already in your quote basket' : 'Add to quote basket'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleShortlistProduct(product.id)}
            className="p-1.5 hover:bg-rose-50 rounded-full transition text-rose-500"
            title={isSaved ? "Remove from shortlist" : "Add to shortlist"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-400 dark:text-slate-500'}`} />
          </button>
          <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-full transition">
            <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main product scroll area — bottom clearance only needs to clear the page's own
          compact CTA bar now (BottomNav no longer renders on this route). */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
        {/* Breadcrumb — always states the full Home > Category > Brand > Brand Model Line >
            Model chain, regardless of how the buyer actually arrived here (direct search,
            deep link, shared link, or normal click-through). Every rung except the current
            page is a real link back to that exact screen. */}
        <div className="bg-white dark:bg-slate-900 px-4 pt-2 pb-1">
          <Breadcrumb
            segments={[
              ...(category ? [{ label: category.name, href: `/categories/${category.id}` }] : []),
              { label: brand.name, href: `/brands/${brand.id}` },
              ...(category && brandMCat ? [{ label: brandMCat.name, href: `/brands/${brand.id}/${category.id}` }] : []),
              { label: product.name }
            ]}
          />
        </div>

        {/* Product Image Panel */}
        <div className="relative bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4 flex flex-col items-center">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-36 h-36 object-contain rounded-2xl shadow-sm mix-blend-multiply"
          />
          <div className="absolute bottom-2.5 left-3.5 flex flex-wrap gap-1.5 max-w-[calc(100%-28px)]">
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
        <div className="bg-white dark:bg-slate-900 px-4 py-3 space-y-2.5 shadow-xs">
          <div>
            <Link href={`/brands/${brand.id}`} className="text-[9px] text-accent-blue font-bold tracking-widest uppercase hover:underline">
              {product.brandName}
            </Link>
            <h1 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug mt-0.5">
              {product.name}
            </h1>
            {/* Model + key spec as two distinct pieces (a chip, then plain text), not one
                bullet-joined line — a bullet separator between two independently-wrapping
                spans is what caused the misaligned/broken look on longer model numbers or
                spec values; each piece now wraps as a whole, never mid-fragment. */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-[9px] text-slate-500 dark:text-slate-400 font-semibold">
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 shrink-0">{product.modelNumber}</span>
              <span className="min-w-0">{product.keySpecLabel}: <strong className="text-slate-800 dark:text-slate-200">{product.keySpecValue}</strong></span>
            </div>
          </div>

          {/* Pricing indicator */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 flex items-center justify-between border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Estimated Price</span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50 mt-0.5">{product.priceRange}</div>
              <span className="text-[8px] text-slate-400 dark:text-slate-500 block mt-0.5">Price varies per custom industrial specification</span>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">MOQ: {product.moq}</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold mt-1">Delivery: {product.deliveryTime}</div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 mt-2 px-4 flex text-[11px] select-none sticky top-[46px] z-10 shadow-xs">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-2.5 text-center font-bold relative transition ${activeTab === 'specs' ? 'text-accent-blue' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Specifications
            {activeTab === 'specs' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`flex-1 py-2.5 text-center font-bold relative transition ${activeTab === 'sellers' ? 'text-accent-blue' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Sellers ({suppliers.length})
            {activeTab === 'sellers' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`flex-1 py-2.5 text-center font-bold relative transition ${activeTab === 'highlights' ? 'text-accent-blue' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Highlights
            {activeTab === 'highlights' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-blue rounded-full"></div>}
          </button>
        </div>

        {/* Feature teaser — "Compare Alternatives" renders further down regardless of which
            tab is active, so without this it's invisible until a buyer scrolls past whatever
            tab they're currently reading. */}
        {alternatives.length > 0 && (
          <a
            href="#compare-alternatives"
            onClick={(e) => scrollToSection(e, 'compare-alternatives')}
            className="mx-4 mt-2.5 flex items-center gap-1.5 bg-accent-blue/10 border border-accent-blue/25 rounded-xl px-2.5 py-1.5 text-[9px] font-bold text-accent-blue hover:bg-accent-blue/15 transition"
          >
            <GitCompare className="w-3 h-3 shrink-0" />
            {alternatives.length} Alternative{alternatives.length !== 1 ? 's' : ''} from Other Brands — Compare ↓
          </a>
        )}

        {/* Tab content panel */}
        <div className="px-4 py-3">
          {activeTab === 'specs' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-950 dark:text-white text-[11px] uppercase tracking-wider">Technical Specifications</h3>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-[11px] border-collapse">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/60' : 'bg-white dark:bg-slate-900'}>
                        <td className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800 w-1/3">{key}</td>
                        <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-200">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {product.certifications && product.certifications.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 space-y-2 shadow-xs">
                  <TrustBadge type="certified-product" who={product.certifiedBy || brand.name} since={product.certifiedYear} detail />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.certifications.map((cert, idx) => (
                      <span key={idx} className="text-[8px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sellers' && (
            <div className="space-y-2.5">
              <h3 className="font-extrabold text-slate-950 dark:text-white text-[11px] uppercase tracking-wider">Authorized Sellers of This Product</h3>
              {suppliers.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border text-center text-slate-400 dark:text-slate-500 text-[11px]">
                  No authorized seller listed yet for this exact model. Send a requirement and we'll match you with verified sellers.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {suppliers.map((supp) => (
                    <div key={supp.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 space-y-2 shadow-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-[11px] text-slate-900 dark:text-slate-50 leading-tight">{supp.name}</h4>
                          <span className="text-[8px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">{supp.location}</span>
                          <ConnectButton supplierId={supp.id} brandName={brand.name} />
                        </div>
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          {supp.verified && <TrustBadge type="verified-supplier" who="IndiaMART" />}
                          {supp.isAuthorizedDealer && <TrustBadge type="authorized-dealer" who={brand.name} since={supp.authorizedSince} />}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-2 text-center text-[9px] text-slate-600 dark:text-slate-400 font-medium">
                        <div>
                          <span className="text-[7px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Rating</span>
                          <span className="font-bold text-slate-900 dark:text-slate-50 block mt-0.5">{supp.rating} ★</span>
                        </div>
                        <div className="border-x border-slate-100 dark:border-slate-800">
                          <span className="text-[7px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Resp. Time</span>
                          <span className="font-bold text-slate-900 dark:text-slate-50 block mt-0.5">{supp.responseTime}</span>
                          <span className="text-[6.5px] text-accent-green font-bold block mt-0.5">{supp.responseRate}% reply rate</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-slate-400 dark:text-slate-500 block font-bold uppercase scale-90">Delivery</span>
                          <span className="font-bold text-slate-900 dark:text-slate-50 block mt-0.5">{supp.deliveryTimeRange}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSellerQuote(supp)}
                        className="w-full py-1.5 bg-cta hover:bg-cta-hover text-white rounded-lg text-[9px] font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Send className="w-2.5 h-2.5" />
                        Get Quote From This Seller
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 space-y-3 shadow-xs">
                <h3 className="font-extrabold text-slate-950 dark:text-white text-[11px] uppercase tracking-wider">Product Highlights</h3>
                <div className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2 text-[11px]">
                      <span className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✓</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {product.useCases && product.useCases.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 space-y-2 shadow-xs">
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-[11px] uppercase tracking-wider">Use Cases</h3>
                  <div className="grid grid-cols-1 gap-1.5">
                    {product.useCases.map((useCase, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                        {useCase}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nearby Options — the immediate higher/lower-capacity sibling within this exact
              Brand-MCat line, ahead of the cross-brand Compare Alternatives below it, since
              a same-line fit question ("do I need slightly more/less capacity") is more
              directly answerable than a cross-brand one and shouldn't require leaving the
              product page a cold-landed buyer already committed to reading. */}
          {lineSiblings.length > 1 && (
            <NearbyOptionsEngine
              currentProduct={product}
              siblings={lineSiblings}
              onRequestQuote={handleRequestQuoteForSibling}
              className="mt-3"
            />
          )}

          {/* Compare Alternatives — similar products from OTHER brands, kept separate from this product's own sellers */}
          {alternatives.length > 0 && (
            <div id="compare-alternatives" className="mt-3 bg-accent-blue/10 border border-accent-blue/25 rounded-2xl p-3 space-y-2.5 shadow-xs scroll-mt-16">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-50 text-[11px] flex items-center gap-1.5">
                  <GitCompare className="w-3 h-3 text-accent-blue" />
                  Compare Alternatives from Other Brands
                </h4>
                <p className="text-[9px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                  Similar products from other manufacturers, for reference — not sellers of this exact item. Tap one to request a comparable quote from {product.brandName.split(' ')[0]}.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => handleCompareAlternative(alt)}
                    className="text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 hover:border-accent-blue/50 hover:shadow-sm rounded-xl p-2 space-y-1 transition cursor-pointer"
                    title={`Request a comparable quote against ${alt.brandName} ${alt.modelNumber}`}
                  >
                    <span className="text-[9px] font-extrabold text-slate-900 dark:text-slate-50 block truncate">{alt.brandName}</span>
                    <span className="text-[7.5px] text-slate-500 dark:text-slate-400 font-semibold block truncate">{alt.modelNumber}</span>
                    <span className="text-[7.5px] text-slate-400 dark:text-slate-500 block">{alt.keySpecLabel}: {alt.keySpecValue}</span>
                    <span className="text-[9px] font-black text-accent-blue block">{alt.priceRange}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => router.push(`/compare?productId=${product.id}`)}
                className="w-full px-4 py-1.5 bg-cta hover:bg-cta-hover text-white font-bold rounded-xl text-[10px] transition shadow-xs"
              >
                Compare Offers
              </button>
            </div>
          )}
        </div>
      </div>

      {/* No separate floating WhatsApp launcher here — the fixed footer below already
          carries its own WhatsApp button reaching the exact same contact. */}

      {/* Persistent lead generation footer — fixed on mobile, always flush to the bottom
          edge (BottomNav no longer renders on this route, so there's nothing left to
          avoid stacking with). Redesigned inline: icon beside label rather than stacked
          above it, smaller icons and text, matching the compact weight of a real app's
          bottom action bar instead of three oversized stacked buttons. */}
      <div className="md:static md:bottom-auto fixed bottom-0 left-0 right-0 z-30 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 flex gap-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:shadow-none">
        <a
          href={productTelHref}
          className="px-3 border border-cta text-cta hover:bg-accent-blue/10 py-2.5 rounded-xl font-bold text-[9px] transition flex items-center justify-center gap-1 shrink-0"
        >
          <Phone className="w-3 h-3" />
          Call
        </a>
        <a
          href={productWaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 bg-[#25D366] hover:bg-[#1fb959] text-white py-2.5 rounded-xl font-bold text-[9px] transition flex items-center justify-center gap-1 shrink-0"
        >
          <MessageCircle className="w-3 h-3" />
          WhatsApp
        </a>
        <button
          onClick={handleSendLead}
          className="flex-1 bg-cta hover:bg-cta-hover text-white py-2.5 rounded-xl font-bold text-[11px] transition flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Get Quotes</span>
        </button>
      </div>
    </div>
  );
}
