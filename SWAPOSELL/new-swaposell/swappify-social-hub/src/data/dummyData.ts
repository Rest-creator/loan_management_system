// Swaposell Dummy Data - Realistic Social Marketplace Data

export interface User {
  id: string | number;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  trustScore?: number;
  isVerified?: boolean;
  is_verified?: boolean;
  responseTime?: string;
  totalSales?: number;
  totalReviews?: number;
  isOnline?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  images: string[];
  seller: User;
  location: string;
  postedAt: string;
  views: number;
  likes: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  specifications?: Record<string, string>;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export interface Message {
  id: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
  isRead: boolean;
  productId?: string;
  type: 'text' | 'product' | 'image';
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  product?: Product;
}

export interface Notification {
  id: string;
  type: 'like' | 'save' | 'message' | 'comment' | 'follow' | 'sale';
  user: User;
  content: string;
  timestamp: string;
  isRead: boolean;
  productId?: string;
}

// Sample Users
export const sampleUsers: User[] = [
  {
    id: '2',
    name: 'Sarah Williams',
    username: 'sarahw',
    email: 'sarah.williams@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Book lover and collector. Always looking for rare editions and interesting reads!',
    location: 'Boston, MA',
    joinDate: '2021-11-03',
    trustScore: 4.9,
    isVerified: true,
    is_verified: true,
    responseTime: 'within a few hours',
    totalSales: 27,
    totalReviews: 21,
    isOnline: false,
  },
  {
    id: '2',
    name: 'Emmanuel Ncube',
    username: 'vintage_marcus_uz',
    email: 'emmanuel.ncube@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Vintage clothing enthusiast. Authentic pieces only 👔',
    location: 'Belgrave, Harare',
    joinDate: '2022-08-22',
    trustScore: 4.8,
    isVerified: true,
    is_verified: true,
    responseTime: '~2 hours',
    totalSales: 29,
    totalReviews: 25,
    isOnline: false,
  },
  {
    id: '1',
    name: 'Alex Johnson',
    username: 'alexj',
    email: 'alex.johnson@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Tech enthusiast and part-time photographer. Love to trade gadgets and camera gear!',
    location: 'San Francisco, CA',
    joinDate: '2022-01-15',
    trustScore: 4.8,
    isVerified: true,
    is_verified: true,
    responseTime: 'within an hour',
    totalSales: 42,
    totalReviews: 38,
    isOnline: true,
  },
  {
    id: '5',
    name: 'David Kim',
    username: 'davidk',
    email: 'david.kim@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    bio: 'Musician and audio equipment collector. Always looking for vintage gear!',
    location: 'Nashville, TN',
    joinDate: '2022-02-18',
    trustScore: 4.3,
    isVerified: false,
    is_verified: false,
    responseTime: 'within a day',
    totalSales: 12,
    totalReviews: 9,
    isOnline: false,
  },
  {
    id: '4',
    name: 'Maya Chikowore',
    username: 'home_maya_uz',
    email: 'maya.chikowore@example.com',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
    bio: 'Selling decor & furniture for student apartments ✨',
    location: 'Mt Pleasant, Harare',
    joinDate: '2023-05-18',
    trustScore: 4.8,
    isVerified: false,
    responseTime: '~1 hour',
    totalSales: 34,
    totalReviews: 29,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emily Kwani',
    username: 'bookworm_emma_uz',
    email: 'emily.kwani@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Selling textbooks & study guides. Student discounts available 📚',
    location: 'UZ Campus, Casanders Hall',
    joinDate: '2023-03-10',
    trustScore: 4.7,
    isVerified: false,
    responseTime: '~4 hours',
    totalSales: 23,
    totalReviews: 18,
    isOnline: true,
  },
  {
    id: '1',
    name: 'Sarah Chengeto',
    username: 'sarahc_uz',
    email: 'sarah.chengeto@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Tech-savvy UZ student selling electronics. Fast delivery ⚡',
    location: 'UZ Campus, Harare',
    joinDate: '2023-01-15',
    trustScore: 4.9,
    isVerified: true,
    responseTime: '~1 hour',
    totalSales: 47,
    totalReviews: 34,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Alex Mwangi',
    username: 'fitness_alex_uz',
    email: 'alex.mwangi@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Fitness gear for students. Quality guaranteed 💪',
    location: 'UZ Campus Gym',
    joinDate: '2022-11-05',
    trustScore: 4.6,
    isVerified: true,
    responseTime: '~3 hours',
    totalSales: 67,
    totalReviews: 61,
    isOnline: true,
  },
];

// Sample Products with Realistic Images
export const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - Space Black 256GB',
    description: 'Excellent condition iPhone 14 Pro Max with original box and charger. Perfect for student life and online classes.',
    price: 450,
    originalPrice: 500,
    category: 'Electronics',
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605236453806-b25e5d7c95e4?w=400&h=400&fit=crop'
    ],
    seller: sampleUsers[0],
    location: 'UZ Campus, NC3',
    postedAt: '2025-01-20',
    views: 124,
    likes: 38,
    saves: 12,
    isLiked: false,
    isSaved: false,
    tags: ['iPhone', 'Apple', 'Smartphone', 'Student'],
    specifications: {
      'Storage': '256GB',
      'Color': 'Space Black',
      'Battery Health': '97%',
      'Carrier': 'Unlocked'
    }
  },
  {
    id: '2',
    title: "Vintage Boyfriend's jeans - Size 32x30",
    description: 'Authentic vintage Levi\'s jeans. Perfect for students looking for unique campus outfits.',
    price: 10,
    category: 'Fashion',
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop'
    ],
    seller: sampleUsers[1],
    location: 'UZ Campus, Main Rank',
    postedAt: '2025-08-18',
    views: 56,
    likes: 23,
    saves: 12,
    isLiked: true,
    isSaved: false,
    tags: ['Vintage', 'Levi\'s', 'Denim', 'Campus'],
    specifications: {
      'Size': '32x30',
      'Era': '1990s',
      'Material': '100% Cotton',
      'Fit': 'Regular'
    }
  },
  {
    id: '3',
    title: 'MacBook Air M2 - Midnight 512GB',
    description: 'Perfect for students and campus projects. Barely used, comes with original charger.',
    price: 1150,
    originalPrice: 1399,
    category: 'Electronics',
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
    ],
    seller: sampleUsers[0],
    location: 'UZ Campus, Main Library',
    postedAt: '2025-08-19',
    views: 89,
    likes: 45,
    saves: 30,
    isLiked: false,
    isSaved: true,
    tags: ['MacBook', 'Apple', 'Laptop', 'Student'],
    specifications: {
      'Processor': 'Apple M2',
      'Storage': '512GB SSD',
      'RAM': '8GB',
      'Color': 'Midnight'
    }
  },
  {
    id: '4',
    title: 'braids and wigs - laides special',
    description: 'Quality wigs and braids for students. Affordable prices and trendy styles.',
    price: 50,
    originalPrice: 70,
    category: 'Books',
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1634315775834-3e1ac73de6b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lnc3xlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1700219212623-77aebb917034?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2lnc3xlbnwwfHwwfHx8MA%3D%3D'
    ],
    seller: sampleUsers[2],
    location: 'UZ Campus, Casanders Hall',
    postedAt: '2025-08-17',
    views: 34,
    likes: 8,
    saves: 15,
    isLiked: false,
    isSaved: false,
    tags: ['Textbook', 'Calculus', 'Math', 'UZ Students'],
    specifications: {
      'Edition': '8th Edition',
      'Author': 'James Stewart',
      'Condition': 'Good',
      'Pages': '1368'
    }
  },
  {
    id: '5',
    title: 'Perfumes & Colognes Set - Student Discount',
    description: 'Home gym equipment for students in campus apartments. Compact and easy to store.',
    price: 15,
    originalPrice: 20,
    category: 'Sports',
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1718466044521-d38654f3ba0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyZnVtZXN8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyZnVtZXN8ZW58MHx8MHx8fDA%3D'
    ],
    seller: sampleUsers[3],
    location: 'UZ Campus, Casanders Hall',
    postedAt: '2025-08-16',
    views: 78,
    likes: 34,
    saves: 28,
    isLiked: false,
    isSaved: false,
    tags: ['Fitness', 'Dumbbells', 'Campus Gym'],
    specifications: {
      'Weight Range': '5-50 lbs each',
      'Material': 'Cast Iron',
      'Adjustment': 'Quick-Select',
      'Warranty': 'Remaining 1 year'
    }
  }
];

