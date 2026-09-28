import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import TermsOverlay from './TermsOverlay';
import PrivacyOverlay from './PrivacyOverlay';

const Footer = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <footer className="py-10 sm:py-16 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-purple-950/20 pointer-events-none"></div>
      
      {/* iOS 19-style glass container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="ios19-card border border-white/10 mb-8 sm:mb-12 rounded-2xl p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {/* About */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold gradient-text">SCRAPWRK</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Premium apparel with cutting-edge style. 
                Designed for those who demand quality and innovation.
              </p>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <a href="#" className="ios19-icon rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/20 active:bg-white/30 transition-all duration-300 flex items-center justify-center touch-manipulation">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="ios19-icon rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/20 active:bg-white/30 transition-all duration-300 flex items-center justify-center touch-manipulation">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="ios19-icon rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/20 active:bg-white/30 transition-all duration-300 flex items-center justify-center touch-manipulation">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="ios19-icon rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:bg-white/20 active:bg-white/30 transition-all duration-300 flex items-center justify-center touch-manipulation">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
            
            {/* Contact */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-medium text-white/90">Contact Us</h3>
              <ul className="space-y-4 sm:space-y-5">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-3" />
                  <span className="text-sm sm:text-base text-gray-300">+1 (469) 651-2656</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-3" />
                  <span className="text-sm sm:text-base text-gray-300 break-all">bryton.p.zoz@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="ios19-card border border-white/10 mb-8 sm:mb-12 rounded-2xl p-5 sm:p-6">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Stay Updated</h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 max-w-lg mx-auto">
              Subscribe to our newsletter for the latest product releases and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="ios19-glass flex-1 py-2 sm:py-3 px-4 rounded-full bg-white/10 text-sm sm:text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button className="ios19-button bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:opacity-100 py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base touch-manipulation">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-400 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} SCRAPWRK. All rights reserved.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-4 sm:gap-6">
            <button 
              onClick={() => setIsPrivacyOpen(true)} 
              className="hover:text-white transition-colors duration-300 py-1 sm:py-2 text-xs sm:text-sm touch-manipulation"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setIsTermsOpen(true)} 
              className="hover:text-white transition-colors duration-300 py-1 sm:py-2 text-xs sm:text-sm touch-manipulation"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal Overlays */}
      <TermsOverlay isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyOverlay isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </footer>
  );
};

export default Footer;
