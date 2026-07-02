import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, Sparkles } from 'lucide-react';
import { BuyLead } from '../types';

interface BuyLeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Omit<BuyLead, 'id' | 'timestamp' | 'status'>) => void;
  initialData?: Partial<Omit<BuyLead, 'id' | 'timestamp' | 'status'>>;
}

export default function BuyLeadFormModal({ isOpen, onClose, onSubmit, initialData }: BuyLeadFormModalProps) {
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [quantity, setQuantity] = useState('1 Piece');
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [requirement, setRequirement] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync with initialData changes (e.g. from product page or AI auto-fills!)
  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || '');
      setBrandName(initialData.brandName || '');
      setQuantity(initialData.quantity || '1 Piece');
      setLocation(initialData.location || 'Pune, Maharashtra');
      setRequirement(initialData.requirement || '');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError('Product Name is required.');
      return;
    }
    if (!quantity.trim()) {
      setError('Quantity is required.');
      return;
    }
    if (!location.trim()) {
      setError('Delivery location is required.');
      return;
    }
    if (!requirement.trim()) {
      setError('Detailed requirements are required so suppliers can propose accurate quotes.');
      return;
    }

    onSubmit({
      productName,
      brandName,
      quantity,
      location,
      requirement
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-h-[88%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header bar */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
              {initialData?.requirement ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#028384] fill-teal-400/20" />
                  <span>Verify Draft & Submit BuyLead</span>
                </>
              ) : (
                <span>Request Quotations (BuyLead)</span>
              )}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Get instant quotes from multiple verified suppliers</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Product Name *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="E.g., Centrifugal Pump"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#028384] focus:bg-white rounded-xl px-3 py-2 text-xs outline-none transition"
            />
          </div>

          {/* Brand Name (Optional) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Brand Specific (Optional)</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="E.g., Kirloskar Brothers Limited"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#028384] focus:bg-white rounded-xl px-3 py-2 text-xs outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Estimated Quantity *</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="E.g., 2 Pieces"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#028384] focus:bg-white rounded-xl px-3 py-2 text-xs outline-none transition"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Delivery Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., Pune, Maharashtra"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#028384] focus:bg-white rounded-xl px-3 py-2 text-xs outline-none transition"
              />
            </div>
          </div>

          {/* Requirement Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Detailed Specifications *</label>
            <textarea
              rows={4}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Provide flow rate, voltage, material, applications, power (HP), or certification needs (GST, ISO) to help suppliers submit highly competitive quotes."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#028384] focus:bg-white rounded-xl px-3 py-2 text-xs outline-none transition resize-none leading-relaxed"
            />
          </div>

          {/* Trust assurances block */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[10px] text-emerald-800 leading-normal flex items-start gap-2">
            <span className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✓</span>
            <div>
              <span className="font-bold block">IndiaMART Brand Guarantee</span>
              Verified contact sharing with verified ISO / GST certified brands. Strictly no spam or hidden commissions.
            </div>
          </div>
        </form>

        {/* Action submit button */}
        <div className="border-t border-slate-100 p-4 bg-white">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#028384] hover:bg-[#007072] text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate BuyLead - Get Quotes From All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
