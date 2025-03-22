
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ProductDetails from "@/components/ProductDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentProduct } from "@/lib/api";

const Index = () => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['currentProduct'],
    queryFn: fetchCurrentProduct,
  });

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      toast({
        title: "Added to cart",
        description: "Your item has been added to your cart",
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    console.error("Failed to load product:", error);
    // Fall back to hardcoded product while we set up backend
    return <FallbackProduct onAddToCart={handleAddToCart} isAdding={isAdding} />;
  }

  // Use the data from API if available, otherwise use fallback
  return product ? (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="relative">
            <ProductImageCarousel images={product.images} />
          </div>
          <ProductDetails 
            product={product} 
            onAddToCart={handleAddToCart} 
            isAdding={isAdding} 
          />
        </div>
      </main>
      <Footer />
    </div>
  ) : (
    <FallbackProduct onAddToCart={handleAddToCart} isAdding={isAdding} />
  );
};

// Fallback component with hardcoded data until we connect Supabase
const FallbackProduct = ({ onAddToCart, isAdding }) => {
  const fallbackProduct = {
    name: "QUANTUM SCRAP JACKET",
    price: 499,
    description: "One-of-a-kind handcrafted jacket made from premium recycled materials. Each piece represents the perfect fusion of sustainability and high fashion.",
    features: [
      "Handmade in limited quantities",
      "Sustainable materials",
      "Unique design - no two pieces are alike",
      "Water-resistant outer layer",
    ]
  };

  const fallbackImages = [
    "/images/product-1.jpg",
    "/images/product-2.jpg",
    "/images/product-3.jpg",
    "/images/product-4.jpg",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="relative">
            <ProductImageCarousel images={fallbackImages} />
          </div>
          <ProductDetails 
            product={fallbackProduct} 
            onAddToCart={onAddToCart} 
            isAdding={isAdding} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
