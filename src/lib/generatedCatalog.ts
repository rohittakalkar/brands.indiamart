import 'server-only';
import { Product, Supplier, AlternativeProduct, BrandMCat } from '../types';

type Family =
  | 'pump' | 'valve' | 'generator' | 'motor' | 'tool' | 'survey'
  | 'automation' | 'switchgear' | 'cable' | 'solar' | 'watercooler' | 'chiller' | 'compressor'
  | 'construction' | 'pipe' | 'chemical' | 'laptop' | 'mobilephone';

const BRAND_NAMES: Record<string, string> = {
  kirloskar: 'Kirloskar Brothers Limited',
  ksb: 'KSB Limited',
  crompton: 'Crompton Greaves Consumer Electricals',
  bosch: 'Bosch Limited India',
  siemens: 'Siemens India Limited',
  havells: 'Havells India Limited',
  voltas: 'Voltas Limited',
  atlascopco: 'Atlas Copco India',
  ingersollrand: 'Ingersoll Rand (India) Limited',
  elgi: 'ELGi Equipments Limited',
  kaeser: 'Kaeser Compressors (India) Private Limited',
  kirloskarpneumatic: 'Kirloskar Pneumatic Company Limited',
  doosan: 'Doosan Portable Power India',
  boge: 'Boge Kompressoren India',
  sullair: 'Sullair India',
  chicagopneumatic: 'Chicago Pneumatic India',
  mattei: 'Mattei Compressors India',
  grundfos: 'Grundfos Pumps India Private Limited',
  flowserve: 'Flowserve India Controls Private Limited',
  sulzer: 'Sulzer India Limited',
  wilo: 'WILO Mather and Platt Pumps Private Limited',
  cripumps: 'CRI Pumps Private Limited',
  texmo: 'Texmo Industries',
  wpil: 'WPIL Limited',
  ltvalves: 'L&T Valves Limited',
  audco: 'AUDCO India Limited (Emerson)',
  velan: 'Velan Valves India Private Limited',
  kitz: 'KITZ Valves India Private Limited',
  zoloto: 'Zoloto Industries',
  bdk: 'BDK Engineering Industries',
  leadervalves: 'Leader Valves Limited',
  advancevalves: 'Advance Valves Private Limited',
  abb: 'ABB India Limited',
  kirloskarelectric: 'Kirloskar Electric Company Limited',
  bharatbijlee: 'Bharat Bijlee Limited',
  weg: 'WEG Electric India Private Limited',
  cgpower: 'CG Power and Industrial Solutions Limited',
  ge: 'GE India Industrial Private Limited',
  marathonelectric: 'Marathon Electric Motors (India) Limited',
  cummins: 'Cummins India Limited',
  caterpillar: 'Caterpillar India Private Limited',
  mahindrapowerol: 'Mahindra Powerol (Mahindra & Mahindra Limited)',
  ashokleyland: 'Ashok Leyland Power Solutions',
  escortskubota: 'Escorts Kubota Limited',
  honda: 'Honda India Power Products Limited',
  kohlersdmo: 'Kohler-SDMO India Private Limited',
  perkins: 'Perkins India Private Limited',
  greavescotton: 'Greaves Cotton Limited',
  bluestar: 'Blue Star Limited',
  godrej: 'Godrej & Boyce Mfg Co Ltd',
  carriermidea: 'Carrier Midea India Private Limited',
  daikin: 'Daikin Airconditioning India Private Limited',
  westernref: 'Western Refrigeration Private Limited',
  rockwellind: 'Rockwell Industries Limited',
  kelvinator: 'Kelvinator Appliances India Private Limited',
  celfrost: 'Celfrost Industries Private Limited',
  frickindia: 'Frick India Limited',
  makita: 'Makita India Private Limited',
  dewalt: 'DeWalt (Stanley Black & Decker India)',
  hikoki: 'HiKOKI Power Tools India Private Limited',
  blackdecker: 'Black+Decker (Stanley Black & Decker India)',
  stanley: 'Stanley Tools (Stanley Black & Decker India)',
  hilti: 'Hilti India Private Limited',
  metabo: 'Metabo India Private Limited',
  ingco: 'INGCO India',
  taparia: 'Taparia Tools Limited',
  mitutoyo: 'Mitutoyo South Asia Private Limited',
  fluke: 'Fluke India Private Limited',
  yokogawa: 'Yokogawa India Limited',
  testo: 'Testo India Private Limited',
  htcinstruments: 'HTC Instruments (India)',
  keysight: 'Keysight Technologies India Private Limited',
  mahr: 'Mahr India Private Limited',
  insize: 'Insize India',
  kusammeco: 'Kusam Meco Instruments Private Limited',
  rockwellautomation: 'Rockwell Automation India Private Limited',
  schneiderelectric: 'Schneider Electric India Private Limited',
  mitsubishielectric: 'Mitsubishi Electric India Private Limited',
  omron: 'Omron Automation Private Limited',
  deltaelectronics: 'Delta Electronics India Private Limited',
  honeywell: 'Honeywell Automation India Limited',
  polycab: 'Polycab India Limited',
  kei: 'KEI Industries Limited',
  finolexcables: 'Finolex Cables Limited',
  rrkabel: 'RR Kabel Limited',
  vguard: 'V-Guard Industries Limited',
  universalcables: 'Universal Cables Limited',
  aparindustries: 'Apar Industries Limited',
  torrentcables: 'Torrent Cables Limited',
  paramountcommunications: 'Paramount Communications Limited',
  ltelectrical: 'L&T Electrical & Automation',
  legrand: 'Legrand India Private Limited',
  cselectric: 'C&S Electric Limited',
  eaton: 'Eaton Power Quality Private Limited',
  standardelectricals: 'Standard Electricals Limited',
  waaree: 'Waaree Energies Limited',
  adanisolar: 'Adani Solar (Adani New Industries Limited)',
  tatapowersolar: 'Tata Power Solar Systems Limited',
  vikramsolar: 'Vikram Solar Limited',
  luminous: 'Luminous Power Technologies Private Limited',
  goldisolar: 'Goldi Solar Private Limited',
  renewsys: 'RenewSys India Private Limited',
  emmvee: 'EMMVEE Photovoltaic Power Private Limited',
  premierenergies: 'Premier Energies Limited',
  ultratech: 'UltraTech Cement Limited',
  ambuja: 'Ambuja Cements Limited',
  acccement: 'ACC Limited',
  jkcement: 'JK Cement Limited',
  shreecement: 'Shree Cement Limited',
  tatasteel: 'Tata Steel Limited',
  jswsteel: 'JSW Steel Limited',
  sail: 'Steel Authority of India Limited (SAIL)',
  jindalsteel: 'Jindal Steel and Power Limited',
  kajaria: 'Kajaria Ceramics Limited',
  supremeindustries: 'Supreme Industries Limited',
  finolexindustries: 'Finolex Industries Limited',
  astral: 'Astral Limited',
  jainirrigation: 'Jain Irrigation Systems Limited',
  princepipes: 'Prince Pipes and Fittings Limited',
  ashirvadpipes: 'Ashirvad Pipes Private Limited',
  apollopipes: 'Apollo Pipes Limited',
  jindalsaw: 'Jindal SAW Limited',
  suryaroshni: 'Surya Roshni Limited',
  kisanmouldings: 'Kisan Mouldings Limited',
  pidilite: 'Pidilite Industries Limited',
  asianpaints: 'Asian Paints Limited',
  bergerpaints: 'Berger Paints India Limited',
  srf: 'SRF Limited',
  upl: 'UPL Limited',
  deepaknitrite: 'Deepak Nitrite Limited',
  aartiindustries: 'Aarti Industries Limited',
  atul: 'Atul Limited',
  gujaratfluoro: 'Gujarat Fluorochemicals Limited',
  tatachemicals: 'Tata Chemicals Limited',
  dell: 'Dell Technologies India Private Limited',
  hp: 'HP India Sales Private Limited',
  lenovo: 'Lenovo India Private Limited',
  asus: 'ASUS India Private Limited',
  acer: 'Acer India Private Limited',
  apple: 'Apple India Private Limited',
  msi: 'MSI India (Micro-Star International)',
  samsung: 'Samsung India Electronics Private Limited',
  lg: 'LG Electronics India Private Limited',
  microsoft: 'Microsoft Corporation India Private Limited',
  xiaomi: 'Xiaomi Technology India Private Limited',
  oneplus: 'OnePlus Technology (India) Private Limited',
  vivo: 'Vivo Mobile India Private Limited',
  oppo: 'Oppo Mobiles India Private Limited',
  realme: 'Realme Mobile Telecommunications (India) Private Limited',
  motorola: 'Motorola Mobility India Private Limited',
  nokiahmd: 'HMD Global (Nokia Phones)',
  google: 'Google India Private Limited'
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
  compressor: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'],
  construction: [
    'https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1590644365607-1c5a2c1e2f2f?auto=format&fit=crop&q=80&w=600'
  ],
  pipe: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'],
  chemical: ['https://images.unsplash.com/photo-1616661455075-372ac590e0a0?auto=format&fit=crop&q=80&w=600'],
  laptop: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600'],
  mobilephone: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600']
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
  compressor: 'air-compressors',
  construction: 'construction',
  pipe: 'pipes',
  chemical: 'chemicals',
  laptop: 'laptops',
  mobilephone: 'mobile-phones'
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
  },
  construction: {
    descriptionTemplate: (name) => `${name} is a quality-tested building and construction material engineered for structural strength, durability, and consistent performance across residential and infrastructure projects.`,
    features: ['Consistent quality, batch-tested', 'BIS-compliant manufacturing', 'Pan-India dealer network', 'Bulk & retail packaging options'],
    useCases: ['Residential Construction', 'Commercial Buildings', 'Infrastructure Projects', 'Industrial Structures'],
    certifications: ['ISI Mark', 'ISO 9001'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['UltraTech Cement', 'Tata Steel']
  },
  pipe: {
    descriptionTemplate: (name) => `${name} delivers reliable, long-lasting fluid conveyance engineered for plumbing, irrigation, and infrastructure piping applications with consistent wall thickness and pressure ratings.`,
    features: ['UV-stabilized material', 'Leak-proof jointing system', 'Corrosion & chemical resistant', 'Long service life, low maintenance'],
    useCases: ['Plumbing & Sanitation', 'Agricultural Irrigation', 'Borewell & Water Supply', 'Sewerage & Drainage'],
    certifications: ['ISI Mark', 'ISO 9001'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['Supreme Industries', 'Astral Pipes']
  },
  chemical: {
    descriptionTemplate: (name) => `${name} is a quality-tested industrial and construction chemical engineered for consistent performance, safety compliance, and reliable application across diverse industrial processes.`,
    features: ['Consistent batch quality', 'Safety Data Sheet (SDS) compliant', 'Wide application compatibility', 'Bulk & packaged supply options'],
    useCases: ['Construction & Waterproofing', 'Industrial Manufacturing', 'Paints & Coatings', 'Adhesives & Sealants'],
    certifications: ['ISO 9001', 'ISO 14001'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['Pidilite Industries', 'Asian Paints']
  },
  laptop: {
    descriptionTemplate: (name) => `${name} delivers reliable computing performance engineered for business, enterprise, and bulk institutional deployment, backed by nationwide authorized service coverage.`,
    features: ['Enterprise-grade build quality', 'Bulk deployment & asset-tagging support', 'Extended warranty & onsite service options', 'Pre-loaded genuine OS & security software'],
    useCases: ['Corporate & Enterprise Deployment', 'Educational Institutions', 'Government & PSU Procurement', 'Retail & SME Bulk Purchase'],
    certifications: ['BIS Compliance', 'ISO 9001'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['Dell', 'HP']
  },
  mobilephone: {
    descriptionTemplate: (name) => `${name} is a quality-tested smartphone engineered for reliable performance, offered with bulk/wholesale pricing and authorized channel support for business buyers.`,
    features: ['Genuine manufacturer warranty', 'Bulk order & channel pricing available', 'Authorized distributor network', 'BIS-compliant certified import'],
    useCases: ['Retail & Wholesale Distribution', 'Corporate Bulk Purchase', 'E-commerce Channel Stocking', 'Telecom Bundling Programs'],
    certifications: ['BIS Compliance', 'IMEI Registered'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    altCompetitors: ['Samsung', 'Apple']
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
  { id: 'atlascopco-ga110', name: 'Atlas Copco GA 110 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 110 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '110 kW (150 HP), VSD', priceRange: '₹16,80,000 onwards', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '95.9 - 332.6 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga132', name: 'Atlas Copco GA 132 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 132 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '132 kW (177 HP), VSD', priceRange: '₹19,60,000 onwards', moq: '1 Piece', deliveryTime: '12-18 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '112.3 - 398.1 l/s'], ['Drive Type', 'VSD']] },
  { id: 'atlascopco-ga160', name: 'Atlas Copco GA 160 VSD+ Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GA 160 VSD+', keySpecLabel: 'Motor Power', keySpecValue: '160 kW (215 HP), VSD', priceRange: '₹23,40,000 onwards', moq: '1 Piece', deliveryTime: '12-20 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', '4 - 13 bar(e)'], ['Capacity FAD', '135.6 - 481.9 l/s'], ['Drive Type', 'VSD']] }
];

const ATLASCOPCO_OTHER: Seed[] = [
  { id: 'atlascopco-piston-compressor', name: 'Atlas Copco Piston Air Compressor', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'AF Series', keySpecLabel: 'Motor Power', keySpecValue: '2 HP - 10 HP', priceRange: '₹22,000 - ₹85,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', 'Up to 10 bar'], ['Tank Capacity', '90 - 500 Litres'], ['Drive Type', 'Belt Driven']] },
  { id: 'atlascopco-vacuum-pump', name: 'Atlas Copco Rotary Vane Vacuum Pump', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'GVS 100', keySpecLabel: 'Pumping Speed', keySpecValue: 'Up to 300 m³/hr', priceRange: '₹1,40,000 - ₹4,20,000', moq: '1 Piece', deliveryTime: '7-12 Days', warranty: '18 Months', extraSpecs: [['Ultimate Vacuum', 'Up to 0.5 mbar'], ['Motor Power', '3 kW - 15 kW'], ['Application', 'Process Vacuum Systems']] },
  { id: 'atlascopco-air-dryer', name: 'Atlas Copco Refrigerant Air Dryer', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'FD 30', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 3000 l/s', priceRange: '₹85,000 - ₹6,50,000', moq: '1 Piece', deliveryTime: '7-14 Days', warranty: '18 Months', extraSpecs: [['Pressure Dew Point', '3°C'], ['Refrigerant', 'R-410A'], ['Application', 'Compressed Air Treatment']] },
  { id: 'atlascopco-nitrogen-generator', name: 'Atlas Copco Nitrogen Generator', brandId: 'atlascopco', brandMCatId: 'atlascopco-compressors', family: 'compressor', modelNumber: 'NGP+ 15', keySpecLabel: 'Purity Level', keySpecValue: 'Up to 99.999%', priceRange: '₹4,80,000 - ₹18,00,000', moq: '1 Set', deliveryTime: '12-20 Days', warranty: '24 Months', extraSpecs: [['Technology', 'PSA (Pressure Swing Adsorption)'], ['Flow Rate', 'Up to 500 Nm³/hr'], ['Application', 'Food Packaging, Electronics, Metal Processing']] }
];

// --- Air Compressors: 9 additional real manufacturers, generated from a shared power
// ladder (real compressor brands genuinely compete model-for-model at the same IEC motor
// ratings) so Category/Compare pages can be reviewed at realistic 10-brand/150-product
// catalog scale rather than the single-brand case they were originally built against.

function formatIndianPrice(n: number): string {
  const s = String(Math.round(n));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  if (!rest) return last3;
  const restFormatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${restFormatted},${last3}`;
}

function hpFromKw(kw: number): number {
  return Math.round(kw * 1.341);
}

// Shared across every new brand below — real screw-compressor manufacturers all size
// their ranges around these same IEC motor frame ratings.
const COMPRESSOR_POWER_LADDER_KW = [5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90];

interface CompressorLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  pricePerKw: number;
  driveType: string;
  deliveryTime: string;
  warranty: string;
}

function makeCompressorLadderSeeds(def: CompressorLadderDef): Seed[] {
  return COMPRESSOR_POWER_LADDER_KW.map((kw) => {
    const hp = hpFromKw(kw);
    const price = Math.round((kw * def.pricePerKw) / 5000) * 5000;
    return {
      id: `${def.idPrefix}-${kw}kw`,
      name: `${def.namePrefix} ${def.modelPrefix}${kw} Rotary Screw Air Compressor`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'compressor',
      modelNumber: `${def.modelPrefix}${kw}`,
      keySpecLabel: 'Motor Power',
      keySpecValue: `${kw} kW (${hp} HP)`,
      priceRange: `₹${formatIndianPrice(price)} onwards`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Working Pressure', '7.5 bar(e) (7 - 13 bar(e) variants available)'],
        ['Capacity FAD', `${(kw * 0.16).toFixed(1)} - ${(kw * 0.19).toFixed(1)} m³/min`],
        ['Drive Type', def.driveType]
      ]
    } as Seed;
  });
}

const INGERSOLLRAND_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'ingersollrand', brandMCatId: 'ingersollrand-compressors', idPrefix: 'ingersollrand-compressor',
  namePrefix: 'Ingersoll Rand R-Series', modelPrefix: 'R', pricePerKw: 15500,
  driveType: 'Fixed Speed (Nirvana VSD variant available)', deliveryTime: '6-12 Days', warranty: '24 Months'
});
const INGERSOLLRAND_OTHER: Seed[] = [
  { id: 'ingersollrand-nirvana-oilfree', name: 'Ingersoll Rand Nirvana Oil-Free Rotary Screw Compressor', brandId: 'ingersollrand', brandMCatId: 'ingersollrand-compressors', family: 'compressor', modelNumber: 'Nirvana N37', keySpecLabel: 'Motor Power', keySpecValue: '15 kW - 160 kW', priceRange: '₹8,50,000 - ₹42,00,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '24 Months', extraSpecs: [['Oil Carryover', '0 ppm (Class 0 Certified)'], ['Working Pressure', '4.5 - 10 bar(e)'], ['Application', 'Pharma, Food & Beverage, Electronics']] },
  { id: 'ingersollrand-refrigerant-dryer', name: 'Ingersoll Rand Refrigerant Air Dryer', brandId: 'ingersollrand', brandMCatId: 'ingersollrand-compressors', family: 'compressor', modelNumber: 'D-EQ Series', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 2800 l/s', priceRange: '₹75,000 - ₹5,80,000', moq: '1 Piece', deliveryTime: '6-12 Days', warranty: '18 Months', extraSpecs: [['Pressure Dew Point', '3°C'], ['Refrigerant', 'R-407C'], ['Application', 'Compressed Air Treatment']] },
  { id: 'ingersollrand-centrifugal', name: 'Ingersoll Rand Centac Centrifugal Compressor', brandId: 'ingersollrand', brandMCatId: 'ingersollrand-compressors', family: 'compressor', modelNumber: 'Centac C', keySpecLabel: 'Motor Power', keySpecValue: '150 kW - 1500 kW', priceRange: '₹45,00,000 onwards', moq: '1 Set', deliveryTime: '25-40 Days', warranty: '24 Months', extraSpecs: [['Working Pressure', 'Up to 13 bar(e)'], ['Cooling', 'Oil-Free, Water/Air Cooled'], ['Application', 'Large Continuous-Duty Industrial Plants']] }
];

const ELGI_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'elgi', brandMCatId: 'elgi-compressors', idPrefix: 'elgi-compressor',
  namePrefix: 'ELGi', modelPrefix: 'AB', pricePerKw: 14000,
  driveType: 'Fixed Speed (VSD variant available)', deliveryTime: '4-9 Days', warranty: '24 Months'
});
const ELGI_OTHER: Seed[] = [
  { id: 'elgi-reciprocating', name: 'ELGi Reciprocating Air Compressor', brandId: 'elgi', brandMCatId: 'elgi-compressors', family: 'compressor', modelNumber: 'LG Series', keySpecLabel: 'Motor Power', keySpecValue: '1 HP - 15 HP', priceRange: '₹18,000 - ₹1,20,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', 'Up to 10 bar'], ['Tank Capacity', '75 - 500 Litres'], ['Drive Type', 'Belt Driven']] },
  { id: 'elgi-oilfree-screw', name: 'ELGi Oil-Free Rotary Screw Compressor', brandId: 'elgi', brandMCatId: 'elgi-compressors', family: 'compressor', modelNumber: 'OFS Series', keySpecLabel: 'Motor Power', keySpecValue: '18.5 kW - 132 kW', priceRange: '₹9,20,000 - ₹38,50,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '24 Months', extraSpecs: [['Oil Carryover', '0 ppm (Class 0 Certified)'], ['Working Pressure', '4.5 - 8.5 bar(e)'], ['Application', 'Pharma, Food & Beverage']] },
  { id: 'elgi-refrigerant-dryer', name: 'ELGi Refrigerant Air Dryer', brandId: 'elgi', brandMCatId: 'elgi-compressors', family: 'compressor', modelNumber: 'EGRD Series', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 2500 l/s', priceRange: '₹65,000 - ₹5,20,000', moq: '1 Piece', deliveryTime: '5-10 Days', warranty: '18 Months', extraSpecs: [['Pressure Dew Point', '3°C'], ['Refrigerant', 'R-410A'], ['Application', 'Compressed Air Treatment']] }
];

const KAESER_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'kaeser', brandMCatId: 'kaeser-compressors', idPrefix: 'kaeser-compressor',
  namePrefix: 'Kaeser', modelPrefix: 'SM', pricePerKw: 16800,
  driveType: 'Fixed Speed (Sigma Control 2 VSD variant available)', deliveryTime: '8-14 Days', warranty: '24 Months'
});
const KAESER_OTHER: Seed[] = [
  { id: 'kaeser-rotary-lobe-blower', name: 'Kaeser Rotary Lobe Blower', brandId: 'kaeser', brandMCatId: 'kaeser-compressors', family: 'compressor', modelNumber: 'Omega Series', keySpecLabel: 'Motor Power', keySpecValue: '5.5 kW - 75 kW', priceRange: '₹3,80,000 - ₹22,00,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '18 Months', extraSpecs: [['Flow Rate', 'Up to 100 m³/min'], ['Pressure Differential', 'Up to 1000 mbar'], ['Application', 'Water Treatment, Pneumatic Conveying']] },
  { id: 'kaeser-refrigerant-dryer', name: 'Kaeser Secotec Refrigerant Dryer', brandId: 'kaeser', brandMCatId: 'kaeser-compressors', family: 'compressor', modelNumber: 'Secotec TC', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 2400 l/s', priceRange: '₹95,000 - ₹6,20,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Pressure Dew Point', '3°C'], ['Refrigerant', 'R-513A'], ['Application', 'Compressed Air Treatment']] },
  { id: 'kaeser-air-filter', name: 'Kaeser Compressed Air Filter', brandId: 'kaeser', brandMCatId: 'kaeser-compressors', family: 'compressor', modelNumber: 'FE/FF Series', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 3000 l/s', priceRange: '₹18,000 - ₹1,40,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '12 Months', extraSpecs: [['Filtration Grade', 'Up to 0.01 micron'], ['Residual Oil Content', '0.01 mg/m³'], ['Application', 'Compressed Air Quality Assurance']] }
];

const KIRLOSKARPNEUMATIC_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'kirloskarpneumatic', brandMCatId: 'kirloskarpneumatic-compressors', idPrefix: 'kirloskarpneumatic-compressor',
  namePrefix: 'Kirloskar Pneumatic', modelPrefix: 'KC', pricePerKw: 13200,
  driveType: 'Fixed Speed (VSD variant available)', deliveryTime: '6-12 Days', warranty: '18 Months'
});
const KIRLOSKARPNEUMATIC_OTHER: Seed[] = [
  { id: 'kirloskarpneumatic-reciprocating', name: 'Kirloskar Pneumatic Reciprocating Air Compressor', brandId: 'kirloskarpneumatic', brandMCatId: 'kirloskarpneumatic-compressors', family: 'compressor', modelNumber: 'KG Series', keySpecLabel: 'Motor Power', keySpecValue: '5 HP - 60 HP', priceRange: '₹45,000 - ₹3,80,000', moq: '1 Piece', deliveryTime: '6-12 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', 'Up to 12 bar'], ['Configuration', 'V-Type / W-Type'], ['Application', 'Refrigeration, Process Industry']] },
  { id: 'kirloskarpneumatic-gas-compressor', name: 'Kirloskar Pneumatic Gas Compressor', brandId: 'kirloskarpneumatic', brandMCatId: 'kirloskarpneumatic-compressors', family: 'compressor', modelNumber: 'GC Series', keySpecLabel: 'Motor Power', keySpecValue: '20 HP - 200 HP', priceRange: '₹6,50,000 - ₹48,00,000', moq: '1 Set', deliveryTime: '20-30 Days', warranty: '24 Months', extraSpecs: [['Gas Handled', 'Natural Gas, CNG, Process Gas'], ['Working Pressure', 'Up to 350 bar'], ['Application', 'CNG Stations, Process Gas Industry']] },
  { id: 'kirloskarpneumatic-railway-brake', name: 'Kirloskar Pneumatic Railway Air Brake Compressor', brandId: 'kirloskarpneumatic', brandMCatId: 'kirloskarpneumatic-compressors', family: 'compressor', modelNumber: 'RB Series', keySpecLabel: 'Motor Power', keySpecValue: '15 HP - 40 HP', priceRange: '₹3,20,000 - ₹9,80,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '24 Months', extraSpecs: [['Compliance', 'RDSO Approved'], ['Working Pressure', 'Up to 10 kg/cm²'], ['Application', 'Locomotives & Rolling Stock']] }
];

const DOOSAN_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'doosan', brandMCatId: 'doosan-compressors', idPrefix: 'doosan-compressor',
  namePrefix: 'Doosan Portable Power', modelPrefix: 'XHP', pricePerKw: 11000,
  driveType: 'Diesel Engine Driven, Portable Chassis', deliveryTime: '10-18 Days', warranty: '12 Months'
});
const DOOSAN_OTHER: Seed[] = [
  { id: 'doosan-towable-diesel', name: 'Doosan Towable Diesel Air Compressor', brandId: 'doosan', brandMCatId: 'doosan-compressors', family: 'compressor', modelNumber: 'HP Series', keySpecLabel: 'Delivery Capacity', keySpecValue: '185 CFM - 400 CFM', priceRange: '₹6,80,000 - ₹18,50,000', moq: '1 Set', deliveryTime: '12-20 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', '7 - 24 bar'], ['Chassis', 'Single-Axle Towable'], ['Application', 'Construction Sites, Field Service']] },
  { id: 'doosan-screw-portable', name: 'Doosan Screw-Type Portable Compressor', brandId: 'doosan', brandMCatId: 'doosan-compressors', family: 'compressor', modelNumber: 'XHP Series Large', keySpecLabel: 'Delivery Capacity', keySpecValue: '600 CFM - 1600 CFM', priceRange: '₹22,00,000 - ₹68,00,000', moq: '1 Set', deliveryTime: '20-35 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', '17 - 24 bar'], ['Application', 'Mining, Well Drilling'], ['Engine', 'Turbocharged Diesel']] },
  { id: 'doosan-genset-compressor', name: 'Doosan Generator-Compressor Combo Unit', brandId: 'doosan', brandMCatId: 'doosan-compressors', family: 'compressor', modelNumber: 'G-Series Combo', keySpecLabel: 'Delivery Capacity', keySpecValue: '210 CFM + 20 kVA', priceRange: '₹12,50,000 - ₹24,00,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', 'Up to 10 bar'], ['Power Output', '20 kVA Auxiliary'], ['Application', 'Remote Field Sites']] }
];

const BOGE_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'boge', brandMCatId: 'boge-compressors', idPrefix: 'boge-compressor',
  namePrefix: 'Boge', modelPrefix: 'S-', pricePerKw: 15200,
  driveType: 'Fixed Speed (VSD variant available)', deliveryTime: '10-18 Days', warranty: '24 Months'
});
const BOGE_OTHER: Seed[] = [
  { id: 'boge-oilfree-scroll', name: 'Boge Oil-Free Scroll Compressor', brandId: 'boge', brandMCatId: 'boge-compressors', family: 'compressor', modelNumber: 'SO Series', keySpecLabel: 'Motor Power', keySpecValue: '2.2 kW - 22 kW', priceRange: '₹3,20,000 - ₹14,50,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '18 Months', extraSpecs: [['Oil Carryover', '0 ppm (Class 0 Certified)'], ['Working Pressure', 'Up to 10 bar'], ['Application', 'Laboratories, Electronics, Pharma']] },
  { id: 'boge-refrigerant-dryer', name: 'Boge Refrigerant Dryer', brandId: 'boge', brandMCatId: 'boge-compressors', family: 'compressor', modelNumber: 'DS Series', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 2200 l/s', priceRange: '₹85,000 - ₹5,60,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Pressure Dew Point', '3°C'], ['Refrigerant', 'R-513A'], ['Application', 'Compressed Air Treatment']] },
  { id: 'boge-condensate-drain', name: 'Boge Condensate Drain & Oil-Water Separator', brandId: 'boge', brandMCatId: 'boge-compressors', family: 'compressor', modelNumber: 'CU Series', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 1500 l/s', priceRange: '₹22,000 - ₹1,80,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '12 Months', extraSpecs: [['Separation Efficiency', 'Outlet < 20 mg/l'], ['Drain Type', 'Zero-Loss Electronic'], ['Application', 'Compressed Air Condensate Management']] }
];

const SULLAIR_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'sullair', brandMCatId: 'sullair-compressors', idPrefix: 'sullair-compressor',
  namePrefix: 'Sullair', modelPrefix: 'LS', pricePerKw: 12800,
  driveType: 'Fixed Speed (VSD variant available)', deliveryTime: '8-15 Days', warranty: '18 Months'
});
const SULLAIR_OTHER: Seed[] = [
  { id: 'sullair-portable-diesel', name: 'Sullair Portable Diesel Screw Compressor', brandId: 'sullair', brandMCatId: 'sullair-compressors', family: 'compressor', modelNumber: 'Sullair 375', keySpecLabel: 'Delivery Capacity', keySpecValue: '185 CFM - 375 CFM', priceRange: '₹7,20,000 - ₹16,80,000', moq: '1 Set', deliveryTime: '15-22 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', '7 - 24 bar'], ['Chassis', 'Towable / Skid Mounted'], ['Application', 'Construction, Mining']] },
  { id: 'sullair-air-receiver', name: 'Sullair Air Receiver Tank', brandId: 'sullair', brandMCatId: 'sullair-compressors', family: 'compressor', modelNumber: 'AR Series', keySpecLabel: 'Storage Capacity', keySpecValue: '500 - 10,000 Litres', priceRange: '₹65,000 - ₹8,50,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '24 Months', extraSpecs: [['Design Pressure', 'Up to 13 bar'], ['Material', 'Carbon Steel, IBR Compliant'], ['Application', 'Compressed Air Storage & Surge Control']] },
  { id: 'sullair-refrigerant-dryer', name: 'Sullair Refrigerant Air Dryer', brandId: 'sullair', brandMCatId: 'sullair-compressors', family: 'compressor', modelNumber: 'SRD Series', keySpecLabel: 'Flow Capacity', keySpecValue: 'Up to 2000 l/s', priceRange: '₹70,000 - ₹4,80,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Pressure Dew Point', '3°C'], ['Refrigerant', 'R-407C'], ['Application', 'Compressed Air Treatment']] }
];

const CHICAGOPNEUMATIC_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'chicagopneumatic', brandMCatId: 'chicagopneumatic-compressors', idPrefix: 'chicagopneumatic-compressor',
  namePrefix: 'Chicago Pneumatic', modelPrefix: 'CPVSD', pricePerKw: 10500,
  driveType: 'Fixed Speed (VSD variant available)', deliveryTime: '5-10 Days', warranty: '12 Months'
});
const CHICAGOPNEUMATIC_OTHER: Seed[] = [
  { id: 'chicagopneumatic-piston', name: 'Chicago Pneumatic Piston Air Compressor', brandId: 'chicagopneumatic', brandMCatId: 'chicagopneumatic-compressors', family: 'compressor', modelNumber: 'CPFP Series', keySpecLabel: 'Motor Power', keySpecValue: '1 HP - 10 HP', priceRange: '₹15,000 - ₹68,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Working Pressure', 'Up to 10 bar'], ['Tank Capacity', '50 - 300 Litres'], ['Drive Type', 'Belt Driven']] },
  { id: 'chicagopneumatic-tool-kit', name: 'Chicago Pneumatic Industrial Tool Kit', brandId: 'chicagopneumatic', brandMCatId: 'chicagopneumatic-compressors', family: 'compressor', modelNumber: 'CP Tool Set', keySpecLabel: 'Kit Contents', keySpecValue: 'Impact Wrench, Grinder, Drill, Ratchet', priceRange: '₹28,000 - ₹95,000', moq: '1 Set', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Air Consumption', '4 - 6 CFM per tool'], ['Working Pressure', '6.3 bar'], ['Application', 'Workshop & Assembly Line Use']] },
  { id: 'chicagopneumatic-air-receiver', name: 'Chicago Pneumatic Air Receiver Tank', brandId: 'chicagopneumatic', brandMCatId: 'chicagopneumatic-compressors', family: 'compressor', modelNumber: 'CPT Series', keySpecLabel: 'Storage Capacity', keySpecValue: '300 - 5,000 Litres', priceRange: '₹28,000 - ₹3,80,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '18 Months', extraSpecs: [['Design Pressure', 'Up to 11 bar'], ['Material', 'Carbon Steel, IBR Compliant'], ['Application', 'Compressed Air Storage & Surge Control']] }
];

const MATTEI_COMPRESSORS: Seed[] = makeCompressorLadderSeeds({
  brandId: 'mattei', brandMCatId: 'mattei-compressors', idPrefix: 'mattei-compressor',
  namePrefix: 'Mattei', modelPrefix: 'MV', pricePerKw: 17500,
  driveType: 'Rotary Vane, Oil-Lubricated', deliveryTime: '10-18 Days', warranty: '36 Months'
});
const MATTEI_OTHER: Seed[] = [
  { id: 'mattei-oilfree-vane', name: 'Mattei Blue Oil-Free Rotary Vane Compressor', brandId: 'mattei', brandMCatId: 'mattei-compressors', family: 'compressor', modelNumber: 'Blue Series', keySpecLabel: 'Motor Power', keySpecValue: '7.5 kW - 55 kW', priceRange: '₹6,80,000 - ₹32,00,000', moq: '1 Piece', deliveryTime: '12-20 Days', warranty: '36 Months', extraSpecs: [['Oil Carryover', '0 ppm (Class 0 Certified)'], ['Working Pressure', 'Up to 10 bar'], ['Application', 'Food & Beverage, Pharma']] },
  { id: 'mattei-vane-spares', name: 'Mattei Vane Element Service Kit', brandId: 'mattei', brandMCatId: 'mattei-compressors', family: 'compressor', modelNumber: 'Vane Kit', keySpecLabel: 'Compatibility', keySpecValue: 'All Mattei Rotary Vane Models', priceRange: '₹12,000 - ₹45,000', moq: '1 Set', deliveryTime: '7-14 Days', warranty: '6 Months', extraSpecs: [['Rated Service Life', 'Up to 40,000 Hours'], ['Material', 'Reinforced Composite Vanes'], ['Application', 'Scheduled Maintenance']] },
  { id: 'mattei-vacuum-pump', name: 'Mattei Rotary Vane Vacuum Pump', brandId: 'mattei', brandMCatId: 'mattei-compressors', family: 'compressor', modelNumber: 'MV Vac Series', keySpecLabel: 'Pumping Speed', keySpecValue: 'Up to 250 m³/hr', priceRange: '₹1,60,000 - ₹4,50,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '24 Months', extraSpecs: [['Ultimate Vacuum', 'Up to 0.8 mbar'], ['Motor Power', '4 kW - 18 kW'], ['Application', 'Process Vacuum Systems']] }
];

// Shared across pump brands — real centrifugal/submersible pump ranges in India are sized
// around these same standard motor HP ratings.
const PUMP_POWER_LADDER_HP = [1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50];

function kwFromHp(hp: number): number {
  return Math.round(hp * 0.746 * 10) / 10;
}

interface PumpLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  pumpTypeName: string;
  pricePerHp: number;
  deliveryTime: string;
  warranty: string;
  count?: number;
}

function makePumpLadderSeeds(def: PumpLadderDef): Seed[] {
  const ladder = PUMP_POWER_LADDER_HP.slice(0, def.count ?? PUMP_POWER_LADDER_HP.length);
  return ladder.map((hp) => {
    const kw = kwFromHp(hp);
    const price = Math.round((hp * def.pricePerHp) / 500) * 500;
    const flow = Math.round(hp * 8);
    const head = Math.round(20 + hp * 1.6);
    return {
      id: `${def.idPrefix}-${hp}hp`,
      name: `${def.namePrefix} ${def.modelPrefix}${hp} ${def.pumpTypeName}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'pump',
      modelNumber: `${def.modelPrefix}${hp}`,
      keySpecLabel: 'Rated Power',
      keySpecValue: `${hp} HP (${kw} kW)`,
      priceRange: `₹${formatIndianPrice(price)} onwards`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Flow Rate', `Up to ${flow} m³/hr`],
        ['Head Range', `Up to ${head} meters`],
        ['Material', 'Cast Iron / Stainless Steel Options']
      ]
    } as Seed;
  });
}

const KIRLOSKAR_PUMPS_LADDER: Seed[] = makePumpLadderSeeds({
  brandId: 'kirloskar', brandMCatId: 'kirloskar-pumps', idPrefix: 'kirloskar-pump-ladder',
  namePrefix: 'Kirloskar', modelPrefix: 'KP-', pumpTypeName: 'Centrifugal End Suction Pump',
  pricePerHp: 4200, deliveryTime: '3-6 Days', warranty: '12 Months', count: 9
});

const KSB_PUMPS_LADDER: Seed[] = makePumpLadderSeeds({
  brandId: 'ksb', brandMCatId: 'ksb-pumps', idPrefix: 'ksb-pump-ladder',
  namePrefix: 'KSB', modelPrefix: 'Etanorm-', pumpTypeName: 'Standardized Centrifugal Pump',
  pricePerHp: 5400, deliveryTime: '4-8 Days', warranty: '18 Months', count: 7
});

const CROMPTON_PUMPS_LADDER: Seed[] = makePumpLadderSeeds({
  brandId: 'crompton', brandMCatId: 'crompton-pumps', idPrefix: 'crompton-pump-ladder',
  namePrefix: 'Crompton', modelPrefix: 'CP-', pumpTypeName: 'Centrifugal Pump',
  pricePerHp: 3200, deliveryTime: '3-6 Days', warranty: '12 Months', count: 11
});

