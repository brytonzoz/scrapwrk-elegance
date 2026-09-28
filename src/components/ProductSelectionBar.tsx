import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductSelectionBarProps {
  products: Product[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
}

const ProductSelectionBar = ({ 
  products,
  selectedProductId,
  onProductSelect
}: ProductSelectionBarProps) => {
  // Limit to showing only 3 products
  const displayProducts = products.slice(0, 3);
  
  return (
    <div className="absolute -top-6 sm:-top-5 left-2 sm:left-4 transform-none z-10 py-1.5 px-2 ios19-glass rounded-2xl flex flex-row items-center justify-center gap-3 md:gap-5 shadow-xl border border-white/20 animate-fade-in">
      {displayProducts.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductSelect(product.id)}
          className={cn(
            "w-10 h-10 md:w-12 md:h-12 rounded-xl relative overflow-hidden transition-all duration-300 transform",
            selectedProductId === product.id 
              ? "ring-2 ring-purple-500/70 scale-110" 
              : "ring-1 ring-white/20 hover:ring-white/40 hover:scale-105"
          )}
          aria-label={`Select ${product.name}`}
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Error loading thumbnail image: ${product.image}`);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          {selectedProductId === product.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default ProductSelectionBar; 