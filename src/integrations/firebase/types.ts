// Type definitions for Firebase data models
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at?: string;
}

// Collection names as constants to avoid typos
export const COLLECTIONS = {
  PRODUCTS: 'products',
  PRODUCT_IMAGES: 'product_images'
}; 