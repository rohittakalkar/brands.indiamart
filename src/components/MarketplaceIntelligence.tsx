import React from 'react';
import { TrendingUp, Users, FileSpreadsheet, Eye, ShieldCheck, MapPin, Sparkles, BarChart3, Radio } from 'lucide-react';
import { MARKETPLACE_METRICS, TRENDING_CATEGORIES, MOST_INQUIRED_PRODUCTS, REGIONAL_DEMAND, BUYER_INTENT_SIGNALS } from '../lib/data';

export default function MarketplaceIntelligence() {
  return (
    <div className="flex-1 bg-canvas overflow-y-auto pb-12 text-slate-800 dark:text-slate-200 font-sans select-none">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-primary to-secondary px-4 py-6 text-center overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col items-center">
          <span className="px-2.5 py-0.5 bg-white/10 border border-white/20 text-white/60 rounded-full text-[9px] font-bold tracking-widest uppercase mb-1 flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse text-accent-blue" />
            Live Marketplace Pulse
          </span>
          <h1 className="text-base font-extrabold tracking-tight">Marketplace B2B Intelligence</h1>
          <p className="text-[10px] text-white/80 mt-1 max-w-xs leading-normal">
            Real-time transactional demand, supplier response indexes, and buyer intent signals from standard operations.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Active Buyers */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <Users className="w-4 h-4 text-accent-blue" />
              <span className="text-[8.5px] font-extrabold bg-accent-blue/10 text-accent-blue px-1.5 py-0.5 rounded border border-accent-blue/20">Monthly</span>
            </div>
            <div className="mt-2.5">
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{MARKETPLACE_METRICS.activeBuyers}</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Active B2B Buyers</div>
            </div>
            <div className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-2.5 h-2.5" /> +18% vs last month
            </div>
          </div>

          {/* BuyLeads Created */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              <span className="text-[8.5px] font-extrabold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100">This Month</span>
            </div>
            <div className="mt-2.5">
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{MARKETPLACE_METRICS.buyLeadsThisMonth}</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 uppercase tracking-wider">RFQs & Quote Requests</div>
            </div>
            <div className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-2.5 h-2.5" /> +22% vs last month
            </div>
          </div>

          {/* Product Views */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-[8.5px] font-extrabold bg-accent-blue/10 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Traffic</span>
            </div>
            <div className="mt-2.5">
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{MARKETPLACE_METRICS.productViews}</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Product Views</div>
            </div>
            <div className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-2.5 h-2.5" /> +16% vs last month
            </div>
          </div>

          {/* Verified Suppliers */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[8.5px] font-extrabold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100">Trust</span>
            </div>
            <div className="mt-2.5">
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{MARKETPLACE_METRICS.verifiedSuppliers}</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Verified OEMs</div>
            </div>
            <div className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-2.5 h-2.5" /> +14% vs last month
            </div>
          </div>
        </div>

        {/* Trending Categories Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <BarChart3 className="w-4 h-4 text-accent-blue" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider">Top Trending Categories (By Quote Requests)</h2>
          </div>
          <div className="space-y-3.5">
            {TRENDING_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <span>{cat.name}</span>
                  <span className="text-emerald-600 font-extrabold">{cat.growth} Growth</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/20">
                  <div 
                    className="h-full bg-accent-blue rounded-full" 
                    style={{ width: `${85 - idx * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Inquired Products & Regional Demand Split */}
        <div className="space-y-4">
          {/* Inquired Products */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider">Most Inquired Products</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOST_INQUIRED_PRODUCTS.map((prod, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-[11px] first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500 text-[10px]">{idx + 1}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{prod.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-slate-900 dark:text-slate-50">{prod.count}</div>
                    <div className="text-[8.5px] text-emerald-600 font-bold">+{prod.growth} demand</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Demand */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              <MapPin className="w-4 h-4 text-accent-blue" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider">Top Regions (Quote Request Share)</h2>
            </div>
            <div className="space-y-3.5">
              {REGIONAL_DEMAND.map((reg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <span>{reg.region}</span>
                    <span className="font-extrabold text-accent-blue">{reg.share}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/10">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                      style={{ width: reg.share }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buyer Intent Signals */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-900 rounded-2xl p-4 space-y-3 text-white shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wider text-white/60">Buyer Intent Signals (Monthly)</div>
          <div className="grid grid-cols-2 gap-3">
            {BUYER_INTENT_SIGNALS.map((sig, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-base font-extrabold text-accent-blue">{sig.volume}</div>
                <div className="text-[9px] text-slate-300 dark:text-slate-600 font-medium mt-0.5">{sig.signal}</div>
                <div className="text-[8px] text-emerald-400 font-bold mt-1 inline-flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> {sig.growth} growth
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
