import { useState, useEffect } from "react";
import { X, Trash2, ChevronLeft, CreditCard, Package, Clock, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/context/ProductContext";
import { cn } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const SideCart = ({ isOpen, onClose, items, onRemove, onQuantityChange }: SideCartProps) => {
  const [mounted, setMounted] = useState(false);
  const { cartTimeRemaining, isLoading, proceedToCheckout } = useProduct();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Debug cartTimeRemaining
  useEffect(() => {
    console.log("Cart time remaining value:", cartTimeRemaining);
  }, [cartTimeRemaining]);

  // Calculate total with explicit type annotation
  const subtotal = items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  
  // Format currency
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  // Format time remaining
  const formatTimeRemaining = (ms: number | null): string => {
    if (ms === null) return "00:00";
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get timer color based on time remaining
  const getTimerColor = (ms: number | null): string => {
    if (ms === null) return "text-gray-400";
    
    // Less than 1 minute - red
    if (ms < 60000) return "text-red-500";
    // Less than 3 minutes - orange
    if (ms < 180000) return "text-orange-400";
    // Otherwise - green
    return "text-green-400";
  };

  // Start checkout process directly with Stripe
  const handleCheckout = async () => {
    if (items.length === 0) return;
    await proceedToCheckout();
  };

  // If not mounted, don't render anything
  if (!mounted) return null;

  return (
    <>
      {/* Overlay with blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
          onClick={onClose}
        />
      )}
      
      {/* Side cart panel */}
      <div 
        className={`fixed ${isMobile ? 'bottom-0 left-0 right-0 h-[95%] rounded-t-3xl' : 'top-0 right-0 h-full w-full sm:w-[400px] border-l border-white/20 sm:rounded-l-3xl'} ios19-glass bg-black/70 backdrop-blur-2xl z-50 shadow-2xl transform transition-all duration-500 ease-out ${
          isOpen ? isMobile ? "translate-y-0" : "translate-x-0" : isMobile ? "translate-y-full" : "translate-x-full"
        } flex flex-col overflow-hidden m-0 sm:my-0 sm:mr-0 sm:ml-auto`}
        style={{ padding: isMobile ? '2px 2px 0 2px' : '0' }}
      >
        <div className={isMobile ? 'w-full h-full rounded-t-3xl bg-black/70 backdrop-blur-2xl overflow-hidden flex flex-col' : 'w-full h-full flex flex-col'}>
          {/* Cart header */}
          <div className={`p-5 border-b border-white/10 flex items-center justify-between relative`}>
            <div className="flex items-center gap-2">
                <button 
                  onClick={onClose}
                  className="ios19-icon rounded-full hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              <h2 className="text-xl font-semibold">
                Your Cart
              </h2>
            </div>
            
              <span className="text-sm px-3 py-1 ios19-pill bg-black/50 border border-white/10">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
          </div>
          
          {/* Reservation Timer Banner */}
          {cartTimeRemaining !== null && (
            <div className={cn(
              "px-5 py-3 border-b border-white/10 flex items-center justify-between", 
              cartTimeRemaining < 60000 ? "bg-red-500/20 border-red-500/30" :
              cartTimeRemaining < 180000 ? "bg-orange-500/20 border-orange-500/30" : 
              "bg-green-500/20 border-green-500/30"
            )}>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${getTimerColor(cartTimeRemaining)}`} />
                <span className="text-sm font-medium">Items Reserved For:</span>
              </div>
              <div className={`font-mono text-lg font-bold ${getTimerColor(cartTimeRemaining)}`}>
                {formatTimeRemaining(cartTimeRemaining)}
              </div>
            </div>
          )}
          
          {/* Main content area - scrollable */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Cart items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {items.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 ios19-icon rounded-full bg-white/5">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg">Your cart is empty</p>
                    <Button 
                      onClick={onClose}
                      className="mt-8 ios19-button bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg py-6 px-8 mx-auto font-medium text-lg"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <>
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="ios19-card bg-black/30 border border-white/20 backdrop-blur-xl rounded-3xl transition-all duration-300 animate-fade-in"
                      >
                      <div className="flex gap-4 p-4">
                          <div className="w-20 h-20 bg-gray-800 rounded-2xl overflow-hidden">
                            <img 
                              src={item.image || '/placeholder.svg'} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.name}</h3>
                              <button 
                                onClick={() => onRemove(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-gray-400 text-sm">${item.price}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-sm px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">Limited Edition (1 of 1)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
          </div>
          
          {/* Cart summary and checkout button */}
          {items.length > 0 && (
            <div className="p-5 ios19-glass bg-black/30 border-t border-white/20 sm:rounded-bl-3xl">
              <div className="space-y-3 mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400 font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full ios19-button bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg py-6 animate-button-pulse"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                <CreditCard className="mr-2 h-5 w-5" />
                {cartTimeRemaining && cartTimeRemaining < 180000 ? 'Checkout Now' : 'Checkout'}
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center mt-4 text-gray-400">
                Your items are reserved for a limited time only
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideCart;
