import React from 'react';
import { Settings, Cpu, Home, Network, Pipette, Wrench, FlaskConical, Sun, Zap, Layers, Droplet, Wind, Snowflake, Cable, Laptop, Smartphone } from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  Settings,
  Cpu,
  Home,
  Network,
  Pipette,
  Wrench,
  FlaskConical,
  Sun,
  Zap,
  Droplet,
  Wind,
  Snowflake,
  Cable,
  Laptop,
  Smartphone
};

interface CategoryIconProps {
  icon: string;
  className?: string;
}

// A gentle continuous "breathe" (scale + opacity) — subtle on purpose, since this renders
// in dense grids (a whole page of category tiles) where anything stronger than a soft
// pulse would read as visual noise rather than a polished, alive detail.
export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, className = "w-3.5 h-3.5" }) => {
  const Icon = ICONS[icon] || Layers;
  return (
    <span className="inline-flex icon-anim-breathe">
      <Icon className={className} />
    </span>
  );
};
