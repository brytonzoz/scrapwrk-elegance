import React, { useState, useEffect } from 'react';

// Cache for preloaded images
const imageCache: Record<string, boolean> = {};

// This component is a direct image loader for local images in the public folder
// Instead of using Firebase Storage

interface DirectImageLoaderProps {
  productType: 'hoodie' | 'pants' | 'hat';
  index: number;
  alt?: string;
  className?: string;
  priority?: boolean; // Add priority flag for immediate loading
}

// Helper function to preload all images for a product type
export const preloadProductImages = (productType: 'hoodie' | 'pants' | 'hat', count: number = 8): void => {
  const maxImages = productType === 'hat' ? 6 : 8; // Hats have fewer images
  const imageCount = Math.min(count, maxImages);
  
  for (let i = 0; i < imageCount; i++) {
    let imageName;
    const normalizedType = productType.toLowerCase();
    
    if (normalizedType === 'hoodie' && i === 2) {
      imageName = `hoodei 3.png`;
    } else if (normalizedType === 'pants' && i === 0) {
      imageName = `panst1.png`;
    } else if (normalizedType === 'hat' && i === 4) {
      imageName = `hat5.png`;
    } else if (normalizedType === 'hat' && i === 5) {
      imageName = `hat6.png`;
    } else if (i === 0) {
      imageName = `${normalizedType} 1.png`;
    } else {
      imageName = `${normalizedType} ${i + 1}.png`;
    }
    
    const url = `/Scrapwork copy/${imageName}`;
    
    // Skip if already cached
    if (!imageCache[url]) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        imageCache[url] = true;
      };
    }
  }
};

const DirectImageLoader: React.FC<DirectImageLoaderProps> = ({ 
  productType, 
  index, 
  alt = '', 
  className = 'w-full h-auto object-contain',
  priority = false
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Build the image path based on product type and index
  const getImagePath = (): string => {
    // Handle special cases for file naming
    let imageName;
    const normalizedType = productType.toLowerCase();
    
    if (normalizedType === 'hoodie' && index === 2) {
      imageName = `hoodei 3.png`; // Special case for misspelled filename
    } else if (normalizedType === 'pants' && index === 0) {
      imageName = `panst1.png`; // Special case for misspelled filename  
    } else if (normalizedType === 'hat' && index === 4) {
      imageName = `hat5.png`; // Special case for no space
    } else if (normalizedType === 'hat' && index === 5) {
      imageName = `hat6.png`; // Special case for no space
    } else if (index === 0) {
      imageName = `${normalizedType} 1.png`;
    } else {
      imageName = `${normalizedType} ${index + 1}.png`;
    }
    
    return `/Scrapwork copy/${imageName}`;
  };
  
  useEffect(() => {
    // Reset states when props change
    setIsLoading(true);
    setHasError(false);
    
    const localUrl = getImagePath();
    setImageUrl(localUrl);
    
    // Check if this image is already in cache
    if (imageCache[localUrl]) {
      setIsLoading(false);
      return;
    }
    
    // Preload the image
    const preloadImage = new Image();
    preloadImage.src = localUrl;
    
    preloadImage.onload = () => {
      imageCache[localUrl] = true;
      setIsLoading(false);
    };
    
    preloadImage.onerror = () => {
      console.error(`Error loading image: ${localUrl}`);
      setHasError(true);
      setIsLoading(false);
    };
    
    // If this is a priority image, preload with high priority
    if (priority) {
      preloadImage.loading = 'eager';
      preloadImage.fetchPriority = 'high';
    }
  }, [productType, index, priority]);
  
  // Preload adjacent images for smoother navigation
  useEffect(() => {
    // Preload next and previous images
    const preloadAdjacentImages = () => {
      const nextIndex = (index + 1) % 8; // Assuming max 8 images per product
      const prevIndex = (index - 1 + 8) % 8;
      
      [nextIndex, prevIndex].forEach(idx => {
        // Skip already cached images
        const normalizedType = productType.toLowerCase();
        let imageName;
        
        if (normalizedType === 'hoodie' && idx === 2) {
          imageName = `hoodei 3.png`;
        } else if (normalizedType === 'pants' && idx === 0) {
          imageName = `panst1.png`;
        } else if (normalizedType === 'hat' && idx === 4) {
          imageName = `hat5.png`;
        } else if (normalizedType === 'hat' && idx === 5) {
          imageName = `hat6.png`;
        } else if (idx === 0) {
          imageName = `${normalizedType} 1.png`;
        } else {
          imageName = `${normalizedType} ${idx + 1}.png`;
        }
        
        const adjacentUrl = `/Scrapwork copy/${imageName}`;
        if (!imageCache[adjacentUrl]) {
          const img = new Image();
          img.src = adjacentUrl;
          img.onload = () => {
            imageCache[adjacentUrl] = true;
          };
        }
      });
    };
    
    // Only preload adjacent images if this image isn't loading
    if (!isLoading && !hasError) {
      preloadAdjacentImages();
    }
  }, [productType, index, isLoading, hasError]);
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <img 
        src="/placeholder.svg"
        alt={alt || `${productType} ${index} (placeholder)`}
        className={className}
      />
    );
  }
  
  return (
    <img 
      src={imageUrl}
      alt={alt || `${productType} ${index}`}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={(e) => {
        setHasError(true);
        e.currentTarget.src = '/placeholder.svg';
      }}
    />
  );
};

export default DirectImageLoader; 