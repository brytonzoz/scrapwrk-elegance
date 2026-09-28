export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
  material: string;
  size: string;
  availabilityLabel: string;
}

export interface CartLineItem {
  productId: string;
  quantity: number;
}