const GRUNDFOS_PUMPS: Seed[] = makePumpLadderSeeds({
  brandId: 'grundfos', brandMCatId: 'grundfos-pumps', idPrefix: 'grundfos-pump',
  namePrefix: 'Grundfos', modelPrefix: 'CR', pumpTypeName: 'Vertical Multistage Centrifugal Pump',
  pricePerHp: 7200, deliveryTime: '5-10 Days', warranty: '24 Months'
});
const GRUNDFOS_OTHER: Seed[] = [
  { id: 'grundfos-sp-submersible', name: 'Grundfos SP Submersible Borewell Pump', brandId: 'grundfos', brandMCatId: 'grundfos-pumps', family: 'pump', modelNumber: 'SP 8A-15', keySpecLabel: 'Rated Power', keySpecValue: '3 HP - 40 HP', priceRange: '₹32,000 - ₹2,85,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '24 Months', extraSpecs: [['Well Diameter', '6 inches - 8 inches'], ['Head Range', 'Up to 220 meters'], ['Material', 'Stainless Steel AISI 904L']] },
  { id: 'grundfos-hydro-mpc-booster', name: 'Grundfos Hydro MPC Booster Set', brandId: 'grundfos', brandMCatId: 'grundfos-pumps', family: 'pump', modelNumber: 'Hydro MPC-E', keySpecLabel: 'Rated Power', keySpecValue: '2 x 5 HP - 6 x 50 HP', priceRange: '₹3,80,000 - ₹22,00,000', moq: '1 Set', deliveryTime: '12-20 Days', warranty: '24 Months', extraSpecs: [['Control', 'Integrated PLC + VFD'], ['Application', 'Water Supply Booster Systems'], ['Material', 'Stainless Steel Manifold']] },
  { id: 'grundfos-unilift-drainage', name: 'Grundfos Unilift Drainage Pump', brandId: 'grundfos', brandMCatId: 'grundfos-pumps', family: 'pump', modelNumber: 'Unilift KP 350', keySpecLabel: 'Rated Power', keySpecValue: '0.35 HP - 2 HP', priceRange: '₹9,500 - ₹32,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '18 Months', extraSpecs: [['Solid Handling', 'Up to 10mm'], ['Discharge Size', '32mm - 50mm'], ['Material', 'Stainless Steel / Composite']] }
];

const FLOWSERVE_PUMPS: Seed[] = makePumpLadderSeeds({
  brandId: 'flowserve', brandMCatId: 'flowserve-pumps', idPrefix: 'flowserve-pump',
  namePrefix: 'Flowserve', modelPrefix: 'DVS', pumpTypeName: 'Process Centrifugal Pump',
  pricePerHp: 8100, deliveryTime: '8-14 Days', warranty: '18 Months'
});
const FLOWSERVE_OTHER: Seed[] = [
  { id: 'flowserve-durco-process', name: 'Flowserve Durco Mark 3 Process Pump', brandId: 'flowserve', brandMCatId: 'flowserve-pumps', family: 'pump', modelNumber: 'Durco Mark 3', keySpecLabel: 'Rated Power', keySpecValue: '10 HP - 200 HP', priceRange: '₹2,10,000 - ₹18,50,000', moq: '1 Piece', deliveryTime: '15-25 Days', warranty: '18 Months', extraSpecs: [['Max Temperature', 'Up to 400°C'], ['Application', 'Chemical & Petrochemical Process'], ['Material', 'Alloy Steel / Duplex SS']] },
  { id: 'flowserve-worthington-api', name: 'Flowserve Worthington API 610 Pump', brandId: 'flowserve', brandMCatId: 'flowserve-pumps', family: 'pump', modelNumber: 'API-610 BB2', keySpecLabel: 'Rated Power', keySpecValue: '50 HP - 500 HP', priceRange: '₹8,50,000 - ₹65,00,000', moq: '1 Set', deliveryTime: '25-40 Days', warranty: '24 Months', extraSpecs: [['Compliance', 'API 610 11th Edition'], ['Application', 'Refinery & Petrochemical'], ['Material', 'Cast Steel / Stainless Steel']] },
  { id: 'flowserve-idp-endsuction', name: 'Flowserve IDP End Suction Pump', brandId: 'flowserve', brandMCatId: 'flowserve-pumps', family: 'pump', modelNumber: 'IDP-3196', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 75 HP', priceRange: '₹95,000 - ₹6,80,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '18 Months', extraSpecs: [['Flow Rate', 'Up to 500 m³/hr'], ['Application', 'Industrial Process & Utility'], ['Material', 'Cast Iron / Ductile Iron']] }
];

const SULZER_PUMPS: Seed[] = makePumpLadderSeeds({
  brandId: 'sulzer', brandMCatId: 'sulzer-pumps', idPrefix: 'sulzer-pump',
  namePrefix: 'Sulzer', modelPrefix: 'AHLSTAR-', pumpTypeName: 'Process Pump',
  pricePerHp: 7800, deliveryTime: '10-16 Days', warranty: '18 Months'
});
const SULZER_OTHER: Seed[] = [
  { id: 'sulzer-app-submersible', name: 'Sulzer APP Submersible Wastewater Pump', brandId: 'sulzer', brandMCatId: 'sulzer-pumps', family: 'pump', modelNumber: 'APP 15', keySpecLabel: 'Rated Power', keySpecValue: '3 HP - 60 HP', priceRange: '₹85,000 - ₹6,20,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '18 Months', extraSpecs: [['Solid Handling', 'Up to 80mm'], ['Application', 'Wastewater & Sewage'], ['Material', 'Cast Iron / Hard Iron']] },
  { id: 'sulzer-hzb-vertical-turbine', name: 'Sulzer HZB Vertical Turbine Pump', brandId: 'sulzer', brandMCatId: 'sulzer-pumps', family: 'pump', modelNumber: 'HZB Series', keySpecLabel: 'Rated Power', keySpecValue: '20 HP - 250 HP', priceRange: '₹4,50,000 - ₹28,00,000', moq: '1 Set', deliveryTime: '20-30 Days', warranty: '24 Months', extraSpecs: [['Well Diameter', '12 inches - 24 inches'], ['Application', 'Water Intake & Flood Control'], ['Material', 'Stainless Steel / Bronze']] },
  { id: 'sulzer-mixer-agitator', name: 'Sulzer Submersible Mixer & Agitator', brandId: 'sulzer', brandMCatId: 'sulzer-pumps', family: 'pump', modelNumber: 'XRW Mixer', keySpecLabel: 'Rated Power', keySpecValue: '2 HP - 25 HP', priceRange: '₹1,20,000 - ₹8,50,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '18 Months', extraSpecs: [['Application', 'Wastewater Treatment Mixing'], ['Propeller Material', 'Stainless Steel'], ['Mounting', 'Submersible Guide Rail']] }
];

const WILO_PUMPS: Seed[] = makePumpLadderSeeds({
  brandId: 'wilo', brandMCatId: 'wilo-pumps', idPrefix: 'wilo-pump',
  namePrefix: 'Wilo', modelPrefix: 'Stratos-', pumpTypeName: 'Circulator Pump',
  pricePerHp: 6500, deliveryTime: '6-12 Days', warranty: '24 Months'
});
const WILO_OTHER: Seed[] = [
  { id: 'wilo-emu-submersible', name: 'Wilo-EMU Submersible Sewage Pump', brandId: 'wilo', brandMCatId: 'wilo-pumps', family: 'pump', modelNumber: 'EMU FA', keySpecLabel: 'Rated Power', keySpecValue: '2 HP - 50 HP', priceRange: '₹75,000 - ₹5,80,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '24 Months', extraSpecs: [['Solid Handling', 'Up to 90mm'], ['Application', 'Municipal Sewage & Wastewater'], ['Material', 'Cast Iron / Stainless Steel']] },
  { id: 'wilo-booster-set', name: 'Wilo-Economy Booster Set', brandId: 'wilo', brandMCatId: 'wilo-pumps', family: 'pump', modelNumber: 'CO-Economy', keySpecLabel: 'Rated Power', keySpecValue: '2 x 3 HP - 4 x 30 HP', priceRange: '₹2,20,000 - ₹12,50,000', moq: '1 Set', deliveryTime: '10-18 Days', warranty: '24 Months', extraSpecs: [['Control', 'Integrated Controller'], ['Application', 'Building Water Supply Boosting'], ['Material', 'Stainless Steel Manifold']] },
  { id: 'wilo-drain-tmw', name: 'Wilo-Drain TMW Submersible Drainage Pump', brandId: 'wilo', brandMCatId: 'wilo-pumps', family: 'pump', modelNumber: 'TMW 32', keySpecLabel: 'Rated Power', keySpecValue: '0.5 HP - 2 HP', priceRange: '₹8,500 - ₹28,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '18 Months', extraSpecs: [['Solid Handling', 'Up to 10mm'], ['Discharge Size', '32mm'], ['Material', 'Stainless Steel']] }
];

const CRIPUMPS_PUMPS: Seed[] = makePumpLadderSeeds({
  brandId: 'cripumps', brandMCatId: 'cripumps-pumps', idPrefix: 'cripumps-pump',
  namePrefix: 'CRI', modelPrefix: 'CSJ-', pumpTypeName: 'Submersible Borewell Pump',
  pricePerHp: 3000, deliveryTime: '3-6 Days', warranty: '12 Months'
});
const CRIPUMPS_OTHER: Seed[] = [
  { id: 'cripumps-solar-submersible', name: 'CRI Solar Submersible Pump System', brandId: 'cripumps', brandMCatId: 'cripumps-pumps', family: 'pump', modelNumber: 'CRI Solar SS', keySpecLabel: 'Rated Power', keySpecValue: '1 HP - 10 HP', priceRange: '₹65,000 - ₹4,20,000', moq: '1 Set', deliveryTime: '7-14 Days', warranty: '60 Months', extraSpecs: [['Power Source', 'Solar PV Array'], ['Application', 'Agricultural Irrigation'], ['Material', 'Stainless Steel']] },
  { id: 'cripumps-openwell', name: 'CRI Openwell Submersible Pump', brandId: 'cripumps', brandMCatId: 'cripumps-pumps', family: 'pump', modelNumber: 'COW Series', keySpecLabel: 'Rated Power', keySpecValue: '1 HP - 12.5 HP', priceRange: '₹5,800 - ₹52,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Discharge Size', '32mm - 50mm'], ['Head Range', 'Up to 42 meters'], ['Material', 'Stainless Steel Body']] },
  { id: 'cripumps-pressure-booster', name: 'CRI Pressure Booster Pump', brandId: 'cripumps', brandMCatId: 'cripumps-pumps', family: 'pump', modelNumber: 'Aqua Booster', keySpecLabel: 'Rated Power', keySpecValue: '0.5 HP - 3 HP', priceRange: '₹4,200 - ₹16,500', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Application', 'Domestic Water Pressure Boosting'], ['Discharge Size', '25mm'], ['Material', 'Engineering Plastic / SS']] }
];

const TEXMO_PUMPS: Seed[] = makePumpLadderSeeds({
  brandId: 'texmo', brandMCatId: 'texmo-pumps', idPrefix: 'texmo-pump',
  namePrefix: 'Texmo', modelPrefix: 'TSS-', pumpTypeName: 'Submersible Pump',
  pricePerHp: 2900, deliveryTime: '3-6 Days', warranty: '12 Months'
});
const TEXMO_OTHER: Seed[] = [
  { id: 'texmo-agri-submersible', name: 'Texmo Agricultural Submersible Pump Set', brandId: 'texmo', brandMCatId: 'texmo-pumps', family: 'pump', modelNumber: 'Texmo Agri-5', keySpecLabel: 'Rated Power', keySpecValue: '3 HP - 20 HP', priceRange: '₹14,500 - ₹85,000', moq: '1 Piece', deliveryTime: '3-7 Days', warranty: '12 Months', extraSpecs: [['Well Diameter', '6 inches - 8 inches'], ['Head Range', 'Up to 90 meters'], ['Material', 'Stainless Steel']] },
  { id: 'texmo-monoblock-domestic', name: 'Texmo Monoblock Domestic Pump', brandId: 'texmo', brandMCatId: 'texmo-pumps', family: 'pump', modelNumber: 'Texmo Mono-1', keySpecLabel: 'Rated Power', keySpecValue: '0.5 HP - 2 HP', priceRange: '₹2,800 - ₹8,500', moq: '1 Piece', deliveryTime: '2-4 Days', warranty: '12 Months', extraSpecs: [['Discharge Size', '25mm'], ['Head Range', 'Up to 25 meters'], ['Material', 'Cast Iron']] },
  { id: 'texmo-firefighting-set', name: 'Texmo Fire Fighting Pump Set', brandId: 'texmo', brandMCatId: 'texmo-pumps', family: 'pump', modelNumber: 'Texmo FF-500', keySpecLabel: 'Rated Power', keySpecValue: '15 HP - 75 HP', priceRange: '₹1,25,000 - ₹4,80,000', moq: '1 Set', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Compliance', 'TAC Approved'], ['Flow Rate', 'Up to 2280 LPM'], ['Pressure', 'Up to 8.5 kg/cm²']] }
];

const WPIL_PUMPS: Seed[] = makePumpLadderSeeds({
  brandId: 'wpil', brandMCatId: 'wpil-pumps', idPrefix: 'wpil-pump',
  namePrefix: 'WPIL', modelPrefix: 'WVT-', pumpTypeName: 'Vertical Turbine Pump',
  pricePerHp: 6900, deliveryTime: '12-20 Days', warranty: '18 Months'
});
const WPIL_OTHER: Seed[] = [
  { id: 'wpil-mixflo-axial', name: 'WPIL Mixflo Axial Flow Pump', brandId: 'wpil', brandMCatId: 'wpil-pumps', family: 'pump', modelNumber: 'Mixflo AX', keySpecLabel: 'Rated Power', keySpecValue: '20 HP - 300 HP', priceRange: '₹5,80,000 - ₹32,00,000', moq: '1 Set', deliveryTime: '20-30 Days', warranty: '18 Months', extraSpecs: [['Flow Rate', 'Up to 12,000 m³/hr'], ['Application', 'Irrigation & Flood Control'], ['Material', 'Cast Iron / Bronze Fitted']] },
  { id: 'wpil-firefighting-package', name: 'WPIL Fire Fighting Pump Package', brandId: 'wpil', brandMCatId: 'wpil-pumps', family: 'pump', modelNumber: 'FF Package', keySpecLabel: 'Rated Power', keySpecValue: '25 HP - 150 HP', priceRange: '₹2,80,000 - ₹9,80,000', moq: '1 Set', deliveryTime: '12-20 Days', warranty: '18 Months', extraSpecs: [['Compliance', 'TAC / NFPA 20'], ['Flow Rate', 'Up to 4550 LPM'], ['Pressure', 'Up to 12 kg/cm²']] },
  { id: 'wpil-sewage-nonclog', name: 'WPIL Non-Clog Sewage Pump', brandId: 'wpil', brandMCatId: 'wpil-pumps', family: 'pump', modelNumber: 'Non-Clog NC', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 100 HP', priceRange: '₹1,45,000 - ₹8,50,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '18 Months', extraSpecs: [['Solid Handling', 'Up to 100mm'], ['Application', 'Municipal & Industrial Sewage'], ['Material', 'Cast Iron / SS Impeller']] }
];

// Shared across valve brands — real industrial gate/globe/butterfly/ball valve ranges are
// sized around these standard nominal-bore (DN, mm) ratings.
const VALVE_DN_LADDER = [15, 25, 40, 50, 65, 80, 100, 150, 200, 250, 300, 400];

interface ValveLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  valveTypeName: string;
  pricePerDn: number;
  deliveryTime: string;
  warranty: string;
  pressureRating: string;
  bodyMaterial: string;
  endConnection: string;
  count?: number;
}

function makeValveLadderSeeds(def: ValveLadderDef): Seed[] {
  const ladder = VALVE_DN_LADDER.slice(0, def.count ?? VALVE_DN_LADDER.length);
  return ladder.map((dn) => {
    const price = Math.round((dn * def.pricePerDn) / 500) * 500;
    return {
      id: `${def.idPrefix}-dn${dn}`,
      name: `${def.namePrefix} ${def.modelPrefix}${dn} ${def.valveTypeName}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'valve',
      modelNumber: `${def.modelPrefix}${dn}`,
      keySpecLabel: 'Nominal Size',
      keySpecValue: `DN${dn}`,
      priceRange: `₹${formatIndianPrice(price)} onwards`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Pressure Rating', def.pressureRating],
        ['Body Material', def.bodyMaterial],
        ['End Connection', def.endConnection]
      ]
    } as Seed;
  });
}

const KIRLOSKAR_VALVES_LADDER: Seed[] = makeValveLadderSeeds({
  brandId: 'kirloskar', brandMCatId: 'kirloskar-valves', idPrefix: 'kirloskar-valve-ladder',
  namePrefix: 'Kirloskar', modelPrefix: 'KV-', valveTypeName: 'Gate Valve',
  pricePerDn: 380, deliveryTime: '3-6 Days', warranty: '12 Months',
  pressureRating: 'PN 10 / PN 16', bodyMaterial: 'Cast Iron / Ductile Iron', endConnection: 'Flanged', count: 11
});

const KSB_VALVES_LADDER: Seed[] = makeValveLadderSeeds({
  brandId: 'ksb', brandMCatId: 'ksb-valves', idPrefix: 'ksb-valve-ladder',
  namePrefix: 'KSB', modelPrefix: 'BOA-', valveTypeName: 'Butterfly Valve',
  pricePerDn: 420, deliveryTime: '4-8 Days', warranty: '18 Months',
  pressureRating: 'PN 16', bodyMaterial: 'Ductile Iron / Stainless Steel', endConnection: 'Wafer / Flanged', count: 9
});

const LTVALVES_VALVES: Seed[] = makeValveLadderSeeds({
  brandId: 'ltvalves', brandMCatId: 'ltvalves-valves', idPrefix: 'ltvalves-valve',
  namePrefix: 'L&T', modelPrefix: 'LTV-', valveTypeName: 'Gate Valve',
  pricePerDn: 650, deliveryTime: '6-12 Days', warranty: '18 Months',
  pressureRating: 'PN 16 / PN 25', bodyMaterial: 'Cast Steel / Stainless Steel', endConnection: 'Flanged / Butt-Weld'
});
const LTVALVES_OTHER: Seed[] = [
  { id: 'ltvalves-ball-valve', name: 'L&T Trunnion Mounted Ball Valve', brandId: 'ltvalves', brandMCatId: 'ltvalves-valves', family: 'valve', modelNumber: 'LTV-Ball TM', keySpecLabel: 'Nominal Size', keySpecValue: 'DN25 - DN600', priceRange: '₹12,000 - ₹4,50,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '24 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 2500'], ['Body Material', 'Forged Steel / Stainless Steel'], ['Application', 'Oil & Gas Pipelines']] },
  { id: 'ltvalves-globe-valve', name: 'L&T Forged Steel Globe Valve', brandId: 'ltvalves', brandMCatId: 'ltvalves-valves', family: 'valve', modelNumber: 'LTV-Globe FS', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN300', priceRange: '₹6,500 - ₹1,85,000', moq: '1 Piece', deliveryTime: '8-15 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 800'], ['Body Material', 'Forged Carbon / Alloy Steel'], ['Application', 'Power & Process Plants']] },
  { id: 'ltvalves-triple-offset', name: 'L&T Triple Offset Butterfly Valve', brandId: 'ltvalves', brandMCatId: 'ltvalves-valves', family: 'valve', modelNumber: 'LTV-TOV', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN1200', priceRange: '₹28,000 - ₹9,80,000', moq: '1 Piece', deliveryTime: '15-25 Days', warranty: '24 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 900'], ['Sealing', 'Metal Seated, Zero Leakage'], ['Application', 'Refinery & Petrochemical']] }
];

const AUDCO_VALVES: Seed[] = makeValveLadderSeeds({
  brandId: 'audco', brandMCatId: 'audco-valves', idPrefix: 'audco-valve',
  namePrefix: 'Audco', modelPrefix: 'AUD-', valveTypeName: 'Butterfly Valve',
  pricePerDn: 600, deliveryTime: '8-14 Days', warranty: '18 Months',
  pressureRating: 'PN 10 / PN 16', bodyMaterial: 'Cast Iron / Cast Steel', endConnection: 'Wafer / Lugged'
});
const AUDCO_OTHER: Seed[] = [
  { id: 'audco-plug-valve', name: 'Audco Lubricated Plug Valve', brandId: 'audco', brandMCatId: 'audco-valves', family: 'valve', modelNumber: 'AUD-Plug L', keySpecLabel: 'Nominal Size', keySpecValue: 'DN25 - DN600', priceRange: '₹18,000 - ₹6,80,000', moq: '1 Piece', deliveryTime: '12-20 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 600'], ['Body Material', 'Cast Iron / Cast Steel'], ['Application', 'Oil & Gas, Refinery']] },
  { id: 'audco-ball-valve', name: 'Audco Floating Ball Valve', brandId: 'audco', brandMCatId: 'audco-valves', family: 'valve', modelNumber: 'AUD-Ball F', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN300', priceRange: '₹5,500 - ₹1,45,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 300'], ['Body Material', 'Carbon Steel / Stainless Steel'], ['Application', 'Process Piping Isolation']] },
  { id: 'audco-triple-offset', name: 'Audco Triple Offset Valve', brandId: 'audco', brandMCatId: 'audco-valves', family: 'valve', modelNumber: 'AUD-TOV', keySpecLabel: 'Nominal Size', keySpecValue: 'DN80 - DN900', priceRange: '₹65,000 - ₹8,20,000', moq: '1 Piece', deliveryTime: '18-28 Days', warranty: '24 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 900'], ['Sealing', 'Metal Seated, Fire Safe'], ['Application', 'Refinery & Chemical Process']] }
];

const VELAN_VALVES: Seed[] = makeValveLadderSeeds({
  brandId: 'velan', brandMCatId: 'velan-valves', idPrefix: 'velan-valve',
  namePrefix: 'Velan', modelPrefix: 'VEL-', valveTypeName: 'Cast Steel Gate Valve',
  pricePerDn: 720, deliveryTime: '10-16 Days', warranty: '24 Months',
  pressureRating: 'ANSI 150 - 600', bodyMaterial: 'Cast Steel', endConnection: 'Flanged / Butt-Weld'
});
const VELAN_OTHER: Seed[] = [
  { id: 'velan-globe-valve', name: 'Velan Cast Steel Globe Valve', brandId: 'velan', brandMCatId: 'velan-valves', family: 'valve', modelNumber: 'VEL-Globe CS', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN400', priceRange: '₹9,500 - ₹3,20,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '24 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 900'], ['Body Material', 'Cast Steel / Alloy Steel'], ['Application', 'Power Plants']] },
  { id: 'velan-check-valve', name: 'Velan Swing Check Valve', brandId: 'velan', brandMCatId: 'velan-valves', family: 'valve', modelNumber: 'VEL-Check SW', keySpecLabel: 'Nominal Size', keySpecValue: 'DN25 - DN500', priceRange: '₹8,200 - ₹4,10,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '24 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 900'], ['Body Material', 'Cast Steel'], ['Application', 'Power & Process Piping']] },
  { id: 'velan-forged-ball', name: 'Velan Forged Steel Ball Valve', brandId: 'velan', brandMCatId: 'velan-valves', family: 'valve', modelNumber: 'VEL-Ball FS', keySpecLabel: 'Nominal Size', keySpecValue: 'DN10 - DN100', priceRange: '₹4,500 - ₹85,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'ANSI 800 - 2500'], ['Body Material', 'Forged Steel'], ['Application', 'High Pressure Instrumentation']] }
];

const KITZ_VALVES: Seed[] = makeValveLadderSeeds({
  brandId: 'kitz', brandMCatId: 'kitz-valves', idPrefix: 'kitz-valve',
  namePrefix: 'KITZ', modelPrefix: 'KTZ-', valveTypeName: 'Ball Valve',
  pricePerDn: 560, deliveryTime: '8-14 Days', warranty: '18 Months',
  pressureRating: 'ANSI 150 - 300', bodyMaterial: 'Bronze / Stainless Steel', endConnection: 'Screwed / Flanged'
});
const KITZ_OTHER: Seed[] = [
  { id: 'kitz-butterfly-valve', name: 'KITZ Lug Type Butterfly Valve', brandId: 'kitz', brandMCatId: 'kitz-valves', family: 'valve', modelNumber: 'KTZ-Butterfly L', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN600', priceRange: '₹6,800 - ₹2,40,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'PN 10 / PN 16'], ['Body Material', 'Ductile Iron'], ['Application', 'Water & HVAC Systems']] },
  { id: 'kitz-bronze-gate', name: 'KITZ Bronze Gate Valve', brandId: 'kitz', brandMCatId: 'kitz-valves', family: 'valve', modelNumber: 'KTZ-Gate BR', keySpecLabel: 'Nominal Size', keySpecValue: 'DN10 - DN100', priceRange: '₹1,200 - ₹28,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'Class 150'], ['Body Material', 'Bronze'], ['Application', 'Marine & Instrumentation']] },
  { id: 'kitz-check-valve', name: 'KITZ Wafer Check Valve', brandId: 'kitz', brandMCatId: 'kitz-valves', family: 'valve', modelNumber: 'KTZ-Check W', keySpecLabel: 'Nominal Size', keySpecValue: 'DN25 - DN300', priceRange: '₹3,500 - ₹95,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 16'], ['Body Material', 'Cast Iron / Stainless Steel'], ['Application', 'Pump Discharge Lines']] }
];

const ZOLOTO_VALVES: Seed[] = makeValveLadderSeeds({
  brandId: 'zoloto', brandMCatId: 'zoloto-valves', idPrefix: 'zoloto-valve',
  namePrefix: 'Zoloto', modelPrefix: 'ZLT-', valveTypeName: 'Gate Valve',
  pricePerDn: 340, deliveryTime: '3-6 Days', warranty: '12 Months',
  pressureRating: 'PN 10 / PN 16', bodyMaterial: 'Cast Iron / Gunmetal', endConnection: 'Screwed / Flanged'
});
const ZOLOTO_OTHER: Seed[] = [
  { id: 'zoloto-ball-valve', name: 'Zoloto Forged Brass Ball Valve', brandId: 'zoloto', brandMCatId: 'zoloto-valves', family: 'valve', modelNumber: 'ZLT-Ball FB', keySpecLabel: 'Nominal Size', keySpecValue: 'DN8 - DN100', priceRange: '₹110 - ₹18,500', moq: '10 Pieces', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 25'], ['Body Material', 'Forged Brass'], ['Application', 'Plumbing & Domestic Use']] },
  { id: 'zoloto-butterfly-valve', name: 'Zoloto Cast Iron Butterfly Valve', brandId: 'zoloto', brandMCatId: 'zoloto-valves', family: 'valve', modelNumber: 'ZLT-Butterfly CI', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN300', priceRange: '₹1,850 - ₹42,000', moq: '1 Piece', deliveryTime: '3-7 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 10'], ['Body Material', 'Cast Iron'], ['Application', 'Water Distribution']] },
  { id: 'zoloto-y-strainer', name: 'Zoloto Y-Type Strainer', brandId: 'zoloto', brandMCatId: 'zoloto-valves', family: 'valve', modelNumber: 'ZLT-Strainer Y', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN200', priceRange: '₹350 - ₹22,000', moq: '5 Pieces', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 16'], ['Body Material', 'Cast Iron / Gunmetal'], ['Application', 'Pipeline Debris Filtration']] }
];

const BDK_VALVES: Seed[] = makeValveLadderSeeds({
  brandId: 'bdk', brandMCatId: 'bdk-valves', idPrefix: 'bdk-valve',
  namePrefix: 'BDK', modelPrefix: 'BDK-', valveTypeName: 'Cast Steel Globe Valve',
  pricePerDn: 610, deliveryTime: '6-12 Days', warranty: '18 Months',
  pressureRating: 'ANSI 150 - 300', bodyMaterial: 'Cast Steel / Stainless Steel', endConnection: 'Flanged'
});
const BDK_OTHER: Seed[] = [
  { id: 'bdk-gate-valve', name: 'BDK Cast Steel Gate Valve', brandId: 'bdk', brandMCatId: 'bdk-valves', family: 'valve', modelNumber: 'BDK-Gate CS', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN300', priceRange: '₹4,800 - ₹1,95,000', moq: '1 Piece', deliveryTime: '6-12 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'ANSI 150 - 600'], ['Body Material', 'Cast Steel'], ['Application', 'Process Industry']] },
  { id: 'bdk-check-valve', name: 'BDK Forged Steel Check Valve', brandId: 'bdk', brandMCatId: 'bdk-valves', family: 'valve', modelNumber: 'BDK-Check FS', keySpecLabel: 'Nominal Size', keySpecValue: 'DN15 - DN150', priceRange: '₹3,200 - ₹68,000', moq: '1 Piece', deliveryTime: '6-10 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'ANSI 800'], ['Body Material', 'Forged Carbon Steel'], ['Application', 'High Pressure Piping']] },
  { id: 'bdk-ball-valve', name: 'BDK Forged Steel Ball Valve', brandId: 'bdk', brandMCatId: 'bdk-valves', family: 'valve', modelNumber: 'BDK-Ball FS', keySpecLabel: 'Nominal Size', keySpecValue: 'DN10 - DN80', priceRange: '₹2,800 - ₹42,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'ANSI 800 - 1500'], ['Body Material', 'Forged Steel'], ['Application', 'Instrumentation & Utility Lines']] }
];

const LEADERVALVES_VALVES: Seed[] = makeValveLadderSeeds({
  brandId: 'leadervalves', brandMCatId: 'leadervalves-valves', idPrefix: 'leadervalves-valve',
  namePrefix: 'Leader', modelPrefix: 'LDR-', valveTypeName: 'Sluice Gate Valve',
  pricePerDn: 320, deliveryTime: '3-6 Days', warranty: '12 Months',
  pressureRating: 'PN 10 / PN 16', bodyMaterial: 'Cast Iron / Ductile Iron', endConnection: 'Flanged'
});
const LEADERVALVES_OTHER: Seed[] = [
  { id: 'leadervalves-butterfly', name: 'Leader Concentric Butterfly Valve', brandId: 'leadervalves', brandMCatId: 'leadervalves-valves', family: 'valve', modelNumber: 'LDR-Butterfly C', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN600', priceRange: '₹2,100 - ₹58,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 10 / PN 16'], ['Body Material', 'Cast Iron'], ['Application', 'Water Treatment Plants']] },
  { id: 'leadervalves-air-release', name: 'Leader Air Release Valve', brandId: 'leadervalves', brandMCatId: 'leadervalves-valves', family: 'valve', modelNumber: 'LDR-Air Release', keySpecLabel: 'Nominal Size', keySpecValue: 'DN25 - DN150', priceRange: '₹4,500 - ₹65,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 16'], ['Body Material', 'Cast Iron'], ['Application', 'Pipeline Air Venting']] },
  { id: 'leadervalves-non-return', name: 'Leader Dual Plate Non-Return Valve', brandId: 'leadervalves', brandMCatId: 'leadervalves-valves', family: 'valve', modelNumber: 'LDR-NRV Dual', keySpecLabel: 'Nominal Size', keySpecValue: 'DN50 - DN400', priceRange: '₹5,200 - ₹1,10,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'PN 16'], ['Body Material', 'Cast Iron / Stainless Steel'], ['Application', 'Pump Discharge Non-Return']] }
];

const ADVANCEVALVES_VALVES: Seed[] = makeValveLadderSeeds({
  brandId: 'advancevalves', brandMCatId: 'advancevalves-valves', idPrefix: 'advancevalves-valve',
  namePrefix: 'Advance', modelPrefix: 'ADV-', valveTypeName: 'Forged Steel Gate Valve',
  pricePerDn: 590, deliveryTime: '6-12 Days', warranty: '18 Months',
  pressureRating: 'ANSI 150 - 800', bodyMaterial: 'Forged Steel / Stainless Steel', endConnection: 'Socket Weld / Flanged'
});
const ADVANCEVALVES_OTHER: Seed[] = [
  { id: 'advancevalves-globe', name: 'Advance Forged Steel Globe Valve', brandId: 'advancevalves', brandMCatId: 'advancevalves-valves', family: 'valve', modelNumber: 'ADV-Globe FS', keySpecLabel: 'Nominal Size', keySpecValue: 'DN10 - DN100', priceRange: '₹2,400 - ₹48,000', moq: '1 Piece', deliveryTime: '6-10 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'ANSI 800 - 1500'], ['Body Material', 'Forged Steel'], ['Application', 'Steam & High Pressure Lines']] },
  { id: 'advancevalves-check', name: 'Advance Forged Steel Check Valve', brandId: 'advancevalves', brandMCatId: 'advancevalves-valves', family: 'valve', modelNumber: 'ADV-Check FS', keySpecLabel: 'Nominal Size', keySpecValue: 'DN10 - DN100', priceRange: '₹2,200 - ₹45,000', moq: '1 Piece', deliveryTime: '6-10 Days', warranty: '18 Months', extraSpecs: [['Pressure Rating', 'ANSI 800 - 1500'], ['Body Material', 'Forged Steel'], ['Application', 'High Pressure Utility Lines']] },
  { id: 'advancevalves-ball', name: 'Advance Investment Cast Ball Valve', brandId: 'advancevalves', brandMCatId: 'advancevalves-valves', family: 'valve', modelNumber: 'ADV-Ball IC', keySpecLabel: 'Nominal Size', keySpecValue: 'DN8 - DN50', priceRange: '₹450 - ₹8,500', moq: '10 Pieces', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Pressure Rating', 'ANSI 800'], ['Body Material', 'Investment Cast Stainless Steel'], ['Application', 'Instrumentation & Sampling']] }
];

// Shared across motor brands — real IE2/IE3 induction motor ranges are sized around these
// standard HP ratings, each paired with its nearest IEC standard kW rating.
const MOTOR_POWER_LADDER_HP = [1, 2, 3, 5, 7.5, 10, 15, 20, 30, 40, 60, 100];
const MOTOR_HP_TO_KW: Record<number, number> = {
  1: 0.75, 2: 1.5, 3: 2.2, 5: 3.7, 7.5: 5.5, 10: 7.5, 15: 11, 20: 15, 30: 22, 40: 30, 60: 45, 100: 75
};
function motorFrameForHp(hp: number): string {
  if (hp <= 1) return '80M';
  if (hp <= 3) return '90L';
  if (hp <= 7.5) return '132M';
  if (hp <= 10) return '132M';
  if (hp <= 20) return '160L';
  if (hp <= 40) return '200L';
  if (hp <= 60) return '225M';
  return '280S';
}

interface MotorLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  motorTypeName: string;
  pricePerHp: number;
  deliveryTime: string;
  warranty: string;
  count?: number;
}

function makeMotorLadderSeeds(def: MotorLadderDef): Seed[] {
  const ladder = MOTOR_POWER_LADDER_HP.slice(0, def.count ?? MOTOR_POWER_LADDER_HP.length);
  return ladder.map((hp) => {
    const kw = MOTOR_HP_TO_KW[hp];
    const price = Math.round((hp * def.pricePerHp) / 500) * 500;
    return {
      id: `${def.idPrefix}-${hp}hp`,
      name: `${def.namePrefix} ${def.modelPrefix}${hp} ${def.motorTypeName}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'motor',
      modelNumber: `${def.modelPrefix}${hp}HP-4P`,
      keySpecLabel: 'Rated Power',
      keySpecValue: `${hp} HP (${kw} kW), 4 Pole`,
      priceRange: `₹${formatIndianPrice(price)} onwards`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Voltage', '415V ± 10%, 3 Phase'],
        ['Frame Size', motorFrameForHp(hp)],
        ['Mounting', 'Foot Mounting']
      ]
    } as Seed;
  });
}

const CROMPTON_MOTORS_LADDER: Seed[] = makeMotorLadderSeeds({
  brandId: 'crompton', brandMCatId: 'crompton-motors', idPrefix: 'crompton-motor-ladder',
  namePrefix: 'Crompton', modelPrefix: 'CG-IE3-', motorTypeName: 'IE3 Super Premium Efficiency Motor',
  pricePerHp: 2100, deliveryTime: '4-8 Days', warranty: '18 Months', count: 5
});

const HAVELLS_MOTORS_LADDER: Seed[] = makeMotorLadderSeeds({
  brandId: 'havells', brandMCatId: 'havells-motors', idPrefix: 'havells-motor-ladder',
  namePrefix: 'Havells', modelPrefix: 'HMOT-IE3-', motorTypeName: 'Three Phase IE3 Motor',
  pricePerHp: 1950, deliveryTime: '4-8 Days', warranty: '18 Months'
});
const HAVELLS_MOTORS_OTHER: Seed[] = [
  { id: 'havells-slipring-motor', name: 'Havells Slip Ring Induction Motor', brandId: 'havells', brandMCatId: 'havells-motors', family: 'motor', modelNumber: 'HMOT-SR-40HP', keySpecLabel: 'Rated Power', keySpecValue: '20 HP - 150 HP', priceRange: '₹95,000 - ₹4,80,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V ± 10%, 3 Phase'], ['Rotor Type', 'Wound / Slip Ring'], ['Application', 'High Starting Torque Loads']] }
];

const ABB_MOTORS: Seed[] = makeMotorLadderSeeds({
  brandId: 'abb', brandMCatId: 'abb-motors', idPrefix: 'abb-motor',
  namePrefix: 'ABB', modelPrefix: 'M3BP-', motorTypeName: 'IE3 Cast Iron Motor',
  pricePerHp: 3200, deliveryTime: '6-12 Days', warranty: '24 Months'
});
const ABB_MOTORS_OTHER: Seed[] = [
  { id: 'abb-hxr-highvoltage', name: 'ABB HXR High Voltage Motor', brandId: 'abb', brandMCatId: 'abb-motors', family: 'motor', modelNumber: 'HXR 355', keySpecLabel: 'Rated Power', keySpecValue: '150 HP - 1000 HP', priceRange: '₹8,50,000 - ₹45,00,000', moq: '1 Piece', deliveryTime: '20-30 Days', warranty: '24 Months', extraSpecs: [['Voltage', '3.3 kV - 11 kV'], ['Application', 'Compressors, Large Pumps'], ['Protection', 'IP55']] },
  { id: 'abb-synchronous-motor', name: 'ABB Synchronous Reluctance Motor', brandId: 'abb', brandMCatId: 'abb-motors', family: 'motor', modelNumber: 'SynRM', keySpecLabel: 'Rated Power', keySpecValue: '10 HP - 250 HP', priceRange: '₹85,000 - ₹9,80,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '24 Months', extraSpecs: [['Efficiency Class', 'IE5 Ultra Premium'], ['Voltage', '415V - 690V'], ['Application', 'Pumps, Fans, Compressors']] },
  { id: 'abb-explosion-proof', name: 'ABB Explosion-Proof Motor', brandId: 'abb', brandMCatId: 'abb-motors', family: 'motor', modelNumber: 'EXd Series', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 200 HP', priceRange: '₹45,000 - ₹6,80,000', moq: '1 Piece', deliveryTime: '15-25 Days', warranty: '24 Months', extraSpecs: [['Compliance', 'ATEX / IECEx Zone 1 & 2'], ['Voltage', '415V, 3 Phase'], ['Application', 'Oil & Gas, Chemical Plants']] }
];

const KIRLOSKARELECTRIC_MOTORS: Seed[] = makeMotorLadderSeeds({
  brandId: 'kirloskarelectric', brandMCatId: 'kirloskarelectric-motors', idPrefix: 'kirloskarelectric-motor',
  namePrefix: 'Kirloskar Electric', modelPrefix: 'KEC-', motorTypeName: 'TEFC Induction Motor',
  pricePerHp: 2000, deliveryTime: '5-10 Days', warranty: '18 Months'
});
const KIRLOSKARELECTRIC_MOTORS_OTHER: Seed[] = [
  { id: 'kirloskarelectric-alternator', name: 'Kirloskar Electric Brushless Alternator', brandId: 'kirloskarelectric', brandMCatId: 'kirloskarelectric-motors', family: 'motor', modelNumber: 'AC Alternator BLDC', keySpecLabel: 'Rated Power', keySpecValue: '10 kVA - 500 kVA', priceRange: '₹1,20,000 - ₹18,50,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V, 3 Phase'], ['Application', 'Diesel Genset Alternators'], ['Protection', 'IP23']] },
  { id: 'kirloskarelectric-traction-motor', name: 'Kirloskar Electric Traction Motor', brandId: 'kirloskarelectric', brandMCatId: 'kirloskarelectric-motors', family: 'motor', modelNumber: 'Traction TM', keySpecLabel: 'Rated Power', keySpecValue: '50 HP - 300 HP', priceRange: '₹3,80,000 - ₹22,00,000', moq: '1 Piece', deliveryTime: '20-30 Days', warranty: '24 Months', extraSpecs: [['Compliance', 'RDSO Approved'], ['Application', 'Locomotives & Rolling Stock'], ['Cooling', 'Force Ventilated']] },
  { id: 'kirloskarelectric-flameproof', name: 'Kirloskar Electric Flameproof Motor', brandId: 'kirloskarelectric', brandMCatId: 'kirloskarelectric-motors', family: 'motor', modelNumber: 'FLP Series', keySpecLabel: 'Rated Power', keySpecValue: '3 HP - 150 HP', priceRange: '₹28,000 - ₹5,20,000', moq: '1 Piece', deliveryTime: '12-20 Days', warranty: '18 Months', extraSpecs: [['Compliance', 'PESO / CMRI Approved'], ['Voltage', '415V, 3 Phase'], ['Application', 'Mining, Oil & Gas']] }
];

const BHARATBIJLEE_MOTORS: Seed[] = makeMotorLadderSeeds({
  brandId: 'bharatbijlee', brandMCatId: 'bharatbijlee-motors', idPrefix: 'bharatbijlee-motor',
  namePrefix: 'Bharat Bijlee', modelPrefix: 'BBL-', motorTypeName: 'TEFC Squirrel Cage Motor',
  pricePerHp: 1980, deliveryTime: '5-10 Days', warranty: '18 Months'
});
const BHARATBIJLEE_MOTORS_OTHER: Seed[] = [
  { id: 'bharatbijlee-servo-motor', name: 'Bharat Bijlee AC Servo Motor', brandId: 'bharatbijlee', brandMCatId: 'bharatbijlee-motors', family: 'motor', modelNumber: 'Servo BB', keySpecLabel: 'Rated Power', keySpecValue: '0.1 kW - 15 kW', priceRange: '₹18,500 - ₹2,20,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Application', 'CNC & Automation'], ['Feedback', 'Absolute Encoder'], ['Protection', 'IP65']] },
  { id: 'bharatbijlee-slipring', name: 'Bharat Bijlee Slip Ring Motor', brandId: 'bharatbijlee', brandMCatId: 'bharatbijlee-motors', family: 'motor', modelNumber: 'SR Series', keySpecLabel: 'Rated Power', keySpecValue: '25 HP - 200 HP', priceRange: '₹1,10,000 - ₹6,80,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V, 3 Phase'], ['Rotor Type', 'Wound Rotor'], ['Application', 'Cranes, Crushers']] },
  { id: 'bharatbijlee-transformer-motor', name: 'Bharat Bijlee Vertical Hollow Shaft Motor', brandId: 'bharatbijlee', brandMCatId: 'bharatbijlee-motors', family: 'motor', modelNumber: 'VHS Series', keySpecLabel: 'Rated Power', keySpecValue: '10 HP - 100 HP', priceRange: '₹65,000 - ₹4,20,000', moq: '1 Piece', deliveryTime: '10-18 Days', warranty: '18 Months', extraSpecs: [['Application', 'Vertical Turbine Pump Drives'], ['Voltage', '415V, 3 Phase'], ['Mounting', 'Vertical Hollow Shaft']] }
];

