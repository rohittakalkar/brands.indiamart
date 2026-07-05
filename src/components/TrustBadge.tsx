import React from 'react';
import { ShieldCheck, BadgeCheck, Factory, Award } from 'lucide-react';

export type TrustBadgeType = 'verified-supplier' | 'authorized-dealer' | 'manufacturer-oem' | 'certified-product';

interface BadgeDef {
  icon: React.ElementType;
  label: string;
  what: string;
  colorClasses: string;
  iconClasses: string;
}

const BADGE_DEFS: Record<TrustBadgeType, BadgeDef> = {
  'verified-supplier': {
    icon: ShieldCheck,
    label: 'Verified Supplier',
    what: 'Business identity verified by IndiaMART',
    colorClasses: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconClasses: 'text-emerald-600'
  },
  'authorized-dealer': {
    icon: BadgeCheck,
    label: 'Authorized Dealer',
    what: "Authorized to sell this brand's products",
    colorClasses: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    iconClasses: 'text-indigo-600'
  },
  'manufacturer-oem': {
    icon: Factory,
    label: 'Manufacturer / OEM',
    what: 'Original Equipment Manufacturer',
    colorClasses: 'bg-amber-50 text-amber-800 border-amber-200',
    iconClasses: 'text-amber-600'
  },
  'certified-product': {
    icon: Award,
    label: 'Certified Product',
    what: 'Meets certified quality/safety standards',
    colorClasses: 'bg-violet-50 text-violet-800 border-violet-200',
    iconClasses: 'text-violet-600'
  }
};

interface TrustBadgeProps {
  type: TrustBadgeType;
  who: string;
  since?: number;
  detail?: boolean;
  className?: string;
}

export function TrustBadge({ type, who, since, detail = false, className = '' }: TrustBadgeProps) {
  const def = BADGE_DEFS[type];
  const Icon = def.icon;
  const whenText = since ? ` since ${since}` : '';
  const title = `${def.label} — ${def.what}. Verified by ${who}${whenText}.`;

  if (detail) {
    return (
      <div className={`flex items-start gap-2 ${className}`} title={title}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border icon-anim-pulse ${def.colorClasses}`}>
          <Icon className={`w-3.5 h-3.5 ${def.iconClasses}`} />
        </span>
        <div className="min-w-0">
          <span className="text-[11px] font-extrabold text-slate-900 block">{def.label}</span>
          <span className="text-[9.5px] text-slate-500 font-medium leading-snug block">{def.what}</span>
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wide block mt-0.5">
            By {who}{since ? ` · Since ${since}` : ''}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 border rounded-full ${def.colorClasses} ${className}`}
    >
      <span className="inline-flex icon-anim-pulse">
        <Icon className={`w-3.5 h-3.5 ${def.iconClasses}`} />
      </span>
      {def.label}
    </span>
  );
}
