import React from 'react';
import { PawPrint as Paw, Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0E2A47] text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 md:mb-12">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start mb-4">
              <Paw size={28} className="text-[#F9A826] mr-2" />
              <span className="font-bold text-2xl">Furlief</span>
            </Link>
            <p className="text-white/70 max-w-xs mx-auto md:mx-0">
              Affordable pet allergy relief, launching November 2026
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-4 text-[#F9A826]">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
                <li><a href="#benefits" className="text-white/70 hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="text-white/70 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#waitlist" className="text-white/70 hover:text-white transition-colors">Waitlist</a></li>
                <li><Link to="/waitlist" className="text-white/70 hover:text-white transition-colors">Waitlist Landing Page</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-[#F9A826]">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center justify-center md:justify-start">
                  <Mail size={16} className="mr-2 text-white/70" />
                  <a href="mailto:info@furlief.com" className="text-white/70 hover:text-white transition-colors">
                    info@furlief.com
                  </a>
                </li>
              </ul>
              
              <h3 className="font-semibold mt-6 mb-4 text-[#F9A826]">Follow Us</h3>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Furlief. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;