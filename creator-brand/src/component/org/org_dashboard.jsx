import React, { useState, useEffect, memo } from 'react';
import userAuthStore from '../../store/authStore';
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
  Plus,
  FileOutput
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../shared/NotificationPanel';
import Sidebar from './sidebar';
import PortfolioOverview from './PortfolioOverview';
import PortfolioModal from './PortfolioModal';
import Campaigns from './campaigns';
import Browse_influencer from './browse_influencer';
import Analytics from './analytics';
import Messages from './messages';
import Payments from './payments';
import SettingsComponent from './settings';
import CampaignModal from './campaign/campaignModal';
import { useCampaigns } from '../../hooks/useCampaigns';

const Org_dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [showBrowseCampaign, setShowBrowseCampaign] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    campaignTitle: '',
    platform: 'Instagram',
    campaignDate: '',
    results: '',
  });
  const {user:profile} = userAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const basePath = '/org_dashboard'; // Define the parent route
    const pathToTab = {
      '/': 'dashboard',
      '/campaigns': 'campaigns',
      '/browse_influencer': 'browse_influencer',
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

  useEffect(() => {
    document.body.style.overflow = showCampaignModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCampaignModal]);

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
    { icon: Users, label: 'Connect Accounts', color: 'text-orange-400', path: '/browse_influencer' },
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
    navigate('/org_dashboard');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchExpanded(false);
      setShowBrowseCampaign(true);
      setIsSidebarOpen(false);
    }
  };
  const handleCampaignModalClose = () => {
    setShowCampaignModal(false);
  };

  const Dashboard = memo(() => {
    const { campaigns, loading } = useCampaigns();
    const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'draft');
    const totalApplicants = campaigns.reduce((sum, c) => sum + (c.applicants?.length || 0), 0);
    const totalAccepted = campaigns.reduce((sum, c) => sum + (c.accepted?.length || 0), 0);

    return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Welcome back, {profile?.name?.split(' ')[0]}!</h1>
            <p className="text-gray-400 text-xs">Manage your campaigns and find the right creators</p>
          </div>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Stats — real data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Campaigns', value: campaigns.length, sub: 'Posted', icon: Target, color: 'text-blue-400' },
          { label: 'Active', value: activeCampaigns.length, sub: 'Running now', icon: Zap, color: 'text-green-400' },
          { label: 'Applicants', value: totalApplicants, sub: 'Total received', icon: Users, color: 'text-purple-400' },
          { label: 'Creators working', value: totalAccepted, sub: 'Accepted', icon: Award, color: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <s.icon className={`w-4 h-4 ${s.color} mb-3`} />
            <p className="text-2xl font-semibold text-white">{loading ? '—' : s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            <p className="text-gray-600 text-xs">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Two column: campaigns + next steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* My campaigns — real */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-medium text-white">My Campaigns</h2>
            </div>
            <button onClick={() => navigate('/org_dashboard/campaigns')}
              className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {loading ? (
              <p className="text-gray-600 text-sm text-center py-8">Loading...</p>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-10">
                <Target className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No campaigns yet</p>
                <button onClick={() => setShowCampaignModal(true)}
                  className="mt-3 text-xs text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                  Create your first campaign
                </button>
              </div>
            ) : campaigns.slice(0, 3).map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="bg-black border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{c.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{c.platform} · ${c.budget?.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.applicants?.length || 0} applicants</span>
                      {c.accepted?.length > 0 && <span className="text-green-400">{c.accepted.length} accepted</span>}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-3 capitalize flex-shrink-0 ${
                    c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                  }`}>{c.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next steps / platform guide */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl">
          <div className="flex items-center gap-2 p-5 border-b border-gray-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-medium text-white">How it works</h2>
          </div>
          <div className="p-4 space-y-3">
            {[
              { n: '1', title: 'Post a campaign', desc: 'Set your budget, platform, and what you need', done: campaigns.length > 0, path: '/org_dashboard/campaigns', action: 'Create campaign' },
              { n: '2', title: 'Review applicants', desc: 'See creator trust scores and past work', done: totalApplicants > 0, path: '/org_dashboard/campaigns', action: 'See applicants' },
              { n: '3', title: 'Accept & set milestones', desc: 'Define deliverables with clear deadlines', done: totalAccepted > 0, path: '/org_dashboard/campaigns', action: 'Manage' },
              { n: '4', title: 'Approve & pay', desc: 'Release escrow when milestones are done', done: false, path: '/org_dashboard/payments', action: 'View payments' },
            ].map((step, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${step.done ? 'bg-green-500/5 border border-green-500/10' : 'bg-black border border-gray-800'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${step.done ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                  {step.done ? '✓' : step.n}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.done ? 'text-green-400' : 'text-white'}`}>{step.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                </div>
                {!step.done && (
                  <button onClick={() => navigate(step.path)}
                    className="text-xs text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 px-2 py-1 rounded-lg transition-colors flex-shrink-0">
                    {step.action}
                  </button>
                )}
              </div>
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
                {!showCampaignModal && (
                  <motion.button
                    key="create-campaign-button"
                    onClick={() => setShowCampaignModal(true)}
                    className="flex items-center gap-2 bg-gray-950 border border-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    aria-label="Create new campaign"
                    initial={{ opacity: 0, scale: 1, y: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm font-semibold">Create Campaign</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-6">
              <NotificationPanel isOpen={notifOpen} onToggle={() => setNotifOpen(o => !o)} />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 border-2 border-gray-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {profile?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{profile?.name || "User"}</p>
                  <p className="text-gray-400 text-xs">{profile?.userName || "User Name"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-black text-white mt-20">
          <AnimatePresence mode="wait">
            {false ? null : (
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
                      path="/browse_influencer"
                      element={
                        <motion.div
                          key="browse_influencer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <Browse_influencer />
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
      <AnimatePresence>
        {showCampaignModal && (
          <CampaignModal 
            isOpen={showCampaignModal} 
            onClose={handleCampaignModalClose} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Org_dashboard;