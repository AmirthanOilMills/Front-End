// mockData.jsx (or mockData.js)

export const mockProducts = [
  {
    id: '1',
    name: 'Cold-Pressed Coconut Oil',
    price: 299,
    category: 'Cooking Oil',
    image: 'https://images.pexels.com/photos/4016529/pexels-photo-4016529.jpeg?auto=compress&cs=tinysrgb&w=500',
    description:
      'Pure cold-pressed coconut oil extracted using traditional methods. Rich in medium-chain fatty acids and perfect for cooking and skincare.',
    benefits: [
      'Boosts immunity',
      'Good for heart health',
      'Natural moisturizer',
      'Antimicrobial properties',
    ],
    inStock: true,
  },
  {
    id: '2',
    name: 'Organic Sesame Oil',
    price: 250,
    category: 'Cooking Oil',
    image: 'https://images.pexels.com/photos/4226870/pexels-photo-4226870.jpeg?auto=compress&cs=tinysrgb&w=500',
    description:
      'Traditional sesame oil made from carefully selected organic sesame seeds. Perfect for South Indian cooking and oil pulling.',
    benefits: [
      'Rich in antioxidants',
      'Supports heart health',
      'Good for oral hygiene',
      'Anti-inflammatory',
    ],
    inStock: true,
  },
  {
    id: '3',
    name: 'Premium Groundnut Oil',
    price: 180,
    category: 'Cooking Oil',
    image: 'https://images.pexels.com/photos/4198734/pexels-photo-4198734.jpeg?auto=compress&cs=tinysrgb&w=500',
    description:
      'High-quality groundnut oil with excellent smoke point. Ideal for deep frying and everyday cooking needs.',
    benefits: [
      'High smoke point',
      'Rich in vitamin E',
      'Good for frying',
      'Neutral taste',
    ],
    inStock: true,
  },
  {
    id: '4',
    name: 'Cold-Pressed Sunflower Oil',
    price: 220,
    category: 'Cooking Oil',
    image: 'https://images.pexels.com/photos/4226861/pexels-photo-4226861.jpeg?auto=compress&cs=tinysrgb&w=500',
    description:
      'Light and healthy sunflower oil perfect for salad dressings and light cooking. Rich in vitamin E and essential fatty acids.',
    benefits: ['Light texture', 'High in vitamin E', 'Good for salads', 'Heart-healthy'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Pure Castor Oil',
    price: 150,
    category: 'Essential Oil',
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=500',
    description:
      'Pure castor oil for hair and skincare. Known for its moisturizing and healing properties.',
    benefits: [
      'Promotes hair growth',
      'Natural moisturizer',
      'Anti-inflammatory',
      'Healing properties',
    ],
    inStock: true,
  },
  {
    id: '6',
    name: 'Mustard Oil',
    price: 190,
    category: 'Cooking Oil',
    image: 'https://images.pexels.com/photos/4198788/pexels-photo-4198788.jpeg?auto=compress&cs=tinysrgb&w=500',
    description:
      'Traditional mustard oil with strong aroma and flavor. Perfect for pickling and North Indian cuisine.',
    benefits: [
      'Strong flavor',
      'Natural preservative',
      'Good for pickling',
      'Warming properties',
    ],
    inStock: true,
  },
];

export const mockAdmins = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@amirthan.com',
    password: 'admin123',
    role: 'super',
  },
  {
    id: '2',
    name: 'Product Manager',
    email: 'manager@amirthan.com',
    password: 'manager123',
    role: 'normal',
  },
];

export const mockTestimonials = [
  {
    id: '1',
    name: 'Priya Sharma',
    rating: 5,
    comment:
      'Best quality oils! Been using their coconut oil for months. Pure and natural taste.',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    rating: 5,
    comment:
      'Excellent groundnut oil for cooking. My family loves the authentic taste and quality.',
  },
  {
    id: '3',
    name: 'Meera Patel',
    rating: 4,
    comment:
      'Great variety of oils. Fast delivery and good packaging. Highly recommended!',
  },
];
