import 'server-only';
import { Brand, Product, Supplier, Review, BuyLead, AlternativeProduct, PMcat, MCat, BrandMCat, ServiceCenter } from '../types';
import { GENERATED_PRODUCTS, GENERATED_SUPPLIERS, GENERATED_ALTERNATIVES, GENERATED_BRAND_MCATS } from './generatedCatalog';

// PMcat = "Parent category" per IndiaMART taxonomy convention (narrower than the old
// catch-all Industry buckets — each PMcat groups only closely related MCats).
export const PMCATS: PMcat[] = [
  { id: 'power-generation-equipment', name: 'Power Generation Equipment', icon: 'Zap' },
  { id: 'pumps-fluid-handling', name: 'Pumps & Fluid Handling', icon: 'Droplet' },
  { id: 'air-gas-equipment', name: 'Air & Gas Equipment', icon: 'Wind' },
  { id: 'cooling-refrigeration', name: 'Cooling & Refrigeration', icon: 'Snowflake' },
  { id: 'electric-motors', name: 'Electric Motors', icon: 'Cpu' },
  { id: 'power-tools-measuring', name: 'Power Tools & Measuring Instruments', icon: 'Wrench' },
  { id: 'automation-control', name: 'Automation & Control', icon: 'Network' },
  { id: 'cables-switchgear', name: 'Electrical Cables & Switchgear', icon: 'Cable' },
  { id: 'solar-renewable', name: 'Solar & Renewable Energy', icon: 'Sun' },
  { id: 'infrastructure', name: 'Building, Construction & Fluid Systems', icon: 'Home' },
  { id: 'process-chemical', name: 'Process & Chemical Industries', icon: 'FlaskConical' }
];

// MCat = "Micro category" per IndiaMART taxonomy convention.
export const MCATS: MCat[] = [
  { id: 'diesel-generators', name: 'Diesel Generators', icon: 'Zap', pmcatId: 'power-generation-equipment' },
  { id: 'industrial-pumps', name: 'Industrial Pumps', icon: 'Droplet', pmcatId: 'pumps-fluid-handling' },
  { id: 'industrial-valves', name: 'Industrial Valves', icon: 'Settings', pmcatId: 'pumps-fluid-handling' },
  { id: 'air-compressors', name: 'Air Compressors', icon: 'Wind', pmcatId: 'air-gas-equipment' },
  { id: 'water-coolers-chillers', name: 'Water Coolers & Chillers', icon: 'Snowflake', pmcatId: 'cooling-refrigeration' },
  { id: 'induction-motors', name: 'Induction Motors', icon: 'Cpu', pmcatId: 'electric-motors' },
  { id: 'power-tools', name: 'Power Tools', icon: 'Wrench', pmcatId: 'power-tools-measuring' },
  { id: 'measuring-instruments', name: 'Measuring Instruments', icon: 'Settings', pmcatId: 'power-tools-measuring' },
  { id: 'plc-drives', name: 'PLC & Automation Drives', icon: 'Network', pmcatId: 'automation-control' },
  { id: 'power-cables', name: 'Power Cables', icon: 'Cable', pmcatId: 'cables-switchgear' },
  { id: 'switchgear', name: 'Switchgear', icon: 'Zap', pmcatId: 'cables-switchgear' },
  { id: 'solar-equipment', name: 'Solar Equipment', icon: 'Sun', pmcatId: 'solar-renewable' },
  { id: 'construction', name: 'Building & Construction', icon: 'Home', pmcatId: 'infrastructure' },
  { id: 'pipes', name: 'Pipes, Tubes & Fittings', icon: 'Pipette', pmcatId: 'infrastructure' },
  { id: 'chemicals', name: 'Chemicals & Allied', icon: 'FlaskConical', pmcatId: 'process-chemical' }
];

export const BRAND_MCATS: BrandMCat[] = [
  {
    id: 'kirloskar-pumps',
    brandId: 'kirloskar',
    mcatId: 'industrial-pumps',
    name: 'Kirloskar Pumps',
    tagline: 'Reliable pumping solutions engineered for Indian conditions',
    description: 'Kirloskar Brothers manufactures a comprehensive range of centrifugal, submersible, and monoblock pumps for industrial, agricultural, and building services applications.',
    applications: ['Industrial Water Supply', 'HVAC', 'Agricultural Irrigation', 'Process Fluid Handling']
  },
  {
    id: 'kirloskar-diesel-generators',
    brandId: 'kirloskar',
    mcatId: 'diesel-generators',
    name: 'Kirloskar Diesel Generators',
    tagline: 'Dependable backup power for industrial and commercial sites',
    description: 'Kirloskar Green diesel generating sets deliver reliable standby and prime power with fuel-efficient engines, low noise enclosures, and pan-India service support.',
    applications: ['Industrial Backup Power', 'Commercial Buildings', 'Construction Sites', 'Data Centers']
  },
  {
    id: 'ksb-pumps',
    brandId: 'ksb',
    mcatId: 'industrial-pumps',
    name: 'KSB Pumps',
    tagline: 'German-engineered fluid handling systems',
    description: 'KSB Limited offers precision-engineered centrifugal and submersible pumps for water, wastewater, energy, and industrial applications, backed by decades of German technology transfer.',
    applications: ['Deep Well Water Supply', 'Spray Irrigation', 'Pressure Boosting', 'Industrial Process Water']
  },
  {
    id: 'crompton-motors',
    brandId: 'crompton',
    mcatId: 'induction-motors',
    name: 'Crompton Motors',
    tagline: 'High-efficiency industrial motors built to last',
    description: 'Crompton Greaves manufactures IE2/IE3 certified three-phase induction motors engineered for demanding industrial environments with robust cast-iron frames and long service life.',
    applications: ['Pump Drives', 'Compressor Drives', 'Conveyor Systems', 'Workshop Machinery']
  },
  {
    id: 'siemens-automation',
    brandId: 'siemens',
    mcatId: 'plc-drives',
    name: 'Siemens Automation Systems',
    tagline: 'Intelligent control systems for modern manufacturing',
    description: 'Siemens SIMATIC automation systems provide scalable, secure control solutions for industrial process and manufacturing automation, from micro PLCs to full plant control.',
    applications: ['Manufacturing Line Control', 'Process Automation', 'Building Automation', 'Machine Control']
  },
  {
    id: 'voltas-water-coolers',
    brandId: 'voltas',
    mcatId: 'water-coolers-chillers',
    name: 'Voltas Water Coolers, Chillers & Commercial Cooling',
    tagline: 'Trusted cooling for institutional, commercial and industrial use',
    description: 'Voltas manufactures stainless steel water coolers, commercial chillers, package and ductable ACs, deep freezers, and cold room units delivering dependable cooling performance for schools, offices, factories, and public utilities, backed by Tata Group reliability.',
    applications: ['Schools & Institutions', 'Factories', 'Offices', 'Cold Storage Facilities']
  },
  {
    id: 'atlascopco-compressors',
    brandId: 'atlascopco',
    mcatId: 'air-compressors',
    name: 'Atlas Copco Air Compressors & Air Treatment',
    tagline: 'Complete compressed air and vacuum solutions',
    description: 'Atlas Copco rotary screw air compressors with Variable Speed Drive technology, plus piston compressors, vacuum pumps, refrigerant air dryers, and nitrogen generators, deliver industry-leading energy efficiency across a wide range of industrial compressed air applications.',
    applications: ['Manufacturing Plants', 'Automotive Workshops', 'Food & Beverage Processing', 'Process Vacuum Systems']
  },
  {
    id: 'bosch-surveying',
    brandId: 'bosch',
    mcatId: 'measuring-instruments',
    name: 'Bosch Measuring Instruments',
    tagline: 'Precision measuring tools for construction and civil engineering',
    description: 'Bosch Professional measuring instruments — laser distance meters, laser levels, auto levels, wall scanners and combi lasers — engineered for fast, accurate measurement on construction and civil engineering sites.',
    applications: ['Construction Layout', 'Interior Fit-Out', 'Civil Engineering', 'Building Inspection']
  },
  {
    id: 'havells-switchgear',
    brandId: 'havells',
    mcatId: 'switchgear',
    name: 'Havells Switchgear',
    tagline: 'Reliable power protection for industrial installations',
    description: 'Havells manufactures a comprehensive range of low and medium voltage switchgear, including air circuit breakers, for safe and reliable power distribution in industrial and commercial facilities.',
    applications: ['Power Distribution Panels', 'Industrial Plants', 'Commercial Buildings', 'Data Centers']
  },
  ...GENERATED_BRAND_MCATS
];

