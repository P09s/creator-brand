import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, DollarSign, Users, Calendar, Tag } from 'lucide-react';

// Utility function to generate consistent background colors for platforms and tiers
const getDynamicColor = (value) => {
  const colors = [
    'bg-blue-600',
    'bg-green-600',
    'bg-purple-600',
    'bg-red-600',
    'bg-yellow-600',
    'bg-teal-600',
  ];
  const index = value.charCodeAt(0) % colors.length;
  return `${colors[index]} text-white`;
};

const BrowseCampaign = ({ setActiveTab, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedContentType, setSelectedContentType] = useState('');
  const [minBudget, setMinBudget] = useState('');

  // Set initial search term when component mounts
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Sample campaign data
  const campaigns = [
    {
      id: 1,
      campaign: "Summer Fashion Collection 2025",
      campaignType: "Product Launch",
      budget: 5000,
      platforms: ["Instagram", "TikTok"],
      contentType: "Photo + Video",
      targetAudience: "Women 18-35",
      influencerTier: "Micro",
      deadline: "2025-08-20",
      description: "Promote our new summer fashion line with authentic styling content"
    },
    {
      id: 2,
      campaign: "Tech Gadget Review Series",
      campaignType: "Product Review",
      budget: 8000,
      platforms: ["YouTube", "Instagram"],
      contentType: "Video Review",
      targetAudience: "Tech Enthusiasts 25-45",
      influencerTier: "Mid",
      deadline: "2025-08-15",
      description: "In-depth reviews of our latest tech products with honest opinions"
    },
    {
      id: 3,
      campaign: "Fitness Challenge Campaign",
      campaignType: "Brand Awareness",
      budget: 3000,
      platforms: ["TikTok", "Instagram"],
      contentType: "Video Challenge",
      targetAudience: "Fitness Enthusiasts 20-40",
      influencerTier: "Nano",
      deadline: "2025-08-25",
      description: "Create engaging fitness challenge content to boost brand visibility"
    },
    {
      id: 4,
      campaign: "Luxury Travel Experience",
      campaignType: "Brand Partnership",
      budget: 12000,
      platforms: ["Instagram", "YouTube"],
      contentType: "Travel Vlog",
      targetAudience: "Travel Lovers 25-50",
      influencerTier: "Macro",
      deadline: "2025-09-01",
      description: "Showcase luxury travel destinations with immersive content"
    },
    {
      id: 5,
      campaign: "Skincare Routine Tutorial",
      campaignType: "Educational",
      budget: 4500,
      platforms: ["Instagram", "TikTok"],
      contentType: "Tutorial",
      targetAudience: "Beauty Enthusiasts 18-40",
      influencerTier: "Micro",
      deadline: "2025-08-18",
      description: "Educational skincare tutorials featuring our product line"
    },
    {
      id: 6,
      campaign: "Gaming Tournament Sponsorship",
      campaignType: "Event Sponsorship",
      budget: 15000,
      platforms: ["Twitch", "YouTube"],
      contentType: "Live Stream",
      targetAudience: "Gamers 16-35",
      influencerTier: "Macro",
      deadline: "2025-08-30",
      description: "Live streaming coverage of gaming tournament with brand integration"
    }
  ];

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = !selectedPlatform || campaign.platforms.includes(selectedPlatform);
      const matchesTier = !selectedTier || campaign.influencerTier === selectedTier;
      const matchesContentType = !selectedContentType || campaign.contentType.includes(selectedContentType);
      const matchesBudget = !minBudget || campaign.budget >= parseInt(minBudget);

      return matchesSearch && matchesPlatform && matchesTier && matchesContentType && matchesBudget;
    });
  }, [searchTerm, selectedPlatform, selectedTier, selectedContentType, minBudget]);

  const getTierColor = (tier) => getDynamicColor(tier);
  const getPlatformColor = (platform) => getDynamicColor(platform);

  return (
    <div className="min-h-screen bg-black text-white font-sans text-sm leading-relaxed">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Browse Campaigns</h1>
            <p className="text-gray-400 text-xs">Discover and apply to exciting brand campaigns</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search */}
            <div className="xl:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-2">Search Campaigns</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gray-600"
                  aria-label="Search campaigns"
                />
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gray-600"
                aria-label="Select platform"
              >
                <option value="">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitch">Twitch</option>
              </select>
            </div>

            {/* Tier Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Tier</label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gray-600"
                aria-label="Select influencer tier"
              >
                <option value="">All Tiers</option>
                <option value="Nano">Nano</option>
                <option value="Micro">Micro</option>
                <option value="Mid">Mid</option>
                <option value="Macro">Macro</option>
              </select>
            </div>

            {/* Content Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Content Type</label>
              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gray-600"
                aria-label="Select content type"
              >
                <option value="">All Types</option>
                <option value="Photo">Photo</option>
                <option value="Video">Video</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Review">Review</option>
              </select>
            </div>

            {/* Budget Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Min Budget</label>
              <input
                type="number"
                placeholder="Min budget"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-600"
                aria-label="Enter minimum budget"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-gray-950 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors duration-200 p-6">
              {/* Campaign Header */}
              <div className="mb-4">
                <h3 className="text-base font-semibold text-white mb-2">{campaign.campaign}</h3>
                <span className="inline-block bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
                  {campaign.campaignType}
                </span>
              </div>

              {/* Budget */}
              <div className="flex items-center mb-4">
                <DollarSign className="w-4 h-4 text-gray-400 mr-2" aria-hidden="true" />
                <span className="text-lg font-bold text-white">${campaign.budget.toLocaleString()}</span>
              </div>

              {/* Platforms */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map((platform, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getPlatformColor(platform)}`}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <Tag className="w-4 h-4 text-gray-400 mr-2 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs text-gray-400">Content Type: </span>
                    <span className="text-xs text-white">{campaign.contentType}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-4 h-4 text-gray-400 mr-2 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs text-gray-400">Target: </span>
                    <span className="text-xs text-white">{campaign.targetAudience}</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs text-gray-400">Deadline: </span>
                    <span className="text-xs text-white">{campaign.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Tier Badge */}
              <div className="mb-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTierColor(campaign.influencerTier)}`}>
                  {campaign.influencerTier} Influencer
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                {campaign.description}
              </p>

              {/* Action Button */}
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                aria-label={`Apply for ${campaign.campaign} campaign`}
              >
                Apply to Campaign
              </button>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-10 h-10 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-base font-medium text-gray-400 mb-2">No campaigns found</h3>
            <p className="text-gray-400 text-xs">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCampaign;