import 'server-only';
import { Product, Supplier, AlternativeProduct, BrandMCat } from '../types';

type Family =
  | 'pump' | 'valve' | 'generator' | 'motor' | 'tool' | 'survey'
  | 'automation' | 'switchgear' | 'cable' | 'solar' | 'watercooler' | 'chiller' | 'compressor';

const BRAND_NAMES: Record<string, string> = {
  kirloskar: 'Kirloskar Brothers Limited',
  ksb: 'KSB Limited',
  crompton: 'Crompton Greaves Consumer Electricals',
  bosch: 'Bosch Limited India',
  siemens: 'Siemens India Limited',
  havells: 'Havells India Limited',
  voltas: 'Voltas Limited',
  atlascopco: 'Atlas Copco India'
};

const IMAGES: Record<Family, string[]> = {
  pump: [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=600'
  ],
  generator: [
    'https://images.unsplash.com/photo-1636867759143-c28c1e909bd3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1636867900334-025210ac78a0?auto=format&fit=crop&q=80&w=600'
  ],
  valve: ['https://images.unsplash.com/photo-1759148414485-5f624fe9d1ea?auto=format&fit=crop&q=80&w=600'],
  motor: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600'],
  tool: ['https://images.unsplash.com/photo-1623161551727-54c918bdcec1?auto=format&fit=crop&q=80&w=600'],
  survey: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600'],
  automation: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'],
  switchgear: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'],
  cable: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'],
  solar: ['https://images.unsplash.com/photo-1694327671725-e2a81cda3436?auto=format&fit=crop&q=80&w=600'],
  watercooler: ['https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600'],
  chiller: ['https://images.unsplash.com/photo-1698479603408-1a66a6d9e80f?auto=format&fit=crop&q=80&w=600'],
  compressor: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600']
};

const FAMILY_MCAT: Record<Family, string> = {
  pump: 'industrial-pumps',
  valve: 'industrial-valves',
  generator: 'diesel-generators',
  motor: 'induction-motors',
  tool: 'power-tools',
  survey: 'measuring-instruments',
  automation: 'plc-drives',
  switchgear: 'switchgear',
  cable: 'power-cables',
  solar: 'solar-equipment',
  watercooler: 'water-coolers-chillers',
  chiller: 'water-coolers-chillers',
  compressor: 'air-compressors'
};

interface FamilyMeta {
  descriptionTemplate: (name: string) => string;
  features: string[];
  useCases: string[];
  certifications: string[];
  certifiedBy: string;
  altCompetitors: [string, string];
}

