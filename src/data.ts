import { Brand, Product, Supplier, Review } from './types';

export const CATEGORIES = [
  { id: 'machinery', name: 'Industrial Machinery', icon: 'Settings' },
  { id: 'electrical', name: 'Electrical & Electronics', icon: 'Cpu' },
  { id: 'construction', name: 'Building & Construction', icon: 'Home' },
  { id: 'automation', name: 'Automation & Controls', icon: 'Network' },
  { id: 'pipes', name: 'Pipes, Tubes & Fittings', icon: 'Pipette' },
  { id: 'tools', name: 'Tools & Hardware', icon: 'Wrench' },
  { id: 'chemicals', name: 'Chemicals & Allied', icon: 'FlaskConical' },
  { id: 'solar', name: 'Solar & Renewable Energy', icon: 'Sun' }
];

export const BRANDS: Brand[] = [
  {
    id: 'kirloskar',
    name: 'Kirloskar Brothers Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kirloskar_Brothers_Limited_Logo.JPG',
    description: 'Built on values. Driven by innovation. Trusted for generations.',
    longDescription: 'Kirloskar Brothers Limited (KBL) is a world-class pump manufacturing company with a rich heritage of over 130 years. KBL designs and manufactures a comprehensive range of solutions for water management, agricultural irrigation, industrial application, power generation, and building services.',
    category: 'machinery',
    subCategories: ['Industrial Pumps', 'Valves', 'Engines', 'Compressors'],
    rating: 4.6,
    reviewsCount: 1248,
    buyersConnected: 30000,
    establishedYear: 1888,
    businessType: 'Public Limited Company',
    gstNumber: '27AAACK1635P1Z1',
    panNumber: 'AAACK1635P',
    cinNumber: 'L29120PN1920PLC008972',
    website: 'www.kirloskarbros.com',
    headquarters: 'Pune, Maharashtra, India',
    employees: '15,000+',
    annualTurnover: '₹8,500 Cr+',
    verified: true,
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'CE Certified', 'NSIC Registered'],
    manufacturingUnits: 5,
    countriesServed: 60,
    topProducts: ['Centrifugal Pumps', 'Submersible Pumps', 'Gate Valves', 'Monoblock Pumps'],
    features: ['130+ years of engineering legacy', 'State-of-the-art manufacturing', 'Strong R&D and innovation focus', 'Sustainability & responsible business']
  },
  {
    id: 'ksb',
    name: 'KSB Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/KSB_logo_2020.svg',
    description: 'Technology that makes its mark. German engineered, manufactured in India.',
    longDescription: 'KSB Limited, founded in 1960, is a leading manufacturer of pumps and industrial valves. Backed by German technology and deep local market expertise, KSB India provides highly reliable, efficient, and custom fluid handling systems for energy, water, wastewater, industry, and building services.',
    category: 'machinery',
    subCategories: ['Industrial Pumps', 'Valves', 'Waste Water Systems'],
    rating: 4.3,
    reviewsCount: 1240,
    buyersConnected: 18540,
    establishedYear: 1960,
    businessType: 'Public Limited Company',
    gstNumber: '27AAACK4589H2Z4',
    panNumber: 'AAACK4589H',
    cinNumber: 'L29122PN1960PLC011035',
    website: 'www.ksbindia.co.in',
    headquarters: 'Pimpri, Pune, India',
    employees: '5,000+',
    annualTurnover: '₹3,200 Cr+',
    verified: true,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'CE Certified', 'BEE Star Rating'],
    manufacturingUnits: 5,
    countriesServed: 120,
    topProducts: ['Centrifugal Pumps', 'Submersible Pumps', 'High Pressure Pumps', 'Butterfly Valves'],
    features: ['German technology standards', 'Exceptional energy efficiency', 'Excellent after-sales support', '60+ years in India']
  },
  {
    id: 'crompton',
    name: 'Crompton Greaves Consumer Electricals',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Crompton_Greaves_Logo.svg',
    description: 'Let\'s Hangout. Making life comfortable and convenient.',
    longDescription: 'Crompton is one of India\'s leading consumer electrical and industrial companies. With a brand legacy of over 80 years, Crompton manufactures high-efficiency industrial motors, agricultural water pumps, domestic pumps, fan solutions, and energy-saving lighting systems.',
    category: 'electrical',
    subCategories: ['Motors', 'Pumps', 'Lighting', 'Switchgear'],
    rating: 4.4,
    reviewsCount: 980,
    buyersConnected: 15400,
    establishedYear: 1937,
    businessType: 'Public Limited Company',
    website: 'www.crompton.co.in',
    headquarters: 'Mumbai, Maharashtra',
    employees: '3,500+',
    annualTurnover: '₹5,300 Cr+',
    verified: true,
    certifications: ['ISO 9001', 'ISO 14001', 'BEE 5-Star Rating', 'ISI Mark'],
    manufacturingUnits: 3,
    countriesServed: 15,
    topProducts: ['Induction Motors', 'Monoblock Pumps', 'LED Industrial Lights', 'Domestic Pumps']
  },
  {
    id: 'bosch',
    name: 'Bosch Limited India',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bosch-logo.svg',
    description: 'Invented for life. Powering industrial progress.',
    longDescription: 'Bosch is a leading global supplier of technology and services. In India, Bosch manufactures high-performance power tools, automotive components, packaging machines, industrial heating, and smart automation systems designed for maximum precision and durability.',
    category: 'tools',
    subCategories: ['Power Tools', 'Automotive Systems', 'Industrial Heat'],
    rating: 4.6,
    reviewsCount: 1900,
    buyersConnected: 25000,
    establishedYear: 1922,
    businessType: 'Public Limited',
    website: 'www.bosch.in',
    headquarters: 'Bengaluru, Karnataka',
    employees: '31,000+',
    annualTurnover: '₹12,000 Cr+',
    verified: true,
    certifications: ['ISO 9001', 'IATF 16949', 'ISO 14001', 'CE Certified'],
    manufacturingUnits: 7,
    countriesServed: 150,
    topProducts: ['Heavy Duty Drills', 'Angle Grinders', 'Fuel Injection Systems', 'Industrial Heaters']
  },
  {
    id: 'siemens',
    name: 'Siemens India Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Siemens-logo.svg',
    description: 'Ingenuity for life. Driving digital enterprise.',
    longDescription: 'Siemens India is a technology powerhouse that stands for engineering excellence, innovation, quality, and reliability. The company focuses on intelligent infrastructure for buildings, decentralized energy systems, automation, and digitalization in process and manufacturing industries.',
    category: 'automation',
    subCategories: ['Automation Systems', 'Switchgear', 'Industrial Motors'],
    rating: 4.6,
    reviewsCount: 1200,
    buyersConnected: 22000,
    establishedYear: 1922,
    businessType: 'Public Limited',
    website: 'www.siemens.co.in',
    headquarters: 'Mumbai, Maharashtra',
    employees: '10,000+',
    annualTurnover: '₹14,000 Cr+',
    verified: false,
    certifications: ['ISO 9001', 'ISO 14001', 'CE', 'UL Listed'],
    manufacturingUnits: 8,
    countriesServed: 80,
    topProducts: ['PLC Systems', 'AC Drives & VFDs', 'Induction Motors', 'Medium Voltage Switchgear']
  },
  {
    id: 'havells',
    name: 'Havells India Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Havells_Logo.svg',
    description: 'Wires that don\'t catch fire. Premium electrical solutions.',
    longDescription: 'Havells India Limited is a leading Fast Moving Electrical Goods (FMEG) Company and a major power distribution equipment manufacturer. Its product portfolio includes industrial cables, heavy-duty switchgears, professional lighting, industrial motors, and solar systems.',
    category: 'electrical',
    subCategories: ['Cables & Wires', 'Switchgear', 'Motors', 'Solar Power'],
    rating: 4.5,
    reviewsCount: 1600,
    buyersConnected: 20000,
    establishedYear: 1983,
    businessType: 'Public Limited',
    website: 'www.havells.com',
    headquarters: 'Noida, Uttar Pradesh',
    employees: '6,500+',
    annualTurnover: '₹16,000 Cr+',
    verified: true,
    certifications: ['ISO 9001', 'ISO 14001', 'BASEC Certified', 'CE Certified'],
    manufacturingUnits: 14,
    countriesServed: 50,
    topProducts: ['Industrial Cables', 'Air Circuit Breakers', 'Three Phase Motors', 'Solar Inverters']
  },
  {
    id: 'voltas',
    name: 'Voltas Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Voltas_logo.svg',
    description: 'Trusted cooling and refrigeration. A TATA Enterprise.',
    longDescription: 'Voltas Limited is India\'s premier air conditioning, commercial refrigeration, and engineering solutions provider. Backed by the Tata Group legacy of trust, Voltas manufactures top-tier industrial water coolers, heavy-duty commercial chillers, and advanced cold room storage systems built for standard Indian conditions.',
    category: 'machinery',
    subCategories: ['Water Coolers', 'Commercial Chillers', 'Air Conditioners'],
    rating: 4.7,
    reviewsCount: 1540,
    buyersConnected: 34200,
    establishedYear: 1954,
    businessType: 'Public Limited',
    website: 'www.voltas.com',
    headquarters: 'Mumbai, Maharashtra',
    employees: '10,000+',
    annualTurnover: '₹9,400 Cr+',
    verified: true,
    certifications: ['ISO 9001', 'ISO 14001', 'Tata Code of Conduct', 'BEE Energy Star'],
    manufacturingUnits: 4,
    countriesServed: 30,
    topProducts: ['Water Coolers', 'Cassette ACs', 'Ductable ACs', 'Deep Freezers']
  },
  {
    id: 'atlascopco',
    name: 'Atlas Copco India',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Atlas-Copco-Logo.svg',
    description: 'Home of industrial ideas. Leading air compressor solutions.',
    longDescription: 'Atlas Copco is a world-leading provider of sustainable productivity solutions. In India, Atlas Copco provides state-of-the-art oil-injected and oil-free rotary screw air compressors, vacuum solutions, air treatment systems, and power tools for a wide range of industrial applications.',
    category: 'machinery',
    subCategories: ['Air Compressors', 'Vacuum Pumps', 'Generators'],
    rating: 4.6,
    reviewsCount: 890,
    buyersConnected: 12100,
    establishedYear: 1960,
    businessType: 'Private Limited',
    website: 'www.atlascopco.com/en-in',
    headquarters: 'Bengaluru, Karnataka',
    employees: '2,500+',
    annualTurnover: '₹4,100 Cr+',
    verified: true,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'CE Certified'],
    manufacturingUnits: 3,
    countriesServed: 180,
    topProducts: ['Rotary Screw Compressors', 'Piston Compressors', 'Air Dryers', 'Industrial Tools']
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'kbl-centrifugal',
    name: 'Centrifugal Pump - Horizontal End Suction (1 HP - 100 HP)',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    category: 'machinery',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    priceRange: '₹18,500 - ₹1,25,000',
    moq: '1 Piece',
    deliveryTime: '2 - 7 Days',
    warranty: '12 Months',
    description: 'High efficiency centrifugal pump designed for long-life, minimal maintenance and optimum performance. Ideal for industrial water supply, HVAC, agricultural irrigation, and process fluid handling applications.',
    features: [
      'High efficiency hydraulics',
      'Corrosion resistant material options',
      'Back pull-out design for easy maintenance',
      'Low vibration & noise level'
    ],
    specifications: {
      'Power Range': '1 HP - 100 HP',
      'Flow Rate': 'Up to 500 m³/hr',
      'Head Range': 'Up to 160 meters',
      'Material': 'Cast Iron (CI) / Stainless Steel (SS) / Bronze',
      'Impeller Type': 'Closed / Semi-Open',
      'Mounting': 'Horizontal Base Mounted',
      'Application': 'Water Supply, Chemical, HVAC, General Industry'
    }
  },
  {
    id: 'ksb-submersible',
    name: 'KSB Submersible Borehole Pump (CORA Series)',
    brandId: 'ksb',
    brandName: 'KSB Limited',
    category: 'machinery',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600',
    priceRange: '₹22,000 - ₹1,80,000',
    moq: '1 Piece',
    deliveryTime: '3 - 5 Days',
    warranty: '24 Months',
    description: 'Multi-stage centrifugal pumps in radial or mixed flow design. Suitable for deep well water pumping, spray irrigation, water supply systems, and pressure boosting.',
    features: [
      'High-grade stainless steel construction',
      'Built-in non-return valve protects against water hammer',
      'Optimal motor cooling by pumped medium',
      'Sand-resistant design up to 50 g/m³'
    ],
    specifications: {
      'Power Range': '2 HP - 45 HP',
      'Flow Rate': 'Up to 150 m³/hr',
      'Head Range': 'Up to 320 meters',
      'Material': 'Stainless Steel AISI 304/316',
      'Discharge Size': '50 mm - 150 mm',
      'Well Diameter': '6 inches / 8 inches / 10 inches'
    }
  },
  {
    id: 'crompton-induction-motor',
    name: 'Crompton TEFC Three Phase Squirrel Cage Induction Motor',
    brandId: 'crompton',
    brandName: 'Crompton Greaves Consumer Electricals',
    category: 'electrical',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
    priceRange: '₹12,000 - ₹3,50,000',
    moq: '1 Piece',
    deliveryTime: '5 - 10 Days',
    warranty: '18 Months',
    description: 'High efficiency industrial AC motor designed for demanding environments. Features robust cast-iron frames, dual-shielded bearings, and IE2/IE3 energy efficiency compliance.',
    features: [
      'IE2 / IE3 high efficiency certified',
      'IP55 ingress protection standard',
      'Class F insulation with Class B temperature rise',
      'Dynamically balanced rotor for vibration-free running'
    ],
    specifications: {
      'Power Rating': '0.5 HP - 350 HP',
      'Voltage': '415V ± 10%, 3 Phase',
      'Frequency': '50Hz ± 5%',
      'Speed (RPM)': '750 / 1000 / 1500 / 3000 RPM',
      'Frame Size': '80M to 355L',
      'Mounting': 'Foot / Flange / Face Mounting'
    }
  },
  {
    id: 'siemens-plc-s71200',
    name: 'Siemens SIMATIC S7-1200 Micro PLC System',
    brandId: 'siemens',
    brandName: 'Siemens India Limited',
    category: 'automation',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    priceRange: '₹15,000 - ₹95,000',
    moq: '1 Set',
    deliveryTime: '2 - 4 Days',
    warranty: '12 Months',
    description: 'The compact controller for modular, space-saving automation solutions. Highly scalable, with integrated PROFINET interface, security-integrated, and powerful technology functions.',
    features: [
      'Integrated PROFINET interface for networking',
      'Scalable expanding modules',
      'Highly secure web server visualization',
      'Integrated PID controller and motion control'
    ],
    specifications: {
      'Digital Inputs': '8 to 14 Onboard',
      'Digital Outputs': '6 to 10 Relay/Transistor',
      'Analog Inputs': '2 Onboard (0-10V)',
      'Communication': 'PROFINET, Modbus TCP, RS485/RS232',
      'Programming Software': 'TIA Portal V16 or higher',
      'Memory': '75 KB to 125 KB Working Memory'
    }
  },
  {
    id: 'voltas-water-cooler',
    name: 'Voltas Water Cooler 40/80 PSS & FSS, 80 Ltrs Storage, 2 Fucets',
    brandId: 'voltas',
    brandName: 'Voltas Limited',
    category: 'machinery',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
    priceRange: '₹37,000 onwards',
    moq: '1 Piece',
    deliveryTime: '2 - 5 Days',
    warranty: '12 Months',
    description: 'Voltas stainless steel water cooler with double faucets. Provides high cooling capacity and rapid recovery for schools, offices, factories, and public utilities.',
    features: [
      'SS 304 food grade stainless steel storage tank',
      'High-efficiency compressor for rapid cooling',
      'Eco-friendly non-CFC refrigerant',
      'Two heavy-duty brass chrome plated faucets'
    ],
    specifications: {
      'Storage Capacity': '80 Liters',
      'Cooling Capacity': '40 Liters / Hour',
      'Body Material': 'SS / GI Body (Stainless Steel)',
      'No. of Faucets': '2 Taps',
      'Refrigerant': 'R-134a',
      'Power Consumption': '650 Watts'
    }
  },
  {
    id: 'atlas-copco-compressor',
    name: 'Atlas Copco Air Compressors GA 30 VSD 30 kW 4 bar(e) Pack Oil-injected Rotary Screw Compressor',
    brandId: 'atlascopco',
    brandName: 'Atlas Copco India',
    category: 'machinery',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    priceRange: '₹4,80,000 onwards',
    moq: '1 Piece',
    deliveryTime: '5 - 12 Days',
    warranty: '24 Months',
    description: 'Highly energy-efficient Variable Speed Drive (VSD) rotary screw air compressor. Adjusts motor speed automatically to match air demand, saving up to 35% on energy costs.',
    features: [
      'Variable Speed Drive (VSD) technology built-in',
      'Smart Elektronikon® Graphic controller',
      'Low maintenance and extended service intervals',
      'Heavy duty oil-injected screw element'
    ],
    specifications: {
      'Motor Power': '30 kW (40 HP)',
      'Working Pressure': '4 bar(e) to 13 bar(e)',
      'Capacity FAD': '24.3 l/s - 95.4 l/s',
      'Noise Level': '66 dB(A)',
      'Drive Type': 'VSD (Variable Speed Drive)',
      'Lubrication Style': 'Oil-injected'
    }
  },
  {
    id: 'sokkia-total-station',
    name: 'Sokkia Total Station CX-105 5" Angle Accuracy IP66 Bluetooth',
    brandId: 'bosch',
    brandName: 'Bosch Limited India',
    category: 'tools',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    priceRange: '₹3,20,000 onwards',
    moq: '1 Set',
    deliveryTime: '3 - 6 Days',
    warranty: '12 Months',
    description: 'High-precision civil engineering surveying instrument with 5" angle accuracy. Features class-leading EDM, IP66 dust/water protection, and long-range Bluetooth wireless communications.',
    features: [
      'Pinpoint reflectorless EDM up to 500m',
      'Long-range Bluetooth Class 1 communication',
      'IP66 rugged dust/waterproof casing',
      'Exclusive TSshield advanced security and maintenance'
    ],
    specifications: {
      'Angle Accuracy': '5" (5 arc-seconds)',
      'Reflectorless Range': '0.3m to 500m',
      'Prism Range': '1.3m to 4,000m',
      'Battery Life': 'Up to 36 Hours',
      'Display': 'Dual Graphic LCD screens',
      'Connectivity': 'Bluetooth, USB, RS232C'
    }
  }
];

