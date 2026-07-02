'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Heart, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useShortlist } from './ShortlistProvider';
import { useBuyLeadModal } from './BuyLeadModalProvider';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const { shortlistedProducts, toggleShortlistProduct } = useShortlist();
  const { open: openBuyLeadForm } = useBuyLeadModal();
  const [activeTab, setActiveTab] = useState<'specs' | 'suppliers'>('specs');

  const isSaved = shortlistedProducts.includes(product.id);

  const handleSendLead = () => {
    openBuyLeadForm({
      productName: product.name,
      brandName: product.brandName,
      requirement: `Looking to purchase ${product.name}. Please provide quotation for the standard spec: ${Object.entries(product.specifications).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ')}.`
    });
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Product Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-slate-100 rounded-full transition">
            <ArrowLeft className="w-4 h-4 text-slate-800" />
          </button>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight line-clamp-1">{product.name}</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{product.brandName}</span>
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
          <div className="absolute bottom-3 left-4 flex gap-1.5">
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 rounded-full px-2.5 py-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Brand
            </span>
            <span className="bg-indigo-50 text-indigo-800 text-[10px] font-bold border border-indigo-200 rounded-full px-2.5 py-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              Standard Product
            </span>
          </div>
        </div>

        {/* Product core info */}
        <div className="bg-white px-5 py-4 space-y-3 shadow-xs">
          <div>
            <span className="text-[10px] text-[#028384] font-bold tracking-widest uppercase">{product.brandName}</span>
            <h1 className="text-base font-extrabold text-slate-950 tracking-tight leading-snug mt-0.5">
              {product.name}
            </h1>
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
            className={`flex-1 py-3 text-center font-bold relative transition ${activeTab === 'specs' ? 'text-[#028384]' : 'text-slate-500'}`}
          >
            Specifications
            {activeTab === 'specs' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#028384] rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex-1 py-3 text-center font-bold relative transition ${activeTab === 'suppliers' ? 'text-[#028384]' : 'text-slate-500'}`}
          >
            Key Highlights
            {activeTab === 'suppliers' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#028384] rounded-full"></div>}
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
            </div>
          )}

          {activeTab === 'suppliers' && (
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

              {/* Compare Supplier Promo Card */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-3 shadow-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Unsure which supplier is best?</h4>
                  <p className="text-[10px] text-slate-600 mt-1 leading-relaxed font-medium">
                    We've aggregated delivery times, reviews, response metrics, and certifications for 3 top verified distributors.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/compare')}
                  className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl text-[11px] transition shadow-xs"
                >
                  Compare Top Suppliers
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Persistent lead generation footer */}
      <div className="border-t border-slate-100 p-4 bg-white flex gap-3.5 shrink-0">
        <button
          onClick={handleSendLead}
          className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Generate BuyLeads - Get Quotes</span>
        </button>
      </div>
    </div>
  );
}
