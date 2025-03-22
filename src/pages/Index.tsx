
import { Button } from "@/components/ui/button";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ProductDetails from "@/components/ProductDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";
import SideCart from "@/components/SideCart";
import { useProduct, ProductProvider } from "@/context/ProductContext";
import { ShoppingBag, Loader2 } from "lucide-react";

// Wrapper component that uses the context
const IndexContent = () => {
  const { 
    products, 
    isLoading,
    error,
    selectedProductId, 
    setSelectedProductId, 
    selectedProduct,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    cartOpen,
    setCartOpen
  } = useProduct();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
        <div className="text-white text-xl">Loading amazing products...</div>
      </div>
    );
  }

  if (error || !products.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="text-red-500 text-xl mb-4">
          {error || "No products found. Please try again later."}
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white text-xl">Finding your perfect match...</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(selectedProduct);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="h-24"></div> {/* Spacer for better breathing room after navbar */}
      
      {/* Cart Toggle Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button 
          onClick={() => setCartOpen(true)} 
          size="icon"
          className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg transform hover:scale-110 transition-all duration-300"
        >
          <ShoppingBag className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </div>
      
      {/* Side Cart */}
      <SideCart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        items={cartItems}
        onRemove={removeFromCart}
        onQuantityChange={updateCartItemQuantity}
      />
      
      <main className="animate-fade-in">
        <div className="container mx-auto px-4 mb-8">
          <ProductCarousel 
            products={products.map(p => ({
              id: p.id,
              name: p.name,
              image: p.images[0] || '/placeholder.svg'
            }))} 
            selectedProductId={selectedProductId} 
            onProductSelect={setSelectedProductId} 
          />
        </div>
        
        <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="relative transform hover:scale-[1.02] transition-all duration-500">
            <ProductImageCarousel images={selectedProduct.images} />
          </div>
          <ProductDetails 
            product={selectedProduct} 
            onAddToCart={handleAddToCart} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Main component that provides the context
const Index = () => {
  return (
    <ProductProvider>
      <IndexContent />
    </ProductProvider>
  );
};

export default Index;
