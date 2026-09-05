export interface Product {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories';
  price: number;
  originalPrice?: number;
  image: string;
  additionalImages?: string[];
  color: string;
  availableColors: string[];
  size: string;
  availableSizes: string[];
  description: string;
  details: string[];
  isCurated?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem {
  id: string; // unique cart line id (e.g. `${productId}-${color}-${size}`)
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export interface EditorialCampaign {
  id: string;
  title: string;
  subtitle: string;
  season: string;
  tagline: string;
  description: string;
  badge?: string;
  themeColor?: string;
}

export type ActiveScreen = 'home' | 'cart' | 'new-arrivals' | 'collections' | 'about';
