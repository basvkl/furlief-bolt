import React, { useState, useEffect } from 'react';
import { PawPrint as Paw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MobileNav from './MobileNav';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (!isHomePage) {
      window.location.href = `/${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <Paw 
            size={28} 
            className="text-[#F9A826] mr-2 transition-transform group-hover:scale-110" 
            strokeWidth={2.5} 
          />
          <span className="text-[#0E2A47] font-bold text-xl md:text-2xl group-hover:text-[#F9A826] transition-colors">
            Furlief
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="#benefits" 
            onClick={(e) => handleNavClick(e, 'benefits')}
            className="text-[#0E2A47] hover:text-[#F9A826] transition-colors"
          >
            Benefits
          </a>
          <a 
            href="#savings" 
            onClick={(e) => handleNavClick(e, 'savings')}
            className="text-[#0E2A47] hover:text-[#F9A826] transition-colors"
          >
            Savings
          </a>
          <a 
            href="#quiz" 
            onClick={(e) => handleNavClick(e, 'quiz')}
            className="text-[#0E2A47] hover:text-[#F9A826] transition-colors"
          >
            Allergy Quiz
          </a>
          <a 
            href="#blog" 
            onClick={(e) => handleNavClick(e, 'blog')}
            className="text-[#0E2A47] hover:text-[#F9A826] transition-colors"
          >
            Blog
          </a>
          <a 
            href="#faq" 
            onClick={(e) => handleNavClick(e, 'faq')}
            className="text-[#0E2A47] hover:text-[#F9A826] transition-colors"
          >
            FAQ
          </a>
        </div>
        
        <div className="flex items-center">
          <div className="bg-[#F9A826]/20 px-3 py-1 rounded-full text-xs font-medium text-[#F9A826] mr-3">
            Coming Soon
          </div>
          <Link 
            to="/waitlist"
            className="hidden md:inline-block bg-[#F9A826] hover:bg-[#F9A826]/90 text-white font-medium px-4 py-2 rounded-full transition-colors duration-300"
          >
            Join Waitlist
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;