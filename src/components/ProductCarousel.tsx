
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductCarouselProps {
  products: Product[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  products, 
  selectedProductId, 
  onProductSelect 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300; // adjust as needed
      const scrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Product Collection</h2>
      
      <div className="relative">
        {/* Left scroll button */}
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory gap-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className={cn(
                "snap-start shrink-0",
                "min-w-[280px] hover-scale cursor-pointer",
                selectedProductId === product.id && "ring-2 ring-purple-400"
              )}
              onClick={() => onProductSelect(product.id)}
            >
              <div className="rounded-lg overflow-hidden bg-gray-900">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
              </div>
              <h3 className={cn(
                "mt-3 text-center text-sm font-medium",
                selectedProductId === product.id ? "text-purple-400" : "text-white"
              )}>
                {product.name}
              </h3>
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
