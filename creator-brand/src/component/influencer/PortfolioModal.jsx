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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-neutral-800 rounded-xl p-8 w-full max-w-2xl border border-neutral-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-white">Add New Work</h3>
          <button 
            onClick={onClose}
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
              onClick={onClose}
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
  );
};

export default PortfolioModal;