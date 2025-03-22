
import { useState, useEffect } from "react";
import { XIcon, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const SideCart = ({ isOpen, onClose, items, onRemove, onQuantityChange }: SideCartProps) => {
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Calculate total whenever items change
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [items]);

  const updateQuantity = (id: string, change: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      onQuantityChange(id, newQuantity);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[85vh] fixed right-0 top-0 w-full max-w-sm bg-black border-l border-gray-800">
        <DrawerHeader className="border-b border-gray-800 px-6">
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="rounded-full p-2 hover:bg-gray-800" onClick={onClose}>
                <XIcon className="h-5 w-5 text-gray-400" />
                <span className="sr-only">Close</span>
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-auto py-4 px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-2">Add items to get started</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex gap-4">
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-900 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm">{item.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">{formatCurrency(item.price)}</p>
                    
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="mx-2 text-sm text-white w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="ml-auto text-gray-400 hover:text-white text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DrawerFooter className="border-t border-gray-800 px-6 py-4">
          <div className="flex justify-between mb-4">
            <span className="text-gray-300">Subtotal</span>
            <span className="text-white font-medium">{formatCurrency(cartTotal)}</span>
          </div>
          
          <Button 
            disabled={items.length === 0}
            className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white py-6"
          >
            Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            Shipping calculated at checkout
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SideCart;
