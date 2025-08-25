import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
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
        ? 'bg-gray-900 text-white border border-gray-600'
        : 'text-white hover:bg-gray-900 hover:border-gray-600 border border-transparent'
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
  navigate
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user: profile, logout } = useAuthStore();

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);
  const handleNavClick = (id) => {
    const basePath = '/influencer_dashboard';
    const path = id === 'dashboard' ? basePath : `${basePath}/${id}`;
    navigate(path);
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
        className="bg-black border-r border-gray-800 flex flex-col h-full relative z-10 shadow-xl overflow-hidden"
        variants={sidebarVariants}
        animate={isSidebarOpen ? 'open' : 'closed'}
        initial={false}
      >
        {/* Logo Section */}
        <div className={`px-4 py-5 border-b border-gray-800 ${isSidebarOpen ? '' : 'justify-center'} flex`}>
          <button onClick={handleSidebarToggle} className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gray-950 border border-gray-800">
              <img className="w-8 h-8" src="/logo.png" alt="logo" />
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
                  <p className="text-xs text-gray-400 font-medium">
                    {profile?.userType || "User"}
                  </p>
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
        <div className="p-4 border-t border-gray-800 relative">
          <div
            className={`flex items-center ${
              isSidebarOpen ? 'space-x-3 p-3 rounded-xl bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700' : ''
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
                className="w-10 h-10 rounded-full ring-2 ring-gray-600 object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
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
                      {profile?.name || "user"}
                    </p>
                    <p className="text-xs text-gray-400 truncate font-satoshi">
                    {profile?.userName || "user name"}
                    </p>
                  </div>
                  <ChevronUp
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
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
                className="absolute bottom-full mb-2 left-4 right-4 space-y-1 bg-gray-950 border border-gray-800 rounded-lg p-2 shadow-lg"
              >
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-900 hover:border-gray-600 rounded-lg border border-transparent transition-colors"
                  onClick={() => {
                    navigate('/influencer_dashboard/portfolio');
                    setActiveTab('portfolio');
                    setIsSidebarOpen(false);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Briefcase className="w-4 h-4 mr-2" /> My Portfolio
                </button>
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-900 hover:border-gray-600 rounded-lg border border-transparent transition-colors"
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
              className="bg-gray-950 rounded-xl p-6 shadow-2xl border border-gray-800 w-[300px] text-center"
            >
              <h2 className="text-lg font-bold mb-2 text-white">
                Really want to leave? 🥺
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                We'll miss you! Stay a bit longer?
              </p>
              <div className="flex justify-between gap-3 mt-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white border border-gray-800 rounded-lg hover:bg-gray-800 hover:border-gray-700 transition-colors"
                >
                  Stay
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setShowLogoutModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-colors"
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
