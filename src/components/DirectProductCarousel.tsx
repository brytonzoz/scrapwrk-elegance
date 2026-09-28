import { useState, useEffect, useRef } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DirectProductCarouselProps {
  productType: 'hoodie' | 'pants' | 'hat';
  count?: number; // Optional count parameter, we'll use all available images
}

const DirectProductCarousel: React.FC<DirectProductCarouselProps> = ({ productType }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [showFeatureInfo, setShowFeatureInfo] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Generate all image URLs for the product type
  useEffect(() => {
    let urls: string[] = [];
    
    // Define all available images for each product type
    if (productType === 'hoodie') {
      urls = [
        '/Scrapwork copy/hoodie 1.png',
        '/Scrapwork copy/hoodie 2.png',
        '/Scrapwork copy/hoodei 3.png', // Note: Misspelling in filename
        '/Scrapwork copy/hoodie 4.png',
        '/Scrapwork copy/hoodie 5.png',
        '/Scrapwork copy/hoodie 6.png',
        '/Scrapwork copy/hoodie 7.png',
        '/Scrapwork copy/hoodie 8.png'
      ];
    } else if (productType === 'pants') {
      urls = [
        '/Scrapwork copy/panst1.png', // Note: Misspelling in filename
        '/Scrapwork copy/pants 2.png',
        '/Scrapwork copy/pants3.png',
        '/Scrapwork copy/pants 4.png',
        '/Scrapwork copy/pants 5.png',
        '/Scrapwork copy/pants 6.png',
        '/Scrapwork copy/pants 7.png',
        '/Scrapwork copy/pants 8.png'
      ];
    } else if (productType === 'hat') {
      urls = [
        '/Scrapwork copy/hat 1.png',
        '/Scrapwork copy/hat 2.png',
        '/Scrapwork copy/hat 3.png',
        '/Scrapwork copy/hat 4.png',
        '/Scrapwork copy/hat5.png',
        '/Scrapwork copy/hat6.png'
      ];
    }
    
    setImageUrls(urls);
    setLoadedImages(Array(urls.length).fill(false));
    setImageErrors(Array(urls.length).fill(false));
    
    // Preload images
    urls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => handleImageLoad(index);
      img.onerror = () => {
        console.error(`Error loading image: ${url}`);
        setImageErrors(prev => {
          const newErrors = [...prev];
          newErrors[index] = true;
          return newErrors;
        });
      };
    });
  }, [productType]);

  // Show feature info popup after a short delay when component mounts
  useEffect(() => {
    if (loadedImages.some(loaded => loaded) && !sessionStorage.getItem('product-selection-info-seen')) {
      const timer = setTimeout(() => {
        setShowFeatureInfo(true);
        
        // Auto-hide after 5 seconds
        const hideTimer = setTimeout(() => {
          setShowFeatureInfo(false);
          sessionStorage.setItem('product-selection-info-seen', 'true');
        }, 5000);
        
        return () => clearTimeout(hideTimer);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [loadedImages]);

  const nextImage = () => {
    if (isTransitioning || imageUrls.length <= 1) return;
    
    setSwipeDirection('left');
    setIsTransitioning(true);
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setSwipeDirection(null);
    }, 500);
  };

  const prevImage = () => {
    if (isTransitioning || imageUrls.length <= 1) return;
    
    setSwipeDirection('right');
    setIsTransitioning(true);
    setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setSwipeDirection(null);
    }, 500);
  };

  // Handle touch/mouse events for swipe
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragDistance(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = clientX - dragStartX;
    setDragDistance(distance);
    
    // Prevent default to stop scrolling while swiping
    e.preventDefault();
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50; // Minimum distance to trigger image change
    if (dragDistance > threshold) {
      prevImage();
    } else if (dragDistance < -threshold) {
      nextImage();
    }
    
    // Reset drag distance with animation
    setDragDistance(0);
  };

  // Auto-rotate images every 6 seconds if we have more than one image
  useEffect(() => {
    if (imageUrls.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isTransitioning && !isDragging) {
        nextImage();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isTransitioning, isDragging, imageUrls.length]);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const closeFeatureInfo = () => {
    setShowFeatureInfo(false);
    sessionStorage.setItem('product-selection-info-seen', 'true');
  };

  if (imageUrls.length === 0) {
    return (
      <div className="rounded-3xl bg-gray-900 aspect-square overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No images available
        </div>
      </div>
    );
  }

  // Helper function to get the visual index (previous, current, next) for swiping cards
  const getVisualIndex = (index: number) => {
    if (index === currentImage) return 0; // Center
    if ((index === (currentImage + 1) % imageUrls.length) || 
        (currentImage === imageUrls.length - 1 && index === 0)) return 1; // Right
    if ((index === (currentImage - 1 + imageUrls.length) % imageUrls.length) || 
        (currentImage === 0 && index === imageUrls.length - 1)) return -1; // Left
    return null; // Not visible
  };

  return (
    <>
      <div className="relative group mx-auto max-w-md">
        {/* Product selection info popup */}
        {showFeatureInfo && (
          <div className="absolute -top-16 sm:-top-14 left-0 right-0 z-40 animate-float-in px-4">
            <div className="ios19-glass bg-black/80 backdrop-blur-2xl rounded-2xl p-4 shadow-xl border border-white/30 relative max-w-full mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
              <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
              
              <button 
                onClick={closeFeatureInfo}
                className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
                aria-label="Close info"
              >
                <X size={16} />
              </button>
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-1.5 bg-purple-500/20 rounded-full">
                  <Info className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm mb-1">Product Selection Tip</h4>
                  <p className="text-xs text-gray-300">
                    Swipe left or right to browse through product images. Each card represents a different view of the product.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div 
          ref={carouselRef}
          className="overflow-hidden rounded-3xl bg-black/60 backdrop-blur-2xl shadow-2xl border border-white/20 h-[450px] relative"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-full h-full relative perspective-1000">
            {imageUrls.map((url, index) => {
              const visualIndex = getVisualIndex(index);
              
              // Skip rendering cards that aren't visible or adjacent
              if (visualIndex === null) return null;
              
              return (
                <div 
                  key={index}
                  className={cn(
                    "absolute inset-0 w-full h-full transition-all duration-500 transform-gpu backface-hidden",
                    isDragging ? "transition-none" : ""
                  )}
                  style={{ 
                    zIndex: visualIndex === 0 ? 30 : 20,
                    transform: (() => {
                      // If dragging, apply drag distance
                      if (isDragging) {
                        return `translate3d(calc(${visualIndex * 100}% + ${dragDistance}px), 0, 0) scale(${1 - Math.abs(visualIndex) * 0.1})`;
                      }
                      
                      // If transitioning with swipe direction
                      if (isTransitioning && swipeDirection) {
                        if (swipeDirection === 'left') {
                          // Moving right to left (next)
                          if (visualIndex === 0) return `translate3d(-100%, 0, 0) scale(0.9)`;
                          if (visualIndex === 1) return `translate3d(0%, 0, 0) scale(1)`;
                          if (visualIndex === -1) return `translate3d(-200%, 0, 0) scale(0.8)`;
                        } else {
                          // Moving left to right (prev)
                          if (visualIndex === 0) return `translate3d(100%, 0, 0) scale(0.9)`;
                          if (visualIndex === -1) return `translate3d(0%, 0, 0) scale(1)`;
                          if (visualIndex === 1) return `translate3d(200%, 0, 0) scale(0.8)`;
                        }
                      }
                      
                      // Normal positioning
                      return `translate3d(${visualIndex * 100}%, 0, 0) scale(${1 - Math.abs(visualIndex) * 0.1})`;
                    })(),
                    opacity: Math.abs(visualIndex) > 1 ? 0 : 1,
                    transformOrigin: 'center',
                    boxShadow: visualIndex === 0 ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : 'none',
                  }}
                >
                  <AspectRatio ratio={3/4} className="h-full bg-black/50 backdrop-blur-xl">
                    <img
                      src={url}
                      alt={`${productType} image ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{ 
                        transition: "transform 0.5s ease-out",
                      }}
                      onError={(e) => {
                        // If image fails, try with a timestamp parameter
                        const img = e.currentTarget;
                        const currentSrc = img.src;
                        if (!currentSrc.includes('t=')) {
                          img.src = `${currentSrc}&t=${Date.now()}`;
                        } else {
                          // Last resort fallback
                          img.src = '/placeholder.svg';
                        }
                      }}
                      onLoad={() => handleImageLoad(index)}
                    />
                  </AspectRatio>
                </div>
              );
            })}
          </div>
          
          {/* Loading indicator */}
          {!loadedImages.some(loaded => loaded) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl backdrop-blur-sm z-30">
              <div className="bg-black/60 px-6 py-3 rounded-lg flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white font-medium">Loading images...</span>
              </div>
            </div>
          )}
          
          {/* Swipe hint overlay */}
          <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center opacity-0 animate-fade-in-out">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
              <div className="w-10 h-10 flex items-center justify-center animate-swipe-hint">
                <ChevronLeft className="w-6 h-6 text-white/70" />
              </div>
            </div>
          </div>

          {/* Navigation UI */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 z-20 items-center">
            <Button 
              onClick={prevImage}
              variant="ghost"
              size="icon"
              className="backdrop-blur-xl bg-black/50 w-10 h-10 rounded-full hover:bg-black/70 shadow-lg transition-all duration-300 border border-white/20 opacity-0 group-hover:opacity-100"
              disabled={isTransitioning}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button 
              onClick={nextImage}
              variant="ghost"
              size="icon"
              className="backdrop-blur-xl bg-black/50 w-10 h-10 rounded-full hover:bg-black/70 shadow-lg transition-all duration-300 border border-white/20 opacity-0 group-hover:opacity-100"
              disabled={isTransitioning}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Indicator dots */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
            {Array.from({ length: imageUrls.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => !isTransitioning && setCurrentImage(index)}
                className={cn(
                  "transition-all duration-300",
                  currentImage === index 
                    ? "w-6 h-1.5 bg-white rounded-full shadow-glow" 
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70 rounded-full"
                )}
                aria-label={`Go to image ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DirectProductCarousel; 