import { X, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProductDetailsOverlay } from "@/context/ProductDetailsOverlayContext";

interface Feature {
  name: string;
  description?: string;
}

const GlobalProductDetailsOverlay = () => {
  const { 
    isOpen, 
    closeOverlay, 
    product, 
    productAvailability,
    currentOnAddToCart
  } = useProductDetailsOverlay();
  
  // Prevent background scrolling when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;
  
  const formatFeature = (feature: string | Feature): { name: string; description?: string } => {
    if (typeof feature === 'string') {
      return { name: feature };
    }
    return feature;
  };
  
  // Define the availability button style
  const getButtonStyle = () => {
    return productAvailability === "in_stock" 
      ? "opacity-100" 
      : "opacity-50 cursor-not-allowed pointer-events-none";
  };
  
  // Get button text based on availability
  const getButtonText = () => {
    switch (productAvailability) {
      case "in_stock":
        return "Add to Cart";
      case "reserved":
        return "Currently Reserved";
      case "sold_out":
        return "Sold Out";
      default:
        return "Add to Cart";
    }
  };
  
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop with heavy blur effect */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xl z-0"
        onClick={closeOverlay}
      />
      
      {/* Floating container with VisionOS-like design, centered in viewport */}
      <div className="relative w-[90%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[85vh] overflow-y-auto z-10 ios19-glass bg-black/80 backdrop-blur-2xl animate-float-in rounded-3xl shadow-2xl border border-white/20 mx-auto my-auto">
        <div className="sticky top-0 z-20 flex justify-between p-4 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-xl border-b border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text px-2">{product.name}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeOverlay}
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-5">
          <div className="ios19-card bg-black/30 border border-white/20 backdrop-blur-xl rounded-3xl overflow-hidden">
            <div className="p-5 sm:p-6 space-y-6">
              <section>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-300">
                  {product.description}
                </p>
              </section>
              
              {product.features && product.features.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold mb-2">Features</h3>
                  <ul className="text-gray-300 space-y-2">
                    {product.features.map((feature, index) => {
                      const formattedFeature = formatFeature(feature);
                      return (
                        <li key={index} className="flex items-start">
                          <span className="rounded-full w-5 h-5 sm:w-6 sm:h-6 mr-3 mt-0.5 bg-purple-500/20 flex-shrink-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400"></div>
                          </span>
                          <span>{formattedFeature.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>
          </div>
          
          <div className="ios19-card bg-black/30 border border-white/20 backdrop-blur-xl rounded-3xl overflow-hidden">
            <div className="p-5 sm:p-6 space-y-6">
              <section>
                <h3 className="text-xl font-semibold mb-2">Our Process</h3>
                <p className="text-gray-300">
                  Every piece in our collection is meticulously crafted from hundreds of textile scraps that would otherwise end up in landfills. 
                  Our designers carefully select, cut, and stitch each element by hand, ensuring that no two items are exactly alike. 
                  This sustainable approach reduces waste while creating truly unique fashion pieces.
                </p>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-2">Materials</h3>
                <p className="text-gray-300">
                  This item is made from a combination of upcycled denim, cotton scraps, and synthetic fabric remnants. 
                  All materials undergo a careful cleaning and preparation process before being incorporated into the final design.
                </p>
              </section>
            </div>
          </div>
          
          <div className="ios19-card bg-black/30 border border-white/20 backdrop-blur-xl rounded-3xl overflow-hidden">
            <div className="p-5 sm:p-6 space-y-6">
              <section>
                <h3 className="text-xl font-semibold mb-2">Care Instructions</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Hand wash cold with mild detergent</li>
                  <li>• Do not bleach or tumble dry</li>
                  <li>• Lay flat to dry</li>
                  <li>• Cool iron if needed</li>
                  <li>• Store in a cool, dry place</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-2">Sizing</h3>
                <p className="text-gray-300">
                  This is a one-size-fits-most item. Please check the specific measurements below:
                </p>
                <ul className="text-gray-300 mt-2 space-y-1">
                  <li>• Width: Approximately 18-22 inches</li>
                  <li>• Length: Approximately 24-28 inches</li>
                </ul>
              </section>
            </div>
          </div>
          
          <div className="ios19-glass bg-black/30 border border-white/20 backdrop-blur-xl rounded-3xl">
            <div className="p-5 sm:p-6">
              <Button 
                onClick={() => currentOnAddToCart && currentOnAddToCart()}
                className={cn(
                  "w-full h-12 sm:h-14 md:h-16 rounded-full flex items-center justify-center",
                  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
                  "border border-white/20 backdrop-blur-xl py-4 text-base sm:text-lg font-medium",
                  "shadow-lg hover:shadow-xl animate-button-pulse",
                  "hover:-translate-y-1 transition-all duration-300 active:translate-y-0 active:shadow-inner",
                  "touch-manipulation",
                  getButtonStyle()
                )}
                disabled={productAvailability !== "in_stock"}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {getButtonText()}
              </Button>
            </div>
          </div>
          
          {/* Small pill nav at bottom for gesture hint on mobile */}
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalProductDetailsOverlay; 