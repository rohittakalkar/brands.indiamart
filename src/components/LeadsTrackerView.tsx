import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { BuyLead } from '../types';

interface LeadsTrackerViewProps {
  leads: BuyLead[];
}

export default function LeadsTrackerView({ leads }: LeadsTrackerViewProps) {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden select-none">
      {/* Leads list header in IndiaMART style */}
      <div className="bg-white border-b border-slate-100 p-4 shrink-0">
        <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-accent-blue" />
          <span>My Quote Requests</span>
        </h2>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Monitor response quotations from verified manufacturers</span>
      </div>

      {/* List layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {leads.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center text-slate-400 text-xs shadow-xs">
            No quote requests yet. Send a requirement to receive competitive price proposals from verified sellers.
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-accent-blue font-black uppercase tracking-widest">{lead.id}</span>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-tight mt-0.5">{lead.productName}</h4>
                </div>
                <span className={`px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-wider ${
                  lead.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  lead.status === 'connected' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {lead.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div><strong className="text-slate-800 font-bold">Qty Required:</strong> {lead.quantity}</div>
                <div className="mt-0.5"><strong className="text-slate-800 font-bold">Delivery Location:</strong> {lead.location}</div>
                <p className="mt-1.5 text-[10px] italic font-normal text-slate-500 border-t border-slate-150/60 pt-1.5">"{lead.requirement}"</p>
              </div>

              <div className="text-[9px] text-slate-400 font-bold flex items-center gap-1 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Submitted on {new Date(lead.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
