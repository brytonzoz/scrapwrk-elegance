import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchProducts, reserveProduct, cancelReservation, getSessionId, createCheckout, Product } from '@/lib/api';
import { toast } from "sonner";

// Define CartItem interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Enum for product availability status
export enum ProductAvailability {
  IN_STOCK = 'IN_STOCK',
  RESERVED = 'RESERVED',
  SOLD_OUT = 'SOLD_OUT'
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  productAvailability: Record<string, ProductAvailability>;
  cartTimeRemaining: number | null;
  clearCart: () => void;
  proceedToCheckout: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initial fallback products (will be updated with real images)
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fallback-1",
    name: "SCRAPWRK 001: HOODIE",
    price: 349,
    description: "One-of-a-kind handcrafted hoodie made from premium recycled materials. Each piece represents the perfect fusion of sustainability and high fashion.",
    features: ['Handmade in limited quantities', 'Sustainable materials', 'Unique design - no two pieces are alike', 'Water-resistant outer layer'],
    images: ['/Scrapwork copy/hoodie 1.png', '/Scrapwork copy/hoodie 2.png']
  },
  {
    id: "fallback-2",
    name: "SCRAPWRK 002: PANTS",
    price: 429,
    description: "Artisanal pants crafted from reclaimed textiles. Featuring unique patterns and textures, these pants offer comfort with sustainable style.",
    features: ['Ethically produced', 'Zero-waste manufacturing', 'Adjustable waistband', 'Reinforced stitching for durability'],
    images: ['/Scrapwork copy/panst1.png', '/Scrapwork copy/pants 2.png']
  },
  {
    id: "fallback-3",
    name: "SCRAPWRK 003: HAT",
    price: 99,
    description: "Minimalist hat designed with purpose. Featuring a unique silhouette and crafted from recovered materials, each hat tells its own story.",
    features: ['One size fits most', 'UV protection', 'Breathable material', 'Reversible design'],
    images: ['/Scrapwork copy/hat 1.png', '/Scrapwork copy/hat 2.png']
  }
];

