import React from 'react';
import { cn } from '../lib/utils';
import { Badge } from './Badge';
import { ProductAvailability } from '../types/ProductAvailability';

interface ProductCardProps {
  product: any;
  availability: ProductAvailability;
  index: number;
  onClick?: (product: any) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, availability, index, onClick, className }) => {
  return (
    <div 
      className={cn(
        "group relative snap-center flex-shrink-0 cursor-pointer touch-manipulation select-none overflow-hidden",
        "flex flex-col items-center justify-center",
        "bg-black/10 backdrop-blur-md ios19-card",
        "rounded-[28px] sm:rounded-[36px] border border-white/20",
        "transition-all duration-300 ease-out transform",
        "shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0",
        className
      )}
      onClick={() => onClick?.(product)}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Badge for availability */}
      {availability !== ProductAvailability.IN_STOCK && (
        <div className="absolute top-2 right-2 z-10">
          <div 
            className={cn(
              "text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-lg",
              availability === ProductAvailability.RESERVED ? "bg-yellow-500/80 text-yellow-950" : "bg-red-500/80 text-red-50"
            )}
          >
            {availability === ProductAvailability.RESERVED ? "Reserved" : "Sold"}
          </div>
        </div>
      )}
      
      {/* Images */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-[28px] sm:rounded-t-[36px]">
        {/* Main image with animation */}
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className={cn(
            "w-full h-full object-cover",
            "transition-transform duration-500 ease-out",
            "group-hover:scale-105",
          )}
          loading="lazy"
          onError={(e) => {
            // Fallback image on error
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
        
        {/* Optional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
      </div>
      
      {/* Product info */}
      <div className="ios19-glass w-full p-3 sm:p-4 bg-black/50 backdrop-blur-xl flex flex-col gap-1 border-t border-white/10 rounded-b-[28px] sm:rounded-b-[36px]">
        <h3 className="text-base sm:text-lg font-bold text-white truncate">{product.name}</h3>
        
        <div className="flex items-center justify-between">
          <p className="text-sm sm:text-base font-semibold">${product.price}</p>
          <div className="flex items-center">
            <Badge variant="secondary" className="bg-purple-500/20 text-xs">1 of 1</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 