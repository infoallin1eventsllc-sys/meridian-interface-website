import { IMG } from '../assets/images';
import { SubMenuItem, MerchItem, StoreLocation, CateringPackage, PastOrder } from '../types';

export const LOGO_URL =
  IMG.logo;

export const PROFILE_URL =
  IMG.avatar;

export const SUB_MENU_ITEMS: SubMenuItem[] = [
  {
    id: 'sub-1',
    itemNumber: '#1',
    name: 'The #1 Big Sur Original Italian',
    category: 'cold',
    description:
      "Prosciutto, prosciuttini, ham, capicola, provolone. Served Big Boy's Way with onions, lettuce, tomatoes, red wine vinegar, olive oil blend & oregano spices.",
    regularPrice: 11.45,
    giantPrice: 16.95,
    miniPrice: 8.95,
    calRange: '680 - 1340 Cal',
    image:
      IMG.italian,
    badges: ['Customer Favorite', "Done The Big Boy Way"],
    dietary: ['gluten-free', 'high-protein'],
    isHero: true,
    popular: true,
  },
  {
    id: 'sub-3',
    itemNumber: '#3',
    name: 'The #3 Monterey Club Sub',
    category: 'cold',
    description:
      'Sliced turkey breast, smoked honey ham, crispy applewood bacon, Monterey Jack cheese, deli mayo.',
    regularPrice: 11.95,
    giantPrice: 17.50,
    miniPrice: 9.25,
    calRange: '720 - 1410 Cal',
    image:
      IMG.club,
    badges: ['Coastal Classic'],
    dietary: ['gluten-free', 'high-protein'],
    popular: true,
  },
  {
    id: 'sub-14',
    itemNumber: '#14',
    name: 'The #14 Carmel Seaside Veggie',
    category: 'cold',
    description:
      'Ripe Hass avocado, swiss & provolone cheeses, shaved English cucumbers, bell peppers, tomatoes, shredded lettuce, and sun-dried tomato spread.',
    regularPrice: 10.75,
    giantPrice: 15.75,
    miniPrice: 8.25,
    calRange: '520 - 1040 Cal',
    image:
      IMG.veggie,
    badges: ['Garden Fresh', 'Plant Forward'],
    dietary: ['vegetarian', 'gluten-free', 'under-600-cal'],
    popular: true,
  },
  {
    id: 'sub-8',
    itemNumber: '#8',
    name: 'The #8 Tuna Fish Delight',
    category: 'cold',
    description:
      'Freshly chopped celery, light mayo, secret herbs, albacore tuna, crisp pickles and provolone.',
    regularPrice: 10.95,
    giantPrice: 15.95,
    miniPrice: 8.45,
    calRange: '580 - 1160 Cal',
    image:
      IMG.tuna,
    badges: ['Ocean Fresh Catch'],
    dietary: ['gluten-free', 'high-protein', 'under-600-cal'],
    popular: false,
  },
  {
    id: 'sub-7',
    itemNumber: '#7',
    name: 'Cannery Row Roast Beef',
    category: 'cold',
    description:
      'Certified Angus top round slow-roasted in-house daily. Sliced ultra-thin with mild Wisconsin provolone, horseradish drizzle.',
    regularPrice: 14.50,
    giantPrice: 19.95,
    miniPrice: 10.95,
    calRange: '780 - 1540 Cal',
    image:
      IMG.roastbeef,
    badges: ['Roasted In-House'],
    dietary: ['gluten-free', 'high-protein'],
    popular: true,
  },
  {
    id: 'sub-56',
    itemNumber: '#56',
    name: 'The #56 Big Boy Cheesesteak',
    category: 'hot',
    description:
      'Shaved USDA Choice ribeye grilled fresh with sweet white onions, bell peppers, and bubbling melted white American cheese.',
    regularPrice: 12.45,
    giantPrice: 17.95,
    miniPrice: 9.75,
    calRange: '780 - 1560 Cal',
    image:
      IMG.cheesesteak,
    badges: ['Hot & Sizzling'],
    dietary: ['high-protein'],
    isHero: true,
    popular: true,
  },
  {
    id: 'sub-44',
    itemNumber: '#44',
    name: 'The #44 Buffalo Chicken & Bacon',
    category: 'hot',
    description:
      "Tender grilled chicken breast tossed in spicy Frank's buffalo sauce, applewood bacon, melted pepper jack, house buttermilk ranch.",
    regularPrice: 12.25,
    giantPrice: 17.45,
    miniPrice: 9.50,
    calRange: '790 - 1580 Cal',
    image:
      IMG.buffalo,
    badges: ['Griddled Fresh', 'Spicy Kick'],
    dietary: ['high-protein'],
    popular: true,
  },
  {
    id: 'side-1',
    name: 'Dirty Potato Chips',
    category: 'sides',
    description: 'Sea Salt, Jalapeño, or Maui Onion kettle chips.',
    regularPrice: 2.50,
    giantPrice: 2.50,
    miniPrice: 2.50,
    calRange: '210 Cal',
    image: '',
    badges: ['Crunchy Pairing'],
    dietary: ['vegetarian', 'gluten-free'],
  },
  {
    id: 'side-2',
    name: 'Chocolate Chunk Deli Cookie',
    category: 'sides',
    description: 'Fresh baked warm every morning with Valrhona dark chocolate chunks.',
    regularPrice: 2.25,
    giantPrice: 2.25,
    miniPrice: 2.25,
    calRange: '320 Cal',
    image: '',
    badges: ['Baked Daily'],
    dietary: ['vegetarian'],
  },
  {
    id: 'side-3',
    name: 'Monterey Bay Fountain Soda',
    category: 'sides',
    description: '24oz ice-cold selection of craft and vintage sodas.',
    regularPrice: 2.95,
    giantPrice: 2.95,
    miniPrice: 2.95,
    calRange: '0 - 240 Cal',
    image: '',
    badges: ['Ice Cold'],
    dietary: ['vegetarian', 'gluten-free'],
  },
];

