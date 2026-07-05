'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getMaskedConnectNumber } from '../lib/connect';

interface WhatsAppFloatingButtonProps {
  /** Seeds the masked number — brand, product, or model id depending on the page's context. */
  contactId: string;
  message: string;
  /** Positioning is per-page (footer heights and BottomNav stacking differ), so callers
   * pass their own bottom offset rather than this component guessing at layout. */
  className?: string;
}

// A persistent, always-reachable WhatsApp entry point that survives scroll — unlike the
// per-card/per-seller Connect buttons (which require scrolling to the relevant card), this
// stays visible the whole time a buyer is on the page. Routes through the same masked-number
// infrastructure as every other contact path in the app; never a real phone number.
export function WhatsAppFloatingButton({ contactId, message, className = '' }: WhatsAppFloatingButtonProps) {
  const maskedNumber = getMaskedConnectNumber(contactId);
  const href = `https://wa.me/${maskedNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
      className={`fixed right-4 z-30 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1fb959] text-white shadow-lg shadow-black/20 flex items-center justify-center transition hover:scale-105 ${className}`}
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
