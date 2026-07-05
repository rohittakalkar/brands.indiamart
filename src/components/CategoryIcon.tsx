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

export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, className = "w-3.5 h-3.5" }) => {
  const Icon = ICONS[icon] || Layers;
  return <Icon className={className} />;
};
