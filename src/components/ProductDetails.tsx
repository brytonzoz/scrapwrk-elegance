import { Button } from "@/components/ui/button";
import { ShoppingBag, Info, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useProduct } from "@/context/ProductContext";
import { cn } from "@/lib/utils";
import { ProductAvailability } from "@/context/ProductContext";
import { useProductDetailsOverlay } from "@/context/ProductDetailsOverlayContext";
import useEmblaCarousel from 'embla-carousel-react';

interface Feature {
  name: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features?: string[] | Feature[];
  images?: string[];
}

interface ProductDetailsProps {
  product: Product;
  onAddToCart: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  previousProduct?: Product;
  nextProduct?: Product;
}

const ProductDetails = ({ 
  product, 
  onAddToCart,
  onPrevious,
  onNext,
  previousProduct,
  nextProduct
}: ProductDetailsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { cartOpen, setCartOpen, productAvailability } = useProduct();
  const { openOverlay } = useProductDetailsOverlay();
  
  // Embla carousel setup for mobile swipe
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    dragFree: false,
  });
  
  // Track current slide index
  const [selectedIndex, setSelectedIndex] = useState(1); // Start at the middle (current product)
  
  // Initialize carousel
  useEffect(() => {
    if (emblaApi) {
      // Start at the middle slide (index 1)
      emblaApi.scrollTo(1);
      
      // Event listener for slide changes
      const onSelect = () => {
        const newIndex = emblaApi.selectedScrollSnap();
        setSelectedIndex(newIndex);
        
        // Handle navigation when slide changes
        if (newIndex === 0 && onPrevious) {
          onPrevious();
        } else if (newIndex === 2 && onNext) {
          onNext();
        }
      };
      
      emblaApi.on('select', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi, onNext, onPrevious]);
  
  // Update carousel when products change
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(1);
    }
  }, [emblaApi, product, previousProduct, nextProduct]);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart();
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const formatFeature = (feature: string | Feature): { name: string; description?: string } => {
    if (typeof feature === 'string') {
      return { name: feature };
    }
    return feature;
  };

  // Get availability status for the current product
  const availability = productAvailability[product.id] || ProductAvailability.IN_STOCK;

  // Define label and style based on availability
  const getAvailabilityLabel = () => {
    switch (availability) {
      case ProductAvailability.IN_STOCK:
        return { 
          text: "In Stock", 
          bgColor: "bg-green-500/20", 
          textColor: "text-green-300"
        };
      case ProductAvailability.RESERVED:
        return { 
          text: "Reserved", 
          bgColor: "bg-yellow-500/20", 
          textColor: "text-yellow-300"
        };
      case ProductAvailability.SOLD_OUT:
        return { 
          text: "Sold Out", 
          bgColor: "bg-red-500/20", 
          textColor: "text-red-300"
        };
      default:
        return { 
          text: "In Stock", 
          bgColor: "bg-green-500/20", 
          textColor: "text-green-300"
        };
    }
  };

  const availabilityStyle = getAvailabilityLabel();

  // Handler for opening the global product details overlay
  const handleShowDetails = () => {
    openOverlay(product, availability, handleAddToCart);
  };

  return (
    <>
      {/* Mobile view - full-screen card with swipe functionality */}
      <div className="md:hidden w-full max-w-md mx-auto">
        <div className="ios19-glass bg-black/40 backdrop-blur-xl rounded-[28px] shadow-lg border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-20 flex justify-between p-3 bg-gradient-to-b from-black/90 to-black/40 backdrop-blur-xl border-b border-white/10">
            <h2 className="text-xl font-bold gradient-text px-2 truncate text-center w-full">{product.name}</h2>
          </div>
          
          {/* Carousel wrapper */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {/* Previous product */}
              {previousProduct && (
                <div className="flex-[0_0_100%] min-w-0 p-4">
                  <ProductCard 
                    product={previousProduct} 
                    availability={productAvailability[previousProduct.id] || ProductAvailability.IN_STOCK} 
                    onShowDetails={() => openOverlay(previousProduct, productAvailability[previousProduct.id] || ProductAvailability.IN_STOCK, handleAddToCart)}
                  />
                </div>
              )}
              
              {/* Current product */}
              <div className="flex-[0_0_100%] min-w-0">
                <div className="p-4 space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-2xl font-medium">${product.price}</p>
                      <div className={`px-3 py-1 rounded-lg ${availabilityStyle.bgColor} ${availabilityStyle.textColor} text-xs font-medium`}>
                        {availabilityStyle.text}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>
                  
                  {/* Product Info Section */}
                  <div className="bg-black/30 p-3 rounded-2xl backdrop-blur-xl border border-white/10">
                    <h3 className="text-xs uppercase tracking-wider text-purple-300 mb-2">Product Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Size</span>
                        <span className="text-white">One Size</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Availability</span>
                        <span className={`text-white ${availabilityStyle.textColor}`}>1 of 1 (Limited Edition)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Material</span>
                        <span className="text-white">Upcycled Textiles</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation controls */}
                  <div className="flex items-center justify-center gap-3 relative">
                    <Button 
                      onClick={scrollPrev} 
                      variant="outline"
                      className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/20 active:bg-white/30 transition-all duration-300 backdrop-blur-xl border border-white/10 flex-shrink-0 shadow-lg vision-spring-animation-fast"
                      disabled={!onPrevious}
                      aria-label="Previous product"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      onClick={handleShowDetails}
                      variant="outline"
                      className="h-12 rounded-2xl flex-1 bg-white/5 hover:bg-white/20 active:bg-white/30 transition-all duration-300 backdrop-blur-xl border border-white/10 px-3 text-sm font-medium shadow-lg truncate vision-spring-animation-fast"
                    >
                      <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">View Details</span>
                    </Button>
                    
                    <Button 
                      onClick={scrollNext}
                      variant="outline" 
                      className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/20 active:bg-white/30 transition-all duration-300 backdrop-blur-xl border border-white/10 flex-shrink-0 shadow-lg vision-spring-animation-fast"
                      disabled={!onNext}
                      aria-label="Next product"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Add to cart button */}
                  <Button 
                    onClick={handleAddToCart}
                    className={cn(
                      "w-full h-12 rounded-2xl flex items-center justify-center",
                      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
                      "border border-white/20 backdrop-blur-xl py-4 text-base font-medium",
                      "shadow-lg animate-button-pulse",
                      "transition-all duration-300 active:translate-y-0 active:shadow-inner vision-spring-animation-fast",
                      "magical-button",
                      availability !== ProductAvailability.IN_STOCK && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                    disabled={availability !== ProductAvailability.IN_STOCK}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {availability === ProductAvailability.IN_STOCK ? "Add to Cart" : 
                     availability === ProductAvailability.RESERVED ? "Currently Reserved" : "Sold Out"}
                  </Button>
                </div>
              </div>
              
              {/* Next product */}
              {nextProduct && (
                <div className="flex-[0_0_100%] min-w-0 p-4">
                  <ProductCard 
                    product={nextProduct} 
                    availability={productAvailability[nextProduct.id] || ProductAvailability.IN_STOCK} 
                    onShowDetails={() => openOverlay(nextProduct, productAvailability[nextProduct.id] || ProductAvailability.IN_STOCK, handleAddToCart)}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* iOS-style swipe indicator */}
          <div className="flex justify-center items-center pb-4 pt-2">
            <div className="w-10 h-1 bg-white/30 rounded-full animate-swipe-hint"></div>
          </div>
        </div>
        
        {/* Dots indicator */}
        <div className="mt-3 flex justify-center">
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedIndex === 0 ? 'bg-white w-6 h-2' : 'bg-white/30'}`}></div>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedIndex === 1 ? 'bg-white w-6 h-2' : 'bg-white/30'}`}></div>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedIndex === 2 ? 'bg-white w-6 h-2' : 'bg-white/30'}`}></div>
          </div>
        </div>
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:block ios19-glass bg-black/40 backdrop-blur-xl rounded-[28px] shadow-lg overflow-hidden border border-white/20">
        <div className="sticky top-0 z-20 flex justify-between p-4 bg-gradient-to-b from-black/90 to-black/40 backdrop-blur-xl border-b border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text px-2">{product.name}</h2>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-2xl md:text-3xl font-medium">${product.price}</p>
              <div className={`px-3 py-1 rounded-lg ${availabilityStyle.bgColor} ${availabilityStyle.textColor} text-sm font-medium`}>
                {availabilityStyle.text}
              </div>
            </div>
          </div>
          
          <p className="text-base text-gray-300 leading-relaxed">{product.description}</p>
          
          {/* Product Info Section */}
          <div className="bg-black/30 p-4 rounded-2xl backdrop-blur-xl border border-white/10">
            <h3 className="text-sm uppercase tracking-wider text-purple-300 mb-3">Product Info</h3>
            <div className="space-y-3 text-base">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Size</span>
                <span className="text-white">One Size</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Availability</span>
                <span className={`text-white ${availabilityStyle.textColor}`}>1 of 1 (Limited Edition)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Material</span>
                <span className="text-white">Upcycled Textiles</span>
              </div>
            </div>
          </div>
          
          {/* Button controls */}
          <div className="pt-3 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-4 relative">
              <Button 
                onClick={onPrevious} 
                variant="outline"
                className="h-14 w-14 rounded-xl bg-white/5 hover:bg-white/20 active:bg-white/30 transition-all duration-300 backdrop-blur-xl border border-white/10 flex-shrink-0 shadow-lg hover:shadow-xl hover:-translate-y-1 vision-spring-animation-fast"
                disabled={!onPrevious}
                aria-label="Previous product"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={handleShowDetails}
                variant="outline"
                className="h-14 rounded-2xl flex-1 bg-white/5 hover:bg-white/20 active:bg-white/30 transition-all duration-300 backdrop-blur-xl border border-white/10 px-6 text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 truncate vision-spring-animation-fast"
              >
                <Info className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="truncate">View Details</span>
              </Button>
              
              <Button 
                onClick={onNext}
                variant="outline" 
                className="h-14 w-14 rounded-xl bg-white/5 hover:bg-white/20 active:bg-white/30 transition-all duration-300 backdrop-blur-xl border border-white/10 flex-shrink-0 shadow-lg hover:shadow-xl hover:-translate-y-1 vision-spring-animation-fast"
                disabled={!onNext}
                aria-label="Next product"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            
            <div>
              <Button 
                onClick={handleAddToCart}
                className={cn(
                  "w-full h-14 rounded-2xl flex items-center justify-center",
                  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
                  "border border-white/20 backdrop-blur-xl py-4 text-lg font-medium",
                  "shadow-lg hover:shadow-xl animate-button-pulse",
                  "hover:-translate-y-1 transition-all duration-300 active:translate-y-0 active:shadow-inner vision-spring-animation-fast",
                  "magical-button",
                  availability !== ProductAvailability.IN_STOCK && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
                disabled={availability !== ProductAvailability.IN_STOCK}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {availability === ProductAvailability.IN_STOCK ? "Add to Cart" : 
                 availability === ProductAvailability.RESERVED ? "Currently Reserved" : "Sold Out"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper component for product cards in the carousel
const ProductCard = ({ product, availability, onShowDetails }) => {
  // Get availability style
  const getAvailabilityLabel = () => {
    switch (availability) {
      case ProductAvailability.IN_STOCK:
        return { 
          text: "In Stock", 
          bgColor: "bg-green-500/20", 
          textColor: "text-green-300"
        };
      case ProductAvailability.RESERVED:
        return { 
          text: "Reserved", 
          bgColor: "bg-yellow-500/20", 
          textColor: "text-yellow-300"
        };
      case ProductAvailability.SOLD_OUT:
        return { 
          text: "Sold Out", 
          bgColor: "bg-red-500/20", 
          textColor: "text-red-300"
        };
      default:
        return { 
          text: "In Stock", 
          bgColor: "bg-green-500/20", 
          textColor: "text-green-300"
        };
    }
  };

  const availabilityStyle = getAvailabilityLabel();

  return (
    <div className="ios19-glass bg-black/30 backdrop-blur-xl rounded-[24px] shadow-lg overflow-hidden border border-white/10 h-full transition-all">
      <div className="sticky top-0 z-20 flex justify-between p-3 bg-gradient-to-b from-black/90 to-black/40 backdrop-blur-xl border-b border-white/10">
        <h2 className="text-lg font-bold gradient-text px-2 truncate">{product.name}</h2>
      </div>
      
      <div className="p-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-lg font-medium">${product.price}</p>
          <div className={`px-2 py-0.5 rounded-lg ${availabilityStyle.bgColor} ${availabilityStyle.textColor} text-xs font-medium`}>
            {availabilityStyle.text}
          </div>
        </div>
        
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{product.description}</p>
        
        <Button 
          onClick={onShowDetails}
          variant="outline"
          className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/20 active:bg-white/30 transition-all duration-300 backdrop-blur-xl border border-white/10 text-sm font-medium vision-spring-animation-fast"
        >
          <Info className="w-4 h-4 mr-2" />
          <span>Details</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
