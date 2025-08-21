import React from 'react';
import { Camera } from 'lucide-react';

const PortfolioModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData 
}) => {
  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('New Portfolio Item:', formData);
    setFormData({ brandName: '', campaignTitle: '', platform: 'Instagram', campaignDate: '', results: '' });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="bg-gray-900/80 rounded-2xl p-8 w-full max-w-2xl border border-gray-700/70 shadow-lg shadow-purple-500/10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">✨ Add New Work</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-pink-400 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
            <input 
              type="text" 
              name="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              className="w-full bg-gray-800/80 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              placeholder="e.g., Nike, Apple, Samsung..."
              required
            />
          </div>
          
          {/* Campaign Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Title</label>
            <input 
              type="text" 
              name="campaignTitle"
              value={formData.campaignTitle}
              onChange={handleInputChange}
              className="w-full bg-gray-800/80 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Brief description of the campaign"
              required
            />
          </div>
          
          {/* Platform + Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
              <select 
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                className="w-full bg-gray-800/80 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              >
                <option>Instagram</option>
                <option>TikTok</option>
                <option>YouTube</option>
                <option>Twitter</option>
                <option>Multiple Platforms</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Date</label>
              <input 
                type="date" 
                name="campaignDate"
                value={formData.campaignDate}
                onChange={handleInputChange}
                className="w-full bg-gray-800/80 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm"
                required
              />
            </div>
          </div>
          
          {/* Results */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Results Achieved</label>
            <input 
              type="text" 
              name="results"
              value={formData.results}
              onChange={handleInputChange}
              className="w-full bg-gray-800/80 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
              placeholder="e.g., 2.3M impressions, 4.8% engagement rate"
            />
          </div>
          
          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Image/Media</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500/70 transition-colors cursor-pointer">
              <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-gray-300 text-xs">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white py-2 px-4 rounded-lg transition-colors text-sm"
              aria-label="Cancel adding new work"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm shadow-md"
              aria-label="Add to portfolio"
            >
              + Add to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioModal;
