'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, FileText, ShoppingBag, Clock, ChevronRight, MapPin } from 'lucide-react';
import { Brand, Product } from '../types';
import { BrandLogo } from './BrandLogo';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';
import { useQuoteBasket } from './QuoteBasketProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';

interface BuyerProfileViewProps {
  brands: Brand[];
  products: Product[];
}

export default function BuyerProfileView({ brands, products }: BuyerProfileViewProps) {
  const { shortlistedBrands, shortlistedProducts, shortlistedCategories } = useShortlist();
  const { leadsCount } = useBuyLeadModal();
  const { items: basketItems } = useQuoteBasket();
  const { recentlyViewed } = useRecentlyViewed();

  const shortlistedTotal = shortlistedBrands.length + shortlistedProducts.length + shortlistedCategories.length;

  const recentItems = recentlyViewed
    .slice(0, 5)
    .map(entry => {
      if (entry.type === 'product') {
        const product = products.find(p => p.id === entry.id);
        return product ? { href: `/products/${product.id}`, name: product.name, logo: undefined as string | undefined, image: product.image } : null;
      }
      const brand = brands.find(b => b.id === entry.id);
      return brand ? { href: `/brands/${brand.id}`, name: brand.name, logo: brand.logo, image: undefined as string | undefined } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-secondary px-4 md:px-8 py-8 text-white">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-xl font-black">
            RT
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-lg">Rohit Takalkar</h1>
            <p className="text-white/70 text-[11px] font-semibold mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Pune, Maharashtra &bull; B2B Buyer
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-6">
          {/* Activity Summary */}
          <div className="grid grid-cols-3 gap-2.5">
            <Link href="/shortlist" className="bg-surface border border-line rounded-xl p-3.5 text-center hover:border-accent-blue/40 transition">
              <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
              <div className="text-lg font-heading font-extrabold text-primary">{shortlistedTotal}</div>
              <div className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wide">Shortlisted</div>
            </Link>
            <Link href="/leads" className="bg-surface border border-line rounded-xl p-3.5 text-center hover:border-accent-blue/40 transition">
              <FileText className="w-4 h-4 text-accent-blue mx-auto mb-1" />
              <div className="text-lg font-heading font-extrabold text-primary">{leadsCount}</div>
              <div className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wide">Quote Requests</div>
            </Link>
            <Link href="/quote-basket" className="bg-surface border border-line rounded-xl p-3.5 text-center hover:border-accent-blue/40 transition">
              <ShoppingBag className="w-4 h-4 text-cta mx-auto mb-1" />
              <div className="text-lg font-heading font-extrabold text-primary">{basketItems.length}</div>
              <div className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wide">In Basket</div>
            </Link>
          </div>

          {/* Recently Viewed */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-heading font-bold text-sm text-primary flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Recently Viewed
              </h2>
            </div>
            {recentItems.length === 0 ? (
              <div className="bg-surface border border-line rounded-xl p-5 text-center text-slate-400 text-[11px]">
                Nothing viewed yet.
              </div>
            ) : (
              <div className="space-y-2">
                {recentItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="bg-surface border border-line rounded-xl p-2.5 flex items-center gap-2.5 hover:border-accent-blue/40 transition"
                  >
                    <div className="w-8 h-8 rounded-md bg-canvas border border-line overflow-hidden flex items-center justify-center shrink-0 p-1">
                      {item.logo ? (
                        <BrandLogo logo={item.logo} name={item.name} />
                      ) : item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                      ) : null}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 truncate flex-1">{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="font-heading font-bold text-sm text-primary mb-2.5">Manage</h2>
            <div className="bg-surface border border-line rounded-xl divide-y divide-line">
              <Link href="/shortlist" className="flex items-center justify-between px-4 py-3 hover:bg-canvas transition">
                <span className="text-[12px] font-bold text-slate-700">My Shortlist</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link href="/leads" className="flex items-center justify-between px-4 py-3 hover:bg-canvas transition">
                <span className="text-[12px] font-bold text-slate-700">My Quote Requests</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link href="/quote-basket" className="flex items-center justify-between px-4 py-3 hover:bg-canvas transition">
                <span className="text-[12px] font-bold text-slate-700">Quote Basket</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