const FAMILY_META: Record<Family, FamilyMeta> = {
  pump: {
    descriptionTemplate: (name) => `${name} delivers reliable fluid handling performance engineered for demanding industrial, agricultural, and building services applications with long service life and minimal maintenance.`,
    features: ['High efficiency hydraulic design', 'Corrosion-resistant material options', 'Back pull-out design for easy maintenance', 'Low vibration & noise operation'],
    useCases: ['Industrial water supply', 'Agricultural irrigation', 'Building services & HVAC', 'Process fluid handling'],
    certifications: ['ISO 9001:2015'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['Grundfos', 'Flowserve']
  },
  valve: {
    descriptionTemplate: (name) => `${name} provides dependable flow control and shutoff for industrial piping systems, engineered for demanding pressure and temperature conditions with a long maintenance-free service life.`,
    features: ['Robust cast body construction', 'Bi-directional sealing', 'Low operating torque', 'Suitable for a wide range of process media'],
    useCases: ['Process piping isolation', 'Water treatment plants', 'Oil & gas installations', 'HVAC systems'],
    certifications: ['ISO 9001', 'API 598'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['Audco India', 'Leader Valves']
  },
  generator: {
    descriptionTemplate: (name) => `${name} is a silent diesel generating set built on a fuel-efficient engine for reliable standby and prime power in industrial and commercial installations.`,
    features: ['Acoustic enclosure for noise-sensitive locations', 'Fuel-efficient engine with low emissions', 'Digital control panel with remote monitoring', 'Pan-India authorized service network'],
    useCases: ['Backup power for offices & retail', 'Standby power for manufacturing units', 'Prime power for construction sites', 'Emergency power for hospitals'],
    certifications: ['CPCB IV+ Emission Norms', 'ISO 8528'],
    certifiedBy: 'Central Pollution Control Board (CPCB)',
    altCompetitors: ['Cummins', 'Mahindra Powerol']
  },
  motor: {
    descriptionTemplate: (name) => `${name} is a high-efficiency industrial AC motor designed for demanding environments, with robust cast-iron frames and long service life.`,
    features: ['IE2 / IE3 high efficiency certified', 'IP55 ingress protection standard', 'Class F insulation with Class B temperature rise', 'Dynamically balanced rotor for vibration-free running'],
    useCases: ['Pump drives', 'Compressor drives', 'Conveyor systems', 'Workshop machinery'],
    certifications: ['IE2/IE3 Efficiency Certified', 'ISO 9001'],
    certifiedBy: 'Bureau of Energy Efficiency (BEE)',
    altCompetitors: ['ABB', 'WEG']
  },
  tool: {
    descriptionTemplate: (name) => `${name} is a professional-grade power tool built for heavy daily use on job sites, combining high performance with ergonomic, low-vibration handling.`,
    features: ['Heavy-duty motor', 'Ergonomic anti-vibration grip', 'Overload protection electronics', 'Rugged build for daily jobsite use'],
    useCases: ['Construction sites', 'Workshop fabrication', 'Maintenance & repair', 'Industrial installation work'],
    certifications: ['CE Certified', 'ISO 9001'],
    certifiedBy: 'TÜV Rheinland',
    altCompetitors: ['DeWalt', 'Makita']
  },
  survey: {
    descriptionTemplate: (name) => `${name} is a high-precision surveying instrument engineered for civil engineering, construction layout, and land surveying applications requiring exacting accuracy.`,
    features: ['High-precision optics/sensors', 'Rugged IP-rated casing', 'Long battery life', 'Wireless data transfer'],
    useCases: ['Construction layout', 'Land surveying', 'Civil engineering', 'Infrastructure projects'],
    certifications: ['CE Certified', 'IP66 Certified'],
    certifiedBy: 'TÜV SÜD',
    altCompetitors: ['Leica Geosystems', 'Trimble']
  },
  automation: {
    descriptionTemplate: (name) => `${name} delivers scalable, secure automation and control for industrial process and manufacturing environments, from machine-level control to plant-wide integration.`,
    features: ['Integrated industrial networking', 'Scalable modular architecture', 'Secure remote diagnostics', 'Wide operating temperature range'],
    useCases: ['Manufacturing line control', 'Process automation', 'Building automation', 'Machine control'],
    certifications: ['CE', 'UL Listed'],
    certifiedBy: 'TÜV Rheinland',
    altCompetitors: ['Allen-Bradley', 'Schneider Electric']
  },
  switchgear: {
    descriptionTemplate: (name) => `${name} provides reliable overload and short-circuit protection for industrial and commercial power distribution, compliant with international safety standards.`,
    features: ['IEC compliant construction', 'Microprocessor-based protection', 'High breaking capacity', 'Compact panel-mount design'],
    useCases: ['Power distribution panels', 'Industrial plants', 'Commercial buildings', 'Data centers'],
    certifications: ['IEC 60947', 'ISO 9001'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['Schneider Electric', 'ABB']
  },
  cable: {
    descriptionTemplate: (name) => `${name} is engineered for safe, reliable power transmission and distribution with superior insulation performance and long service life under demanding conditions.`,
    features: ['Fire retardant low smoke (FRLS) sheathing', 'High conductivity electrolytic copper', 'Rigorous factory quality testing', 'Suitable for underground & tray-laid installation'],
    useCases: ['Power distribution networks', 'Industrial plant wiring', 'Building infrastructure', 'Renewable energy installations'],
    certifications: ['IS 7098', 'FRLS Certified'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['Polycab', 'Finolex']
  },
  solar: {
    descriptionTemplate: (name) => `${name} delivers dependable solar energy conversion and management engineered for Indian rooftop and utility-scale installations.`,
    features: ['High conversion efficiency', 'Weatherproof outdoor-rated enclosure', 'Smart monitoring & diagnostics', 'Long performance warranty'],
    useCases: ['Rooftop solar installations', 'Utility-scale solar farms', 'Industrial captive power', 'Off-grid power systems'],
    certifications: ['IEC 61215', 'MNRE Approved'],
    certifiedBy: 'Ministry of New and Renewable Energy (MNRE)',
    altCompetitors: ['Waaree', 'Tata Power Solar']
  },
  watercooler: {
    descriptionTemplate: (name) => `${name} provides high cooling capacity and rapid recovery for institutional and industrial drinking water needs, built with food-grade stainless steel construction.`,
    features: ['SS 304 food grade stainless steel tank', 'High-efficiency compressor for rapid cooling', 'Eco-friendly non-CFC refrigerant', 'Heavy-duty chrome plated faucets'],
    useCases: ['Schools & institutions', 'Factories', 'Offices', 'Public utilities'],
    certifications: ['BEE 4-Star', 'ISI Mark'],
    certifiedBy: 'Bureau of Energy Efficiency (BEE)',
    altCompetitors: ['Blue Star', 'Usha']
  },
  chiller: {
    descriptionTemplate: (name) => `${name} delivers dependable commercial cooling performance for large-scale institutional and industrial climate control needs.`,
    features: ['Energy-efficient scroll/screw compressors', 'Corrosion-resistant outdoor cabinet', 'Smart digital controller', 'Low-noise fan operation'],
    useCases: ['Commercial buildings', 'Industrial process cooling', 'Cold storage facilities', 'Institutional HVAC'],
    certifications: ['ISO 9001', 'BEE Energy Star'],
    certifiedBy: 'Bureau of Energy Efficiency (BEE)',
    altCompetitors: ['Blue Star', 'Daikin']
  },
  compressor: {
    descriptionTemplate: (name) => `${name} is a highly energy-efficient rotary screw air compressor delivering dependable compressed air for a wide range of industrial applications.`,
    features: ['Smart electronic controller', 'Low maintenance and extended service intervals', 'Heavy duty screw element', 'Energy-efficient motor'],
    useCases: ['Manufacturing plants', 'Automotive workshops', 'Food & beverage processing', 'General industry'],
    certifications: ['ISO 8573-1', 'CE Certified'],
    certifiedBy: 'TÜV SÜD',
    altCompetitors: ['Ingersoll Rand', 'Kaeser']
  }
};

interface Seed {
  id: string;
  name: string;
  brandId: string;
  brandMCatId: string;
  family: Family;
  modelNumber: string;
  keySpecLabel: string;
  keySpecValue: string;
  priceRange: string;
  moq: string;
  deliveryTime: string;
  warranty: string;
  extraSpecs: [string, string][];
  certifiedYear?: number;
}

const KIRLOSKAR_PUMPS: Seed[] = [
  { id: 'kirloskar-submersible-openwell', name: 'Kirloskar Submersible Openwell Pump (KOS Series)', brandId: 'kirloskar', brandMCatId: 'kirloskar-pumps', family: 'pump', modelNumber: 'KOS-100', keySpecLabel: 'Rated Power', keySpecValue: '1 HP - 10 HP', priceRange: '₹6,500 - ₹42,000', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Discharge Size', '32mm - 50mm'], ['Head Range', 'Up to 45 meters'], ['Material', 'Stainless Steel Body']] },
  { id: 'kirloskar-monoblock', name: 'Kirloskar Monoblock Centrifugal Pump (KDS Series)', brandId: 'kirloskar', brandMCatId: 'kirloskar-pumps', family: 'pump', modelNumber: 'KDS-Mono-2', keySpecLabel: 'Rated Power', keySpecValue: '0.5 HP - 5 HP', priceRange: '₹3,800 - ₹19,500', moq: '1 Piece', deliveryTime: '2-4 Days', warranty: '12 Months', extraSpecs: [['Discharge Size', '25mm - 40mm'], ['Head Range', 'Up to 32 meters'], ['Material', 'Cast Iron']] },
  { id: 'kirloskar-agri-pumpset', name: 'Kirloskar Agricultural Pump Set (KAP Series)', brandId: 'kirloskar', brandMCatId: 'kirloskar-pumps', family: 'pump', modelNumber: 'KAP-A5', keySpecLabel: 'Rated Power', keySpecValue: '3 HP - 15 HP', priceRange: '₹11,000 - ₹64,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Flow Rate', 'Up to 250 m³/hr'], ['Head Range', 'Up to 60 meters'], ['Coupling', 'Diesel Engine / Electric Motor']] },
  { id: 'kirloskar-firefighting-pump', name: 'Kirloskar Fire Fighting Pump Set (KFP Series)', brandId: 'kirloskar', brandMCatId: 'kirloskar-pumps', family: 'pump', modelNumber: 'KFP-750', keySpecLabel: 'Rated Power', keySpecValue: '20 HP - 100 HP', priceRange: '₹1,85,000 - ₹6,50,000', moq: '1 Set', deliveryTime: '10-15 Days', warranty: '18 Months', extraSpecs: [['Compliance', 'TAC / NFPA 20'], ['Flow Rate', 'Up to 2850 LPM'], ['Pressure', 'Up to 10.5 kg/cm²']] },
  { id: 'kirloskar-sewage-pump', name: 'Kirloskar Sewage Submersible Pump (KSD Series)', brandId: 'kirloskar', brandMCatId: 'kirloskar-pumps', family: 'pump', modelNumber: 'KSD-Sew-3', keySpecLabel: 'Rated Power', keySpecValue: '2 HP - 25 HP', priceRange: '₹17,500 - ₹1,18,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Solid Handling', 'Up to 50mm'], ['Discharge Size', '80mm - 150mm'], ['Material', 'CI / SS Impeller']] }
];

const KIRLOSKAR_GENERATORS: Seed[] = [
  { id: 'kirloskar-dg-15', name: 'Kirloskar Green 15 kVA Diesel Generator', brandId: 'kirloskar', brandMCatId: 'kirloskar-diesel-generators', family: 'generator', modelNumber: 'KG1-15AS', keySpecLabel: 'Prime Power', keySpecValue: '15 kVA / 12 kW', priceRange: '₹2,75,000 - ₹3,10,000', moq: '1 Set', deliveryTime: '5-10 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kirloskar 3R1040, 3-Cylinder'], ['Fuel Tank Capacity', '90 Litres'], ['Noise Level', '72 dB(A) @ 1m']] },
  { id: 'kirloskar-dg-30', name: 'Kirloskar Green 30 kVA Diesel Generator', brandId: 'kirloskar', brandMCatId: 'kirloskar-diesel-generators', family: 'generator', modelNumber: 'KG1-30AS', keySpecLabel: 'Prime Power', keySpecValue: '30 kVA / 24 kW', priceRange: '₹4,40,000 - ₹4,95,000', moq: '1 Set', deliveryTime: '5-10 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kirloskar 4R1040, 4-Cylinder'], ['Fuel Tank Capacity', '120 Litres'], ['Noise Level', '73 dB(A) @ 1m']] },
  { id: 'kirloskar-dg-40', name: 'Kirloskar Green 40 kVA Diesel Generator', brandId: 'kirloskar', brandMCatId: 'kirloskar-diesel-generators', family: 'generator', modelNumber: 'KG1-40AS', keySpecLabel: 'Prime Power', keySpecValue: '40 kVA / 32 kW', priceRange: '₹5,60,000 - ₹6,25,000', moq: '1 Set', deliveryTime: '7-12 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kirloskar 4R1040TA, 4-Cylinder'], ['Fuel Tank Capacity', '150 Litres'], ['Noise Level', '74 dB(A) @ 1m']] },
  { id: 'kirloskar-dg-82', name: 'Kirloskar Green 82.5 kVA Diesel Generator', brandId: 'kirloskar', brandMCatId: 'kirloskar-diesel-generators', family: 'generator', modelNumber: 'KG1-82.5AS', keySpecLabel: 'Prime Power', keySpecValue: '82.5 kVA / 66 kW', priceRange: '₹10,80,000 - ₹12,10,000', moq: '1 Set', deliveryTime: '10-16 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kirloskar 4R1040TAG2, 4-Cylinder'], ['Fuel Tank Capacity', '220 Litres'], ['Noise Level', '76 dB(A) @ 1m']] },
  { id: 'kirloskar-dg-160', name: 'Kirloskar Green 160 kVA Diesel Generator', brandId: 'kirloskar', brandMCatId: 'kirloskar-diesel-generators', family: 'generator', modelNumber: 'KG1-160AS', keySpecLabel: 'Prime Power', keySpecValue: '160 kVA / 128 kW', priceRange: '₹17,50,000 - ₹19,60,000', moq: '1 Set', deliveryTime: '12-20 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kirloskar 6R1040TA, 6-Cylinder'], ['Fuel Tank Capacity', '420 Litres'], ['Noise Level', '79 dB(A) @ 1m']] },
  { id: 'kirloskar-dg-320', name: 'Kirloskar Green 320 kVA Diesel Generator', brandId: 'kirloskar', brandMCatId: 'kirloskar-diesel-generators', family: 'generator', modelNumber: 'KG1-320AS', keySpecLabel: 'Prime Power', keySpecValue: '320 kVA / 256 kW', priceRange: '₹31,80,000 - ₹35,90,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kirloskar 12V1050, 12-Cylinder'], ['Fuel Tank Capacity', '780 Litres'], ['Noise Level', '82 dB(A) @ 1m']] }
];

