import React, { useState } from 'react';
import { ArrowLeft, Check, ShieldCheck, Clock, Award, Star, ThumbsUp, Send } from 'lucide-react';
import { SUPPLIERS } from '../data';
import { Supplier } from '../types';

interface CompareViewProps {
  onBack: () => void;
  onOpenBuyLeadForm: (data: Partial<any>) => void;
  brandName?: string;
}

export default function CompareView({ onBack, onOpenBuyLeadForm, brandName = 'Industrial Pumps' }: CompareViewProps) {
  // Use pre-defined pump suppliers for side-by-side comparison
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>(SUPPLIERS);

  const handleCompareQuotes = () => {
    // Generate a prefilled lead proposal for the compared brands
    onOpenBuyLeadForm({
      productName: 'Centrifugal Pump - Industrial Spec',
      brandName: 'Kirloskar & KSB Combined Group',
      requirement: 'Please provide quotation with technical datasheet for end suction/centrifugal water pumps compared in the platform.'
    });
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Header bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shrink-0">
        <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-full transition">
          <ArrowLeft className="w-4 h-4 text-slate-800" />
        </button>
        <div>
          <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Compare Suppliers (3)</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{brandName}</span>
        </div>
      </div>

      {/* Main body scrollable list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intro */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[#028384] font-bold text-xs">
            <ThumbsUp className="w-4 h-4 text-[#028384]" />
            <span>Smart Side-by-Side Comparison</span>
          </div>
          <p className="text-[10px] text-teal-800 leading-relaxed font-medium">
            Evaluate response times, delivery capabilities, and reviews to find the best fit before connecting.
          </p>
        </div>

        {/* Side by side columns */}
        <div className="grid grid-cols-3 gap-2">
          {selectedSuppliers.map((supp, sIdx) => (
            <div key={supp.id} className="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                {/* Header Logo Name */}
                <div className="text-center pb-2 border-b border-slate-100">
                  <div className={`w-8 h-8 mx-auto rounded-full font-extrabold text-[10px] flex items-center justify-center ${
                    sIdx === 0 ? 'bg-teal-50 text-[#028384]' :
                    sIdx === 1 ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {supp.brandName.substring(0, 3).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-[9px] text-slate-900 mt-1 line-clamp-2 leading-tight min-h-[24px]">
                    {supp.name}
                  </h3>
                </div>

                {/* Rating Parameter */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Rating</span>
                  <div className="flex items-center justify-center gap-0.5 text-[10px] font-extrabold text-slate-900 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{supp.rating}</span>
                    <span className="text-[8px] text-slate-400 font-normal">({supp.reviewsCount})</span>
                  </div>
                </div>

                {/* Experience Parameter */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Experience</span>
                  <div className="text-[10px] font-extrabold text-slate-900 mt-0.5">
                    {supp.experienceYears} Years
                  </div>
                </div>

                {/* Verified Parameter */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Verified</span>
                  <div className="flex justify-center mt-0.5">
                    {supp.verified ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <span className="text-[8px] text-slate-400">Standard</span>
                    )}
                  </div>
                </div>

                {/* Response Time */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Resp. Time</span>
                  <div className="text-[10px] font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-0.5">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    <span>{supp.responseTime}</span>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="text-center py-1 bg-slate-50 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest scale-90">Delivery</span>
                  <div className="text-[9px] font-extrabold text-slate-900 mt-0.5">
                    {supp.deliveryTimeRange}
                  </div>
                </div>
              </div>

              {/* View Profile Action */}
              <div className="pt-3 border-t border-slate-100 mt-3 text-center">
                <span className="text-[9px] font-extrabold text-[#028384] hover:underline cursor-pointer">
                  View Profile
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary analysis card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs text-xs">
          <h3 className="font-extrabold text-slate-950 text-xs">Key Comparison Summary</h3>
          <div className="space-y-2 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span><strong className="text-slate-900">{SUPPLIERS[0].name}</strong> is the oldest and holds the best response rate of <strong className="text-slate-900">1.6 hrs</strong>.</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>All compared suppliers hold standard <strong className="text-slate-900">ISO 9001</strong> and GST business credentials.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Compare CTA */}
      <div className="border-t border-slate-100 p-4 bg-white shrink-0">
        <button
          onClick={handleCompareQuotes}
          className="w-full bg-[#028384] hover:bg-[#007072] text-white py-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Generate BuyLeads - Get Quotes From All</span>
        </button>
      </div>
    </div>
  );
}