export const MERCH_ITEMS: MerchItem[] = [
  {
    id: 'merch-1',
    variationLabel: 'VARIATION 01 • SURF VINTAGE',
    title: "The '78 Sun-Faded Surf Tee",
    price: 34.00,
    category: 'surf',
    description:
      "Inspired by vintage 1970s California surf culture and sunny afternoons at Lover's Point. Featuring a weathered, sun-drenched print of our giant sandwich crest on sun-faded off-white heavyweight cotton.",
    image:
      IMG.tee2,
    badges: ['Distressed Screenprint', '100% Ring-Spun Cotton', 'Washed Cream'],
    specs: {
      label1: 'Weight',
      val1: '6.5 oz Combed',
      label2: 'Finish',
      val2: 'Vintage Washed',
      label3: 'Fit',
      val3: 'Pre-Shrunk Boxy',
    },
  },
  {
    id: 'merch-2',
    variationLabel: 'VARIATION 02 • MODERN MINIMALIST',
    title: 'The Alvarado Street Pocket Tee',
    price: 38.00,
    category: 'minimalist',
    description:
      'An understated streetwear aesthetic crafted for effortless coastal style. Features a 1.75-inch woven embroidery micro patch of the Big Boy Subs emblem nestled on a reinforced left chest pocket.',
    image:
      IMG.tee1,
    badges: ['Embroidered Micro Patch', 'Heavyweight Boxy Cut', 'Midnight Slate Navy'],
    specs: {
      label1: 'Weight',
      val1: '7.5 oz Luxury',
      label2: 'Stitch',
      val2: 'Blind-Stitched',
      label3: 'Shoulder',
      val3: 'Clean Drop',
    },
  },
  {
    id: 'merch-3',
    variationLabel: 'VARIATION 03 • COASTAL GRAPHIC',
    title: 'The Pacific Coast Cypress Tee',
    price: 36.00,
    category: 'graphic',
    description:
      'A bold homage to the rugged Monterey Peninsula. Features vibrant retro graphic typography, coastal surf breaks, and the silhouette of iconic Monterey Cypress trees framing our legendary sub emblem.',
    image:
      IMG.tee2,
    badges: ['Full Back Artwork', 'Monterey Cypress & Waves', 'Vintage Black'],
    specs: {
      label1: 'Print Style',
      val1: 'Zero-Hand Water',
      label2: 'Dye',
      val2: 'Garment Dyed',
      label3: 'Cut',
      val3: 'Relaxed Fit',
    },
  },
  {
    id: 'merch-4',
    variationLabel: 'OFFICIAL MERCHANDISE • COASTAL HEAVYWEIGHT',
    title: 'Alvarado Fog Pullover Hoodie',
    price: 78.00,
    category: 'hoodie',
    description:
      'Crafted for chilly Monterey mornings and breezy sunsets at Lovers Point. 450 GSM custom-milled loopback French terry featuring our signature distressed Big Boy Subs circular sandwich emblem.',
    image:
      IMG.hoodie,
    badges: ['Vintage Screenprint', '450 GSM Fleece', 'Pre-Shrunk Fit'],
    specs: {
      label1: 'Fabric',
      val1: '450 GSM French Terry',
      label2: 'Finish',
      val2: 'Mineral Enzyme',
      label3: 'Fit',
      val3: 'Relaxed Boxy Drop',
    },
    detailsSnippet:
      'Crafted with antique nickel eyelets, natural braided cream drawcords, double-needle coverstitching, and a deep fleece kangaroo pouch equipped with a concealed internal phone sleeve.',
  },
];

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'loc-alvarado',
    name: 'Monterey — Alvarado St',
    shortName: 'Monterey (Alvarado St)',
    address: '482 Alvarado St',
    cityStateZip: 'Monterey, CA 93940',
    phone: '(831) 649-7827',
    distance: '0.4 miles away',
    hours: '10:00 AM – 10:00 PM Daily',
    statusText: 'Open Now • Closes 10 PM',
    isOpen: true,
    isFlagship: true,
    tags: ['Patio Dining', 'Curbside', 'Delivery', 'Local Brews'],
    patioNote:
      'Outdoor seaside patio seating under vintage striped umbrellas. Catch the Monterey bay breeze with your grinder!',
    image:
      IMG.patio,
    coordinates: {
      lat: 36.598,
      lng: -121.895,
    },
  },
  {
    id: 'loc-pg',
    name: 'Pacific Grove',
    shortName: 'Pacific Grove',
    address: '542 Lighthouse Ave',
    cityStateZip: 'Pacific Grove, CA 93950',
    phone: '(831) 372-SUBS',
    distance: '1.8 mi away',
    hours: '10:30 AM – 9:00 PM Daily',
    statusText: 'Open Now • Closes 9 PM',
    isOpen: true,
    isFlagship: false,
    tags: ['Pickup Window', 'Picnic Boxes', 'Bike Parking'],
    patioNote: 'Right near Lover’s Point Park — order ahead and pick up for your seaside coastal picnic.',
    image:
      IMG.terrace,
    coordinates: {
      lat: 36.618,
      lng: -121.917,
    },
  },
  {
    id: 'loc-carmel',
    name: 'Carmel-by-the-Sea',
    shortName: 'Carmel-by-the-Sea',
    address: 'Ocean Ave & Mission St',
    cityStateZip: 'Carmel, CA 93921',
    phone: '(831) 624-SUBS',
    distance: '4.2 mi away',
    hours: '10:30 AM – 9:30 PM Daily',
    statusText: 'Open Now • Closes 9:30 PM',
    isOpen: true,
    isFlagship: false,
    tags: ['Beach Picnic Packs', 'Wine Pairings', 'Walk-Up'],
    patioNote: 'Crafted for sunset watchers walking down to Carmel Beach white sands.',
    image:
      IMG.carmel,
    coordinates: {
      lat: 36.555,
      lng: -121.923,
    },
  },
];

