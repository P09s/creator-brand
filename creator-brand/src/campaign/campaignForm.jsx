import { useState } from 'react';
import { ChevronRight, ChevronLeft, Users, Target, DollarSign, Calendar, MapPin, Hash, Image, FileText, Check } from 'lucide-react';

function CampaignForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    campaignName: '',
    brandName: '',
    campaignType: '',
    description: '',
    targetAudience: '',
    demographics: {
      ageRange: { min: 18, max: 65 },
      gender: '',
      location: '',
      interests: []
    },
    budget: {
      min: '',
      max: '',
      type: 'fixed'
    },
    timeline: {
      startDate: '',
      endDate: '',
      deliverables: ''
    },
    contentType: [],
    platforms: [],
    contentGuidelines: '',
    hashtags: '',
    influencerTier: '',
    followerRange: { min: '', max: '' },
    engagementRate: '',
    previousBrands: '',
    exclusiveRights: false,
    contentApproval: false,
    analytics: false,
    additionalNotes: ''
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 6;

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.campaignName) newErrors.campaignName = 'Campaign name is required';
      if (!formData.brandName) newErrors.brandName = 'Brand name is required';
      if (!formData.campaignType) newErrors.campaignType = 'Campaign type is required';
    } else if (currentStep === 1) {
      if (!formData.targetAudience) newErrors.targetAudience = 'Target audience is required';
    } else if (currentStep === 3) {
      if (!formData.contentType.length) newErrors.contentType = 'At least one content type is required';
      if (!formData.platforms.length) newErrors.platforms = 'At least one platform is required';
    } else if (currentStep === 4) {
      if (!formData.influencerTier) newErrors.influencerTier = 'Influencer tier is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setErrors(prev => ({ ...prev, [field.split('.')[0]]: '' }));
  };

  const nextStep = () => {
    if (validateStep() && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      console.log('Campaign Data:', formData);
      alert('Campaign created successfully!');
    }
  };

  const steps = [
    {
      title: "Basic Information",
      icon: <FileText className="w-4 h-4" />,
      description: "Define your campaign's core details",
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Campaign Name *</label>
            <input
              type="text"
              value={formData.campaignName}
              onChange={(e) => updateFormData('campaignName', e.target.value)}
              placeholder="Enter campaign name"
              className={`w-full px-3 py-1.5 bg-neutral-800 border ${errors.campaignName ? 'border-red-500' : 'border-neutral-700'} rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200`}
              aria-invalid={!!errors.campaignName}
              aria-describedby="campaignName-error"
            />
            {errors.campaignName && <p id="campaignName-error" className="text-red-500 text-xs mt-1">{errors.campaignName}</p>}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Brand Name *</label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => updateFormData('brandName', e.target.value)}
              placeholder="Enter brand name"
              className={`w-full px-3 py-1.5 bg-neutral-800 border ${errors.brandName ? 'border-red-500' : 'border-neutral-700'} rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200`}
              aria-invalid={!!errors.brandName}
              aria-describedby="brandName-error"
            />
            {errors.brandName && <p id="brandName-error" className="text-red-500 text-xs mt-1">{errors.brandName}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Campaign Type *</label>
            <select
              value={formData.campaignType}
              onChange={(e) => updateFormData('campaignType', e.target.value)}
              className={`w-full px-3 py-1.5 bg-neutral-800 border ${errors.campaignType ? 'border-red-500' : 'border-neutral-700'} rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200`}
              aria-invalid={!!errors.campaignType}
              aria-describedby="campaignType-error"
            >
              <option value="">Select campaign type</option>
              <option value="product-launch">Product Launch</option>
              <option value="brand-awareness">Brand Awareness</option>
              <option value="seasonal">Seasonal Campaign</option>
              <option value="event">Event Promotion</option>
              <option value="user-generated">User Generated Content</option>
            </select>
            {errors.campaignType && <p id="campaignType-error" className="text-red-500 text-xs mt-1">{errors.campaignType}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Describe your campaign goals"
              rows={3}
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200 resize-none"
            />
          </div>
        </div>
      )
    },
    {
      title: "Target Audience",
      icon: <Users className="w-4 h-4" />,
      description: "Specify your ideal audience",
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Target Audience *</label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => updateFormData('targetAudience', e.target.value)}
              placeholder="e.g., Young professionals"
              className={`w-full px-3 py-1.5 bg-neutral-800 border ${errors.targetAudience ? 'border-red-500' : 'border-neutral-700'} rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200`}
              aria-invalid={!!errors.targetAudience}
              aria-describedby="targetAudience-error"
            />
            {errors.targetAudience && <p id="targetAudience-error" className="text-red-500 text-xs mt-1">{errors.targetAudience}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Age Range</label>
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  value={formData.demographics.ageRange.min}
                  onChange={(e) => updateFormData('demographics.ageRange', {...formData.demographics.ageRange, min: parseInt(e.target.value)})}
                  placeholder="18"
                  className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  value={formData.demographics.ageRange.max}
                  onChange={(e) => updateFormData('demographics.ageRange', {...formData.demographics.ageRange, max: parseInt(e.target.value)})}
                  placeholder="65"
                  className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Gender</label>
              <select
                value={formData.demographics.gender}
                onChange={(e) => updateFormData('demographics.gender', e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
            <input
              type="text"
              value={formData.demographics.location}
              onChange={(e) => updateFormData('demographics.location', e.target.value)}
              placeholder="e.g., United States, Global"
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Interests/Niches</label>
            <input
              type="text"
              value={formData.demographics.interests.join(', ')}
              onChange={(e) => updateFormData('demographics.interests', e.target.value.split(', ').filter(i => i.trim()))}
              placeholder="e.g., Fashion, Tech, Travel"
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
            />
          </div>
        </div>
      )
    },
    {
      title: "Budget & Timeline",
      icon: <DollarSign className="w-4 h-4" />,
      description: "Set your financial and time constraints",
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Budget Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['fixed', 'negotiable', 'per_post'].map((type) => (
                <button
                  key={type}
                  onClick={() => updateFormData('budget.type', type)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    formData.budget.type === type 
                      ? 'bg-white text-black shadow-sm' 
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  {type === 'per_post' ? 'Per Post' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Min Budget ($)</label>
              <input
                type="number"
                value={formData.budget.min}
                onChange={(e) => updateFormData('budget.min', e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Max Budget ($)</label>
              <input
                type="number"
                value={formData.budget.max}
                onChange={(e) => updateFormData('budget.max', e.target.value)}
                placeholder="5000"
                className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.timeline.startDate}
                onChange={(e) => updateFormData('timeline.startDate', e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={formData.timeline.endDate}
                onChange={(e) => updateFormData('timeline.endDate', e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Deliverables</label>
            <input
              type="text"
              value={formData.timeline.deliverables}
              onChange={(e) => updateFormData('timeline.deliverables', e.target.value)}
              placeholder="e.g., 3 posts, 1 Story"
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
            />
          </div>
        </div>
      )
    },
    {
      title: "Content Requirements",
      icon: <Image className="w-4 h-4" />,
      description: "Define content specifications",
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Content Types *</label>
            <div className="grid grid-cols-2 gap-2">
              {['Post', 'Story', 'Reel', 'Video', 'Blog', 'Review'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    const current = formData.contentType || [];
                    const updated = current.includes(type) 
                      ? current.filter(t => t !== type)
                      : [...current, type];
                    updateFormData('contentType', updated);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    (formData.contentType || []).includes(type)
                      ? 'bg-white text-black shadow-sm' 
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.contentType && <p className="text-red-500 text-xs mt-1">{errors.contentType}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Platforms *</label>
            <div className="grid grid-cols-3 gap-2">
              {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Facebook'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => {
                    const current = formData.platforms || [];
                    const updated = current.includes(platform) 
                      ? current.filter(p => p !== platform)
                      : [...current, platform];
                    updateFormData('platforms', updated);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    (formData.platforms || []).includes(platform)
                      ? 'bg-white text-black shadow-sm' 
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
            {errors.platforms && <p className="text-red-500 text-xs mt-1">{errors.platforms}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Content Guidelines</label>
            <textarea
              value={formData.contentGuidelines}
              onChange={(e) => updateFormData('contentGuidelines', e.target.value)}
              placeholder="Brand tone, style preferences..."
              rows={3}
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Required Hashtags</label>
            <input
              type="text"
              value={formData.hashtags}
              onChange={(e) => updateFormData('hashtags', e.target.value)}
              placeholder="#brand #campaign"
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
            />
          </div>
        </div>
      )
    },
    {
      title: "Influencer Preferences",
      icon: <Target className="w-4 h-4" />,
      description: "Select your ideal influencers",
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Influencer Tier *</label>
            <div className="grid grid-cols-2 gap-2">
              {['Nano (1K-10K)', 'Micro (10K-100K)', 'Mid (100K-500K)', 'Macro (500K-1M)', 'Mega (1M+)', 'Celebrity'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => updateFormData('influencerTier', tier)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    formData.influencerTier === tier 
                      ? 'bg-white text-black shadow-sm' 
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
            {errors.influencerTier && <p className="text-red-500 text-xs mt-1">{errors.influencerTier}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Min Followers</label>
              <input
                type="number"
                value={formData.followerRange.min}
                onChange={(e) => updateFormData('followerRange.min', e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Max Followers</label>
              <input
                type="number"
                value={formData.followerRange.max}
                onChange={(e) => updateFormData('followerRange.max', e.target.value)}
                placeholder="100000"
                className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Min Engagement Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.engagementRate}
              onChange={(e) => updateFormData('engagementRate', e.target.value)}
              placeholder="2.5"
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Previous Brand Collaborations</label>
            <select
              value={formData.previousBrands}
              onChange={(e) => updateFormData('previousBrands', e.target.value)}
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200"
            >
              <option value="">Any</option>
              <option value="similar">Similar brands</option>
              <option value="no-competitors">No competitors</option>
              <option value="luxury">Luxury brands</option>
              <option value="new-influencers">Fresh faces</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: "Final Details",
      icon: <Check className="w-4 h-4" />,
      description: "Review and finalize your campaign",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-300 mb-1">Additional Requirements</label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.exclusiveRights}
                onChange={(e) => updateFormData('exclusiveRights', e.target.checked)}
                className="w-3.5 h-3.5 bg-neutral-800 border-neutral-700 rounded focus:ring-1 focus:ring-white/20 text-white transition-all duration-200"
              />
              <span className="text-xs text-gray-300">Exclusive usage rights</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.contentApproval}
                onChange={(e) => updateFormData('contentApproval', e.target.checked)}
                className="w-3.5 h-3.5 bg-neutral-800 border-neutral-700 rounded focus:ring-1 focus:ring-white/20 text-white transition-all duration-200"
              />
              <span className="text-xs text-gray-300">Content approval</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.analytics}
                onChange={(e) => updateFormData('analytics', e.target.checked)}
                className="w-3.5 h-3.5 bg-neutral-800 border-neutral-700 rounded focus:ring-1 focus:ring-white/20 text-white transition-all duration-200"
              />
              <span className="text-xs text-gray-300">Analytics reporting</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Additional Notes</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              placeholder="Special requirements..."
              rows={3}
              className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white transition-all duration-200 resize-none"
            />
          </div>

          <div className="bg-neutral-800 p-3 rounded-md shadow-sm border border-neutral-700">
            <h3 className="text-sm font-medium text-white mb-2">Campaign Summary</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p><span className="text-white font-medium">Campaign:</span> {formData.campaignName || 'Not set'}</p>
              <p><span className="text-white font-medium">Type:</span> {formData.campaignType || 'Not set'}</p>
              <p><span className="text-white font-medium">Budget:</span> ${formData.budget.min || 'Not set'} - ${formData.budget.max || 'Not set'}</p>
              <p><span className="text-white font-medium">Platforms:</span> {(formData.platforms || []).join(', ') || 'Not set'}</p>
              <p><span className="text-white font-medium">Content Types:</span> {(formData.contentType || []).join(', ') || 'Not set'}</p>
              <p><span className="text-white font-medium">Target Audience:</span> {formData.targetAudience || 'Not set'}</p>
              <p><span className="text-white font-medium">Influencer Tier:</span> {formData.influencerTier || 'Not set'}</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-neutral-900 text-white p-4 rounded-lg shadow-md">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-white">Create Campaign</h2>
          <span className="text-xs text-gray-400">{currentStep + 1} of {totalSteps}</span>
        </div>
        
        <div className="relative w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-white to-gray-300 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center group">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${index <= currentStep ? 'bg-white text-black' : 'bg-neutral-800 text-gray-400'}`}>
                {step.icon}
              </div>
              <span className="absolute top-9 text-xs text-gray-400 hidden group-hover:flex gap-1 whitespace-nowrap transition-opacity duration-300">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800 pr-1">
        <div className="mb-4 mt-4">
          <h3 className="text-lg font-medium text-white">{steps[currentStep].title}</h3>
          <p className="text-xs text-gray-400 mt-1">{steps[currentStep].description}</p>
        </div>
        
        {steps[currentStep].component}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center space-x-1 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            currentStep === 0 
              ? 'bg-neutral-800 text-gray-500 cursor-not-allowed' 
              : 'bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:shadow-sm'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {currentStep === totalSteps - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-1 px-4 py-1.5 bg-gradient-to-r from-white to-gray-200 text-black rounded-md text-sm font-medium hover:from-gray-100 hover:to-gray-300 transition-all duration-200 shadow-sm"
          >
            <span>Create Campaign</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="flex items-center space-x-1 px-4 py-1.5 bg-gradient-to-r from-white to-gray-200 text-black rounded-md text-sm font-medium hover:from-gray-100 hover:to-gray-300 transition-all duration-200 shadow-sm"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default CampaignForm;