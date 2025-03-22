
import { Button } from "@/components/ui/button";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { useProduct } from "@/context/ProductContext";

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

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {product.name}
        </h1>
        
        <div className="mb-6">
          <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
          <span className="ml-2 text-gray-400">USD</span>
        </div>
        
        <p className="text-gray-300 mb-8 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-1 text-purple-400">•</span>
                <span>{typeof feature === 'string' ? feature : feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={handleAddToCart} 
          disabled={isAdding}
          className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white py-6"
        >
          {isAdding ? (
            <>
              <Check className="mr-2 h-4 w-4 animate-pulse" />
              Adding to Cart
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 py-6"
          onClick={handleViewCart}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          View Cart
        </Button>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Free shipping on all orders. One-of-a-kind item.
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