export const MAP_PREVIEW_IMAGE =
  IMG.loverspoint;

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'cat-cannery',
    title: 'The Cannery Row Giant Platter',
    servesText: 'Serves 10 – 12 guests',
    minGuests: 10,
    price: 89.00,
    description:
      '5 Giant 14" subs cut into 20 individually wrapped party portions. Includes The #1 Italian, #3 Club, Cannery Roast Beef, and #14 Seaside Veggie.',
    includes: ['20 Portion Cuts', 'Butcher Wrapped', 'Condiments on Side', 'Deli Pepper Spears'],
    popular: true,
  },
  {
    id: 'cat-beach-crate',
    title: 'Lovers Point Beach Picnic Crate',
    servesText: 'Serves 6 – 8 beachgoers',
    minGuests: 6,
    price: 68.00,
    description:
      '3 Giant 14" subs cut into 12 portions, packed in a rustic nautical picnic crate with 6 bags of Dirty Chips, 6 ice cold beverages, and 6 Valrhona cookies.',
    includes: ['3 Giant Subs (12 Cuts)', '6 Dirty Kettle Chips', '6 Bottled Beverages', '6 Warm Valrhona Cookies'],
    popular: true,
  },
  {
    id: 'cat-box-lunch',
    title: 'Monterey Aquarium Box Lunch Suite',
    servesText: 'Individual boxed meals (Min. 8 boxes)',
    minGuests: 8,
    price: 15.50,
    description:
      'Custom boxed lunch per person: choice of 7" Mini Sub, side of Dirty Chips, house chocolate chunk cookie, deli mint, and moist towelette.',
    includes: ['Individual Named Boxes', 'Choice of 7" Sub', 'Kettle Chips & Cookie', 'Eco-friendly Utensils'],
    popular: false,
  },
];

