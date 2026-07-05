export interface PMcat {
  id: string;
  name: string;
  icon: string;
}

export interface MCat {
  id: string;
  name: string;
  icon: string;
  pmcatId: string;
}

export interface BrandMCat {
  id: string;
  brandId: string;
  mcatId: string;
  name: string;
  tagline: string;
  description: string;
  applications: string[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string; // Tailwind icon class or placeholder abbreviation
  description: string;
  longDescription?: string;
  mcatId: string;
  subCategories: string[];
  rating: number;
  reviewsCount: number;
  buyersConnected: number;
  establishedYear: number;
  businessType: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  website?: string;
  headquarters: string;
  employees: string;
  annualTurnover?: string;
  verified: boolean;
  verifiedSince?: number;
  isOEM: boolean;
  certifications: string[];
  manufacturingUnits: number;
  countriesServed: number;
  topProducts: string[];
  features?: string[];
  catalogueUrl?: string;
  catalogueSizeMb?: number;
  catalogueUpdated?: string;
  // Quantified service breakdown (distinct from the single blended `rating`) — answers
  // three separate buyer questions: does the seller reply, is the product as described,
  // does delivery happen on time. Aggregated at brand level since per-review breakdowns
  // aren't tracked in this catalog.
  serviceMetrics: {
    responseRate: number; // % of enquiries that receive a reply
    qualityRate: number;  // % of buyers satisfied with product quality
    deliveryRate: number; // % of orders delivered on time
  };
}

export interface ServiceCenter {
  id: string;
  brandId: string;
  name: string;
  location: string;
  servicesOffered: string[];
  contactPhone: string;
  workingHours: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  mcatId: string;
  brandMCatId?: string;
  image: string;
  modelNumber: string;
  keySpecLabel: string;
  keySpecValue: string;
  priceRange: string;
  moq: string;
  deliveryTime: string;
  warranty: string;
  specifications: Record<string, string>;
  description: string;
  features: string[];
  useCases?: string[];
  certifications?: string[];
  certifiedBy?: string;
  certifiedYear?: number;
}

export interface Supplier {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  productId?: string;
  location: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  verified: boolean;
  isAuthorizedDealer: boolean;
  authorizedSince?: number;
  responseTime: string;
  // Distinct from responseTime: answers "does this seller reply at all", not just "how
  // fast" — a seller can be fast when they do respond but still reply rarely.
  responseRate: number;
  deliveryTimeRange: string;
  priceEstimate: string;
  contactPhone: string;
}

export interface AlternativeProduct {
  id: string;
  productId: string;
  brandName: string;
  modelNumber: string;
  mcatId: string;
  priceRange: string;
  keySpecLabel: string;
  keySpecValue: string;
}

export interface BuyLead {
  id: string;
  productName: string;
  brandName?: string;
  quantity: string;
  location: string;
  requirement: string;
  timestamp: string;
  status: 'pending' | 'connected' | 'completed';
}

export interface Review {
  id: string;
  brandId: string;
  productId?: string;
  userName: string;
  userRole: string;
  companyName: string;
  rating: number;
  comment: string;
  date: string;
}
