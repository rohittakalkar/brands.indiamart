'use client';

import React, { useState } from 'react';
import { Phone, ShieldCheck } from 'lucide-react';
import { getMaskedConnectNumber } from '../lib/connect';

interface ConnectButtonProps {
  supplierId: string;
  brandName: string;
  className?: string;
  /** Denser rendering for tight card grids (e.g. the Compare table) — masked number only, no privacy caption. */
  compact?: boolean;
}

// The lightweight "Connect Directly" path alongside the RFQ form — one tap, no identity
// capture (masking itself is what prevents spam, not a form gate), and never a raw
// personal phone number: the buyer is connected via a masked/proxy line, exactly like
// IndiaMART's real click-to-call infrastructure.
export function ConnectButton({ supplierId, brandName, className = '', compact = false }: ConnectButtonProps) {
  const [connected, setConnected] = useState(false);

  if (connected) {
    const maskedNumber = getMaskedConnectNumber(supplierId);
    if (compact) {
      return (
        <a
          href={`tel:${maskedNumber.replace(/\s+/g, '')}`}
          title={`Routed via IndiaMART — ${brandName}'s number stays private`}
          className={`text-[9px] font-extrabold text-accent-blue mt-0.5 block truncate ${className}`}
        >
          {maskedNumber}
        </a>
      );
    }
    return (
      <div className={`bg-accent-blue/5 border border-accent-blue/15 rounded-lg px-2 py-1.5 mt-1 ${className}`}>
        <a
          href={`tel:${maskedNumber.replace(/\s+/g, '')}`}
          className="text-[9.5px] text-accent-blue font-black flex items-center gap-1"
        >
          <Phone className="w-3 h-3" />
          {maskedNumber}
        </a>
        <p className="text-[8px] text-slate-500 mt-1 leading-snug flex items-start gap-1">
          <ShieldCheck className="w-2.5 h-2.5 text-accent-green shrink-0 mt-0.5" />
          Routed via IndiaMART — {brandName.split(' ')[0]}&apos;s number stays private.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConnected(true)}
      className={`text-[9px] text-accent-blue font-bold flex items-center gap-1 ${compact ? '' : 'mt-1'} hover:text-primary transition ${className}`}
    >
      <Phone className="w-3 h-3" />
      {compact ? 'Connect' : 'Connect via IndiaMART'}
    </button>
  );
}