const KIRLOSKAR_VALVES: Seed[] = [
  { id: 'kirloskar-gate-valve', name: 'Kirloskar Cast Iron Gate Valve', brandId: 'kirloskar', brandMCatId: 'kirloskar-valves', family: 'valve', modelNumber: 'KGV-DN100', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN300', priceRange: '₹3,200 - ₹48,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 10 / PN 16'], ['Body Material', 'Cast Iron / Ductile Iron'], ['End Connection', 'Flanged']] },
  { id: 'kirloskar-butterfly-valve', name: 'Kirloskar Butterfly Valve', brandId: 'kirloskar', brandMCatId: 'kirloskar-valves', family: 'valve', modelNumber: 'KBV-DN150', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN600', priceRange: '₹4,500 - ₹85,000', moq: '1 Piece', deliveryTime: '3-7 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 10 / PN 16'], ['Disc Material', 'Cast Iron / SS'], ['Operation', 'Lever / Gearbox']] },
  { id: 'kirloskar-check-valve', name: 'Kirloskar Swing Check Valve', brandId: 'kirloskar', brandMCatId: 'kirloskar-valves', family: 'valve', modelNumber: 'KCV-DN80', keySpecLabel: 'Nominal Size', keySpecValue: 'DN25 - DN200', priceRange: '₹2,800 - ₹36,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 10 / PN 16'], ['Body Material', 'Cast Iron'], ['End Connection', 'Flanged']] },
  { id: 'kirloskar-ball-valve', name: 'Kirloskar Ball Valve', brandId: 'kirloskar', brandMCatId: 'kirloskar-valves', family: 'valve', modelNumber: 'KBLV-DN50', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN100', priceRange: '₹1,500 - ₹22,000', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 16 / PN 25'], ['Body Material', 'Forged Brass / SS'], ['End Connection', 'Threaded / Flanged']] }
];

const KSB_PUMPS: Seed[] = [
  { id: 'ksb-movitec-multistage', name: 'KSB Movitec Vertical Multistage Pump', brandId: 'ksb', brandMCatId: 'ksb-pumps', family: 'pump', modelNumber: 'Movitec V 10', keySpecLabel: 'Rated Power', keySpecValue: '2 HP - 20 HP', priceRange: '₹28,000 - ₹2,40,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Flow Rate', 'Up to 45 m³/hr'], ['Head Range', 'Up to 280 meters'], ['Material', 'Stainless Steel AISI 304']] },
  { id: 'ksb-amadrainer-sewage', name: 'KSB Ama-Drainer Sewage Pump', brandId: 'ksb', brandMCatId: 'ksb-pumps', family: 'pump', modelNumber: 'Ama-Drainer N 301', keySpecLabel: 'Rated Power', keySpecValue: '2 HP - 10 HP', priceRange: '₹32,000 - ₹1,55,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Solid Handling', 'Up to 40mm'], ['Discharge Size', '80mm - 100mm'], ['Material', 'Cast Iron / SS']] },
  { id: 'ksb-fire-series', name: 'KSB Fire Fighting Pump', brandId: 'ksb', brandMCatId: 'ksb-pumps', family: 'pump', modelNumber: 'Fire Series FF200', keySpecLabel: 'Rated Power', keySpecValue: '25 HP - 120 HP', priceRange: '₹2,10,000 - ₹7,80,000', moq: '1 Set', deliveryTime: '10-16 Days', warranty: '18 Months', extraSpecs: [['Compliance', 'TAC / NFPA 20'], ['Flow Rate', 'Up to 4200 LPM'], ['Pressure', 'Up to 12 kg/cm²']] },
  { id: 'ksb-hgc-boiler-feed', name: 'KSB HGC Boiler Feed Pump', brandId: 'ksb', brandMCatId: 'ksb-pumps', family: 'pump', modelNumber: 'HGC 4/6', keySpecLabel: 'Rated Power', keySpecValue: '15 HP - 75 HP', priceRange: '₹1,45,000 - ₹5,60,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Max Temperature', 'Up to 180°C'], ['Head Range', 'Up to 400 meters'], ['Material', 'Cast Steel']] },
  { id: 'ksb-omega-splitcase', name: 'KSB Omega Split Case Pump', brandId: 'ksb', brandMCatId: 'ksb-pumps', family: 'pump', modelNumber: 'Omega 100-250', keySpecLabel: 'Rated Power', keySpecValue: '10 HP - 60 HP', priceRange: '₹85,000 - ₹4,20,000', moq: '1 Piece', deliveryTime: '7-12 Days', warranty: '18 Months', extraSpecs: [['Flow Rate', 'Up to 900 m³/hr'], ['Head Range', 'Up to 120 meters'], ['Material', 'Cast Iron / Bronze Fitted']] },
  { id: 'ksb-upa-vertical-turbine', name: 'KSB UPA Vertical Turbine Pump', brandId: 'ksb', brandMCatId: 'ksb-pumps', family: 'pump', modelNumber: 'UPA 200', keySpecLabel: 'Rated Power', keySpecValue: '20 HP - 150 HP', priceRange: '₹1,90,000 - ₹8,50,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '18 Months', extraSpecs: [['Well Diameter', '10 inches - 16 inches'], ['Head Range', 'Up to 350 meters'], ['Material', 'Stainless Steel / Bronze']] }
];

const KSB_VALVES: Seed[] = [
  { id: 'ksb-boax-butterfly', name: 'KSB BOAX Butterfly Valve', brandId: 'ksb', brandMCatId: 'ksb-valves', family: 'valve', modelNumber: 'BOAX-S DN100', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN400', priceRange: '₹6,500 - ₹1,10,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'PN 16'], ['Disc Material', 'Stainless Steel'], ['Operation', 'Lever / Actuated']] },
  { id: 'ksb-ecoline-gate', name: 'KSB Ecoline Gate Valve', brandId: 'ksb', brandMCatId: 'ksb-valves', family: 'valve', modelNumber: 'Ecoline DN80', keySpecLabel: 'Nominal Size', keySpecValue: 'DN40 - DN300', priceRange: '₹4,200 - ₹62,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'PN 10 / PN 16'], ['Body Material', 'Ductile Iron'], ['End Connection', 'Flanged']] },
  { id: 'ksb-disc-check', name: 'KSB Disc Check Valve', brandId: 'ksb', brandMCatId: 'ksb-valves', family: 'valve', modelNumber: 'DN100 Wafer', keySpecLabel: 'Nominal Size', keySpecValue: 'DN25 - DN250', priceRange: '₹3,500 - ₹48,000', moq: '1 Piece', deliveryTime: '4-7 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'PN 16'], ['Body Material', 'Cast Iron / SS'], ['Type', 'Wafer / Dual Plate']] },
  { id: 'ksb-globe-valve', name: 'KSB Globe Valve', brandId: 'ksb', brandMCatId: 'ksb-valves', family: 'valve', modelNumber: 'Globe DN65', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN150', priceRange: '₹5,000 - ₹58,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'PN 16 / PN 25'], ['Body Material', 'Cast Steel'], ['End Connection', 'Flanged']] },
  { id: 'ksb-knife-gate', name: 'KSB Knife Gate Valve', brandId: 'ksb', brandMCatId: 'ksb-valves', family: 'valve', modelNumber: 'Knife Gate DN200', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN500', priceRange: '₹8,500 - ₹1,45,000', moq: '1 Piece', deliveryTime: '6-10 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'PN 10'], ['Body Material', 'Stainless Steel'], ['Application', 'Slurry / Sludge Isolation']] },
  { id: 'ksb-control-valve', name: 'KSB Miniature Control Valve', brandId: 'ksb', brandMCatId: 'ksb-valves', family: 'valve', modelNumber: 'Miniature CV50', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN80', priceRange: '₹12,000 - ₹95,000', moq: '1 Piece', deliveryTime: '6-12 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'PN 25 / PN 40'], ['Actuation', 'Pneumatic / Electric'], ['Body Material', 'Stainless Steel']] }
];

