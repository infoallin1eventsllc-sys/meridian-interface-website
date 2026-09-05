export type TabType = 'home' | 'menu' | 'locations' | 'merch' | 'my-bag';

export type SubSize = 'mini' | 'regular' | 'giant';

export type DietaryType = 'vegetarian' | 'gluten-free' | 'high-protein' | 'under-600-cal';

export interface SubMenuItem {
  id: string;
  itemNumber?: string;
  name: string;
  category: 'cold' | 'hot' | 'sides';
  description: string;
  regularPrice: number;
  giantPrice: number;
  miniPrice: number;
  calRange: string;
  image: string;
  badges?: string[];
  dietary?: DietaryType[];
  isHero?: boolean;
  popular?: boolean;
}

export interface MerchItem {
  id: string;
  variationLabel: string;
  title: string;
  price: number;
  category: 'surf' | 'minimalist' | 'graphic' | 'hoodie';
  description: string;
  image: string;
  badges: string[];
  specs: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
  };
  detailsSnippet?: string;
}

export interface CartCustomization {
  size: SubSize;
  bread: string;
  cheese: string;
  isTheWorks: boolean;
  selectedToppings: string[];
  extraCondiments: string[];
  cutPreference: string;
  specialInstructions?: string;
  isCombo?: boolean;
}

export interface CartItem {
  id: string;
  type: 'sub' | 'merch' | 'side' | 'catering';
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sizeLabel?: string;
  customization?: CartCustomization;
  merchSize?: string;
  cateringDetails?: {
    headcount: number;
    subChoices: string[];
    packageType: string;
  };
}

export interface StoreLocation {
  id: string;
  name: string;
  shortName: string;
  address: string;
  cityStateZip: string;
  phone: string;
  distance: string;
  hours: string;
  statusText: string;
  isOpen: boolean;
  isFlagship?: boolean;
  tags: string[];
  patioNote: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type OrderStage = 'received' | 'slicing' | 'wrapped' | 'ready';

export interface ActiveOrder {
  orderNumber: number;
  createdAt: string;
  estimatedPickupTime: string;
  estimatedMinutes: number;
  stage: OrderStage;
  fulfillment: 'pickup' | 'delivery';
  location: StoreLocation;
  deliveryBeach?: string;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  tax: number;
  tip: number;
  totalPaid: number;
  paymentMethod: 'apple_pay' | 'google_pay' | 'card' | 'counter';
  scheduledTime: string;
}

export interface PastOrder {
  id: string;
  orderNumber: number;
  date: string;
  fulfillment: 'pickup' | 'delivery';
  locationName: string;
  items: CartItem[];
  total: number;
}

export interface CateringPackage {
  id: string;
  title: string;
  servesText: string;
  minGuests: number;
  price: number;
  description: string;
  includes: string[];
  popular?: boolean;
}
