import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  BarChart3, 
  MessageCircle, 
  CreditCard, 
  Settings,
  LogOut,
  Briefcase,
  ChevronUp
} from 'lucide-react';

const sidebarVariants = {
  open: { width: '16rem', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { width: '5rem', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const NavItem = ({ item, activeTab, isSidebarOpen, handleNavClick, index }) => (
  <button
    onClick={() => handleNavClick(item.id)}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
      activeTab === item.id
        ? 'bg-neutral-800 text-white shadow-sm'
        : 'text-slate-300 hover:bg-neutral-900'
    } ${isSidebarOpen ? '' : 'justify-center'}`}
  >
    <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
    <AnimatePresence initial={false}>
      {isSidebarOpen && (
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40, delay: 0.05 + index * 0.03 }}
        >
          {item.label}
        </motion.span>
      )}
    </AnimatePresence>
  </button>
);

const Sidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  setShowBrowseCampaign,
  setIsSearchExpanded,
  navigate // Add navigate as a prop
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);
  const handleNavClick = (id) => {
    const basePath = '/influencer_dashboard'; // Match the parent route
    const path = id === 'dashboard' ? basePath : `${basePath}/${id}`;
    navigate(path); // Use navigate to change the route
    setActiveTab(id);
    setIsDropdownOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'organizations', label: 'Organizations', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Sidebar */}
      <motion.div
        className="bg-black border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col h-full relative z-10 shadow-xl overflow-hidden"
        variants={sidebarVariants}
        animate={isSidebarOpen ? 'open' : 'closed'}
        initial={false}
      >
        {/* Logo Section */}
        <div className={`px-4 py-5 border-b border-slate-200/50 dark:border-slate-700/50 ${isSidebarOpen ? '' : 'justify-center'} flex`}>
          <button onClick={handleSidebarToggle} className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-black">
              <img className="w-8 h-8" src="src/assets/img/logo.png" alt="logo" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-xl text-white font-bold font-satoshi tracking-tight">LinkFluence</h1>
                  <p className="text-xs text-white font-medium">Inluencer</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavItem
              key={item.id}
              item={item}
              activeTab={activeTab}
              isSidebarOpen={isSidebarOpen}
              handleNavClick={handleNavClick}
              index={index}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 relative">
          <div
            className={`flex items-center ${
              isSidebarOpen ? 'space-x-3 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-900' : ''
            } transition-all duration-200 cursor-pointer group`}
            onClick={() => {
              if (!isSidebarOpen) {
                setIsSidebarOpen(true);
                setTimeout(() => setIsDropdownOpen(true), 320);
              } else {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI39jmnqGugnR-LKaHU6za8QqCi9JO541veg&s"
                alt="user_logo"
                className="w-10 h-10 rounded-full ring-2 ring-blue-500 object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
            </div>

            {/* Name + Role */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  className="flex-1 min-w-0 flex justify-between items-center"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <p className="text-sm font-semibold text-white truncate font-satoshi">
                      Tillu Badmosh
                    </p>
                    <p className="text-xs text-white truncate font-satoshi">
                      Influencer
                    </p>
                  </div>
                  <ChevronUp
                    className={`w-4 h-4 text-white transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className="absolute bottom-full mb-2 left-4 right-4 space-y-1 bg-neutral-900 rounded-lg p-2 shadow-lg"
              >
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-neutral-800 rounded-lg"
                  onClick={() => {
                    navigate('/influencer_dashboard/portfolio'); // Use navigate for portfolio
                    setActiveTab('portfolio');
                    setIsSidebarOpen(false);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Briefcase className="w-4 h-4 mr-2" /> My Portfolio
                </button>
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-neutral-800 rounded-lg"
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-2xl border border-gray-300 dark:border-gray-700 w-[300px] text-center"
            >
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">
                Really want to leave? 🥺
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                We’ll miss you! Stay a bit longer?
              </p>
              <div className="flex justify-between gap-3 mt-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 bg-white text-gray-800 dark:bg-neutral-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                >
                  Stay
                </button>
                <button
                  onClick={() => {
                    console.log("Logging out professionally...");
                    setShowLogoutModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;