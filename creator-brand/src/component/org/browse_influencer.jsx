import React, { useState, useEffect } from 'react';
import { Search, Shield, Star, Users, MessageSquare, ChevronDown, Loader2, Instagram, Youtube, Twitter, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInfluencers, getTrustScore } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import Avatar from '../shared/Avatar';
import ProfileModal from '../shared/ProfileModal';
import toast from 'react-hot-toast';

const NICHES = ['All', 'Fashion', 'Technology', 'Food', 'Fitness', 'Travel', 'Beauty', 'Gaming', 'Lifestyle', 'Education'];

const platformIcon = { Instagram, YouTube: Youtube, Twitter };
const platformColor = { Instagram: 'text-pink-400', YouTube: 'text-red-400', Twitter: 'text-blue-400' };

export default function BrowseInfluencer() {
  const [creators, setCreators] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getInfluencers();
        setCreators(data);
      } catch {
        toast.error('Failed to load creators');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = creators.filter(({ user, profile }) => {
    const q = search.toLowerCase();
    const matchSearch = !q || user?.name?.toLowerCase().includes(q) || user?.userName?.toLowerCase().includes(q);
    const matchNiche = niche === 'All' || profile?.niche?.includes(niche);
    return matchSearch && matchNiche;
  });

  const avatarColors = ['from-purple-500/40 to-pink-500/40', 'from-blue-500/40 to-cyan-500/40', 'from-green-500/40 to-teal-500/40', 'from-amber-500/40 to-orange-500/40'];
  const trustLevel = (score) => score >= 80 ? { label: 'Elite', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' }
    : score >= 60 ? { label: 'Trusted', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' }
    : score > 0 ? { label: 'Rising', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
    : { label: 'New', color: 'text-gray-400', bg: 'bg-gray-800 border-gray-700' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Browse Creators</h1>
        <p className="text-gray-500 text-xs mt-1">Find creators that match your brand — message them or post a campaign and let them apply</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or handle..."
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
        </div>
        <div className="relative">
          <select value={niche} onChange={e => setNiche(e.target.value)}
            className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm appearance-none pr-8 focus:outline-none focus:border-gray-600">
            {NICHES.map(n => <option key={n}>{n}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gray-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-16 text-center">
          <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{creators.length === 0 ? 'No creators have signed up yet' : 'No creators match your search'}</p>
          <p className="text-gray-600 text-xs mt-1">Post a campaign instead and let creators discover you</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map(({ user, profile, trustScore = 0 }, i) => {
              const trust = trustLevel(trustScore);
              return (
                <motion.div key={user._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedProfile({ user, profile })}
                  className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all cursor-pointer flex flex-col">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar src={profile?.avatar} name={user.name} size="lg" />
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.userName}</p>
                    </div>
                  </div>

                  {/* Trust badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${trust.bg} ${trust.color}`}>
                      <Shield className="w-3 h-3" /> {trust.label}
                    </span>
                    {profile?.niche?.slice(0, 2).map(n => (
                      <span key={n} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{n}</span>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-gray-400 text-xs flex-1 mb-4 line-clamp-2">
                    {profile?.bio || 'Creator hasn\'t added a bio yet.'}
                  </p>

                  {/* Platform followers */}
                  {profile?.platforms?.length > 0 && (
                    <div className="flex gap-3 mb-4">
                      {profile.platforms.slice(0, 3).map(p => {
                        const Icon = platformIcon[p];
                        const color = platformColor[p] || 'text-gray-400';
                        return Icon ? (
                          <div key={p} className="flex items-center gap-1">
                            <Icon className={`w-3.5 h-3.5 ${color}`} />
                            <span className="text-gray-400 text-xs">{p}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Stats */}
                  {profile?.followers > 0 && (
                    <p className="text-gray-500 text-xs mb-4">
                      {(profile.followers / 1000).toFixed(1)}K followers · {profile.engagementRate || 0}% engagement
                    </p>
                  )}

                  {/* Social links — tap through to actual profiles */}
                  {profile?.socialLinks && Object.values(profile.socialLinks).some(v => v) && (
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {profile.socialLinks.instagram && (
                        <a href={`https://instagram.com/${profile.socialLinks.instagram.replace('@','')}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors">
                          <Instagram className="w-3 h-3" /> {profile.socialLinks.instagram.replace('@','')}
                        </a>
                      )}
                      {profile.socialLinks.youtube && (
                        <a href={`https://youtube.com/@${profile.socialLinks.youtube.replace('@','')}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                          <Youtube className="w-3 h-3" /> {profile.socialLinks.youtube.replace('@','')}
                        </a>
                      )}
                      {profile.socialLinks.tiktok && (
                        <a href={`https://tiktok.com/@${profile.socialLinks.tiktok.replace('@','')}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
                          TikTok @{profile.socialLinks.tiktok.replace('@','')}
                        </a>
                      )}
                      {profile.socialLinks.website && (
                        <a href={profile.socialLinks.website}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          <Globe className="w-3 h-3" /> Portfolio
                        </a>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/org_dashboard/messages?with=${user._id}`)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-800 hover:border-gray-600 text-gray-300 hover:text-white py-2.5 rounded-xl text-xs font-medium transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Message creator
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      {selectedProfile && (
        <ProfileModal
          user={selectedProfile.user}
          profile={selectedProfile.profile}
          dashboardBase="/org_dashboard"
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}