// Sample Comments
export const sampleComments: Comment[] = [
  {
    id: '1',
    user: sampleUsers[1],
    content: 'Is this still available? The condition looks great in the photos!',
    timestamp: '2025-01-20T10:30:00Z',
    likes: 2,
    isLiked: false
  },
  {
    id: '2',
    user: sampleUsers[2],
    content: 'Would you consider $850? I can pick up today.',
    timestamp: '2025-01-20T11:45:00Z',
    likes: 0,
    isLiked: false
  },
  {
    id: '3',
    user: sampleUsers[3],
    content: 'Great seller! Bought from them before, highly recommend.',
    timestamp: '2025-01-20T14:20:00Z',
    likes: 5,
    isLiked: true
  }
];

// Sample Messages
export const sampleMessages: Message[] = [
  {
    id: '1',
    sender: sampleUsers[1],
    receiver: sampleUsers[0],
    content: 'Hi! Is the iPhone still available?',
    timestamp: '2025-01-20T09:00:00Z',
    isRead: true,
    productId: '1',
    type: 'text'
  },
  {
    id: '2',
    sender: sampleUsers[0],
    receiver: sampleUsers[1],
    content: 'Yes, it is! Are you interested in seeing more photos?',
    timestamp: '2025-01-20T09:15:00Z',
    isRead: true,
    type: 'text'
  },
  {
    id: '3',
    sender: sampleUsers[1],
    receiver: sampleUsers[0],
    content: 'That would be great! Also, is the price negotiable?',
    timestamp: '2025-01-20T09:30:00Z',
    isRead: false,
    type: 'text'
  }
];

