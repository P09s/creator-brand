import React, { useState, useEffect, memo } from 'react';
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
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './sideBar';
import StatsGrid from './StatsGrid';
import PortfolioOverview from './PortfolioOverview';
import PortfolioModal from './PortfolioModal';
import BrowseCampaign from './BrowseCampaign';
import CampaignModal from './campaign/campaignModal'; // Import your CampaignModal component

const org_dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showBrowseCampaign, setShowBrowseCampaign] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    brandName: '',
    campaignTitle: '',
    platform: 'Instagram',
    campaignDate: '',
    results: '',
  });

  // Handle scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body overflow when modal is open
  useEffect(() => {
    document.body.style.overflow = showCampaignModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCampaignModal]);

  // Mock data
  const stats = [
    { title: 'Total Earnings', value: '$12,450', change: '+15%', icon: DollarSign, color: 'text-white' },
    { title: 'Active Campaigns', value: '8', change: '+2', icon: Campaign, color: 'text-white' },
    { title: 'Total Followers', value: '145K', change: '+5.2%', icon: Users, color: 'text-white' },
    { title: 'Engagement Rate', value: '4.8%', change: '+0.3%', icon: TrendingUp, color: 'text-white' }
  ];

  const campaigns = [
    { id: 1, brand: 'Nike Sportswear', status: 'Active', deadline: '2025-08-15', payment: '$850', platform: 'Instagram', type: 'Post + Story' },
    { id: 2, brand: 'Starbucks Coffee', status: 'Pending', deadline: '2025-08-20', payment: '$600', platform: 'TikTok', type: 'Video' },
    { id: 3, brand: 'Samsung Mobile', status: 'Completed', deadline: '2025-08-01', payment: '$1200', platform: 'YouTube', type: 'Review Video' },
  ];

  const recentPosts = [
    { id: 1, platform: 'Instagram', content: 'Summer fitness routine', likes: 2340, comments: 89, shares: 156, date: '2025-08-05' },
    { id: 2, platform: 'TikTok', content: 'Coffee morning routine', likes: 15600, comments: 234, shares: 890, date: '2025-08-04' },
    { id: 3, platform: 'YouTube', content: 'Tech review: Latest smartphone', likes: 8900, comments: 567, shares: 234, date: '2025-08-03' },
  ];

  const notifications = [
    { id: 1, message: 'New campaign proposal from Nike', time: '2 hours ago', type: 'campaign' },
    { id: 2, message: 'Payment received: $850', time: '1 day ago', type: 'payment' },
    { id: 3, message: 'Campaign deadline approaching', time: '2 days ago', type: 'reminder' },
  ];

  // Handle campaign modal close
  const handleCampaignModalClose = () => {
    setShowCampaignModal(false);
  };

  // Handle closing BrowseCampaign
  const handleBrowseCampaignClose = () => {
    setShowBrowseCampaign(false);
    setActiveTab('dashboard');
  };

  const Dashboard = memo(() => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-8 text-black">
        <h1 className="text-xl font-bold mb-2">Welcome back, Tillu! 👋</h1>
        <p className="text-neutral-800 text-xs">You have 3 new campaign opportunities waiting for you.</p>
      </div>

      <StatsGrid stats={stats} />

      <div className="bg-neutral-800 rounded-xl border border-neutral-700">
        <div className="p-8 border-b border-neutral-700">
          <div className="flex justify-between items-center bg-white rounded-xl p-4">
            <h2 className="text-base font-semibold text-black">Active Campaigns</h2>
            <button className="text-black hover:text-neutral-700 flex items-center gap-1 text-xs" aria-label="View all campaigns">
              View All <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-neutral-700">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-6 hover:bg-neutral-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white text-sm">{campaign.brand}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs bg-neutral-700 text-white`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-neutral-300">
                    <span>📅 Due: {campaign.deadline}</span>
                    <span>💰 {campaign.payment}</span>
                    <span>📱 {campaign.platform}</span>
                    <span>📝 {campaign.type}</span>
                  </div>
                </div>
                <button 
                  className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors text-xs"
                  aria-label={`View details for ${campaign.brand} campaign`}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
          <h3 className="text-base font-semibold text-white mb-4">Recent Posts Performance</h3>
          <div className="space-y-6">
            {recentPosts.map((post) => (
              <div key={post.id} className="bg-neutral-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{post.content}</span>
                  <span className="text-xs text-neutral-300">{post.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-neutral-300">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" aria-hidden="true" /> {post.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" aria-hidden="true" /> {post.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share className="w-4 h-4" aria-hidden="true" /> {post.shares}
                    </span>
                  </div>
                  <span className="bg-neutral-700 text-white px-2 py-1 rounded text-xs">
                    {post.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
          <h3 className="text-base font-semibold text-white mb-4">Recent Notifications</h3>
          <div className="space-y-6">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center gap-3 p-3 bg-neutral-700 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="flex-1">
                  <p className="text-white text-xs">{notification.message}</p>
                  <p className="text-neutral-300 text-xs">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-white hover:text-neutral-300 text-xs" aria-label="View all notifications">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setShowBrowseCampaign={setShowBrowseCampaign}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header 
          className={`fixed top-0 ${isSidebarOpen ? 'left-64' : 'left-16'} right-0 z-10 transition-all duration-300 border-b border-neutral-700 p-6
            ${isScrolled ? 'bg-black/30 backdrop-blur-sm shadow-md' : 'bg-black'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <AnimatePresence mode="wait">
                {!showCampaignModal && (
                  <motion.button
                    key="create-campaign-button"
                    onClick={() => setShowCampaignModal(true)}
                    className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
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
              <button className="relative p-2 text-white hover:text-neutral-300 hover:bg-neutral-700 rounded-lg" aria-label="View notifications">
                <Bell className="w-4 h-4" aria-hidden="true" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI39jmnqGugnR-LKaHU6za8QqCi9JO541veg&s"
                  alt="Profile picture"
                  className="w-10 h-10 rounded-full object-cover border-2 border-neutral-700"
                  onError={(e) => (e.target.src = '/fallback-image.jpg')}
                />
                <div>
                  <p className="text-white font-medium text-sm">Tillu Badmosh</p>
                  <p className="text-white text-xs">@baddie_tillu</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 bg-black text-white mt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={showBrowseCampaign ? 'browse-campaign' : activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {showBrowseCampaign ? (
                <BrowseCampaign 
                  setActiveTab={setActiveTab} 
                  onClose={handleBrowseCampaignClose}
                />
              ) : (
                <>
                  {activeTab === 'dashboard' && <Dashboard />}
                  {activeTab === 'campaigns' && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-xl p-8">
                        <h2 className="text-xl font-bold text-black">My Campaigns</h2>
                      </div>
                      <p className="text-neutral-300 text-xs">Campaign management interface coming soon...</p>
                    </div>
                  )}
                  {activeTab === 'portfolio' && <PortfolioOverview setIsProfileModalOpen={setIsProfileModalOpen} />}
                  {activeTab === 'analytics' && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-xl p-8">
                        <h2 className="text-xl font-bold text-black">Analytics Dashboard</h2>
                      </div>
                      <p className="text-neutral-300 text-xs">Analytics dashboard coming soon...</p>
                    </div>
                  )}
                  {activeTab === 'earnings' && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-xl p-8">
                        <h2 className="text-xl font-bold text-black">Earnings & Payments</h2>
                      </div>
                      <p className="text-neutral-300 text-xs">Earnings dashboard coming soon...</p>
                    </div>
                  )}
                  {activeTab === 'calendar' && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-xl p-8">
                        <h2 className="text-xl font-bold text-black">Content Calendar</h2>
                      </div>
                      <p className="text-neutral-300 text-xs">Calendar interface coming soon...</p>
                    </div>
                  )}
                  {activeTab === 'settings' && (
                    <div className="space-y-8">
                      <div className="bg-white rounded-xl p-8">
                        <h2 className="text-xl font-bold text-black">Account Settings</h2>
                      </div>
                      <p className="text-neutral-300 text-xs">Settings page coming soon...</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Portfolio Modal */}
      <PortfolioModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Campaign Modal */}
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

export default org_dashboard;