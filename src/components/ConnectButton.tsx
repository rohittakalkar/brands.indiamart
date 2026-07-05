'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, ShieldCheck } from 'lucide-react';
import { getMaskedConnectNumber } from '../lib/connect';

interface ConnectButtonProps {
  supplierId: string;
  brandName: string;
  className?: string;
  /** Denser rendering for tight card grids (e.g. the Compare table) — icon-only buttons, no privacy caption. */
  compact?: boolean;
}

// The lightweight "Connect Directly" path alongside the RFQ form — one tap, no identity
// capture (masking itself is what prevents spam, not a form gate), and never a raw
// personal phone number: the buyer is connected via a masked/proxy line, exactly like
// IndiaMART's real click-to-call/click-to-chat infrastructure. Call and WhatsApp both
// route through the same masked number — one proxy line, two channels. Styled as real
// buttons (not text) at both sizes so it reads as tappable alongside the primary `Get Quote` CTA.
export function ConnectButton({ supplierId, brandName, className = '', compact = false }: ConnectButtonProps) {
  const [connected, setConnected] = useState(false);

  if (connected) {
    const maskedNumber = getMaskedConnectNumber(supplierId);
    const telHref = `tel:${maskedNumber.replace(/\s+/g, '')}`;
    const waDigits = maskedNumber.replace(/[^\d]/g, ''); // already carries the 91 country code
    const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(
      `Hi, I'm interested in ${brandName}'s products. Please share pricing and availability.`
    )}`;

    if (compact) {
      return (
        <div className={`flex gap-1 mt-1 ${className}`}>
          <a
            href={telHref}
            title={`Call — routed via IndiaMART, ${brandName}'s number stays private`}
            className="flex-1 min-h-[30px] px-1 py-1.5 bg-cta hover:bg-cta-hover text-white rounded-lg flex items-center justify-center transition"
          >
            <Phone className="w-3 h-3" />
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            title={`WhatsApp — routed via IndiaMART, ${brandName}'s number stays private`}
            className="flex-1 min-h-[30px] px-1 py-1.5 bg-[#25D366] hover:bg-[#1fb959] text-white rounded-lg flex items-center justify-center transition"
          >
            <MessageCircle className="w-3 h-3" />
          </a>
        </div>
      );
    }
    return (
      <div className={`mt-1.5 ${className}`}>
        <div className="flex gap-1.5">
          <a
            href={telHref}
            className="flex-1 min-h-[36px] px-2 py-2 bg-cta hover:bg-cta-hover text-white rounded-lg text-[10.5px] font-extrabold flex items-center justify-center gap-1 transition shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[36px] px-2 py-2 bg-[#25D366] hover:bg-[#1fb959] text-white rounded-lg text-[10.5px] font-extrabold flex items-center justify-center gap-1 transition shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
        <p className="text-[8px] text-slate-500 mt-1.5 leading-snug flex items-start gap-1">
          <ShieldCheck className="w-2.5 h-2.5 text-accent-green shrink-0 mt-0.5" />
          Routed via IndiaMART — {brandName.split(' ')[0]}&apos;s number stays private.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setConnected(true)}
        className={`w-full min-h-[30px] px-2 py-1.5 mt-1 border border-cta text-cta hover:bg-accent-blue/10 rounded-lg text-[9px] font-extrabold flex items-center justify-center gap-1 transition ${className}`}
      >
        <Phone className="w-2.5 h-2.5" />
        Connect
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConnected(true)}
      className={`w-full min-h-[36px] px-3 py-2 mt-1.5 border border-cta text-cta hover:bg-accent-blue/10 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition ${className}`}
    >
      <Phone className="w-3.5 h-3.5" />
      Connect via IndiaMART
    </button>
  );
}