const CROMPTON_MOTORS: Seed[] = [
  { id: 'crompton-motor-1hp', name: 'Crompton TEFC Induction Motor 1 HP', brandId: 'crompton', brandMCatId: 'crompton-motors', family: 'motor', modelNumber: 'CG-TEFC-1HP-4P', keySpecLabel: 'Rated Power', keySpecValue: '1 HP (0.75 kW), 4 Pole', priceRange: '₹5,500 - ₹8,200', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Frame Size', '80M'], ['Mounting', 'Foot Mounting']] },
  { id: 'crompton-motor-3hp', name: 'Crompton TEFC Induction Motor 3 HP', brandId: 'crompton', brandMCatId: 'crompton-motors', family: 'motor', modelNumber: 'CG-TEFC-3HP-4P', keySpecLabel: 'Rated Power', keySpecValue: '3 HP (2.2 kW), 4 Pole', priceRange: '₹8,800 - ₹13,500', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Frame Size', '90L'], ['Mounting', 'Foot Mounting']] },
  { id: 'crompton-motor-7-5hp', name: 'Crompton TEFC Induction Motor 7.5 HP', brandId: 'crompton', brandMCatId: 'crompton-motors', family: 'motor', modelNumber: 'CG-TEFC-7.5HP-4P', keySpecLabel: 'Rated Power', keySpecValue: '7.5 HP (5.5 kW), 4 Pole', priceRange: '₹16,500 - ₹24,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Frame Size', '132M'], ['Mounting', 'Foot / Flange Mounting']] },
  { id: 'crompton-motor-10hp', name: 'Crompton TEFC Induction Motor 10 HP', brandId: 'crompton', brandMCatId: 'crompton-motors', family: 'motor', modelNumber: 'CG-TEFC-10HP-4P', keySpecLabel: 'Rated Power', keySpecValue: '10 HP (7.5 kW), 4 Pole', priceRange: '₹21,000 - ₹31,500', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Frame Size', '132M'], ['Mounting', 'Foot / Flange Mounting']] },
  { id: 'crompton-motor-20hp', name: 'Crompton TEFC Induction Motor 20 HP', brandId: 'crompton', brandMCatId: 'crompton-motors', family: 'motor', modelNumber: 'CG-TEFC-20HP-4P', keySpecLabel: 'Rated Power', keySpecValue: '20 HP (15 kW), 4 Pole', priceRange: '₹38,000 - ₹56,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Frame Size', '160L'], ['Mounting', 'Foot Mounting']] },
  { id: 'crompton-motor-40hp', name: 'Crompton TEFC Induction Motor 40 HP', brandId: 'crompton', brandMCatId: 'crompton-motors', family: 'motor', modelNumber: 'CG-TEFC-40HP-4P', keySpecLabel: 'Rated Power', keySpecValue: '40 HP (30 kW), 4 Pole', priceRange: '₹68,000 - ₹98,000', moq: '1 Piece', deliveryTime: '6-10 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Frame Size', '200L'], ['Mounting', 'Foot Mounting']] },
  { id: 'crompton-motor-60hp', name: 'Crompton TEFC Induction Motor 60 HP', brandId: 'crompton', brandMCatId: 'crompton-motors', family: 'motor', modelNumber: 'CG-TEFC-60HP-4P', keySpecLabel: 'Rated Power', keySpecValue: '60 HP (45 kW), 4 Pole', priceRange: '₹95,000 - ₹1,42,000', moq: '1 Piece', deliveryTime: '7-12 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Frame Size', '225M'], ['Mounting', 'Foot Mounting']] },
  { id: 'crompton-motor-100hp', name: 'Crompton TEFC Induction Motor 100 HP', brandId: 'crompton', brandMCatId: 'crompton-motors', family: 'motor', modelNumber: 'CG-TEFC-100HP-4P', keySpecLabel: 'Rated Power', keySpecValue: '100 HP (75 kW), 4 Pole', priceRange: '₹1,55,000 - ₹2,25,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Frame Size', '280S'], ['Mounting', 'Foot Mounting']] }
];

const CROMPTON_PUMPS: Seed[] = [
  { id: 'crompton-mini-champ', name: 'Crompton Mini Champ Domestic Pump', brandId: 'crompton', brandMCatId: 'crompton-pumps', family: 'pump', modelNumber: 'Mini Champ I', keySpecLabel: 'Rated Power', keySpecValue: '0.5 HP', priceRange: '₹2,200 - ₹3,800', moq: '1 Piece', deliveryTime: '2-4 Days', warranty: '12 Months', extraSpecs: [['Discharge Size', '25mm'], ['Head Range', 'Up to 18 meters'], ['Material', 'Engineering Plastic / CI']] },
  { id: 'crompton-sp-agri', name: 'Crompton SP Series Agricultural Pump', brandId: 'crompton', brandMCatId: 'crompton-pumps', family: 'pump', modelNumber: 'SP-5', keySpecLabel: 'Rated Power', keySpecValue: '3 HP - 12.5 HP', priceRange: '₹9,500 - ₹48,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Flow Rate', 'Up to 180 m³/hr'], ['Head Range', 'Up to 40 meters'], ['Coupling', 'Diesel Engine / Electric Motor']] },
  { id: 'crompton-monoblock', name: 'Crompton Monoblock Pump', brandId: 'crompton', brandMCatId: 'crompton-pumps', family: 'pump', modelNumber: 'CM-2H', keySpecLabel: 'Rated Power', keySpecValue: '1 HP - 3 HP', priceRange: '₹3,600 - ₹9,800', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Discharge Size', '25mm - 32mm'], ['Head Range', 'Up to 30 meters'], ['Material', 'Cast Iron']] },
  { id: 'crompton-openwell-submersible', name: 'Crompton Openwell Submersible Pump', brandId: 'crompton', brandMCatId: 'crompton-pumps', family: 'pump', modelNumber: 'OWS-100', keySpecLabel: 'Rated Power', keySpecValue: '1 HP - 5 HP', priceRange: '₹5,200 - ₹18,500', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Discharge Size', '32mm - 40mm'], ['Head Range', 'Up to 35 meters'], ['Material', 'Stainless Steel Body']] }
];

const BOSCH_TOOLS: Seed[] = [
  { id: 'bosch-angle-grinder', name: 'Bosch Professional Angle Grinder', brandId: 'bosch', brandMCatId: 'bosch-power-tools', family: 'tool', modelNumber: 'GWS 2000', keySpecLabel: 'Power Input', keySpecValue: '2000 Watts', priceRange: '₹4,500 - ₹7,200', moq: '1 Piece', deliveryTime: '2-4 Days', warranty: '12 Months', extraSpecs: [['Disc Diameter', '100mm - 230mm'], ['No Load Speed', '11,000 RPM'], ['Weight', '2.3 kg']] },
  { id: 'bosch-rotary-hammer', name: 'Bosch Professional Rotary Hammer Drill', brandId: 'bosch', brandMCatId: 'bosch-power-tools', family: 'tool', modelNumber: 'GBH 5-40 D', keySpecLabel: 'Power Input', keySpecValue: '1150 Watts', priceRange: '₹22,000 - ₹32,000', moq: '1 Piece', deliveryTime: '3-5 Days', warranty: '12 Months', extraSpecs: [['Impact Energy', '8.8 Joules'], ['Chuck System', 'SDS-Max'], ['Weight', '6.8 kg']] },
  { id: 'bosch-impact-drill', name: 'Bosch Heavy Duty Impact Drill', brandId: 'bosch', brandMCatId: 'bosch-power-tools', family: 'tool', modelNumber: 'GSB 21-2 RE', keySpecLabel: 'Power Input', keySpecValue: '1300 Watts', priceRange: '₹8,500 - ₹12,800', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Chuck Capacity', '1.5mm - 13mm'], ['No Load Speed', '0-2800 RPM'], ['Weight', '2.9 kg']] },
  { id: 'bosch-circular-saw', name: 'Bosch Professional Circular Saw', brandId: 'bosch', brandMCatId: 'bosch-power-tools', family: 'tool', modelNumber: 'GKS 190', keySpecLabel: 'Power Input', keySpecValue: '1400 Watts', priceRange: '₹9,800 - ₹14,500', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Blade Diameter', '190mm'], ['Cutting Depth', 'Up to 70mm'], ['No Load Speed', '5500 RPM']] },
  { id: 'bosch-impact-wrench', name: 'Bosch Professional Impact Wrench', brandId: 'bosch', brandMCatId: 'bosch-power-tools', family: 'tool', modelNumber: 'GDS 18 V-EC', keySpecLabel: 'Torque', keySpecValue: '400 Nm', priceRange: '₹18,500 - ₹26,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Drive Size', '1/2 inch'], ['Battery', '18V Li-ion'], ['Weight', '1.9 kg']] },
  { id: 'bosch-demolition-hammer', name: 'Bosch Professional Demolition Hammer', brandId: 'bosch', brandMCatId: 'bosch-power-tools', family: 'tool', modelNumber: 'GSH 5X', keySpecLabel: 'Impact Energy', keySpecValue: '8.3 Joules', priceRange: '₹35,000 - ₹48,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Power Input', '1150 Watts'], ['Chuck System', 'SDS-Max'], ['Weight', '6.9 kg']] },
  { id: 'bosch-cordless-screwdriver', name: 'Bosch Professional Cordless Screwdriver', brandId: 'bosch', brandMCatId: 'bosch-power-tools', family: 'tool', modelNumber: 'GSR 12V-15', keySpecLabel: 'Torque', keySpecValue: '30 Nm', priceRange: '₹6,500 - ₹9,800', moq: '1 Piece', deliveryTime: '2-4 Days', warranty: '12 Months', extraSpecs: [['Battery', '12V Li-ion'], ['Chuck Capacity', '1mm - 10mm'], ['Weight', '0.9 kg']] }
];

