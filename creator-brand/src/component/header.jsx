import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Header({ setHeaderHeight }) {
  const headerRef = useRef();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll background effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Measure and set header height
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight?.(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [setHeaderHeight]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to check active path
  const isActive = (path) => location.pathname === path;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? 'bg-black/30 backdrop-blur-sm shadow-md' : 'bg-black'}
        justify-center items-center flex flex-col py-3 pb-6 border-b-[0.5px] border-neutral-700`}
    >
      {/* Logo and Title */}
      <div
        className="flex flex-row items-center gap-2 cursor-pointer"
        onClick={() => navigate('/', { replace: true, state: {} })}
      >
        <img className="size-12" src="src/assets/img/logo.png" alt="logo" />
        <span className="text-white font-bold font-satoshi text-xl">LinkFluence</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row items-center gap-6 mt-3 relative">
        {/* Explore Dropdown */}
        <div className="relative group">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="text-gray-200 font-satoshi flex items-center gap-1 transition-colors duration-300 relative"
          >
            Explore
            <ChevronDown
              className={`inline size-4 ml-1 transition-transform duration-300 ${
                showDropdown ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
          <span
            className="absolute left-0 -bottom-1 h-[2px] w-full bg-white transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
          ></span>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 22
                }}
                className="absolute top-full left-0 mt-2 w-60 z-50 bg-black/80 backdrop-blur-md border border-neutral-700 rounded-2xl shadow-xl overflow-hidden"
              >
                {[
                  { label: 'Getting Started', hash: 'getting-started' },
                  { label: 'How It Works', hash: 'how-it-works' },
                  { label: 'What Can Be Promoted', hash: 'what-can-be-promoted' },
                  { label: 'Campaign Templates', hash: 'campaign-templates' }
                ].map((item, idx, arr) => (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        navigate(`/explore#${item.hash}`);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition duration-150"
                    >
                      {item.label}
                    </button>

                    {idx < arr.length - 1 && (
                      <div className="mx-4 my-[1px] h-px bg-white/10" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Organization */}
        <div className="relative group">
          <button
            onClick={() => navigate('/organization', { replace: true, state: {} })}
            className={`text-gray-200 font-satoshi transition duration-300 ${
              isActive('/organization') ? 'font-bold text-white' : ''
            }`}
          >
            Organization
          </button>
          <span
            className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transition-transform duration-300 origin-left
              ${isActive('/organization') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
          ></span>
        </div>

        {/* Influencer */}
        <div className="relative group">
          <button
            onClick={() => navigate('/influencer', { replace: true, state: {} })}
            className={`text-gray-200 font-satoshi transition duration-300 ${
              isActive('/influencer') ? 'font-bold text-white' : ''
            }`}
          >
            Influencer
          </button>
          <span
            className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transition-transform duration-300 origin-left
              ${isActive('/influencer') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
          ></span>
        </div>

        {/* Pro Member */}
        <div className="relative group">
          <button
            onClick={() => navigate('/pro', { replace: true, state: {} })}
            className="bg-neutral-900 text-white px-4 py-3 rounded-full font-semibold border border-neutral-700 transition-all duration-500 ease-out hover:bg-neutral-800 hover:border-neutral-600
                     hover:scale-110 hover:px-8 hover:shadow-2xl hover:shadow-white/20
                     relative z-10"
          >
            Join Pro
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;