
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProduct } from "@/context/ProductContext";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, setCartOpen } = useProduct();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCartClick = () => {
    setCartOpen(true);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-2xl tracking-tight hover:scale-105 transition-transform">
          SCRAP<span className="text-purple-400">WRK</span>
        </a>

        {isMobile ? (
          <>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleCartClick} className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
            
            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="fixed inset-0 top-16 bg-black/95 backdrop-blur-sm z-40 p-4 animate-fade-in">
                <nav className="flex flex-col gap-4">
                  <a href="/" className="text-lg py-3 border-b border-gray-800 hover:text-purple-400 transition-colors">Home</a>
                  <a href="/about" className="text-lg py-3 border-b border-gray-800 hover:text-purple-400 transition-colors">About</a>
                  <a href="/contact" className="text-lg py-3 border-b border-gray-800 hover:text-purple-400 transition-colors">Contact</a>
                </nav>
              </div>
            )}
          </>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-white hover:text-purple-400 transition-colors">Home</a>
              <a href="/about" className="text-white hover:text-purple-400 transition-colors">About</a>
              <a href="/contact" className="text-white hover:text-purple-400 transition-colors">Contact</a>
            </nav>
            
            <Button variant="ghost" size="icon" onClick={handleCartClick} className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