const BOSCH_SURVEY: Seed[] = [
  { id: 'bosch-auto-level', name: 'Bosch Auto Level', brandId: 'bosch', brandMCatId: 'bosch-surveying', family: 'survey', modelNumber: 'GOL 26D', keySpecLabel: 'Magnification', keySpecValue: '26x', priceRange: '₹10,300 - ₹15,500', moq: '1 Set', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Standard Deviation', '±1.6mm/km'], ['Compensation Range', '±15\''], ['Weight', '1.7 kg']] },
  { id: 'bosch-laser-level', name: 'Bosch Professional Line Laser Level', brandId: 'bosch', brandMCatId: 'bosch-surveying', family: 'survey', modelNumber: 'GLL 30 G', keySpecLabel: 'Working Range', keySpecValue: 'Up to 30m (with receiver)', priceRange: '₹5,100 - ₹7,800', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Self-Leveling Range', '±4°'], ['Laser Lines', 'Green Cross-Line'], ['Weight', '0.5 kg']] },
  { id: 'bosch-laser-distance-meter', name: 'Bosch Professional Laser Distance Meter', brandId: 'bosch', brandMCatId: 'bosch-surveying', family: 'survey', modelNumber: 'GLM 150 C', keySpecLabel: 'Measuring Range', keySpecValue: 'Up to 150m', priceRange: '₹18,500 - ₹26,000', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Accuracy', '±1.5mm'], ['Connectivity', 'Bluetooth'], ['Weight', '0.14 kg']] },
  { id: 'bosch-wall-scanner', name: 'Bosch Professional Wall Scanner', brandId: 'bosch', brandMCatId: 'bosch-surveying', family: 'survey', modelNumber: 'GMS 120', keySpecLabel: 'Detection Depth', keySpecValue: 'Up to 120mm', priceRange: '₹22,000 - ₹32,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Detects', 'Wood, Metal, Live Wiring'], ['Display', 'Graphic LCD'], ['Weight', '0.4 kg']] },
  { id: 'bosch-combi-laser', name: 'Bosch Professional Combi Laser', brandId: 'bosch', brandMCatId: 'bosch-surveying', family: 'survey', modelNumber: 'GCL 25', keySpecLabel: 'Self-Leveling Range', keySpecValue: '±4°', priceRange: '₹28,000 - ₹38,000', moq: '1 Set', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Laser Points', '5 (Point & Line Combi)'], ['Working Range', 'Up to 20m'], ['Weight', '0.7 kg']] }
];

const SIEMENS_AUTOMATION: Seed[] = [
  { id: 'siemens-plc-s71500', name: 'Siemens SIMATIC S7-1500 Advanced PLC', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: 'CPU 1515-2 PN', keySpecLabel: 'Architecture', keySpecValue: 'Modular, Expandable I/O', priceRange: '₹65,000 - ₹1,85,000', moq: '1 Set', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Work Memory', '500 KB - 1 MB'], ['Communication', 'PROFINET, PROFIBUS'], ['Programming Software', 'TIA Portal V17 or higher']] },
  { id: 'siemens-plc-s7200smart', name: 'Siemens SIMATIC S7-200 SMART PLC', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: 'SR40', keySpecLabel: 'Digital I/O', keySpecValue: '24 DI / 16 DO Onboard', priceRange: '₹12,500 - ₹28,000', moq: '1 Set', deliveryTime: '2-4 Days', warranty: '12 Months', extraSpecs: [['Analog Inputs', '2 - 4 Onboard'], ['Communication', 'Ethernet, RS485'], ['Programming Software', 'STEP 7-Micro/WIN SMART']] },
  { id: 'siemens-sinamics-g120', name: 'Siemens Sinamics G120 AC Drive', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: 'G120C', keySpecLabel: 'Motor Power', keySpecValue: '0.55 kW - 132 kW', priceRange: '₹22,000 - ₹3,80,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Voltage Range', '380V - 480V, 3 Phase'], ['Control Mode', 'Vector / V/f Control'], ['Communication', 'PROFIBUS, PROFINET, USS']] },
  { id: 'siemens-sinamics-v20', name: 'Siemens Sinamics V20 AC Drive', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: 'V20 Compact', keySpecLabel: 'Motor Power', keySpecValue: '0.12 kW - 30 kW', priceRange: '₹6,500 - ₹85,000', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Voltage Range', '200V - 480V'], ['Control Mode', 'V/f Control'], ['Protection', 'IP20']] },
  { id: 'siemens-simotics-motor', name: 'Siemens Simotics Induction Motor', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: '1LE1003', keySpecLabel: 'Rated Power', keySpecValue: '0.75 kW - 200 kW', priceRange: '₹9,500 - ₹4,20,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '18 Months', extraSpecs: [['Efficiency Class', 'IE3 / IE4'], ['Voltage', '415V, 3 Phase'], ['Protection', 'IP55']] },
  { id: 'siemens-hmi-panel', name: 'Siemens SIMATIC HMI Touch Panel', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: 'KTP700 Basic', keySpecLabel: 'Display Size', keySpecValue: '7-inch Touch', priceRange: '₹32,000 - ₹48,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Resolution', '800 x 480 pixels'], ['Communication', 'PROFINET'], ['Colors', '65,536']] },
  { id: 'siemens-sentron-mv-switchgear', name: 'Siemens SENTRON Medium Voltage Switchgear', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: '8DJH Ring Main Unit', keySpecLabel: 'Rated Voltage', keySpecValue: 'Up to 24 kV', priceRange: '₹4,50,000 - ₹9,80,000', moq: '1 Set', deliveryTime: '10-18 Days', warranty: '18 Months', extraSpecs: [['Rated Current', 'Up to 630A'], ['Insulation', 'SF6 Gas Insulated'], ['Type', 'Ring Main Unit']] },
  { id: 'siemens-sentron-lv-switchgear', name: 'Siemens SENTRON Low Voltage Switchgear', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: '8PQ Panel', keySpecLabel: 'Rated Current', keySpecValue: 'Up to 6300A', priceRange: '₹1,20,000 - ₹5,60,000', moq: '1 Set', deliveryTime: '8-15 Days', warranty: '18 Months', extraSpecs: [['Rated Voltage', 'Up to 690V'], ['Breaking Capacity', 'Up to 100 kA'], ['Type', 'Form 4 Panel']] },
  { id: 'siemens-sentron-3va-breaker', name: 'Siemens SENTRON 3VA Circuit Breaker', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: '3VA1', keySpecLabel: 'Rated Current', keySpecValue: '16A - 630A', priceRange: '₹8,500 - ₹65,000', moq: '1 Piece', deliveryTime: '3-7 Days', warranty: '18 Months', extraSpecs: [['Breaking Capacity', 'Up to 55 kA'], ['Poles', '3-Pole / 4-Pole'], ['Trip Unit', 'Thermal-Magnetic / Electronic']] },
  { id: 'siemens-sirius-safety-relay', name: 'Siemens SIRIUS Safety Relay', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: '3SK1', keySpecLabel: 'Safety Category', keySpecValue: 'Up to PLe / SIL3', priceRange: '₹9,800 - ₹22,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Input Type', 'E-Stop, Light Curtain, Guard'], ['Output Contacts', '3 NO + 1 NC'], ['Mounting', 'DIN Rail']] },
  { id: 'siemens-scalance-switch', name: 'Siemens SCALANCE Industrial Ethernet Switch', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: 'X208', keySpecLabel: 'Ports', keySpecValue: '8-Port Managed', priceRange: '₹18,500 - ₹32,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Speed', '10/100 Mbps'], ['Protection', 'IP30'], ['Redundancy', 'Ring Topology Support']] },
  { id: 'siemens-sitop-power-supply', name: 'Siemens SITOP Power Supply Module', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: 'PSU8600', keySpecLabel: 'Output Current', keySpecValue: 'Up to 40A', priceRange: '₹12,500 - ₹38,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Input Voltage', '120V - 230V AC'], ['Output Voltage', '24V DC'], ['Efficiency', 'Up to 94%']] }
];

