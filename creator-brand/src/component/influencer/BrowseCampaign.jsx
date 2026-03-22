import React, { useState } from 'react';
import { Search, DollarSign, Calendar, Users, Zap, Loader2, CheckCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrowseCampaigns } from '../../hooks/useCampaigns';
import { applyToCampaign, withdrawApplication } from '../../services/apiService';
import useAuthStore from '../../store/authStore';
import AIContentSuggestions from './AIContentSuggestions';
import toast from 'react-hot-toast';
import { notifyApplied } from '../../store/notificationStore';

const getDynamicColor = (value) => {
  const colors = ['bg-blue-500/10 text-blue-400', 'bg-green-500/10 text-green-400', 'bg-purple-500/10 text-purple-400', 'bg-amber-500/10 text-amber-400', 'bg-pink-500/10 text-pink-400'];
  return colors[(value?.charCodeAt(0) || 0) % colors.length];
};

export default function BrowseCampaign({ initialSearchTerm = '', onClose }) {
  const { campaigns, loading, search } = useBrowseCampaigns();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [platformFilter, setPlatformFilter] = useState('');
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState(new Set());
  const [withdrawing, setWithdrawing] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    search({ search: searchTerm, platform: platformFilter });
  };

  const handleApply = async (campaignId) => {
    if (applied.has(campaignId)) return;
    setApplying(campaignId);
    try {
      await applyToCampaign(campaignId);
      setApplied(prev => new Set([...prev, campaignId]));
      const camp = campaigns.find(c => c._id === campaignId);
      if (camp) notifyApplied(camp.title);
      toast.success('Application sent!');
    } catch (err) {
      toast.error('Already applied or error occurred');
    } finally {
      setApplying(null);
    }
  };

  const handleWithdraw = async (campaignId, e) => {
    e.stopPropagation();
    setWithdrawing(campaignId);
    try {
      await withdrawApplication(campaignId);
      setApplied(prev => { const n = new Set(prev); n.delete(campaignId); return n; });
      toast.success('Application withdrawn');
    } catch (err) {
      toast.error(err.message || 'Cannot withdraw — you may have been accepted');
    } finally {
      setWithdrawing(null);
    }
  };

  const filtered = campaigns.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || c.title?.toLowerCase().includes(q) || c.brandName?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
    const matchPlatform = !platformFilter || c.platform === platformFilter;
    return matchSearch && matchPlatform;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Browse Campaigns</h1>
        <span className="text-gray-500 text-xs">{filtered.length} available</span>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by brand, title, category..."
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
          />
        </div>
        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}
          className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none">
          <option value="">All Platforms</option>
          {['Instagram','YouTube','TikTok','Twitter','LinkedIn'].map(p => <option key={p}>{p}</option>)}
        </select>
        <button type="submit" className="bg-white text-black px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
          Search
        </button>
      </form>

      {/* AI Content Ideas */}
      <AIContentSuggestions campaignDescription={selected?.description || ''} />

      {/* Campaign grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-16 text-center">
          <Search className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No campaigns found.</p>
          <p className="text-gray-600 text-xs mt-1">Try different search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filtered.map((c, i) => {
              const isApplied = applied.has(c._id) || c.applicants?.includes(user?._id);
              const isApplying = applying === c._id;
              return (
                <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-gray-950 border rounded-xl p-5 cursor-pointer transition-all ${selected?._id === c._id ? 'border-purple-500/50' : 'border-gray-800 hover:border-gray-700'}`}
                  onClick={() => setSelected(s => s?._id === c._id ? null : c)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-white font-medium text-sm">{c.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getDynamicColor(c.platform)}`}>{c.platform}</span>
                        {c.openToNewCreators && (
                          <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                            ★ Open to new creators
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getDynamicColor(c.category)}`}>{c.category}</span>
                      </div>
                      <p className="text-gray-500 text-xs mb-1">by {c.brandName}</p>
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">{c.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${c.budget?.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.deadline).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.applicants?.length > 10 ? "10+ applied" : c.applicants?.length > 0 ? `${c.applicants.length} applied` : "Be first to apply"}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isApplied ? (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-2 rounded-xl text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Applied
                          </div>
                          <button
                            onClick={e => handleWithdraw(c._id, e)}
                            disabled={withdrawing === c._id}
                            className="flex items-center justify-center gap-1 text-gray-600 hover:text-red-400 text-xs transition-colors px-1 py-0.5"
                          >
                            {withdrawing === c._id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                            Withdraw
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); handleApply(c._id); }}
                          disabled={isApplying}
                          className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {isApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                  {selected?._id === c._id && c.requirements && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-gray-500 text-xs mb-1 font-medium uppercase tracking-wider">Requirements</p>
                      <p className="text-gray-300 text-xs">{c.requirements}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}