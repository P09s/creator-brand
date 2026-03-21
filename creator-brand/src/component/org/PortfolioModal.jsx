import React, { useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { addPortfolioItem } from '../../services/apiService';
import toast from 'react-hot-toast';

const PortfolioModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    brandName: '', campaignTitle: '', platform: 'Instagram', campaignDate: '', results: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addPortfolioItem(formData);
      toast.success('Added to portfolio!');
      setFormData({ brandName: '', campaignTitle: '', platform: 'Instagram', campaignDate: '', results: '' });
      onClose();
    } catch {
      toast.error('Failed to save — try again');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 rounded-2xl p-6 w-full max-w-lg border border-gray-800 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-semibold">Add past collaboration</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Brand name *</label>
            <input type="text" name="brandName" value={formData.brandName} onChange={handleChange} required
              placeholder="e.g. Nike, Myntra, boAt"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Campaign / project title *</label>
            <input type="text" name="campaignTitle" value={formData.campaignTitle} onChange={handleChange} required
              placeholder="e.g. Summer collection launch"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Platform</label>
              <select name="platform" value={formData.platform} onChange={handleChange}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600">
                {['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Multiple'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Date *</label>
              <input type="date" name="campaignDate" value={formData.campaignDate} onChange={handleChange} required
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Results (optional)</label>
            <input type="text" name="results" value={formData.results} onChange={handleChange}
              placeholder="e.g. 2.3M impressions, 4.8% engagement"
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-800 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-white hover:bg-gray-100 disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving...' : 'Add to portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioModal;