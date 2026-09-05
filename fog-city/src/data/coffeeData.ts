import { CoffeeRoast, MenuItem, BrewGuide } from '../types';
import heroImage from '../assets/images/hero_coffee_promo_1788583641290.jpg';
import latteArtImage from '../assets/images/latte_art_vibrant_1788583655722.jpg';
import beansMacroImage from '../assets/images/coffee_beans_macro_1788583672502.jpg';
import icedCraftImage from '../assets/images/iced_signature_craft_1788583687944.jpg';
import marketingCompositeImage from '../assets/images/marketing_composite_1788626131904.jpg';

import logoImage from '../assets/images/logo.svg';
import avatarImage from '../assets/images/avatar.svg';

export const ASSETS = {
  logo: logoImage,
  profile: avatarImage,
  cafeInterior: heroImage,
  baristaPour: latteArtImage,
  cortado: icedCraftImage,
  caramelLatte: latteArtImage,
  morningBun: beansMacroImage,
  russianHillShop: marketingCompositeImage,
  rossiFamily: beansMacroImage,
  map: marketingCompositeImage,
  // High-res vibrant generated promotional photographs:
  heroPromo: heroImage,
  latteArtVibrant: latteArtImage,
  beansMacro: beansMacroImage,
  icedCraft: icedCraftImage,
  marketingComposite: marketingCompositeImage,
};

export const TODAY_ROASTS: CoffeeRoast[] = [
  {
    id: 'twin-peaks-dark',
    name: 'Twin Peaks Dark Blend',
    roastLevel: 'Dark',
    category: 'Heritage Blend',
    price: 22,
    origin: 'Oaxaca, Mexico & Sumatra Mandheling',
    elevation: '1,950m',
    process: 'Wet Hulled & Washed',
    description: 'Heavy-bodied, smoky-sweet profile crafted specifically to break through thick Pacific maritime fog. Sourced from high-elevation cloud forests.',
    notes: ['Dark Chocolate', 'Cedar Smoke', 'Dried Black Fig'],
    image: beansMacroImage,
    badge: 'Flagship Dark',
  },
  {
    id: 'sutro-fog-light',
    name: 'Sutro Fog Light Roast',
    roastLevel: 'Light',
    category: 'Micro-Lot',
    price: 24,
    origin: 'Yirgacheffe, Gedeo Zone, Ethiopia',
    elevation: '2,100m',
    process: 'Washed Heirloom',
    score: 91,
    description: 'Delicate, floral, and bright washed heirloom Ethiopian beans, roasted gently to preserve the aromatic tea-like finish and delicate citrus blossom.',
    notes: ['Bergamot Blossom', 'Golden Plum', 'Wild Honeycomb'],
    image: heroImage,
    badge: '91 Pts Specialty',
  },
  {
    id: 'mission-sunrise-medium',
    name: 'Mission Sunrise Medium',
    roastLevel: 'Medium',
    category: 'Single Origin',
    price: 21,
    origin: 'Huehuetenango, Guatemala',
    elevation: '1,800m',
    process: 'Fully Washed Sun-Dried',
    score: 89,
    description: 'Smooth caramel sweetness balanced with sparkling crisp red apple acidity and roasted hazelnut warmth for an effortless morning cup.',
    notes: ['Brown Sugar Butter', 'Toasted Pecan', 'Red Crisp Apple'],
    image: beansMacroImage,
    badge: 'Barista Favorite',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // Espresso & Classics
  {
    id: 'karls-cortado',
    name: "Karl's Cortado",
    category: 'espresso',
    price: 4.75,
    description: 'Equal parts double espresso and textured Minor Figures oat milk with a subtle pinch of freshly ground organic cardamom.',
    tags: ['Spiced', 'Double Shot', 'Minor Figures Oat'],
    image: ASSETS.cortado,
    featuredBadge: 'Signature Classic',
    details: '4.5oz • 1:1 ratio • pulled at 9 bars',
  },
  {
    id: 'victorian-cappuccino',
    name: 'Victorian Cappuccino',
    category: 'espresso',
    price: 5.25,
    description: 'Dense velvet microfoam, double ristretto extraction, delicately dusted with pure French Valrhona cocoa.',
    tags: ['Classic', 'Ristretto', 'Valrhona Cocoa'],
    details: '6oz Cup • Rich Chocolate & Molasses Undertones',
  },
  {
    id: 'pacific-heights-flat-white',
    name: 'Pacific Heights Flat White',
    category: 'espresso',
    price: 5.00,
    description: 'Sweet whole milk microfoam layered seamlessly over Ethiopian Yirgacheffe single-origin espresso.',
    tags: ['Straus Organic', 'Stone Fruit & Bergamot'],
    details: '5oz • Silky Texture',
  },
  {
    id: 'slow-pourover-bar',
    name: 'Slow Pour-Over Bar',
    category: 'pourover',
    price: 6.00,
    description: 'Rotating single-origin selections prepared manually by our lead baristas on ceramic Hario V60 drippers.',
    tags: ['Guatemala Antigua', 'Kenya AA', 'Colombia Geisha (+2)'],
    image: heroImage,
    details: 'Brewed to order • 3.5 min precise bloom',
  },

  // House Signatures
  {
    id: 'foggy-sea-salt-caramel-latte',
    name: 'Foggy Sea Salt Caramel Latte',
    category: 'signatures',
    price: 6.50,
    description: 'Housemade browned butter caramel, hand-flaked Maldon sea salt, double espresso, and creamy textured milk.',
    tags: ['Local Favorite', '#1 Ordered', 'Hot or Iced'],
    image: icedCraftImage,
    featuredBadge: 'Local Favorite',
    details: 'Made with organic brown butter and Tahitian vanilla',
  },
  {
    id: 'bay-mist-cascara-tonic',
    name: 'Bay Mist Cascara Tonic',
    category: 'signatures',
    price: 5.75,
    description: 'Sparkling mineral water, sun-dried coffee cherry syrup, and Meyer lemon peel over clear hand-carved ice cubes.',
    tags: ['Botanical', 'Low Caffeine', 'Effervescent'],
    details: 'Crisp Citrus • Rose Hip • Refreshing',
  },
  {
    id: 'mission-spiced-mocha',
    name: 'Mission Spiced Mocha',
    category: 'signatures',
    price: 6.75,
    description: 'Local SF TCHO 70% dark chocolate melted slowly with guajillo chili, Ceylon cinnamon, and double espresso.',
    tags: ['Local SF TCHO Chocolate', 'Subtle Warm Kick'],
    details: 'Handcrafted chocolate ganache base',
  },

  // Morning Bakery & Toast
  {
    id: 'cardamom-morning-bun',
    name: 'Cardamom Morning Bun',
    category: 'bakery',
    price: 5.50,
    description: 'Caramelized laminated pastry dough dusted in glistening citrus zest and freshly stone-ground green cardamom sugar.',
    tags: ['Warm From Oven', 'Laminated Pastry'],
    image: ASSETS.morningBun,
    featuredBadge: 'Baked 6:00 AM Daily',
    details: 'House sourdough laminated dough',
  },
  {
    id: 'sf-sourdough-toast',
    name: 'SF Sourdough Toast & Cultured Butter',
    category: 'bakery',
    price: 7.50,
    description: 'Thick slice of 36-hour slow-fermented country levain toasted crisp, served with Point Reyes cultured sea salt butter & seasonal fig jam.',
    tags: ['36-hr Fermentation Levain', 'Point Reyes Butter'],
    details: 'Heirloom whole wheat & sea salt',
  },
  {
    id: 'almond-croissant',
    name: 'Twice-Baked Almond Croissant',
    category: 'bakery',
    price: 6.00,
    description: 'Golden croissant soaked in vanilla bean syrup, stuffed with rich almond frangipane, topped with toasted flaked almonds.',
    tags: ['Frangipane', 'Toasted Almonds'],
    details: 'Traditional Parisian method',
  },
];

export const PRESS_QUOTES = [
  {
    quote: 'The most atmospheric corner in the city to watch Karl the Fog roll past.',
    source: 'The San Francisco Chronicle',
    sub: 'Food & Wine Review',
  },
  {
    quote: 'My daily stop before boarding the Powell-Hyde cable car. The cardamom sourdough bun paired with the Twin Peaks roast is unbeatable.',
    source: 'Elena M.',
    sub: 'Pacific Heights Resident • 12 Years Regular',
  },
  {
    quote: 'The lever-pull espresso has a velvety crema texture you cannot find at modern push-button shops. Real coffee culture lives here.',
    source: 'Marcus T.',
    sub: 'North Beach Coffee Guild',
  },
];

export const STORY_TIMELINE = [
  {
    year: '2013',
    title: 'Russian Hill Inception',
    description: 'Giancarlo Rossi signs the lease at 1420 Vallejo. The vintage 12-lb cast iron drum roaster arrives by freight rail from Chicago.',
  },
  {
    year: '1998',
    title: 'First Direct-Trade Harvest',
    description: 'We bypass commodity brokers to handshake directly with Finca Santa Teresa in Oaxaca, founding our direct trade transparency legacy.',
  },
  {
    year: '2012',
    title: 'Second Generation Stewardship',
    description: 'Siblings Marco and Elena Rossi introduce specialty micro-lot cuppings while preserving the analog Victorian café sanctuary.',
  },
  {
    year: 'Today',
    title: 'Forty Years of Heritage Roasting',
    description: 'Serving third-generation regulars, neighbourhood dogs with biscuit jars, and coffee travellers searching for authentic San Francisco warmth.',
  },
];

export const BREW_GUIDES: BrewGuide[] = [
  {
    id: 'hario-v60',
    name: 'Hario V60 Pour-Over',
    iconName: 'Droplet',
    defaultRatio: 16, // 1:16
    defaultCoffeeGrams: 20,
    grindRecommendation: 'Medium-Fine (Granulated sugar)',
    waterTemp: '200°F – 204°F (93°C – 95°C)',
    totalTimeSec: 180, // 3:00 min
    tagline: 'Delicate florality, crisp stone-fruit acidity, and ultra-clean clarity',
    description: 'The conical 60-degree ribbed dripper emphasizes high extraction dynamics and bright single-origin character, ideal for Pacific coast mornings.',
    matchedRoastId: 'sutro-fog-light',
    steps: [
      {
        timeSec: 45,
        label: 'The Bloom',
        waterTarget: 50,
        instruction: 'Pour 50g of water in gentle circular motions to saturate the bed. Allow fresh CO₂ to expand and degas for 45 seconds.',
      },
      {
        timeSec: 90,
        label: 'First Continuous Spiral',
        waterTarget: 180,
        instruction: 'Pour gently starting from center spiral outward, avoiding the filter paper edge. Maintain steady stream height.',
      },
      {
        timeSec: 135,
        label: 'Final Target Pour',
        waterTarget: 320,
        instruction: 'Pour down the center with controlled velocity to reach final water target. Give the V60 one gentle stir.',
      },
      {
        timeSec: 180,
        label: 'Even Drawdown',
        waterTarget: 320,
        instruction: 'Allow coffee bed to settle flat. Decant into pre-warmed ceramic mug and inhale the blossoming jasmine aroma.',
      },
    ],
  },
  {
    id: 'chemex',
    name: 'Chemex Classic 6-Cup',
    iconName: 'Coffee',
    defaultRatio: 15, // 1:15
    defaultCoffeeGrams: 30,
    grindRecommendation: 'Medium-Coarse (Kosher sea salt)',
    waterTemp: '202°F – 205°F (94°C – 96°C)',
    totalTimeSec: 240, // 4:00 min
    tagline: 'Lustrous, heavy mouthfeel with completely suspended sediment filtration',
    description: 'Bonded three-ply paper filters remove all caustic oils while preserving deep honey-caramel body. Perfect for Sunday family breakfast.',
    matchedRoastId: 'mission-sunrise-medium',
    steps: [
      {
        timeSec: 45,
        label: 'Pre-Wet & Bloom',
        waterTarget: 80,
        instruction: 'Wet grounds completely with 80g water. Observe the crust rising like fresh bread in the glass neck.',
      },
      {
        timeSec: 120,
        label: 'First Heavy Pour',
        waterTarget: 260,
        instruction: 'Pour in steady spirals, keeping the slurry level below 0.5 inches from the top rim.',
      },
      {
        timeSec: 180,
        label: 'Second Lift Pour',
        waterTarget: 450,
        instruction: 'Top up in concentric circles to reach 450g water. Swirl the Chemex collar gently once.',
      },
      {
        timeSec: 240,
        label: 'Clear Bed Settle',
        waterTarget: 450,
        instruction: 'Lift out the bonded cone. Swirl the amber elixir in the glass carafe to aerate before pouring.',
      },
    ],
  },
  {
    id: 'french-press',
    name: 'Immersion French Press',
    iconName: 'Clock',
    defaultRatio: 14, // 1:14
    defaultCoffeeGrams: 35,
    grindRecommendation: 'Coarse (Sea salt flakes)',
    waterTemp: '205°F (96°C)',
    totalTimeSec: 270, // 4:30 min
    tagline: 'Unfiltered, rich, full-bodied with notes of baker’s chocolate & roasted pecan',
    description: 'Complete immersion extracts heavy coffee lipids and essential oils, producing the definitive historic San Francisco café cup.',
    matchedRoastId: 'twin-peaks-dark',
    steps: [
      {
        timeSec: 60,
        label: 'Initial Immersion',
        waterTarget: 490,
        instruction: 'Pour all 490g hot water vigorously over coarse grounds. Place the lid on top without plunging.',
      },
      {
        timeSec: 240,
        label: 'Break Crust & Scoop',
        waterTarget: 490,
        instruction: 'At 4:00, use two spoons to break the floating crust. Scoop away the top foam and chaff.',
      },
      {
        timeSec: 270,
        label: 'Slow Smooth Plunge',
        waterTarget: 490,
        instruction: 'Lower the metal mesh filter with gentle hand pressure. Decant immediately to halt over-extraction.',
      },
    ],
  },
  {
    id: 'aeropress',
    name: 'AeroPress Inverted',
    iconName: 'Compass',
    defaultRatio: 12, // 1:12
    defaultCoffeeGrams: 18,
    grindRecommendation: 'Fine-Medium (Fine table sand)',
    waterTemp: '190°F (88°C)',
    totalTimeSec: 120, // 2:00 min
    tagline: 'Espresso-like concentration, silky sweetness, and zero bitterness',
    description: 'Inverted pneumatic plunge delivers sweet stone fruit and dense milk chocolate syrup notes in under two minutes.',
    matchedRoastId: 'mission-sunrise-medium',
    steps: [
      {
        timeSec: 30,
        label: 'Inverted Fill & Stir',
        waterTarget: 100,
        instruction: 'Set AeroPress upside-down. Add grounds and 100g water. Stir 10 times in a paddle motion.',
      },
      {
        timeSec: 60,
        label: 'Fill to Brim',
        waterTarget: 216,
        instruction: 'Add remaining water to 216g. Fasten the pre-rinsed paper filter cap securely.',
      },
      {
        timeSec: 90,
        label: 'Careful Flip',
        waterTarget: 216,
        instruction: 'Invert onto your server with confident grip.',
      },
      {
        timeSec: 120,
        label: 'Gentle Press',
        waterTarget: 216,
        instruction: 'Depress plunger over 30 seconds until the first soft hiss of air. Sip straight or dilute with hot water.',
      },
    ],
  },
  {
    id: 'cold-brew',
    name: 'Pacific Fog Cold Toddy',
    iconName: 'Wind',
    defaultRatio: 8, // 1:8
    defaultCoffeeGrams: 60,
    grindRecommendation: 'Extra-Coarse (Cracked peppercorns)',
    waterTemp: 'Room Temp / Chilled (60°F – 68°F)',
    totalTimeSec: 360, // visual demo with 16hr brew instructions
    tagline: 'Ultra-low acidity, intense dark cacao and vanilla cream sweetness',
    description: 'Cold-steeped over sixteen hours under the chill of the maritime fog. Drink over clear block ice or with condensed milk.',
    matchedRoastId: 'twin-peaks-dark',
    steps: [
      {
        timeSec: 60,
        label: 'Slow Immersion',
        waterTarget: 480,
        instruction: 'Combine coarse grounds with filtered cold water in a glass jar. Stir with wooden paddle until fully soaked.',
      },
      {
        timeSec: 180,
        label: 'Overnight Steeping',
        waterTarget: 480,
        instruction: 'Cover and let steep in a cool dark pantry or refrigerator for 16 to 18 hours.',
      },
      {
        timeSec: 360,
        label: 'Double Strain & Bottle',
        waterTarget: 480,
        instruction: 'Pass through double mesh or paper filter. Store concentrate chilled for up to 14 days.',
      },
    ],
  },
];
