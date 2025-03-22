
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/components/SideCart';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
}

interface ProductContextType {
  products: Product[];
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  selectedProduct: Product | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock product data until we have Supabase integration
const mockProducts: Product[] = [
  {
    id: "scrapwrk-001",
    name: "SCRAPWRK 001: HOODIE",
    price: 499,
    description: "One-of-a-kind handcrafted hoodie made from premium recycled materials. Each piece represents the perfect fusion of sustainability and high fashion.",
    features: [
      "Handmade in limited quantities",
      "Sustainable materials",
      "Unique design - no two pieces are alike",
      "Water-resistant outer layer",
    ],
    images: [
      "/images/product-1.jpg",
      "/images/product-2.jpg",
      "/images/product-3.jpg",
      "/images/product-4.jpg",
    ]
  },
  {
    id: "scrapwrk-002",
    name: "SCRAPWRK 002: PANTS",
    price: 399,
    description: "Artisanal pants crafted from reclaimed textiles. Featuring unique patterns and textures, these pants offer comfort with sustainable style.",
    features: [
      "Ethically produced",
      "Zero-waste manufacturing",
      "Adjustable waistband",
      "Reinforced stitching for durability",
    ],
    images: [
      "/images/product-2.jpg",
      "/images/product-3.jpg",
      "/images/product-1.jpg", 
      "/images/product-4.jpg",
    ]
  },
  {
    id: "scrapwrk-003",
    name: "SCRAPWRK 003: HAT",
    price: 199,
    description: "Minimalist hat designed with purpose. Featuring a unique silhouette and crafted from recovered materials, each hat tells its own story.",
    features: [
      "One size fits most",
      "UV protection",
      "Breathable material",
      "Reversible design",
    ],
    images: [
      "/images/product-3.jpg",
      "/images/product-4.jpg",
      "/images/product-1.jpg",
      "/images/product-2.jpg",
    ]
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(mockProducts);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Find the selected product
  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  // Add item to cart
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      // Check if product already exists in cart
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // If exists, increase quantity
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // If new, add to cart
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0], // First image as thumbnail
          quantity: 1
        }];
      }
    });
    
    // Open cart when item is added
    setCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <ProductContext.Provider value={{
      products,
      selectedProductId,
      setSelectedProductId,
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      cartOpen,
      setCartOpen,
      selectedProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
