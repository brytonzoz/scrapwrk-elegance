import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

interface ShippingFormProps {
  onSubmit: (shippingInfo: ShippingInfo) => void;
  className?: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

const ShippingForm = ({ onSubmit, className }: ShippingFormProps) => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingInfo, string>> = {};

    // Required fields
    const requiredFields: (keyof ShippingInfo)[] = [
      'firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode', 'country'
    ];

    requiredFields.forEach(field => {
      if (!shippingInfo[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (shippingInfo.email && !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // US Zip code validation (if country is US)
    if (shippingInfo.country === 'United States' && shippingInfo.zipCode && !/^\d{5}(-\d{4})?$/.test(shippingInfo.zipCode)) {
      newErrors.zipCode = 'Please enter a valid US ZIP code';
    }

    // Phone validation (basic)
    if (shippingInfo.phone && !/^[+\d() -]{10,20}$/.test(shippingInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ShippingInfo]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(shippingInfo);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50";
  const errorClasses = "text-red-400 text-xs mt-1";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <>
      <form onSubmit={handleSubmit} className={`space-y-4 pb-20 ${className}`}>
        <div className="ios19-card bg-black/30 border border-white/20 backdrop-blur-xl p-6 rounded-3xl">
          <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClasses}>First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleChange}
                className={inputClasses}
                placeholder="John"
              />
              {errors.firstName && <p className={errorClasses}>{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className={labelClasses}>Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Doe"
              />
              {errors.lastName && <p className={errorClasses}>{errors.lastName}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="email" className={labelClasses}>Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={shippingInfo.email}
              onChange={handleChange}
              className={inputClasses}
              placeholder="email@example.com"
            />
            {errors.email && <p className={errorClasses}>{errors.email}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="address" className={labelClasses}>Street Address*</label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingInfo.address}
              onChange={handleChange}
              className={inputClasses}
              placeholder="123 Main St"
            />
            {errors.address && <p className={errorClasses}>{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="city" className={labelClasses}>City*</label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleChange}
                className={inputClasses}
                placeholder="New York"
              />
              {errors.city && <p className={errorClasses}>{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state" className={labelClasses}>State/Province*</label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingInfo.state}
                onChange={handleChange}
                className={inputClasses}
                placeholder="NY"
              />
              {errors.state && <p className={errorClasses}>{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="zipCode" className={labelClasses}>ZIP/Postal Code*</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleChange}
                className={inputClasses}
                placeholder="10001"
              />
              {errors.zipCode && <p className={errorClasses}>{errors.zipCode}</p>}
            </div>

            <div>
              <label htmlFor="country" className={labelClasses}>Country*</label>
              <select
                id="country"
                name="country"
                value={shippingInfo.country}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
                {/* Add more countries as needed */}
              </select>
              {errors.country && <p className={errorClasses}>{errors.country}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="phone" className={labelClasses}>Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleChange}
              className={inputClasses}
              placeholder="(123) 456-7890"
            />
            {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full ios19-button bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg py-6 animate-button-pulse mb-10"
        >
          <span className="flex items-center justify-center">
            <MapPin className="mr-2 h-5 w-5" />
            Continue to Payment
            <ArrowRight className="ml-2 h-5 w-5" />
          </span>
        </Button>
      </form>
    </>
  );
};

export default ShippingForm; 