export const BRANDS: Brand[] = [
  {
    id: 'kirloskar',
    name: 'Kirloskar Brothers Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kirloskar_Brothers_Limited_Logo.JPG',
    description: 'Built on values. Driven by innovation. Trusted for generations.',
    longDescription: 'Kirloskar Brothers Limited (KBL) is a world-class pump manufacturing company with a rich heritage of over 130 years. KBL designs and manufactures a comprehensive range of solutions for water management, agricultural irrigation, industrial application, power generation, and building services.',
    mcatId: 'industrial-pumps',
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
    verifiedSince: 2016,
    isOEM: true,
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'CE Certified', 'NSIC Registered'],
    manufacturingUnits: 5,
    countriesServed: 60,
    topProducts: ['Centrifugal Pumps', 'Submersible Pumps', 'Gate Valves', 'Monoblock Pumps'],
    features: ['130+ years of engineering legacy', 'State-of-the-art manufacturing', 'Strong R&D and innovation focus', 'Sustainability & responsible business'],
    catalogueUrl: '/catalogues/kirloskar-product-catalogue.pdf',
    catalogueSizeMb: 14.2,
    catalogueUpdated: 'June 2026'
  },
  {
    id: 'ksb',
    name: 'KSB Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/KSB_logo_2020.svg',
    description: 'Technology that makes its mark. German engineered, manufactured in India.',
    longDescription: 'KSB Limited, founded in 1960, is a leading manufacturer of pumps and industrial valves. Backed by German technology and deep local market expertise, KSB India provides highly reliable, efficient, and custom fluid handling systems for energy, water, wastewater, industry, and building services.',
    mcatId: 'industrial-pumps',
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
    verifiedSince: 2017,
    isOEM: true,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'CE Certified', 'BEE Star Rating'],
    manufacturingUnits: 5,
    countriesServed: 120,
    topProducts: ['Centrifugal Pumps', 'Submersible Pumps', 'High Pressure Pumps', 'Butterfly Valves'],
    features: ['German technology standards', 'Exceptional energy efficiency', 'Excellent after-sales support', '60+ years in India'],
    catalogueUrl: '/catalogues/ksb-product-catalogue.pdf',
    catalogueSizeMb: 9.8,
    catalogueUpdated: 'May 2026'
  },
  {
    id: 'crompton',
    name: 'Crompton Greaves Consumer Electricals',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Crompton_Greaves_Logo.svg',
    description: 'Let\'s Hangout. Making life comfortable and convenient.',
    longDescription: 'Crompton is one of India\'s leading consumer electrical and industrial companies. With a brand legacy of over 80 years, Crompton manufactures high-efficiency industrial motors, agricultural water pumps, domestic pumps, fan solutions, and energy-saving lighting systems.',
    mcatId: 'induction-motors',
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
    verifiedSince: 2018,
    isOEM: true,
    certifications: ['ISO 9001', 'ISO 14001', 'BEE 5-Star Rating', 'ISI Mark'],
    manufacturingUnits: 3,
    countriesServed: 15,
    topProducts: ['Induction Motors', 'Monoblock Pumps', 'LED Industrial Lights', 'Domestic Pumps'],
    catalogueUrl: '/catalogues/crompton-product-catalogue.pdf',
    catalogueSizeMb: 7.5,
    catalogueUpdated: 'April 2026'
  },
  {
    id: 'bosch',
    name: 'Bosch Limited India',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bosch-logo.svg',
    description: 'Invented for life. Powering industrial progress.',
    longDescription: 'Bosch is a leading global supplier of technology and services. In India, Bosch manufactures high-performance power tools, automotive components, packaging machines, industrial heating, and smart automation systems designed for maximum precision and durability.',
    mcatId: 'power-tools',
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
    verifiedSince: 2016,
    isOEM: true,
    certifications: ['ISO 9001', 'IATF 16949', 'ISO 14001', 'CE Certified'],
    manufacturingUnits: 7,
    countriesServed: 150,
    topProducts: ['Heavy Duty Drills', 'Angle Grinders', 'Fuel Injection Systems', 'Industrial Heaters'],
    catalogueUrl: '/catalogues/bosch-product-catalogue.pdf',
    catalogueSizeMb: 18.6,
    catalogueUpdated: 'June 2026'
  },
  {
    id: 'siemens',
    name: 'Siemens India Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Siemens-logo.svg',
    description: 'Ingenuity for life. Driving digital enterprise.',
    longDescription: 'Siemens India is a technology powerhouse that stands for engineering excellence, innovation, quality, and reliability. The company focuses on intelligent infrastructure for buildings, decentralized energy systems, automation, and digitalization in process and manufacturing industries.',
    mcatId: 'plc-drives',
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
    isOEM: true,
    certifications: ['ISO 9001', 'ISO 14001', 'CE', 'UL Listed'],
    manufacturingUnits: 8,
    countriesServed: 80,
    topProducts: ['PLC Systems', 'AC Drives & VFDs', 'Induction Motors', 'Medium Voltage Switchgear'],
    catalogueUrl: '/catalogues/siemens-product-catalogue.pdf',
    catalogueSizeMb: 22.1,
    catalogueUpdated: 'May 2026'
  },
  {
    id: 'havells',
    name: 'Havells India Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Havells_Logo.svg',
    description: 'Wires that don\'t catch fire. Premium electrical solutions.',
    longDescription: 'Havells India Limited is a leading Fast Moving Electrical Goods (FMEG) Company and a major power distribution equipment manufacturer. Its product portfolio includes industrial cables, heavy-duty switchgears, professional lighting, industrial motors, and solar systems.',
    mcatId: 'switchgear',
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
    verifiedSince: 2019,
    isOEM: true,
    certifications: ['ISO 9001', 'ISO 14001', 'BASEC Certified', 'CE Certified'],
    manufacturingUnits: 14,
    countriesServed: 50,
    topProducts: ['Industrial Cables', 'Air Circuit Breakers', 'Three Phase Motors', 'Solar Inverters'],
    catalogueUrl: '/catalogues/havells-product-catalogue.pdf',
    catalogueSizeMb: 16.4,
    catalogueUpdated: 'June 2026'
  },
  {
    id: 'voltas',
    name: 'Voltas Limited',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Voltas_logo.svg',
    description: 'Trusted cooling and refrigeration. A TATA Enterprise.',
    longDescription: 'Voltas Limited is India\'s premier air conditioning, commercial refrigeration, and engineering solutions provider. Backed by the Tata Group legacy of trust, Voltas manufactures top-tier industrial water coolers, heavy-duty commercial chillers, and advanced cold room storage systems built for standard Indian conditions.',
    mcatId: 'water-coolers-chillers',
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
    verifiedSince: 2015,
    isOEM: true,
    certifications: ['ISO 9001', 'ISO 14001', 'Tata Code of Conduct', 'BEE Energy Star'],
    manufacturingUnits: 4,
    countriesServed: 30,
    topProducts: ['Water Coolers', 'Cassette ACs', 'Ductable ACs', 'Deep Freezers'],
    catalogueUrl: '/catalogues/voltas-product-catalogue.pdf',
    catalogueSizeMb: 11.3,
    catalogueUpdated: 'March 2026'
  },
  {
    id: 'atlascopco',
    name: 'Atlas Copco India',
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Atlas-Copco-Logo.svg',
    description: 'Home of industrial ideas. Leading air compressor solutions.',
    longDescription: 'Atlas Copco is a world-leading provider of sustainable productivity solutions. In India, Atlas Copco provides state-of-the-art oil-injected and oil-free rotary screw air compressors, vacuum solutions, air treatment systems, and power tools for a wide range of industrial applications.',
    mcatId: 'air-compressors',
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
    verifiedSince: 2020,
    isOEM: true,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'CE Certified'],
    manufacturingUnits: 3,
    countriesServed: 180,
    topProducts: ['Rotary Screw Compressors', 'Piston Compressors', 'Air Dryers', 'Industrial Tools'],
    catalogueUrl: '/catalogues/atlascopco-product-catalogue.pdf',
    catalogueSizeMb: 13.9,
    catalogueUpdated: 'April 2026'
  }
];

