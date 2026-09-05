export interface CoffeeRoast {
  id: string;
  name: string;
  roastLevel: 'Light' | 'Medium' | 'Dark';
  category: string;
  price: number;
  origin: string;
  elevation: string;
  process: string;
  score?: number;
  description: string;
  notes: string[];
  image: string;
  badge?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'espresso' | 'signatures' | 'bakery' | 'pourover';
  price: number;
  description: string;
  tags: string[];
  image?: string;
  featuredBadge?: string;
  details?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  grind?: string;
  quantity: number;
  image?: string;
  isBean?: boolean;
  isSubscription?: boolean;
  frequency?: string;
}

export interface BrewStep {
  timeSec: number;
  label: string;
  waterTarget: number; // in grams
  instruction: string;
}

export interface BrewGuide {
  id: string;
  name: string;
  iconName: string;
  defaultRatio: number; // 1:x ratio
  defaultCoffeeGrams: number;
  grindRecommendation: string;
  waterTemp: string;
  totalTimeSec: number;
  tagline: string;
  description: string;
  matchedRoastId: string;
  steps: BrewStep[];
}

export interface CuppingBooking {
  name: string;
  email: string;
  date: string;
  guests: number;
  notes?: string;
}