// Function to load images from local public folder
const loadImagesFromPublicFolder = () => {
  console.log("Loading images from local public folder");
  
  // Define image counts for each product type
  const hoodieImages = [
    '/Scrapwork copy/hoodie 1.png',
    '/Scrapwork copy/hoodie 2.png',
    '/Scrapwork copy/hoodei 3.png', // Note the misspelling in filename
    '/Scrapwork copy/hoodie 4.png',
    '/Scrapwork copy/hoodie 5.png',
    '/Scrapwork copy/hoodie 6.png',
    '/Scrapwork copy/hoodie 7.png',
    '/Scrapwork copy/hoodie 8.png'
  ];
  
  const pantsImages = [
    '/Scrapwork copy/panst1.png', // Note the misspelling in filename
    '/Scrapwork copy/pants 2.png',
    '/Scrapwork copy/pants3.png',
    '/Scrapwork copy/pants 4.png',
    '/Scrapwork copy/pants 5.png',
    '/Scrapwork copy/pants 6.png',
    '/Scrapwork copy/pants 7.png',
    '/Scrapwork copy/pants 8.png'
  ];
  
  const hatImages = [
    '/Scrapwork copy/hat 1.png',
    '/Scrapwork copy/hat 2.png',
    '/Scrapwork copy/hat 3.png',
    '/Scrapwork copy/hat 4.png',
    '/Scrapwork copy/hat5.png',
    '/Scrapwork copy/hat6.png'
  ];
  
  // Update fallback products with local images
  FALLBACK_PRODUCTS[0].images = hoodieImages;
  FALLBACK_PRODUCTS[1].images = pantsImages;
  FALLBACK_PRODUCTS[2].images = hatImages;
  
  return {
    hoodieImages,
    pantsImages,
    hatImages
  };
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with fallback products so the UI can render immediately
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>(FALLBACK_PRODUCTS[0].id);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [productAvailability, setProductAvailability] = useState<Record<string, ProductAvailability>>({});
  const [cartTimeRemaining, setCartTimeRemaining] = useState<number | null>(null);
  const cartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cartStartTimeRef = useRef<number | null>(null);
  
  // Get a session ID for the current user
  useEffect(() => {
    // This will create a new session ID if one doesn't exist
    getSessionId();
  }, []);
  
  // Initialize product availability
  useEffect(() => {
    const initialAvailability: Record<string, ProductAvailability> = {};
    products.forEach(product => {
      // Map the status from Supabase to our enum
      if (product.status === 'RESERVED') {
        initialAvailability[product.id] = ProductAvailability.RESERVED;
      } else if (product.status === 'SOLD_OUT') {
        initialAvailability[product.id] = ProductAvailability.SOLD_OUT;
      } else {
        initialAvailability[product.id] = ProductAvailability.IN_STOCK;
      }
    });
    setProductAvailability(initialAvailability);
  }, [products]);

  // Cart timer functionality - 15 minute reservation
  const CART_RESERVATION_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
  
  const startCartTimer = () => {
    if (cartTimerRef.current) {
      clearInterval(cartTimerRef.current);
    }
    
    cartStartTimeRef.current = Date.now();
    setCartTimeRemaining(CART_RESERVATION_TIME);
    
    cartTimerRef.current = setInterval(() => {
      if (cartStartTimeRef.current) {
        const elapsed = Date.now() - cartStartTimeRef.current;
        const remaining = Math.max(0, CART_RESERVATION_TIME - elapsed);
        setCartTimeRemaining(remaining);
        
        if (remaining <= 0) {
          clearCart();
          toast.warning("Your reservation has expired. The items have been released.", {
            duration: 3000,
          });
        }
      }
    }, 1000);
  };
  
  const stopCartTimer = () => {
    if (cartTimerRef.current) {
      clearInterval(cartTimerRef.current);
      cartTimerRef.current = null;
    }
    cartStartTimeRef.current = null;
    setCartTimeRemaining(null);
  };
  
  // Clear the cart when time expires
  const clearCart = async () => {
    // Cancel all reservations in Supabase
    for (const item of cartItems) {
      await cancelReservation(item.id);
    }
    
    // Update product availability for all cart items
    const newAvailability = {...productAvailability};
    cartItems.forEach(item => {
      newAvailability[item.id] = ProductAvailability.IN_STOCK;
    });
    setProductAvailability(newAvailability);
    
    // Empty the cart
    setCartItems([]);
    stopCartTimer();
    setCartOpen(false);
  };
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (cartTimerRef.current) {
        clearInterval(cartTimerRef.current);
      }
    };
  }, []);

  // Load products from Supabase via the Edge Function
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load products from Supabase API
        const loadedProducts = await fetchProducts();
        
        if (loadedProducts && loadedProducts.length > 0) {
          console.log("Products loaded from API:", loadedProducts);
          
          // Load local images for these products in case we need them
          const { hoodieImages, pantsImages, hatImages } = loadImagesFromPublicFolder();
          
          // Update product images with the ones from public folder if they're missing
          const updatedProducts = loadedProducts.map(product => {
            // If image URLs don't start with http (they're local paths), use them as is
            if (product.images && product.images.length > 0 && product.images[0].startsWith('http')) {
              // Images from Supabase storage - use them
              return product;
            }
            
            // Otherwise map based on product name
            if (product.name && product.name.includes('HOODIE')) {
              return { ...product, images: hoodieImages };
            } else if (product.name && product.name.includes('PANTS')) {
              return { ...product, images: pantsImages };
            } else if (product.name && product.name.includes('HAT')) {
              return { ...product, images: hatImages };
            }
            return product;
          });
          
          setProducts(updatedProducts);
          setSelectedProductId(updatedProducts[0].id);
        } else {
          console.log("No products returned from API, using fallbacks");
          // Load images from local public folder
          loadImagesFromPublicFolder();
          setProducts(FALLBACK_PRODUCTS);
          setSelectedProductId(FALLBACK_PRODUCTS[0].id);
        }
      } catch (err: any) {
        console.error("Error loading products:", err);
        setError(`Failed to load products: ${err.message || 'Unknown error'}`);
        // Load images from local public folder
        loadImagesFromPublicFolder();
        setProducts(FALLBACK_PRODUCTS);
        setSelectedProductId(FALLBACK_PRODUCTS[0].id);
      } finally {
        setIsLoading(false);
      }
    };

    // Start loading products
    loadProducts();
    
    // Set up interval to refresh product status
    const refreshInterval = setInterval(loadProducts, 30000); // refresh every 30 seconds
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);
  
  // Calculate the selected product
  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  // Preload all product images immediately
  useEffect(() => {
    const preloadAllImages = () => {
      console.log("Preloading all product images");
      products.forEach(product => {
        if (product.images && product.images.length > 0) {
          product.images.forEach(imageSrc => {
            const img = new Image();
            img.src = imageSrc;
          });
        }
      });
    };
    
    preloadAllImages();
  }, [products]);

  // Preload next/previous product images when selected product changes
  useEffect(() => {
    if (!selectedProduct) return;
    
    const currentIndex = products.findIndex(p => p.id === selectedProduct.id);
    
    // Preload next product images
    const nextIndex = (currentIndex + 1) % products.length;
    const nextProduct = products[nextIndex];
    
    // Preload previous product images
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    const prevProduct = products[prevIndex];
    
    // Preload both next and previous product images with high priority
    [nextProduct, prevProduct].forEach(product => {
      if (product?.images && product.images.length > 0) {
        product.images.forEach(imageSrc => {
          const img = new Image();
          img.src = imageSrc;
        });
      }
    });
  }, [selectedProduct, products]);

  // Modified addToCart to use Supabase reservations
  const addToCart = async (product: Product) => {
    // Check if the product is already in the cart
    if (cartItems.some(item => item.id === product.id)) {
      toast.info("This exclusive item is already in your cart.");
      return;
    }
    
    // Check if product is available
    if (productAvailability[product.id] !== ProductAvailability.IN_STOCK) {
      if (productAvailability[product.id] === ProductAvailability.RESERVED) {
        toast.error("This item is currently reserved by another customer.");
      } else {
        toast.error("This item is sold out.");
      }
      return;
    }
    
    // Reserve the product in Supabase
    const reservationResult = await reserveProduct(product.id);
    
    if (!reservationResult.success) {
      toast.error(reservationResult.message || "Failed to reserve product. Please try again.");
      return;
    }
    
    // Get the correct image
    const productImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/placeholder.svg';
    
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImage,
      quantity: 1
    };
    
    // Update the cart
    setCartItems([...cartItems, newItem]);
    
    // Update product availability
    const newAvailability = {...productAvailability};
    newAvailability[product.id] = ProductAvailability.RESERVED;
    setProductAvailability(newAvailability);
    
    // Start the reservation timer if this is the first item
    if (cartItems.length === 0) {
      startCartTimer();
    }
    
    // Notify user
    toast.success("Item added to your cart! You have 15 minutes to complete your purchase.", {
      duration: 3000,
    });
    setCartOpen(true);
  };
  
  // Modified removeFromCart to update Supabase reservation
  const removeFromCart = async (productId: string) => {
    // Cancel the reservation in Supabase
    await cancelReservation(productId);
    
    // Update product availability
    const newAvailability = {...productAvailability};
    newAvailability[productId] = ProductAvailability.IN_STOCK;
    setProductAvailability(newAvailability);
    
    // Remove from cart
    setCartItems(cartItems.filter(item => item.id !== productId));
    
    // If cart is now empty, stop the timer
    if (cartItems.length <= 1) {
      stopCartTimer();
    }
  };
  
  // Remove quantity functionality since items are one-of-a-kind
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    // Keep method signature for compatibility, but only allow quantity of 1
    if (quantity !== 1) {
      toast.info("This is a one-of-a-kind item and only one is available.");
      return;
    }
  };

  // Proceed to checkout with Stripe
  const proceedToCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    
    // We only support one item at a time currently
    const productId = cartItems[0].id;
    
    try {
      setIsLoading(true);
      const checkoutResult = await createCheckout(productId);
      
      if (checkoutResult.success && checkoutResult.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = checkoutResult.checkoutUrl;
      } else {
        toast.error(checkoutResult.message || "Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("An error occurred during checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
        if (JSON.parse(savedCart).length > 0) {
          startCartTimer();
        }
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
      isLoading,
      error,
      selectedProductId,
      setSelectedProductId,
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      cartOpen,
      setCartOpen,
      selectedProduct,
      productAvailability,
      cartTimeRemaining,
      clearCart,
      proceedToCheckout
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

export type { Product };
