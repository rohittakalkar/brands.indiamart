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
    return (
      <span className="font-extrabold text-[#028384] text-[9px] tracking-tight uppercase select-none">
        {getInitials(name)}
      </span>
    );
  }

  return (
    <img 
      src={logo} 
      alt={name} 
      className={className} 
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
};
