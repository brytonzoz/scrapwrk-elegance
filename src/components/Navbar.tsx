import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Home, Info, Mail, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProduct } from "@/context/ProductContext";
import AboutOverlay from "./AboutOverlay";
import ContactOverlay from "./ContactOverlay";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, setCartOpen } = useProduct();
  const [activeTab, setActiveTab] = useState("home");
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scroll when menu is open on mobile
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Also prevent scroll when overlays are open
  useEffect(() => {
    if (showAbout || showContact) {
      document.body.style.overflow = 'hidden';
    } else if (!isMenuOpen) {
      document.body.style.overflow = 'auto';
    }
  }, [showAbout, showContact, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCartClick = () => {
    setCartOpen(true);
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab("about");
    setShowAbout(true);
    setIsMenuOpen(false);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab("contact");
    setShowContact(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-black/30 backdrop-blur-xl py-3 border-b border-white/10" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-2xl tracking-tight hover:scale-105 transition-transform">
            <span className="gradient-text">SCRAPWRK</span>
          </a>

          {isMobile ? (
            <>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCartClick} 
                  className="relative rounded-full bg-white/10 backdrop-blur-md backdrop-saturate-150 hover:bg-white/20 transition-all duration-300"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMenu}
                  className="rounded-full bg-white/10 backdrop-blur-md backdrop-saturate-150 hover:bg-white/20 transition-all duration-300 z-[60]"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* iOS 19-style floating tab bar */}
              <div className="hidden md:flex items-center py-2 px-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full">
                <a 
                  href="/" 
                  className={`px-5 py-2 rounded-full transition-all duration-300 font-medium ${activeTab === "home" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"}`}
                  onClick={() => setActiveTab("home")}
                >
                  Home
                </a>
                <a 
                  href="#" 
                  className={`px-5 py-2 rounded-full transition-all duration-300 font-medium ${activeTab === "about" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"}`}
                  onClick={handleAboutClick}
                >
                  About
                </a>
                <a 
                  href="#" 
                  className={`px-5 py-2 rounded-full transition-all duration-300 font-medium ${activeTab === "contact" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"}`}
                  onClick={handleContactClick}
                >
                  Contact
                </a>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCartClick} 
                className="relative rounded-full bg-white/10 backdrop-blur-md backdrop-saturate-150 hover:bg-white/20 transition-all duration-300"
              >
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
      
      {/* Full-screen mobile menu overlay - OS style */}
      {isMobile && (
        <div 
          className={`fixed inset-0 backdrop-blur-2xl bg-black/10 z-50 transition-all duration-500 ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          {/* Menu content with vertically centered options */}
          <div className="h-full flex flex-col justify-center relative">
            {/* Header mirroring with logo and buttons */}
            <div className="absolute top-0 left-0 right-0 py-5">
              <div className="container mx-auto px-4 flex items-center justify-between">
                <a href="/" className="text-white font-bold text-2xl tracking-tight" onClick={() => setIsMenuOpen(false)}>
                  <span className="gradient-text">SCRAPWRK</span>
                </a>
                
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); handleCartClick(); setIsMenuOpen(false); }} 
                    className="relative rounded-full bg-white/10 backdrop-blur-md backdrop-saturate-150 hover:bg-white/20 transition-all duration-300"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-full bg-white/10 backdrop-blur-md backdrop-saturate-150 hover:bg-white/20 transition-all duration-300 z-[60]"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="container mx-auto px-4">
              <nav className="flex flex-col gap-8">
                <a 
                  href="/" 
                  className="flex items-center gap-3 py-3 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-6 h-6 text-purple-400" />
                  <span className="text-2xl font-bold">Home</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center gap-3 py-3 transition-all duration-300"
                  onClick={handleAboutClick}
                >
                  <Info className="w-6 h-6 text-purple-400" />
                  <span className="text-2xl font-bold">About</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center gap-3 py-3 transition-all duration-300"
                  onClick={handleContactClick}
                >
                  <Mail className="w-6 h-6 text-purple-400" />
                  <span className="text-2xl font-bold">Contact</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* About Overlay */}
      <AboutOverlay isOpen={showAbout} onClose={() => setShowAbout(false)} />
      
      {/* Contact Overlay */}
      <ContactOverlay isOpen={showContact} onClose={() => setShowContact(false)} />
    </>
  );
};

export default Navbar;
