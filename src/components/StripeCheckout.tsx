import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CreditCard, Shield } from 'lucide-react';
import type { ShippingInfo } from './ShippingForm';
import { createCheckout } from '@/lib/api';

interface StripeCheckoutProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  className?: string;
  buttonText?: string;
  shippingInfo?: ShippingInfo;
  productId: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

const StripeCheckout = ({ 
  amount, 
  onSuccess, 
  onError, 
  className,
  buttonText = "Complete Payment",
  shippingInfo,
  productId
}: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Initialize billing details from shipping info if available
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}` : '',
    email: shippingInfo?.email || '',
    phone: shippingInfo?.phone || '',
    address: {
      line1: shippingInfo?.address || '',
      line2: '',
      city: shippingInfo?.city || '',
      state: shippingInfo?.state || '',
      postal_code: shippingInfo?.zipCode || '',
      country: shippingInfo?.country || 'US',
    }
  });
  
  // Use the same billing address as shipping
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setBillingDetails(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }));
      }
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsShipping(e.target.checked);
    
    // If checked, use shipping info for billing
    if (e.target.checked && shippingInfo) {
      setBillingDetails({
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: {
          line1: shippingInfo.address,
          line2: '',
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.zipCode,
          country: shippingInfo.country,
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Use the Supabase Edge Function to create checkout
      const checkoutResult = await createCheckout(productId);
      
      if (!checkoutResult.success || !checkoutResult.checkoutUrl) {
        throw new Error(checkoutResult.message || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe checkout URL
      window.location.href = checkoutResult.checkoutUrl;
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      onError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsProcessing(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6 pb-24", className)}>
      <div className="ios19-card bg-black/30 border border-white/20 backdrop-blur-xl p-6 rounded-3xl">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        
        {shippingInfo && (
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={sameAsShipping}
              onChange={handleCheckboxChange}
              className="mr-2 h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="sameAsShipping" className="text-sm text-gray-300">
              Use my shipping address for billing
            </label>
          </div>
        )}
        
        {!sameAsShipping && (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className={labelClasses}>Full Name on Card</label>
              <input
                type="text"
                id="name"
                name="name"
                value={billingDetails.name}
                onChange={handleDetailsChange}
                className={inputClasses}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className={labelClasses}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={billingDetails.email}
                  onChange={handleDetailsChange}
                  className={inputClasses}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClasses}>Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={billingDetails.phone}
                  onChange={handleDetailsChange}
                  className={inputClasses}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address.line1" className={labelClasses}>Address</label>
              <input
                type="text"
                id="address.line1"
                name="address.line1"
                value={billingDetails.address.line1}
                onChange={handleDetailsChange}
                className={inputClasses}
                placeholder="123 Main St"
                required
              />
            </div>
            
            <div>
              <label htmlFor="address.line2" className={labelClasses}>Address Line 2 (Optional)</label>
              <input
                type="text"
                id="address.line2"
                name="address.line2"
                value={billingDetails.address.line2}
                onChange={handleDetailsChange}
                className={inputClasses}
                placeholder="Apt, Suite, etc."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.city" className={labelClasses}>City</label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={billingDetails.address.city}
                  onChange={handleDetailsChange}
                  className={inputClasses}
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <label htmlFor="address.state" className={labelClasses}>State</label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={billingDetails.address.state}
                  onChange={handleDetailsChange}
                  className={inputClasses}
                  placeholder="NY"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.postal_code" className={labelClasses}>ZIP Code</label>
                <input
                  type="text"
                  id="address.postal_code"
                  name="address.postal_code"
                  value={billingDetails.address.postal_code}
                  onChange={handleDetailsChange}
                  className={inputClasses}
                  placeholder="10001"
                  required
                />
              </div>
              <div>
                <label htmlFor="address.country" className={labelClasses}>Country</label>
                <input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={billingDetails.address.country}
                  onChange={handleDetailsChange}
                  className={inputClasses}
                  placeholder="US"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Card Details</h4>
          
          <div className="mb-6">
            <div className="mb-4">
              <label className={labelClasses}>Card Number</label>
              <div className={`${inputClasses} flex items-center`}>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Expiration Date</label>
                <div className={`${inputClasses} p-3 text-gray-400 text-sm`}>
                  MM/YY (Enter in card field above)
                </div>
              </div>
              <div>
                <label className={labelClasses}>CVC</label>
                <div className={`${inputClasses} p-3 text-gray-400 text-sm`}>
                  123 (Enter in card field above)
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-6 pt-6">
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-300">Total</span>
            <span className="font-semibold text-white">${(amount / 100).toFixed(2)}</span>
          </div>
          
          <Button
            disabled={isProcessing || !stripe}
            className="w-full ios19-button bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg py-6 animate-button-pulse"
            type="submit"
          >
            <span className="flex items-center justify-center">
              {isProcessing ? 'Processing...' : buttonText}
              {!isProcessing && <Shield className="ml-2 h-5 w-5" />}
            </span>
          </Button>
          
          {errorMessage && (
            <div className="text-red-500 text-sm mt-4 p-3 bg-red-500/10 rounded-xl">
              {errorMessage}
            </div>
          )}
          
          <div className="flex items-center justify-center mt-4">
            <svg className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs text-gray-400">Secure payment via Stripe</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default StripeCheckout; 