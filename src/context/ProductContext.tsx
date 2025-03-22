
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/components/SideCart';
import { fetchProducts, seedInitialData, Product } from '@/lib/api';
import { toast } from "sonner";

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
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // First check if we need to seed data
        await seedInitialData();
        
        // Then fetch all products
        const data = await fetchProducts();
        
        if (data.length === 0) {
          setError("No products found");
          return;
        }
        
        setProducts(data);
        
        // Set the first product as selected by default
        if (data.length > 0 && !selectedProductId) {
          setSelectedProductId(data[0].id);
        }
        
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products");
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
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
    
    toast.success("Added to cart!");
    // Open cart when item is added
    setCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.info("Item removed from cart");
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

export type { Product };
