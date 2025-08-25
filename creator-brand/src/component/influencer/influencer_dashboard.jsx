import React, { useState, useEffect, memo } from 'react';
import useAuthStore from '../../store/authStore';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Bell, 
  Search,
  ChevronRight,
  Heart,
  MessageSquare,
  Share,
  Sparkles,
  Megaphone as Campaign,
  Calendar,
  Target,
  Star,
  Zap,
  Award,
  Clock,
  BarChart3,
  Wallet,
  Settings,
  Filter,
  ArrowUpRight,
  Upload,
  FileOutput
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './sidebar';
import PortfolioOverview from './PortfolioOverview';
import PortfolioModal from './PortfolioModal';
import BrowseCampaign from './BrowseCampaign';
import Campaigns from './campaigns';
import Organizations from './organizations';
import Analytics from './analytics';
import Messages from './messages';
import Payments from './payments';
import SettingsComponent from './settings';


const InfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [showBrowseCampaign, setShowBrowseCampaign] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    brandName: '',
    campaignTitle: '',
    platform: 'Instagram',
    campaignDate: '',
    results: '',
  });
  const { user: profile } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const basePath = '/influencer_dashboard'; // Define the parent route
    const pathToTab = {
      '/': 'dashboard',
      '/campaigns': 'campaigns',
      '/organizations': 'organizations',
      '/analytics': 'analytics',
      '/messages': 'messages',
      '/payments': 'payments',
      '/settings': 'settings',
      '/portfolio': 'portfolio',
    };
    const currentPath = location.pathname.replace(basePath, '') || '/';
    const newTab = pathToTab[currentPath] || 'dashboard';
    setActiveTab(newTab);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeCampaigns = [
    { id: 1, brand: 'TechFlow', title: 'Product Launch Campaign', deadline: '2025-08-20', status: 'Live', color: 'bg-green-500/10 text-green-400' },
    { id: 2, brand: 'StyleCorp', title: 'Summer Collection', deadline: '2025-08-25', status: 'Awaiting Approval', color: 'bg-yellow-500/10 text-yellow-400' },
    { id: 3, brand: 'FitnessPro', title: 'Workout Series', deadline: '2025-08-18', status: 'Draft Pending', color: 'bg-gray-500/10 text-gray-400' },
  ];

  const newOpportunities = [
    { id: 1, brand: 'EcoLife', title: 'Sustainable Living Campaign', budget: '$2,500', match: '95%', category: 'Lifestyle' },
    { id: 2, brand: 'GameZone', title: 'Mobile Game Launch', budget: '$1,800', match: '87%', category: 'Gaming' },
    { id: 3, brand: 'BookClub', title: 'Reading Challenge', budget: '$1,200', match: '92%', category: 'Education' },
    { id: 4, brand: 'FoodieApp', title: 'Recipe Contest', budget: '$3,000', match: '89%', category: 'Food' },
  ];

  const notifications = [
    { id: 1, text: 'Content approved for TechFlow campaign', type: 'success', date: '2 hours ago', icon: Award },
    { id: 2, text: 'New high-match campaign available', type: 'info', date: '5 hours ago', icon: Target },
    { id: 3, text: 'Payment of $850 processed successfully', type: 'success', date: '1 day ago', icon: DollarSign },
    { id: 4, text: 'Deadline approaching for StyleCorp', type: 'warning', date: '2 days ago', icon: Clock },
  ];

  const quickActions = [
    { icon: Search, label: 'Browse Campaigns', color: 'text-blue-400', path: '/campaigns' },
    { icon: Upload, label: 'Upload Content', color: 'text-green-400', path: '/campaigns' },
    { icon: BarChart3, label: 'View Analytics', color: 'text-purple-400', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', color: 'text-pink-400', path: '/messages' },
    { icon: Users, label: 'Connect Accounts', color: 'text-orange-400', path: '/organizations' },
    { icon: Settings, label: 'Account Settings', color: 'text-gray-400', path: '/settings' },
  ];

  const handleSearchClick = () => {
    setIsSearchExpanded(false);
    setShowBrowseCampaign(true);
    setIsSidebarOpen(false);
  };

  const handleBrowseCampaignClose = () => {
    setShowBrowseCampaign(false);
    setIsSearchExpanded(true);
    setActiveTab('dashboard');
    navigate('/influencer_dashboard');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchExpanded(false);
      setShowBrowseCampaign(true);
      setIsSidebarOpen(false);
    }
  };

  const Dashboard = memo(() => (
    <div className="space-y-8">
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-8 text-white">
        <h1 className="text-xl font-bold mb-2">Welcome back, {profile?.name.split(' ')[0]}! 👋</h1>
        <p className="text-gray-400 text-xs">Manage your creator journey from here</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Earnings', value: '$2,450', change: '+12%', icon: Wallet, color: 'text-green-400', status: 'Growth' },
          { title: 'Active Campaigns', value: '3', change: '+1', icon: Target, color: 'text-blue-400', status: 'Active' },
          { title: 'Opportunities', value: '7', change: '+2 new', icon: Star, color: 'text-yellow-400', status: 'New' },
          { title: 'Engagement Rate', value: '4.2%', change: '+0.3%', icon: TrendingUp, color: 'text-purple-400', status: 'Improved' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
              <span className={`text-xs ${stat.color} bg-gray-800 px-2 py-1 rounded-full`}>{stat.status}</span>
            </div>
            <div className="text-xl font-semibold text-white mb-1">{stat.value}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">{stat.title}</div>
              <div className="text-xs text-gray-300">{stat.change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-950 border border-gray-800 rounded-xl">
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" aria-hidden="true" />
                <h2 className="text-lg font-medium text-white">Active Campaigns</h2>
              </div>
              <button className="text-xs text-gray-400 hover:text-white flex items-center" onClick={() => navigate('/influencer_dashboard/campaigns')} aria-label="View all campaigns">
                View All <ChevronRight className="w-3 h-3 ml-1" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {activeCampaigns.map(campaign => (
              <div key={campaign.id} className="bg-black border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-medium text-white">{campaign.brand}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${campaign.color}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{campaign.title}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
                      <span>Due {campaign.deadline}</span>
                    </div>
                  </div>
                  <button className="ml-3 text-gray-400 hover:text-white" aria-label={`View details for ${campaign.brand} campaign`}>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl">
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                <h2 className="text-lg font-medium text-white">Recommended For You</h2>
              </div>
              <button className="text-xs text-gray-400 hover:text-white flex items-center" aria-label="Filter opportunities">
                <Filter className="w-3 h-3 mr-1" aria-hidden="true" /> Filter
              </button>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {newOpportunities.map(opportunity => (
              <div key={opportunity.id} className="bg-black border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-medium text-white">{opportunity.brand}</h3>
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                        {opportunity.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{opportunity.title}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Budget: {opportunity.budget}</span>
                      <div className="flex items-center text-green-400">
                        <Zap className="w-3 h-3 mr-1" aria-hidden="true" />
                        <span>{opportunity.match} match</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="ml-3 bg-white text-black px-3 py-1.5 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                    aria-label={`Apply for ${opportunity.brand} campaign`}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-gray-950 border border-gray-800 rounded-xl">
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" aria-hidden="true" />
              <h2 className="text-lg font-medium text-white">Quick Actions</h2>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  onClick={() => navigate(`/influencer_dashboard${action.path}`)}
                  className="flex flex-col items-center p-3 bg-black border border-gray-800 rounded-lg hover:border-gray-700 transition-colors group"
                  aria-label={action.label}
                >
                  <action.icon className={`w-5 h-5 mb-2 ${action.color} group-hover:scale-110 transition-transform`} aria-hidden="true" />
                  <span className="text-xs text-gray-400 text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl">
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" aria-hidden="true" />
              <h2 className="text-lg font-medium text-white">Earnings Overview</h2>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">This Month</span>
                <span className="text-lg font-semibold text-green-400">$1,850</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Last Month</span>
                <span className="text-sm text-gray-500">$1,620</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                <span className="text-sm text-gray-400">Pending</span>
                <span className="text-sm text-yellow-400">$600</span>
              </div>
              
              <button 
                className="w-full bg-white text-black py-2.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                aria-label="Withdraw funds"
              >
                <Wallet className="w-4 h-4 mr-2" aria-hidden="true" />
                Withdraw Funds
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl">
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-400" aria-hidden="true" />
              <h2 className="text-lg font-medium text-white">Recent Activity</h2>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-start space-x-3">
                <div className={`p-1.5 rounded-full ${
                  notification.type === 'success' ? 'bg-green-500/10' :
                  notification.type === 'warning' ? 'bg-yellow-500/10' :
                  notification.type === 'info' ? 'bg-blue-500/10' : 'bg-gray-500/10'
                }`}>
                  <notification.icon className={`w-3 h-3 ${
                    notification.type === 'success' ? 'text-green-400' :
                    notification.type === 'warning' ? 'text-yellow-400' :
                    notification.type === 'info' ? 'text-blue-400' : 'text-gray-400'
                  }`} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-300 mb-1">{notification.text}</p>
                  <p className="text-xs text-gray-500">{notification.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="flex h-screen bg-black">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setShowBrowseCampaign={setShowBrowseCampaign}
        setIsSearchExpanded={setIsSearchExpanded}
        navigate={navigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header 
          className={`fixed top-0 ${isSidebarOpen ? 'left-64' : 'left-16'} right-0 z-10 transition-all duration-300 border-b border-gray-800 p-6
            ${isScrolled ? 'bg-black/30 backdrop-blur-sm shadow-md' : 'bg-black'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <AnimatePresence mode="wait">
                {isSearchExpanded ? (
                  <motion.form
                    key="search-form"
                    onSubmit={handleSearchSubmit}
                    className="relative"
                    initial={{ width: '20rem', opacity: 0, scale: 0.9 }}
                    animate={{ width: '20rem', opacity: 1, scale: 1 }}
                    exit={{ width: 0, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Search campaigns, brands..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={handleSearchClick}
                      className="bg-gray-950 text-white pl-10 pr-4 py-2 rounded-lg w-80 border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm placeholder:text-gray-400"
                      aria-label="Search campaigns or brands"
                    />
                  </motion.form>
                ) : (
                  <motion.button
                    key="mascot-button"
                    onClick={handleBrowseCampaignClose}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    aria-label="Close browse campaigns"
                    initial={{ scale: 0, opacity: 0, y: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, ease: 'easeOut', type: 'spring', damping: 15, stiffness: 100 }}
                  >
                    <FileOutput className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm font-bold">Return to dashboard</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="relative p-2 text-white hover:text-gray-300 hover:bg-gray-800 rounded-lg" aria-label="View notifications">
                <Bell className="w-4 h-4" aria-hidden="true" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI39jmnqGugnR-LKaHU6za8QqCi9JO541veg&s"
                  alt="Profile picture"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                  onError={(e) => (e.target.src = '/fallback-image.jpg')}
                />
                <div>
                  <p className="text-white font-medium text-sm">{profile?.name || "user"}</p>
                  <p className="text-gray-400 text-xs">{profile?.userName || "username"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-black text-white mt-20">
          <AnimatePresence mode="wait">
            {showBrowseCampaign ? (
              <motion.div
                key="browse-campaign"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <BrowseCampaign 
                  setActiveTab={setActiveTab} 
                  initialSearchTerm={searchTerm} 
                  onClose={handleBrowseCampaignClose}
                />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard-routes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <motion.div
                          key="dashboard"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <Dashboard />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/campaigns"
                      element={
                        <motion.div
                          key="campaigns"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <Campaigns />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/organizations"
                      element={
                        <motion.div
                          key="organizations"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <Organizations />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <motion.div
                          key="analytics"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <Analytics />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/messages"
                      element={
                        <motion.div
                          key="messages"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <Messages />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/payments"
                      element={
                        <motion.div
                          key="payments"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <Payments />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <motion.div
                          key="settings"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <SettingsComponent />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/portfolio"
                      element={
                        <motion.div
                          key="portfolio"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <PortfolioOverview setIsProfileModalOpen={setIsProfileModalOpen} />
                        </motion.div>
                      }
                    />
                  </Routes>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <PortfolioModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default InfluencerDashboard;