const HAVELLS_CABLES: Seed[] = [
  { id: 'havells-xlpe-cable', name: 'Havells XLPE Power Cable', brandId: 'havells', brandMCatId: 'havells-cables', family: 'cable', modelNumber: 'XLPE-3C-95', keySpecLabel: 'Conductor Size', keySpecValue: '1.5 sq mm - 400 sq mm', priceRange: '₹85 - ₹4,200 per meter', moq: '100 Meters', deliveryTime: '5-10 Days', warranty: '12 Months', extraSpecs: [['Voltage Grade', 'Up to 33 kV'], ['Conductor', 'Electrolytic Copper / Aluminium'], ['Insulation', 'Cross-linked Polyethylene (XLPE)']] },
  { id: 'havells-lt-armoured', name: 'Havells LT Armoured Cable', brandId: 'havells', brandMCatId: 'havells-cables', family: 'cable', modelNumber: 'LT-AR-4C-25', keySpecLabel: 'Conductor Size', keySpecValue: '2.5 sq mm - 300 sq mm', priceRange: '₹95 - ₹3,800 per meter', moq: '100 Meters', deliveryTime: '5-10 Days', warranty: '12 Months', extraSpecs: [['Voltage Grade', 'Up to 1.1 kV'], ['Armour', 'Galvanized Steel Wire'], ['Sheathing', 'FRLS PVC']] },
  { id: 'havells-control-cable', name: 'Havells Multicore Control Cable', brandId: 'havells', brandMCatId: 'havells-cables', family: 'cable', modelNumber: 'CTRL-12C-1.5', keySpecLabel: 'Conductor Size', keySpecValue: '0.5 sq mm - 2.5 sq mm', priceRange: '₹45 - ₹380 per meter', moq: '100 Meters', deliveryTime: '5-9 Days', warranty: '12 Months', extraSpecs: [['Cores', '2 - 61 Cores'], ['Conductor', 'Electrolytic Copper'], ['Sheathing', 'FRLS PVC']] }
];

const HAVELLS_SWITCHGEAR: Seed[] = [
  { id: 'havells-mccb', name: 'Havells MCCB (Moulded Case Circuit Breaker)', brandId: 'havells', brandMCatId: 'havells-switchgear', family: 'switchgear', modelNumber: 'EDO4', keySpecLabel: 'Rated Current', keySpecValue: '16A - 630A', priceRange: '₹3,200 - ₹42,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Breaking Capacity', 'Up to 50 kA'], ['Poles', '3-Pole / 4-Pole'], ['Trip Unit', 'Thermal-Magnetic']] },
  { id: 'havells-mcb', name: 'Havells MCB (Miniature Circuit Breaker)', brandId: 'havells', brandMCatId: 'havells-switchgear', family: 'switchgear', modelNumber: 'DHMGC', keySpecLabel: 'Rated Current', keySpecValue: '0.5A - 63A', priceRange: '₹120 - ₹450', moq: '10 Pieces', deliveryTime: '2-5 Days', warranty: '18 Months', extraSpecs: [['Breaking Capacity', '10 kA'], ['Poles', 'SP / DP / TP / FP'], ['Curve Type', 'B / C / D']] },
  { id: 'havells-distribution-board', name: 'Havells TPN Distribution Board', brandId: 'havells', brandMCatId: 'havells-switchgear', family: 'switchgear', modelNumber: 'DB-8W', keySpecLabel: 'Ways', keySpecValue: '4 - 36 Ways', priceRange: '₹1,850 - ₹12,500', moq: '1 Piece', deliveryTime: '3-7 Days', warranty: '18 Months', extraSpecs: [['Type', 'TPN / SPN'], ['Enclosure', 'Powder Coated Steel'], ['Ingress Protection', 'IP43']] },
  { id: 'havells-contactor', name: 'Havells Power Contactor', brandId: 'havells', brandMCatId: 'havells-switchgear', family: 'switchgear', modelNumber: 'CI-25', keySpecLabel: 'Rated Current', keySpecValue: '9A - 800A', priceRange: '₹850 - ₹28,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '18 Months', extraSpecs: [['Coil Voltage', '24V - 415V AC'], ['Poles', '3-Pole / 4-Pole'], ['Application', 'Motor Switching']] },
  { id: 'havells-isolator', name: 'Havells Switch Disconnector Isolator', brandId: 'havells', brandMCatId: 'havells-switchgear', family: 'switchgear', modelNumber: 'ISO-63', keySpecLabel: 'Rated Current', keySpecValue: '16A - 800A', priceRange: '₹1,200 - ₹32,000', moq: '1 Piece', deliveryTime: '3-7 Days', warranty: '18 Months', extraSpecs: [['Poles', '3-Pole / 4-Pole'], ['Enclosure', 'IP65 Optional'], ['Application', 'Isolation & Maintenance Safety']] }
];

const HAVELLS_MOTORS: Seed[] = [
  { id: 'havells-three-phase-motor', name: 'Havells Three Phase Induction Motor', brandId: 'havells', brandMCatId: 'havells-motors', family: 'motor', modelNumber: 'HMOT-3P-5HP', keySpecLabel: 'Rated Power', keySpecValue: '1 HP - 50 HP', priceRange: '₹7,500 - ₹1,85,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Efficiency Class', 'IE2 / IE3'], ['Protection', 'IP55']] },
  { id: 'havells-single-phase-motor', name: 'Havells Single Phase Motor', brandId: 'havells', brandMCatId: 'havells-motors', family: 'motor', modelNumber: 'HMOT-1P-1HP', keySpecLabel: 'Rated Power', keySpecValue: '0.25 HP - 3 HP', priceRange: '₹2,800 - ₹8,500', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '18 Months', extraSpecs: [['Voltage', '230V ± 10%, 1 Phase'], ['Efficiency Class', 'IE2'], ['Protection', 'IP44']] }
];