export const SUPPLIERS: Supplier[] = [
  {
    id: 'kirloskar-supp-1',
    name: 'Kirloskar Pneumatic Co. Ltd. (Corporate Dealer)',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    location: 'Pune, Maharashtra',
    rating: 4.6,
    reviewsCount: 164,
    experienceYears: 54,
    verified: true,
    responseTime: '1.6 hrs',
    deliveryTimeRange: '2-4 Days',
    priceEstimate: '₹18,500 - ₹98,000'
  },
  {
    id: 'kirloskar-supp-2',
    name: 'Kirloskar Ferrous Industries Ltd. (Authorized Distributor)',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    location: 'Belgaum, Karnataka',
    rating: 4.5,
    reviewsCount: 287,
    experienceYears: 32,
    verified: true,
    responseTime: '2.1 hrs',
    deliveryTimeRange: '3-5 Days',
    priceEstimate: '₹19,200 - ₹1,02,500'
  },
  {
    id: 'ksb-supp-1',
    name: 'KSB Pumps Pvt. Ltd. (Premium Distributor)',
    brandId: 'ksb',
    brandName: 'KSB Limited',
    location: 'Pune, Maharashtra',
    rating: 4.6,
    reviewsCount: 310,
    experienceYears: 50,
    verified: true,
    responseTime: '2.4 hrs',
    deliveryTimeRange: '2-4 Days',
    priceEstimate: '₹22,000 - ₹1,80,000'
  },
  {
    id: 'sulzer-supp-1',
    name: 'Sulzer Pumps India Pvt. Ltd. (Official Channel)',
    brandId: 'ksb', // Tagged to KSB category for search/compare matches
    brandName: 'KSB Limited',
    location: 'Chennai, Tamil Nadu',
    rating: 4.4,
    reviewsCount: 62,
    experienceYears: 18,
    verified: true,
    responseTime: '4.4 hrs',
    deliveryTimeRange: '3-6 Days',
    priceEstimate: '₹20,500 - ₹1,10,000'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Rakesh Mehta',
    userRole: 'Operations Manager',
    companyName: 'Mehta Industries, Pune',
    rating: 5.0,
    comment: 'Excellent quality centrifugal pumps and on-time delivery. Their engineering team is extremely helpful in suggesting configurations. The after sales service is highly reliable.',
    date: '2026-06-25'
  },
  {
    id: 'rev-2',
    userName: 'Amit Sharma',
    userRole: 'Purchase Head',
    companyName: 'Sharma Traders, Delhi',
    rating: 4.0,
    comment: 'Good product range and strong technical expertise. Very satisfied with the overall purchase experience. Highly recommended for heavy duty industrial needs.',
    date: '2026-06-18'
  }
];

