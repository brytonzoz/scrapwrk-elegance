import { useState, useEffect } from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FreeShippingNotificationProps {
  onClose: () => void;
  className?: string;
}

const FreeShippingNotification = ({ onClose, className = '' }: FreeShippingNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay showing the notification for a better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Add delay before calling onClose to let animation complete
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md"
      />
      
      <div className="ios19-card bg-black/50 border border-white/20 backdrop-blur-xl p-6 rounded-3xl w-full max-w-sm animate-float-in relative z-10 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500/20 mx-auto rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-purple-300" />
          </div>
          
          <h3 className="text-xl font-bold mb-2 gradient-text">Free Shipping</h3>
          
          <p className="text-gray-300 mb-4">
            Good news! Your order qualifies for free shipping within the United States.
          </p>
          
          <div className="ios19-glass bg-white/5 p-3 rounded-xl mb-8">
            <p className="text-sm text-white">
              Your shipping details have been saved. Proceed to payment to complete your order.
            </p>
          </div>
          
          <Button
            onClick={handleClose}
            className="w-full ios19-button bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg py-6 animate-button-pulse"
          >
            <span className="flex items-center justify-center">
              Continue to Payment
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreeShippingNotification; 