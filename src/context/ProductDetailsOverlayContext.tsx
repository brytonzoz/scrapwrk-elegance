import React, { createContext, useContext, useState } from 'react';
import { ProductAvailability } from './ProductContext';

interface Feature {
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features?: string[] | Feature[];
  images?: string[];
}

interface ProductDetailsOverlayContextType {
  isOpen: boolean;
  product: Product | null;
  productAvailability: ProductAvailability;
  openOverlay: (product: Product, availability: ProductAvailability, onAddToCart: () => void) => void;
  closeOverlay: () => void;
  currentOnAddToCart: (() => void) | null;
}

const ProductDetailsOverlayContext = createContext<ProductDetailsOverlayContextType | undefined>(undefined);

export const ProductDetailsOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [productAvailability, setProductAvailability] = useState<ProductAvailability>(ProductAvailability.IN_STOCK);
  const [currentOnAddToCart, setCurrentOnAddToCart] = useState<(() => void) | null>(null);

  const openOverlay = (product: Product, availability: ProductAvailability, onAddToCart: () => void) => {
    setProduct(product);
    setProductAvailability(availability);
    setCurrentOnAddToCart(() => onAddToCart);
    setIsOpen(true);
  };

  const closeOverlay = () => {
    setIsOpen(false);
  };

  return (
    <ProductDetailsOverlayContext.Provider value={{
      isOpen,
      product,
      productAvailability,
      openOverlay,
      closeOverlay,
      currentOnAddToCart
    }}>
      {children}
    </ProductDetailsOverlayContext.Provider>
  );
};

export const useProductDetailsOverlay = () => {
  const context = useContext(ProductDetailsOverlayContext);
  if (context === undefined) {
    throw new Error('useProductDetailsOverlay must be used within a ProductDetailsOverlayProvider');
  }
  return context;
}; 