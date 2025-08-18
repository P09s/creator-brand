import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SignInModal from '../auth/SignInModal';

function Header({ setHeaderHeight }) {
  const headerRef = useRef();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSignInModal ? 'hidden' : 'auto';
  }, [showSignInModal]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setShowDropdown(false);
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
          ${scrolled ? 'bg-black/30 backdrop-blur-sm shadow-md' : 'bg-black'}
          border-b-[0.5px] border-gray-800 px-6 py-3`}
      >
        <div className="relative flex justify-center items-center w-full">
          <div className="flex flex-col items-center z-10">
            <div
              className="flex flex-row items-center gap-2 cursor-pointer"
              onClick={() => navigate('/', { replace: true })}
            >
              <img className="size-12" src="src/assets/img/logo.png" alt="logo" />
              <span className="text-white font-bold font-satoshi text-xl">LinkFluence</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex flex-row items-center gap-6 mt-3 relative">
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
                        damping: 22,
                      }}
                      className="absolute top-full left-0 mt-2 w-60 z-50 bg-black/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl overflow-hidden"
                    >
                      {[
                        { label: 'Getting Started', hash: 'getting-started' },
                        { label: 'How It Works', hash: 'how-it-works' },
                        { label: 'What Can Be Promoted', hash: 'what-can-be-promoted' },
                        { label: 'Campaign Templates', hash: 'campaign-templates' },
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
              <div className="relative group">
                <button
                  onClick={() => navigate('/organization', { replace: true })}
                  className={`text-gray-200 font-satoshi transition duration-300 ${
                    isActive('/organization') ? 'font-bold text-white' : ''
                  }`}
                >
                  Organization
                </button>
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transition-transform duration-300 origin-left ${
                    isActive('/organization') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </div>
              <div className="relative group">
                <button
                  onClick={() => navigate('/influencer', { replace: true })}
                  className={`text-gray-200 font-satoshi transition duration-300 ${
                    isActive('/influencer') ? 'font-bold text-white' : ''
                  }`}
                >
                  Influencer
                </button>
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transition-transform duration-300 origin-left ${
                    isActive('/influencer') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </div>
              <div className="relative group">
                <button
                  onClick={() => navigate('/pro', { replace: true })}
                  className="bg-gray-950 text-white px-4 py-3 rounded-full font-semibold border border-gray-800 transition-all duration-500 ease-out hover:border-gray-700
                           hover:px-8 hover:shadow-2xl hover:shadow-white/20 relative z-10"
                >
                  Join Pro
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="sm:hidden flex items-center w-full justify-between absolute top-1/2 -translate-y-1/2">
            <button
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="relative z-20 left-9 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className={`hamburger ${showMobileMenu ? 'open' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    className="line line-top"
                    d="M3 6H21"
                    stroke="#D1D5DB"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    className="line line-middle"
                    d="M3 12H21"
                    stroke="#D1D5DB"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    className="line line-bottom"
                    d="M3 18H21"
                    stroke="#D1D5DB"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>
            <button
              onClick={() => setShowSignInModal(true)}
              className="bg-gray-950 text-white px-4 py-2 rounded-full font-semibold border border-gray-800 transition-all duration-300 ease-out hover:bg-gray-800 hover:border-gray-700
                hover:scale-110 hover:shadow-2xl hover:shadow-white/20 relative z-20 right-1"
            >
              Join
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden absolute top-full left-0 w-full bg-black/80 backdrop-blur-md border border-gray-800 flex flex-col items-center z-50 py-4 rounded-2xl"
              >
                <div className="flex flex-col items-center gap-4 w-full px-6">
                  <div className="relative group w-full">
                    <button
                      onClick={() => setShowDropdown((prev) => !prev)}
                      className="text-gray-200 font-satoshi flex items-center gap-1 transition-colors duration-300 w-full justify-center"
                    >
                      Explore
                      <ChevronDown
                        className={`inline size-4 ml-1 transition-transform duration-300 ${
                          showDropdown ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 22,
                          }}
                          className="mt-2 w-full bg-black/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl overflow-hidden"
                        >
                          {[
                            { label: 'Getting Started', hash: 'getting-started' },
                            { label: 'How It Works', hash: 'how-it-works' },
                            { label: 'What Can Be Promoted', hash: 'what-can-be-promoted' },
                            { label: 'Campaign Templates', hash: 'campaign-templates' },
                          ].map((item, idx, arr) => (
                            <div key={item.label}>
                              <button
                                onClick={() => {
                                  navigate(`/explore#${item.hash}`);
                                  setShowDropdown(false);
                                  setShowMobileMenu(false);
                                }}
                                className="w-full text-center px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition duration-150"
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
                  <div className="relative group w-full">
                    <button
                      onClick={() => {
                        navigate('/organization', { replace: true });
                        setShowMobileMenu(false);
                      }}
                      className={`text-gray-200 font-satoshi transition duration-300 w-full text-center ${
                        isActive('/organization') ? 'font-bold text-white' : ''
                      }`}
                    >
                      Organization
                    </button>
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transition-transform duration-300 origin-left ${
                        isActive('/organization') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </div>
                  <div className="relative group w-full">
                    <button
                      onClick={() => {
                        navigate('/influencer', { replace: true });
                        setShowMobileMenu(false);
                      }}
                      className={`text-gray-200 font-satoshi transition duration-300 w-full text-center ${
                        isActive('/influencer') ? 'font-bold text-white' : ''
                      }`}
                    >
                      Influencer
                    </button>
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transition-transform duration-300 origin-left ${
                        isActive('/influencer') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </div>
                  <div className="relative group w-full">
                    <button
                      onClick={() => {
                        navigate('/pro', { replace: true });
                        setShowMobileMenu(false);
                      }}
                      className="bg-gray-950 text-white px-4 py-3 rounded-full font-semibold border border-gray-800 transition-all duration-500 ease-out hover:bg-gray-800 hover:border-gray-700 hover:px-12 hover:shadow-2xl hover:shadow-white/20 w-full text-center relative z-10"
                    >
                      Join Pro
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In Button for Desktop */}
          <div className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setShowSignInModal(true)}
              className="bg-gray-950 text-white px-6 py-3 rounded-full font-semibold border border-gray-800 transition-all duration-300 ease-out hover:border-gray-700
                hover:px-9 hover:shadow-2xl hover:shadow-white/20 relative z-10"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Inline CSS for Creative Hamburger Icon */}
        <style>
          {`
            .hamburger {
              width: 24px;
              height: 24px;
              position: relative;
              cursor: pointer;
            }
            .hamburger .line {
              transition: all 0.3s ease-in-out;
            }
            .hamburger.open .line-top {
              transform: rotate(45deg) translate(5px, 5px);
            }
            .hamburger.open .line-middle {
              opacity: 0;
            }
            .hamburger.open .line-bottom {
              transform: rotate(-45deg) translate(5px, -5px);
            }
            .hamburger:hover .line {
              stroke: #ffffff;
            }
          `}
        </style>
      </header>

      <AnimatePresence>
        {showSignInModal && (
          <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;