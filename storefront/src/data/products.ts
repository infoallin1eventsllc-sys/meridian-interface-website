import { Product, CartItem, EditorialCampaign } from '../types';

/** Photography lives in public/images/products and is resolved against Vite's
 *  base, so the store works at the domain root and under a sub-path alike. */
const img = (file: string) => `${import.meta.env.BASE_URL}images/products/${file}`;

export const PRODUCTS: Product[] = [
  {
    id: 'oversized-charcoal-hoodie',
    name: 'Oversized Charcoal Hoodie',
    category: 'Tops',
    price: 120,
    image: img('hoodie-charcoal.jpg'),
    additionalImages: [img('hoodie-charcoal-worn.jpg')],
    color: 'Charcoal',
    availableColors: ['Charcoal', 'Washed Black', 'Bone'],
    size: 'L',
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'A minimalist studio-crafted heavy cotton hoodie with an oversized silhouette, dropped shoulders, and tonal drawcord hardware.',
    details: [
      '100% 480GSM Heavyweight French Terry Cotton',
      'Drop-shoulder boxy drape with structured double-layer hood',
      'Flat woven drawcord with metal tipping',
      'Pre-shrunk vintage enzyme wash finish'
    ],
    isCurated: true,
    isNewArrival: true,
  },
  {
    id: 'utility-wide-leg-cargo',
    name: 'Utility Wide-Leg Cargo',
    category: 'Bottoms',
    price: 185,
    image: img('cargo.jpg'),
    color: 'Stone',
    availableColors: ['Stone', 'Olive', 'Onyx Black'],
    size: 'M',
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'Studio-shot wide-leg cargo trousers in stone. Flat layered architectural lines, multi-chamber 3D pockets and adjustable ankle cinch toggles.',
    details: [
      'Dense cotton ripstop weave',
      '6 3D bellowed pockets with concealed snap closures',
      'Articulated knee darts for unrestricted movement',
      'Bungee hem locks to transform between wide-leg and taper'
    ],
    isCurated: true,
    isNewArrival: false,
  },
  {
    id: 'tailored-joggers',
    name: 'Tailored Joggers',
    category: 'Bottoms',
    price: 145,
    image: img('joggers.jpg'),
    color: 'Steel Grey',
    availableColors: ['Steel Grey', 'Matte Black', 'Sand'],
    size: 'M',
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'Tailored jogger pants in a neutral, technical fabric. Clean architectural lines and premium construction designed for modern everyday mobility.',
    details: [
      'Double-knit technical compact scuba fleece',
      'Ergonomic angled leg panelling with reinforced seams',
      'Concealed water-resistant zip pockets',
      'Dense ribbed cuff with low-profile drawcord'
    ],
    isCurated: true,
    isNewArrival: false,
  },
  {
    id: 'tech-shell-jacket',
    name: 'Tech Shell Jacket',
    category: 'Outerwear',
    price: 210,
    image: img('shell-jacket.jpg'),
    color: 'Slate / Cobalt',
    availableColors: ['Slate / Cobalt', 'All-Black', 'Glacier'],
    size: 'L',
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'High-fashion structural windbreaker jacket featuring subtle electric blue detailing, high storm collar, and weather-defying 3-layer performance membrane.',
    details: [
      '3-Layer laminated waterproof / breathable technical nylon',
      'Electric blue contrast bonded seam tape details',
      'Two-way weather-sealed center zipper',
      'Fitted ergonomic hood with 3-point cinch adjustment'
    ],
    isCurated: true,
    isNewArrival: true,
  },
  {
    id: 'core-sneakers',
    name: 'Core Sneakers',
    category: 'Footwear',
    price: 180,
    image: img('sneakers.jpg'),
    color: 'Pure White',
    availableColors: ['Pure White', 'Triple Black', 'Monochrome / Cobalt'],
    size: '10',
    availableSizes: ['8', '9', '10', '11', '12'],
    description: 'Low-profile court sneakers in full white, with a moulded high-traction outsole and a clean unbranded upper.',
    details: [
      'Full-grain leather overlays paired with breathable mesh',
      'Sculpted dual-density EVA shock absorption midsole',
      'Moulded traction tread with torsion stabilizer',
      'Padded collar and moisture-wicking lining'
    ],
    isCurated: true,
    isNewArrival: true,
  },
  {
    id: 'oversized-hoodie-minimal',
    name: 'Oversized Hoodie',
    category: 'Tops',
    price: 120,
    image: img('hoodie-light.jpg'),
    color: 'Bone',
    availableColors: ['Bone', 'Washed Charcoal', 'Olive'],
    size: 'M',
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'Premium oversized hoodie in bone. Minimalist construction, heavyweight drape, and a double-layer hood that holds its shape.',
    details: [
      '100% Cotton French Terry 460GSM',
      'Kangaroo pocket with concealed interior stash pocket',
      'Dropped shoulder seam with reinforced coverstitching',
      'Ribbed cuffs and hem with spandex memory retention'
    ],
    isCurated: true,
    isNewArrival: false,
  }
];

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'oversized-charcoal-hoodie-Charcoal-L',
    productId: 'oversized-charcoal-hoodie',
    name: 'Oversized Charcoal Hoodie',
    price: 120,
    image: img('hoodie-charcoal.jpg'),
    color: 'Charcoal',
    size: 'L',
    quantity: 1,
  },
  {
    id: 'utility-wide-leg-cargo-Stone-M',
    productId: 'utility-wide-leg-cargo',
    name: 'Utility Wide-Leg Cargo',
    price: 185,
    image: img('cargo.jpg'),
    color: 'Stone',
    size: 'M',
    quantity: 1,
  },
];

export const EDITORIAL_CAMPAIGNS: EditorialCampaign[] = [
  {
    id: 'urban-core-2026',
    title: 'URBAN CORE 2026',
    subtitle: 'High-contrast stark architectural minimalism',
    season: 'Autumn / Winter 2026',
    tagline: 'Precision Cuts & Tactical Technicality',
    description: 'Dominating silhouettes framed by deep charcoal, pristine whites, and electric blue surgical highlights.',
    badge: 'Flagship Drop',
    themeColor: '#0448ff',
  },
  {
    id: 'cybernetic-futurism',
    title: 'CYBERNETIC FUTURISM',
    subtitle: 'Subterranean Neon & Modular Armor',
    season: 'Limited Capsule',
    tagline: 'Encrypted Wear for Neo-Metropolis',
    description: 'Technical gear engineered for damp concrete alleyways, luminous grids, and tactical utility systems.',
    badge: 'Limited Drop',
    themeColor: '#00d2ff',
  },
  {
    id: 'abstract-expressionism',
    title: 'ABSTRACT EXPRESSIONISM',
    subtitle: 'Urban Gestures & Hand-Painted Raw Drapes',
    season: 'Artisan Capsule',
    tagline: 'Every Garment an Original Canvas',
    description: 'Hand-swiped cobalt and bone pigment strokes applied to heavyweight raw loopback cotton.',
    badge: 'Artisan Run',
    themeColor: '#0448ff',
  },
  {
    id: 'limited-archive',
    title: 'LIMITED ARCHIVE',
    subtitle: 'Reissues From The Archive',
    season: 'Heritage Collection',
    tagline: 'Analogue 35mm Grain & Heavyweight Boxy Cuts',
    description: 'Earlier cuts brought back with weathered wash treatments and archival badges.',
    badge: 'Archive Vol. 4',
    themeColor: '#d4a373',
  },
];
