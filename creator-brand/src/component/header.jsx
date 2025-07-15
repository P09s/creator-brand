import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

function Header({ setHeaderHeight }) {
  const headerRef = useRef();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Measure header height and update on resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight(); // Initial call
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [setHeaderHeight]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? 'bg-black/30 backdrop-blur-sm shadow-md' : 'bg-black'}
        justify-center items-center flex flex-col py-3 pb-1`}
    >
      {/* Logo and Title */}
      <div className="flex flex-row items-center gap-2">
        <img className="size-12" src="src/assets/img/logo.png" alt="logo" />
        <span className="text-white font-bold font-satoshi text-xl">LinkFluence</span>
      </div>

      {/* Navigation */}
      <div className="flex flex-row items-center gap-6 mt-3">
        <span className="text-gray-200 font-satoshi flex items-center">
          Explore
          <ChevronDown className="inline size-4 ml-1" />
        </span>
        <span className="text-gray-200 font-satoshi ">Organization</span>
        <span className="text-gray-200 font-satoshi">Influencer</span>
        <span className="text-gray-200 font-bold font-satoshi flex items-center gap-1">
          Pro Member
        </span>
      </div>
    </header>
  );
}

export default Header;
