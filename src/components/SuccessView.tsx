import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, ClipboardList } from 'lucide-react';
import { BuyLead } from '../types';

interface SuccessViewProps {
  lead: BuyLead;
}

export default function SuccessView({ lead }: SuccessViewProps) {
  return (
    <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col">
      {/* Scrollable Success Panel */}
      <div className="flex-1 overflow-y-auto px-5 py-8 flex flex-col items-center justify-center">
        {/* Animated Green Circle */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border-2 border-emerald-300">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
        </div>

        <h1 className="text-lg font-extrabold text-slate-950 dark:text-white text-center tracking-tight leading-tight">
          Requirement Sent Successfully!
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
          Your inquiry has been sent to standard matching suppliers.
        </p>

        {/* Request ID Banner */}
        <div className="mt-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 rounded-xl px-4 py-2 flex items-center justify-between gap-6 w-full max-w-xs shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Request ID</span>
          <span className="text-xs font-mono font-extrabold text-accent-blue">{lead.id}</span>
        </div>

        {/* Inquiry Card */}
        <div className="mt-5 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 w-full max-w-xs space-y-3 shadow-sm bg-white dark:bg-slate-900">
          <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
            <ClipboardList className="w-4 h-4 text-accent-blue" />
            <span>Your Inquiry Details</span>
          </div>

          <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 dark:text-slate-500">Product:</span>
              <span className="text-slate-900 dark:text-slate-50 font-bold max-w-[160px] text-right">{lead.productName}</span>
            </div>
            {lead.brandName && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 dark:text-slate-500">Brand:</span>
                <span className="text-slate-900 dark:text-slate-50 font-bold">{lead.brandName}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-400 dark:text-slate-500">Quantity:</span>
              <span className="text-slate-900 dark:text-slate-50 font-bold">{lead.quantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 dark:text-slate-500">Location:</span>
              <span className="text-slate-900 dark:text-slate-50 font-bold">{lead.location}</span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-0.5">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Specific Requirement:</span>
              <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed text-[10px] font-normal">{lead.requirement}</p>
            </div>
          </div>
        </div>

        {/* What Happens Next Checklist */}
        <div className="mt-6 w-full max-w-xs space-y-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-150 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex gap-2.5 items-start">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold mt-0.5 shrink-0">1</div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                <strong className="text-slate-900 dark:text-slate-50">Verified suppliers</strong> will contact you soon with competitive quotations.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold mt-0.5 shrink-0">2</div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                Compare price, ratings, and delivery terms side-by-side to select the best option.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold mt-0.5 shrink-0">3</div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                Securely close deals and make confident business decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Button Actions */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-4 shrink-0 space-y-2 bg-white dark:bg-slate-900">
        <Link
          href="/leads"
          className="w-full flex items-center justify-center gap-1.5 py-3 bg-cta hover:bg-cta-hover text-white font-bold rounded-xl text-xs transition shadow-sm"
        >
          <span>View My Quote Requests</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/"
          className="w-full block text-center py-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