const WEG_MOTORS: Seed[] = makeMotorLadderSeeds({
  brandId: 'weg', brandMCatId: 'weg-motors', idPrefix: 'weg-motor',
  namePrefix: 'WEG', modelPrefix: 'W22-', motorTypeName: 'IE3 Premium Efficiency Motor',
  pricePerHp: 2400, deliveryTime: '6-12 Days', warranty: '24 Months'
});
const WEG_MOTORS_OTHER: Seed[] = [
  { id: 'weg-w22-ie4', name: 'WEG W22 IE4 Super Premium Motor', brandId: 'weg', brandMCatId: 'weg-motors', family: 'motor', modelNumber: 'W22 IE4', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 150 HP', priceRange: '₹65,000 - ₹6,80,000', moq: '1 Piece', deliveryTime: '10-16 Days', warranty: '24 Months', extraSpecs: [['Efficiency Class', 'IE4 Super Premium'], ['Voltage', '415V, 3 Phase'], ['Protection', 'IP55']] },
  { id: 'weg-explosion-proof', name: 'WEG Explosion-Proof Motor', brandId: 'weg', brandMCatId: 'weg-motors', family: 'motor', modelNumber: 'W22X', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 250 HP', priceRange: '₹75,000 - ₹8,50,000', moq: '1 Piece', deliveryTime: '15-25 Days', warranty: '24 Months', extraSpecs: [['Compliance', 'ATEX / IECEx'], ['Voltage', '415V, 3 Phase'], ['Application', 'Hazardous Areas']] },
  { id: 'weg-brake-motor', name: 'WEG Brake Motor', brandId: 'weg', brandMCatId: 'weg-motors', family: 'motor', modelNumber: 'W22 Brake', keySpecLabel: 'Rated Power', keySpecValue: '1 HP - 40 HP', priceRange: '₹18,500 - ₹1,85,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Brake Type', 'Electromagnetic Fail-Safe'], ['Voltage', '415V, 3 Phase'], ['Application', 'Conveyors & Cranes']] }
];

const CGPOWER_MOTORS: Seed[] = makeMotorLadderSeeds({
  brandId: 'cgpower', brandMCatId: 'cgpower-motors', idPrefix: 'cgpower-motor',
  namePrefix: 'CG Power', modelPrefix: 'CGP-', motorTypeName: 'TEFC Induction Motor',
  pricePerHp: 1900, deliveryTime: '5-10 Days', warranty: '18 Months'
});
const CGPOWER_MOTORS_OTHER: Seed[] = [
  { id: 'cgpower-high-voltage', name: 'CG Power High Voltage Motor', brandId: 'cgpower', brandMCatId: 'cgpower-motors', family: 'motor', modelNumber: 'HV Series', keySpecLabel: 'Rated Power', keySpecValue: '150 HP - 800 HP', priceRange: '₹7,50,000 - ₹38,00,000', moq: '1 Piece', deliveryTime: '20-30 Days', warranty: '24 Months', extraSpecs: [['Voltage', '3.3 kV - 6.6 kV'], ['Application', 'Compressors, Large Fans'], ['Protection', 'IP55']] },
  { id: 'cgpower-traction-alternator', name: 'CG Power Traction Alternator', brandId: 'cgpower', brandMCatId: 'cgpower-motors', family: 'motor', modelNumber: 'Traction Alt', keySpecLabel: 'Rated Power', keySpecValue: '20 kVA - 750 kVA', priceRange: '₹1,80,000 - ₹28,00,000', moq: '1 Piece', deliveryTime: '15-25 Days', warranty: '24 Months', extraSpecs: [['Application', 'Diesel Genset & Rail'], ['Voltage', '415V, 3 Phase'], ['Protection', 'IP23']] },
  { id: 'cgpower-flameproof', name: 'CG Power Flameproof Motor', brandId: 'cgpower', brandMCatId: 'cgpower-motors', family: 'motor', modelNumber: 'FLP-CG', keySpecLabel: 'Rated Power', keySpecValue: '3 HP - 150 HP', priceRange: '₹26,000 - ₹4,95,000', moq: '1 Piece', deliveryTime: '12-20 Days', warranty: '18 Months', extraSpecs: [['Compliance', 'PESO Approved'], ['Voltage', '415V, 3 Phase'], ['Application', 'Mining, Oil & Gas']] }
];

const GE_MOTORS: Seed[] = makeMotorLadderSeeds({
  brandId: 'ge', brandMCatId: 'ge-motors', idPrefix: 'ge-motor',
  namePrefix: 'GE', modelPrefix: 'GE-IE3-', motorTypeName: 'Industrial AC Motor',
  pricePerHp: 2600, deliveryTime: '8-14 Days', warranty: '24 Months'
});
const GE_MOTORS_OTHER: Seed[] = [
  { id: 'ge-dc-motor', name: 'GE DC Industrial Motor', brandId: 'ge', brandMCatId: 'ge-motors', family: 'motor', modelNumber: 'DC Series', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 200 HP', priceRange: '₹1,10,000 - ₹9,80,000', moq: '1 Piece', deliveryTime: '15-22 Days', warranty: '24 Months', extraSpecs: [['Application', 'Rolling Mills, Cranes'], ['Voltage', '220V - 440V DC'], ['Cooling', 'Force Ventilated']] },
  { id: 'ge-large-drive-motor', name: 'GE Large AC Drive Motor', brandId: 'ge', brandMCatId: 'ge-motors', family: 'motor', modelNumber: 'AC Drive Large', keySpecLabel: 'Rated Power', keySpecValue: '200 HP - 1500 HP', priceRange: '₹15,00,000 - ₹85,00,000', moq: '1 Piece', deliveryTime: '25-40 Days', warranty: '24 Months', extraSpecs: [['Voltage', '3.3 kV - 11 kV'], ['Application', 'Large Compressors, Mills'], ['Cooling', 'Water / Air Cooled']] },
  { id: 'ge-marine-motor', name: 'GE Marine Duty Motor', brandId: 'ge', brandMCatId: 'ge-motors', family: 'motor', modelNumber: 'Marine Series', keySpecLabel: 'Rated Power', keySpecValue: '10 HP - 300 HP', priceRange: '₹1,50,000 - ₹12,50,000', moq: '1 Piece', deliveryTime: '20-30 Days', warranty: '24 Months', extraSpecs: [['Compliance', 'IRS / DNV Marine Certified'], ['Voltage', '415V, 3 Phase'], ['Application', 'Shipboard Machinery']] }
];

const MARATHONELECTRIC_MOTORS: Seed[] = makeMotorLadderSeeds({
  brandId: 'marathonelectric', brandMCatId: 'marathonelectric-motors', idPrefix: 'marathonelectric-motor',
  namePrefix: 'Marathon', modelPrefix: 'MEP-', motorTypeName: 'IE3 TEFC Motor',
  pricePerHp: 1850, deliveryTime: '5-10 Days', warranty: '18 Months'
});
const MARATHONELECTRIC_MOTORS_OTHER: Seed[] = [
  { id: 'marathonelectric-blower-duty', name: 'Marathon Blower Duty Motor', brandId: 'marathonelectric', brandMCatId: 'marathonelectric-motors', family: 'motor', modelNumber: 'Blower Duty MEP', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 100 HP', priceRange: '₹28,000 - ₹3,80,000', moq: '1 Piece', deliveryTime: '6-12 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V, 3 Phase'], ['Application', 'Blowers & Fans'], ['Protection', 'IP55']] },
  { id: 'marathonelectric-crane-duty', name: 'Marathon Crane Duty Motor', brandId: 'marathonelectric', brandMCatId: 'marathonelectric-motors', family: 'motor', modelNumber: 'Crane Duty MEP', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 60 HP', priceRange: '₹32,000 - ₹2,80,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Duty Cycle', 'S4/S5 Intermittent'], ['Voltage', '415V, 3 Phase'], ['Application', 'Cranes & Hoists']] },
  { id: 'marathonelectric-pump-duty', name: 'Marathon Pump Duty Motor', brandId: 'marathonelectric', brandMCatId: 'marathonelectric-motors', family: 'motor', modelNumber: 'Pump Duty MEP', keySpecLabel: 'Rated Power', keySpecValue: '3 HP - 75 HP', priceRange: '₹16,500 - ₹2,95,000', moq: '1 Piece', deliveryTime: '6-12 Days', warranty: '18 Months', extraSpecs: [['Voltage', '415V, 3 Phase'], ['Application', 'Pump & Compressor Drives'], ['Protection', 'IP55']] }
];

const SIEMENS_MOTORS: Seed[] = makeMotorLadderSeeds({
  brandId: 'siemens', brandMCatId: 'siemens-motors', idPrefix: 'siemens-motor',
  namePrefix: 'Siemens', modelPrefix: 'SIMOTICS-', motorTypeName: 'IE3 Industrial Motor',
  pricePerHp: 3100, deliveryTime: '5-9 Days', warranty: '18 Months'
});
const SIEMENS_MOTORS_OTHER: Seed[] = [
  { id: 'siemens-high-voltage-motor', name: 'Siemens High Voltage Motor', brandId: 'siemens', brandMCatId: 'siemens-motors', family: 'motor', modelNumber: '1RN4 HV', keySpecLabel: 'Rated Power', keySpecValue: '200 HP - 1000 HP', priceRange: '₹12,50,000 - ₹65,00,000', moq: '1 Piece', deliveryTime: '20-30 Days', warranty: '24 Months', extraSpecs: [['Voltage', '3.3 kV - 11 kV'], ['Application', 'Large Compressors & Fans'], ['Protection', 'IP55']] },
  { id: 'siemens-explosion-proof-motor', name: 'Siemens Explosion-Proof Motor', brandId: 'siemens', brandMCatId: 'siemens-motors', family: 'motor', modelNumber: '1MJ6 EXd', keySpecLabel: 'Rated Power', keySpecValue: '5 HP - 250 HP', priceRange: '₹85,000 - ₹8,80,000', moq: '1 Piece', deliveryTime: '15-25 Days', warranty: '24 Months', extraSpecs: [['Compliance', 'ATEX / IECEx Zone 1 & 2'], ['Voltage', '415V, 3 Phase'], ['Application', 'Oil & Gas, Chemical Plants']] },
  { id: 'siemens-simotics-servo', name: 'Siemens Simotics Servo Motor', brandId: 'siemens', brandMCatId: 'siemens-motors', family: 'motor', modelNumber: '1FK2', keySpecLabel: 'Rated Power', keySpecValue: '0.2 kW - 10 kW', priceRange: '₹28,000 - ₹1,85,000', moq: '1 Piece', deliveryTime: '8-14 Days', warranty: '18 Months', extraSpecs: [['Application', 'CNC & Robotics'], ['Feedback', 'Absolute Encoder'], ['Protection', 'IP65']] }
];

// Shared across genset brands — real diesel generator ranges in India are sized around
// these standard kVA ratings.
const GENERATOR_KVA_LADDER = [15, 25, 40, 62.5, 82.5, 125, 160, 200, 250, 320, 500, 750];

interface GeneratorLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  engineName: string;
  pricePerKva: number;
  deliveryTime: string;
  warranty: string;
  count?: number;
}

function makeGeneratorLadderSeeds(def: GeneratorLadderDef): Seed[] {
  const ladder = GENERATOR_KVA_LADDER.slice(0, def.count ?? GENERATOR_KVA_LADDER.length);
  return ladder.map((kva) => {
    const kw = Math.round(kva * 0.8);
    const price = Math.round((kva * def.pricePerKva) / 5000) * 5000;
    const fuelTank = Math.round(kva * 2.5);
    const noise = 70 + Math.round(kva / 50);
    return {
      id: `${def.idPrefix}-${kva}kva`,
      name: `${def.namePrefix} ${def.modelPrefix}${kva} kVA Diesel Generator`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'generator',
      modelNumber: `${def.modelPrefix}${kva}`,
      keySpecLabel: 'Prime Power',
      keySpecValue: `${kva} kVA / ${kw} kW`,
      priceRange: `₹${formatIndianPrice(price)} onwards`,
      moq: '1 Set',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Engine', def.engineName],
        ['Fuel Tank Capacity', `${fuelTank} Litres`],
        ['Noise Level', `${noise} dB(A) @ 1m`]
      ]
    } as Seed;
  });
}

const KIRLOSKAR_GENERATORS_LADDER: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'kirloskar', brandMCatId: 'kirloskar-diesel-generators', idPrefix: 'kirloskar-generator-ladder',
  namePrefix: 'Kirloskar Green Prime', modelPrefix: 'KG2-', engineName: 'Kirloskar Engine, Water Cooled',
  pricePerKva: 15500, deliveryTime: '5-10 Days', warranty: '12 Months / 2000 Hours', count: 7
});

const CUMMINS_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'cummins', brandMCatId: 'cummins-diesel-generators', idPrefix: 'cummins-generator',
  namePrefix: 'Cummins', modelPrefix: 'C', engineName: 'Cummins Engine, CPCB IV+ Compliant',
  pricePerKva: 17500, deliveryTime: '6-12 Days', warranty: '24 Months / 3000 Hours'
});
const CUMMINS_OTHER: Seed[] = [
  { id: 'cummins-silent-canopy', name: 'Cummins Acoustic Silent Canopy Genset', brandId: 'cummins', brandMCatId: 'cummins-diesel-generators', family: 'generator', modelNumber: 'C-Silent', keySpecLabel: 'Prime Power', keySpecValue: '20 kVA - 500 kVA', priceRange: '₹4,20,000 - ₹58,00,000', moq: '1 Set', deliveryTime: '8-15 Days', warranty: '24 Months / 3000 Hours', extraSpecs: [['Engine', 'Cummins Engine, CPCB IV+ Compliant'], ['Enclosure', 'Sound Attenuated Acoustic Canopy'], ['Noise Level', '<75 dB(A) @ 1m']] },
  { id: 'cummins-portable-genset', name: 'Cummins Portable Diesel Generator', brandId: 'cummins', brandMCatId: 'cummins-diesel-generators', family: 'generator', modelNumber: 'C-Portable', keySpecLabel: 'Prime Power', keySpecValue: '5 kVA - 20 kVA', priceRange: '₹1,10,000 - ₹3,80,000', moq: '1 Set', deliveryTime: '4-8 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Cummins Engine'], ['Application', 'Construction Sites, Field Use'], ['Chassis', 'Skid Mounted']] },
  { id: 'cummins-hthp-generator', name: 'Cummins High Horsepower (HHP) Genset', brandId: 'cummins', brandMCatId: 'cummins-diesel-generators', family: 'generator', modelNumber: 'C-HHP', keySpecLabel: 'Prime Power', keySpecValue: '750 kVA - 2500 kVA', priceRange: '₹85,00,000 - ₹2,80,00,000', moq: '1 Set', deliveryTime: '30-45 Days', warranty: '24 Months / 3000 Hours', extraSpecs: [['Engine', 'Cummins QSK Series'], ['Application', 'Data Centers, Large Industrial Plants'], ['Cooling', 'Radiator / Remote Cooled']] }
];

const CATERPILLAR_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'caterpillar', brandMCatId: 'caterpillar-diesel-generators', idPrefix: 'caterpillar-generator',
  namePrefix: 'Caterpillar', modelPrefix: 'CAT-DE', engineName: 'Cat Diesel Engine, CPCB IV+ Compliant',
  pricePerKva: 18800, deliveryTime: '8-15 Days', warranty: '24 Months / 3000 Hours'
});
const CATERPILLAR_OTHER: Seed[] = [
  { id: 'caterpillar-standby-genset', name: 'Caterpillar Standby Power Genset', brandId: 'caterpillar', brandMCatId: 'caterpillar-diesel-generators', family: 'generator', modelNumber: 'CAT-Standby', keySpecLabel: 'Prime Power', keySpecValue: '20 kVA - 500 kVA', priceRange: '₹4,50,000 - ₹62,00,000', moq: '1 Set', deliveryTime: '10-18 Days', warranty: '24 Months / 3000 Hours', extraSpecs: [['Engine', 'Cat Diesel Engine'], ['Application', 'Hospitals, Data Centers'], ['Control', 'Cat EMCP Digital Controller']] },
  { id: 'caterpillar-rental-genset', name: 'Caterpillar Rental Power Module', brandId: 'caterpillar', brandMCatId: 'caterpillar-diesel-generators', family: 'generator', modelNumber: 'CAT-Rental', keySpecLabel: 'Prime Power', keySpecValue: '100 kVA - 750 kVA', priceRange: '₹18,00,000 - ₹95,00,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '24 Months / 3000 Hours', extraSpecs: [['Engine', 'Cat Diesel Engine'], ['Chassis', 'Trailer Mounted'], ['Application', 'Events, Construction, Rental Fleets']] },
  { id: 'caterpillar-hthp-generator', name: 'Caterpillar High Horsepower Genset', brandId: 'caterpillar', brandMCatId: 'caterpillar-diesel-generators', family: 'generator', modelNumber: 'CAT-HHP', keySpecLabel: 'Prime Power', keySpecValue: '750 kVA - 3000 kVA', priceRange: '₹92,00,000 - ₹3,20,00,000', moq: '1 Set', deliveryTime: '35-50 Days', warranty: '24 Months / 3000 Hours', extraSpecs: [['Engine', 'Cat 3500 Series'], ['Application', 'Data Centers, Heavy Industry'], ['Cooling', 'Radiator / Remote Cooled']] }
];

const MAHINDRAPOWEROL_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'mahindrapowerol', brandMCatId: 'mahindrapowerol-diesel-generators', idPrefix: 'mahindrapowerol-generator',
  namePrefix: 'Mahindra Powerol', modelPrefix: 'MP-', engineName: 'Mahindra Engine, CPCB IV+ Compliant',
  pricePerKva: 13200, deliveryTime: '5-10 Days', warranty: '18 Months / 2500 Hours'
});
const MAHINDRAPOWEROL_OTHER: Seed[] = [
  { id: 'mahindrapowerol-silent-genset', name: 'Mahindra Powerol Silent Series Genset', brandId: 'mahindrapowerol', brandMCatId: 'mahindrapowerol-diesel-generators', family: 'generator', modelNumber: 'MP-Silent', keySpecLabel: 'Prime Power', keySpecValue: '10 kVA - 250 kVA', priceRange: '₹2,20,000 - ₹28,00,000', moq: '1 Set', deliveryTime: '6-12 Days', warranty: '18 Months / 2500 Hours', extraSpecs: [['Engine', 'Mahindra Engine'], ['Enclosure', 'Sound Attenuated Canopy'], ['Noise Level', '<75 dB(A) @ 1m']] },
  { id: 'mahindrapowerol-telecom-genset', name: 'Mahindra Powerol Telecom Tower Genset', brandId: 'mahindrapowerol', brandMCatId: 'mahindrapowerol-diesel-generators', family: 'generator', modelNumber: 'MP-Telecom', keySpecLabel: 'Prime Power', keySpecValue: '5 kVA - 15 kVA', priceRange: '₹95,000 - ₹2,40,000', moq: '1 Set', deliveryTime: '4-8 Days', warranty: '18 Months / 2500 Hours', extraSpecs: [['Engine', 'Mahindra Engine'], ['Application', 'Telecom Towers, Remote Sites'], ['Fuel Efficiency', 'Low Fuel Consumption Design']] },
  { id: 'mahindrapowerol-agri-genset', name: 'Mahindra Powerol Agricultural Genset', brandId: 'mahindrapowerol', brandMCatId: 'mahindrapowerol-diesel-generators', family: 'generator', modelNumber: 'MP-Agri', keySpecLabel: 'Prime Power', keySpecValue: '5 kVA - 25 kVA', priceRange: '₹1,10,000 - ₹3,20,000', moq: '1 Set', deliveryTime: '4-8 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Mahindra Engine'], ['Application', 'Agricultural Pumping & Rural Power'], ['Fuel Tank Capacity', '50 - 100 Litres']] }
];

const ASHOKLEYLAND_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'ashokleyland', brandMCatId: 'ashokleyland-diesel-generators', idPrefix: 'ashokleyland-generator',
  namePrefix: 'Ashok Leyland', modelPrefix: 'ALPS-', engineName: 'Ashok Leyland Engine, CPCB IV+ Compliant',
  pricePerKva: 12800, deliveryTime: '6-12 Days', warranty: '18 Months / 2500 Hours'
});
const ASHOKLEYLAND_OTHER: Seed[] = [
  { id: 'ashokleyland-silent-genset', name: 'Ashok Leyland Silent Series Genset', brandId: 'ashokleyland', brandMCatId: 'ashokleyland-diesel-generators', family: 'generator', modelNumber: 'ALPS-Silent', keySpecLabel: 'Prime Power', keySpecValue: '15 kVA - 320 kVA', priceRange: '₹2,80,000 - ₹36,00,000', moq: '1 Set', deliveryTime: '8-14 Days', warranty: '18 Months / 2500 Hours', extraSpecs: [['Engine', 'Ashok Leyland Engine'], ['Enclosure', 'Sound Attenuated Canopy'], ['Noise Level', '<75 dB(A) @ 1m']] },
  { id: 'ashokleyland-marine-genset', name: 'Ashok Leyland Marine Auxiliary Genset', brandId: 'ashokleyland', brandMCatId: 'ashokleyland-diesel-generators', family: 'generator', modelNumber: 'ALPS-Marine', keySpecLabel: 'Prime Power', keySpecValue: '20 kVA - 200 kVA', priceRange: '₹3,80,000 - ₹22,00,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '18 Months / 2500 Hours', extraSpecs: [['Compliance', 'IRS Marine Certified'], ['Application', 'Marine Auxiliary Power'], ['Cooling', 'Keel Cooled / Heat Exchanger']] },
  { id: 'ashokleyland-rental-genset', name: 'Ashok Leyland Rental Power Genset', brandId: 'ashokleyland', brandMCatId: 'ashokleyland-diesel-generators', family: 'generator', modelNumber: 'ALPS-Rental', keySpecLabel: 'Prime Power', keySpecValue: '62.5 kVA - 500 kVA', priceRange: '₹9,50,000 - ₹58,00,000', moq: '1 Set', deliveryTime: '12-20 Days', warranty: '18 Months / 2500 Hours', extraSpecs: [['Engine', 'Ashok Leyland Engine'], ['Chassis', 'Trailer Mounted'], ['Application', 'Events, Construction Rental Fleets']] }
];

const ESCORTSKUBOTA_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'escortskubota', brandMCatId: 'escortskubota-diesel-generators', idPrefix: 'escortskubota-generator',
  namePrefix: 'Escorts Kubota', modelPrefix: 'EK-', engineName: 'Escorts Kubota Engine, CPCB IV+ Compliant',
  pricePerKva: 12200, deliveryTime: '5-10 Days', warranty: '12 Months / 2000 Hours'
});
const ESCORTSKUBOTA_OTHER: Seed[] = [
  { id: 'escortskubota-construction-genset', name: 'Escorts Kubota Construction Site Genset', brandId: 'escortskubota', brandMCatId: 'escortskubota-diesel-generators', family: 'generator', modelNumber: 'EK-Construction', keySpecLabel: 'Prime Power', keySpecValue: '20 kVA - 125 kVA', priceRange: '₹3,50,000 - ₹14,50,000', moq: '1 Set', deliveryTime: '6-12 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kubota Engine'], ['Application', 'Construction Sites'], ['Chassis', 'Skid / Towable']] },
  { id: 'escortskubota-agri-genset', name: 'Escorts Kubota Agricultural Genset', brandId: 'escortskubota', brandMCatId: 'escortskubota-diesel-generators', family: 'generator', modelNumber: 'EK-Agri', keySpecLabel: 'Prime Power', keySpecValue: '5 kVA - 25 kVA', priceRange: '₹1,05,000 - ₹3,10,000', moq: '1 Set', deliveryTime: '4-8 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kubota Engine'], ['Application', 'Agricultural & Rural Power'], ['Fuel Tank Capacity', '50 - 90 Litres']] },
  { id: 'escortskubota-silent-genset', name: 'Escorts Kubota Silent Series Genset', brandId: 'escortskubota', brandMCatId: 'escortskubota-diesel-generators', family: 'generator', modelNumber: 'EK-Silent', keySpecLabel: 'Prime Power', keySpecValue: '15 kVA - 160 kVA', priceRange: '₹2,60,000 - ₹18,50,000', moq: '1 Set', deliveryTime: '6-12 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Kubota Engine'], ['Enclosure', 'Sound Attenuated Canopy'], ['Noise Level', '<75 dB(A) @ 1m']] }
];

const HONDA_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'honda', brandMCatId: 'honda-diesel-generators', idPrefix: 'honda-generator',
  namePrefix: 'Honda', modelPrefix: 'EP-', engineName: 'Honda Engine',
  pricePerKva: 16500, deliveryTime: '4-8 Days', warranty: '12 Months / 1500 Hours', count: 9
});
const HONDA_OTHER: Seed[] = [
  { id: 'honda-portable-petrol', name: 'Honda Portable Petrol Generator', brandId: 'honda', brandMCatId: 'honda-diesel-generators', family: 'generator', modelNumber: 'EP 1000', keySpecLabel: 'Prime Power', keySpecValue: '0.7 kVA - 5 kVA', priceRange: '₹28,000 - ₹1,10,000', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Fuel', 'Petrol'], ['Application', 'Home Backup, Small Shops'], ['Noise Level', '58 dB(A) @ 7m']] },
  { id: 'honda-inverter-generator', name: 'Honda Inverter Generator', brandId: 'honda', brandMCatId: 'honda-diesel-generators', family: 'generator', modelNumber: 'EU Series', keySpecLabel: 'Prime Power', keySpecValue: '1 kVA - 3.5 kVA', priceRange: '₹65,000 - ₹1,85,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '24 Months', extraSpecs: [['Fuel', 'Petrol'], ['Output', 'Pure Sine Wave'], ['Application', 'Sensitive Electronics, Camping']] },
  { id: 'honda-water-pump-genset', name: 'Honda Engine-Driven Water Pump Set', brandId: 'honda', brandMCatId: 'honda-diesel-generators', family: 'generator', modelNumber: 'WB Series', keySpecLabel: 'Prime Power', keySpecValue: '3 HP - 8 HP', priceRange: '₹18,500 - ₹42,000', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Fuel', 'Petrol / Kerosene'], ['Application', 'Dewatering, Irrigation'], ['Discharge Size', '50mm - 80mm']] },
  { id: 'honda-welder-genset', name: 'Honda Engine Welder-Generator Combo', brandId: 'honda', brandMCatId: 'honda-diesel-generators', family: 'generator', modelNumber: 'EW Series', keySpecLabel: 'Prime Power', keySpecValue: '3 kVA - 6 kVA', priceRange: '₹85,000 - ₹1,65,000', moq: '1 Piece', deliveryTime: '4-8 Days', warranty: '12 Months', extraSpecs: [['Fuel', 'Petrol'], ['Welding Output', '150A - 300A DC'], ['Application', 'Field Welding & Auxiliary Power']] },
  { id: 'honda-dual-fuel-genset', name: 'Honda Dual Fuel (Petrol/LPG) Generator', brandId: 'honda', brandMCatId: 'honda-diesel-generators', family: 'generator', modelNumber: 'EPD Series', keySpecLabel: 'Prime Power', keySpecValue: '2 kVA - 7 kVA', priceRange: '₹48,000 - ₹1,45,000', moq: '1 Piece', deliveryTime: '3-6 Days', warranty: '12 Months', extraSpecs: [['Fuel', 'Petrol / LPG Dual Fuel'], ['Application', 'Home & Small Business Backup'], ['Noise Level', '62 dB(A) @ 7m']] },
  { id: 'honda-standby-home-genset', name: 'Honda Standby Home Backup Generator', brandId: 'honda', brandMCatId: 'honda-diesel-generators', family: 'generator', modelNumber: 'EG Standby', keySpecLabel: 'Prime Power', keySpecValue: '3 kVA - 10 kVA', priceRange: '₹1,10,000 - ₹2,90,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '24 Months', extraSpecs: [['Fuel', 'Petrol'], ['Transfer Switch', 'Automatic Transfer Switch Compatible'], ['Application', 'Residential & Small Commercial Backup']] }
];

const KOHLERSDMO_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'kohlersdmo', brandMCatId: 'kohlersdmo-diesel-generators', idPrefix: 'kohlersdmo-generator',
  namePrefix: 'Kohler-SDMO', modelPrefix: 'K-', engineName: 'SDMO Engine, CPCB IV+ Compliant',
  pricePerKva: 16200, deliveryTime: '10-16 Days', warranty: '24 Months / 2500 Hours'
});
const KOHLERSDMO_OTHER: Seed[] = [
  { id: 'kohlersdmo-marine-genset', name: 'Kohler-SDMO Marine Auxiliary Genset', brandId: 'kohlersdmo', brandMCatId: 'kohlersdmo-diesel-generators', family: 'generator', modelNumber: 'K-Marine', keySpecLabel: 'Prime Power', keySpecValue: '20 kVA - 250 kVA', priceRange: '₹4,20,000 - ₹28,00,000', moq: '1 Set', deliveryTime: '20-30 Days', warranty: '24 Months / 2500 Hours', extraSpecs: [['Compliance', 'IRS / DNV Marine Certified'], ['Application', 'Marine Auxiliary Power'], ['Cooling', 'Keel Cooled / Heat Exchanger']] },
  { id: 'kohlersdmo-rental-genset', name: 'Kohler-SDMO Rental Power Genset', brandId: 'kohlersdmo', brandMCatId: 'kohlersdmo-diesel-generators', family: 'generator', modelNumber: 'K-Rental', keySpecLabel: 'Prime Power', keySpecValue: '100 kVA - 500 kVA', priceRange: '₹17,50,000 - ₹62,00,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '24 Months / 2500 Hours', extraSpecs: [['Engine', 'SDMO Engine'], ['Chassis', 'Trailer Mounted'], ['Application', 'Events, Construction Rental Fleets']] },
  { id: 'kohlersdmo-silent-genset', name: 'Kohler-SDMO Silent Canopy Genset', brandId: 'kohlersdmo', brandMCatId: 'kohlersdmo-diesel-generators', family: 'generator', modelNumber: 'K-Silent', keySpecLabel: 'Prime Power', keySpecValue: '15 kVA - 320 kVA', priceRange: '₹3,20,000 - ₹40,00,000', moq: '1 Set', deliveryTime: '12-20 Days', warranty: '24 Months / 2500 Hours', extraSpecs: [['Engine', 'SDMO Engine'], ['Enclosure', 'Sound Attenuated Acoustic Canopy'], ['Noise Level', '<73 dB(A) @ 1m']] }
];

const PERKINS_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'perkins', brandMCatId: 'perkins-diesel-generators', idPrefix: 'perkins-generator',
  namePrefix: 'Perkins', modelPrefix: 'P-', engineName: 'Perkins Engine, CPCB IV+ Compliant',
  pricePerKva: 15800, deliveryTime: '10-18 Days', warranty: '24 Months / 3000 Hours'
});
const PERKINS_OTHER: Seed[] = [
  { id: 'perkins-hthp-generator', name: 'Perkins High Horsepower Genset', brandId: 'perkins', brandMCatId: 'perkins-diesel-generators', family: 'generator', modelNumber: 'P-HHP', keySpecLabel: 'Prime Power', keySpecValue: '750 kVA - 2000 kVA', priceRange: '₹78,00,000 - ₹2,40,00,000', moq: '1 Set', deliveryTime: '35-50 Days', warranty: '24 Months / 3000 Hours', extraSpecs: [['Engine', 'Perkins 4000 Series'], ['Application', 'Data Centers, Heavy Industry'], ['Cooling', 'Radiator / Remote Cooled']] },
  { id: 'perkins-rental-genset', name: 'Perkins Rental Power Module', brandId: 'perkins', brandMCatId: 'perkins-diesel-generators', family: 'generator', modelNumber: 'P-Rental', keySpecLabel: 'Prime Power', keySpecValue: '100 kVA - 500 kVA', priceRange: '₹17,00,000 - ₹58,00,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '24 Months / 3000 Hours', extraSpecs: [['Engine', 'Perkins Engine'], ['Chassis', 'Trailer Mounted'], ['Application', 'Events, Construction, Rental Fleets']] },
  { id: 'perkins-marine-genset', name: 'Perkins Marine Auxiliary Genset', brandId: 'perkins', brandMCatId: 'perkins-diesel-generators', family: 'generator', modelNumber: 'P-Marine', keySpecLabel: 'Prime Power', keySpecValue: '20 kVA - 250 kVA', priceRange: '₹4,10,000 - ₹27,50,000', moq: '1 Set', deliveryTime: '20-30 Days', warranty: '24 Months / 3000 Hours', extraSpecs: [['Compliance', 'IRS / DNV Marine Certified'], ['Application', 'Marine Auxiliary Power'], ['Cooling', 'Keel Cooled / Heat Exchanger']] }
];

const GREAVESCOTTON_GENERATORS: Seed[] = makeGeneratorLadderSeeds({
  brandId: 'greavescotton', brandMCatId: 'greavescotton-diesel-generators', idPrefix: 'greavescotton-generator',
  namePrefix: 'Greaves Cotton', modelPrefix: 'GC-', engineName: 'Greaves Cotton Engine, CPCB IV+ Compliant',
  pricePerKva: 11800, deliveryTime: '5-10 Days', warranty: '18 Months / 2000 Hours'
});
const GREAVESCOTTON_OTHER: Seed[] = [
  { id: 'greavescotton-silent-genset', name: 'Greaves Cotton Silent Series Genset', brandId: 'greavescotton', brandMCatId: 'greavescotton-diesel-generators', family: 'generator', modelNumber: 'GC-Silent', keySpecLabel: 'Prime Power', keySpecValue: '10 kVA - 250 kVA', priceRange: '₹2,00,000 - ₹26,00,000', moq: '1 Set', deliveryTime: '6-12 Days', warranty: '18 Months / 2000 Hours', extraSpecs: [['Engine', 'Greaves Cotton Engine'], ['Enclosure', 'Sound Attenuated Canopy'], ['Noise Level', '<75 dB(A) @ 1m']] },
  { id: 'greavescotton-telecom-genset', name: 'Greaves Cotton Telecom Tower Genset', brandId: 'greavescotton', brandMCatId: 'greavescotton-diesel-generators', family: 'generator', modelNumber: 'GC-Telecom', keySpecLabel: 'Prime Power', keySpecValue: '5 kVA - 15 kVA', priceRange: '₹85,000 - ₹2,20,000', moq: '1 Set', deliveryTime: '4-8 Days', warranty: '18 Months / 2000 Hours', extraSpecs: [['Engine', 'Greaves Cotton Engine'], ['Application', 'Telecom Towers, Remote Sites'], ['Fuel Efficiency', 'Low Fuel Consumption Design']] },
  { id: 'greavescotton-portable-genset', name: 'Greaves Cotton Portable Genset', brandId: 'greavescotton', brandMCatId: 'greavescotton-diesel-generators', family: 'generator', modelNumber: 'GC-Portable', keySpecLabel: 'Prime Power', keySpecValue: '5 kVA - 20 kVA', priceRange: '₹95,000 - ₹3,10,000', moq: '1 Set', deliveryTime: '4-8 Days', warranty: '12 Months / 2000 Hours', extraSpecs: [['Engine', 'Greaves Cotton Engine'], ['Application', 'Construction Sites, Small Businesses'], ['Chassis', 'Skid Mounted']] }
];

// Shared across water cooler / chiller brands — standard storage-litre and cooling-TR ratings.
const WATERCOOLER_LITRE_LADDER = [20, 40, 65, 80, 100, 150, 200, 300];
const CHILLER_TR_LADDER = [3, 5, 7.5, 10, 15, 20, 30, 50];

interface WatercoolerLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  pricePerLitre: number;
  deliveryTime: string;
  warranty: string;
  count?: number;
}

function makeWatercoolerLadderSeeds(def: WatercoolerLadderDef): Seed[] {
  const ladder = WATERCOOLER_LITRE_LADDER.slice(0, def.count ?? WATERCOOLER_LITRE_LADDER.length);
  return ladder.map((litres) => {
    const price = Math.round((litres * def.pricePerLitre) / 500) * 500;
    const coolingRate = Math.round(litres * 0.75);
    const power = Math.round(litres * 12);
    const faucets = litres < 40 ? 1 : litres < 100 ? 2 : litres < 200 ? 3 : 4;
    return {
      id: `${def.idPrefix}-${litres}l`,
      name: `${def.namePrefix} ${def.modelPrefix}${litres} Water Cooler`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'watercooler',
      modelNumber: `${def.modelPrefix}${litres}`,
      keySpecLabel: 'Storage Capacity',
      keySpecValue: `${litres} Litres, ${faucets} Faucet${faucets > 1 ? 's' : ''}`,
      priceRange: `₹${formatIndianPrice(price)} onwards`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Cooling Capacity', `${coolingRate} Liters / Hour`],
        ['Body Material', 'SS Body'],
        ['Power Consumption', `${power} Watts`]
      ]
    } as Seed;
  });
}