const HAVELLS_SOLAR: Seed[] = [
  { id: 'havells-solar-inverter', name: 'Havells Solar String Inverter', brandId: 'havells', brandMCatId: 'havells-solar', family: 'solar', modelNumber: 'HSI-10K', keySpecLabel: 'Capacity', keySpecValue: '3 kW - 100 kW', priceRange: '₹42,000 - ₹4,80,000', moq: '1 Piece', deliveryTime: '5-10 Days', warranty: '60 Months', extraSpecs: [['Max Efficiency', 'Up to 98.6%'], ['MPPT Trackers', '2 - 6'], ['Monitoring', 'WiFi / GPRS App']] },
  { id: 'havells-solar-panel', name: 'Havells Mono PERC Solar Panel', brandId: 'havells', brandMCatId: 'havells-solar', family: 'solar', modelNumber: 'HSP-540', keySpecLabel: 'Capacity', keySpecValue: '540 Wp', priceRange: '₹12,500 - ₹18,500', moq: '10 Pieces', deliveryTime: '7-12 Days', warranty: '120 Months', extraSpecs: [['Cell Type', 'Mono PERC'], ['Efficiency', 'Up to 21.2%'], ['Frame', 'Anodized Aluminium']] },
  { id: 'havells-solar-charge-controller', name: 'Havells Solar Charge Controller', brandId: 'havells', brandMCatId: 'havells-solar', family: 'solar', modelNumber: 'HSC-60A', keySpecLabel: 'Capacity', keySpecValue: '12V/24V - 60A', priceRange: '₹6,500 - ₹14,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '36 Months', extraSpecs: [['Charging Type', 'MPPT'], ['Display', 'LCD Status Display'], ['Protection', 'Overcharge / Short Circuit']] }
];

const VOLTAS_WATERCOOLERS: Seed[] = [
  { id: 'voltas-cooler-20l', name: 'Voltas Water Cooler 20 Litres', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'watercooler', modelNumber: 'MW20-PSS', keySpecLabel: 'Storage Capacity', keySpecValue: '20 Litres, 1 Faucet', priceRange: '₹18,500 onwards', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Cooling Capacity', '15 Liters / Hour'], ['Body Material', 'SS Body'], ['Power Consumption', '250 Watts']] },
  { id: 'voltas-cooler-40l', name: 'Voltas Water Cooler 40 Litres', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'watercooler', modelNumber: 'MW40-PSS', keySpecLabel: 'Storage Capacity', keySpecValue: '40 Litres, 2 Faucets', priceRange: '₹26,500 onwards', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Cooling Capacity', '25 Liters / Hour'], ['Body Material', 'SS Body'], ['Power Consumption', '400 Watts']] },
  { id: 'voltas-cooler-65l', name: 'Voltas Water Cooler 65 Litres', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'watercooler', modelNumber: 'MW65-PSS', keySpecLabel: 'Storage Capacity', keySpecValue: '65 Litres, 2 Faucets', priceRange: '₹32,000 onwards', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Cooling Capacity', '32 Liters / Hour'], ['Body Material', 'SS Body'], ['Power Consumption', '550 Watts']] },
  { id: 'voltas-cooler-150l', name: 'Voltas Water Cooler 150 Litres', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'watercooler', modelNumber: 'MW150-FSS', keySpecLabel: 'Storage Capacity', keySpecValue: '150 Litres, 4 Faucets', priceRange: '₹58,000 onwards', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Cooling Capacity', '60 Liters / Hour'], ['Body Material', 'SS / GI Body'], ['Power Consumption', '850 Watts']] }
];

const VOLTAS_CHILLERS: Seed[] = [
  { id: 'voltas-commercial-chiller', name: 'Voltas Commercial Water Chiller', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VCH-20TR', keySpecLabel: 'Cooling Capacity', keySpecValue: '5 TR - 100 TR', priceRange: '₹4,50,000 - ₹28,00,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '18 Months', extraSpecs: [['Compressor Type', 'Scroll / Screw'], ['Refrigerant', 'R-410A / R-134a'], ['Application', 'Process & Comfort Cooling']] },
  { id: 'voltas-package-ac', name: 'Voltas Package Air Conditioner', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VPAC-8.5TR', keySpecLabel: 'Cooling Capacity', keySpecValue: '3 TR - 11 TR', priceRange: '₹1,85,000 - ₹4,20,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '12 Months', extraSpecs: [['Compressor Type', 'Scroll'], ['Refrigerant', 'R-410A'], ['Application', 'Commercial Spaces']] },
  { id: 'voltas-ductable-ac', name: 'Voltas Ductable Split AC', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VDAC-5.5TR', keySpecLabel: 'Cooling Capacity', keySpecValue: '1.5 TR - 8.5 TR', priceRange: '₹95,000 - ₹2,80,000', moq: '1 Piece', deliveryTime: '8-15 Days', warranty: '12 Months', extraSpecs: [['Compressor Type', 'Rotary / Scroll'], ['Refrigerant', 'R-410A'], ['Application', 'Offices & Retail']] },
  { id: 'voltas-deep-freezer', name: 'Voltas Commercial Deep Freezer', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VDF-500', keySpecLabel: 'Storage Capacity', keySpecValue: '100 - 700 Litres', priceRange: '₹32,000 - ₹95,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Temperature Range', '-18°C to -24°C'], ['Body Material', 'GI / SS'], ['Refrigerant', 'R-290 (Eco-friendly)']] },
  { id: 'voltas-visi-cooler', name: 'Voltas Visi Cooler', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VVC-400', keySpecLabel: 'Storage Capacity', keySpecValue: '190 - 550 Litres', priceRange: '₹28,000 - ₹68,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Temperature Range', '2°C to 8°C'], ['Door Type', 'Glass Door'], ['Application', 'Retail Beverage Display']] },
  { id: 'voltas-cassette-ac', name: 'Voltas Cassette Air Conditioner', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VCAC-2TR', keySpecLabel: 'Cooling Capacity', keySpecValue: '1.5 TR - 4 TR', priceRange: '₹52,000 - ₹98,000', moq: '1 Piece', deliveryTime: '5-10 Days', warranty: '12 Months', extraSpecs: [['Compressor Type', 'Rotary'], ['Refrigerant', 'R-410A'], ['Application', 'False Ceiling Installations']] },
  { id: 'voltas-rooftop-package', name: 'Voltas Rooftop Package Unit', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VRPU-15TR', keySpecLabel: 'Cooling Capacity', keySpecValue: '7.5 TR - 25 TR', priceRange: '₹6,80,000 - ₹16,50,000', moq: '1 Set', deliveryTime: '15-22 Days', warranty: '18 Months', extraSpecs: [['Compressor Type', 'Scroll'], ['Airflow Type', 'Ducted / Non-Ducted'], ['Application', 'Malls & Large Commercial Spaces']] },
  { id: 'voltas-cold-room', name: 'Voltas Cold Room Refrigeration Unit', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VCR-1000', keySpecLabel: 'Storage Volume', keySpecValue: '10 - 500 Cubic Meters', priceRange: '₹3,20,000 - ₹18,00,000', moq: '1 Set', deliveryTime: '20-30 Days', warranty: '18 Months', extraSpecs: [['Temperature Range', '-25°C to +10°C'], ['Insulation', 'PUF Panels'], ['Application', 'Cold Storage & Food Processing']] }
];

const ATLASCOPCO_COMPRESSORS: Seed[] = [
  { id: 'atlascopco-ga11', name: 'Atlas Copco GA 11 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 11 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '11 kW (15 HP), VSD', priceRange: '₹2,20,000 onwards', moq: '1 Piece', deliveryTime: '5-10 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '9.7 - 33.9 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga18', name: 'Atlas Copco GA 18.5 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 18.5 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '18.5 kW (25 HP), VSD', priceRange: '₹3,10,000 onwards', moq: '1 Piece', deliveryTime: '5-10 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '16.2 - 55.8 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga22', name: 'Atlas Copco GA 22 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 22 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '22 kW (30 HP), VSD', priceRange: '₹3,60,000 onwards', moq: '1 Piece', deliveryTime: '5-10 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '19.4 - 66.8 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga37', name: 'Atlas Copco GA 37 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 37 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '37 kW (50 HP), VSD', priceRange: '₹5,80,000 onwards', moq: '1 Piece', deliveryTime: '7-12 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '32.8 - 111.5 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga55', name: 'Atlas Copco GA 55 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 55 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '55 kW (75 HP), VSD', priceRange: '₹7,90,000 onwards', moq: '1 Piece', deliveryTime: '7-12 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '48.4 - 168.2 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga75', name: 'Atlas Copco GA 75 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 75 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '75 kW (100 HP), VSD', priceRange: '₹10,50,000 onwards', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '65.8 - 226.7 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga90', name: 'Atlas Copco GA 90 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 90 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '90 kW (120 HP), VSD', priceRange: '₹13,20,000 onwards', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '78.3 - 271.4 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga110', name: 'Atlas Copco GA 110 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 110 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '110 kW (150 HP), VSD', priceRange: '₹16,80,000 onwards', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '95.9 - 332.6 l/s'], ['Drive Type', 'VSD']] }
];

const ATLASCOPCO_OTHER: Seed[] = [
  { id: 'atlascopco-piston-compressor', name: 'Atlas Copco Piston Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'AF Series', keySpecLabel: 'Motor Power', keySpecValue: '2 HP - 10 HP', priceRange: '₹22,000 - ₹85,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', 'Up to 10 bar'], ['Tank Capacity', '90 - 500 Litres'], ['Drive Type', 'Belt Driven']] },
  { id: 'atlascopco-vacuum-pump', name: 'Atlas Copco Rotary Vane Vacuum Pump', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GVS 100', keySpecLabel: 'Pumping Speed', keySpecValue: 'Up to 300 m³/hr', priceRange: '₹1,40,000 - ₹4,20,000', moq: '1 Piece', deliveryTime: '7-12 Days', warranty: '18 Months', extraSpecs: [['Ultimate Vacuum', 'Up to 0.5 mbar'], ['Motor Power', '3 kW - 15 kW'], ['Application', 'Process Vacuum Systems']] },
  { id: 'atlascopco-air-dryer', name: 'Atlas Copco Refrigerant Air Dryer', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'FD 30', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 3000 l/s', priceRange: '₹85,000 - ₹6,50,000', moq: '1 Piece', deliveryTime: '7-14 Days', warranty: '18 Months', extraSpecs: [['Pressure Dew Point', '3°C'], ['Refrigerant', 'R-410A'], ['Application', 'Compressed Air Treatment']] },
  { id: 'atlascopco-nitrogen-generator', name: 'Atlas Copco Nitrogen Generator', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'NGP+ 15', keySpecLabel: 'Purity Level', keySpecValue: 'Up to 99.999%', priceRange: '₹4,80,000 - ₹18,00,000', moq: '1 Set', deliveryTime: '12-20 Days', warranty: '24 Months', extraSpecs: [['Technology', 'PSA (Pressure Swing Adsorption)'], ['Flow Rate', 'Up to 500 Nm³/hr'], ['Application', 'Food Packaging, Electronics, Metal Processing']] }
];

const ALL_SEEDS: Seed[] = [
  ...KIRLOSKAR_PUMPS,
  ...KIRLOSKAR_GENERATORS,
  ...KIRLOSKAR_VALVES,
  ...KSB_PUMPS,
  ...KSB_VALVES,
  ...CROMPTON_MOTORS,
  ...CROMPTON_PUMPS,
  ...BOSCH_TOOLS,
  ...BOSCH_SURVEY,
  ...SIEMENS_AUTOMATION,
  ...HAVELLS_CABLES,
  ...HAVELLS_SWITCHGEAR,
  ...HAVELLS_MOTORS,
  ...HAVELLS_SOLAR,
  ...VOLTAS_WATERCOOLERS,
  ...VOLTAS_CHILLERS,
  ...ATLASCOPCO_COMPRESSORS,
  ...ATLASCOPCO_OTHER
];

function toProduct(seed: Seed, imageIdx: number): Product {
  const meta = FAMILY_META[seed.family];
  const images = IMAGES[seed.family];
  const specifications: Record<string, string> = { [seed.keySpecLabel]: seed.keySpecValue };
  for (const [k, v] of seed.extraSpecs) specifications[k] = v;

  return {
    id: seed.id,
    name: seed.name,
    brandId: seed.brandId,
    brandName: BRAND_NAMES[seed.brandId],
    mcatId: FAMILY_MCAT[seed.family],
    brandMCatId: seed.brandMCatId,
    image: images[imageIdx % images.length],
    modelNumber: seed.modelNumber,
    keySpecLabel: seed.keySpecLabel,
    keySpecValue: seed.keySpecValue,
    priceRange: seed.priceRange,
    moq: seed.moq,
    deliveryTime: seed.deliveryTime,
    warranty: seed.warranty,
    specifications,
    description: meta.descriptionTemplate(seed.name),
    features: meta.features,
    useCases: meta.useCases,
    certifications: meta.certifications,
    certifiedBy: meta.certifiedBy,
    certifiedYear: seed.certifiedYear ?? 2020 + (imageIdx % 5)
  };
}

const CITIES = [
  'Pune, Maharashtra', 'Mumbai, Maharashtra', 'Bengaluru, Karnataka', 'Chennai, Tamil Nadu',
  'New Delhi, Delhi', 'Ahmedabad, Gujarat', 'Hyderabad, Telangana', 'Kolkata, West Bengal',
  'Nagpur, Maharashtra', 'Coimbatore, Tamil Nadu'
];

function toSupplier(seed: Seed, idx: number): Supplier {
  const city = CITIES[idx % CITIES.length];
  const experienceYears = 8 + (idx % 35);
  const rating = Math.round((4.1 + (idx % 8) * 0.09) * 10) / 10;
  const reviewsCount = 45 + ((idx * 13) % 320);
  const responseHrs = (1.2 + (idx % 9) * 0.35).toFixed(1);

  return {
    id: `${seed.id}-supp-1`,
    name: `${BRAND_NAMES[seed.brandId].split(' ')[0]} Authorized Partners – ${city.split(',')[0]}`,
    brandId: seed.brandId,
    brandName: BRAND_NAMES[seed.brandId],
    productId: seed.id,
    location: city,
    rating,
    reviewsCount,
    experienceYears,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2024 - experienceYears + 3,
    responseTime: `${responseHrs} hrs`,
    deliveryTimeRange: seed.deliveryTime,
    priceEstimate: seed.priceRange
  };
}

function toAlternatives(seed: Seed): AlternativeProduct[] {
  const meta = FAMILY_META[seed.family];
  return meta.altCompetitors.map((brandName, i) => ({
    id: `alt-${seed.id}-${i + 1}`,
    productId: seed.id,
    brandName,
    modelNumber: `${brandName.split(' ')[0].toUpperCase().slice(0, 4)}-${seed.modelNumber}`,
    mcatId: FAMILY_MCAT[seed.family],
    priceRange: seed.priceRange,
    keySpecLabel: seed.keySpecLabel,
    keySpecValue: seed.keySpecValue
  }));
}

export const GENERATED_PRODUCTS: Product[] = (() => {
  const counters: Partial<Record<Family, number>> = {};
  return ALL_SEEDS.map((seed) => {
    const idx = counters[seed.family] ?? 0;
    counters[seed.family] = idx + 1;
    return toProduct(seed, idx);
  });
})();

export const GENERATED_SUPPLIERS: Supplier[] = ALL_SEEDS.map((seed, idx) => toSupplier(seed, idx));

export const GENERATED_ALTERNATIVES: AlternativeProduct[] = ALL_SEEDS.flatMap(toAlternatives);

export const GENERATED_BRAND_MCATS: BrandMCat[] = [
  {
    id: 'kirloskar-valves',
    brandId: 'kirloskar',
    mcatId: 'industrial-valves',
    name: 'Kirloskar Valves',
    tagline: 'Dependable flow control for industrial piping systems',
    description: 'Kirloskar manufactures a comprehensive range of gate, butterfly, check, and ball valves engineered for reliable isolation and flow control across industrial and water infrastructure applications.',
    applications: ['Process Piping Isolation', 'Water Treatment Plants', 'Industrial Fluid Systems', 'Irrigation Networks']
  },
  {
    id: 'ksb-valves',
    brandId: 'ksb',
    mcatId: 'industrial-valves',
    name: 'KSB Valves',
    tagline: 'German-engineered flow control and isolation systems',
    description: 'KSB Limited offers precision-engineered butterfly, gate, check, globe, knife gate, and control valves for water, wastewater, energy, and industrial process applications.',
    applications: ['Process Control', 'Water & Wastewater Treatment', 'Power Plants', 'Industrial Piping Systems']
  },
  {
    id: 'crompton-pumps',
    brandId: 'crompton',
    mcatId: 'industrial-pumps',
    name: 'Crompton Pumps',
    tagline: 'Dependable domestic and agricultural pumping solutions',
    description: 'Crompton manufactures a wide range of domestic, agricultural, monoblock, and openwell submersible pumps engineered for reliable performance and energy efficiency.',
    applications: ['Domestic Water Supply', 'Agricultural Irrigation', 'Residential Buildings', 'Small Commercial Use']
  },
  {
    id: 'bosch-power-tools',
    brandId: 'bosch',
    mcatId: 'power-tools',
    name: 'Bosch Power Tools',
    tagline: 'Professional-grade tools built for daily jobsite use',
    description: 'Bosch Professional power tools deliver heavy-duty performance for construction, fabrication, and industrial maintenance work, combining durability with ergonomic precision.',
    applications: ['Construction Sites', 'Workshop Fabrication', 'Maintenance & Repair', 'Industrial Installation']
  },
  {
    id: 'havells-cables',
    brandId: 'havells',
    mcatId: 'power-cables',
    name: 'Havells Cables',
    tagline: 'Reliable power transmission for industrial infrastructure',
    description: 'Havells manufactures XLPE power cables, LT armoured cables, and control cables engineered for safe, reliable electrical transmission and distribution.',
    applications: ['Power Distribution Networks', 'Industrial Plant Wiring', 'Building Infrastructure', 'Renewable Energy Installations']
  },
  {
    id: 'havells-motors',
    brandId: 'havells',
    mcatId: 'induction-motors',
    name: 'Havells Motors',
    tagline: 'Efficient industrial motors for diverse applications',
    description: 'Havells manufactures three phase and single phase induction motors engineered for reliable, energy-efficient operation across industrial and commercial applications.',
    applications: ['Pump Drives', 'Fan & Blower Drives', 'Workshop Machinery', 'HVAC Systems']
  },
  {
    id: 'havells-solar',
    brandId: 'havells',
    mcatId: 'solar-equipment',
    name: 'Havells Solar',
    tagline: 'Complete solar energy solutions for Indian conditions',
    description: 'Havells offers a complete range of solar inverters, mono PERC panels, and charge controllers engineered for dependable rooftop and utility-scale solar installations.',
    applications: ['Rooftop Solar Installations', 'Utility-Scale Solar Farms', 'Industrial Captive Power', 'Off-Grid Power Systems']
  }
];