export const SERVICE_CENTERS: ServiceCenter[] = [
  { id: 'kirloskar-svc-1', brandId: 'kirloskar', name: 'Kirloskar Customer Care Centre — Pune', location: 'Pune, Maharashtra', servicesOffered: ['Installation & Commissioning', 'AMC & Preventive Maintenance', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-419-4884', workingHours: 'Mon-Sat, 9:00 AM - 6:30 PM' },
  { id: 'kirloskar-svc-2', brandId: 'kirloskar', name: 'Kirloskar Service Hub — Ahmedabad', location: 'Ahmedabad, Gujarat', servicesOffered: ['Field Repair & Breakdown Support', 'AMC & Preventive Maintenance', 'Genuine Spare Parts'], contactPhone: '1800-419-4884', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM' },
  { id: 'ksb-svc-1', brandId: 'ksb', name: 'KSB Service Centre — Pimpri', location: 'Pimpri, Pune, India', servicesOffered: ['Installation & Commissioning', 'AMC & Preventive Maintenance', 'Genuine Spare Parts', 'Pump Overhaul & Repair'], contactPhone: '1800-266-5722', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM' },
  { id: 'ksb-svc-2', brandId: 'ksb', name: 'KSB Regional Support — Chennai', location: 'Chennai, Tamil Nadu', servicesOffered: ['Field Repair & Breakdown Support', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-266-5722', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM' },
  { id: 'crompton-svc-1', brandId: 'crompton', name: 'Crompton Service Centre — Mumbai', location: 'Mumbai, Maharashtra', servicesOffered: ['Installation Support', 'AMC & Preventive Maintenance', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-103-1444', workingHours: 'Mon-Sat, 9:30 AM - 6:30 PM' },
  { id: 'crompton-svc-2', brandId: 'crompton', name: 'Crompton Service Hub — Kolkata', location: 'Kolkata, West Bengal', servicesOffered: ['Field Repair & Breakdown Support', 'Genuine Spare Parts'], contactPhone: '1800-103-1444', workingHours: 'Mon-Sat, 9:30 AM - 6:00 PM' },
  { id: 'bosch-svc-1', brandId: 'bosch', name: 'Bosch Professional Service Centre — Bengaluru', location: 'Bengaluru, Karnataka', servicesOffered: ['Tool Calibration & Repair', 'AMC & Preventive Maintenance', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-266-1002', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM' },
  { id: 'bosch-svc-2', brandId: 'bosch', name: 'Bosch Service Hub — New Delhi', location: 'New Delhi, Delhi', servicesOffered: ['Tool Calibration & Repair', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-266-1002', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM' },
  { id: 'siemens-svc-1', brandId: 'siemens', name: 'Siemens Customer Support Centre — Mumbai', location: 'Mumbai, Maharashtra', servicesOffered: ['Installation & Commissioning', 'AMC & Preventive Maintenance', 'Genuine Spare Parts', 'Technical Training'], contactPhone: '1800-209-1800', workingHours: 'Mon-Fri, 9:00 AM - 6:00 PM' },
  { id: 'siemens-svc-2', brandId: 'siemens', name: 'Siemens Regional Support — Bengaluru', location: 'Bengaluru, Karnataka', servicesOffered: ['Field Repair & Breakdown Support', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-209-1800', workingHours: 'Mon-Fri, 9:00 AM - 6:00 PM' },
  { id: 'havells-svc-1', brandId: 'havells', name: 'Havells Customer Care Centre — Noida', location: 'Noida, Uttar Pradesh', servicesOffered: ['Installation Support', 'AMC & Preventive Maintenance', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-103-1313', workingHours: 'Mon-Sat, 9:00 AM - 6:30 PM' },
  { id: 'havells-svc-2', brandId: 'havells', name: 'Havells Service Hub — Hyderabad', location: 'Hyderabad, Telangana', servicesOffered: ['Field Repair & Breakdown Support', 'Genuine Spare Parts'], contactPhone: '1800-103-1313', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM' },
  { id: 'voltas-svc-1', brandId: 'voltas', name: 'Voltas Service Centre — Mumbai', location: 'Mumbai, Maharashtra', servicesOffered: ['Installation & Commissioning', 'AMC & Preventive Maintenance', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-266-1500', workingHours: 'Mon-Sat, 9:00 AM - 7:00 PM' },
  { id: 'voltas-svc-2', brandId: 'voltas', name: 'Voltas Regional Support — Coimbatore', location: 'Coimbatore, Tamil Nadu', servicesOffered: ['Field Repair & Breakdown Support', 'Genuine Spare Parts', 'AMC & Preventive Maintenance'], contactPhone: '1800-266-1500', workingHours: 'Mon-Sat, 9:00 AM - 6:30 PM' },
  { id: 'atlascopco-svc-1', brandId: 'atlascopco', name: 'Atlas Copco Customer Centre — Bengaluru', location: 'Bengaluru, Karnataka', servicesOffered: ['Installation & Commissioning', 'AMC & Preventive Maintenance', 'Genuine Spare Parts', 'Remote Monitoring Support'], contactPhone: '1800-419-6906', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM' },
  { id: 'atlascopco-svc-2', brandId: 'atlascopco', name: 'Atlas Copco Service Hub — Pune', location: 'Pune, Maharashtra', servicesOffered: ['Field Repair & Breakdown Support', 'Genuine Spare Parts', 'Warranty Service'], contactPhone: '1800-419-6906', workingHours: 'Mon-Sat, 9:00 AM - 6:00 PM' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'kbl-centrifugal',
    name: 'Centrifugal Pump - Horizontal End Suction (1 HP - 100 HP)',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    mcatId: 'industrial-pumps',
    brandMCatId: 'kirloskar-pumps',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'KBL DB 50x32',
    keySpecLabel: 'Rated Power',
    keySpecValue: '7.5 HP (5.5 kW)',
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
    },
    certifications: ['ISO 9001:2015', 'CE Certified'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    certifiedYear: 2021
  },
  {
    id: 'kirloskar-dg-625',
    name: 'Kirloskar Green 62.5 kVA Diesel Generator',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    mcatId: 'diesel-generators',
    brandMCatId: 'kirloskar-diesel-generators',
    image: 'https://images.unsplash.com/photo-1636867759143-c28c1e909bd3?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'KG1-62.5AS',
    keySpecLabel: 'Prime Power',
    keySpecValue: '62.5 kVA / 50 kW',
    priceRange: '₹8,50,000 - ₹9,80,000',
    moq: '1 Set',
    deliveryTime: '7 - 14 Days',
    warranty: '12 Months / 2000 Hours',
    description: 'Silent diesel generating set built on a fuel-efficient, low-emission engine for reliable standby and prime power in industrial and commercial installations. Acoustic enclosure keeps noise levels within statutory limits for urban sites.',
    features: [
      'Acoustic enclosure for noise-sensitive locations',
      'Fuel-efficient engine with low emissions',
      'Digital control panel with remote monitoring',
      'Pan-India authorized service network'
    ],
    specifications: {
      'Prime Power': '62.5 kVA / 50 kW',
      'Standby Power': '68.75 kVA / 55 kW',
      'Engine': 'Kirloskar 4R1040TA, 4-Cylinder',
      'Fuel Tank Capacity': '180 Litres',
      'Noise Level': '75 dB(A) @ 1m',
      'Alternator': 'Brushless, Self-Excited'
    },
    useCases: [
      'Backup power for retail stores and small offices',
      'Standby power for mid-sized manufacturing units',
      'Primary power for remote construction sites',
      'Emergency power for hospitals and clinics'
    ],
    certifications: ['CPCB IV+ Emission Norms', 'ISO 8528'],
    certifiedBy: 'Central Pollution Control Board (CPCB)',
    certifiedYear: 2023
  },
  {
    id: 'kirloskar-dg-125',
    name: 'Kirloskar Green 125 kVA Silent Diesel Generator',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    mcatId: 'diesel-generators',
    brandMCatId: 'kirloskar-diesel-generators',
    image: 'https://images.unsplash.com/photo-1636867900334-025210ac78a0?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'KG1-125AS',
    keySpecLabel: 'Prime Power',
    keySpecValue: '125 kVA / 100 kW',
    priceRange: '₹14,20,000 - ₹15,90,000',
    moq: '1 Set',
    deliveryTime: '10 - 18 Days',
    warranty: '12 Months / 2000 Hours',
    description: 'Heavy-duty silent diesel generator designed for continuous industrial backup power. Robust construction with extended service intervals, suited for data centers, factories, and large commercial buildings.',
    features: [
      'Heavy-duty industrial-grade engine',
      'Extended service intervals reduce downtime',
      'Automatic Mains Failure (AMF) panel compatible',
      'Weatherproof canopy with corrosion-resistant coating'
    ],
    specifications: {
      'Prime Power': '125 kVA / 100 kW',
      'Standby Power': '137.5 kVA / 110 kW',
      'Engine': 'Kirloskar 6R1040TA, 6-Cylinder',
      'Fuel Tank Capacity': '340 Litres',
      'Noise Level': '78 dB(A) @ 1m',
      'Alternator': 'Brushless, Self-Excited'
    },
    useCases: [
      'Continuous backup for data centers',
      'Standby power for large factories',
      'Power for commercial complexes and malls',
      'Prime power for extended construction projects'
    ],
    certifications: ['CPCB IV+ Emission Norms', 'ISO 8528'],
    certifiedBy: 'Central Pollution Control Board (CPCB)',
    certifiedYear: 2023
  },
  {
    id: 'ksb-submersible',
    name: 'KSB Submersible Borehole Pump (CORA Series)',
    brandId: 'ksb',
    brandName: 'KSB Limited',
    mcatId: 'industrial-pumps',
    brandMCatId: 'ksb-pumps',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'CORA 65-250-1450',
    keySpecLabel: 'Rated Power',
    keySpecValue: '10 HP (7.5 kW)',
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
    },
    certifications: ['ISO 9001', 'CE Certified'],
    certifiedBy: 'TÜV SÜD',
    certifiedYear: 2020
  },
  {
    id: 'ksb-etanorm',
    name: 'KSB Etanorm End Suction Centrifugal Pump',
    brandId: 'ksb',
    brandName: 'KSB Limited',
    mcatId: 'industrial-pumps',
    brandMCatId: 'ksb-pumps',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'Etanorm 065-040-200',
    keySpecLabel: 'Rated Power',
    keySpecValue: '15 HP (11 kW)',
    priceRange: '₹35,000 - ₹2,10,000',
    moq: '1 Piece',
    deliveryTime: '4 - 8 Days',
    warranty: '18 Months',
    description: 'Standardized end suction centrifugal pump complying with EN 733, widely used for water supply, industrial circulation, and fire-fighting applications requiring high reliability.',
    features: [
      'EN 733 standardized dimensions for easy replacement',
      'Back pull-out design for fast maintenance',
      'Wide range of material combinations',
      'Suitable for clean and moderately contaminated liquids'
    ],
    specifications: {
      'Power Range': '3 HP - 75 HP',
      'Flow Rate': 'Up to 700 m³/hr',
      'Head Range': 'Up to 100 meters',
      'Material': 'Cast Iron / Stainless Steel',
      'Impeller Type': 'Closed Radial',
      'Mounting': 'Horizontal Base Mounted'
    },
    certifications: ['ISO 9001', 'EN 733'],
    certifiedBy: 'TÜV SÜD',
    certifiedYear: 2022
  },
  {
    id: 'crompton-induction-motor',
    name: 'Crompton TEFC Three Phase Squirrel Cage Induction Motor',
    brandId: 'crompton',
    brandName: 'Crompton Greaves Consumer Electricals',
    mcatId: 'induction-motors',
    brandMCatId: 'crompton-motors',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'CG-TEFC-5HP-4P',
    keySpecLabel: 'Rated Power',
    keySpecValue: '5 HP (3.7 kW), 4 Pole',
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
    id: 'crompton-ie3-compact',
    name: 'Crompton IE3 Compact Three Phase Induction Motor',
    brandId: 'crompton',
    brandName: 'Crompton Greaves Consumer Electricals',
    mcatId: 'induction-motors',
    brandMCatId: 'crompton-motors',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'CG-IE3-2HP-4P',
    keySpecLabel: 'Rated Power',
    keySpecValue: '2 HP (1.5 kW), 4 Pole',
    priceRange: '₹8,500 - ₹45,000',
    moq: '1 Piece',
    deliveryTime: '3 - 6 Days',
    warranty: '18 Months',
    description: 'Compact frame IE3 premium efficiency motor for space-constrained installations. Ideal for small pumps, fans, and light workshop machinery requiring energy-efficient operation.',
    features: [
      'IE3 premium efficiency certified',
      'Compact frame size for tight installations',
      'Low starting current design',
      'Maintenance-free sealed bearings'
    ],
    specifications: {
      'Power Rating': '0.5 HP - 15 HP',
      'Voltage': '415V ± 10%, 3 Phase',
      'Frequency': '50Hz ± 5%',
      'Speed (RPM)': '1000 / 1500 / 3000 RPM',
      'Frame Size': '71M to 132M',
      'Mounting': 'Foot Mounting'
    }
  },
  {
    id: 'siemens-plc-s71200',
    name: 'Siemens SIMATIC S7-1200 Micro PLC System',
    brandId: 'siemens',
    brandName: 'Siemens India Limited',
    mcatId: 'plc-drives',
    brandMCatId: 'siemens-automation',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'SIMATIC S7-1214C DC/DC/DC',
    keySpecLabel: 'Digital I/O',
    keySpecValue: '14 DI / 10 DO Onboard',
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
    },
    certifications: ['CE', 'UL Listed'],
    certifiedBy: 'TÜV Rheinland',
    certifiedYear: 2019
  },
  {
    id: 'voltas-water-cooler',
    name: 'Voltas Water Cooler 40/80 PSS & FSS, 80 Ltrs Storage, 2 Fucets',
    brandId: 'voltas',
    brandName: 'Voltas Limited',
    mcatId: 'water-coolers-chillers',
    brandMCatId: 'voltas-water-coolers',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'MW80-PSS',
    keySpecLabel: 'Storage Capacity',
    keySpecValue: '80 Litres, 2 Faucets',
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
    },
    certifications: ['BEE 4-Star', 'ISI Mark'],
    certifiedBy: 'Bureau of Energy Efficiency (BEE)',
    certifiedYear: 2022
  },
  {
    id: 'atlas-copco-compressor',
    name: 'Atlas Copco Air Compressors GA 30 VSD 30 kW 4 bar(e) Pack Oil-injected Rotary Screw Compressor',
    brandId: 'atlascopco',
    brandName: 'Atlas Copco India',
    mcatId: 'air-compressors',
    brandMCatId: 'atlascopco-compressors',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'GA 30 VSD+',
    keySpecLabel: 'Motor Power',
    keySpecValue: '30 kW (40 HP), VSD',
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
    id: 'bosch-glm-50',
    name: 'Bosch Professional Laser Range Finder GLM 50',
    brandId: 'bosch',
    brandName: 'Bosch Limited India',
    mcatId: 'measuring-instruments',
    brandMCatId: 'bosch-surveying',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'GLM 50',
    keySpecLabel: 'Measuring Range',
    keySpecValue: 'Up to 50m',
    priceRange: '₹8,500 - ₹12,000',
    moq: '1 Piece',
    deliveryTime: '2 - 5 Days',
    warranty: '12 Months',
    description: 'Compact professional laser range finder for fast, accurate distance, area, and volume measurement on construction and civil engineering sites. Illuminated display and onboard memory for the last measured values.',
    features: [
      'Accurate to ±1.5mm at up to 50m range',
      'Direct area and volume calculation modes',
      'Illuminated display for low-light readability',
      'Compact, pocket-sized rugged housing'
    ],
    specifications: {
      'Measuring Range': '0.05m to 50m',
      'Accuracy': '±1.5mm',
      'Measuring Modes': 'Length, Area, Volume, Indirect Height',
      'Memory': 'Last 10 Measurements',
      'Display': 'Illuminated LCD',
      'Power Source': '2 x AAA Batteries'
    },
    certifications: ['CE Certified'],
    certifiedBy: 'TÜV Rheinland',
    certifiedYear: 2021
  },
  {
    id: 'havells-acb',
    name: 'Havells Air Circuit Breaker (ACB) 4-Pole',
    brandId: 'havells',
    brandName: 'Havells India Limited',
    mcatId: 'switchgear',
    brandMCatId: 'havells-switchgear',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    modelNumber: 'DFDA0400',
    keySpecLabel: 'Rated Current',
    keySpecValue: '400A, 4-Pole',
    priceRange: '₹45,000 - ₹1,85,000',
    moq: '1 Piece',
    deliveryTime: '5 - 9 Days',
    warranty: '18 Months',
    description: 'Heavy-duty air circuit breaker for reliable overload and short-circuit protection in industrial power distribution panels. Compliant with IEC 60947-2 for safe, dependable switching.',
    features: [
      'IEC 60947-2 compliant construction',
      'Microprocessor-based trip unit',
      'Draw-out and fixed mounting options',
      'High breaking capacity for industrial loads'
    ],
    specifications: {
      'Rated Current': '400A - 6300A',
      'Poles': '3-Pole / 4-Pole',
      'Breaking Capacity': 'Up to 100 kA',
      'Insulation Voltage': '1000V AC',
      'Mounting': 'Fixed / Draw-out',
      'Trip Unit': 'Microprocessor-based'
    },
    certifications: ['IEC 60947-2', 'ISO 9001'],
    certifiedBy: 'Bureau of Indian Standards (BIS)',
    certifiedYear: 2022
  },
  ...GENERATED_PRODUCTS
];

export const SUPPLIERS: Supplier[] = [
  {
    id: 'kirloskar-supp-1',
    name: 'Kirloskar Pneumatic Co. Ltd. (Corporate Dealer)',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    productId: 'kbl-centrifugal',
    location: 'Pune, Maharashtra',
    rating: 4.6,
    reviewsCount: 164,
    experienceYears: 54,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2015,
    responseTime: '1.6 hrs',
    deliveryTimeRange: '2-4 Days',
    priceEstimate: '₹18,500 - ₹98,000',
    contactPhone: '+91 98221 34567'
  },
  {
    id: 'kirloskar-supp-2',
    name: 'Kirloskar Ferrous Industries Ltd. (Authorized Distributor)',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    productId: 'kbl-centrifugal',
    location: 'Belgaum, Karnataka',
    rating: 4.5,
    reviewsCount: 287,
    experienceYears: 32,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2010,
    responseTime: '2.1 hrs',
    deliveryTimeRange: '3-5 Days',
    priceEstimate: '₹19,200 - ₹1,02,500',
    contactPhone: '+91 97402 88123'
  },
  {
    id: 'ksb-supp-1',
    name: 'KSB Pumps Pvt. Ltd. (Premium Distributor)',
    brandId: 'ksb',
    brandName: 'KSB Limited',
    productId: 'ksb-submersible',
    location: 'Pune, Maharashtra',
    rating: 4.6,
    reviewsCount: 310,
    experienceYears: 50,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2012,
    responseTime: '2.4 hrs',
    deliveryTimeRange: '2-4 Days',
    priceEstimate: '₹22,000 - ₹1,80,000',
    contactPhone: '+91 99870 45612'
  },
  {
    id: 'crompton-supp-1',
    name: 'Crompton Power Solutions Pvt. Ltd. (Authorized Distributor)',
    brandId: 'crompton',
    brandName: 'Crompton Greaves Consumer Electricals',
    productId: 'crompton-induction-motor',
    location: 'Mumbai, Maharashtra',
    rating: 4.3,
    reviewsCount: 145,
    experienceYears: 22,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2014,
    responseTime: '2.8 hrs',
    deliveryTimeRange: '4-8 Days',
    priceEstimate: '₹12,000 - ₹2,80,000',
    contactPhone: '+91 96193 77890'
  },
  {
    id: 'siemens-supp-1',
    name: 'Siemens Automation Partners Pvt. Ltd. (Authorized Channel Partner)',
    brandId: 'siemens',
    brandName: 'Siemens India Limited',
    productId: 'siemens-plc-s71200',
    location: 'Mumbai, Maharashtra',
    rating: 4.5,
    reviewsCount: 198,
    experienceYears: 15,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2016,
    responseTime: '3.2 hrs',
    deliveryTimeRange: '2-4 Days',
    priceEstimate: '₹15,000 - ₹85,000',
    contactPhone: '+91 90040 23456'
  },
  {
    id: 'voltas-supp-1',
    name: 'Voltas Authorized Service & Sales (Western Region)',
    brandId: 'voltas',
    brandName: 'Voltas Limited',
    productId: 'voltas-water-cooler',
    location: 'Mumbai, Maharashtra',
    rating: 4.6,
    reviewsCount: 412,
    experienceYears: 28,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2011,
    responseTime: '1.8 hrs',
    deliveryTimeRange: '2-5 Days',
    priceEstimate: '₹37,000 - ₹52,000',
    contactPhone: '+91 88799 61234'
  },
  {
    id: 'voltas-supp-2',
    name: 'Tata Voltas Retail Partners Ltd. (Premium Distributor)',
    brandId: 'voltas',
    brandName: 'Voltas Limited',
    productId: 'voltas-water-cooler',
    location: 'Ahmedabad, Gujarat',
    rating: 4.4,
    reviewsCount: 176,
    experienceYears: 19,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2017,
    responseTime: '2.6 hrs',
    deliveryTimeRange: '3-6 Days',
    priceEstimate: '₹38,500 - ₹54,000',
    contactPhone: '+91 77389 90567'
  },
  {
    id: 'atlascopco-supp-1',
    name: 'Atlas Copco Compressor Solutions (Official Channel)',
    brandId: 'atlascopco',
    brandName: 'Atlas Copco India',
    productId: 'atlas-copco-compressor',
    location: 'Pune, Maharashtra',
    rating: 4.5,
    reviewsCount: 87,
    experienceYears: 16,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2018,
    responseTime: '3.5 hrs',
    deliveryTimeRange: '5-10 Days',
    priceEstimate: '₹4,80,000 - ₹6,20,000',
    contactPhone: '+91 98501 12378'
  },
  {
    id: 'bosch-supp-1',
    name: 'Bosch Precision Instruments Pvt. Ltd. (Authorized Dealer)',
    brandId: 'bosch',
    brandName: 'Bosch Limited India',
    productId: 'bosch-glm-50',
    location: 'Bengaluru, Karnataka',
    rating: 4.4,
    reviewsCount: 63,
    experienceYears: 12,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2019,
    responseTime: '2.9 hrs',
    deliveryTimeRange: '2-5 Days',
    priceEstimate: '₹8,500 - ₹12,000',
    contactPhone: '+91 99164 55321'
  },
  {
    id: 'kirloskar-supp-3',
    name: 'Kirloskar Oil Engines Power Solutions (Authorized Genset Dealer)',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    productId: 'kirloskar-dg-625',
    location: 'Pune, Maharashtra',
    rating: 4.7,
    reviewsCount: 221,
    experienceYears: 40,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2013,
    responseTime: '1.9 hrs',
    deliveryTimeRange: '7-14 Days',
    priceEstimate: '₹8,50,000 - ₹9,80,000',
    contactPhone: '+91 98220 76543'
  },
  {
    id: 'kirloskar-supp-4',
    name: 'Kirloskar Power Systems (Western Region Distributor)',
    brandId: 'kirloskar',
    brandName: 'Kirloskar Brothers Limited',
    productId: 'kirloskar-dg-125',
    location: 'Mumbai, Maharashtra',
    rating: 4.6,
    reviewsCount: 158,
    experienceYears: 27,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2016,
    responseTime: '2.3 hrs',
    deliveryTimeRange: '10-18 Days',
    priceEstimate: '₹14,20,000 - ₹15,90,000',
    contactPhone: '+91 96993 21098'
  },
  {
    id: 'ksb-supp-2',
    name: 'KSB Fluid Systems Pvt. Ltd. (Authorized Dealer)',
    brandId: 'ksb',
    brandName: 'KSB Limited',
    productId: 'ksb-etanorm',
    location: 'Chennai, Tamil Nadu',
    rating: 4.5,
    reviewsCount: 94,
    experienceYears: 21,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2015,
    responseTime: '2.7 hrs',
    deliveryTimeRange: '4-8 Days',
    priceEstimate: '₹35,000 - ₹2,10,000',
    contactPhone: '+91 94440 65789'
  },
  {
    id: 'crompton-supp-2',
    name: 'Crompton Electricals Retail Network (Authorized Distributor)',
    brandId: 'crompton',
    brandName: 'Crompton Greaves Consumer Electricals',
    productId: 'crompton-ie3-compact',
    location: 'Pune, Maharashtra',
    rating: 4.2,
    reviewsCount: 76,
    experienceYears: 14,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2018,
    responseTime: '3.1 hrs',
    deliveryTimeRange: '3-6 Days',
    priceEstimate: '₹8,500 - ₹45,000',
    contactPhone: '+91 97659 34210'
  },
  {
    id: 'havells-supp-1',
    name: 'Havells Power Distribution Partners (Authorized Dealer)',
    brandId: 'havells',
    brandName: 'Havells India Limited',
    productId: 'havells-acb',
    location: 'Noida, Uttar Pradesh',
    rating: 4.4,
    reviewsCount: 112,
    experienceYears: 18,
    verified: true,
    isAuthorizedDealer: true,
    authorizedSince: 2017,
    responseTime: '2.4 hrs',
    deliveryTimeRange: '5-9 Days',
    priceEstimate: '₹45,000 - ₹1,85,000',
    contactPhone: '+91 99999 43201'
  },
  ...GENERATED_SUPPLIERS
];

export const ALTERNATIVE_PRODUCTS: AlternativeProduct[] = [
  { id: 'alt-dg625-1', productId: 'kirloskar-dg-625', brandName: 'Cummins', modelNumber: 'C62.5D5', mcatId: 'diesel-generators', priceRange: '₹8,90,000 - ₹10,20,000', keySpecLabel: 'Prime Power', keySpecValue: '62.5 kVA / 50 kW' },
  { id: 'alt-dg625-2', productId: 'kirloskar-dg-625', brandName: 'Mahindra Powerol', modelNumber: 'MPG62-D', mcatId: 'diesel-generators', priceRange: '₹8,20,000 - ₹9,50,000', keySpecLabel: 'Prime Power', keySpecValue: '62.5 kVA / 50 kW' },
  { id: 'alt-dg125-1', productId: 'kirloskar-dg-125', brandName: 'Cummins', modelNumber: 'C125D5', mcatId: 'diesel-generators', priceRange: '₹14,80,000 - ₹16,50,000', keySpecLabel: 'Prime Power', keySpecValue: '125 kVA / 100 kW' },
  { id: 'alt-dg125-2', productId: 'kirloskar-dg-125', brandName: 'Mahindra Powerol', modelNumber: 'MPG125-D', mcatId: 'diesel-generators', priceRange: '₹13,90,000 - ₹15,40,000', keySpecLabel: 'Prime Power', keySpecValue: '125 kVA / 100 kW' },
  { id: 'alt-kbl-1', productId: 'kbl-centrifugal', brandName: 'Flowserve', modelNumber: 'Model XYZ100', mcatId: 'industrial-pumps', priceRange: '₹21,000 - ₹1,35,000', keySpecLabel: 'Rated Power', keySpecValue: '7.5 HP (5.5 kW)' },
  { id: 'alt-kbl-2', productId: 'kbl-centrifugal', brandName: 'Grundfos', modelNumber: 'CR Series', mcatId: 'industrial-pumps', priceRange: '₹24,500 - ₹1,48,000', keySpecLabel: 'Rated Power', keySpecValue: '7.5 HP (5.5 kW)' },
  { id: 'alt-ksb-1', productId: 'ksb-submersible', brandName: 'Sulzer', modelNumber: 'APP Series', mcatId: 'industrial-pumps', priceRange: '₹20,500 - ₹1,70,000', keySpecLabel: 'Rated Power', keySpecValue: '10 HP (7.5 kW)' },
  { id: 'alt-ksb-2', productId: 'ksb-submersible', brandName: 'Grundfos', modelNumber: 'SP Series', mcatId: 'industrial-pumps', priceRange: '₹25,000 - ₹1,95,000', keySpecLabel: 'Rated Power', keySpecValue: '10 HP (7.5 kW)' },
  { id: 'alt-crompton-1', productId: 'crompton-induction-motor', brandName: 'Siemens', modelNumber: '1LE1 Series', mcatId: 'induction-motors', priceRange: '₹14,000 - ₹3,80,000', keySpecLabel: 'Rated Power', keySpecValue: '5 HP (3.7 kW), 4 Pole' },
  { id: 'alt-crompton-2', productId: 'crompton-induction-motor', brandName: 'ABB', modelNumber: 'M3BP Series', mcatId: 'induction-motors', priceRange: '₹13,500 - ₹3,65,000', keySpecLabel: 'Rated Power', keySpecValue: '5 HP (3.7 kW), 4 Pole' },
  { id: 'alt-siemens-1', productId: 'siemens-plc-s71200', brandName: 'Allen-Bradley', modelNumber: 'CompactLogix 5069', mcatId: 'plc-drives', priceRange: '₹18,000 - ₹1,05,000', keySpecLabel: 'Digital I/O', keySpecValue: '16 DI / 12 DO Onboard' },
  { id: 'alt-siemens-2', productId: 'siemens-plc-s71200', brandName: 'Schneider Electric', modelNumber: 'Modicon M221', mcatId: 'plc-drives', priceRange: '₹13,500 - ₹78,000', keySpecLabel: 'Digital I/O', keySpecValue: '14 DI / 10 DO Onboard' },
  { id: 'alt-voltas-1', productId: 'voltas-water-cooler', brandName: 'Blue Star', modelNumber: 'Storage Water Cooler SDLX', mcatId: 'water-coolers-chillers', priceRange: '₹35,500 onwards', keySpecLabel: 'Storage Capacity', keySpecValue: '80 Litres, 2 Faucets' },
  { id: 'alt-voltas-2', productId: 'voltas-water-cooler', brandName: 'Usha', modelNumber: 'Prime Cooler 80L', mcatId: 'water-coolers-chillers', priceRange: '₹33,000 onwards', keySpecLabel: 'Storage Capacity', keySpecValue: '80 Litres, 2 Faucets' },
  { id: 'alt-atlascopco-1', productId: 'atlas-copco-compressor', brandName: 'Ingersoll Rand', modelNumber: 'R-Series 30kW', mcatId: 'air-compressors', priceRange: '₹4,60,000 onwards', keySpecLabel: 'Motor Power', keySpecValue: '30 kW (40 HP), VSD' },
  { id: 'alt-atlascopco-2', productId: 'atlas-copco-compressor', brandName: 'Kaeser', modelNumber: 'SM Series', mcatId: 'air-compressors', priceRange: '₹4,95,000 onwards', keySpecLabel: 'Motor Power', keySpecValue: '30 kW (40 HP), VSD' },
  { id: 'alt-bosch-glm-1', productId: 'bosch-glm-50', brandName: 'Leica DISTO', modelNumber: 'D2', mcatId: 'measuring-instruments', priceRange: '₹9,500 onwards', keySpecLabel: 'Measuring Range', keySpecValue: 'Up to 50m' },
  { id: 'alt-bosch-glm-2', productId: 'bosch-glm-50', brandName: 'Stanley', modelNumber: 'TLM 50', mcatId: 'measuring-instruments', priceRange: '₹7,800 onwards', keySpecLabel: 'Measuring Range', keySpecValue: 'Up to 50m' },
  ...GENERATED_ALTERNATIVES
];

// Scoped per brand (brandId) and, where relevant, per exact product (productId) —
// each brand/brand-mcat page filters to only its own reviews, so a buyer looking at
// air compressors never sees a review praising a competitor's centrifugal pumps.
export const REVIEWS: Review[] = [
  {
    id: 'rev-kirloskar-1',
    brandId: 'kirloskar',
    userName: 'Rakesh Mehta',
    userRole: 'Operations Manager',
    companyName: 'Mehta Industries, Pune',
    rating: 5.0,
    comment: 'Excellent quality centrifugal pumps and on-time delivery. Their engineering team is extremely helpful in suggesting configurations. The after sales service is highly reliable.',
    date: '2026-06-25'
  },
  {
    id: 'rev-kirloskar-2',
    brandId: 'kirloskar',
    productId: 'kirloskar-dg-625',
    userName: 'Sunil Deshpande',
    userRole: 'Facility Head',
    companyName: 'Deshpande Textiles, Nagpur',
    rating: 4.5,
    comment: 'Our 62.5 kVA diesel genset has run through two summers of daily load-shedding without a single unplanned breakdown. Fuel efficiency is better than the previous brand we used.',
    date: '2026-06-10'
  },
  {
    id: 'rev-ksb-1',
    brandId: 'ksb',
    userName: 'Vinod Kulkarni',
    userRole: 'Purchase Head',
    companyName: 'Kulkarni Borewells, Nashik',
    rating: 4.5,
    comment: 'KSB submersible pumps have held up well even with our variable voltage supply in rural sites. Genuine spare parts are easy to source through the authorized dealer.',
    date: '2026-06-20'
  },
  {
    id: 'rev-ksb-2',
    brandId: 'ksb',
    userName: 'Farida Sheikh',
    userRole: 'Plant Engineer',
    companyName: 'Sheikh Process Equipments, Aurangabad',
    rating: 4.0,
    comment: 'Reliable pump curves match the datasheet closely, which made sizing our process line straightforward. Delivery took a bit longer than quoted but quality was worth the wait.',
    date: '2026-05-29'
  },
  {
    id: 'rev-crompton-1',
    brandId: 'crompton',
    userName: 'Anil Rathi',
    userRole: 'Maintenance Manager',
    companyName: 'Rathi Steel Rolling Mills, Ludhiana',
    rating: 4.5,
    comment: 'Crompton induction motors run cooler than what we had before, even under continuous three-shift operation. Noise levels are noticeably lower too.',
    date: '2026-06-14'
  },
  {
    id: 'rev-crompton-2',
    brandId: 'crompton',
    userName: 'Priya Nair',
    userRole: 'Procurement Executive',
    companyName: 'Nair Engineering Works, Coimbatore',
    rating: 4.0,
    comment: 'Good product range and strong technical documentation. IE3 efficiency motors have brought our electricity bill down measurably over six months.',
    date: '2026-05-22'
  },
  {
    id: 'rev-bosch-1',
    brandId: 'bosch',
    userName: 'Manoj Bhatia',
    userRole: 'Site Supervisor',
    companyName: 'Bhatia Construction Co., Jaipur',
    rating: 4.5,
    comment: 'The Bosch laser distance meter has become standard kit on every site visit — accurate readings even outdoors in bright sunlight, and the battery lasts weeks.',
    date: '2026-06-08'
  },
  {
    id: 'rev-bosch-2',
    brandId: 'bosch',
    userName: 'Kavita Iyer',
    userRole: 'QA Manager',
    companyName: 'Iyer Precision Tools, Chennai',
    rating: 4.5,
    comment: 'Measuring instruments hold calibration well between service intervals. Authorized dealer was quick to arrange a replacement under warranty when one unit had a display fault.',
    date: '2026-05-16'
  },
  {
    id: 'rev-siemens-1',
    brandId: 'siemens',
    productId: 'siemens-plc-s71200',
    userName: 'Rahul Verma',
    userRole: 'Automation Engineer',
    companyName: 'Verma Auto Components, Gurugram',
    rating: 5.0,
    comment: 'SIMATIC S7-1200 has been rock solid for our packaging line automation. TIA Portal documentation is thorough and the local support engineer resolved our commissioning query same day.',
    date: '2026-06-27'
  },
  {
    id: 'rev-siemens-2',
    brandId: 'siemens',
    userName: 'Neha Kapoor',
    userRole: 'Plant Head',
    companyName: 'Kapoor Process Industries, Vadodara',
    rating: 4.0,
    comment: 'Strong technical expertise from the authorized channel partner during selection. Pricing is on the higher side but the reliability track record justifies it for critical processes.',
    date: '2026-05-11'
  },
  {
    id: 'rev-havells-1',
    brandId: 'havells',
    userName: 'Suresh Pillai',
    userRole: 'Electrical Contractor',
    companyName: 'Pillai Electricals, Kochi',
    rating: 4.5,
    comment: 'Havells ACBs are straightforward to install and the build quality feels a notch above other brands in this price range. Dealer stock availability has never been an issue.',
    date: '2026-06-05'
  },
  {
    id: 'rev-havells-2',
    brandId: 'havells',
    userName: 'Deepa Reddy',
    userRole: 'Facilities Manager',
    companyName: 'Reddy Business Park, Hyderabad',
    rating: 4.0,
    comment: 'Switchgear panels have run without a single trip since installation eighteen months ago. Documentation for statutory compliance was provided promptly.',
    date: '2026-04-30'
  },
  {
    id: 'rev-voltas-1',
    brandId: 'voltas',
    productId: 'voltas-water-cooler',
    userName: 'Amit Sharma',
    userRole: 'Purchase Head',
    companyName: 'Sharma Traders, Delhi',
    rating: 4.0,
    comment: 'The 80 litre storage water cooler easily keeps up with our factory floor staff strength through peak summer. Cooling is consistent and service response has been quick.',
    date: '2026-06-18'
  },
  {
    id: 'rev-voltas-2',
    brandId: 'voltas',
    userName: 'Ritu Chawla',
    userRole: 'Admin Manager',
    companyName: 'Chawla Corporate Services, Gurugram',
    rating: 4.5,
    comment: 'Good product range and strong technical support from the dealer when we needed a custom chiller configuration for our office building. Delivery was on schedule.',
    date: '2026-05-24'
  },
  {
    id: 'rev-atlascopco-1',
    brandId: 'atlascopco',
    productId: 'atlascopco-ga11',
    userName: 'Harpreet Singh',
    userRole: 'Production Manager',
    companyName: 'Singh Auto Ancillaries, Ludhiana',
    rating: 5.0,
    comment: 'Switched to the GA 11 VSD+ from a fixed-speed compressor and our compressed air electricity cost dropped noticeably within the first quarter. VSD makes a real difference at partial load.',
    date: '2026-06-22'
  },
  {
    id: 'rev-atlascopco-2',
    brandId: 'atlascopco',
    userName: 'Meera Joshi',
    userRole: 'Maintenance Head',
    companyName: 'Joshi Precision Castings, Pune',
    rating: 4.5,
    comment: 'Atlas Copco\'s authorized service network responded within hours for an urgent breakdown. Genuine spares were available locally, which minimized our downtime.',
    date: '2026-06-02'
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

// ---- Data-access helpers (used directly by Server Components) ----

export function getBrands(filter?: { mcatId?: string }): Brand[] {
  if (filter?.mcatId) {
    // Resolve via BRAND_MCATS (brand<->MCat linking table) rather than the
    // brand's single primary `mcatId` field, since brands like Kirloskar sell
    // across multiple MCats (Industrial Pumps AND Diesel Generators).
    const brandIds = new Set(BRAND_MCATS.filter(m => m.mcatId === filter.mcatId).map(m => m.brandId));
    return BRANDS.filter(b => brandIds.has(b.id));
  }
  return BRANDS;
}

export function getBrandById(id: string): Brand | undefined {
  return BRANDS.find(b => b.id === id);
}

export function getProducts(filter?: { mcatId?: string; brandId?: string; brandMCatId?: string }): Product[] {
  let result = PRODUCTS;
  if (filter?.mcatId && filter.mcatId !== 'all') {
    result = result.filter(p => p.mcatId === filter.mcatId);
  }
  if (filter?.brandId) {
    result = result.filter(p => p.brandId === filter.brandId);
  }
  if (filter?.brandMCatId) {
    result = result.filter(p => p.brandMCatId === filter.brandMCatId);
  }
  return result;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

// Resolves a buyer's active spec-value filter (e.g. "11 kW (15 HP), VSD" picked on a
// category page) to the one matching product for a given brand+category — used to carry
// "the buyer was just looking at this exact spec" forward across screens via the URL,
// and to preselect that same model on the Brand-MCat page instead of defaulting to
// whichever product happens to sit first in the PRODUCTS array.
export function findProductBySpec(brandId: string, mcatId: string, specValue: string): Product | undefined {
  return PRODUCTS.find(p => p.brandId === brandId && p.mcatId === mcatId && p.keySpecValue === specValue);
}

export function getSuppliers(filter?: { brandId?: string; productId?: string }): Supplier[] {
  let result = SUPPLIERS;
  if (filter?.brandId) {
    result = result.filter(s => s.brandId === filter.brandId);
  }
  if (filter?.productId) {
    result = result.filter(s => s.productId === filter.productId);
  }
  return result;
}

export function getAlternativeProducts(productId: string): AlternativeProduct[] {
  return ALTERNATIVE_PRODUCTS.filter(a => a.productId === productId);
}

export function getServiceCenters(filter?: { brandId?: string }): ServiceCenter[] {
  if (filter?.brandId) {
    return SERVICE_CENTERS.filter(s => s.brandId === filter.brandId);
  }
  return SERVICE_CENTERS;
}

export function getReviews(filter?: { brandId?: string }): Review[] {
  if (filter?.brandId) {
    return REVIEWS.filter(r => r.brandId === filter.brandId);
  }
  return REVIEWS;
}

export function getMcats(): MCat[] {
  return MCATS;
}

export interface CategoryFomoSummary {
  id: string;
  name: string;
  icon: string;
  brandCount: number;
  productCount: number;
  topBrands: { id: string; name: string; logo: string }[];
}

// Real, computed brand/product density per category — not fabricated stats —
// so the homepage can show buyers genuine "this category has N real brands"
// social proof, and honestly distinguish branded categories from ones that
// are standard-sourcing-only (brandCount === 0, no curated brand catalog yet).
export function getCategoryFomoSummaries(): CategoryFomoSummary[] {
  return MCATS.map(c => {
    const catBrands = getBrands({ mcatId: c.id }).slice().sort((a, b) => b.rating - a.rating);
    return {
      id: c.id,
      name: c.name,
      icon: c.icon,
      brandCount: catBrands.length,
      productCount: PRODUCTS.filter(p => p.mcatId === c.id).length,
      topBrands: catBrands.slice(0, 3).map(b => ({ id: b.id, name: b.name, logo: b.logo }))
    };
  }).sort((a, b) => b.brandCount - a.brandCount);
}

export interface CatalogStats {
  totalCategories: number;
  brandedCategoryCount: number;
  standardCategoryCount: number;
  totalBrands: number;
  totalProducts: number;
}

export function getCatalogStats(): CatalogStats {
  const brandedCategoryCount = MCATS.filter(c => getBrands({ mcatId: c.id }).length > 0).length;
  return {
    totalCategories: MCATS.length,
    brandedCategoryCount,
    standardCategoryCount: MCATS.length - brandedCategoryCount,
    totalBrands: BRANDS.length,
    totalProducts: PRODUCTS.length
  };
}

export function getMcatById(id: string): MCat | undefined {
  return MCATS.find(c => c.id === id);
}

export function getPMcats(): PMcat[] {
  return PMCATS;
}

export function getPMcatById(id: string): PMcat | undefined {
  return PMCATS.find(i => i.id === id);
}

export function getBrandMCats(filter?: { brandId?: string; mcatId?: string }): BrandMCat[] {
  let result = BRAND_MCATS;
  if (filter?.brandId) {
    result = result.filter(m => m.brandId === filter.brandId);
  }
  if (filter?.mcatId) {
    result = result.filter(m => m.mcatId === filter.mcatId);
  }
  return result;
}

export function getBrandMCatById(id: string): BrandMCat | undefined {
  return BRAND_MCATS.find(m => m.id === id);
}

// ---- In-memory leads store (ephemeral, resets on server restart — matches prior in-memory React state fidelity) ----

const leadsStore: BuyLead[] = [
  {
    id: 'QR98431057',
    productName: 'Kirloskar Monoblock Pump',
    brandName: 'Kirloskar Brothers Limited',
    quantity: '2 Pieces',
    location: 'Ahmedabad, Gujarat',
    requirement: 'Require high-durability cast iron monoblock pumps for light agricultural sprinkle loops.',
    timestamp: '2026-06-28T14:30:00Z',
    status: 'completed'
  },
  {
    id: 'QR84021793',
    productName: 'Crompton Induction Motor (5HP)',
    brandName: 'Crompton Greaves',
    quantity: '1 Piece',
    location: 'Pune, Maharashtra',
    requirement: 'Need an IE3 highly efficient motor for workshop drill assemblies.',
    timestamp: '2026-06-30T09:15:00Z',
    status: 'connected'
  }
];

export function getLeads(): BuyLead[] {
  return leadsStore;
}

export function addLead(data: Omit<BuyLead, 'id' | 'timestamp' | 'status'>): BuyLead {
  const newLead: BuyLead = {
    id: `QR${Math.floor(100000000 + Math.random() * 900000000)}`,
    productName: data.productName,
    brandName: data.brandName || undefined,
    quantity: data.quantity,
    location: data.location,
    requirement: data.requirement,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  leadsStore.unshift(newLead);
  return newLead;
}