interface ChillerLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  pricePerTr: number;
  deliveryTime: string;
  warranty: string;
  count?: number;
}

function makeChillerLadderSeeds(def: ChillerLadderDef): Seed[] {
  const ladder = CHILLER_TR_LADDER.slice(0, def.count ?? CHILLER_TR_LADDER.length);
  return ladder.map((tr) => {
    const price = Math.round((tr * def.pricePerTr) / 5000) * 5000;
    return {
      id: `${def.idPrefix}-${tr}tr`,
      name: `${def.namePrefix} ${def.modelPrefix}${tr}TR Commercial Water Chiller`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'chiller',
      modelNumber: `${def.modelPrefix}${tr}TR`,
      keySpecLabel: 'Cooling Capacity',
      keySpecValue: `${tr} TR`,
      priceRange: `₹${formatIndianPrice(price)} onwards`,
      moq: '1 Set',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Compressor Type', 'Scroll / Screw'],
        ['Refrigerant', 'R-410A / R-134a'],
        ['Application', 'Process & Comfort Cooling']
      ]
    } as Seed;
  });
}

const VOLTAS_WATERCOOLERS_TOPUP: Seed[] = [
  { id: 'voltas-bottled-dispenser', name: 'Voltas Bottled Water Dispenser', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'watercooler', modelNumber: 'VBD-1200', keySpecLabel: 'Storage Capacity', keySpecValue: '20 Litre Bottle Compatible', priceRange: '₹8,500 onwards', moq: '1 Piece', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Cooling Capacity', '5 Liters / Hour'], ['Body Material', 'ABS Plastic'], ['Power Consumption', '90 Watts']] },
  { id: 'voltas-vrf-outdoor', name: 'Voltas VRF Outdoor Unit', brandId: 'voltas', brandMCatId: 'voltas-water-coolers', family: 'chiller', modelNumber: 'VRF-20HP', keySpecLabel: 'Cooling Capacity', keySpecValue: '8 TR - 24 TR', priceRange: '₹5,80,000 - ₹15,50,000', moq: '1 Set', deliveryTime: '15-25 Days', warranty: '18 Months', extraSpecs: [['Compressor Type', 'Inverter Scroll'], ['Refrigerant', 'R-410A'], ['Application', 'Large Commercial Buildings']] }
];

const BLUESTAR_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'bluestar', brandMCatId: 'bluestar-water-coolers', idPrefix: 'bluestar-watercooler',
  namePrefix: 'Blue Star', modelPrefix: 'BWC', pricePerLitre: 950, deliveryTime: '3-6 Days', warranty: '12 Months', count: 7
});
const BLUESTAR_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'bluestar', brandMCatId: 'bluestar-water-coolers', idPrefix: 'bluestar-chiller',
  namePrefix: 'Blue Star', modelPrefix: 'BCH-', pricePerTr: 55000, deliveryTime: '10-18 Days', warranty: '18 Months'
});

const GODREJ_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'godrej', brandMCatId: 'godrej-water-coolers', idPrefix: 'godrej-watercooler',
  namePrefix: 'Godrej', modelPrefix: 'GWC', pricePerLitre: 880, deliveryTime: '3-6 Days', warranty: '12 Months', count: 7
});
const GODREJ_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'godrej', brandMCatId: 'godrej-water-coolers', idPrefix: 'godrej-chiller',
  namePrefix: 'Godrej', modelPrefix: 'GCH-', pricePerTr: 48000, deliveryTime: '10-18 Days', warranty: '18 Months'
});

const CARRIERMIDEA_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'carriermidea', brandMCatId: 'carriermidea-water-coolers', idPrefix: 'carriermidea-watercooler',
  namePrefix: 'Carrier', modelPrefix: 'CWC', pricePerLitre: 1050, deliveryTime: '4-8 Days', warranty: '18 Months', count: 7
});
const CARRIERMIDEA_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'carriermidea', brandMCatId: 'carriermidea-water-coolers', idPrefix: 'carriermidea-chiller',
  namePrefix: 'Carrier', modelPrefix: 'CCH-', pricePerTr: 62000, deliveryTime: '12-20 Days', warranty: '24 Months'
});

const DAIKIN_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'daikin', brandMCatId: 'daikin-water-coolers', idPrefix: 'daikin-watercooler',
  namePrefix: 'Daikin', modelPrefix: 'DWC', pricePerLitre: 1100, deliveryTime: '4-8 Days', warranty: '18 Months', count: 7
});
const DAIKIN_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'daikin', brandMCatId: 'daikin-water-coolers', idPrefix: 'daikin-chiller',
  namePrefix: 'Daikin', modelPrefix: 'DCH-', pricePerTr: 65000, deliveryTime: '12-20 Days', warranty: '24 Months'
});

const WESTERNREF_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'westernref', brandMCatId: 'westernref-water-coolers', idPrefix: 'westernref-watercooler',
  namePrefix: 'Western', modelPrefix: 'WWC', pricePerLitre: 780, deliveryTime: '3-6 Days', warranty: '12 Months', count: 7
});
const WESTERNREF_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'westernref', brandMCatId: 'westernref-water-coolers', idPrefix: 'westernref-chiller',
  namePrefix: 'Western', modelPrefix: 'WCH-', pricePerTr: 42000, deliveryTime: '8-15 Days', warranty: '12 Months'
});

const ROCKWELLIND_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'rockwellind', brandMCatId: 'rockwellind-water-coolers', idPrefix: 'rockwellind-watercooler',
  namePrefix: 'Rockwell', modelPrefix: 'RWC', pricePerLitre: 720, deliveryTime: '3-6 Days', warranty: '12 Months', count: 7
});
const ROCKWELLIND_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'rockwellind', brandMCatId: 'rockwellind-water-coolers', idPrefix: 'rockwellind-chiller',
  namePrefix: 'Rockwell', modelPrefix: 'RCH-', pricePerTr: 38000, deliveryTime: '8-15 Days', warranty: '12 Months'
});

const KELVINATOR_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'kelvinator', brandMCatId: 'kelvinator-water-coolers', idPrefix: 'kelvinator-watercooler',
  namePrefix: 'Kelvinator', modelPrefix: 'KWC', pricePerLitre: 700, deliveryTime: '3-6 Days', warranty: '12 Months', count: 7
});
const KELVINATOR_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'kelvinator', brandMCatId: 'kelvinator-water-coolers', idPrefix: 'kelvinator-chiller',
  namePrefix: 'Kelvinator', modelPrefix: 'KCH-', pricePerTr: 36000, deliveryTime: '8-15 Days', warranty: '12 Months'
});

const CELFROST_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'celfrost', brandMCatId: 'celfrost-water-coolers', idPrefix: 'celfrost-watercooler',
  namePrefix: 'Celfrost', modelPrefix: 'CFWC', pricePerLitre: 690, deliveryTime: '3-7 Days', warranty: '12 Months', count: 7
});
const CELFROST_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'celfrost', brandMCatId: 'celfrost-water-coolers', idPrefix: 'celfrost-chiller',
  namePrefix: 'Celfrost', modelPrefix: 'CFCH-', pricePerTr: 34000, deliveryTime: '8-16 Days', warranty: '12 Months'
});

const FRICKINDIA_WATERCOOLERS: Seed[] = makeWatercoolerLadderSeeds({
  brandId: 'frickindia', brandMCatId: 'frickindia-water-coolers', idPrefix: 'frickindia-watercooler',
  namePrefix: 'Frick', modelPrefix: 'FWC', pricePerLitre: 820, deliveryTime: '4-8 Days', warranty: '12 Months', count: 7
});
const FRICKINDIA_CHILLERS: Seed[] = makeChillerLadderSeeds({
  brandId: 'frickindia', brandMCatId: 'frickindia-water-coolers', idPrefix: 'frickindia-chiller',
  namePrefix: 'Frick', modelPrefix: 'FCH-', pricePerTr: 70000, deliveryTime: '15-25 Days', warranty: '24 Months'
});

// Shared across power tool brands — a canonical lineup of 15 tool types every full-range
// professional power tool brand carries, each with its realistic key spec and price floor.
interface ToolTypeDef { type: string; keySpecLabel: string; keySpecValue: string; priceBase: number; weightKg: number }
const TOOL_TYPE_LADDER: ToolTypeDef[] = [
  { type: 'Angle Grinder', keySpecLabel: 'Power Input', keySpecValue: '2000 Watts', priceBase: 4500, weightKg: 2.3 },
  { type: 'Rotary Hammer Drill', keySpecLabel: 'Power Input', keySpecValue: '1150 Watts', priceBase: 22000, weightKg: 6.8 },
  { type: 'Impact Drill', keySpecLabel: 'Power Input', keySpecValue: '1300 Watts', priceBase: 8500, weightKg: 2.9 },
  { type: 'Circular Saw', keySpecLabel: 'Power Input', keySpecValue: '1400 Watts', priceBase: 9800, weightKg: 3.8 },
  { type: 'Impact Wrench', keySpecLabel: 'Torque', keySpecValue: '400 Nm', priceBase: 18500, weightKg: 1.9 },
  { type: 'Demolition Hammer', keySpecLabel: 'Impact Energy', keySpecValue: '8.3 Joules', priceBase: 35000, weightKg: 6.9 },
  { type: 'Cordless Screwdriver', keySpecLabel: 'Torque', keySpecValue: '30 Nm', priceBase: 6500, weightKg: 0.9 },
  { type: 'Jigsaw', keySpecLabel: 'Power Input', keySpecValue: '650 Watts', priceBase: 7200, weightKg: 2.1 },
  { type: 'Belt Sander', keySpecLabel: 'Power Input', keySpecValue: '950 Watts', priceBase: 8800, weightKg: 3.2 },
  { type: 'Chain Saw', keySpecLabel: 'Power Input', keySpecValue: '2200 Watts', priceBase: 15500, weightKg: 4.6 },
  { type: 'Heat Gun', keySpecLabel: 'Power Input', keySpecValue: '2000 Watts', priceBase: 4200, weightKg: 0.8 },
  { type: 'Die Grinder', keySpecLabel: 'Power Input', keySpecValue: '750 Watts', priceBase: 6800, weightKg: 1.6 },
  { type: 'Random Orbital Sander', keySpecLabel: 'Power Input', keySpecValue: '350 Watts', priceBase: 5200, weightKg: 1.2 },
  { type: 'Electric Planer', keySpecLabel: 'Power Input', keySpecValue: '850 Watts', priceBase: 7500, weightKg: 2.8 },
  { type: 'Tile Cutter', keySpecLabel: 'Blade Diameter', keySpecValue: '180mm', priceBase: 12500, weightKg: 5.4 }
];

interface ToolLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  warranty: string;
  offset?: number;
  count?: number;
}

function makeToolLadderSeeds(def: ToolLadderDef): Seed[] {
  const offset = def.offset ?? 0;
  const types = TOOL_TYPE_LADDER.slice(offset, offset + (def.count ?? TOOL_TYPE_LADDER.length - offset));
  return types.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 100) * 100;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} Professional ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'tool',
      modelNumber: `${def.modelPrefix}${offset + i + 1}`,
      keySpecLabel: t.keySpecLabel,
      keySpecValue: t.keySpecValue,
      priceRange: `₹${formatIndianPrice(price)} - ₹${formatIndianPrice(price * 1.6)}`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Weight', `${t.weightKg} kg`],
        ['Build', 'Heavy-Duty Industrial Grade'],
        ['Application', 'Construction & Workshop Use']
      ]
    } as Seed;
  });
}

const BOSCH_TOOLS_LADDER: Seed[] = makeToolLadderSeeds({
  brandId: 'bosch', brandMCatId: 'bosch-power-tools', idPrefix: 'bosch-tool-ladder',
  namePrefix: 'Bosch', modelPrefix: 'GX', priceMultiplier: 1.0,
  deliveryTime: '2-5 Days', warranty: '12 Months', offset: 7
});

const MAKITA_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'makita', brandMCatId: 'makita-power-tools', idPrefix: 'makita-tool',
  namePrefix: 'Makita', modelPrefix: 'MK-', priceMultiplier: 1.05,
  deliveryTime: '3-6 Days', warranty: '12 Months'
});

const DEWALT_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'dewalt', brandMCatId: 'dewalt-power-tools', idPrefix: 'dewalt-tool',
  namePrefix: 'DeWalt', modelPrefix: 'DW-', priceMultiplier: 1.1,
  deliveryTime: '3-6 Days', warranty: '12 Months'
});

const HIKOKI_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'hikoki', brandMCatId: 'hikoki-power-tools', idPrefix: 'hikoki-tool',
  namePrefix: 'HiKOKI', modelPrefix: 'HK-', priceMultiplier: 0.95,
  deliveryTime: '4-8 Days', warranty: '12 Months'
});

const BLACKDECKER_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'blackdecker', brandMCatId: 'blackdecker-power-tools', idPrefix: 'blackdecker-tool',
  namePrefix: 'Black+Decker', modelPrefix: 'BD-', priceMultiplier: 0.75,
  deliveryTime: '2-5 Days', warranty: '12 Months'
});

const STANLEY_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'stanley', brandMCatId: 'stanley-power-tools', idPrefix: 'stanley-tool',
  namePrefix: 'Stanley', modelPrefix: 'ST-', priceMultiplier: 0.7,
  deliveryTime: '2-5 Days', warranty: '12 Months'
});

const HILTI_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'hilti', brandMCatId: 'hilti-power-tools', idPrefix: 'hilti-tool',
  namePrefix: 'Hilti', modelPrefix: 'TE-', priceMultiplier: 1.6,
  deliveryTime: '5-10 Days', warranty: '24 Months'
});

const METABO_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'metabo', brandMCatId: 'metabo-power-tools', idPrefix: 'metabo-tool',
  namePrefix: 'Metabo', modelPrefix: 'MB-', priceMultiplier: 1.15,
  deliveryTime: '4-8 Days', warranty: '12 Months'
});

const INGCO_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'ingco', brandMCatId: 'ingco-power-tools', idPrefix: 'ingco-tool',
  namePrefix: 'INGCO', modelPrefix: 'IG-', priceMultiplier: 0.55,
  deliveryTime: '3-6 Days', warranty: '6 Months'
});

const TAPARIA_TOOLS: Seed[] = makeToolLadderSeeds({
  brandId: 'taparia', brandMCatId: 'taparia-power-tools', idPrefix: 'taparia-tool',
  namePrefix: 'Taparia', modelPrefix: 'TP-', priceMultiplier: 0.6,
  deliveryTime: '2-5 Days', warranty: '6 Months'
});

// Shared across measuring instrument brands — a canonical lineup of 15 instrument types every
// full-range measuring/surveying instrument brand carries.
interface InstrumentTypeDef { type: string; keySpecLabel: string; keySpecValue: string; priceBase: number; weightKg: number }
const INSTRUMENT_TYPE_LADDER: InstrumentTypeDef[] = [
  { type: 'Auto Level', keySpecLabel: 'Magnification', keySpecValue: '26x', priceBase: 10300, weightKg: 1.7 },
  { type: 'Laser Level', keySpecLabel: 'Working Range', keySpecValue: 'Up to 30m (with receiver)', priceBase: 5100, weightKg: 0.5 },
  { type: 'Laser Distance Meter', keySpecLabel: 'Measuring Range', keySpecValue: 'Up to 150m', priceBase: 18500, weightKg: 0.14 },
  { type: 'Wall Scanner', keySpecLabel: 'Detection Depth', keySpecValue: 'Up to 120mm', priceBase: 22000, weightKg: 0.4 },
  { type: 'Combi Laser', keySpecLabel: 'Self-Leveling Range', keySpecValue: '±4°', priceBase: 28000, weightKg: 0.7 },
  { type: 'Digital Vernier Caliper', keySpecLabel: 'Measuring Range', keySpecValue: '0 - 200mm', priceBase: 3500, weightKg: 0.3 },
  { type: 'Digital Micrometer', keySpecLabel: 'Measuring Range', keySpecValue: '0 - 25mm', priceBase: 4200, weightKg: 0.2 },
  { type: 'Digital Multimeter', keySpecLabel: 'Measuring Range', keySpecValue: 'AC/DC 0 - 1000V', priceBase: 6800, weightKg: 0.35 },
  { type: 'Clamp Meter', keySpecLabel: 'Current Range', keySpecValue: 'AC/DC 0 - 1000A', priceBase: 8500, weightKg: 0.4 },
  { type: 'Infrared Thermal Camera', keySpecLabel: 'Resolution', keySpecValue: '160 x 120 pixels', priceBase: 45000, weightKg: 0.6 },
  { type: 'Total Station', keySpecLabel: 'Angular Accuracy', keySpecValue: '2 - 5 arc seconds', priceBase: 185000, weightKg: 5.2 },
  { type: 'Ultrasonic Thickness Gauge', keySpecLabel: 'Measuring Range', keySpecValue: '1.2 - 225mm', priceBase: 32000, weightKg: 0.4 },
  { type: 'Torque Wrench Tester', keySpecLabel: 'Torque Range', keySpecValue: '5 - 1000 Nm', priceBase: 26000, weightKg: 2.1 },
  { type: 'Dial Gauge Indicator', keySpecLabel: 'Measuring Range', keySpecValue: '0 - 10mm', priceBase: 2200, weightKg: 0.15 },
  { type: 'Sound Level Meter', keySpecLabel: 'Measuring Range', keySpecValue: '30 - 130 dB', priceBase: 14500, weightKg: 0.3 }
];

interface InstrumentLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  warranty: string;
  offset?: number;
  count?: number;
}

function makeInstrumentLadderSeeds(def: InstrumentLadderDef): Seed[] {
  const offset = def.offset ?? 0;
  const types = INSTRUMENT_TYPE_LADDER.slice(offset, offset + (def.count ?? INSTRUMENT_TYPE_LADDER.length - offset));
  return types.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 100) * 100;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'survey',
      modelNumber: `${def.modelPrefix}${offset + i + 1}`,
      keySpecLabel: t.keySpecLabel,
      keySpecValue: t.keySpecValue,
      priceRange: `₹${formatIndianPrice(price)} - ₹${formatIndianPrice(price * 1.5)}`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Weight', `${t.weightKg} kg`],
        ['Build', 'Precision Calibrated'],
        ['Application', 'Construction Layout & Quality Inspection']
      ]
    } as Seed;
  });
}

const BOSCH_SURVEY_LADDER: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'bosch', brandMCatId: 'bosch-surveying', idPrefix: 'bosch-survey-ladder',
  namePrefix: 'Bosch Professional', modelPrefix: 'GX', priceMultiplier: 1.0,
  deliveryTime: '2-5 Days', warranty: '12 Months', offset: 5, count: 9
});

const MITUTOYO_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'mitutoyo', brandMCatId: 'mitutoyo-surveying', idPrefix: 'mitutoyo-instrument',
  namePrefix: 'Mitutoyo', modelPrefix: 'MT-', priceMultiplier: 1.2,
  deliveryTime: '4-8 Days', warranty: '12 Months'
});

const FLUKE_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'fluke', brandMCatId: 'fluke-surveying', idPrefix: 'fluke-instrument',
  namePrefix: 'Fluke', modelPrefix: 'FL-', priceMultiplier: 1.35,
  deliveryTime: '5-10 Days', warranty: '24 Months'
});

const YOKOGAWA_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'yokogawa', brandMCatId: 'yokogawa-surveying', idPrefix: 'yokogawa-instrument',
  namePrefix: 'Yokogawa', modelPrefix: 'YK-', priceMultiplier: 1.3,
  deliveryTime: '6-12 Days', warranty: '24 Months'
});

const TESTO_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'testo', brandMCatId: 'testo-surveying', idPrefix: 'testo-instrument',
  namePrefix: 'Testo', modelPrefix: 'TS-', priceMultiplier: 1.15,
  deliveryTime: '4-9 Days', warranty: '24 Months'
});

const HTCINSTRUMENTS_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'htcinstruments', brandMCatId: 'htcinstruments-surveying', idPrefix: 'htcinstruments-instrument',
  namePrefix: 'HTC', modelPrefix: 'HTC-', priceMultiplier: 0.8,
  deliveryTime: '3-6 Days', warranty: '12 Months'
});

const KEYSIGHT_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'keysight', brandMCatId: 'keysight-surveying', idPrefix: 'keysight-instrument',
  namePrefix: 'Keysight', modelPrefix: 'KS-', priceMultiplier: 1.5,
  deliveryTime: '8-15 Days', warranty: '36 Months'
});

const MAHR_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'mahr', brandMCatId: 'mahr-surveying', idPrefix: 'mahr-instrument',
  namePrefix: 'Mahr', modelPrefix: 'MH-', priceMultiplier: 1.25,
  deliveryTime: '6-12 Days', warranty: '24 Months'
});

const INSIZE_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'insize', brandMCatId: 'insize-surveying', idPrefix: 'insize-instrument',
  namePrefix: 'Insize', modelPrefix: 'IS-', priceMultiplier: 0.65,
  deliveryTime: '3-7 Days', warranty: '12 Months'
});

const KUSAMMECO_INSTRUMENTS: Seed[] = makeInstrumentLadderSeeds({
  brandId: 'kusammeco', brandMCatId: 'kusammeco-surveying', idPrefix: 'kusammeco-instrument',
  namePrefix: 'Kusam Meco', modelPrefix: 'KM-', priceMultiplier: 0.7,
  deliveryTime: '3-6 Days', warranty: '12 Months'
});

// Shared across automation brands — a canonical lineup of 15 automation product types every
// full-range industrial automation brand carries.
interface AutomationTypeDef { type: string; keySpecLabel: string; keySpecValue: string; priceBase: number }
const AUTOMATION_TYPE_LADDER: AutomationTypeDef[] = [
  { type: 'Compact PLC', keySpecLabel: 'Digital I/O', keySpecValue: '24 DI / 16 DO Onboard', priceBase: 15000 },
  { type: 'Modular PLC', keySpecLabel: 'Architecture', keySpecValue: 'Modular, Expandable I/O', priceBase: 65000 },
  { type: 'Micro AC Drive', keySpecLabel: 'Motor Power', keySpecValue: '0.12 kW - 15 kW', priceBase: 8500 },
  { type: 'Industrial AC Drive', keySpecLabel: 'Motor Power', keySpecValue: '5.5 kW - 132 kW', priceBase: 45000 },
  { type: 'HMI Touch Panel', keySpecLabel: 'Display Size', keySpecValue: '7-inch Touch', priceBase: 28000 },
  { type: 'Safety Relay', keySpecLabel: 'Safety Category', keySpecValue: 'Up to PLe / SIL3', priceBase: 9500 },
  { type: 'Industrial Ethernet Switch', keySpecLabel: 'Ports', keySpecValue: '8-Port Managed', priceBase: 16000 },
  { type: 'Power Supply Module', keySpecLabel: 'Output Current', keySpecValue: 'Up to 40A', priceBase: 11000 },
  { type: 'Servo Drive', keySpecLabel: 'Rated Power', keySpecValue: '0.4 kW - 7.5 kW', priceBase: 32000 },
  { type: 'Servo Motor', keySpecLabel: 'Rated Power', keySpecValue: '0.2 kW - 5 kW', priceBase: 24000 },
  { type: 'Motion Controller', keySpecLabel: 'Axes', keySpecValue: 'Up to 32 Axes', priceBase: 55000 },
  { type: 'Industrial PC', keySpecLabel: 'Processor', keySpecValue: 'Intel Core i5, Fanless', priceBase: 68000 },
  { type: 'Remote I/O Module', keySpecLabel: 'Channels', keySpecValue: '16 - 32 Channels', priceBase: 19000 },
  { type: 'Proximity Sensor', keySpecLabel: 'Sensing Range', keySpecValue: '2mm - 40mm', priceBase: 1200 },
  { type: 'Photoelectric Sensor', keySpecLabel: 'Sensing Range', keySpecValue: 'Up to 60m', priceBase: 1800 }
];

interface AutomationLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  warranty: string;
  offset?: number;
  count?: number;
}

function makeAutomationLadderSeeds(def: AutomationLadderDef): Seed[] {
  const offset = def.offset ?? 0;
  const types = AUTOMATION_TYPE_LADDER.slice(offset, offset + (def.count ?? AUTOMATION_TYPE_LADDER.length - offset));
  return types.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 100) * 100;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'automation',
      modelNumber: `${def.modelPrefix}${offset + i + 1}`,
      keySpecLabel: t.keySpecLabel,
      keySpecValue: t.keySpecValue,
      priceRange: `₹${formatIndianPrice(price)} - ₹${formatIndianPrice(price * 3.2)}`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Communication', 'PROFINET / EtherNet-IP / Modbus'],
        ['Mounting', 'DIN Rail / Panel Mount'],
        ['Application', 'Manufacturing & Process Automation']
      ]
    } as Seed;
  });
}

const SIEMENS_AUTOMATION_TOPUP: Seed[] = [
  { id: 'siemens-simatic-ipc', name: 'Siemens SIMATIC Industrial PC', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: 'IPC627E', keySpecLabel: 'Processor', keySpecValue: 'Intel Core i5, Fanless', priceRange: '₹68,000 - ₹1,85,000', moq: '1 Piece', deliveryTime: '5-9 Days', warranty: '12 Months', extraSpecs: [['Communication', 'PROFINET / Ethernet'], ['Mounting', 'Panel / Rack Mount'], ['Application', 'SCADA & HMI Host']] },
  { id: 'siemens-proximity-sensor', name: 'Siemens Proximity Sensor', brandId: 'siemens', brandMCatId: 'siemens-automation', family: 'automation', modelNumber: '3RG4', keySpecLabel: 'Sensing Range', keySpecValue: '2mm - 40mm', priceRange: '₹1,200 - ₹4,800', moq: '5 Pieces', deliveryTime: '2-5 Days', warranty: '12 Months', extraSpecs: [['Output Type', 'PNP / NPN'], ['Protection', 'IP67'], ['Application', 'Machine Control & Detection']] }
];

const ROCKWELLAUTOMATION_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'rockwellautomation', brandMCatId: 'rockwellautomation-automation', idPrefix: 'rockwellautomation-item',
  namePrefix: 'Allen-Bradley', modelPrefix: 'AB-', priceMultiplier: 1.25,
  deliveryTime: '6-12 Days', warranty: '18 Months'
});

const SCHNEIDERELECTRIC_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'schneiderelectric', brandMCatId: 'schneiderelectric-automation', idPrefix: 'schneiderelectric-item',
  namePrefix: 'Schneider Electric', modelPrefix: 'SE-', priceMultiplier: 1.1,
  deliveryTime: '5-10 Days', warranty: '18 Months'
});

const MITSUBISHIELECTRIC_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'mitsubishielectric', brandMCatId: 'mitsubishielectric-automation', idPrefix: 'mitsubishielectric-item',
  namePrefix: 'Mitsubishi Electric', modelPrefix: 'ME-', priceMultiplier: 1.15,
  deliveryTime: '6-12 Days', warranty: '18 Months'
});

const OMRON_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'omron', brandMCatId: 'omron-automation', idPrefix: 'omron-item',
  namePrefix: 'Omron', modelPrefix: 'OM-', priceMultiplier: 1.05,
  deliveryTime: '5-10 Days', warranty: '18 Months'
});

const DELTAELECTRONICS_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'deltaelectronics', brandMCatId: 'deltaelectronics-automation', idPrefix: 'deltaelectronics-item',
  namePrefix: 'Delta Electronics', modelPrefix: 'DE-', priceMultiplier: 0.85,
  deliveryTime: '5-10 Days', warranty: '12 Months'
});

const HONEYWELL_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'honeywell', brandMCatId: 'honeywell-automation', idPrefix: 'honeywell-item',
  namePrefix: 'Honeywell', modelPrefix: 'HW-', priceMultiplier: 1.3,
  deliveryTime: '8-14 Days', warranty: '24 Months'
});

const ABB_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'abb', brandMCatId: 'abb-automation', idPrefix: 'abb-automation-item',
  namePrefix: 'ABB', modelPrefix: 'ABBA-', priceMultiplier: 1.2,
  deliveryTime: '6-12 Days', warranty: '24 Months'
});

const GE_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'ge', brandMCatId: 'ge-automation', idPrefix: 'ge-automation-item',
  namePrefix: 'GE', modelPrefix: 'GEA-', priceMultiplier: 1.1,
  deliveryTime: '8-14 Days', warranty: '24 Months'
});

const YOKOGAWA_AUTOMATION: Seed[] = makeAutomationLadderSeeds({
  brandId: 'yokogawa', brandMCatId: 'yokogawa-automation', idPrefix: 'yokogawa-automation-item',
  namePrefix: 'Yokogawa', modelPrefix: 'YKA-', priceMultiplier: 1.2,
  deliveryTime: '6-12 Days', warranty: '24 Months'
});

// Shared across cable brands — standard IS 694 / IS 7098 conductor cross-section (sq mm) sizes.
const CABLE_SQMM_LADDER = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

interface CableLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  cableTypeName: string;
  pricePerSqmm: number;
  deliveryTime: string;
  warranty: string;
  count?: number;
}

function makeCableLadderSeeds(def: CableLadderDef): Seed[] {
  const ladder = CABLE_SQMM_LADDER.slice(0, def.count ?? CABLE_SQMM_LADDER.length);
  return ladder.map((sqmm) => {
    const price = Math.round(sqmm * def.pricePerSqmm);
    return {
      id: `${def.idPrefix}-${sqmm}sqmm`,
      name: `${def.namePrefix} ${def.cableTypeName} ${sqmm} Sq mm`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'cable',
      modelNumber: `${def.modelPrefix}${sqmm}`,
      keySpecLabel: 'Conductor Size',
      keySpecValue: `${sqmm} sq mm`,
      priceRange: `₹${price} - ₹${Math.round(price * 1.4)} per meter`,
      moq: '100 Meters',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Voltage Grade', 'Up to 1.1 kV'],
        ['Conductor', 'Electrolytic Copper / Aluminium'],
        ['Insulation', 'Cross-linked Polyethylene (XLPE)']
      ]
    } as Seed;
  });
}

const HAVELLS_CABLES_LADDER: Seed[] = makeCableLadderSeeds({
  brandId: 'havells', brandMCatId: 'havells-cables', idPrefix: 'havells-cable-ladder',
  namePrefix: 'Havells', modelPrefix: 'HLT-', cableTypeName: 'LT Armoured Cable',
  pricePerSqmm: 42, deliveryTime: '5-10 Days', warranty: '12 Months', count: 12
});

const POLYCAB_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'polycab', brandMCatId: 'polycab-cables', idPrefix: 'polycab-cable',
  namePrefix: 'Polycab', modelPrefix: 'PXL-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 48, deliveryTime: '5-10 Days', warranty: '12 Months'
});

const KEI_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'kei', brandMCatId: 'kei-cables', idPrefix: 'kei-cable',
  namePrefix: 'KEI', modelPrefix: 'KXL-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 46, deliveryTime: '5-10 Days', warranty: '12 Months'
});

const FINOLEXCABLES_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'finolexcables', brandMCatId: 'finolexcables-cables', idPrefix: 'finolexcables-cable',
  namePrefix: 'Finolex', modelPrefix: 'FXL-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 45, deliveryTime: '5-9 Days', warranty: '12 Months'
});

const RRKABEL_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'rrkabel', brandMCatId: 'rrkabel-cables', idPrefix: 'rrkabel-cable',
  namePrefix: 'RR Kabel', modelPrefix: 'RXL-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 43, deliveryTime: '5-9 Days', warranty: '12 Months'
});

const VGUARD_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'vguard', brandMCatId: 'vguard-cables', idPrefix: 'vguard-cable',
  namePrefix: 'V-Guard', modelPrefix: 'VXL-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 41, deliveryTime: '4-9 Days', warranty: '12 Months'
});

const UNIVERSALCABLES_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'universalcables', brandMCatId: 'universalcables-cables', idPrefix: 'universalcables-cable',
  namePrefix: 'Universal', modelPrefix: 'UXL-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 47, deliveryTime: '5-10 Days', warranty: '18 Months'
});

const APARINDUSTRIES_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'aparindustries', brandMCatId: 'aparindustries-cables', idPrefix: 'aparindustries-cable',
  namePrefix: 'Apar', modelPrefix: 'AXL-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 49, deliveryTime: '6-12 Days', warranty: '18 Months'
});

const TORRENTCABLES_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'torrentcables', brandMCatId: 'torrentcables-cables', idPrefix: 'torrentcables-cable',
  namePrefix: 'Torrent', modelPrefix: 'TXL-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 44, deliveryTime: '6-12 Days', warranty: '12 Months'
});

const PARAMOUNTCOMMUNICATIONS_CABLES: Seed[] = makeCableLadderSeeds({
  brandId: 'paramountcommunications', brandMCatId: 'paramountcommunications-cables', idPrefix: 'paramountcommunications-cable',
  namePrefix: 'Paramount', modelPrefix: 'PMX-', cableTypeName: 'XLPE Power Cable',
  pricePerSqmm: 40, deliveryTime: '5-10 Days', warranty: '12 Months'
});

// Shared across switchgear brands — a canonical lineup of 15 switchgear product types every
// full-range LT/MV switchgear brand carries.
interface SwitchgearTypeDef { type: string; keySpecLabel: string; keySpecValue: string; priceBase: number }
const SWITCHGEAR_TYPE_LADDER: SwitchgearTypeDef[] = [
  { type: 'MCCB (Moulded Case Circuit Breaker)', keySpecLabel: 'Rated Current', keySpecValue: '16A - 630A', priceBase: 3200 },
  { type: 'MCB (Miniature Circuit Breaker)', keySpecLabel: 'Rated Current', keySpecValue: '0.5A - 63A', priceBase: 250 },
  { type: 'TPN Distribution Board', keySpecLabel: 'Ways', keySpecValue: '4 - 36 Ways', priceBase: 2500 },
  { type: 'Power Contactor', keySpecLabel: 'Rated Current', keySpecValue: '9A - 800A', priceBase: 1200 },
  { type: 'Switch Disconnector Isolator', keySpecLabel: 'Rated Current', keySpecValue: '16A - 800A', priceBase: 1800 },
  { type: 'ACB (Air Circuit Breaker)', keySpecLabel: 'Rated Current', keySpecValue: '630A - 6300A', priceBase: 45000 },
  { type: 'ELCB/RCCB', keySpecLabel: 'Rated Current', keySpecValue: '16A - 63A', priceBase: 1500 },
  { type: 'Change Over Switch', keySpecLabel: 'Rated Current', keySpecValue: '32A - 800A', priceBase: 4500 },
  { type: 'Bus Bar Trunking System', keySpecLabel: 'Rated Current', keySpecValue: '100A - 5000A', priceBase: 8500 },
  { type: 'Surge Protection Device', keySpecLabel: 'Rated Voltage', keySpecValue: '275V - 440V', priceBase: 3800 },
  { type: 'Timer Relay', keySpecLabel: 'Time Range', keySpecValue: '0.1s - 100h', priceBase: 850 },
  { type: 'Motor Protection Circuit Breaker', keySpecLabel: 'Rated Current', keySpecValue: '0.1A - 100A', priceBase: 2200 },
  { type: 'Power Factor Capacitor Bank', keySpecLabel: 'Rated kVAR', keySpecValue: '5 - 500 kVAR', priceBase: 12000 },
  { type: 'Enclosure Panel Board', keySpecLabel: 'Protection', keySpecValue: 'IP54 - IP65', priceBase: 6500 },
  { type: 'Push Button Station', keySpecLabel: 'Configuration', keySpecValue: '1 - 4 Buttons', priceBase: 450 }
];

interface SwitchgearLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  warranty: string;
  offset?: number;
  count?: number;
}

function makeSwitchgearLadderSeeds(def: SwitchgearLadderDef): Seed[] {
  const offset = def.offset ?? 0;
  const types = SWITCHGEAR_TYPE_LADDER.slice(offset, offset + (def.count ?? SWITCHGEAR_TYPE_LADDER.length - offset));
  return types.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 10) * 10;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'switchgear',
      modelNumber: `${def.modelPrefix}${offset + i + 1}`,
      keySpecLabel: t.keySpecLabel,
      keySpecValue: t.keySpecValue,
      priceRange: `₹${formatIndianPrice(price)} - ₹${formatIndianPrice(price * 8)}`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Breaking Capacity', 'Up to 50 kA'],
        ['Poles', '3-Pole / 4-Pole'],
        ['Application', 'Power Distribution Panels']
      ]
    } as Seed;
  });
}

const HAVELLS_SWITCHGEAR_LADDER: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'havells', brandMCatId: 'havells-switchgear', idPrefix: 'havells-switchgear-ladder',
  namePrefix: 'Havells', modelPrefix: 'HSW-', priceMultiplier: 1.0,
  deliveryTime: '3-7 Days', warranty: '18 Months', offset: 6, count: 9
});

const LTELECTRICAL_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'ltelectrical', brandMCatId: 'ltelectrical-switchgear', idPrefix: 'ltelectrical-switchgear',
  namePrefix: 'L&T', modelPrefix: 'LTE-', priceMultiplier: 1.15,
  deliveryTime: '5-10 Days', warranty: '18 Months'
});

const LEGRAND_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'legrand', brandMCatId: 'legrand-switchgear', idPrefix: 'legrand-switchgear',
  namePrefix: 'Legrand', modelPrefix: 'LG-', priceMultiplier: 1.2,
  deliveryTime: '5-10 Days', warranty: '18 Months'
});

const CSELECTRIC_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'cselectric', brandMCatId: 'cselectric-switchgear', idPrefix: 'cselectric-switchgear',
  namePrefix: 'C&S Electric', modelPrefix: 'CS-', priceMultiplier: 0.9,
  deliveryTime: '4-9 Days', warranty: '12 Months'
});

const EATON_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'eaton', brandMCatId: 'eaton-switchgear', idPrefix: 'eaton-switchgear',
  namePrefix: 'Eaton', modelPrefix: 'EA-', priceMultiplier: 1.25,
  deliveryTime: '6-12 Days', warranty: '24 Months'
});

const STANDARDELECTRICALS_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'standardelectricals', brandMCatId: 'standardelectricals-switchgear', idPrefix: 'standardelectricals-switchgear',
  namePrefix: 'Standard', modelPrefix: 'SE-', priceMultiplier: 0.75,
  deliveryTime: '3-7 Days', warranty: '12 Months'
});

const SIEMENS_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'siemens', brandMCatId: 'siemens-switchgear', idPrefix: 'siemens-switchgear-item',
  namePrefix: 'Siemens', modelPrefix: 'SSW-', priceMultiplier: 1.3,
  deliveryTime: '5-9 Days', warranty: '18 Months'
});

const ABB_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'abb', brandMCatId: 'abb-switchgear', idPrefix: 'abb-switchgear-item',
  namePrefix: 'ABB', modelPrefix: 'ASW-', priceMultiplier: 1.35,
  deliveryTime: '6-12 Days', warranty: '24 Months'
});

