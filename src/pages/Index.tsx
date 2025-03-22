
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
import ProductCarousel from "@/components/ProductCarousel";

const Index = () => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("product-1");
  
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

  // Product options for the carousel
  const productOptions = [
    { id: "product-1", name: "SCRAPWRK 001: HOODIE", image: "/images/product-1.jpg" },
    { id: "product-2", name: "SCRAPWRK 002: PANTS", image: "/images/product-2.jpg" },
    { id: "product-3", name: "SCRAPWRK 003: HAT", image: "/images/product-3.jpg" },
  ];

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    // In a real app, we would fetch the product data based on ID
    // For now, we'll continue using our fallback/mock product
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
    return (
      <FallbackProduct 
        onAddToCart={handleAddToCart} 
        isAdding={isAdding} 
        productOptions={productOptions}
        onProductSelect={handleProductSelect}
        selectedProductId={selectedProductId}
      />
    );
  }

  // Use the data from API if available, otherwise use fallback
  return product ? (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="h-24"></div> {/* Spacer for better breathing room after navbar */}
      <main>
        <div className="container mx-auto px-4 mb-12">
          <ProductCarousel 
            products={productOptions} 
            selectedProductId={selectedProductId} 
            onProductSelect={handleProductSelect} 
          />
        </div>
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
    <FallbackProduct 
      onAddToCart={handleAddToCart} 
      isAdding={isAdding} 
      productOptions={productOptions}
      onProductSelect={handleProductSelect}
      selectedProductId={selectedProductId}
    />
  );
};

// Fallback component with hardcoded data until we connect Supabase
const FallbackProduct = ({ onAddToCart, isAdding, productOptions, onProductSelect, selectedProductId }) => {
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
      <div className="h-24"></div> {/* Spacer for better breathing room after navbar */}
      <main>
        <div className="container mx-auto px-4 mb-12">
          <ProductCarousel 
            products={productOptions} 
            selectedProductId={selectedProductId} 
            onProductSelect={onProductSelect} 
          />
        </div>
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
