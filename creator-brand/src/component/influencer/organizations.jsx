import React, { useState, useEffect } from 'react';
import { Search, Globe, Shield, MessageSquare, ChevronDown, Loader2, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBrands } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const INDUSTRIES = ['All', 'Fashion', 'Technology', 'Food', 'Fitness', 'Travel', 'Beauty', 'Gaming', 'Education'];

export default function Organizations() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getBrands();
        setBrands(data);
      } catch {
        toast.error('Failed to load brands');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = brands.filter(({ user, profile }) => {
    const q = search.toLowerCase();
    const matchSearch = !q || user?.name?.toLowerCase().includes(q);
    const matchIndustry = industry === 'All' || profile?.industry === industry;
    return matchSearch && matchIndustry;
  });

  const getInitial = (name) => name?.[0]?.toUpperCase() || '?';
  const avatarColors = ['from-blue-500/40 to-purple-500/40', 'from-green-500/40 to-teal-500/40', 'from-amber-500/40 to-orange-500/40', 'from-pink-500/40 to-red-500/40'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Brands</h1>
        <p className="text-gray-500 text-xs mt-1">Find brands that match your niche — message them directly or apply to their campaigns</p>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brands..."
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
        </div>
        <div className="relative">
          <select value={industry} onChange={e => setIndustry(e.target.value)}
            className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm appearance-none pr-8 focus:outline-none focus:border-gray-600">
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gray-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-16 text-center">
          <Building2 className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{brands.length === 0 ? 'No brands have signed up yet' : 'No brands match your search'}</p>
          <p className="text-gray-600 text-xs mt-1">Check back soon — brands are joining every day</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map(({ user, profile }, i) => (
              <motion.div key={user._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors flex flex-col">
                {/* Brand header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} border border-gray-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {getInitial(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{user.name}</p>
                    <p className="text-gray-500 text-xs">{profile?.industry || 'Brand'}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-400 text-xs flex-1 mb-4 line-clamp-3">
                  {profile?.bio || 'This brand hasn\'t added a description yet.'}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                  {profile?.isPro && (
                    <span className="flex items-center gap-1 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                {/* Action */}
                <button
                  onClick={() => navigate(`/influencer_dashboard/messages?with=${user._id}`)}
                  className="w-full flex items-center justify-center gap-2 border border-gray-800 hover:border-gray-600 text-gray-300 hover:text-white py-2.5 rounded-xl text-xs font-medium transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Message brand
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}