const SCHNEIDERELECTRIC_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'schneiderelectric', brandMCatId: 'schneiderelectric-switchgear', idPrefix: 'schneiderelectric-switchgear-item',
  namePrefix: 'Schneider Electric', modelPrefix: 'SEW-', priceMultiplier: 1.2,
  deliveryTime: '5-10 Days', warranty: '18 Months'
});

const GE_SWITCHGEAR: Seed[] = makeSwitchgearLadderSeeds({
  brandId: 'ge', brandMCatId: 'ge-switchgear', idPrefix: 'ge-switchgear-item',
  namePrefix: 'GE', modelPrefix: 'GSW-', priceMultiplier: 1.1,
  deliveryTime: '8-14 Days', warranty: '24 Months'
});

// Shared across solar brands — a canonical lineup of 15 solar equipment product types every
// full-range solar equipment brand carries.
interface SolarTypeDef { type: string; keySpecLabel: string; keySpecValue: string; priceBase: number; warranty: string }
const SOLAR_TYPE_LADDER: SolarTypeDef[] = [
  { type: 'Solar String Inverter', keySpecLabel: 'Capacity', keySpecValue: '3 kW - 100 kW', priceBase: 42000, warranty: '60 Months' },
  { type: 'Mono PERC Solar Panel', keySpecLabel: 'Capacity', keySpecValue: '540 Wp', priceBase: 12500, warranty: '120 Months' },
  { type: 'Solar Charge Controller', keySpecLabel: 'Capacity', keySpecValue: '12V/24V - 60A', priceBase: 6500, warranty: '36 Months' },
  { type: 'Solar Micro Inverter', keySpecLabel: 'Capacity', keySpecValue: '250W - 500W', priceBase: 8500, warranty: '120 Months' },
  { type: 'Bifacial Solar Panel', keySpecLabel: 'Capacity', keySpecValue: '545 Wp', priceBase: 14500, warranty: '120 Months' },
  { type: 'Lithium Solar Battery', keySpecLabel: 'Capacity', keySpecValue: '100 Ah - 200 Ah', priceBase: 32000, warranty: '60 Months' },
  { type: 'Solar Pump Controller', keySpecLabel: 'Capacity', keySpecValue: '1 HP - 10 HP', priceBase: 18500, warranty: '36 Months' },
  { type: 'Solar Mounting Structure', keySpecLabel: 'Capacity', keySpecValue: '1 kW - 10 kW', priceBase: 9500, warranty: '120 Months' },
  { type: 'Hybrid Solar Inverter', keySpecLabel: 'Capacity', keySpecValue: '3 kW - 50 kW', priceBase: 55000, warranty: '60 Months' },
  { type: 'Solar DC Combiner Box', keySpecLabel: 'Strings', keySpecValue: '4 - 16 Strings', priceBase: 7500, warranty: '36 Months' },
  { type: 'Solar DC Cable (100m Coil)', keySpecLabel: 'Cross Section', keySpecValue: '4 sq mm - 6 sq mm', priceBase: 4500, warranty: '12 Months' },
  { type: 'Solar Junction Box', keySpecLabel: 'Protection', keySpecValue: 'IP67', priceBase: 2500, warranty: '24 Months' },
  { type: 'Off-Grid Solar Inverter', keySpecLabel: 'Capacity', keySpecValue: '1 kW - 10 kW', priceBase: 24000, warranty: '36 Months' },
  { type: 'Solar Tracker System', keySpecLabel: 'Capacity', keySpecValue: '5 kW - 50 kW', priceBase: 85000, warranty: '60 Months' },
  { type: 'Solar Monitoring System', keySpecLabel: 'Connectivity', keySpecValue: 'WiFi / GPRS App', priceBase: 12000, warranty: '24 Months' }
];

interface SolarLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  offset?: number;
  count?: number;
}

function makeSolarLadderSeeds(def: SolarLadderDef): Seed[] {
  const offset = def.offset ?? 0;
  const types = SOLAR_TYPE_LADDER.slice(offset, offset + (def.count ?? SOLAR_TYPE_LADDER.length - offset));
  return types.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 100) * 100;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'solar',
      modelNumber: `${def.modelPrefix}${offset + i + 1}`,
      keySpecLabel: t.keySpecLabel,
      keySpecValue: t.keySpecValue,
      priceRange: `₹${formatIndianPrice(price)} - ₹${formatIndianPrice(price * 6)}`,
      moq: '1 Piece',
      deliveryTime: def.deliveryTime,
      warranty: t.warranty,
      extraSpecs: [
        ['Max Efficiency', 'Up to 21.5%'],
        ['Monitoring', 'App-Based Monitoring Available'],
        ['Application', 'Rooftop & Utility-Scale Solar Installations']
      ]
    } as Seed;
  });
}

const HAVELLS_SOLAR_LADDER: Seed[] = makeSolarLadderSeeds({
  brandId: 'havells', brandMCatId: 'havells-solar', idPrefix: 'havells-solar-ladder',
  namePrefix: 'Havells', modelPrefix: 'HSOL-', priceMultiplier: 1.0,
  deliveryTime: '5-10 Days', offset: 3, count: 12
});

const WAAREE_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'waaree', brandMCatId: 'waaree-solar', idPrefix: 'waaree-solar',
  namePrefix: 'Waaree', modelPrefix: 'WR-', priceMultiplier: 1.05,
  deliveryTime: '6-12 Days'
});

const ADANISOLAR_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'adanisolar', brandMCatId: 'adanisolar-solar', idPrefix: 'adanisolar-solar',
  namePrefix: 'Adani Solar', modelPrefix: 'AD-', priceMultiplier: 1.1,
  deliveryTime: '6-12 Days'
});

const TATAPOWERSOLAR_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'tatapowersolar', brandMCatId: 'tatapowersolar-solar', idPrefix: 'tatapowersolar-solar',
  namePrefix: 'Tata Power Solar', modelPrefix: 'TPS-', priceMultiplier: 1.15,
  deliveryTime: '6-12 Days'
});

const VIKRAMSOLAR_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'vikramsolar', brandMCatId: 'vikramsolar-solar', idPrefix: 'vikramsolar-solar',
  namePrefix: 'Vikram Solar', modelPrefix: 'VS-', priceMultiplier: 1.0,
  deliveryTime: '6-12 Days'
});

const LUMINOUS_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'luminous', brandMCatId: 'luminous-solar', idPrefix: 'luminous-solar',
  namePrefix: 'Luminous', modelPrefix: 'LM-', priceMultiplier: 0.9,
  deliveryTime: '4-9 Days'
});

const GOLDISOLAR_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'goldisolar', brandMCatId: 'goldisolar-solar', idPrefix: 'goldisolar-solar',
  namePrefix: 'Goldi Solar', modelPrefix: 'GS-', priceMultiplier: 0.95,
  deliveryTime: '5-10 Days'
});

const RENEWSYS_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'renewsys', brandMCatId: 'renewsys-solar', idPrefix: 'renewsys-solar',
  namePrefix: 'RenewSys', modelPrefix: 'RS-', priceMultiplier: 0.98,
  deliveryTime: '5-10 Days'
});

const EMMVEE_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'emmvee', brandMCatId: 'emmvee-solar', idPrefix: 'emmvee-solar',
  namePrefix: 'EMMVEE', modelPrefix: 'EM-', priceMultiplier: 0.92,
  deliveryTime: '5-10 Days'
});

const PREMIERENERGIES_SOLAR: Seed[] = makeSolarLadderSeeds({
  brandId: 'premierenergies', brandMCatId: 'premierenergies-solar', idPrefix: 'premierenergies-solar',
  namePrefix: 'Premier Energies', modelPrefix: 'PE-', priceMultiplier: 0.97,
  deliveryTime: '6-12 Days'
});

// Shared across cement brands — a canonical lineup of 15 cement product types every full-range
// cement manufacturer carries, spanning bagged OPC/PPC grades through Ready Mix Concrete.
interface CementTypeDef { type: string; keySpecLabel: string; keySpecValue: string; priceBase: number; unit: string }
const CEMENT_TYPE_LADDER: CementTypeDef[] = [
  { type: 'OPC 43 Grade Cement', keySpecLabel: 'Compressive Strength', keySpecValue: '43 MPa (28 Days)', priceBase: 380, unit: '50kg Bag' },
  { type: 'OPC 53 Grade Cement', keySpecLabel: 'Compressive Strength', keySpecValue: '53 MPa (28 Days)', priceBase: 400, unit: '50kg Bag' },
  { type: 'Portland Pozzolana Cement (PPC)', keySpecLabel: 'Compressive Strength', keySpecValue: '33 MPa (28 Days)', priceBase: 360, unit: '50kg Bag' },
  { type: 'Portland Slag Cement (PSC)', keySpecLabel: 'Compressive Strength', keySpecValue: '33 MPa (28 Days)', priceBase: 355, unit: '50kg Bag' },
  { type: 'White Cement', keySpecLabel: 'Whiteness Index', keySpecValue: '90%+', priceBase: 1800, unit: '40kg Bag' },
  { type: 'Sulphate Resisting Cement', keySpecLabel: 'Compressive Strength', keySpecValue: '43 MPa (28 Days)', priceBase: 420, unit: '50kg Bag' },
  { type: 'Rapid Hardening Cement', keySpecLabel: 'Compressive Strength', keySpecValue: '43 MPa (72 Hours)', priceBase: 430, unit: '50kg Bag' },
  { type: 'Low Heat Cement', keySpecLabel: 'Heat of Hydration', keySpecValue: 'Low (Dam & Mass Concrete)', priceBase: 410, unit: '50kg Bag' },
  { type: 'Masonry Cement', keySpecLabel: 'Compressive Strength', keySpecValue: '5 MPa (28 Days)', priceBase: 320, unit: '50kg Bag' },
  { type: 'Oil Well Cement (Class G)', keySpecLabel: 'API Classification', keySpecValue: 'API Class G', priceBase: 650, unit: '50kg Bag' },
  { type: 'Ready Mix Concrete M20', keySpecLabel: 'Concrete Grade', keySpecValue: 'M20', priceBase: 4200, unit: 'Cubic Meter' },
  { type: 'Ready Mix Concrete M25', keySpecLabel: 'Concrete Grade', keySpecValue: 'M25', priceBase: 4500, unit: 'Cubic Meter' },
  { type: 'Ready Mix Concrete M30', keySpecLabel: 'Concrete Grade', keySpecValue: 'M30', priceBase: 4800, unit: 'Cubic Meter' },
  { type: 'Waterproof Cement Blend', keySpecLabel: 'Water Absorption', keySpecValue: '<6% (Water Repellent)', priceBase: 450, unit: '50kg Bag' },
  { type: 'Instant Set Quick-Repair Cement', keySpecLabel: 'Setting Time', keySpecValue: '15 Minutes', priceBase: 850, unit: '40kg Bag' }
];

interface CementLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  warranty: string;
}

function makeCementLadderSeeds(def: CementLadderDef): Seed[] {
  return CEMENT_TYPE_LADDER.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 5) * 5;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'construction',
      modelNumber: `${def.modelPrefix}${i + 1}`,
      keySpecLabel: t.keySpecLabel,
      keySpecValue: t.keySpecValue,
      priceRange: `₹${formatIndianPrice(price)} per ${t.unit}`,
      moq: t.unit === 'Cubic Meter' ? '5 Cubic Meters' : '100 Bags',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Packaging', t.unit.includes('Bag') ? 'HDPE Woven / Paper Bag' : 'Bulk Transit Mixer Delivery'],
        ['Setting Time', 'Initial 30 min / Final 600 min (typical)'],
        ['Application', 'Structural & General Construction']
      ]
    } as Seed;
  });
}

const ULTRATECH_CEMENT: Seed[] = makeCementLadderSeeds({
  brandId: 'ultratech', brandMCatId: 'ultratech-construction', idPrefix: 'ultratech-cement',
  namePrefix: 'UltraTech', modelPrefix: 'UTC-', priceMultiplier: 1.1,
  deliveryTime: '2-5 Days', warranty: 'N/A - Consumable Material'
});

const AMBUJA_CEMENT: Seed[] = makeCementLadderSeeds({
  brandId: 'ambuja', brandMCatId: 'ambuja-construction', idPrefix: 'ambuja-cement',
  namePrefix: 'Ambuja', modelPrefix: 'AMB-', priceMultiplier: 1.05,
  deliveryTime: '2-5 Days', warranty: 'N/A - Consumable Material'
});

const ACCCEMENT_CEMENT: Seed[] = makeCementLadderSeeds({
  brandId: 'acccement', brandMCatId: 'acccement-construction', idPrefix: 'acccement-cement',
  namePrefix: 'ACC', modelPrefix: 'ACC-', priceMultiplier: 1.0,
  deliveryTime: '2-5 Days', warranty: 'N/A - Consumable Material'
});

const JKCEMENT_CEMENT: Seed[] = makeCementLadderSeeds({
  brandId: 'jkcement', brandMCatId: 'jkcement-construction', idPrefix: 'jkcement-cement',
  namePrefix: 'JK', modelPrefix: 'JKC-', priceMultiplier: 0.98,
  deliveryTime: '3-6 Days', warranty: 'N/A - Consumable Material'
});

const SHREECEMENT_CEMENT: Seed[] = makeCementLadderSeeds({
  brandId: 'shreecement', brandMCatId: 'shreecement-construction', idPrefix: 'shreecement-cement',
  namePrefix: 'Shree', modelPrefix: 'SHC-', priceMultiplier: 0.95,
  deliveryTime: '3-6 Days', warranty: 'N/A - Consumable Material'
});

// Shared across TMT/steel brands — standard rebar diameters (mm) per IS 1786.
const TMT_DIAMETER_LADDER = [6, 8, 10, 12, 16, 20, 25, 28, 32, 36, 40];

interface TmtLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  feGrade: string;
  pricePerMm: number;
  deliveryTime: string;
  warranty: string;
}

function makeTmtLadderSeeds(def: TmtLadderDef): Seed[] {
  return TMT_DIAMETER_LADDER.map((mm) => {
    const price = Math.round((mm * def.pricePerMm) / 100) * 100;
    return {
      id: `${def.idPrefix}-${mm}mm`,
      name: `${def.namePrefix} ${def.modelPrefix}${mm} TMT Rebar (${def.feGrade})`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'construction',
      modelNumber: `${def.modelPrefix}${mm}`,
      keySpecLabel: 'Bar Diameter',
      keySpecValue: `${mm}mm`,
      priceRange: `₹${formatIndianPrice(price)} per Quintal`,
      moq: '5 Tonnes',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Grade', def.feGrade],
        ['Standard', 'IS 1786:2008'],
        ['Application', 'RCC Structural Reinforcement']
      ]
    } as Seed;
  });
}

const TATASTEEL_TMT: Seed[] = makeTmtLadderSeeds({
  brandId: 'tatasteel', brandMCatId: 'tatasteel-construction', idPrefix: 'tatasteel-tmt',
  namePrefix: 'Tata Tiscon', modelPrefix: 'TT-', feGrade: 'Fe 550D',
  pricePerMm: 145, deliveryTime: '3-7 Days', warranty: 'N/A - Structural Material'
});
const TATASTEEL_OTHER: Seed[] = [
  { id: 'tatasteel-structural-angle', name: 'Tata Structura Structural Steel Angle', brandId: 'tatasteel', brandMCatId: 'tatasteel-construction', family: 'construction', modelNumber: 'Structura-ANG', keySpecLabel: 'Size', keySpecValue: '25mm x 25mm - 150mm x 150mm', priceRange: '₹55,000 - ₹62,000 per Tonne', moq: '5 Tonnes', deliveryTime: '5-10 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 2062'], ['Grade', 'E250 / E350'], ['Application', 'Structural Framework, Trusses']] },
  { id: 'tatasteel-ms-pipe', name: 'Tata Structura MS Pipe', brandId: 'tatasteel', brandMCatId: 'tatasteel-construction', family: 'construction', modelNumber: 'Structura-Pipe', keySpecLabel: 'Diameter', keySpecValue: '15mm - 300mm', priceRange: '₹58,000 - ₹68,000 per Tonne', moq: '5 Tonnes', deliveryTime: '5-10 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 1239 / IS 3601'], ['Wall Thickness', '2mm - 10mm'], ['Application', 'Structural Columns, Scaffolding']] },
  { id: 'tatasteel-gi-sheet', name: 'Tata Shaktee GI Corrugated Sheet', brandId: 'tatasteel', brandMCatId: 'tatasteel-construction', family: 'construction', modelNumber: 'Shaktee GI', keySpecLabel: 'Thickness', keySpecValue: '0.30mm - 0.63mm', priceRange: '₹450 - ₹680 per Sq Meter', moq: '500 Sq Meters', deliveryTime: '5-9 Days', warranty: '10 Years', extraSpecs: [['Coating', 'Galvanized (Zinc Coated)'], ['Standard', 'IS 277'], ['Application', 'Roofing & Cladding']] },
  { id: 'tatasteel-binding-wire', name: 'Tata Wiron Binding Wire', brandId: 'tatasteel', brandMCatId: 'tatasteel-construction', family: 'construction', modelNumber: 'Wiron BW', keySpecLabel: 'Gauge', keySpecValue: '18 SWG - 20 SWG', priceRange: '₹68,000 - ₹75,000 per Tonne', moq: '2 Tonnes', deliveryTime: '3-7 Days', warranty: 'N/A - Consumable Material', extraSpecs: [['Material', 'Low Carbon Steel Wire'], ['Standard', 'IS 280'], ['Application', 'Rebar Binding & Tying']] }
];

const JSWSTEEL_TMT: Seed[] = makeTmtLadderSeeds({
  brandId: 'jswsteel', brandMCatId: 'jswsteel-construction', idPrefix: 'jswsteel-tmt',
  namePrefix: 'JSW Neosteel', modelPrefix: 'JN-', feGrade: 'Fe 500D',
  pricePerMm: 142, deliveryTime: '3-7 Days', warranty: 'N/A - Structural Material'
});
const JSWSTEEL_OTHER: Seed[] = [
  { id: 'jswsteel-hr-coil', name: 'JSW Hot Rolled Steel Coil', brandId: 'jswsteel', brandMCatId: 'jswsteel-construction', family: 'construction', modelNumber: 'HR Coil', keySpecLabel: 'Thickness', keySpecValue: '1.2mm - 12mm', priceRange: '₹52,000 - ₹60,000 per Tonne', moq: '10 Tonnes', deliveryTime: '7-14 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 2062'], ['Width', '900mm - 1550mm'], ['Application', 'Fabrication, Pipe Manufacturing']] },
  { id: 'jswsteel-cr-sheet', name: 'JSW Cold Rolled Steel Sheet', brandId: 'jswsteel', brandMCatId: 'jswsteel-construction', family: 'construction', modelNumber: 'CR Sheet', keySpecLabel: 'Thickness', keySpecValue: '0.3mm - 3mm', priceRange: '₹58,000 - ₹66,000 per Tonne', moq: '10 Tonnes', deliveryTime: '7-14 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 513'], ['Finish', 'Bright Annealed'], ['Application', 'Appliances, Furniture, Auto Body']] },
  { id: 'jswsteel-galvalume', name: 'JSW Colouron+ Galvalume Sheet', brandId: 'jswsteel', brandMCatId: 'jswsteel-construction', family: 'construction', modelNumber: 'Colouron+', keySpecLabel: 'Thickness', keySpecValue: '0.35mm - 0.6mm', priceRange: '₹520 - ₹720 per Sq Meter', moq: '500 Sq Meters', deliveryTime: '7-12 Days', warranty: '15 Years', extraSpecs: [['Coating', 'Aluminium-Zinc Alloy'], ['Standard', 'IS 14246'], ['Application', 'Roofing & Wall Cladding']] },
  { id: 'jswsteel-billet', name: 'JSW Steel Billet', brandId: 'jswsteel', brandMCatId: 'jswsteel-construction', family: 'construction', modelNumber: 'Billet', keySpecLabel: 'Size', keySpecValue: '100mm x 100mm - 150mm x 150mm', priceRange: '₹46,000 - ₹52,000 per Tonne', moq: '20 Tonnes', deliveryTime: '10-18 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Grade', 'IS 2830'], ['Application', 'Re-rolling & TMT Production'], ['Process', 'Continuous Casting']] }
];

const SAIL_TMT: Seed[] = makeTmtLadderSeeds({
  brandId: 'sail', brandMCatId: 'sail-construction', idPrefix: 'sail-tmt',
  namePrefix: 'SAIL', modelPrefix: 'SAIL-', feGrade: 'Fe 500',
  pricePerMm: 138, deliveryTime: '5-10 Days', warranty: 'N/A - Structural Material'
});
const SAIL_OTHER: Seed[] = [
  { id: 'sail-structural-beam', name: 'SAIL Structural I-Beam', brandId: 'sail', brandMCatId: 'sail-construction', family: 'construction', modelNumber: 'I-Beam', keySpecLabel: 'Size', keySpecValue: '100mm - 600mm Depth', priceRange: '₹54,000 - ₹62,000 per Tonne', moq: '10 Tonnes', deliveryTime: '10-18 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 2062'], ['Grade', 'E250'], ['Application', 'Heavy Structural Framework']] },
  { id: 'sail-plate', name: 'SAIL Steel Plate', brandId: 'sail', brandMCatId: 'sail-construction', family: 'construction', modelNumber: 'Steel Plate', keySpecLabel: 'Thickness', keySpecValue: '5mm - 100mm', priceRange: '₹50,000 - ₹58,000 per Tonne', moq: '10 Tonnes', deliveryTime: '10-18 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 2062'], ['Application', 'Shipbuilding, Bridges, Pressure Vessels']] },
  { id: 'sail-wire-rod', name: 'SAIL Wire Rod', brandId: 'sail', brandMCatId: 'sail-construction', family: 'construction', modelNumber: 'Wire Rod', keySpecLabel: 'Diameter', keySpecValue: '5.5mm - 16mm', priceRange: '₹48,000 - ₹56,000 per Tonne', moq: '10 Tonnes', deliveryTime: '8-15 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 7887'], ['Application', 'Wire Drawing, Fasteners, Mesh']] },
  { id: 'sail-railway-track', name: 'SAIL Railway Track Rail', brandId: 'sail', brandMCatId: 'sail-construction', family: 'construction', modelNumber: 'Rail Track', keySpecLabel: 'Weight', keySpecValue: '52 kg/m - 60 kg/m', priceRange: '₹62,000 - ₹70,000 per Tonne', moq: '20 Tonnes', deliveryTime: '20-30 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Compliance', 'RDSO Approved'], ['Standard', 'IRS-T-12'], ['Application', 'Railway Track Infrastructure']] }
];

const JINDALSTEEL_TMT: Seed[] = makeTmtLadderSeeds({
  brandId: 'jindalsteel', brandMCatId: 'jindalsteel-construction', idPrefix: 'jindalsteel-tmt',
  namePrefix: 'Jindal Panther', modelPrefix: 'JP-', feGrade: 'Fe 500D',
  pricePerMm: 140, deliveryTime: '5-10 Days', warranty: 'N/A - Structural Material'
});
const JINDALSTEEL_OTHER: Seed[] = [
  { id: 'jindalsteel-hr-coil', name: 'Jindal Hot Rolled Steel Coil', brandId: 'jindalsteel', brandMCatId: 'jindalsteel-construction', family: 'construction', modelNumber: 'HR Coil JSP', keySpecLabel: 'Thickness', keySpecValue: '1.2mm - 12mm', priceRange: '₹51,000 - ₹59,000 per Tonne', moq: '10 Tonnes', deliveryTime: '7-14 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 2062'], ['Width', '900mm - 1550mm'], ['Application', 'Fabrication, Pipe Manufacturing']] },
  { id: 'jindalsteel-angle', name: 'Jindal Structural Steel Angle', brandId: 'jindalsteel', brandMCatId: 'jindalsteel-construction', family: 'construction', modelNumber: 'Angle JSP', keySpecLabel: 'Size', keySpecValue: '25mm x 25mm - 130mm x 130mm', priceRange: '₹53,000 - ₹60,000 per Tonne', moq: '5 Tonnes', deliveryTime: '5-10 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 2062'], ['Grade', 'E250'], ['Application', 'Structural Framework, Trusses']] },
  { id: 'jindalsteel-plate', name: 'Jindal Steel Plate', brandId: 'jindalsteel', brandMCatId: 'jindalsteel-construction', family: 'construction', modelNumber: 'Plate JSP', keySpecLabel: 'Thickness', keySpecValue: '5mm - 100mm', priceRange: '₹49,000 - ₹57,000 per Tonne', moq: '10 Tonnes', deliveryTime: '10-16 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Standard', 'IS 2062'], ['Application', 'Shipbuilding, Bridges, Pressure Vessels']] },
  { id: 'jindalsteel-rail', name: 'Jindal Railway Track Rail', brandId: 'jindalsteel', brandMCatId: 'jindalsteel-construction', family: 'construction', modelNumber: 'Rail JSP', keySpecLabel: 'Weight', keySpecValue: '52 kg/m - 60 kg/m', priceRange: '₹61,000 - ₹69,000 per Tonne', moq: '20 Tonnes', deliveryTime: '20-30 Days', warranty: 'N/A - Structural Material', extraSpecs: [['Compliance', 'RDSO Approved'], ['Standard', 'IRS-T-12'], ['Application', 'Railway Track Infrastructure']] }
];

// Kajaria's single-brand tile lineup — 15 distinct tile product types, each with a typical size.
interface TileTypeDef { type: string; sizeValue: string; priceBase: number }
const TILE_TYPE_LADDER: TileTypeDef[] = [
  { type: 'Ceramic Floor Tile', sizeValue: '300mm x 300mm', priceBase: 28 },
  { type: 'Vitrified Floor Tile', sizeValue: '600mm x 600mm', priceBase: 42 },
  { type: 'Digital Wall Tile', sizeValue: '300mm x 450mm', priceBase: 32 },
  { type: 'Outdoor Parking Tile', sizeValue: '300mm x 300mm', priceBase: 26 },
  { type: 'Bathroom Floor Tile', sizeValue: '300mm x 300mm', priceBase: 30 },
  { type: 'Kitchen Wall Tile', sizeValue: '250mm x 375mm', priceBase: 29 },
  { type: 'Wooden Finish Vitrified Tile', sizeValue: '200mm x 1200mm', priceBase: 68 },
  { type: 'Marble Finish Vitrified Tile', sizeValue: '800mm x 800mm', priceBase: 85 },
  { type: 'Anti-Skid Tile', sizeValue: '300mm x 300mm', priceBase: 34 },
  { type: 'Double Charge Vitrified Tile', sizeValue: '600mm x 600mm', priceBase: 55 },
  { type: 'Glazed Vitrified Tile (GVT)', sizeValue: '600mm x 1200mm', priceBase: 78 },
  { type: 'Full Body Vitrified Tile', sizeValue: '800mm x 800mm', priceBase: 92 },
  { type: 'Elevation Tile', sizeValue: '300mm x 600mm', priceBase: 48 },
  { type: 'Swimming Pool Tile', sizeValue: '150mm x 150mm', priceBase: 65 },
  { type: 'Step & Riser Tile', sizeValue: '300mm x 1200mm', priceBase: 72 }
];

const KAJARIA_TILES: Seed[] = TILE_TYPE_LADDER.map((t, i) => {
  const price = Math.round(t.priceBase * 1.05 * 10) / 10;
  const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: `kajaria-${slug}`,
    name: `Kajaria ${t.type}`,
    brandId: 'kajaria',
    brandMCatId: 'kajaria-construction',
    family: 'construction',
    modelNumber: `KJ-${i + 1}`,
    keySpecLabel: 'Size',
    keySpecValue: t.sizeValue,
    priceRange: `₹${price} - ₹${Math.round(price * 1.6 * 10) / 10} per Sq Ft`,
    moq: '100 Sq Ft',
    deliveryTime: '4-9 Days',
    warranty: '5 Years',
    extraSpecs: [
      ['Water Absorption', '<0.5% (Vitrified) / <3% (Ceramic)'],
      ['Finish', 'Glossy / Matte / Anti-Skid'],
      ['Application', 'Residential & Commercial Flooring/Walls']
    ]
  } as Seed;
});

// Shared across pipe brands — standard PVC/CPVC/HDPE/steel pipe outer-diameter (mm) sizes.
const PIPE_DIAMETER_LADDER = [20, 25, 32, 40, 50, 63, 75, 90, 110, 140, 160, 200, 250, 315, 400];

interface PipeLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  pipeTypeName: string;
  material: string;
  pressureRating: string;
  application: string;
  pricePerMm: number;
  deliveryTime: string;
  warranty: string;
}

function makePipeLadderSeeds(def: PipeLadderDef): Seed[] {
  return PIPE_DIAMETER_LADDER.map((mm) => {
    const price = Math.round(mm * def.pricePerMm);
    return {
      id: `${def.idPrefix}-${mm}mm`,
      name: `${def.namePrefix} ${def.pipeTypeName} Pipe ${mm}mm`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'pipe',
      modelNumber: `${def.modelPrefix}${mm}`,
      keySpecLabel: 'Outer Diameter',
      keySpecValue: `${mm}mm`,
      priceRange: `₹${price} - ₹${Math.round(price * 1.3)} per meter`,
      moq: '50 Meters',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Pressure Rating', def.pressureRating],
        ['Material', def.material],
        ['Application', def.application]
      ]
    } as Seed;
  });
}

const SUPREMEINDUSTRIES_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'supremeindustries', brandMCatId: 'supremeindustries-pipes', idPrefix: 'supremeindustries-pipe',
  namePrefix: 'Supreme', modelPrefix: 'SI-', pipeTypeName: 'uPVC', material: 'Unplasticized PVC',
  pressureRating: 'PN 6 - PN 16', application: 'Plumbing & Water Supply',
  pricePerMm: 42, deliveryTime: '3-7 Days', warranty: '5 Years'
});

const FINOLEXINDUSTRIES_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'finolexindustries', brandMCatId: 'finolexindustries-pipes', idPrefix: 'finolexindustries-pipe',
  namePrefix: 'Finolex', modelPrefix: 'FI-', pipeTypeName: 'uPVC Agricultural', material: 'Unplasticized PVC',
  pressureRating: 'PN 4 - PN 10', application: 'Agricultural Irrigation & Borewell',
  pricePerMm: 40, deliveryTime: '3-7 Days', warranty: '5 Years'
});

const ASTRAL_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'astral', brandMCatId: 'astral-pipes', idPrefix: 'astral-pipe',
  namePrefix: 'Astral', modelPrefix: 'AS-', pipeTypeName: 'CPVC Hot & Cold Water', material: 'Chlorinated PVC (CPVC)',
  pressureRating: 'SDR 11 / SDR 13.5', application: 'Hot & Cold Water Plumbing',
  pricePerMm: 58, deliveryTime: '4-8 Days', warranty: '10 Years'
});

const JAININIGATION_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'jainirrigation', brandMCatId: 'jainirrigation-pipes', idPrefix: 'jainirrigation-pipe',
  namePrefix: 'Jain', modelPrefix: 'JI-', pipeTypeName: 'HDPE Irrigation', material: 'High-Density Polyethylene (HDPE)',
  pressureRating: 'PN 4 - PN 12.5', application: 'Drip & Sprinkler Irrigation',
  pricePerMm: 46, deliveryTime: '4-9 Days', warranty: '7 Years'
});

const PRINCEPIPES_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'princepipes', brandMCatId: 'princepipes-pipes', idPrefix: 'princepipes-pipe',
  namePrefix: 'Prince', modelPrefix: 'PR-', pipeTypeName: 'uPVC SWR', material: 'Unplasticized PVC',
  pressureRating: 'Class A / Class B', application: 'Soil, Waste & Rainwater Drainage',
  pricePerMm: 38, deliveryTime: '3-7 Days', warranty: '5 Years'
});

const ASHIRVADPIPES_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'ashirvadpipes', brandMCatId: 'ashirvadpipes-pipes', idPrefix: 'ashirvadpipes-pipe',
  namePrefix: 'Ashirvad', modelPrefix: 'AV-', pipeTypeName: 'CPVC Plumbing', material: 'Chlorinated PVC (CPVC)',
  pressureRating: 'SDR 11 / SDR 13.5', application: 'Hot & Cold Water Plumbing',
  pricePerMm: 60, deliveryTime: '4-8 Days', warranty: '10 Years'
});

const APOLLOPIPES_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'apollopipes', brandMCatId: 'apollopipes-pipes', idPrefix: 'apollopipes-pipe',
  namePrefix: 'Apollo', modelPrefix: 'AP-', pipeTypeName: 'uPVC Plumbing', material: 'Unplasticized PVC',
  pressureRating: 'PN 6 - PN 16', application: 'Plumbing & Water Supply',
  pricePerMm: 39, deliveryTime: '3-7 Days', warranty: '5 Years'
});

const JINDALSAW_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'jindalsaw', brandMCatId: 'jindalsaw-pipes', idPrefix: 'jindalsaw-pipe',
  namePrefix: 'Jindal SAW', modelPrefix: 'JSW-', pipeTypeName: 'Steel (SAW/ERW)', material: 'Carbon Steel',
  pressureRating: 'Up to 100 bar', application: 'Oil & Gas, Water Transmission',
  pricePerMm: 145, deliveryTime: '10-20 Days', warranty: '10 Years'
});

const SURYAROSHNI_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'suryaroshni', brandMCatId: 'suryaroshni-pipes', idPrefix: 'suryaroshni-pipe',
  namePrefix: 'Surya', modelPrefix: 'SR-', pipeTypeName: 'GI/MS', material: 'Galvanized / Mild Steel',
  pressureRating: 'Up to 40 bar', application: 'Plumbing, Fire Fighting, Structural',
  pricePerMm: 68, deliveryTime: '5-10 Days', warranty: '7 Years'
});

const KISANMOULDINGS_PIPES: Seed[] = makePipeLadderSeeds({
  brandId: 'kisanmouldings', brandMCatId: 'kisanmouldings-pipes', idPrefix: 'kisanmouldings-pipe',
  namePrefix: 'Kisan', modelPrefix: 'KM-', pipeTypeName: 'uPVC Plumbing', material: 'Unplasticized PVC',
  pressureRating: 'PN 6 - PN 16', application: 'Plumbing & Water Supply',
  pricePerMm: 36, deliveryTime: '3-7 Days', warranty: '5 Years'
});

// Shared across chemical brands — a canonical lineup of 12 generic industrial/construction
// chemical product types every diversified chemicals company carries, topped up with each
// brand's own iconic hero products to reach 15.
interface ChemicalTypeDef { type: string; keySpecLabel: string; keySpecValue: string; priceBase: number; unit: string }
const CHEMICAL_TYPE_LADDER: ChemicalTypeDef[] = [
  { type: 'Construction Adhesive', keySpecLabel: 'Bond Strength', keySpecValue: 'Up to 2.5 N/mm²', priceBase: 220, unit: 'kg' },
  { type: 'Waterproofing Compound', keySpecLabel: 'Coverage', keySpecValue: '1.2 - 1.5 kg/m² per coat', priceBase: 180, unit: 'kg' },
  { type: 'Epoxy Resin', keySpecLabel: 'Viscosity', keySpecValue: '800 - 1200 cP @ 25°C', priceBase: 450, unit: 'kg' },
  { type: 'Industrial Solvent', keySpecLabel: 'Purity', keySpecValue: '99%+', priceBase: 120, unit: 'litre' },
  { type: 'Silicone Sealant', keySpecLabel: 'Cure Time', keySpecValue: '24 Hours (Tack-Free in 30 min)', priceBase: 280, unit: 'kg' },
  { type: 'Specialty Surfactant', keySpecLabel: 'Active Concentration', keySpecValue: '30% - 90%', priceBase: 340, unit: 'kg' },
  { type: 'Anti-Corrosive Coating', keySpecLabel: 'Coverage', keySpecValue: '8 - 10 m²/litre', priceBase: 520, unit: 'litre' },
  { type: 'Industrial Degreaser', keySpecLabel: 'Active Concentration', keySpecValue: '15% - 40%', priceBase: 150, unit: 'litre' },
  { type: 'Polymer Emulsion', keySpecLabel: 'Solid Content', keySpecValue: '45% - 55%', priceBase: 210, unit: 'kg' },
  { type: 'Textile Auxiliary Chemical', keySpecLabel: 'Application', keySpecValue: 'Dyeing & Finishing', priceBase: 260, unit: 'kg' },
  { type: 'Water Treatment Chemical', keySpecLabel: 'Dosage', keySpecValue: '2 - 10 ppm', priceBase: 190, unit: 'kg' },
  { type: 'Agrochemical Formulation', keySpecLabel: 'Active Ingredient', keySpecValue: '10% - 45% w/w', priceBase: 850, unit: 'litre' }
];

interface ChemicalLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  warranty: string;
}

function makeChemicalLadderSeeds(def: ChemicalLadderDef): Seed[] {
  return CHEMICAL_TYPE_LADDER.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 5) * 5;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'chemical',
      modelNumber: `${def.modelPrefix}${i + 1}`,
      keySpecLabel: t.keySpecLabel,
      keySpecValue: t.keySpecValue,
      priceRange: `₹${price} - ₹${Math.round(price * 1.5)} per ${t.unit}`,
      moq: t.unit === 'kg' || t.unit === 'litre' ? '25 kg/Litres' : '1 Unit',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Packaging', t.unit === 'kg' ? 'HDPE Drum / Bag' : 'HDPE Carboy / Drum'],
        ['Shelf Life', '12 - 24 Months'],
        ['Application', 'Industrial & Construction Use']
      ]
    } as Seed;
  });
}

const PIDILITE_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'pidilite', brandMCatId: 'pidilite-chemicals', idPrefix: 'pidilite-chemical',
  namePrefix: 'Pidilite', modelPrefix: 'PID-', priceMultiplier: 1.1,
  deliveryTime: '3-6 Days', warranty: '12 Months Shelf Life'
});
const PIDILITE_OTHER: Seed[] = [
  { id: 'pidilite-fevicol-sr', name: 'Pidilite Fevicol SR Synthetic Resin Adhesive', brandId: 'pidilite', brandMCatId: 'pidilite-chemicals', family: 'chemical', modelNumber: 'Fevicol SR', keySpecLabel: 'Bond Strength', keySpecValue: 'High Strength Wood Bonding', priceRange: '₹210 - ₹340 per kg', moq: '25 kg', deliveryTime: '2-5 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Base', 'Synthetic Resin (PVA)'], ['Application', 'Woodworking & Furniture'], ['Packaging', 'HDPE Container']] },
  { id: 'pidilite-drfixit', name: 'Pidilite Dr. Fixit Waterproofing System', brandId: 'pidilite', brandMCatId: 'pidilite-chemicals', family: 'chemical', modelNumber: 'Dr. Fixit', keySpecLabel: 'Coverage', keySpecValue: '1.5 kg/m² per coat', priceRange: '₹185 - ₹420 per kg', moq: '20 kg', deliveryTime: '3-6 Days', warranty: '10 Years System Warranty', extraSpecs: [['Application', 'Roof, Wall & Bathroom Waterproofing'], ['Base', 'Polymer Modified'], ['Packaging', 'HDPE Pail']] },
  { id: 'pidilite-mseal', name: 'Pidilite M-Seal Epoxy Putty', brandId: 'pidilite', brandMCatId: 'pidilite-chemicals', family: 'chemical', modelNumber: 'M-Seal', keySpecLabel: 'Cure Time', keySpecValue: '30 Minutes Working Time', priceRange: '₹95 - ₹180 per kg', moq: '10 kg', deliveryTime: '2-5 Days', warranty: '24 Months Shelf Life', extraSpecs: [['Base', 'Epoxy Putty'], ['Application', 'Leak Repair & General Bonding'], ['Packaging', 'Sachet / Tin']] }
];

