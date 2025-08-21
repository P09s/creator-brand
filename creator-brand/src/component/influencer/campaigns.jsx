import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Target, 
  Clock, 
  Upload, 
  ChevronRight, 
  Filter, 
  Search,
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
  BarChart3,
  MessageSquare,
  X,
  Image,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Campaigns = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [platformFilter, setPlatformFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentForm, setContentForm] = useState({
    campaignId: '',
    media: null,
    caption: '',
    platform: 'Instagram'
  });

  // Sample campaign data
  const campaigns = [
    {
      id: 1,
      brand: 'TechFlow',
      title: 'Product Launch Campaign',
      platform: 'Instagram',
      status: 'Live',
      deadline: '2025-08-20',
      budget: '$2,500',
      progress: 75,
      category: 'Technology',
      color: 'bg-green-500/10 text-green-400',
      type: 'active',
      metrics: { reach: '125K', engagement: '4.2%', clicks: '1.5K' },
      lastUpdate: '2 hours ago',
      tasks: [
        { id: 1, description: 'Submit draft post', completed: true },
        { id: 2, description: 'Post content', completed: false }
      ]
    },
    {
      id: 2,
      brand: 'StyleCorp',
      title: 'Summer Collection',
      platform: 'TikTok',
      status: 'Awaiting Approval',
      deadline: '2025-08-25',
      budget: '$1,800',
      progress: 20,
      category: 'Fashion',
      color: 'bg-yellow-500/10 text-yellow-400',
      type: 'active',
      metrics: { reach: '50K', engagement: '3.8%', clicks: '800' },
      lastUpdate: '1 day ago',
      tasks: [
        { id: 1, description: 'Review campaign brief', completed: true },
        { id: 2, description: 'Upload video', completed: false }
      ]
    },
    {
      id: 3,
      brand: 'FitnessPro',
      title: 'Workout Series',
      platform: 'YouTube',
      status: 'Completed',
      deadline: '2025-07-30',
      budget: '$2,000',
      progress: 100,
      category: 'Fitness',
      color: 'bg-blue-500/10 text-blue-400',
      type: 'past',
      metrics: { reach: '200K', engagement: '5.1%', clicks: '2.3K' },
      lastUpdate: '1 week ago',
      tasks: [
        { id: 1, description: 'Upload video series', completed: true },
        { id: 2, description: 'Share analytics', completed: true }
      ]
    },
    {
      id: 4,
      brand: 'FoodieApp',
      title: 'Recipe Contest',
      platform: 'Instagram',
      status: 'Draft Pending',
      deadline: '2025-09-10',
      budget: '$3,000',
      progress: 10,
      category: 'Food',
      color: 'bg-gray-500/10 text-gray-400',
      type: 'recent',
      metrics: { reach: '10K', engagement: '2.5%', clicks: '200' },
      lastUpdate: '3 hours ago',
      tasks: [
        { id: 1, description: 'Submit recipe idea', completed: false },
        { id: 2, description: 'Create content', completed: false }
      ]
    },
  ];

  const filteredCampaigns = campaigns
    .filter(campaign => campaign.type === activeFilter)
    .filter(campaign => 
      (campaign.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
       campaign.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (platformFilter ? campaign.platform === platformFilter : true) &&
      (categoryFilter ? campaign.category === categoryFilter : true) &&
      (budgetRange ? 
        parseFloat(campaign.budget.replace('$', '').replace(',', '')) >= parseFloat(budgetRange.split('-')[0]) &&
        parseFloat(campaign.budget.replace('$', '').replace(',', '')) <= parseFloat(budgetRange.split('-')[1] || Infinity) 
        : true)
    )
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'budget') {
        return parseFloat(b.budget.replace('$', '').replace(',', '')) - parseFloat(a.budget.replace('$', '').replace(',', ''));
      }
      return a.title.localeCompare(b.title);
    });

  const handleContentSubmit = (e) => {
    e.preventDefault();
    // Simulate content submission
    console.log('Submitting content:', contentForm);
    setIsContentModalOpen(false);
    setContentForm({ campaignId: '', media: null, caption: '', platform: 'Instagram' });
  };

  const ContentSubmissionModal = () => (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">Submit Campaign Content</h2>
          <button
            onClick={() => setIsContentModalOpen(false)}
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={handleContentSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Campaign</label>
            <select
              value={contentForm.campaignId}
              onChange={(e) => setContentForm({ ...contentForm, campaignId: e.target.value })}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm"
              aria-label="Select campaign"
            >
              <option value="">Select a campaign</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>{campaign.title} - {campaign.brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Media</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setContentForm({ ...contentForm, media: e.target.files[0] })}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm"
              aria-label="Upload media"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Caption</label>
            <textarea
              value={contentForm.caption}
              onChange={(e) => setContentForm({ ...contentForm, caption: e.target.value })}
              placeholder="Enter your caption..."
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm"
              rows="4"
              aria-label="Content caption"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Platform</label>
            <select
              value={contentForm.platform}
              onChange={(e) => setContentForm({ ...contentForm, platform: e.target.value })}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm"
              aria-label="Select platform"
            >
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            aria-label="Submit content"
          >
            Submit Content
          </button>
        </form>
      </motion.div>
    </motion.div>
  );

  const CampaignCard = ({ campaign }) => (
    <motion.div
      className="bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-sm font-medium text-white">{campaign.brand}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${campaign.color}`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-2">{campaign.title}</p>
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
            <span>Due {campaign.deadline}</span>
            <span className="mx-2">•</span>
            <span>{campaign.platform}</span>
            <span className="mx-2">•</span>
            <span>{campaign.budget}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <BarChart3 className="w-3 h-3 mr-1" aria-hidden="true" />
            <span>Reach: {campaign.metrics.reach}</span>
            <span className="mx-2">•</span>
            <span>Engagement: {campaign.metrics.engagement}</span>
            <span className="mx-2">•</span>
            <span>Clicks: {campaign.metrics.clicks}</span>
          </div>
          <div className="mt-3">
            <h4 className="text-xs text-gray-400 mb-1">Tasks</h4>
            {campaign.tasks
              .filter(task => showCompletedTasks || !task.completed)
              .map(task => (
                <div key={task.id} className="flex items-center text-xs text-gray-400 mb-1">
                  {task.completed ? (
                    <CheckCircle className="w-3 h-3 mr-1 text-green-400" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1 text-red-400" aria-hidden="true" />
                  )}
                  <span>{task.description}</span>
                </div>
              ))}
          </div>
        </div>
        <button 
          className="ml-3 text-gray-400 hover:text-white" 
          onClick={() => navigate(`/influencer_dashboard/campaigns/${campaign.id}`)}
          aria-label={`View details for ${campaign.brand} campaign`}
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            className="flex items-center text-xs text-gray-400 hover:text-white"
            onClick={() => {
              setContentForm({ ...contentForm, campaignId: campaign.id });
              setIsContentModalOpen(true);
            }}
            aria-label={`Upload content for ${campaign.brand}`}
          >
            <Upload className="w-3 h-3 mr-1" aria-hidden="true" />
            Upload Content
          </button>
          <button 
            className="flex items-center text-xs text-gray-400 hover:text-white"
            onClick={() => navigate(`/influencer_dashboard/messages?campaign=${campaign.id}`)}
            aria-label={`View messages for ${campaign.brand}`}
          >
            <MessageSquare className="w-3 h-3 mr-1" aria-hidden="true" />
            Messages
          </button>
          <button 
            className="flex items-center text-xs text-gray-400 hover:text-white"
            onClick={() => navigate(`/influencer_dashboard/analytics?campaign=${campaign.id}`)}
            aria-label={`View analytics for ${campaign.brand}`}
          >
            <BarChart3 className="w-3 h-3 mr-1" aria-hidden="true" />
            Analytics
          </button>
        </div>
        <p className="text-xs text-gray-500">Last updated: {campaign.lastUpdate}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white">Campaigns</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm placeholder:text-gray-400"
                aria-label="Search campaigns"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm"
              aria-label="Sort campaigns"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="budget">Sort by Budget</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaign Management Toolbar */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-purple-400" aria-hidden="true" />
            <h2 className="text-lg font-medium text-white">Manage Campaigns</h2>
          </div>
          <button
            onClick={() => setIsContentModalOpen(true)}
            className="flex items-center text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
            aria-label="Submit new content"
          >
            <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
            Submit Content
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Platform</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm"
              aria-label="Filter by platform"
            >
              <option value="">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Fashion">Fashion</option>
              <option value="Fitness">Fitness</option>
              <option value="Food">Food</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Budget Range</label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-800 focus:ring-2 focus:ring-gray-600 focus:outline-none text-sm"
              aria-label="Filter by budget range"
            >
              <option value="">All Budgets</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="2000-5000">$2,000 - $5,000</option>
              <option value="5000">$5,000+</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            checked={showCompletedTasks}
            onChange={() => setShowCompletedTasks(!showCompletedTasks)}
            className="h-4 w-4 text-blue-400 bg-gray-900 border-gray-800 rounded focus:ring-blue-500"
            aria-label="Show completed tasks"
          />
          <label className="ml-2 text-sm text-gray-400">Show completed tasks</label>
        </div>
      </div>

      {/* Tabs for filtering campaigns */}
      <div className="flex space-x-4 border-b border-gray-800">
        {['active', 'recent', 'past'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`pb-2 px-1 text-sm font-medium capitalize ${
              activeFilter === tab 
                ? 'text-white border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            aria-label={`View ${tab} campaigns`}
          >
            {tab} Campaigns
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          ) : (
            <motion.div
              className="bg-gray-950 border border-gray-800 rounded-xl p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-gray-400 text-sm">No {activeFilter} campaigns found.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Submission Modal */}
      <AnimatePresence>
        {isContentModalOpen && <ContentSubmissionModal />}
      </AnimatePresence>
    </div>
  );
};

export default Campaigns;