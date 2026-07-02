export interface Brand {
  id: string;
  name: string;
  logo: string; // Tailwind icon class or placeholder abbreviation
  description: string;
  longDescription?: string;
  category: string;
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
  certifications: string[];
  manufacturingUnits: number;
  countriesServed: number;
  topProducts: string[];
  features?: string[];
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  category: string;
  image: string;
  priceRange: string;
  moq: string;
  deliveryTime: string;
  warranty: string;
  specifications: Record<string, string>;
  description: string;
  features: string[];
}

export interface Supplier {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  location: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  verified: boolean;
  responseTime: string;
  deliveryTimeRange: string;
  priceEstimate: string;
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
  userName: string;
  userRole: string;
  companyName: string;
  rating: number;
  comment: string;
  date: string;
}
