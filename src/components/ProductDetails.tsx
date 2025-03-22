
import { Button } from "@/components/ui/button";
import { Plus, Check, ShoppingBag, Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { useProduct } from "@/context/ProductContext";
import { cn } from "@/lib/utils";

interface Feature {
  id?: string;
  text: string;
}

interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  features: string[] | Feature[];
}

interface ProductDetailsProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  onAddToCart
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { cartOpen, setCartOpen } = useProduct();
  
  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart();
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleViewCart = () => {
    setCartOpen(true);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="flex flex-col h-full justify-between animate-fade-in">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {product.name}
        </h1>
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
            <span className="ml-2 text-gray-400">USD</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLike}
            className={cn(
              "rounded-full transition-all duration-300",
              isLiked && "text-red-500 hover:text-red-400"
            )}
          >
            <Heart className={cn(
              "h-6 w-6 transition-all duration-300",
              isLiked && "fill-red-500 scale-110"
            )} />
          </Button>
        </div>
        
        <p className="text-gray-300 mb-8 leading-relaxed text-lg">
          {product.description}
        </p>
        
        <div className="mb-8 transform transition-all duration-500 hover:translate-x-2">
          <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">Features</h2>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start transition-all duration-300 hover:translate-x-1">
                <span className="mr-2 mt-1 text-purple-400">•</span>
                <span className="text-gray-200">{typeof feature === 'string' ? feature : feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={handleAddToCart} 
          disabled={isAdding}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white py-7 rounded-xl transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
        >
          {isAdding ? (
            <>
              <Check className="mr-2 h-5 w-5 animate-pulse" />
              Adding to Cart
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 py-7 rounded-xl transition-all duration-300 hover:border-purple-500"
          onClick={handleViewCart}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          View Cart
        </Button>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Free worldwide shipping. One-of-a-kind item. 30-day returns.
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