export const INITIAL_PAST_ORDERS: PastOrder[] = [
  {
    id: 'order-past-1',
    orderNumber: 428,
    date: 'Sep 2, 2026',
    fulfillment: 'pickup',
    locationName: 'Monterey — Alvarado St',
    items: [
      {
        id: 'p1',
        type: 'sub',
        productId: 'sub-1',
        name: 'The #1 Big Sur Original Italian',
        image:
          IMG.platter,
        price: 11.45,
        quantity: 1,
        sizeLabel: 'regular',
        customization: {
          size: 'regular',
          bread: 'Italian Crusty Baguette',
          cheese: 'Aged Provolone',
          isTheWorks: true,
          selectedToppings: ['Shaved Sweet Onions', 'Crisp Iceberg Lettuce', 'Ripe Roma Tomatoes', 'Red Wine Vinegar & Olive Oil ("The Juice")', 'Oregano & Deli Spices'],
          extraCondiments: [],
          cutPreference: 'Cut in Half',
        },
      },
      {
        id: 'p2',
        type: 'side',
        productId: 'side-1',
        name: 'Dirty Potato Chips',
        image: '',
        price: 2.50,
        quantity: 1,
      },
    ],
    total: 15.17,
  },
  {
    id: 'order-past-2',
    orderNumber: 382,
    date: 'Aug 26, 2026',
    fulfillment: 'delivery',
    locationName: 'Pacific Grove',
    items: [
      {
        id: 'p3',
        type: 'sub',
        productId: 'sub-56',
        name: 'The #56 Big Boy Cheesesteak',
        image:
          IMG.cheesesteak,
        price: 12.45,
        quantity: 1,
        sizeLabel: 'regular',
        customization: {
          size: 'regular',
          bread: 'Italian Crusty Baguette',
          cheese: 'White American',
          isTheWorks: false,
          selectedToppings: ['Shaved Sweet Onions'],
          extraCondiments: [],
          cutPreference: 'Cut in Half',
        },
      },
    ],
    total: 19.34,
  },
];
