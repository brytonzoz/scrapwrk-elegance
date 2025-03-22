
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function createImagePlaceholders() {
  return [
    "/images/product-1.jpg",
    "/images/product-2.jpg", 
    "/images/product-3.jpg",
    "/images/product-4.jpg",
  ];
}
