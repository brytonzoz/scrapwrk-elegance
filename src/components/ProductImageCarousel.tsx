
import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images: string[];
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset current image when images change
  useEffect(() => {
    setCurrentImage(0);
  }, [images]);

  const nextImage = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentImage((prev) => (prev + 1) % images.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextImage();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length, isTransitioning]);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-3xl bg-gray-900 aspect-ratio-[3/4] overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No image available
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-3xl bg-gray-900 shadow-xl">
        <AspectRatio ratio={3/4} className="bg-gray-900">
          {images.map((src, index) => (
            <div 
              key={index}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-in-out",
                currentImage === index ? "opacity-100 scale-100" : "opacity-0 scale-110"
              )}
            >
              <img
                src={src}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ 
                  opacity: currentImage === index ? 1 : 0,
                  transition: "opacity 0.7s ease-in-out, transform 0.7s ease-in-out",
                  transform: currentImage === index ? "scale(1)" : "scale(1.1)",
                }}
                onError={(e) => {
                  console.error(`Error loading image: ${src}`);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          ))}
        </AspectRatio>
      </div>
      
      <button 
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-1 hover:bg-black/60"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 hover:bg-black/60"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "transition-all duration-300",
                currentImage === index 
                  ? "w-8 h-2 bg-white rounded-full" 
                  : "w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