const ASIANPAINTS_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'asianpaints', brandMCatId: 'asianpaints-chemicals', idPrefix: 'asianpaints-chemical',
  namePrefix: 'Asian Paints', modelPrefix: 'AP-', priceMultiplier: 1.15,
  deliveryTime: '3-6 Days', warranty: '12 Months Shelf Life'
});
const ASIANPAINTS_OTHER: Seed[] = [
  { id: 'asianpaints-apex-exterior', name: 'Asian Paints Apex Exterior Emulsion', brandId: 'asianpaints', brandMCatId: 'asianpaints-chemicals', family: 'chemical', modelNumber: 'Apex Ultima', keySpecLabel: 'Coverage', keySpecValue: '120 - 140 sq.ft/litre', priceRange: '₹320 - ₹480 per litre', moq: '20 Litres', deliveryTime: '3-6 Days', warranty: '7 Years Performance Warranty', extraSpecs: [['Base', 'Acrylic Emulsion'], ['Application', 'Exterior Wall Painting'], ['Finish', 'Weatherproof Matte']] },
  { id: 'asianpaints-royale-interior', name: 'Asian Paints Royale Interior Emulsion', brandId: 'asianpaints', brandMCatId: 'asianpaints-chemicals', family: 'chemical', modelNumber: 'Royale Luxury', keySpecLabel: 'Coverage', keySpecValue: '140 - 160 sq.ft/litre', priceRange: '₹380 - ₹560 per litre', moq: '20 Litres', deliveryTime: '3-6 Days', warranty: '4 Years Performance Warranty', extraSpecs: [['Base', 'Acrylic Emulsion'], ['Application', 'Interior Wall Painting'], ['Finish', 'Luxury Silk Sheen']] },
  { id: 'asianpaints-wood-finish', name: 'Asian Paints Woodtech Wood Finish', brandId: 'asianpaints', brandMCatId: 'asianpaints-chemicals', family: 'chemical', modelNumber: 'Woodtech', keySpecLabel: 'Coverage', keySpecValue: '100 - 120 sq.ft/litre', priceRange: '₹420 - ₹650 per litre', moq: '10 Litres', deliveryTime: '4-8 Days', warranty: '3 Years Performance Warranty', extraSpecs: [['Base', 'Polyurethane'], ['Application', 'Wood & Furniture Finishing'], ['Finish', 'Glossy / Matte']] }
];

const BERGERPAINTS_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'bergerpaints', brandMCatId: 'bergerpaints-chemicals', idPrefix: 'bergerpaints-chemical',
  namePrefix: 'Berger', modelPrefix: 'BP-', priceMultiplier: 1.05,
  deliveryTime: '3-6 Days', warranty: '12 Months Shelf Life'
});
const BERGERPAINTS_OTHER: Seed[] = [
  { id: 'bergerpaints-weathercoat', name: 'Berger WeatherCoat Exterior Paint', brandId: 'bergerpaints', brandMCatId: 'bergerpaints-chemicals', family: 'chemical', modelNumber: 'WeatherCoat', keySpecLabel: 'Coverage', keySpecValue: '110 - 130 sq.ft/litre', priceRange: '₹300 - ₹450 per litre', moq: '20 Litres', deliveryTime: '3-6 Days', warranty: '7 Years Performance Warranty', extraSpecs: [['Base', 'Acrylic Emulsion'], ['Application', 'Exterior Wall Painting'], ['Finish', 'Weatherproof Matte']] },
  { id: 'bergerpaints-silk-interior', name: 'Berger Silk Interior Emulsion', brandId: 'bergerpaints', brandMCatId: 'bergerpaints-chemicals', family: 'chemical', modelNumber: 'Silk Glamour', keySpecLabel: 'Coverage', keySpecValue: '130 - 150 sq.ft/litre', priceRange: '₹350 - ₹520 per litre', moq: '20 Litres', deliveryTime: '3-6 Days', warranty: '4 Years Performance Warranty', extraSpecs: [['Base', 'Acrylic Emulsion'], ['Application', 'Interior Wall Painting'], ['Finish', 'Silk Sheen']] },
  { id: 'bergerpaints-wood-coat', name: 'Berger Wood Coat Melamyne Finish', brandId: 'bergerpaints', brandMCatId: 'bergerpaints-chemicals', family: 'chemical', modelNumber: 'Wood Coat', keySpecLabel: 'Coverage', keySpecValue: '90 - 110 sq.ft/litre', priceRange: '₹400 - ₹620 per litre', moq: '10 Litres', deliveryTime: '4-8 Days', warranty: '3 Years Performance Warranty', extraSpecs: [['Base', 'Melamine'], ['Application', 'Wood & Furniture Finishing'], ['Finish', 'High Gloss']] }
];

const SRF_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'srf', brandMCatId: 'srf-chemicals', idPrefix: 'srf-chemical',
  namePrefix: 'SRF', modelPrefix: 'SRF-', priceMultiplier: 1.2,
  deliveryTime: '5-10 Days', warranty: '12 Months Shelf Life'
});
const SRF_OTHER: Seed[] = [
  { id: 'srf-refrigerant-r32', name: 'SRF Refrigerant Gas (R-32)', brandId: 'srf', brandMCatId: 'srf-chemicals', family: 'chemical', modelNumber: 'Floron R-32', keySpecLabel: 'Purity', keySpecValue: '99.9%+', priceRange: '₹450 - ₹680 per kg', moq: '100 kg', deliveryTime: '7-12 Days', warranty: '24 Months Shelf Life', extraSpecs: [['Application', 'Air Conditioning Refrigerant'], ['Packaging', 'Refillable Steel Cylinder'], ['GWP', 'Lower GWP than R-22']] },
  { id: 'srf-bopet-film', name: 'SRF BOPET Packaging Film', brandId: 'srf', brandMCatId: 'srf-chemicals', family: 'chemical', modelNumber: 'BOPET Film', keySpecLabel: 'Thickness', keySpecValue: '12 - 250 microns', priceRange: '₹280 - ₹420 per kg', moq: '500 kg', deliveryTime: '10-16 Days', warranty: '12 Months Shelf Life', extraSpecs: [['Application', 'Flexible Packaging, Lamination'], ['Material', 'Biaxially Oriented PET'], ['Packaging', 'Roll Form']] },
  { id: 'srf-fluoropolymer', name: 'SRF Specialty Fluoropolymer', brandId: 'srf', brandMCatId: 'srf-chemicals', family: 'chemical', modelNumber: 'Fluoropolymer', keySpecLabel: 'Application', keySpecValue: 'Industrial Coatings', priceRange: '₹850 - ₹1,450 per kg', moq: '50 kg', deliveryTime: '10-18 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Base', 'Fluoropolymer Resin'], ['Application', 'Non-Stick Coatings, Cable Insulation'], ['Packaging', 'HDPE Drum']] }
];

const UPL_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'upl', brandMCatId: 'upl-chemicals', idPrefix: 'upl-chemical',
  namePrefix: 'UPL', modelPrefix: 'UPL-', priceMultiplier: 1.0,
  deliveryTime: '5-9 Days', warranty: '18 Months Shelf Life'
});
const UPL_OTHER: Seed[] = [
  { id: 'upl-herbicide', name: 'UPL Herbicide Formulation', brandId: 'upl', brandMCatId: 'upl-chemicals', family: 'chemical', modelNumber: 'Herbicide UPL', keySpecLabel: 'Active Ingredient', keySpecValue: '30% - 45% w/w', priceRange: '₹850 - ₹1,650 per litre', moq: '50 Litres', deliveryTime: '5-9 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Application', 'Weed Control in Field Crops'], ['Registration', 'CIB&RC Registered'], ['Packaging', 'HDPE Carboy']] },
  { id: 'upl-insecticide', name: 'UPL Insecticide Formulation', brandId: 'upl', brandMCatId: 'upl-chemicals', family: 'chemical', modelNumber: 'Insecticide UPL', keySpecLabel: 'Active Ingredient', keySpecValue: '10% - 25% w/w', priceRange: '₹780 - ₹1,450 per litre', moq: '50 Litres', deliveryTime: '5-9 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Application', 'Pest Control in Field Crops'], ['Registration', 'CIB&RC Registered'], ['Packaging', 'HDPE Carboy']] },
  { id: 'upl-fungicide', name: 'UPL Fungicide Formulation', brandId: 'upl', brandMCatId: 'upl-chemicals', family: 'chemical', modelNumber: 'Fungicide UPL', keySpecLabel: 'Active Ingredient', keySpecValue: '20% - 40% w/w', priceRange: '₹820 - ₹1,550 per litre', moq: '50 Litres', deliveryTime: '5-9 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Application', 'Fungal Disease Control'], ['Registration', 'CIB&RC Registered'], ['Packaging', 'HDPE Carboy']] }
];

const DEEPAKNITRITE_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'deepaknitrite', brandMCatId: 'deepaknitrite-chemicals', idPrefix: 'deepaknitrite-chemical',
  namePrefix: 'Deepak Nitrite', modelPrefix: 'DN-', priceMultiplier: 0.9,
  deliveryTime: '5-10 Days', warranty: '12 Months Shelf Life'
});
const DEEPAKNITRITE_OTHER: Seed[] = [
  { id: 'deepaknitrite-sodium-nitrite', name: 'Deepak Nitrite Sodium Nitrite', brandId: 'deepaknitrite', brandMCatId: 'deepaknitrite-chemicals', family: 'chemical', modelNumber: 'Sodium Nitrite', keySpecLabel: 'Purity', keySpecValue: '99%+', priceRange: '₹65 - ₹95 per kg', moq: '500 kg', deliveryTime: '7-12 Days', warranty: '24 Months Shelf Life', extraSpecs: [['Application', 'Dyes, Pharma, Rubber Chemicals'], ['Packaging', 'HDPE Bag'], ['Grade', 'Technical / Industrial']] },
  { id: 'deepaknitrite-dasda', name: 'Deepak Nitrite Fuel Additive DASDA', brandId: 'deepaknitrite', brandMCatId: 'deepaknitrite-chemicals', family: 'chemical', modelNumber: 'DASDA', keySpecLabel: 'Purity', keySpecValue: '98%+', priceRange: '₹420 - ₹650 per kg', moq: '200 kg', deliveryTime: '10-16 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Application', 'Optical Brightening Agents, Dyes'], ['Packaging', 'HDPE Drum'], ['Grade', 'Technical']] },
  { id: 'deepaknitrite-acetone', name: 'Deepak Phenolics Acetone', brandId: 'deepaknitrite', brandMCatId: 'deepaknitrite-chemicals', family: 'chemical', modelNumber: 'Acetone', keySpecLabel: 'Purity', keySpecValue: '99.5%+', priceRange: '₹75 - ₹110 per litre', moq: '500 Litres', deliveryTime: '7-12 Days', warranty: '12 Months Shelf Life', extraSpecs: [['Application', 'Solvent, Pharma Intermediate'], ['Packaging', 'Tanker / Drum'], ['Grade', 'Industrial']] }
];

const AARTIINDUSTRIES_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'aartiindustries', brandMCatId: 'aartiindustries-chemicals', idPrefix: 'aartiindustries-chemical',
  namePrefix: 'Aarti', modelPrefix: 'AI-', priceMultiplier: 0.95,
  deliveryTime: '5-10 Days', warranty: '12 Months Shelf Life'
});
const AARTIINDUSTRIES_OTHER: Seed[] = [
  { id: 'aartiindustries-specialty-intermediate', name: 'Aarti Specialty Chemical Intermediate', brandId: 'aartiindustries', brandMCatId: 'aartiindustries-chemicals', family: 'chemical', modelNumber: 'Specialty Intermediate', keySpecLabel: 'Purity', keySpecValue: '98%+', priceRange: '₹380 - ₹720 per kg', moq: '200 kg', deliveryTime: '10-16 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Application', 'Agrochemical & Dye Intermediates'], ['Packaging', 'HDPE Drum'], ['Grade', 'Technical']] },
  { id: 'aartiindustries-pharma-intermediate', name: 'Aarti Pharma Intermediate', brandId: 'aartiindustries', brandMCatId: 'aartiindustries-chemicals', family: 'chemical', modelNumber: 'Pharma Intermediate', keySpecLabel: 'Purity', keySpecValue: '99%+', priceRange: '₹650 - ₹1,250 per kg', moq: '100 kg', deliveryTime: '10-18 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Application', 'Active Pharmaceutical Ingredient Synthesis'], ['Packaging', 'HDPE Drum'], ['Grade', 'Pharma Grade']] },
  { id: 'aartiindustries-dyes-pigments', name: 'Aarti Dyes & Pigments Intermediate', brandId: 'aartiindustries', brandMCatId: 'aartiindustries-chemicals', family: 'chemical', modelNumber: 'Dyes Intermediate', keySpecLabel: 'Purity', keySpecValue: '97%+', priceRange: '₹320 - ₹580 per kg', moq: '200 kg', deliveryTime: '8-14 Days', warranty: '12 Months Shelf Life', extraSpecs: [['Application', 'Textile Dyes, Pigment Manufacturing'], ['Packaging', 'HDPE Bag'], ['Grade', 'Technical']] }
];

const ATUL_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'atul', brandMCatId: 'atul-chemicals', idPrefix: 'atul-chemical',
  namePrefix: 'Atul', modelPrefix: 'AT-', priceMultiplier: 0.92,
  deliveryTime: '5-10 Days', warranty: '12 Months Shelf Life'
});
const ATUL_OTHER: Seed[] = [
  { id: 'atul-dyes-pigments', name: 'Atul Dyes & Pigments', brandId: 'atul', brandMCatId: 'atul-chemicals', family: 'chemical', modelNumber: 'Dyes & Pigments', keySpecLabel: 'Purity', keySpecValue: '97%+', priceRange: '₹340 - ₹620 per kg', moq: '200 kg', deliveryTime: '8-14 Days', warranty: '12 Months Shelf Life', extraSpecs: [['Application', 'Textile & Leather Dyeing'], ['Packaging', 'HDPE Bag'], ['Grade', 'Technical']] },
  { id: 'atul-pharma-intermediate', name: 'Atul Pharma Intermediate', brandId: 'atul', brandMCatId: 'atul-chemicals', family: 'chemical', modelNumber: 'Pharma Intermediate ATL', keySpecLabel: 'Purity', keySpecValue: '99%+', priceRange: '₹680 - ₹1,300 per kg', moq: '100 kg', deliveryTime: '10-18 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Application', 'API Synthesis'], ['Packaging', 'HDPE Drum'], ['Grade', 'Pharma Grade']] },
  { id: 'atul-aromatic-chemical', name: 'Atul Aromatic Chemical', brandId: 'atul', brandMCatId: 'atul-chemicals', family: 'chemical', modelNumber: 'Aromatic Chemical', keySpecLabel: 'Purity', keySpecValue: '98%+', priceRange: '₹420 - ₹780 per kg', moq: '100 kg', deliveryTime: '10-16 Days', warranty: '12 Months Shelf Life', extraSpecs: [['Application', 'Fragrance & Flavor Manufacturing'], ['Packaging', 'HDPE Drum'], ['Grade', 'Technical']] }
];

const GUJARATFLUORO_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'gujaratfluoro', brandMCatId: 'gujaratfluoro-chemicals', idPrefix: 'gujaratfluoro-chemical',
  namePrefix: 'Gujarat Fluorochemicals', modelPrefix: 'GFL-', priceMultiplier: 1.25,
  deliveryTime: '6-12 Days', warranty: '18 Months Shelf Life'
});
const GUJARATFLUORO_OTHER: Seed[] = [
  { id: 'gujaratfluoro-ptfe', name: 'GFL PTFE Fluoropolymer', brandId: 'gujaratfluoro', brandMCatId: 'gujaratfluoro-chemicals', family: 'chemical', modelNumber: 'PTFE Resin', keySpecLabel: 'Application', keySpecValue: 'Non-Stick & Sealing Applications', priceRange: '₹950 - ₹1,650 per kg', moq: '50 kg', deliveryTime: '10-18 Days', warranty: '24 Months Shelf Life', extraSpecs: [['Base', 'Polytetrafluoroethylene'], ['Application', 'Gaskets, Seals, Coatings'], ['Packaging', 'HDPE Drum']] },
  { id: 'gujaratfluoro-refrigerant', name: 'GFL Refrigerant Gas (R-134a)', brandId: 'gujaratfluoro', brandMCatId: 'gujaratfluoro-chemicals', family: 'chemical', modelNumber: 'INFLON R-134a', keySpecLabel: 'Purity', keySpecValue: '99.9%+', priceRange: '₹480 - ₹720 per kg', moq: '100 kg', deliveryTime: '8-14 Days', warranty: '24 Months Shelf Life', extraSpecs: [['Application', 'Automotive & AC Refrigerant'], ['Packaging', 'Refillable Steel Cylinder'], ['Grade', 'Industrial']] },
  { id: 'gujaratfluoro-specialty-chemical', name: 'GFL Specialty Fluorochemical', brandId: 'gujaratfluoro', brandMCatId: 'gujaratfluoro-chemicals', family: 'chemical', modelNumber: 'Specialty Fluorochem', keySpecLabel: 'Application', keySpecValue: 'Industrial Coatings & Textiles', priceRange: '₹1,100 - ₹1,850 per kg', moq: '50 kg', deliveryTime: '12-20 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Base', 'Fluorochemical Compound'], ['Application', 'Textile Water Repellents, Coatings'], ['Packaging', 'HDPE Drum']] }
];

const TATACHEMICALS_CHEMICALS: Seed[] = makeChemicalLadderSeeds({
  brandId: 'tatachemicals', brandMCatId: 'tatachemicals-chemicals', idPrefix: 'tatachemicals-chemical',
  namePrefix: 'Tata Chemicals', modelPrefix: 'TC-', priceMultiplier: 0.88,
  deliveryTime: '5-10 Days', warranty: '12 Months Shelf Life'
});
const TATACHEMICALS_OTHER: Seed[] = [
  { id: 'tatachemicals-soda-ash', name: 'Tata Chemicals Soda Ash', brandId: 'tatachemicals', brandMCatId: 'tatachemicals-chemicals', family: 'chemical', modelNumber: 'Soda Ash Dense', keySpecLabel: 'Purity', keySpecValue: '99.2%+', priceRange: '₹28 - ₹42 per kg', moq: '1 Tonne', deliveryTime: '7-14 Days', warranty: '24 Months Shelf Life', extraSpecs: [['Application', 'Glass, Detergents, Chemicals Manufacturing'], ['Packaging', 'HDPE Bag / Bulk'], ['Grade', 'Industrial Dense']] },
  { id: 'tatachemicals-sodium-bicarb', name: 'Tata Chemicals Sodium Bicarbonate', brandId: 'tatachemicals', brandMCatId: 'tatachemicals-chemicals', family: 'chemical', modelNumber: 'Sodium Bicarbonate', keySpecLabel: 'Purity', keySpecValue: '99.5%+', priceRange: '₹35 - ₹52 per kg', moq: '500 kg', deliveryTime: '7-12 Days', warranty: '24 Months Shelf Life', extraSpecs: [['Application', 'Food, Pharma, Feed Grade'], ['Packaging', 'HDPE Bag'], ['Grade', 'Food / Pharma / Industrial']] },
  { id: 'tatachemicals-specialty-silica', name: 'Tata Chemicals Specialty Silica', brandId: 'tatachemicals', brandMCatId: 'tatachemicals-chemicals', family: 'chemical', modelNumber: 'Specialty Silica', keySpecLabel: 'Application', keySpecValue: 'Tyre & Rubber Reinforcement', priceRange: '₹85 - ₹140 per kg', moq: '500 kg', deliveryTime: '10-16 Days', warranty: '18 Months Shelf Life', extraSpecs: [['Base', 'Precipitated Silica'], ['Application', 'Tyres, Rubber, Toothpaste'], ['Packaging', 'HDPE Bag']] }
];

// Shared across laptop brands — a canonical lineup of 15 laptop configurations every
// full-range business/consumer laptop brand carries, spanning entry business machines
// through workstations and gaming rigs.
interface LaptopTypeDef { type: string; keySpecValue: string; priceBase: number }
const LAPTOP_TYPE_LADDER: LaptopTypeDef[] = [
  { type: 'Entry Business Laptop', keySpecValue: 'Intel Core i3, 8GB RAM, 256GB SSD', priceBase: 32000 },
  { type: 'Business Laptop Standard', keySpecValue: 'Intel Core i5, 8GB RAM, 512GB SSD', priceBase: 48000 },
  { type: 'Premium Business Laptop', keySpecValue: 'Intel Core i7, 16GB RAM, 512GB SSD', priceBase: 72000 },
  { type: 'Ultrabook Slim & Light', keySpecValue: 'Intel Core i5, 16GB RAM, 512GB SSD', priceBase: 62000 },
  { type: '2-in-1 Convertible Touch Laptop', keySpecValue: 'Intel Core i5, 8GB RAM, 256GB SSD', priceBase: 58000 },
  { type: 'Gaming Laptop Entry', keySpecValue: 'Intel Core i5 + GTX 1650, 16GB RAM, 512GB SSD', priceBase: 68000 },
  { type: 'Gaming Laptop Pro', keySpecValue: 'Intel Core i7 + RTX 4060, 16GB RAM, 1TB SSD', priceBase: 108000 },
  { type: 'Mobile Workstation', keySpecValue: 'Intel Core i7 + RTX A2000, 32GB RAM, 1TB SSD', priceBase: 148000 },
  { type: 'Chromebook for Business', keySpecValue: 'Intel Celeron, 4GB RAM, 64GB eMMC', priceBase: 21000 },
  { type: 'Budget Laptop', keySpecValue: 'AMD Ryzen 3, 8GB RAM, 256GB SSD', priceBase: 29000 },
  { type: 'AMD Ryzen Business Laptop', keySpecValue: 'AMD Ryzen 5, 16GB RAM, 512GB SSD', priceBase: 51000 },
  { type: 'High-Performance Laptop', keySpecValue: 'Intel Core i9, 32GB RAM, 1TB SSD', priceBase: 138000 },
  { type: 'Rugged Laptop (MIL-STD)', keySpecValue: 'Intel Core i5, 16GB RAM, 512GB SSD', priceBase: 98000 },
  { type: 'Thin & Light Laptop', keySpecValue: 'Intel Core i5, 8GB RAM, 512GB SSD', priceBase: 55000 },
  { type: 'Desktop Replacement Laptop', keySpecValue: 'Intel Core i7, 16GB RAM, 1TB SSD', priceBase: 82000 }
];

interface LaptopLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  warranty: string;
}

function makeLaptopLadderSeeds(def: LaptopLadderDef): Seed[] {
  return LAPTOP_TYPE_LADDER.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 500) * 500;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'laptop',
      modelNumber: `${def.modelPrefix}${i + 1}`,
      keySpecLabel: 'Configuration',
      keySpecValue: t.keySpecValue,
      priceRange: `₹${formatIndianPrice(price)} - ₹${formatIndianPrice(price * 1.3)}`,
      moq: '5 Units',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Display', '14" - 15.6" FHD'],
        ['Operating System', 'Windows 11 Pro / Home'],
        ['Battery Life', 'Up to 10 Hours']
      ]
    } as Seed;
  });
}

const DELL_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'dell', brandMCatId: 'dell-laptops', idPrefix: 'dell-laptop',
  namePrefix: 'Dell', modelPrefix: 'DL-', priceMultiplier: 1.05,
  deliveryTime: '4-8 Days', warranty: '12 Months'
});
const HP_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'hp', brandMCatId: 'hp-laptops', idPrefix: 'hp-laptop',
  namePrefix: 'HP', modelPrefix: 'HP-', priceMultiplier: 1.02,
  deliveryTime: '4-8 Days', warranty: '12 Months'
});
const LENOVO_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'lenovo', brandMCatId: 'lenovo-laptops', idPrefix: 'lenovo-laptop',
  namePrefix: 'Lenovo', modelPrefix: 'LN-', priceMultiplier: 0.98,
  deliveryTime: '4-8 Days', warranty: '12 Months'
});
const ASUS_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'asus', brandMCatId: 'asus-laptops', idPrefix: 'asus-laptop',
  namePrefix: 'Asus', modelPrefix: 'AS-', priceMultiplier: 0.95,
  deliveryTime: '5-9 Days', warranty: '12 Months'
});
const ACER_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'acer', brandMCatId: 'acer-laptops', idPrefix: 'acer-laptop',
  namePrefix: 'Acer', modelPrefix: 'AC-', priceMultiplier: 0.9,
  deliveryTime: '5-9 Days', warranty: '12 Months'
});
const APPLE_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'apple', brandMCatId: 'apple-laptops', idPrefix: 'apple-laptop',
  namePrefix: 'Apple MacBook-Class', modelPrefix: 'MB-', priceMultiplier: 1.8,
  deliveryTime: '5-10 Days', warranty: '12 Months'
});
const MSI_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'msi', brandMCatId: 'msi-laptops', idPrefix: 'msi-laptop',
  namePrefix: 'MSI', modelPrefix: 'MS-', priceMultiplier: 1.1,
  deliveryTime: '6-12 Days', warranty: '12 Months'
});
const SAMSUNG_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'samsung', brandMCatId: 'samsung-laptops', idPrefix: 'samsung-laptop',
  namePrefix: 'Samsung Galaxy Book-Class', modelPrefix: 'SGB-', priceMultiplier: 1.08,
  deliveryTime: '4-8 Days', warranty: '12 Months'
});
const LG_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'lg', brandMCatId: 'lg-laptops', idPrefix: 'lg-laptop',
  namePrefix: 'LG Gram-Class', modelPrefix: 'LGG-', priceMultiplier: 1.15,
  deliveryTime: '6-12 Days', warranty: '12 Months'
});
const MICROSOFT_LAPTOPS: Seed[] = makeLaptopLadderSeeds({
  brandId: 'microsoft', brandMCatId: 'microsoft-laptops', idPrefix: 'microsoft-laptop',
  namePrefix: 'Microsoft Surface-Class', modelPrefix: 'MSF-', priceMultiplier: 1.25,
  deliveryTime: '6-12 Days', warranty: '12 Months'
});

// Shared across mobile phone brands — a canonical lineup of 15 configurations spanning
// entry-level through flagship and specialty (foldable/rugged/gaming) segments.
interface MobileTypeDef { type: string; keySpecValue: string; priceBase: number }
const MOBILE_TYPE_LADDER: MobileTypeDef[] = [
  { type: 'Entry Smartphone', keySpecValue: '4GB RAM / 64GB Storage', priceBase: 7500 },
  { type: 'Budget Smartphone', keySpecValue: '4GB RAM / 128GB Storage', priceBase: 10000 },
  { type: 'Mid-Range Smartphone', keySpecValue: '6GB RAM / 128GB Storage', priceBase: 14500 },
  { type: 'Upper Mid-Range Smartphone', keySpecValue: '8GB RAM / 128GB Storage', priceBase: 19500 },
  { type: 'Premium Smartphone', keySpecValue: '8GB RAM / 256GB Storage', priceBase: 27000 },
  { type: 'Flagship Smartphone', keySpecValue: '12GB RAM / 256GB Storage', priceBase: 45000 },
  { type: 'Flagship Pro Smartphone', keySpecValue: '12GB RAM / 512GB Storage', priceBase: 64000 },
  { type: 'Flagship Ultra Smartphone', keySpecValue: '16GB RAM / 512GB Storage', priceBase: 85000 },
  { type: 'Foldable Smartphone', keySpecValue: '12GB RAM / 256GB Storage', priceBase: 95000 },
  { type: 'Rugged Smartphone (IP68)', keySpecValue: '6GB RAM / 128GB Storage', priceBase: 21000 },
  { type: '5G Smartphone Entry', keySpecValue: '6GB RAM / 128GB Storage', priceBase: 13000 },
  { type: 'Gaming Smartphone', keySpecValue: '12GB RAM / 256GB Storage', priceBase: 37000 },
  { type: 'Compact Smartphone', keySpecValue: '8GB RAM / 128GB Storage', priceBase: 31000 },
  { type: 'Business Smartphone (Secure)', keySpecValue: '8GB RAM / 256GB Storage', priceBase: 29500 },
  { type: 'Camera-Focused Smartphone', keySpecValue: '12GB RAM / 256GB Storage', priceBase: 41000 }
];

interface MobileLadderDef {
  brandId: string;
  brandMCatId: string;
  idPrefix: string;
  namePrefix: string;
  modelPrefix: string;
  priceMultiplier: number;
  deliveryTime: string;
  warranty: string;
}

function makeMobileLadderSeeds(def: MobileLadderDef): Seed[] {
  return MOBILE_TYPE_LADDER.map((t, i) => {
    const price = Math.round((t.priceBase * def.priceMultiplier) / 500) * 500;
    const slug = t.type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      id: `${def.idPrefix}-${slug}`,
      name: `${def.namePrefix} ${t.type}`,
      brandId: def.brandId,
      brandMCatId: def.brandMCatId,
      family: 'mobilephone',
      modelNumber: `${def.modelPrefix}${i + 1}`,
      keySpecLabel: 'Configuration',
      keySpecValue: t.keySpecValue,
      priceRange: `₹${formatIndianPrice(price)} - ₹${formatIndianPrice(price * 1.25)}`,
      moq: '10 Units',
      deliveryTime: def.deliveryTime,
      warranty: def.warranty,
      extraSpecs: [
        ['Display', '6.1" - 6.7" AMOLED/LCD'],
        ['Network', '5G / 4G VoLTE'],
        ['Battery', '4500 - 5500 mAh']
      ]
    } as Seed;
  });
}

const SAMSUNG_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'samsung', brandMCatId: 'samsung-mobilephones', idPrefix: 'samsung-mobile',
  namePrefix: 'Samsung Galaxy-Class', modelPrefix: 'SG-', priceMultiplier: 1.1,
  deliveryTime: '3-7 Days', warranty: '12 Months'
});
const APPLE_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'apple', brandMCatId: 'apple-mobilephones', idPrefix: 'apple-mobile',
  namePrefix: 'Apple iPhone-Class', modelPrefix: 'IP-', priceMultiplier: 1.7,
  deliveryTime: '4-9 Days', warranty: '12 Months'
});
const XIAOMI_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'xiaomi', brandMCatId: 'xiaomi-mobilephones', idPrefix: 'xiaomi-mobile',
  namePrefix: 'Xiaomi Redmi-Class', modelPrefix: 'XM-', priceMultiplier: 0.82,
  deliveryTime: '3-6 Days', warranty: '12 Months'
});
const ONEPLUS_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'oneplus', brandMCatId: 'oneplus-mobilephones', idPrefix: 'oneplus-mobile',
  namePrefix: 'OnePlus', modelPrefix: 'OP-', priceMultiplier: 1.05,
  deliveryTime: '3-7 Days', warranty: '12 Months'
});
const VIVO_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'vivo', brandMCatId: 'vivo-mobilephones', idPrefix: 'vivo-mobile',
  namePrefix: 'Vivo', modelPrefix: 'VV-', priceMultiplier: 0.88,
  deliveryTime: '3-6 Days', warranty: '12 Months'
});
const OPPO_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'oppo', brandMCatId: 'oppo-mobilephones', idPrefix: 'oppo-mobile',
  namePrefix: 'Oppo', modelPrefix: 'OO-', priceMultiplier: 0.86,
  deliveryTime: '3-6 Days', warranty: '12 Months'
});
const REALME_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'realme', brandMCatId: 'realme-mobilephones', idPrefix: 'realme-mobile',
  namePrefix: 'Realme', modelPrefix: 'RM-', priceMultiplier: 0.75,
  deliveryTime: '3-6 Days', warranty: '12 Months'
});
const MOTOROLA_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'motorola', brandMCatId: 'motorola-mobilephones', idPrefix: 'motorola-mobile',
  namePrefix: 'Motorola Moto-Class', modelPrefix: 'MT-', priceMultiplier: 0.9,
  deliveryTime: '4-8 Days', warranty: '12 Months'
});
const NOKIAHMD_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'nokiahmd', brandMCatId: 'nokiahmd-mobilephones', idPrefix: 'nokiahmd-mobile',
  namePrefix: 'Nokia', modelPrefix: 'NK-', priceMultiplier: 0.8,
  deliveryTime: '5-10 Days', warranty: '12 Months'
});
const GOOGLE_MOBILE: Seed[] = makeMobileLadderSeeds({
  brandId: 'google', brandMCatId: 'google-mobilephones', idPrefix: 'google-mobile',
  namePrefix: 'Google Pixel-Class', modelPrefix: 'GP-', priceMultiplier: 1.15,
  deliveryTime: '6-12 Days', warranty: '12 Months'
});

const ALL_SEEDS: Seed[] = [
  ...KIRLOSKAR_PUMPS,
  ...KIRLOSKAR_PUMPS_LADDER,
  ...KIRLOSKAR_GENERATORS,
  ...KIRLOSKAR_GENERATORS_LADDER,
  ...CUMMINS_GENERATORS,
  ...CUMMINS_OTHER,
  ...CATERPILLAR_GENERATORS,
  ...CATERPILLAR_OTHER,
  ...MAHINDRAPOWEROL_GENERATORS,
  ...MAHINDRAPOWEROL_OTHER,
  ...ASHOKLEYLAND_GENERATORS,
  ...ASHOKLEYLAND_OTHER,
  ...ESCORTSKUBOTA_GENERATORS,
  ...ESCORTSKUBOTA_OTHER,
  ...HONDA_GENERATORS,
  ...HONDA_OTHER,
  ...KOHLERSDMO_GENERATORS,
  ...KOHLERSDMO_OTHER,
  ...PERKINS_GENERATORS,
  ...PERKINS_OTHER,
  ...GREAVESCOTTON_GENERATORS,
  ...GREAVESCOTTON_OTHER,
  ...KIRLOSKAR_VALVES,
  ...KIRLOSKAR_VALVES_LADDER,
  ...KSB_PUMPS,
  ...KSB_PUMPS_LADDER,
  ...KSB_VALVES,
  ...KSB_VALVES_LADDER,
  ...LTVALVES_VALVES,
  ...LTVALVES_OTHER,
  ...AUDCO_VALVES,
  ...AUDCO_OTHER,
  ...VELAN_VALVES,
  ...VELAN_OTHER,
  ...KITZ_VALVES,
  ...KITZ_OTHER,
  ...ZOLOTO_VALVES,
  ...ZOLOTO_OTHER,
  ...BDK_VALVES,
  ...BDK_OTHER,
  ...LEADERVALVES_VALVES,
  ...LEADERVALVES_OTHER,
  ...ADVANCEVALVES_VALVES,
  ...ADVANCEVALVES_OTHER,
  ...CROMPTON_MOTORS,
  ...CROMPTON_MOTORS_LADDER,
  ...CROMPTON_PUMPS,
  ...CROMPTON_PUMPS_LADDER,
  ...HAVELLS_MOTORS_LADDER,
  ...HAVELLS_MOTORS_OTHER,
  ...ABB_MOTORS,
  ...ABB_MOTORS_OTHER,
  ...KIRLOSKARELECTRIC_MOTORS,
  ...KIRLOSKARELECTRIC_MOTORS_OTHER,
  ...BHARATBIJLEE_MOTORS,
  ...BHARATBIJLEE_MOTORS_OTHER,
  ...WEG_MOTORS,
  ...WEG_MOTORS_OTHER,
  ...CGPOWER_MOTORS,
  ...CGPOWER_MOTORS_OTHER,
  ...GE_MOTORS,
  ...GE_MOTORS_OTHER,
  ...MARATHONELECTRIC_MOTORS,
  ...MARATHONELECTRIC_MOTORS_OTHER,
  ...SIEMENS_MOTORS,
  ...SIEMENS_MOTORS_OTHER,
  ...GRUNDFOS_PUMPS,
  ...GRUNDFOS_OTHER,
  ...FLOWSERVE_PUMPS,
  ...FLOWSERVE_OTHER,
  ...SULZER_PUMPS,
  ...SULZER_OTHER,
  ...WILO_PUMPS,
  ...WILO_OTHER,
  ...CRIPUMPS_PUMPS,
  ...CRIPUMPS_OTHER,
  ...TEXMO_PUMPS,
  ...TEXMO_OTHER,
  ...WPIL_PUMPS,
  ...WPIL_OTHER,
  ...BOSCH_TOOLS,
  ...BOSCH_TOOLS_LADDER,
  ...MAKITA_TOOLS,
  ...DEWALT_TOOLS,
  ...HIKOKI_TOOLS,
  ...BLACKDECKER_TOOLS,
  ...STANLEY_TOOLS,
  ...HILTI_TOOLS,
  ...METABO_TOOLS,
  ...INGCO_TOOLS,
  ...TAPARIA_TOOLS,
  ...BOSCH_SURVEY,
  ...BOSCH_SURVEY_LADDER,
  ...MITUTOYO_INSTRUMENTS,
  ...FLUKE_INSTRUMENTS,
  ...YOKOGAWA_INSTRUMENTS,
  ...TESTO_INSTRUMENTS,
  ...HTCINSTRUMENTS_INSTRUMENTS,
  ...KEYSIGHT_INSTRUMENTS,
  ...MAHR_INSTRUMENTS,
  ...INSIZE_INSTRUMENTS,
  ...KUSAMMECO_INSTRUMENTS,
  ...SIEMENS_AUTOMATION,
  ...SIEMENS_AUTOMATION_TOPUP,
  ...ROCKWELLAUTOMATION_AUTOMATION,
  ...SCHNEIDERELECTRIC_AUTOMATION,
  ...MITSUBISHIELECTRIC_AUTOMATION,
  ...OMRON_AUTOMATION,
  ...DELTAELECTRONICS_AUTOMATION,
  ...HONEYWELL_AUTOMATION,
  ...ABB_AUTOMATION,
  ...GE_AUTOMATION,
  ...YOKOGAWA_AUTOMATION,
  ...HAVELLS_CABLES,
  ...HAVELLS_CABLES_LADDER,
  ...POLYCAB_CABLES,
  ...KEI_CABLES,
  ...FINOLEXCABLES_CABLES,
  ...RRKABEL_CABLES,
  ...VGUARD_CABLES,
  ...UNIVERSALCABLES_CABLES,
  ...APARINDUSTRIES_CABLES,
  ...TORRENTCABLES_CABLES,
  ...PARAMOUNTCOMMUNICATIONS_CABLES,
  ...HAVELLS_SWITCHGEAR,
  ...HAVELLS_SWITCHGEAR_LADDER,
  ...LTELECTRICAL_SWITCHGEAR,
  ...LEGRAND_SWITCHGEAR,
  ...CSELECTRIC_SWITCHGEAR,
  ...EATON_SWITCHGEAR,
  ...STANDARDELECTRICALS_SWITCHGEAR,
  ...SIEMENS_SWITCHGEAR,
  ...ABB_SWITCHGEAR,
  ...SCHNEIDERELECTRIC_SWITCHGEAR,
  ...GE_SWITCHGEAR,
  ...HAVELLS_MOTORS,
  ...HAVELLS_SOLAR,
  ...HAVELLS_SOLAR_LADDER,
  ...WAAREE_SOLAR,
  ...ADANISOLAR_SOLAR,
  ...TATAPOWERSOLAR_SOLAR,
  ...VIKRAMSOLAR_SOLAR,
  ...LUMINOUS_SOLAR,
  ...GOLDISOLAR_SOLAR,
  ...RENEWSYS_SOLAR,
  ...EMMVEE_SOLAR,
  ...PREMIERENERGIES_SOLAR,
  ...ULTRATECH_CEMENT,
  ...AMBUJA_CEMENT,
  ...ACCCEMENT_CEMENT,
  ...JKCEMENT_CEMENT,
  ...SHREECEMENT_CEMENT,
  ...TATASTEEL_TMT,
  ...TATASTEEL_OTHER,
  ...JSWSTEEL_TMT,
  ...JSWSTEEL_OTHER,
  ...SAIL_TMT,
  ...SAIL_OTHER,
  ...JINDALSTEEL_TMT,
  ...JINDALSTEEL_OTHER,
  ...KAJARIA_TILES,
  ...SUPREMEINDUSTRIES_PIPES,
  ...FINOLEXINDUSTRIES_PIPES,
  ...ASTRAL_PIPES,
  ...JAININIGATION_PIPES,
  ...PRINCEPIPES_PIPES,
  ...ASHIRVADPIPES_PIPES,
  ...APOLLOPIPES_PIPES,
  ...JINDALSAW_PIPES,
  ...SURYAROSHNI_PIPES,
  ...KISANMOULDINGS_PIPES,
  ...PIDILITE_CHEMICALS,
  ...PIDILITE_OTHER,
  ...ASIANPAINTS_CHEMICALS,
  ...ASIANPAINTS_OTHER,
  ...BERGERPAINTS_CHEMICALS,
  ...BERGERPAINTS_OTHER,
  ...SRF_CHEMICALS,
  ...SRF_OTHER,
  ...UPL_CHEMICALS,
  ...UPL_OTHER,
  ...DEEPAKNITRITE_CHEMICALS,
  ...DEEPAKNITRITE_OTHER,
  ...AARTIINDUSTRIES_CHEMICALS,
  ...AARTIINDUSTRIES_OTHER,
  ...ATUL_CHEMICALS,
  ...ATUL_OTHER,
  ...GUJARATFLUORO_CHEMICALS,
  ...GUJARATFLUORO_OTHER,
  ...TATACHEMICALS_CHEMICALS,
  ...TATACHEMICALS_OTHER,
  ...DELL_LAPTOPS,
  ...HP_LAPTOPS,
  ...LENOVO_LAPTOPS,
  ...ASUS_LAPTOPS,
  ...ACER_LAPTOPS,
  ...APPLE_LAPTOPS,
  ...MSI_LAPTOPS,
  ...SAMSUNG_LAPTOPS,
  ...LG_LAPTOPS,
  ...MICROSOFT_LAPTOPS,
  ...SAMSUNG_MOBILE,
  ...APPLE_MOBILE,
  ...XIAOMI_MOBILE,
  ...ONEPLUS_MOBILE,
  ...VIVO_MOBILE,
  ...OPPO_MOBILE,
  ...REALME_MOBILE,
  ...MOTOROLA_MOBILE,
  ...NOKIAHMD_MOBILE,
  ...GOOGLE_MOBILE,
  ...VOLTAS_WATERCOOLERS,
  ...VOLTAS_CHILLERS,
  ...VOLTAS_WATERCOOLERS_TOPUP,
  ...BLUESTAR_WATERCOOLERS,
  ...BLUESTAR_CHILLERS,
  ...GODREJ_WATERCOOLERS,
  ...GODREJ_CHILLERS,
  ...CARRIERMIDEA_WATERCOOLERS,
  ...CARRIERMIDEA_CHILLERS,
  ...DAIKIN_WATERCOOLERS,
  ...DAIKIN_CHILLERS,
  ...WESTERNREF_WATERCOOLERS,
  ...WESTERNREF_CHILLERS,
  ...ROCKWELLIND_WATERCOOLERS,
  ...ROCKWELLIND_CHILLERS,
  ...KELVINATOR_WATERCOOLERS,
  ...KELVINATOR_CHILLERS,
  ...CELFROST_WATERCOOLERS,
  ...CELFROST_CHILLERS,
  ...FRICKINDIA_WATERCOOLERS,
  ...FRICKINDIA_CHILLERS,
  ...ATLASCOPCO_COMPRESSORS,
  ...ATLASCOPCO_OTHER,
  ...INGERSOLLRAND_COMPRESSORS,
  ...INGERSOLLRAND_OTHER,
  ...ELGI_COMPRESSORS,
  ...ELGI_OTHER,
  ...KAESER_COMPRESSORS,
  ...KAESER_OTHER,
  ...KIRLOSKARPNEUMATIC_COMPRESSORS,
  ...KIRLOSKARPNEUMATIC_OTHER,
  ...DOOSAN_COMPRESSORS,
  ...DOOSAN_OTHER,
  ...BOGE_COMPRESSORS,
  ...BOGE_OTHER,
  ...SULLAIR_COMPRESSORS,
  ...SULLAIR_OTHER,
  ...CHICAGOPNEUMATIC_COMPRESSORS,
  ...CHICAGOPNEUMATIC_OTHER,
  ...MATTEI_COMPRESSORS,
  ...MATTEI_OTHER
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
  'Nagpur, Maharashtra', 'Coimbatore, Tamil Nadu', 'Surat, Gujarat', 'Jaipur, Rajasthan',
  'Lucknow, Uttar Pradesh', 'Indore, Madhya Pradesh', 'Vadodara, Gujarat', 'Visakhapatnam, Andhra Pradesh',
  'Bhopal, Madhya Pradesh', 'Ludhiana, Punjab', 'Kanpur, Uttar Pradesh', 'Rajkot, Gujarat'
];

