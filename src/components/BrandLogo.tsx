'use client';

import React, { useState } from 'react';

interface BrandLogoProps {
  logo: string;
  name: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ logo, name, className = "w-full h-full object-contain" }) => {
  const [error, setError] = useState(false);
  
  const isUrl = logo && logo.startsWith('http');
  
  // Clean fallback initials/names
  const getInitials = (str: string) => {
    const lower = str.toLowerCase();
    if (lower.includes('siemens')) return 'SIEMENS';
    if (lower.includes('bosch')) return 'BOSCH';
    if (lower.includes('voltas')) return 'VOLTAS';
    if (lower.includes('havells')) return 'HAVELLS';
    if (lower.includes('kirloskar')) return 'KBL';
    if (lower.includes('atlas')) return 'ATLAS';
    if (lower.includes('crompton')) return 'CROMPTON';
    if (lower.includes('ksb')) return 'KSB';
    
    return str
      .split(' ')
      .filter(w => !['Limited', 'India', 'Pvt', 'Ltd'].includes(w))
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  };

  if (!isUrl || error) {
    // The original 8 brands set `logo` to a real Wikimedia image URL, so this branch only
    // runs for them on an image-load failure — the hardcoded lookup above is a hand-picked
    // abbreviation for that specific fallback case. Every brand added since sets `logo`
    // directly to a short, clean display string (e.g. 'Grundfos', 'KPCL', 'IR') specifically
    // so it renders here as-is. Without preferring it, name-substring matching alone would
    // collapse distinct brands together — e.g. Kirloskar Brothers, Kirloskar Pneumatic, and
    // Kirloskar Electric all contain "kirloskar" and would otherwise all show "KBL".
    const displayText = (!isUrl && logo) ? logo.toUpperCase() : getInitials(name);
    return (
      <span className="font-extrabold text-accent-blue text-[8px] tracking-tight uppercase select-none text-center leading-none line-clamp-2 px-0.5">
        {displayText}
      </span>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className={className}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};
