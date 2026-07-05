'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Send, AlertCircle } from 'lucide-react';
import { useQuoteBasket } from './QuoteBasketProvider';
import { submitLead } from '../services/leads';

export default function QuoteBasketView() {
  const router = useRouter();
  const { items, removeFromBasket, updateQuantity, clearBasket } = useQuoteBasket();
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestQuotes = async () => {
    if (items.length === 0) return;
    if (!location.trim()) {
      setError('Delivery location is required.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const requirement = `Requesting quotes for the following items:\n${items
        .map((item, idx) => `${idx + 1}. ${item.productName}${item.brandName ? ` (${item.brandName})` : ''} — Qty: ${item.quantity}`)
        .join('\n')}`;

      const lead = await submitLead({
        productName: `Quote Basket (${items.length} item${items.length !== 1 ? 's' : ''})`,
        brandName: undefined,
        quantity: `${items.length} item${items.length !== 1 ? 's' : ''}`,
        location,
        requirement
      });

      clearBasket();

      const params = new URLSearchParams({
        id: lead.id,
        productName: lead.productName,
        brandName: lead.brandName || '',
        quantity: lead.quantity,
        location: lead.location,
        requirement: lead.requirement,
        timestamp: lead.timestamp,
        status: lead.status
      });
      router.push(`/leads/success?${params.toString()}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-canvas flex flex-col overflow-hidden">
      <div className="bg-surface border-b border-line px-4 md:px-8 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-heading" />
          <h1 className="font-heading font-bold text-sm text-heading">Quote Basket</h1>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">({items.length})</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold max-w-3xl mx-auto mt-1">
          Add multiple products, then request all quotes together in one requirement.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-4">
          {items.length === 0 ? (
            <div className="bg-surface border border-line rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-primary/5 border border-primary/10 rounded-full flex items-center justify-center mx-auto text-heading">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Your Quote Basket is Empty</h3>
                <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-1">Browse products and add them here to request quotes for multiple items at once.</p>
              </div>
              <Link href="/categories" className="inline-block px-4 py-2 bg-cta hover:bg-cta-hover text-white font-bold rounded-xl text-xs transition">
                Browse Categories
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div key={item.id} className="bg-surface border border-line rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[12px] text-slate-900 dark:text-slate-50 truncate">{item.productName}</p>
                      {item.brandName && <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-0.5">{item.brandName}</p>}
                    </div>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="w-20 bg-canvas border border-line rounded-lg px-2 py-1.5 text-[11px] text-center font-semibold outline-none focus:border-accent-blue"
                    />
                    <button
                      onClick={() => removeFromBasket(item.id)}
                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-surface border border-line rounded-xl p-3.5 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Delivery Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="E.g., Pune, Maharashtra"
                  className="w-full bg-canvas border border-line focus:border-accent-blue rounded-lg px-3 py-2 text-xs outline-none transition"
                />
              </div>

              {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="border-t border-line p-4 bg-surface shrink-0">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleRequestQuotes}
              disabled={submitting}
              className="w-full bg-cta hover:bg-cta-hover disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:text-slate-500 text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : `Request Quotes for All ${items.length} Item${items.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
