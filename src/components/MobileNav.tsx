import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showJoinButton, setShowJoinButton] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setShowJoinButton(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (!isHomePage) {
      navigate(`/${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-[#0E2A47] p-2"
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#0E2A47] p-2"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="px-6 py-4">
            <ul className="space-y-4">
              <li>
                <a
                  href="#benefits"
                  onClick={(e) => handleNavClick(e, 'benefits')}
                  className="block text-lg text-[#0E2A47] hover:text-[#F9A826] py-2"
                >
                  Benefits
                </a>
              </li>
              <li>
                <a
                  href="#savings"
                  onClick={(e) => handleNavClick(e, 'savings')}
                  className="block text-lg text-[#0E2A47] hover:text-[#F9A826] py-2"
                >
                  Savings
                </a>
              </li>
              <li>
                <a
                  href="#quiz"
                  onClick={(e) => handleNavClick(e, 'quiz')}
                  className="block text-lg text-[#0E2A47] hover:text-[#F9A826] py-2"
                >
                  Allergy Quiz
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  onClick={(e) => handleNavClick(e, 'blog')}
                  className="block text-lg text-[#0E2A47] hover:text-[#F9A826] py-2"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleNavClick(e, 'faq')}
                  className="block text-lg text-[#0E2A47] hover:text-[#F9A826] py-2"
                >
                  FAQ
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <a
                href="#waitlist"
                onClick={(e) => handleNavClick(e, 'waitlist')}
                className="block w-full bg-[#F9A826] text-white text-center font-semibold px-6 py-3 rounded-xl hover:bg-[#F9A826]/90 transition-colors"
              >
                Join Waitlist
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Sticky Join Button */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden transition-all duration-300 ${
          showJoinButton ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <a
          href="#waitlist"
          onClick={(e) => handleNavClick(e, 'waitlist')}
          className="bg-[#F9A826] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#F9A826]/90 transition-colors whitespace-nowrap"
        >
          Join Waitlist
        </a>
      </div>
    </>
  );
};

export default MobileNav;