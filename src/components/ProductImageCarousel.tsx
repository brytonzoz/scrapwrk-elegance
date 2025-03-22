
import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images: string[];
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg bg-gray-900">
        <AspectRatio ratio={3/4} className="bg-gray-900">
          {images.map((src, index) => (
            <div 
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-in-out",
                currentImage === index ? "opacity-100" : "opacity-0"
              )}
            >
              <img
                src={src}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ 
                  opacity: currentImage === index ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                }}
              />
            </div>
          ))}
        </AspectRatio>
      </div>
      
      <button 
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentImage === index 
                ? "bg-white w-4" 
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
