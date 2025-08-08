// import { useEffect, useRef, useState } from 'react';
// import { ChevronDown } from 'lucide-react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import CampaignModal from '../campaign/campaignModal';

// export default function Influencer_dashboard() {

//     const [showCampaignModal, setShowCampaignModal] = useState(false);
//     const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     document.body.style.overflow = showCampaignModal ? 'hidden' : 'auto';
//   }, [showCampaignModal]);

//   const isActive = (path) => location.pathname === path;


//     return(
//         <div className="flex flex-row items-end justify-between min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-6">
//             <h1 className="text-amber-50">Hello</h1>
//             <button
//             onClick={() => setShowCampaignModal(true)} 
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                 Click Me
//             </button>
//             <AnimatePresence>
//                     {showCampaignModal && (
//                       <CampaignModal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} />
//                     )}
//                   </AnimatePresence>
//         </div>
        
//     );

// }
import React, { useState, useEffect, memo } from 'react';
import { 
  Home, 
  Megaphone as Campaign, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Eye,
  MessageSquare,
  Heart,
  Share,
  BarChart3,
  Star,
  ChevronRight,
  Instagram,
  Twitter,
  Youtube,
  User,
  Camera,
  Edit3,
  Award,
  Briefcase,
  Sparkles,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrowseCampaign from './browseCampaign';

const Influencer_dashboard = () => {
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
  const [searchTerm, setSearchTerm] = useState('');

  // Handle scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('New Portfolio Item:', formData);
    setFormData({ brandName: '', campaignTitle: '', platform: 'Instagram', campaignDate: '', results: '' });
    setIsProfileModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search bar click to toggle BrowseCampaign and collapse sidebar
  const handleSearchClick = () => {
    setIsSearchExpanded(false);
    setShowBrowseCampaign(true);
    setIsSidebarOpen(false);
  };

  // Handle closing BrowseCampaign
  const handleBrowseCampaignClose = () => {
    setShowBrowseCampaign(false);
    setIsSearchExpanded(true);
    setActiveTab('dashboard');
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchExpanded(false);
      setShowBrowseCampaign(true);
      setIsSidebarOpen(false);
    }
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Memoized components
  const StatsGrid = memo(({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <stat.icon className={`w-6 h-6 ${stat.color}`} aria-hidden="true" />
            <span className={`text-xs ${stat.change.includes('+') ? 'text-white' : 'text-neutral-300'}`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{stat.value}</h3>
          <p className="text-neutral-300 text-xs">{stat.title}</p>
        </div>
      ))}
    </div>
  ));

  const Portfolio = memo(() => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">My Portfolio</h2>
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
            aria-label="Add new portfolio work"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add Work
          </button>
        </div>
      </div>
      
      <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
        <div className="flex items-start gap-8">
          <div className="relative">
            <img 
              src="/api/placeholder/120/120" 
              alt="Profile picture" 
              className="w-20 h-20 rounded-full object-cover border-2 border-neutral-700"
              onError={(e) => (e.target.src = '/fallback-image.jpg')}
            />
            <button 
              className="absolute -bottom-1 -right-1 bg-neutral-700 text-white p-1 rounded-full hover:bg-neutral-600"
              aria-label="Change profile picture"
            >
              <Camera className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">Alex Johnson</h3>
              <button className="text-neutral-300 hover:text-white" aria-label="Edit profile">
                <Edit3 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-neutral-300 text-xs mb-3">Lifestyle & Tech Content Creator</p>
            <div className="flex gap-4 text-xs text-neutral-300">
              <span>📍 Los Angeles, CA</span>
              <span>🎂 25 years old</span>
              <span>📧 alex.johnson@email.com</span>
            </div>
            
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2 bg-neutral-700 px-3 py-1 rounded-full">
                <Instagram className="w-4 h-4 text-white" aria-hidden="true" />
                <span className="text-white text-xs font-medium">145K</span>
              </div>
              <div className="flex items-center gap-2 bg-neutral-700 px-3 py-1 rounded-full">
                <Youtube className="w-4 h-4 text-white" aria-hidden="true" />
                <span className="text-white text-xs font-medium">89K</span>
              </div>
              <div className="flex items-center gap-2 bg-neutral-700 px-3 py-1 rounded-full">
                <Twitter className="w-4 h-4 text-white" aria-hidden="true" />
                <span className="text-white text-xs font-medium">67K</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-neutral-700 text-white px-3 py-1 rounded-full text-xs mb-2">
              ⭐ 4.9/5 Rating
            </div>
            <p className="text-neutral-300 text-xs">127 Completed Projects</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
        <h3 className="text-base font-semibold text-white mb-4">Skills & Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {['Fashion', 'Technology', 'Lifestyle', 'Fitness', 'Travel', 'Food', 'Beauty', 'Gaming'].map((skill) => (
            <span key={skill} className="bg-neutral-700 text-white px-3 py-1 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4" aria-hidden="true" />
          Past Work Experience
        </h3>
        
        <div className="space-y-6">
          {[
            {
              brand: 'Nike',
              campaign: 'Air Max Campaign 2024',
              date: 'March 2024',
              platform: 'Instagram + TikTok',
              results: '2.3M impressions, 4.8% engagement',
              image: '/api/placeholder/80/80'
            },
            {
              brand: 'Apple',
              campaign: 'iPhone 15 Pro Review',
              date: 'February 2024',
              platform: 'YouTube',
              results: '890K views, 15K likes',
              image: '/api/placeholder/80/80'
            },
            {
              brand: 'Starbucks',
              campaign: 'Summer Menu Launch',
              date: 'January 2024',
              platform: 'Instagram Stories',
              results: '156K story views, 3.2% CTR',
              image: '/api/placeholder/80/80'
            }
          ].map((work, index) => (
            <div key={index} className="bg-neutral-700 rounded-lg p-6 hover:bg-neutral-600 transition-colors">
              <div className="flex items-center gap-6">
                <img 
                  src={work.image} 
                  alt={`${work.brand} campaign`} 
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => (e.target.src = '/fallback-image.jpg')}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white text-sm">{work.brand}</h4>
                    <span className="text-xs text-neutral-300">{work.date}</span>
                  </div>
                  <p className="text-neutral-300 text-xs mb-2">{work.campaign}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-300">
                    <span className="bg-neutral-600 px-2 py-1 rounded">{work.platform}</span>
                    <span>{work.results}</span>
                  </div>
                </div>
                <button className="text-white hover:text-neutral-300" aria-label={`View ${work.brand} campaign details`}>
                  <Eye className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4" aria-hidden="true" />
          Awards & Recognition
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Top Creator 2024', org: 'InfluencerHub Awards', date: 'Dec 2024' },
            { title: 'Best Tech Reviewer', org: 'Digital Content Awards', date: 'Nov 2024' },
            { title: 'Rising Star', org: 'Social Media Excellence', date: 'Oct 2024' },
            { title: 'Brand Partnership Excellence', org: 'Creator Economy Summit', date: 'Sep 2024' }
          ].map((award, index) => (
            <div key={index} className="bg-neutral-700 border border-neutral-600 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-neutral-600 p-2 rounded-full">
                  <Award className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{award.title}</h4>
                  <p className="text-xs text-neutral-300">{award.org}</p>
                  <p className="text-xs text-neutral-300">{award.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ));

  const Dashboard = memo(() => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-8 text-black">
        <h1 className="text-xl font-bold mb-2">Welcome back, Alex! 👋</h1>
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

  // Sidebar items with Portfolio and Settings moved slightly above the bottom
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'campaigns', label: 'My Campaigns', icon: Campaign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'portfolio', label: 'My Portfolio', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <motion.div
        className="bg-black border-r border-neutral-800 overflow-hidden"
        initial={{ width: isSidebarOpen ? '16rem' : '4rem' }}
        animate={{ width: isSidebarOpen ? '16rem' : '4rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="p-8 flex flex-row gap-2 items-center">
          <button
            onClick={handleSidebarToggle}
            className="text-white hover:text-neutral-300 p-2"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
          <img className='h-8 w-8' src="logo.png" alt="logo" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.h1
                className="text-xl underline underline-offset-4 font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                LinkFluence
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        
        <nav className="mt-6 flex flex-col h-[calc(100%-4rem)]">
          <div className="flex-1">
            {sidebarItems.slice(0, -2).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowBrowseCampaign(false);
                  setIsSearchExpanded(true);
                }}
                className={`w-full flex items-center gap-3 px-8 py-3 text-left hover:bg-neutral-800 transition-colors ${
                  activeTab === item.id ? 'bg-neutral-800 text-white border-r-2 border-white' : 'text-white'
                } ${isSidebarOpen ? '' : 'justify-center'}`}
                aria-current={activeTab === item.id ? 'page' : undefined}
                aria-label={`Go to ${item.label} section`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="text-sm"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
          <div className="mt-auto">
            {sidebarItems.slice(-2).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowBrowseCampaign(false);
                  setIsSearchExpanded(true);
                }}
                className={`w-full flex items-center gap-3 px-8 py-3 text-left hover:bg-neutral-800 transition-colors ${
                  activeTab === item.id ? 'bg-neutral-800 text-white border-r-2 border-white' : 'text-white'
                } ${isSidebarOpen ? '' : 'justify-center'}`}
                aria-current={activeTab === item.id ? 'page' : undefined}
                aria-label={`Go to ${item.label} section`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="text-sm"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </nav>
      </motion.div>

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
                {isSearchExpanded ? (
                  <motion.form
                    key="search-form"
                    onSubmit={handleSearchSubmit}
                    className="relative"
                    initial={{ width: '20rem', opacity: 0, scale: 0.9 }}
                    animate={{ width: '20rem', opacity: 1, scale: 1 }}
                    exit={{ width: 0, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Search campaigns, brands..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={handleSearchClick}
                      className="bg-neutral-800 text-white pl-10 pr-4 py-2 rounded-lg w-80 border border-neutral-600 focus:ring-2 focus:ring-neutral-500 focus:outline-none text-sm placeholder:text-neutral-400"
                      aria-label="Search campaigns or brands"
                    />
                  </motion.form>
                ) : (
                  <motion.button
                    key="mascot-button"
                    onClick={handleBrowseCampaignClose}
                    className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors"
                    aria-label="Close browse campaigns"
                    initial={{ scale: 0, opacity: 0, y: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: 'easeOut', type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm font-bold">Let's Earn!</span>
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
                  src="/api/placeholder/40/40"
                  alt="Profile picture"
                  className="w-10 h-10 rounded-full object-cover border-2 border-neutral-700"
                  onError={(e) => (e.target.src = '/fallback-image.jpg')}
                />
                <div>
                  <p className="text-white font-medium text-sm">Alex Johnson</p>
                  <p className="text-white text-xs">@alexj_creates</p>
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
                  initialSearchTerm={searchTerm} 
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
                  {activeTab === 'portfolio' && <Portfolio />}
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
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-neutral-800 rounded-xl p-8 w-full max-w-2xl border border-neutral-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-white">Add New Work</h3>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="text-neutral-300 hover:text-white"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">Brand Name</label>
                <input 
                  type="text" 
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:outline-none text-sm"
                  placeholder="e.g., Nike, Apple, Samsung..."
                  required
                  aria-required="true"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">Campaign Title</label>
                <input 
                  type="text" 
                  name="campaignTitle"
                  value={formData.campaignTitle}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:outline-none text-sm"
                  placeholder="Brief description of the campaign"
                  required
                  aria-required="true"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">Platform</label>
                  <select 
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:outline-none text-sm"
                    aria-label="Select platform"
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>Twitter</option>
                    <option>Multiple Platforms</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-2">Campaign Date</label>
                  <input 
                    type="date" 
                    name="campaignDate"
                    value={formData.campaignDate}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:outline-none text-sm"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">Results Achieved</label>
                <input 
                  type="text" 
                  name="results"
                  value={formData.results}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:outline-none text-sm"
                  placeholder="e.g., 2.3M impressions, 4.8% engagement rate"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">Campaign Image/Media</label>
                <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center hover:border-neutral-500 transition-colors">
                  <Camera className="w-10 h-10 text-neutral-300 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-neutral-300 text-xs">Click to upload or drag and drop</p>
                  <p className="text-xs text-neutral-300 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  aria-label="Cancel adding new work"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  aria-label="Add to portfolio"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Influencer_dashboard;