import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { loadStripe } from '@stripe/stripe-js';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features?: string[];
  images?: string[];
  status?: string;
}

// Session ID for cart reservations - creates a UUID that persists across page reloads
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('scrapwrk_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('scrapwrk_session_id', sessionId);
  }
  return sessionId;
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Fetch products directly from Supabase database instead of edge function
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    // Preload images for faster loading
    if (products && Array.isArray(products)) {
      products.forEach(product => {
        if (product.images && product.images.length > 0) {
          // Preload the first image
          const preloadImage = new Image();
          preloadImage.src = product.images[0];
        }
      });
    }
    
    return products || [];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return [];
  }
};

// Reserve a product when added to cart
export const reserveProduct = async (productId: string): Promise<{ success: boolean; message?: string; expiresAt?: string }> => {
  try {
    const sessionId = getSessionId();
    
    const { data, error } = await supabase.functions.invoke('reserve-product', {
      body: { productId, sessionId }
    });
    
    if (error) {
      console.error('Error reserving product:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to reserve product' 
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in reserveProduct:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};

// Create a checkout session
export const createCheckout = async (productId: string): Promise<{ success: boolean; checkoutUrl?: string; message?: string }> => {
  try {
    const sessionId = getSessionId();
    
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { productId, sessionId }
    });
    
    if (error) {
      console.error('Error creating checkout:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to create checkout' 
      };
    }
    
    // Redirect to Stripe checkout
    if (data.checkoutUrl) {
      return {
        success: true,
        checkoutUrl: data.checkoutUrl
      };
    }
    
    return { success: false, message: 'No checkout URL returned' };
  } catch (error) {
    console.error('Error in createCheckout:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};

// For seamless checkout flow with Stripe
export const initializeStripe = async () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  return publishableKey ? loadStripe(publishableKey) : null;
};

// Function to cancel a reservation (when removing from cart)
export const cancelReservation = async (productId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const sessionId = getSessionId();
    
    const { data, error } = await supabase
      .from('cart_reservations')
      .delete()
      .match({ product_id: productId, session_id: sessionId });
    
    if (error) {
      console.error('Error canceling reservation:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to cancel reservation' 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in cancelReservation:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};