// Business-type suffix cycles independently of city so two dealers that happen to land in the
// same city (inevitable once a brand has more products than there are cities) still read as
// two distinct businesses rather than an obvious clone with only the numbers changed.
const DEALER_TYPES = [
  'Authorized Dealer', 'Corporate Dealer', 'Regional Distributor', 'Authorized Channel Partner',
  'Premium Distributor', 'Authorized Service & Sales Partner'
];

// Formats a realistic-looking (not real/dialable) Indian mobile number, deterministic per idx
// so the same supplier always gets the same number rather than a fresh random one per build.
function formatPhone(idx: number): string {
  const prefixes = ['98', '97', '99', '96', '95', '90', '88', '77'];
  const prefix = prefixes[idx % prefixes.length];
  const rest = String(1000000 + ((idx * 7919) % 8999999)).padStart(8, '0');
  return `+91 ${prefix}${rest.slice(0, 3)} ${rest.slice(3, 8)}`;
}

function toSupplier(seed: Seed, idx: number): Supplier {
  const city = CITIES[idx % CITIES.length];
  const dealerType = DEALER_TYPES[Math.floor(idx / CITIES.length) % DEALER_TYPES.length];
  const experienceYears = 8 + (idx % 35);
  const rating = Math.round((4.1 + (idx % 8) * 0.09) * 10) / 10;
  const reviewsCount = 45 + ((idx * 13) % 320);
  const responseHrs = (1.2 + (idx % 9) * 0.35).toFixed(1);
  // How fast a seller replies (responseTime) and whether they reply at all (responseRate)
  // are independent signals — deliberately not derived from each other.
  const responseRate = 62 + (idx % 34);
  const brandShort = BRAND_NAMES[seed.brandId].split(' ')[0];

  return {
    id: `${seed.id}-supp-1`,
    name: `${brandShort} ${city.split(',')[0]} ${dealerType}`,
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
    responseRate,
    deliveryTimeRange: seed.deliveryTime,
    priceEstimate: seed.priceRange,
    contactPhone: formatPhone(idx)
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
    id: 'dell-laptops',
    brandId: 'dell',
    mcatId: 'laptops',
    name: 'Dell Laptops',
    tagline: 'Enterprise-grade laptops for business deployment',
    description: 'Dell manufactures business, ultrabook, gaming, and workstation laptops engineered for enterprise and institutional bulk deployment.',
    applications: ['Corporate Deployment', 'Educational Institutions', 'Government Procurement', 'SME Bulk Purchase']
  },
  {
    id: 'hp-laptops',
    brandId: 'hp',
    mcatId: 'laptops',
    name: 'HP Laptops',
    tagline: "India's trusted laptop brand for business and consumer use",
    description: 'HP manufactures business, ultrabook, gaming, and workstation laptops for enterprise, education, and retail bulk buyers.',
    applications: ['Corporate Deployment', 'Educational Institutions', 'Retail Bulk Purchase', 'Government Procurement']
  },
  {
    id: 'lenovo-laptops',
    brandId: 'lenovo',
    mcatId: 'laptops',
    name: 'Lenovo Laptops',
    tagline: 'ThinkPad heritage business computing',
    description: 'Lenovo manufactures ThinkPad-class business laptops, ultrabooks, and workstations engineered for enterprise reliability.',
    applications: ['Corporate Deployment', 'Enterprise IT', 'Government Procurement', 'Educational Institutions']
  },
  {
    id: 'asus-laptops',
    brandId: 'asus',
    mcatId: 'laptops',
    name: 'Asus Laptops',
    tagline: 'Taiwanese engineering for business and gaming laptops',
    description: 'Asus manufactures business laptops, ultrabooks, and gaming laptops for enterprise and retail bulk buyers.',
    applications: ['Corporate Deployment', 'Retail Bulk Purchase', 'Gaming & Content Creation', 'Educational Institutions']
  },
  {
    id: 'acer-laptops',
    brandId: 'acer',
    mcatId: 'laptops',
    name: 'Acer Laptops',
    tagline: 'Value-focused laptops for business and education',
    description: 'Acer manufactures budget and business laptops, Chromebooks, and gaming laptops for cost-conscious bulk buyers.',
    applications: ['Educational Institutions', 'SME Bulk Purchase', 'Retail Distribution', 'Government Procurement']
  },
  {
    id: 'apple-laptops',
    brandId: 'apple',
    mcatId: 'laptops',
    name: 'Apple Laptops',
    tagline: 'Premium computing for enterprise and creative professionals',
    description: 'Apple manufactures premium MacBook-class laptops for enterprise, creative, and executive bulk deployment.',
    applications: ['Enterprise Executive Deployment', 'Creative & Design Studios', 'Corporate Bulk Purchase', 'Retail Distribution']
  },
  {
    id: 'msi-laptops',
    brandId: 'msi',
    mcatId: 'laptops',
    name: 'MSI Laptops',
    tagline: 'Gaming and content-creation laptop specialist',
    description: 'MSI manufactures gaming laptops and mobile workstations for content creation and high-performance computing buyers.',
    applications: ['Gaming & Esports', 'Content Creation Studios', 'Retail Bulk Purchase', 'Workstation Deployment']
  },
  {
    id: 'samsung-laptops',
    brandId: 'samsung',
    mcatId: 'laptops',
    name: 'Samsung Laptops',
    tagline: 'Galaxy Book-class laptops for business and consumer use',
    description: 'Samsung manufactures Galaxy Book-class ultrabooks and business laptops for enterprise and retail bulk buyers.',
    applications: ['Corporate Deployment', 'Retail Bulk Purchase', 'Educational Institutions', 'SME Bulk Purchase']
  },
  {
    id: 'lg-laptops',
    brandId: 'lg',
    mcatId: 'laptops',
    name: 'LG Laptops',
    tagline: 'Gram-class ultra-lightweight business laptops',
    description: 'LG manufactures Gram-class ultra-lightweight laptops engineered for business travel and executive deployment.',
    applications: ['Executive Deployment', 'Business Travel', 'Corporate Bulk Purchase', 'Retail Distribution']
  },
  {
    id: 'microsoft-laptops',
    brandId: 'microsoft',
    mcatId: 'laptops',
    name: 'Microsoft Laptops',
    tagline: 'Surface-class laptops and 2-in-1 devices',
    description: 'Microsoft manufactures Surface-class laptops and 2-in-1 convertible devices for enterprise and creative bulk buyers.',
    applications: ['Enterprise Deployment', 'Creative Professionals', 'Corporate Bulk Purchase', 'Educational Institutions']
  },
  {
    id: 'samsung-mobilephones',
    brandId: 'samsung',
    mcatId: 'mobile-phones',
    name: 'Samsung Mobile Phones',
    tagline: "World's largest smartphone manufacturer",
    description: 'Samsung manufactures Galaxy-class smartphones spanning entry-level to foldable flagships for wholesale and retail buyers.',
    applications: ['Retail & Wholesale Distribution', 'Corporate Bulk Purchase', 'E-commerce Channel Stocking', 'Telecom Bundling']
  },
  {
    id: 'apple-mobilephones',
    brandId: 'apple',
    mcatId: 'mobile-phones',
    name: 'Apple Mobile Phones',
    tagline: 'Premium iPhone-class smartphones',
    description: 'Apple manufactures iPhone-class premium smartphones for authorized retail and corporate bulk distribution.',
    applications: ['Authorized Retail Distribution', 'Corporate Bulk Purchase', 'E-commerce Channel Stocking', 'Premium Retail']
  },
  {
    id: 'xiaomi-mobilephones',
    brandId: 'xiaomi',
    mcatId: 'mobile-phones',
    name: 'Xiaomi Mobile Phones',
    tagline: "India's leading value smartphone brand",
    description: 'Xiaomi manufactures Redmi-class value smartphones spanning entry-level to flagship segments for wholesale buyers.',
    applications: ['Retail & Wholesale Distribution', 'E-commerce Channel Stocking', 'Telecom Bundling', 'Rural Market Distribution']
  },
  {
    id: 'oneplus-mobilephones',
    brandId: 'oneplus',
    mcatId: 'mobile-phones',
    name: 'OnePlus Mobile Phones',
    tagline: 'Flagship-focused smartphone brand',
    description: 'OnePlus manufactures flagship and premium smartphones for retail and e-commerce channel distribution.',
    applications: ['Retail Distribution', 'E-commerce Channel Stocking', 'Corporate Bulk Purchase', 'Premium Retail']
  },
  {
    id: 'vivo-mobilephones',
    brandId: 'vivo',
    mcatId: 'mobile-phones',
    name: 'Vivo Mobile Phones',
    tagline: 'Camera-focused smartphone manufacturer',
    description: 'Vivo manufactures camera-focused smartphones spanning entry-level to flagship segments for wholesale buyers.',
    applications: ['Retail & Wholesale Distribution', 'E-commerce Channel Stocking', 'Telecom Bundling', 'Rural Market Distribution']
  },
  {
    id: 'oppo-mobilephones',
    brandId: 'oppo',
    mcatId: 'mobile-phones',
    name: 'Oppo Mobile Phones',
    tagline: 'Design-focused smartphone manufacturer',
    description: 'Oppo manufactures design-focused smartphones spanning entry-level to flagship segments for wholesale buyers.',
    applications: ['Retail & Wholesale Distribution', 'E-commerce Channel Stocking', 'Telecom Bundling', 'Rural Market Distribution']
  },
  {
    id: 'realme-mobilephones',
    brandId: 'realme',
    mcatId: 'mobile-phones',
    name: 'Realme Mobile Phones',
    tagline: 'Youth-focused value smartphone brand',
    description: 'Realme manufactures value-focused smartphones for budget-conscious retail and wholesale buyers.',
    applications: ['Retail & Wholesale Distribution', 'E-commerce Channel Stocking', 'Rural Market Distribution', 'Youth Market Retail']
  },
  {
    id: 'motorola-mobilephones',
    brandId: 'motorola',
    mcatId: 'mobile-phones',
    name: 'Motorola Mobile Phones',
    tagline: 'Legacy American smartphone brand, now Lenovo-owned',
    description: 'Motorola manufactures Moto-class smartphones spanning budget to premium segments for retail distribution.',
    applications: ['Retail Distribution', 'E-commerce Channel Stocking', 'Corporate Bulk Purchase', 'Telecom Bundling']
  },
  {
    id: 'nokiahmd-mobilephones',
    brandId: 'nokiahmd',
    mcatId: 'mobile-phones',
    name: 'Nokia Mobile Phones',
    tagline: 'Trusted legacy brand, manufactured under license by HMD Global',
    description: 'HMD Global manufactures Nokia-branded smartphones and feature phones known for durability and reliability.',
    applications: ['Retail Distribution', 'Rural Market Distribution', 'Corporate Bulk Purchase', 'Feature Phone Markets']
  },
  {
    id: 'google-mobilephones',
    brandId: 'google',
    mcatId: 'mobile-phones',
    name: 'Google Mobile Phones',
    tagline: 'Pixel-class smartphones with pure Android experience',
    description: 'Google manufactures Pixel-class smartphones known for camera quality and pure Android software experience.',
    applications: ['Premium Retail Distribution', 'E-commerce Channel Stocking', 'Corporate Bulk Purchase', 'Developer & Enthusiast Markets']
  },
  {
    id: 'pidilite-chemicals',
    brandId: 'pidilite',
    mcatId: 'chemicals',
    name: 'Pidilite Chemicals',
    tagline: "India's leading adhesives and construction chemicals brand",
    description: 'Pidilite Industries manufactures adhesives, sealants, and waterproofing compounds for construction, woodworking, and industrial applications.',
    applications: ['Construction & Waterproofing', 'Woodworking & Furniture', 'General Bonding & Repair', 'Industrial Adhesives']
  },
  {
    id: 'asianpaints-chemicals',
    brandId: 'asianpaints',
    mcatId: 'chemicals',
    name: 'Asian Paints Chemicals',
    tagline: "India's largest paints and coatings manufacturer",
    description: 'Asian Paints manufactures exterior and interior emulsions, wood finishes, and industrial coatings for residential and commercial applications.',
    applications: ['Exterior Wall Painting', 'Interior Wall Painting', 'Wood & Furniture Finishing', 'Industrial Coatings']
  },
  {
    id: 'bergerpaints-chemicals',
    brandId: 'bergerpaints',
    mcatId: 'chemicals',
    name: 'Berger Paints Chemicals',
    tagline: "India's trusted paints and coatings brand since 1760",
    description: 'Berger Paints manufactures exterior and interior emulsions, wood finishes, and protective coatings for residential and commercial applications.',
    applications: ['Exterior Wall Painting', 'Interior Wall Painting', 'Wood & Furniture Finishing', 'Protective Coatings']
  },
  {
    id: 'srf-chemicals',
    brandId: 'srf',
    mcatId: 'chemicals',
    name: 'SRF Chemicals',
    tagline: 'Diversified specialty chemicals and fluorochemicals group',
    description: 'SRF Limited manufactures refrigerant gases, packaging films, and specialty fluoropolymers for industrial and consumer applications.',
    applications: ['Air Conditioning & Refrigeration', 'Flexible Packaging', 'Industrial Coatings', 'Cable Insulation']
  },
  {
    id: 'upl-chemicals',
    brandId: 'upl',
    mcatId: 'chemicals',
    name: 'UPL Agrochemicals',
    tagline: "India's leading agrochemicals and crop protection company",
    description: 'UPL Limited manufactures herbicides, insecticides, and fungicides for crop protection and agricultural applications.',
    applications: ['Weed Control', 'Pest Control', 'Fungal Disease Control', 'Agricultural Crop Protection']
  },
  {
    id: 'deepaknitrite-chemicals',
    brandId: 'deepaknitrite',
    mcatId: 'chemicals',
    name: 'Deepak Nitrite Chemicals',
    tagline: 'Basic and specialty chemicals manufacturer since 1970',
    description: 'Deepak Nitrite manufactures basic and specialty chemicals including nitrites, fuel additives, and phenolic derivatives for industrial applications.',
    applications: ['Dyes & Pharma Manufacturing', 'Rubber Chemicals', 'Fuel Additives', 'Industrial Solvents']
  },
  {
    id: 'aartiindustries-chemicals',
    brandId: 'aartiindustries',
    mcatId: 'chemicals',
    name: 'Aarti Industries Chemicals',
    tagline: 'Specialty chemicals and pharma intermediates manufacturer',
    description: 'Aarti Industries manufactures specialty chemical, pharma, and dye intermediates for agrochemical, pharmaceutical, and textile industries.',
    applications: ['Agrochemical Intermediates', 'Pharmaceutical Manufacturing', 'Textile Dyeing', 'Pigment Manufacturing']
  },
  {
    id: 'atul-chemicals',
    brandId: 'atul',
    mcatId: 'chemicals',
    name: 'Atul Chemicals',
    tagline: 'Diversified Indian chemicals group since 1947',
    description: 'Atul Limited manufactures dyes, pigments, pharma intermediates, and aromatic chemicals for textile, pharma, and fragrance industries.',
    applications: ['Textile & Leather Dyeing', 'Pharmaceutical Manufacturing', 'Fragrance & Flavor Manufacturing', 'Industrial Chemicals']
  },
  {
    id: 'gujaratfluoro-chemicals',
    brandId: 'gujaratfluoro',
    mcatId: 'chemicals',
    name: 'Gujarat Fluorochemicals',
    tagline: "India's leading fluoropolymer and refrigerant gas manufacturer",
    description: 'Gujarat Fluorochemicals manufactures PTFE fluoropolymers, refrigerant gases, and specialty fluorochemicals for industrial applications.',
    applications: ['Non-Stick & Sealing Applications', 'Automotive & AC Refrigeration', 'Industrial Coatings', 'Textile Water Repellents']
  },
  {
    id: 'tatachemicals-chemicals',
    brandId: 'tatachemicals',
    mcatId: 'chemicals',
    name: 'Tata Chemicals',
    tagline: 'Trusted Tata Group basic and specialty chemicals brand',
    description: 'Tata Chemicals manufactures soda ash, sodium bicarbonate, and specialty silica for glass, food, pharma, and rubber industries.',
    applications: ['Glass Manufacturing', 'Food & Pharma Grade Chemicals', 'Detergent Manufacturing', 'Tyre & Rubber Reinforcement']
  },
  {
    id: 'supremeindustries-pipes',
    brandId: 'supremeindustries',
    mcatId: 'pipes',
    name: 'Supreme Pipes',
    tagline: "India's largest plastic piping manufacturer",
    description: 'Supreme Industries manufactures uPVC pipes engineered for reliable plumbing and water supply applications across residential and commercial construction.',
    applications: ['Plumbing & Water Supply', 'Residential Construction', 'Commercial Buildings', 'Borewell Applications']
  },
  {
    id: 'finolexindustries-pipes',
    brandId: 'finolexindustries',
    mcatId: 'pipes',
    name: 'Finolex Pipes',
    tagline: "India's trusted agricultural piping brand",
    description: 'Finolex Industries manufactures uPVC agricultural pipes engineered for irrigation and borewell water supply applications.',
    applications: ['Agricultural Irrigation', 'Borewell Water Supply', 'Rural Water Systems', 'Plumbing']
  },
  {
    id: 'astral-pipes',
    brandId: 'astral',
    mcatId: 'pipes',
    name: 'Astral Pipes',
    tagline: "India's leading CPVC piping brand",
    description: 'Astral manufactures CPVC hot and cold water pipes engineered for durable residential and commercial plumbing applications.',
    applications: ['Hot & Cold Water Plumbing', 'Residential Construction', 'Commercial Buildings', 'Industrial Piping']
  },
  {
    id: 'jainirrigation-pipes',
    brandId: 'jainirrigation',
    mcatId: 'pipes',
    name: 'Jain Irrigation Pipes',
    tagline: "India's largest micro-irrigation systems manufacturer",
    description: 'Jain Irrigation Systems manufactures HDPE irrigation pipes engineered for drip and sprinkler irrigation applications.',
    applications: ['Drip & Sprinkler Irrigation', 'Agricultural Water Management', 'Rural Water Systems', 'Micro-Irrigation']
  },
  {
    id: 'princepipes-pipes',
    brandId: 'princepipes',
    mcatId: 'pipes',
    name: 'Prince Pipes',
    tagline: "India's trusted plumbing and drainage piping brand",
    description: 'Prince Pipes and Fittings manufactures uPVC SWR pipes engineered for soil, waste, and rainwater drainage applications.',
    applications: ['Soil, Waste & Rainwater Drainage', 'Residential Construction', 'Commercial Buildings', 'Plumbing']
  },
  {
    id: 'ashirvadpipes-pipes',
    brandId: 'ashirvadpipes',
    mcatId: 'pipes',
    name: 'Ashirvad Pipes',
    tagline: 'Part of the global Aliaxis piping group',
    description: 'Ashirvad Pipes manufactures CPVC plumbing pipes engineered for durable hot and cold water supply applications.',
    applications: ['Hot & Cold Water Plumbing', 'Residential Construction', 'Commercial Buildings', 'Healthcare Facilities']
  },
  {
    id: 'apollopipes-pipes',
    brandId: 'apollopipes',
    mcatId: 'pipes',
    name: 'Apollo Pipes',
    tagline: 'Growing Indian piping and fittings brand',
    description: 'Apollo Pipes manufactures uPVC plumbing pipes engineered for reliable water supply applications across India.',
    applications: ['Plumbing & Water Supply', 'Residential Construction', 'Agricultural Use', 'Borewell Applications']
  },
  {
    id: 'jindalsaw-pipes',
    brandId: 'jindalsaw',
    mcatId: 'pipes',
    name: 'Jindal SAW Pipes',
    tagline: 'Large-diameter steel pipe manufacturing since 1984',
    description: 'Jindal SAW Limited manufactures SAW/ERW steel pipes engineered for oil & gas transmission and large-scale water infrastructure projects.',
    applications: ['Oil & Gas Transmission', 'Water Transmission Infrastructure', 'Cross-Country Pipelines', 'Industrial Piping']
  },
  {
    id: 'suryaroshni-pipes',
    brandId: 'suryaroshni',
    mcatId: 'pipes',
    name: 'Surya Roshni Pipes',
    tagline: 'Diversified Indian GI/MS pipe manufacturer',
    description: 'Surya Roshni Limited manufactures GI and MS pipes engineered for plumbing, fire fighting, and structural applications.',
    applications: ['Plumbing', 'Fire Fighting Systems', 'Structural Applications', 'Industrial Piping']
  },
  {
    id: 'kisanmouldings-pipes',
    brandId: 'kisanmouldings',
    mcatId: 'pipes',
    name: 'Kisan Pipes',
    tagline: 'Mumbai-based PVC piping manufacturer',
    description: 'Kisan Mouldings manufactures uPVC plumbing pipes engineered for reliable water supply applications across India.',
    applications: ['Plumbing & Water Supply', 'Residential Construction', 'Agricultural Use', 'Small Commercial Use']
  },
  {
    id: 'ultratech-construction',
    brandId: 'ultratech',
    mcatId: 'construction',
    name: 'UltraTech Cement',
    tagline: "India's largest cement manufacturer",
    description: 'UltraTech Cement manufactures OPC, PPC, PSC, and specialty cement grades along with Ready Mix Concrete for residential, commercial, and infrastructure construction.',
    applications: ['Residential Construction', 'Commercial Buildings', 'Infrastructure Projects', 'Ready Mix Concrete Supply']
  },
  {
    id: 'ambuja-construction',
    brandId: 'ambuja',
    mcatId: 'construction',
    name: 'Ambuja Cements',
    tagline: 'Trusted Indian cement brand, part of the Adani Group',
    description: 'Ambuja Cements manufactures OPC, PPC, and specialty cement grades engineered for durable residential and commercial construction.',
    applications: ['Residential Construction', 'Commercial Buildings', 'Infrastructure Projects', 'Waterproofing Applications']
  },
  {
    id: 'acccement-construction',
    brandId: 'acccement',
    mcatId: 'construction',
    name: 'ACC Cement',
    tagline: "India's pioneering cement brand since 1936",
    description: 'ACC Limited manufactures OPC, PPC, and specialty cement grades along with Ready Mix Concrete for construction and infrastructure projects.',
    applications: ['Residential Construction', 'Commercial Buildings', 'Infrastructure Projects', 'Ready Mix Concrete Supply']
  },
  {
    id: 'jkcement-construction',
    brandId: 'jkcement',
    mcatId: 'construction',
    name: 'JK Cement',
    tagline: "India's leading white cement manufacturer",
    description: 'JK Cement manufactures grey cement, white cement, and specialty cement grades for construction, décor, and waterproofing applications.',
    applications: ['Residential Construction', 'Decorative Applications', 'Waterproofing', 'Commercial Buildings']
  },
  {
    id: 'shreecement-construction',
    brandId: 'shreecement',
    mcatId: 'construction',
    name: 'Shree Cement',
    tagline: "India's most energy-efficient cement manufacturer",
    description: 'Shree Cement manufactures OPC, PPC, and PSC cement grades engineered for durable construction across residential and infrastructure projects.',
    applications: ['Residential Construction', 'Commercial Buildings', 'Infrastructure Projects', 'Rural Housing']
  },
  {
    id: 'tatasteel-construction',
    brandId: 'tatasteel',
    mcatId: 'construction',
    name: 'Tata Steel Construction Materials',
    tagline: "India's oldest and most trusted steel brand",
    description: 'Tata Steel manufactures Tiscon TMT rebars, Structura structural steel, and Shaktee GI sheets for residential and infrastructure construction.',
    applications: ['RCC Structural Reinforcement', 'Structural Framework', 'Roofing & Cladding', 'Residential Construction']
  },
  {
    id: 'jswsteel-construction',
    brandId: 'jswsteel',
    mcatId: 'construction',
    name: 'JSW Steel Construction Materials',
    tagline: "India's leading integrated steel manufacturer",
    description: 'JSW Steel manufactures Neosteel TMT rebars, hot/cold rolled coils, and Galvalume sheets for residential, commercial, and infrastructure construction.',
    applications: ['RCC Structural Reinforcement', 'Fabrication', 'Roofing & Wall Cladding', 'Infrastructure Projects']
  },
  {
    id: 'sail-construction',
    brandId: 'sail',
    mcatId: 'construction',
    name: 'SAIL Construction Materials',
    tagline: 'Public sector steel major since 1954',
    description: 'Steel Authority of India manufactures TMT rebars, structural beams, plates, and railway track rails for infrastructure and heavy construction projects.',
    applications: ['RCC Structural Reinforcement', 'Heavy Structural Framework', 'Railway Infrastructure', 'Bridges & Pressure Vessels']
  },
  {
    id: 'jindalsteel-construction',
    brandId: 'jindalsteel',
    mcatId: 'construction',
    name: 'Jindal Steel Construction Materials',
    tagline: 'Diversified Indian steel and infrastructure group',
    description: 'Jindal Steel and Power manufactures Panther TMT rebars, structural steel, and railway track rails for infrastructure and construction projects.',
    applications: ['RCC Structural Reinforcement', 'Structural Framework', 'Railway Infrastructure', 'Infrastructure Projects']
  },
  {
    id: 'kajaria-construction',
    brandId: 'kajaria',
    mcatId: 'construction',
    name: 'Kajaria Ceramics',
    tagline: "India's largest tile manufacturer",
    description: 'Kajaria Ceramics manufactures ceramic, vitrified, and specialty tiles for residential and commercial flooring and wall applications.',
    applications: ['Residential Flooring & Walls', 'Commercial Buildings', 'Outdoor & Parking Areas', 'Swimming Pools']
  },
  {
    id: 'waaree-solar',
    brandId: 'waaree',
    mcatId: 'solar-equipment',
    name: 'Waaree Solar Equipment',
    tagline: "India's largest solar panel manufacturer",
    description: 'Waaree Energies manufactures solar panels, inverters, and balance-of-system equipment for rooftop and utility-scale solar installations.',
    applications: ['Rooftop Solar Installations', 'Utility-Scale Solar Farms', 'Industrial Captive Power', 'Agricultural Solar Pumping']
  },
  {
    id: 'adanisolar-solar',
    brandId: 'adanisolar',
    mcatId: 'solar-equipment',
    name: 'Adani Solar Equipment',
    tagline: "India's largest integrated solar cell and module manufacturer",
    description: 'Adani Solar manufactures solar panels and balance-of-system equipment for utility-scale and rooftop solar installations across India.',
    applications: ['Utility-Scale Solar Farms', 'Rooftop Solar Installations', 'Industrial Captive Power', 'Government Solar Projects']
  },
  {
    id: 'tatapowersolar-solar',
    brandId: 'tatapowersolar',
    mcatId: 'solar-equipment',
    name: 'Tata Power Solar Equipment',
    tagline: 'Trusted Tata Group solar energy brand',
    description: 'Tata Power Solar manufactures solar panels, inverters, and balance-of-system equipment for residential, commercial, and utility-scale installations.',
    applications: ['Residential Solar', 'Commercial Rooftop Solar', 'Utility-Scale Solar Farms', 'Industrial Captive Power']
  },
  {
    id: 'vikramsolar-solar',
    brandId: 'vikramsolar',
    mcatId: 'solar-equipment',
    name: 'Vikram Solar Equipment',
    tagline: 'Kolkata-based solar module manufacturer',
    description: 'Vikram Solar manufactures solar panels and balance-of-system equipment for utility-scale and rooftop solar installations across India.',
    applications: ['Utility-Scale Solar Farms', 'Rooftop Solar Installations', 'Industrial Captive Power', 'Export Markets']
  },
  {
    id: 'luminous-solar',
    brandId: 'luminous',
    mcatId: 'solar-equipment',
    name: 'Luminous Solar Equipment',
    tagline: "India's trusted power backup and solar brand",
    description: 'Luminous Power Technologies manufactures solar inverters, batteries, and charge controllers for residential and small commercial solar installations.',
    applications: ['Residential Solar', 'Small Commercial Solar', 'Off-Grid Power Systems', 'Home Backup Power']
  },
  {
    id: 'goldisolar-solar',
    brandId: 'goldisolar',
    mcatId: 'solar-equipment',
    name: 'Goldi Solar Equipment',
    tagline: 'Surat-based solar module manufacturer',
    description: 'Goldi Solar manufactures solar panels and balance-of-system equipment for rooftop and utility-scale solar installations across India.',
    applications: ['Rooftop Solar Installations', 'Utility-Scale Solar Farms', 'Industrial Captive Power', 'Agricultural Solar Pumping']
  },
  {
    id: 'renewsys-solar',
    brandId: 'renewsys',
    mcatId: 'solar-equipment',
    name: 'RenewSys Solar Equipment',
    tagline: "India's integrated solar manufacturing group",
    description: 'RenewSys manufactures solar panels, encapsulants, and backsheets for rooftop and utility-scale solar installations across India.',
    applications: ['Utility-Scale Solar Farms', 'Rooftop Solar Installations', 'Industrial Captive Power', 'Export Markets']
  },
  {
    id: 'emmvee-solar',
    brandId: 'emmvee',
    mcatId: 'solar-equipment',
    name: 'EMMVEE Solar Equipment',
    tagline: 'Bengaluru-based solar module and pump manufacturer',
    description: 'EMMVEE manufactures solar panels, water heaters, and solar pump systems for residential, agricultural, and utility-scale applications.',
    applications: ['Agricultural Solar Pumping', 'Rooftop Solar Installations', 'Utility-Scale Solar Farms', 'Solar Water Heating']
  },
  {
    id: 'premierenergies-solar',
    brandId: 'premierenergies',
    mcatId: 'solar-equipment',
    name: 'Premier Energies Solar Equipment',
    tagline: "India's leading integrated solar cell manufacturer",
    description: 'Premier Energies manufactures solar cells, panels, and balance-of-system equipment for utility-scale and rooftop solar installations.',
    applications: ['Utility-Scale Solar Farms', 'Rooftop Solar Installations', 'Industrial Captive Power', 'Government Solar Projects']
  },
  {
    id: 'ltelectrical-switchgear',
    brandId: 'ltelectrical',
    mcatId: 'switchgear',
    name: 'L&T Switchgear',
    tagline: "India's trusted heavy electrical engineering group",
    description: 'L&T Electrical & Automation manufactures MCCBs, ACBs, contactors, and distribution boards for industrial and commercial power distribution applications.',
    applications: ['Power Distribution Panels', 'Industrial Plants', 'Commercial Buildings', 'Infrastructure Projects']
  },
  {
    id: 'legrand-switchgear',
    brandId: 'legrand',
    mcatId: 'switchgear',
    name: 'Legrand Switchgear',
    tagline: 'French electrical infrastructure engineering group',
    description: 'Legrand manufactures MCBs, MCCBs, distribution boards, and surge protection devices for residential, commercial, and industrial applications.',
    applications: ['Residential Wiring', 'Commercial Buildings', 'Industrial Plants', 'Data Centers']
  },
  {
    id: 'cselectric-switchgear',
    brandId: 'cselectric',
    mcatId: 'switchgear',
    name: 'C&S Electric Switchgear',
    tagline: 'Trusted Indian switchgear manufacturer since 1968',
    description: 'C&S Electric manufactures MCCBs, MCBs, distribution boards, and contactors for industrial and commercial power distribution applications.',
    applications: ['Power Distribution Panels', 'Industrial Plants', 'Commercial Buildings', 'General Industry']
  },
  {
    id: 'eaton-switchgear',
    brandId: 'eaton',
    mcatId: 'switchgear',
    name: 'Eaton Switchgear',
    tagline: 'American power management engineering group',
    description: 'Eaton manufactures MCCBs, ACBs, surge protection devices, and bus bar trunking systems for critical power distribution applications.',
    applications: ['Data Centers', 'Industrial Plants', 'Commercial Buildings', 'Critical Power Infrastructure']
  },
  {
    id: 'standardelectricals-switchgear',
    brandId: 'standardelectricals',
    mcatId: 'switchgear',
    name: 'Standard Electricals Switchgear',
    tagline: 'Value-focused Indian switchgear brand',
    description: 'Standard Electricals manufactures affordable MCBs, MCCBs, and distribution boards for residential and light commercial applications.',
    applications: ['Residential Wiring', 'Small Commercial Use', 'General Maintenance', 'Light Industrial Use']
  },
  {
    id: 'siemens-switchgear',
    brandId: 'siemens',
    mcatId: 'switchgear',
    name: 'Siemens Switchgear',
    tagline: 'German electrical engineering for power distribution',
    description: 'Siemens manufactures MCCBs, ACBs, and protection relays for industrial and commercial power distribution applications.',
    applications: ['Power Distribution Panels', 'Industrial Plants', 'Commercial Buildings', 'Data Centers']
  },
  {
    id: 'abb-switchgear',
    brandId: 'abb',
    mcatId: 'switchgear',
    name: 'ABB Switchgear',
    tagline: 'Swiss-Swedish switchgear and protection engineering',
    description: 'ABB manufactures MCCBs, ACBs, contactors, and protection relays for industrial and utility power distribution applications.',
    applications: ['Power Distribution Panels', 'Utility Networks', 'Industrial Plants', 'Critical Infrastructure']
  },
  {
    id: 'schneiderelectric-switchgear',
    brandId: 'schneiderelectric',
    mcatId: 'switchgear',
    name: 'Schneider Electric Switchgear',
    tagline: 'French energy management and switchgear engineering',
    description: 'Schneider Electric manufactures MCCBs, ACBs, distribution boards, and surge protection devices for building and industrial power applications.',
    applications: ['Building Automation', 'Power Distribution Panels', 'Industrial Plants', 'Data Centers']
  },
  {
    id: 'ge-switchgear',
    brandId: 'ge',
    mcatId: 'switchgear',
    name: 'GE Switchgear',
    tagline: 'Global industrial power distribution engineering',
    description: 'GE manufactures MCCBs, ACBs, and protection relays for heavy industrial and utility power distribution applications.',
    applications: ['Heavy Industrial Plants', 'Utility Networks', 'Power Generation', 'Critical Infrastructure']
  },
  {
    id: 'polycab-cables',
    brandId: 'polycab',
    mcatId: 'power-cables',
    name: 'Polycab Cables',
    tagline: "India's largest wires and cables manufacturer",
    description: 'Polycab manufactures XLPE power cables engineered for safe, reliable power transmission and distribution across industrial and infrastructure applications.',
    applications: ['Power Distribution Networks', 'Industrial Plant Wiring', 'Building Infrastructure', 'Renewable Energy Installations']
  },
  {
    id: 'kei-cables',
    brandId: 'kei',
    mcatId: 'power-cables',
    name: 'KEI Cables',
    tagline: 'Trusted Indian cable manufacturer since 1968',
    description: 'KEI Industries manufactures XLPE power cables for industrial, infrastructure, and utility power transmission applications.',
    applications: ['Power Distribution Networks', 'Industrial Plant Wiring', 'Infrastructure Projects', 'Utility Networks']
  },
  {
    id: 'finolexcables-cables',
    brandId: 'finolexcables',
    mcatId: 'power-cables',
    name: 'Finolex Cables',
    tagline: 'Trusted Indian cable and wire brand since 1958',
    description: 'Finolex Cables manufactures XLPE power cables for residential, commercial, and industrial power distribution applications.',
    applications: ['Residential Wiring', 'Commercial Buildings', 'Industrial Plant Wiring', 'Power Distribution']
  },
  {
    id: 'rrkabel-cables',
    brandId: 'rrkabel',
    mcatId: 'power-cables',
    name: 'RR Kabel Cables',
    tagline: "India's leading wires and cables exporter",
    description: 'RR Kabel manufactures XLPE power cables for industrial, infrastructure, and residential power distribution applications.',
    applications: ['Power Distribution Networks', 'Residential Wiring', 'Industrial Plant Wiring', 'Export Markets']
  },
  {
    id: 'vguard-cables',
    brandId: 'vguard',
    mcatId: 'power-cables',
    name: 'V-Guard Cables',
    tagline: 'Trusted South Indian electrical brand',
    description: 'V-Guard Industries manufactures XLPE power cables for residential and light industrial power distribution applications.',
    applications: ['Residential Wiring', 'Small Commercial Use', 'Light Industrial Wiring', 'Power Distribution']
  },
  {
    id: 'universalcables-cables',
    brandId: 'universalcables',
    mcatId: 'power-cables',
    name: 'Universal Cables',
    tagline: 'KEC Group heavy cable engineering',
    description: 'Universal Cables manufactures XLPE power cables engineered for utility, infrastructure, and heavy industrial power transmission applications.',
    applications: ['Utility Power Transmission', 'Infrastructure Projects', 'Heavy Industrial Plants', 'Power Distribution']
  },
  {
    id: 'aparindustries-cables',
    brandId: 'aparindustries',
    mcatId: 'power-cables',
    name: 'Apar Industries Cables',
    tagline: 'Diversified Indian conductor and cable engineering group',
    description: 'Apar Industries manufactures XLPE power cables and conductors for utility, transmission, and industrial power applications.',
    applications: ['Power Transmission', 'Utility Networks', 'Industrial Plants', 'Infrastructure Projects']
  },
  {
    id: 'torrentcables-cables',
    brandId: 'torrentcables',
    mcatId: 'power-cables',
    name: 'Torrent Cables',
    tagline: 'Torrent Group power cable manufacturing',
    description: 'Torrent Cables manufactures XLPE power cables for industrial and utility power distribution applications.',
    applications: ['Power Distribution Networks', 'Industrial Plant Wiring', 'Utility Networks', 'Infrastructure Projects']
  },
  {
    id: 'paramountcommunications-cables',
    brandId: 'paramountcommunications',
    mcatId: 'power-cables',
    name: 'Paramount Cables',
    tagline: 'Delhi-based cable manufacturer since 1955',
    description: 'Paramount Communications manufactures XLPE power cables for railways, defence, and industrial power distribution applications.',
    applications: ['Railways & Defence', 'Industrial Plant Wiring', 'Power Distribution', 'Infrastructure Projects']
  },
  {
    id: 'rockwellautomation-automation',
    brandId: 'rockwellautomation',
    mcatId: 'plc-drives',
    name: 'Allen-Bradley / Rockwell Automation',
    tagline: 'American industrial automation leader',
    description: 'Rockwell Automation manufactures Allen-Bradley PLCs, AC drives, HMI panels, and servo systems for manufacturing and process automation applications.',
    applications: ['Manufacturing Line Control', 'Process Automation', 'Machine Control', 'Motion Control']
  },
  {
    id: 'schneiderelectric-automation',
    brandId: 'schneiderelectric',
    mcatId: 'plc-drives',
    name: 'Schneider Electric Automation',
    tagline: 'French energy management and automation group',
    description: 'Schneider Electric manufactures PLCs, AC drives, HMI panels, and safety relays for building and industrial automation applications.',
    applications: ['Building Automation', 'Manufacturing Line Control', 'Energy Management', 'Process Automation']
  },
  {
    id: 'mitsubishielectric-automation',
    brandId: 'mitsubishielectric',
    mcatId: 'plc-drives',
    name: 'Mitsubishi Electric Automation',
    tagline: 'Japanese industrial automation engineering',
    description: 'Mitsubishi Electric manufactures PLCs, AC drives, servo systems, and HMI panels for manufacturing and machine automation applications.',
    applications: ['Manufacturing Line Control', 'Machine Automation', 'Motion Control', 'Process Automation']
  },
  {
    id: 'omron-automation',
    brandId: 'omron',
    mcatId: 'plc-drives',
    name: 'Omron Automation',
    tagline: 'Japanese sensing and control automation engineering',
    description: 'Omron manufactures PLCs, sensors, safety relays, and servo systems for factory automation and machine control applications.',
    applications: ['Factory Automation', 'Machine Control', 'Sensing & Detection', 'Safety Systems']
  },
  {
    id: 'deltaelectronics-automation',
    brandId: 'deltaelectronics',
    mcatId: 'plc-drives',
    name: 'Delta Electronics Automation',
    tagline: 'Taiwanese power and automation electronics group',
    description: 'Delta Electronics manufactures PLCs, AC drives, HMI panels, and power supplies for value-focused industrial automation applications.',
    applications: ['Manufacturing Line Control', 'Machine Automation', 'Power Management', 'Process Automation']
  },
  {
    id: 'honeywell-automation',
    brandId: 'honeywell',
    mcatId: 'plc-drives',
    name: 'Honeywell Automation',
    tagline: 'American process control and automation engineering',
    description: 'Honeywell Automation manufactures PLCs, industrial PCs, and control systems for process industry and building automation applications.',
    applications: ['Process Industry Control', 'Building Automation', 'Safety Systems', 'Industrial Control']
  },
  {
    id: 'abb-automation',
    brandId: 'abb',
    mcatId: 'plc-drives',
    name: 'ABB Automation',
    tagline: 'Swiss-Swedish industrial automation engineering',
    description: 'ABB manufactures PLCs, AC drives, HMI panels, and motion control systems for process and manufacturing automation applications.',
    applications: ['Process Automation', 'Manufacturing Line Control', 'Motion Control', 'Robotics Integration']
  },
  {
    id: 'ge-automation',
    brandId: 'ge',
    mcatId: 'plc-drives',
    name: 'GE Automation',
    tagline: 'Global industrial automation and control engineering',
    description: 'GE manufactures PLCs, industrial PCs, and control systems for heavy industrial and process automation applications.',
    applications: ['Heavy Industrial Automation', 'Process Control', 'Power Generation Automation', 'Manufacturing Control']
  },
  {
    id: 'yokogawa-automation',
    brandId: 'yokogawa',
    mcatId: 'plc-drives',
    name: 'Yokogawa Automation',
    tagline: 'Japanese process control and DCS engineering',
    description: 'Yokogawa manufactures PLCs, remote I/O modules, and process control systems for process industry automation applications.',
    applications: ['Process Industry Automation', 'Distributed Control Systems', 'Manufacturing Control', 'Safety Systems']
  },
  {
    id: 'mitutoyo-surveying',
    brandId: 'mitutoyo',
    mcatId: 'measuring-instruments',
    name: 'Mitutoyo Measuring Instruments',
    tagline: 'Japanese precision metrology since 1934',
    description: 'Mitutoyo manufactures precision measuring instruments including calipers, micrometers, and dial gauges for quality inspection and manufacturing applications.',
    applications: ['Quality Inspection', 'Manufacturing', 'Metrology Labs', 'Machine Shops']
  },
  {
    id: 'fluke-surveying',
    brandId: 'fluke',
    mcatId: 'measuring-instruments',
    name: 'Fluke Measuring Instruments',
    tagline: 'American electrical test and measurement leader',
    description: 'Fluke manufactures multimeters, clamp meters, and thermal cameras engineered for electrical testing and industrial maintenance applications.',
    applications: ['Electrical Testing', 'Industrial Maintenance', 'Quality Inspection', 'Field Diagnostics']
  },
  {
    id: 'yokogawa-surveying',
    brandId: 'yokogawa',
    mcatId: 'measuring-instruments',
    name: 'Yokogawa Measuring Instruments',
    tagline: 'Japanese process measurement and control engineering',
    description: 'Yokogawa manufactures precision measuring and testing instruments engineered for process industry and industrial quality control applications.',
    applications: ['Process Industry', 'Quality Control', 'Industrial Testing', 'Manufacturing']
  },
  {
    id: 'testo-surveying',
    brandId: 'testo',
    mcatId: 'measuring-instruments',
    name: 'Testo Measuring Instruments',
    tagline: 'German measurement technology since 1957',
    description: 'Testo manufactures thermal cameras, sound level meters, and thickness gauges engineered for industrial measurement and quality inspection applications.',
    applications: ['HVAC Diagnostics', 'Quality Inspection', 'Industrial Testing', 'Environmental Monitoring']
  },
  {
    id: 'htcinstruments-surveying',
    brandId: 'htcinstruments',
    mcatId: 'measuring-instruments',
    name: 'HTC Measuring Instruments',
    tagline: 'Value-focused Indian measuring instrument brand',
    description: 'HTC Instruments manufactures affordable measuring and testing instruments for workshops, quality inspection, and general industrial use.',
    applications: ['Workshop Use', 'Quality Inspection', 'General Industry', 'Small Business Use']
  },
  {
    id: 'keysight-surveying',
    brandId: 'keysight',
    mcatId: 'measuring-instruments',
    name: 'Keysight Measuring Instruments',
    tagline: 'Premium American electronic test and measurement engineering',
    description: 'Keysight Technologies manufactures precision electronic test and measurement instruments for advanced industrial and engineering applications.',
    applications: ['Electronics Testing', 'R&D Labs', 'Advanced Manufacturing', 'Quality Inspection']
  },
  {
    id: 'mahr-surveying',
    brandId: 'mahr',
    mcatId: 'measuring-instruments',
    name: 'Mahr Measuring Instruments',
    tagline: 'German precision metrology since 1861',
    description: 'Mahr manufactures precision measuring instruments including gauges, calipers, and surface testers for manufacturing quality control applications.',
    applications: ['Quality Control', 'Manufacturing', 'Metrology Labs', 'Machine Shops']
  },
  {
    id: 'insize-surveying',
    brandId: 'insize',
    mcatId: 'measuring-instruments',
    name: 'Insize Measuring Instruments',
    tagline: 'Value-focused precision measuring instruments',
    description: 'Insize manufactures affordable precision measuring instruments for workshops, quality inspection, and general manufacturing applications.',
    applications: ['Workshop Use', 'Quality Inspection', 'General Manufacturing', 'Small Business Use']
  },
  {
    id: 'kusammeco-surveying',
    brandId: 'kusammeco',
    mcatId: 'measuring-instruments',
    name: 'Kusam Meco Measuring Instruments',
    tagline: "India's trusted electrical test and measurement brand",
    description: 'Kusam Meco Instruments manufactures electrical test and measurement instruments including multimeters and clamp meters for industrial and electrical applications.',
    applications: ['Electrical Testing', 'Industrial Maintenance', 'Field Diagnostics', 'General Industry']
  },
  {
    id: 'makita-power-tools',
    brandId: 'makita',
    mcatId: 'power-tools',
    name: 'Makita Power Tools',
    tagline: 'Japanese precision engineering for professional power tools',
    description: 'Makita manufactures a full range of professional-grade power tools engineered for heavy daily use across construction, fabrication, and maintenance work.',
    applications: ['Construction Sites', 'Workshop Fabrication', 'Maintenance & Repair', 'Industrial Installation']
  },
  {
    id: 'dewalt-power-tools',
    brandId: 'dewalt',
    mcatId: 'power-tools',
    name: 'DeWalt Power Tools',
    tagline: 'American heavy-duty power tools, part of Stanley Black & Decker',
    description: 'DeWalt manufactures rugged, heavy-duty power tools engineered for demanding jobsite use across construction and industrial applications.',
    applications: ['Construction Sites', 'Industrial Maintenance', 'Fabrication', 'Jobsite Installation']
  },
  {
    id: 'hikoki-power-tools',
    brandId: 'hikoki',
    mcatId: 'power-tools',
    name: 'HiKOKI Power Tools',
    tagline: 'Formerly Hitachi Power Tools, Japanese engineering heritage',
    description: 'HiKOKI manufactures professional power tools built on the engineering heritage of the former Hitachi Power Tools brand.',
    applications: ['Construction Sites', 'Workshop Fabrication', 'Maintenance & Repair', 'Industrial Use']
  },
  {
    id: 'blackdecker-power-tools',
    brandId: 'blackdecker',
    mcatId: 'power-tools',
    name: 'Black+Decker Power Tools',
    tagline: 'Trusted power tools for professionals and enthusiasts',
    description: 'Black+Decker manufactures reliable, value-oriented power tools for construction, workshop, and light industrial applications.',
    applications: ['Construction Sites', 'Workshop Use', 'Home Improvement', 'Light Industrial Work']
  },
  {
    id: 'stanley-power-tools',
    brandId: 'stanley',
    mcatId: 'power-tools',
    name: 'Stanley Power Tools',
    tagline: 'Trusted tool brand since 1843, part of Stanley Black & Decker',
    description: 'Stanley manufactures dependable power tools engineered for everyday construction, maintenance, and workshop applications.',
    applications: ['Construction Sites', 'Maintenance & Repair', 'Workshop Fabrication', 'General Industry']
  },
  {
    id: 'hilti-power-tools',
    brandId: 'hilti',
    mcatId: 'power-tools',
    name: 'Hilti Power Tools',
    tagline: 'Premium Swiss/Liechtenstein engineering for professional construction',
    description: 'Hilti manufactures premium professional power tools engineered for heavy-duty construction and industrial installation work.',
    applications: ['Heavy Construction', 'Industrial Installation', 'Concrete & Masonry Work', 'Infrastructure Projects']
  },
  {
    id: 'metabo-power-tools',
    brandId: 'metabo',
    mcatId: 'power-tools',
    name: 'Metabo Power Tools',
    tagline: 'German engineering for professional power tools',
    description: 'Metabo manufactures professional-grade power tools engineered for metalworking, construction, and industrial fabrication applications.',
    applications: ['Metalworking', 'Construction Sites', 'Workshop Fabrication', 'Industrial Maintenance']
  },
  {
    id: 'ingco-power-tools',
    brandId: 'ingco',
    mcatId: 'power-tools',
    name: 'INGCO Power Tools',
    tagline: 'Value-focused power tools for everyday professional use',
    description: 'INGCO manufactures affordable, reliable power tools for construction, workshop, and general maintenance applications.',
    applications: ['Construction Sites', 'Workshop Use', 'General Maintenance', 'Small Business Use']
  },
  {
    id: 'taparia-power-tools',
    brandId: 'taparia',
    mcatId: 'power-tools',
    name: 'Taparia Power Tools',
    tagline: "India's trusted hand and power tool brand",
    description: 'Taparia Tools manufactures power tools alongside its well-known hand tool range, serving workshop, maintenance, and industrial applications across India.',
    applications: ['Workshop Fabrication', 'Maintenance & Repair', 'Industrial Installation', 'General Industry']
  },
  {
    id: 'bluestar-water-coolers',
    brandId: 'bluestar',
    mcatId: 'water-coolers-chillers',
    name: 'Blue Star Water Coolers & Chillers',
    tagline: "India's leading commercial cooling and refrigeration brand",
    description: 'Blue Star manufactures water coolers and commercial water chillers engineered for institutional, retail, and industrial cooling applications.',
    applications: ['Schools & Institutions', 'Offices & Retail', 'Process Cooling', 'Commercial Buildings']
  },
  {
    id: 'godrej-water-coolers',
    brandId: 'godrej',
    mcatId: 'water-coolers-chillers',
    name: 'Godrej Water Coolers & Chillers',
    tagline: 'Trusted Indian appliance brand since 1897',
    description: 'Godrej & Boyce manufactures water coolers and commercial water chillers for institutional and light industrial cooling applications.',
    applications: ['Schools & Institutions', 'Factories', 'Offices', 'Public Utilities']
  },
  {
    id: 'carriermidea-water-coolers',
    brandId: 'carriermidea',
    mcatId: 'water-coolers-chillers',
    name: 'Carrier Water Coolers & Chillers',
    tagline: 'Global HVAC engineering, Carrier-Midea India JV',
    description: 'Carrier Midea India manufactures water coolers and commercial water chillers engineered for large commercial and industrial cooling needs.',
    applications: ['Large Commercial Buildings', 'Malls & Retail', 'Process Cooling', 'Institutional Use']
  },
  {
    id: 'daikin-water-coolers',
    brandId: 'daikin',
    mcatId: 'water-coolers-chillers',
    name: 'Daikin Water Coolers & Chillers',
    tagline: 'Japanese HVAC engineering for Indian conditions',
    description: 'Daikin Airconditioning India manufactures water coolers and commercial chillers engineered for reliable performance in Indian climate conditions.',
    applications: ['Commercial Buildings', 'Data Centers', 'Institutional Use', 'Process Cooling']
  },
  {
    id: 'westernref-water-coolers',
    brandId: 'westernref',
    mcatId: 'water-coolers-chillers',
    name: 'Western Water Coolers & Chillers',
    tagline: 'Mumbai-based commercial refrigeration since 1965',
    description: 'Western Refrigeration manufactures water coolers and commercial water chillers for institutional and retail cooling applications.',
    applications: ['Schools & Institutions', 'Retail Beverage Display', 'Offices', 'Small Commercial Use']
  },
  {
    id: 'rockwellind-water-coolers',
    brandId: 'rockwellind',
    mcatId: 'water-coolers-chillers',
    name: 'Rockwell Water Coolers & Chillers',
    tagline: 'Hyderabad-based commercial cooling manufacturer',
    description: 'Rockwell Industries manufactures water coolers and commercial water chillers for institutional and industrial cooling applications.',
    applications: ['Factories', 'Institutions', 'Offices', 'Public Utilities']
  },
  {
    id: 'kelvinator-water-coolers',
    brandId: 'kelvinator',
    mcatId: 'water-coolers-chillers',
    name: 'Kelvinator Water Coolers & Chillers',
    tagline: 'Classic Indian cooling appliance brand',
    description: 'Kelvinator manufactures water coolers and commercial water chillers for institutional and light industrial cooling applications.',
    applications: ['Schools & Institutions', 'Offices', 'Small Commercial Use', 'Public Utilities']
  },
  {
    id: 'celfrost-water-coolers',
    brandId: 'celfrost',
    mcatId: 'water-coolers-chillers',
    name: 'Celfrost Water Coolers & Chillers',
    tagline: 'Kolkata-based commercial refrigeration manufacturer',
    description: 'Celfrost Industries manufactures water coolers, visi coolers, and commercial water chillers for retail and institutional cooling applications.',
    applications: ['Retail Beverage Display', 'Institutions', 'Small Commercial Use', 'Food Service']
  },
  {
    id: 'frickindia-water-coolers',
    brandId: 'frickindia',
    mcatId: 'water-coolers-chillers',
    name: 'Frick India Water Coolers & Chillers',
    tagline: 'Industrial refrigeration engineering since 1946',
    description: 'Frick India manufactures water coolers and heavy-duty commercial water chillers engineered for industrial process cooling applications.',
    applications: ['Process Cooling', 'Cold Storage', 'Industrial Plants', 'Large Commercial Buildings']
  },
  {
    id: 'cummins-diesel-generators',
    brandId: 'cummins',
    mcatId: 'diesel-generators',
    name: 'Cummins Generators',
    tagline: "World's largest independent engine manufacturer's genset range",
    description: 'Cummins manufactures CPCB IV+ compliant diesel gensets from portable units to high horsepower data-center power, backed by a global engineering and service network.',
    applications: ['Data Centers', 'Manufacturing Plants', 'Commercial Buildings', 'Construction Sites']
  },
  {
    id: 'caterpillar-diesel-generators',
    brandId: 'caterpillar',
    mcatId: 'diesel-generators',
    name: 'Caterpillar Generators',
    tagline: 'Global heavy equipment engineering for standby and prime power',
    description: 'Caterpillar manufactures standby, rental, and high horsepower diesel gensets engineered for hospitals, data centers, and heavy industrial applications.',
    applications: ['Hospitals & Healthcare', 'Data Centers', 'Heavy Industry', 'Rental Power Fleets']
  },
  {
    id: 'mahindrapowerol-diesel-generators',
    brandId: 'mahindrapowerol',
    mcatId: 'diesel-generators',
    name: 'Mahindra Powerol Generators',
    tagline: "Mahindra Group's power solutions division",
    description: 'Mahindra Powerol manufactures silent series, telecom tower, and agricultural diesel gensets engineered for reliable backup power across India.',
    applications: ['Telecom Towers', 'Agricultural Pumping', 'Commercial Backup Power', 'Rural Electrification']
  },
  {
    id: 'ashokleyland-diesel-generators',
    brandId: 'ashokleyland',
    mcatId: 'diesel-generators',
    name: 'Ashok Leyland Power Solutions',
    tagline: "Ashok Leyland's genset engineering division",
    description: 'Ashok Leyland Power Solutions manufactures silent series, marine auxiliary, and rental diesel gensets built on proven Ashok Leyland engine platforms.',
    applications: ['Commercial Backup Power', 'Marine Auxiliary Power', 'Rental Power Fleets', 'Industrial Standby']
  },
  {
    id: 'escortskubota-diesel-generators',
    brandId: 'escortskubota',
    mcatId: 'diesel-generators',
    name: 'Escorts Kubota Generators',
    tagline: 'Indo-Japanese engine engineering for gensets',
    description: 'Escorts Kubota manufactures construction site, agricultural, and silent series diesel gensets powered by Kubota engines.',
    applications: ['Construction Sites', 'Agricultural Power', 'Rural Electrification', 'Small Commercial Backup']
  },
  {
    id: 'honda-diesel-generators',
    brandId: 'honda',
    mcatId: 'diesel-generators',
    name: 'Honda Power Generators',
    tagline: 'Trusted portable and standby power from Honda',
    description: 'Honda manufactures portable petrol, inverter, and standby home backup generators along with engine-driven pump sets and welder-generator combos.',
    applications: ['Home & Small Business Backup', 'Camping & Outdoor Use', 'Field Welding', 'Dewatering & Irrigation']
  },
  {
    id: 'kohlersdmo-diesel-generators',
    brandId: 'kohlersdmo',
    mcatId: 'diesel-generators',
    name: 'Kohler-SDMO Generators',
    tagline: 'French genset engineering under the Kohler Group',
    description: 'Kohler-SDMO manufactures marine auxiliary, rental, and silent canopy diesel gensets engineered for commercial and marine power applications.',
    applications: ['Marine Auxiliary Power', 'Rental Power Fleets', 'Commercial Backup Power', 'Industrial Standby']
  },
  {
    id: 'perkins-diesel-generators',
    brandId: 'perkins',
    mcatId: 'diesel-generators',
    name: 'Perkins Generators',
    tagline: 'British engine engineering since 1932',
    description: 'Perkins manufactures high horsepower, rental, and marine auxiliary diesel gensets built on globally trusted Perkins engine platforms.',
    applications: ['Data Centers', 'Heavy Industry', 'Marine Auxiliary Power', 'Rental Power Fleets']
  },
  {
    id: 'greavescotton-diesel-generators',
    brandId: 'greavescotton',
    mcatId: 'diesel-generators',
    name: 'Greaves Cotton Generators',
    tagline: "One of India's oldest engineering companies, since 1859",
    description: 'Greaves Cotton manufactures silent series, telecom tower, and portable diesel gensets engineered for reliable backup power across India.',
    applications: ['Telecom Towers', 'Small Business Backup', 'Construction Sites', 'Rural Electrification']
  },
  {
    id: 'abb-motors',
    brandId: 'abb',
    mcatId: 'induction-motors',
    name: 'ABB Motors',
    tagline: 'Swiss-Swedish engineering for high-efficiency motors',
    description: 'ABB manufactures IE3/IE4/IE5 cast iron motors, high voltage motors, and explosion-proof motors for industrial and hazardous-area applications.',
    applications: ['Pumps & Compressors', 'Hazardous Area Installations', 'Large Industrial Fans', 'Process Industry']
  },
  {
    id: 'kirloskarelectric-motors',
    brandId: 'kirloskarelectric',
    mcatId: 'induction-motors',
    name: 'Kirloskar Electric Motors',
    tagline: 'Independent Indian electric motor engineering since 1946',
    description: 'Kirloskar Electric Company manufactures TEFC induction motors, alternators, traction motors, and flameproof motors from its Bengaluru facilities.',
    applications: ['Genset Alternators', 'Railways & Traction', 'Mining & Oil & Gas', 'General Industry']
  },
  {
    id: 'bharatbijlee-motors',
    brandId: 'bharatbijlee',
    mcatId: 'induction-motors',
    name: 'Bharat Bijlee Motors',
    tagline: 'Mumbai-based electrical engineering since 1946',
    description: 'Bharat Bijlee manufactures TEFC squirrel cage motors, AC servo motors, and slip ring motors for industrial and automation applications.',
    applications: ['CNC & Automation', 'Cranes & Crushers', 'Vertical Turbine Pump Drives', 'General Industry']
  },
  {
    id: 'weg-motors',
    brandId: 'weg',
    mcatId: 'induction-motors',
    name: 'WEG Motors',
    tagline: 'Brazilian motor engineering for global industry',
    description: 'WEG manufactures IE3/IE4 premium efficiency motors, explosion-proof motors, and brake motors for industrial applications worldwide.',
    applications: ['Conveyors & Cranes', 'Hazardous Areas', 'General Manufacturing', 'HVAC Systems']
  },
  {
    id: 'cgpower-motors',
    brandId: 'cgpower',
    mcatId: 'induction-motors',
    name: 'CG Power Motors',
    tagline: 'Indian heavy electrical engineering since 1937',
    description: 'CG Power and Industrial Solutions manufactures TEFC motors, high voltage motors, and traction alternators for industrial and rail applications.',
    applications: ['Large Compressors & Fans', 'Diesel Genset & Rail', 'Mining & Oil & Gas', 'General Industry']
  },
  {
    id: 'ge-motors',
    brandId: 'ge',
    mcatId: 'induction-motors',
    name: 'GE Motors',
    tagline: 'Global industrial motor engineering',
    description: 'GE manufactures industrial AC motors, DC motors, large AC drive motors, and marine duty motors for heavy industrial applications.',
    applications: ['Rolling Mills & Cranes', 'Large Compressors', 'Marine Applications', 'Process Industry']
  },
  {
    id: 'marathonelectric-motors',
    brandId: 'marathonelectric',
    mcatId: 'induction-motors',
    name: 'Marathon Electric Motors',
    tagline: 'Pune-based motor manufacturing, part of Regal Rexnord',
    description: 'Marathon Electric manufactures IE3 TEFC motors, blower duty, crane duty, and pump duty motors for general industrial applications.',
    applications: ['Blowers & Fans', 'Cranes & Hoists', 'Pump & Compressor Drives', 'General Industry']
  },
  {
    id: 'siemens-motors',
    brandId: 'siemens',
    mcatId: 'induction-motors',
    name: 'Siemens Motors',
    tagline: 'German motor engineering for industrial applications',
    description: 'Siemens manufactures Simotics IE3 industrial motors, high voltage motors, explosion-proof motors, and servo motors for automation applications.',
    applications: ['Large Compressors & Fans', 'Hazardous Areas', 'CNC & Robotics', 'General Industry']
  },
  {
    id: 'ltvalves-valves',
    brandId: 'ltvalves',
    mcatId: 'industrial-valves',
    name: 'L&T Valves',
    tagline: "India's leading engineered valve manufacturer",
    description: 'L&T Valves manufactures gate, ball, globe, and triple offset butterfly valves engineered for oil & gas, refinery, and power plant applications.',
    applications: ['Oil & Gas Pipelines', 'Refinery & Petrochemical', 'Power Plants', 'Process Industry']
  },
  {
    id: 'audco-valves',
    brandId: 'audco',
    mcatId: 'industrial-valves',
    name: 'Audco Valves',
    tagline: 'Trusted Indian valve brand since 1958, now part of Emerson',
    description: 'Audco manufactures butterfly, plug, ball, and triple offset valves for oil & gas, refinery, and process industry applications from its Ranipet facility.',
    applications: ['Oil & Gas', 'Refinery', 'Chemical Process', 'Water & Wastewater']
  },
  {
    id: 'velan-valves',
    brandId: 'velan',
    mcatId: 'industrial-valves',
    name: 'Velan Valves',
    tagline: 'Cast and forged steel valves for critical service',
    description: 'Velan manufactures cast steel gate, globe, check, and forged steel ball valves engineered for power plants and high-pressure process applications.',
    applications: ['Power Plants', 'High Pressure Process Piping', 'Instrumentation Lines', 'Petrochemical']
  },
  {
    id: 'kitz-valves',
    brandId: 'kitz',
    mcatId: 'industrial-valves',
    name: 'KITZ Valves',
    tagline: 'Japanese valve engineering for water and HVAC systems',
    description: 'KITZ manufactures ball, butterfly, bronze gate, and check valves for water systems, HVAC, marine, and instrumentation applications.',
    applications: ['Water & HVAC Systems', 'Marine Applications', 'Instrumentation', 'Commercial Buildings']
  },
  {
    id: 'zoloto-valves',
    brandId: 'zoloto',
    mcatId: 'industrial-valves',
    name: 'Zoloto Valves',
    tagline: 'Trusted Indian valve brand for plumbing and industrial use',
    description: 'Zoloto Industries manufactures gate, ball, and butterfly valves along with strainers for plumbing, domestic, and light industrial applications.',
    applications: ['Plumbing & Domestic Use', 'Water Distribution', 'Light Industrial', 'HVAC Systems']
  },
  {
    id: 'bdk-valves',
    brandId: 'bdk',
    mcatId: 'industrial-valves',
    name: 'BDK Valves',
    tagline: 'Cast and forged steel process valves since 1963',
    description: 'BDK Engineering Industries manufactures cast steel globe, gate, check, and forged steel ball valves for process industry and high-pressure utility applications.',
    applications: ['Process Industry', 'High Pressure Piping', 'Utility Lines', 'Chemical Plants']
  },
  {
    id: 'leadervalves-valves',
    brandId: 'leadervalves',
    mcatId: 'industrial-valves',
    name: 'Leader Valves',
    tagline: 'Water infrastructure valves from Jalandhar since 1975',
    description: 'Leader Valves manufactures sluice gate, butterfly, air release, and non-return valves engineered for water treatment and pipeline infrastructure.',
    applications: ['Water Treatment Plants', 'Pipeline Infrastructure', 'Irrigation Networks', 'Municipal Water Supply']
  },
  {
    id: 'advancevalves-valves',
    brandId: 'advancevalves',
    mcatId: 'industrial-valves',
    name: 'Advance Valves',
    tagline: 'Forged steel valves for high pressure applications',
    description: 'Advance Valves manufactures forged steel gate, globe, check, and investment cast ball valves for steam, high pressure, and instrumentation applications.',
    applications: ['Steam & High Pressure Lines', 'Instrumentation & Sampling', 'Utility Lines', 'Process Industry']
  },
  {
    id: 'grundfos-pumps',
    brandId: 'grundfos',
    mcatId: 'industrial-pumps',
    name: 'Grundfos Pumps',
    tagline: "World's largest pump manufacturer's India range",
    description: 'Grundfos manufactures vertical multistage, submersible borewell, and booster pump systems engineered for building services, water utility, and industrial applications.',
    applications: ['Building Water Supply', 'Water Utility & Municipal Supply', 'Industrial Process', 'Agricultural Irrigation']
  },
  {
    id: 'flowserve-pumps',
    brandId: 'flowserve',
    mcatId: 'industrial-pumps',
    name: 'Flowserve Pumps',
    tagline: 'Engineered process pumps for critical industries',
    description: 'Flowserve manufactures Durco and Worthington process pumps engineered for petrochemical, refining, power, and heavy industrial applications.',
    applications: ['Petrochemical & Refining', 'Power Generation', 'Chemical Process', 'Heavy Industrial Utility']
  },
  {
    id: 'sulzer-pumps',
    brandId: 'sulzer',
    mcatId: 'industrial-pumps',
    name: 'Sulzer Pumps',
    tagline: 'Swiss-engineered pumps for water and process industries',
    description: 'Sulzer manufactures Ahlstar process pumps, APP submersible pumps, and vertical turbine pumps for municipal water, wastewater, and process industry applications.',
    applications: ['Municipal Water & Wastewater', 'Process Industries', 'Flood Control', 'Pulp & Paper']
  },
  {
    id: 'wilo-pumps',
    brandId: 'wilo',
    mcatId: 'industrial-pumps',
    name: 'WILO Pumps',
    tagline: 'German pump technology for buildings and utilities',
    description: 'WILO manufactures circulator pumps, EMU submersible pumps, and booster systems for building services and municipal wastewater applications.',
    applications: ['Building HVAC Circulation', 'Municipal Sewage', 'Water Supply Boosting', 'Drainage']
  },
  {
    id: 'cripumps-pumps',
    brandId: 'cripumps',
    mcatId: 'industrial-pumps',
    name: 'CRI Pumps',
    tagline: "India's leading submersible and solar pump manufacturer",
    description: 'CRI Pumps manufactures submersible, openwell, agricultural, and solar-powered pump sets from its Coimbatore manufacturing plants.',
    applications: ['Agricultural Irrigation', 'Domestic Water Supply', 'Solar Water Pumping', 'Rural Water Systems']
  },
  {
    id: 'texmo-pumps',
    brandId: 'texmo',
    mcatId: 'industrial-pumps',
    name: 'Texmo Pumps',
    tagline: 'Coimbatore pump manufacturing since 1963',
    description: 'Texmo Industries manufactures submersible, monoblock, and agricultural pump sets serving domestic and export markets.',
    applications: ['Agricultural Irrigation', 'Domestic Water Supply', 'Fire Fighting', 'Small Industrial Use']
  },
  {
    id: 'wpil-pumps',
    brandId: 'wpil',
    mcatId: 'industrial-pumps',
    name: 'WPIL Pumps',
    tagline: 'Heavy engineering pumps since 1952',
    description: 'WPIL manufactures vertical turbine, axial/mixed flow, and fire fighting pump packages for large irrigation, flood control, and municipal water projects.',
    applications: ['Irrigation & Flood Control', 'Municipal Water Supply', 'Fire Fighting Systems', 'Industrial Sewage']
  },
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
  },
  {
    id: 'ingersollrand-compressors',
    brandId: 'ingersollrand',
    mcatId: 'air-compressors',
    name: 'Ingersoll Rand Air Compressors & Air Treatment',
    tagline: 'Mission-critical compressed air for process industries',
    description: 'Ingersoll Rand manufactures fixed-speed and VSD rotary screw compressors, oil-free Nirvana compressors, and centrifugal compressors engineered for pharmaceutical, food & beverage, and heavy manufacturing applications.',
    applications: ['Pharmaceutical Manufacturing', 'Food & Beverage Processing', 'Heavy Manufacturing', 'Process Vacuum Systems']
  },
  {
    id: 'elgi-compressors',
    brandId: 'elgi',
    mcatId: 'air-compressors',
    name: 'ELGi Air Compressors & Air Treatment',
    tagline: "India's most exported air compressor brand",
    description: 'ELGi manufactures reciprocating, rotary screw, and oil-free air compressors across a full power range, backed by a nationwide service network and exports to over 100 countries.',
    applications: ['Automotive Manufacturing', 'General Engineering', 'Textile Mills', 'Infrastructure Projects']
  },
  {
    id: 'kaeser-compressors',
    brandId: 'kaeser',
    mcatId: 'air-compressors',
    name: 'Kaeser Air Compressors & Blowers',
    tagline: 'German engineering, built for lowest total cost of ownership',
    description: 'Kaeser manufactures rotary screw compressors, rotary lobe blowers, and air treatment equipment engineered for maximum energy efficiency and round-the-clock reliability.',
    applications: ['Process Industries', 'Water & Wastewater Treatment', 'Pneumatic Conveying', 'General Manufacturing']
  },
  {
    id: 'kirloskarpneumatic-compressors',
    brandId: 'kirloskarpneumatic',
    mcatId: 'air-compressors',
    name: 'Kirloskar Pneumatic Air & Gas Compressors',
    tagline: 'Independent Indian compressor engineering since 1958',
    description: 'Kirloskar Pneumatic Company manufactures reciprocating and rotary screw air compressors, gas compressors, and railway air brake compressors from its Pune facilities.',
    applications: ['Refrigeration & Cold Chain', 'Railways & Defence', 'CNG Stations', 'General Industry']
  },
  {
    id: 'doosan-compressors',
    brandId: 'doosan',
    mcatId: 'air-compressors',
    name: 'Doosan Portable Air Compressors',
    tagline: 'Diesel-driven compressed air for the field',
    description: 'Doosan Portable Power manufactures towable and skid-mounted diesel-driven air compressors built for construction sites, mining, and remote field service work.',
    applications: ['Construction Sites', 'Mining Operations', 'Well Drilling', 'Remote Field Service']
  },
  {
    id: 'boge-compressors',
    brandId: 'boge',
    mcatId: 'air-compressors',
    name: 'Boge Air Compressors',
    tagline: 'Compact German-engineered compressed air systems',
    description: 'Boge manufactures oil-lubricated and oil-free rotary screw and scroll compressors known for compact footprints and low total cost of ownership.',
    applications: ['Laboratories & Electronics', 'General Manufacturing', 'Food & Beverage', 'Automotive Workshops']
  },
  {
    id: 'sullair-compressors',
    brandId: 'sullair',
    mcatId: 'air-compressors',
    name: 'Sullair Air Compressors',
    tagline: 'Rugged compressed air for continuous industrial duty',
    description: 'Sullair manufactures fixed and portable rotary screw air compressors known for rugged construction and long service intervals, serving heavy manufacturing and mining.',
    applications: ['Heavy Manufacturing', 'Mining', 'Infrastructure', 'Construction']
  },
  {
    id: 'chicagopneumatic-compressors',
    brandId: 'chicagopneumatic',
    mcatId: 'air-compressors',
    name: 'Chicago Pneumatic Air Compressors & Tools',
    tagline: 'Value-engineered compressed air, over a century of heritage',
    description: 'Chicago Pneumatic distributes rotary screw and piston air compressors alongside pneumatic tools, positioned for small and mid-sized workshops seeking a lower entry price.',
    applications: ['Small Workshops', 'Auto Repair Garages', 'Light Manufacturing', 'Fabrication Shops']
  },
  {
    id: 'mattei-compressors',
    brandId: 'mattei',
    mcatId: 'air-compressors',
    name: 'Mattei Rotary Vane Air Compressors',
    tagline: 'Italian vane technology, decades of service life',
    description: 'Mattei manufactures rotary vane air compressors — a technology distinct from rotary screw — prized for long service intervals and stable output across duty cycles.',
    applications: ['Food & Beverage', 'Pharmaceutical Manufacturing', 'Continuous-Duty Process Lines', 'General Industry']
  }
];
