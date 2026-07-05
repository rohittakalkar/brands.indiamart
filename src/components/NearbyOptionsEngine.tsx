'use client';

import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown, Send } from 'lucide-react';
import { Product } from '../types';
import { leadingPrice, formatINR } from '../lib/price';

interface NearbyOptionsEngineProps {
  currentProduct: Product;
  /** Every model in the same Brand-MCat line, including or excluding currentProduct — filtered internally. */
  siblings: Product[];
  onRequestQuote: (product: Product) => void;
  className?: string;
}

interface Candidate {
  product: Product;
  priceDelta: number;
  specDiffs: { label: string; from: string; to: string }[];
}

// Named "Nearby Options," not "Upgrade/Downgrade" — deliberately, because in an industrial
// B2B catalog a higher keySpecValue (more HP, higher flow rate) isn't universally "better"
// the way a bigger camera sensor is; a buyer needs the capacity that matches their actual
// duty point. So this surfaces the immediate higher- and lower-capacity sibling within the
// same line with the price and spec deltas named plainly, and lets the buyer judge fit —
// never asserts one option is objectively superior to the other.
function buildCandidate(current: Product, candidate: Product): Candidate {
  const priceDelta = leadingPrice(candidate.priceRange) - leadingPrice(current.priceRange);
  const specDiffs: Candidate['specDiffs'] = [];
  for (const [key, value] of Object.entries(candidate.specifications)) {
    if (key === current.keySpecLabel) continue;
    const currentValue = current.specifications[key];
    if (currentValue !== undefined && currentValue !== value) {
      specDiffs.push({ label: key, from: currentValue, to: value });
    }
    if (specDiffs.length >= 2) break;
  }
  return { product: candidate, priceDelta, specDiffs };
}

export function NearbyOptionsEngine({ currentProduct, siblings, onRequestQuote, className = '' }: NearbyOptionsEngineProps) {
  const { higher, lower } = useMemo(() => {
    const sorted = [...siblings, currentProduct]
      .filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx) // de-dupe if currentProduct is also in siblings
      .sort((a, b) => leadingPrice(a.priceRange) - leadingPrice(b.priceRange));
    const currentIdx = sorted.findIndex(p => p.id === currentProduct.id);
    if (currentIdx === -1) return { higher: undefined, lower: undefined };
    // Require the headline spec to actually differ — a same-capacity sibling at a
    // different price (e.g. a premium engine variant) is a real product, but it isn't a
    // "need higher/lower capacity" story, so it's deliberately not surfaced as one here.
    const higherProduct = sorted.slice(currentIdx + 1).find(p =>
      leadingPrice(p.priceRange) > leadingPrice(currentProduct.priceRange) && p.keySpecValue !== currentProduct.keySpecValue
    );
    const lowerProduct = [...sorted.slice(0, currentIdx)].reverse().find(p =>
      leadingPrice(p.priceRange) < leadingPrice(currentProduct.priceRange) && p.keySpecValue !== currentProduct.keySpecValue
    );
    return {
      higher: higherProduct ? buildCandidate(currentProduct, higherProduct) : undefined,
      lower: lowerProduct ? buildCandidate(currentProduct, lowerProduct) : undefined
    };
  }, [siblings, currentProduct]);

  if (!higher && !lower) return null;

  const renderCard = (candidate: Candidate, direction: 'higher' | 'lower') => {
    const { product, priceDelta, specDiffs } = candidate;
    const Icon = direction === 'higher' ? ArrowUp : ArrowDown;
    return (
      <div key={product.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${direction === 'higher' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-emerald-50 text-emerald-700'}`}>
            <Icon className="w-3 h-3" />
          </span>
          <span className="text-[10px] font-extrabold text-slate-900 dark:text-slate-50">
            Need {direction === 'higher' ? 'higher' : 'lower'} {currentProduct.keySpecLabel.toLowerCase()}?
          </span>
        </div>

        <div>
          <p className="text-[11px] font-bold text-slate-900 dark:text-slate-50 leading-snug">{product.name}</p>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{product.modelNumber}</p>
        </div>

        <div className="flex items-center gap-2 text-[10px] bg-slate-50 dark:bg-slate-800/60 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-500 dark:text-slate-400">{currentProduct.keySpecLabel}:</span>
          <span className="font-semibold text-slate-400 dark:text-slate-500 line-through">{currentProduct.keySpecValue}</span>
          <span className="text-slate-400 dark:text-slate-500">→</span>
          <span className="font-extrabold text-slate-900 dark:text-slate-50">{product.keySpecValue}</span>
        </div>

        {specDiffs.length > 0 && (
          <div className="space-y-1">
            {specDiffs.map((diff) => (
              <p key={diff.label} className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-600 dark:text-slate-400">{diff.label}:</span> {diff.from} → {diff.to}
              </p>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800">
          <span className={`text-[11px] font-black ${priceDelta > 0 ? 'text-slate-900 dark:text-slate-50' : 'text-emerald-700'}`}>
            {priceDelta > 0 ? `+${formatINR(priceDelta)}` : priceDelta < 0 ? `−${formatINR(Math.abs(priceDelta))}` : 'Same price band'}
          </span>
          <button
            type="button"
            onClick={() => onRequestQuote(product)}
            className="px-2.5 py-1.5 bg-cta hover:bg-cta-hover text-white rounded-lg text-[9.5px] font-bold flex items-center gap-1 transition"
          >
            <Send className="w-2.5 h-2.5" />
            Get Quote
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className={className}>
      <h2 className="font-heading font-bold text-sm text-heading mb-2.5">Nearby Options in This Line</h2>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2.5 -mt-1.5">
        Same {currentProduct.brandName.split(' ')[0]} line, adjacent {currentProduct.keySpecLabel.toLowerCase()} — so you can weigh fit without leaving this page.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {higher && renderCard(higher, 'higher')}
        {lower && renderCard(lower, 'lower')}
      </div>
    </section>
  );
}
