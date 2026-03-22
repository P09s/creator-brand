import React, { useState, useEffect, memo } from 'react';
import useAuthStore from '../../store/authStore';
import Avatar from '../shared/Avatar';
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
import { useCampaigns, useAcceptedCampaigns, useBrowseCampaigns } from '../../hooks/useCampaigns';
import { applyToCampaign } from '../../services/apiService';
import { notifyApplied } from '../../store/notificationStore';
import NotificationPanel from '../shared/NotificationPanel';
import Onboarding from '../shared/Onboarding';
import { HelpButton } from '../shared/HelpPanel';
import ProductTour from '../shared/ProductTour';
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
  const [notifOpen, setNotifOpen] = useState(false);
  // Read isNewUser directly from Zustand persisted state
  const { isNewUser, logout: authLogout } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = useState(isNewUser === true);
  const [showTour, setShowTour] = useState(false);
  const handleOnboardingDone = (startTour = false) => {
    setShowOnboarding(false);
    // Clear isNewUser in the store so tour never re-fires
    useAuthStore.setState({ isNewUser: false });
    if (startTour) setTimeout(() => setShowTour(true), 500);
  };
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

  const Dashboard = memo(() => {
    const { campaigns: acceptedCampaigns, loading: loadingAccepted } = useAcceptedCampaigns();
    const { campaigns: browseCampaigns, loading: loadingBrowse } = useBrowseCampaigns();
    const [applying, setApplying] = React.useState(null);
    const [applied, setApplied] = React.useState(new Set());

    const activeCampaigns = acceptedCampaigns.filter(c => c.status === 'active' || c.status === 'draft');
    const recommended = browseCampaigns
      .filter(c => !c.applicants?.includes(profile?._id) && !applied.has(c._id))
      .slice(0, 4);

    const handleApply = async (campaign) => {
      setApplying(campaign._id);
      try {
        await applyToCampaign(campaign._id);
        setApplied(prev => new Set([...prev, campaign._id]));
        notifyApplied(campaign.title);
      } catch {}
      finally { setApplying(null); }
    };

    const sColors = {
      active: 'bg-green-500/10 text-green-400',
      completed: 'bg-blue-500/10 text-blue-400',
      paused: 'bg-yellow-500/10 text-yellow-400',
      draft: 'bg-gray-500/10 text-gray-400',
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
          <h1 className="text-xl font-bold text-white mb-1">Welcome back, {profile?.name?.split(" ")[0]}! 👋</h1>
          <p className="text-gray-400 text-xs">Manage your creator journey from here</p>
        </div>

        <div data-tour="dashboard-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Active campaigns", value: loadingAccepted ? "—" : activeCampaigns.length, sub: "You are working on", icon: Target, color: "text-blue-400" },
            { title: "Total accepted", value: loadingAccepted ? "—" : acceptedCampaigns.length, sub: "All time", icon: Award, color: "text-green-400" },
            { title: "Open campaigns", value: loadingBrowse ? "—" : browseCampaigns.length, sub: "Available to apply", icon: Star, color: "text-amber-400" },
            { title: "Earnings", value: "₹0", sub: "Via escrow — coming soon", icon: Wallet, color: "text-purple-400" },
          ].map((stat, i) => (
            <motion.div key={i}
              className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <stat.icon className={"w-4 h-4 " + stat.color + " mb-3"} />
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.title}</p>
              <p className="text-gray-600 text-xs">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-950 border border-gray-800 rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-medium text-white">My Campaigns</h2>
              </div>
              <button onClick={() => navigate("/influencer_dashboard/campaigns")}
                className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {loadingAccepted ? (
                <p className="text-gray-600 text-sm text-center py-8">Loading...</p>
              ) : acceptedCampaigns.length === 0 ? (
                <div className="text-center py-10">
                  <Target className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No campaigns yet</p>
                  <p className="text-gray-600 text-xs mt-1">Apply to campaigns to get started</p>
                </div>
              ) : acceptedCampaigns.slice(0, 3).map((c, i) => (
                <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="bg-black border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white text-sm font-medium truncate">{c.title}</p>
                        <span className={"text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0 " + (sColors[c.status] || sColors.active)}>{c.status}</span>
                      </div>
                      <p className="text-gray-500 text-xs">by {c.brandName}</p>
                      <p className="text-gray-600 text-xs mt-1">Due {new Date(c.deadline).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => navigate("/influencer_dashboard/campaigns")} className="text-gray-600 hover:text-white flex-shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-medium text-white">Open Campaigns</h2>
              </div>
              <button onClick={() => { setShowBrowseCampaign(true); setIsSidebarOpen(false); }}
                className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                Browse all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {loadingBrowse ? (
                <p className="text-gray-600 text-sm text-center py-8">Loading...</p>
              ) : recommended.length === 0 ? (
                <div className="text-center py-10">
                  <Star className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No open campaigns right now</p>
                  <p className="text-gray-600 text-xs mt-1">Check back soon — brands post daily</p>
                </div>
              ) : recommended.map((c, i) => (
                <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="bg-black border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white text-sm font-medium truncate">{c.title}</p>
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full flex-shrink-0">{c.category}</span>
                      </div>
                      <p className="text-gray-500 text-xs">{c.brandName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span>${c.budget?.toLocaleString()}</span>
                        <span>{c.platform}</span>
                      </div>
                    </div>
                    <button onClick={() => handleApply(c)}
                      disabled={applying === c._id || applied.has(c._id)}
                      className={"flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors " + (applied.has(c._id) ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-white hover:bg-gray-100 text-black disabled:opacity-50")}>
                      {applying === c._id ? "..." : applied.has(c._id) ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  });
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
              <HelpButton userType="influencer" />
              <NotificationPanel isOpen={notifOpen} onToggle={() => setNotifOpen(o => !o)} />
              
              <div className="flex items-center gap-3">
                <Avatar src={profile?.avatar} name={profile?.name} size="md" />
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
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
      {showTour && <ProductTour userType="influencer" onDone={() => setShowTour(false)} />}
    </div>
  );
};

export default InfluencerDashboard;