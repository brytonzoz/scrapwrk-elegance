
import { useRef, useState } from "react";
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
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  
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
    <div className="relative py-12">
      <h2 className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        Our Collection
      </h2>
      
      <div className="relative">
        {/* Left scroll button */}
        <button 
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory gap-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className={cn(
                "snap-start shrink-0 transition-all duration-500",
                "min-w-[300px] cursor-pointer transform",
                selectedProductId === product.id ? "scale-105" : "hover:scale-105",
                selectedProductId === product.id && "ring-2 ring-purple-400",
                hoveredProductId === product.id && "shadow-xl"
              )}
              onClick={() => onProductSelect(product.id)}
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <div className="rounded-2xl overflow-hidden bg-gray-900 shadow-md transition-all duration-300">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={cn(
                    "w-full h-56 object-cover transition-all duration-500",
                    hoveredProductId === product.id && "scale-105"
                  )}
                  onError={(e) => {
                    console.error(`Error loading product image: ${product.image}`);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              <h3 className={cn(
                "mt-4 text-center font-medium transition-all duration-300",
                selectedProductId === product.id ? 
                  "text-xl text-purple-400 font-semibold" : 
                  "text-md text-white",
                hoveredProductId === product.id && !selectedProductId &&
                  "text-purple-300"
              )}>
                {product.name}
              </h3>
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        <button 
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
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