export const MARKETPLACE_METRICS = {
  activeBuyers: '10.5M+',
  buyLeadsThisMonth: '3.2M+',
  productViews: '45.6M+',
  verifiedSuppliers: '1.6M+',
  standardProducts: '8.9M+',
  avgResponseTime: '2.4 hrs',
  overallConversionRate: '1.04%',
  highIntentLeadRate: '24.3%'
};

export const TRENDING_CATEGORIES = [
  { name: 'Solar Products', growth: '+42%', trend: 'up' },
  { name: 'Water Pumps', growth: '+36%', trend: 'up' },
  { name: 'Packaging Machines', growth: '+31%', trend: 'up' },
  { name: 'Electric Motors', growth: '+27%', trend: 'up' },
  { name: 'Stainless Steel Pipes', growth: '+25%', trend: 'up' }
];

export const MOST_INQUIRED_PRODUCTS = [
  { name: 'Centrifugal Pump', count: '12,450 Inquiries', growth: '28%' },
  { name: 'Solar Water Pump', count: '9,870 Inquiries', growth: '24%' },
  { name: 'Electric Motor', count: '8,230 Inquiries', growth: '21%' },
  { name: 'Packaging Machine', count: '7,680 Inquiries', growth: '19%' },
  { name: 'Stainless Steel Pipe', count: '6,590 Inquiries', growth: '17%' }
];

export const FASTEST_GROWING_BRANDS = [
  { name: 'Kirloskar', growth: '48%' },
  { name: 'Crompton', growth: '41%' },
  { name: 'Grundfos', growth: '35%' },
  { name: 'Sulzer', growth: '32%' },
  { name: 'Texmo', growth: '30%' }
];

export const REGIONAL_DEMAND = [
  { region: 'Maharashtra', share: '26%' },
  { region: 'Gujarat', share: '16%' },
  { region: 'Tamil Nadu', share: '13%' },
  { region: 'Uttar Pradesh', share: '9%' },
  { region: 'Delhi', share: '7%' },
  { region: 'Others', share: '29%' }
];

export const BUYER_INTENT_SIGNALS = [
  { signal: 'Product Comparisons', volume: '1.8M+', growth: '+23%' },
  { signal: 'Supplier Shortlists', volume: '980K+', growth: '+19%' },
  { signal: 'RFQ Sent', volume: '620K+', growth: '+17%' },
  { signal: 'Repeat Buyers', volume: '520K+', growth: '+21%' }
];
