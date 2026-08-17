export type SubstrateCondition = 
  | 'concrete_new' 
  | 'concrete_cracked' 
  | 'old_paint' 
  | 'existing_tiles';

export type SystemType = 
  | 'basic_seal' 
  | 'high_gloss' 
  | 'metallic_3d' 
  | 'granite_flakes' 
  | 'anti_slip';

export type LocationType = 'indoor' | 'outdoor';

export type USState = 'NY' | 'NJ' | 'PA' | 'CT' | 'DE' | 'RI' | 'Other';

export interface FlooringSystem {
  id: SystemType;
  name: string;
  nameEn?: string;
  tagline: string;
  taglineEn?: string;
  description: string;
  descriptionEn?: string;
  basePricePerSqFt: number;
  thicknessMm: string;
  cureTimeHours: number;
  psiStrength: number;
  chemicalResistance: string;
  uvProtection: boolean;
  warrantyYears: number;
  image: string;
  popularFor: string[];
  features: string[];
  availableColors: { name: string; hex: string }[];
}

export interface SubstrateOption {
  id: SubstrateCondition;
  name: string;
  nameEn?: string;
  prepDescription: string;
  prepDescriptionEn?: string;
  extraPrepCostPerSqFt: number;
  badge: string;
  badgeEn?: string;
  iconName: string;
}

export interface QuoteData {
  squareFeet: number;
  substrate: SubstrateCondition;
  system: SystemType;
  location: LocationType;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  streetAddress?: string;
  state: USState;
  zipCode: string;
  city: string;
  projectNotes?: string;
}

export interface QuoteBreakdown {
  grossBaseCost: number;
  volumeDiscountPercent: number;
  volumeDiscountAmount: number;
  baseSystemCost: number;
  substratePrepCost: number;
  substratePrepDiscountApplied: boolean;
  locationFactorCost: number;
  subtotal: number;
  estimatedTax: number;
  totalCost: number;
  costPerSqFt: number;
  estimatedDays: number;
}

export interface VisualizerPreset {
  id: string;
  title: string;
  category: 'garaje' | 'residencial' | 'industrial' | 'comercial';
  originalImage: string;
  afterImage: string;
  colorName: string;
  systemId: SystemType;
}

export interface BlogPost {
  id: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  category: string;
  categoryEn?: string;
  readTime: string;
  readTimeEn?: string;
  date: string;
  author: string;
  authorEn?: string;
  image: string;
  content: string[];
  contentEn?: string[];
}

export interface GalleryProject {
  id: string;
  title: string;
  location: string;
  areaSqFt: number;
  systemName: string;
  beforeImage: string;
  afterImage: string;
  specularGloss: number; // percentage
  tags: string[];
}