// Sample Chats
export const sampleChats: Chat[] = [
  {
    id: '1',
    participants: [sampleUsers[0], sampleUsers[1]],
    lastMessage: sampleMessages[2],
    unreadCount: 1,
    product: sampleProducts[0]
  },
  {
    id: '2',
    participants: [sampleUsers[0], sampleUsers[2]],
    lastMessage: {
      id: '4',
      sender: sampleUsers[2],
      receiver: sampleUsers[0],
      content: 'Thanks for the quick response!',
      timestamp: '2025-01-19T16:20:00Z',
      isRead: true,
      type: 'text'
    },
    unreadCount: 0,
    product: sampleProducts[2]
  }
];

// Sample Notifications
export const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: sampleUsers[1],
    content: 'liked your iPhone 14 Pro Max',
    timestamp: '2025-01-20T12:30:00Z',
    isRead: false,
    productId: '1'
  },
  {
    id: '2',
    type: 'message',
    user: sampleUsers[2],
    content: 'sent you a message about MacBook Air',
    timestamp: '2025-01-20T11:15:00Z',
    isRead: false,
    productId: '3'
  },
  {
    id: '3',
    type: 'save',
    user: sampleUsers[3],
    content: 'saved your Adjustable Dumbbell Set',
    timestamp: '2025-01-20T10:45:00Z',
    isRead: true,
    productId: '5'
  }
];

// Categories
export const categories = [
  'Electronics',
  'Fashion',
  'Home',
  'Books',
  'Sports',
  'Beauty',
  'Automotive',
  'Art',
  'Music',
  'Games'
];

// Trending Products (subset of main products for feed)
export const trendingProducts = [
  sampleProducts[0], // iPhone
  sampleProducts[2], // MacBook
  sampleProducts[5], // Coffee Table
  sampleProducts[1], // Vintage Jeans
  sampleProducts[4], // Dumbbells
];