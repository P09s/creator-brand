import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Instagram, Youtube, Twitter, Globe, Star, Shield,
  MessageSquare, Bookmark, ExternalLink, Play, Film, Video, Eye,
  Users, CheckCircle, Target, Award
} from 'lucide-react';
import Avatar from './Avatar';
import TrustBadge from './TrustBadge';
import { getTrustScore, recordProfileView } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

function fmt(n) {
  if (!n || n === 0) return null;
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n/1_000).toFixed(1)}K`;
  return String(n);
}

const CONTENT_LABELS = {
  'short-form':   { label: 'Short-form',    icon: Play,  desc: 'Reels · Shorts · TikToks' },
  'long-form':    { label: 'Long-form',     icon: Film,  desc: 'YouTube · Podcasts' },
  'mixed':        { label: 'Mixed',          icon: Video, desc: 'Short + long content' },
  'stories-live': { label: 'Stories / Live', icon: Eye,   desc: 'Live streams · Stories' },
};

// ── Creator profile ───────────────────────────────────────────────────────────
function CreatorProfile({ user, profile, onMessage, onClose }) {
  const [trustScore, setTrustScore] = useState(0);

  useEffect(() => {
    getTrustScore(user._id).then(d => setTrustScore(d.trustScore || 0)).catch(() => {});
    recordProfileView(user._id).catch(() => {});
  }, [user._id]);

  const ss = profile?.socialStats || {};
  const contentType = CONTENT_LABELS[profile?.contentType];

  return (
    <div className="space-y-5">
      {/* Identity */}
      <div className="flex items-start gap-4">
        <Avatar src={profile?.avatar} name={user.name} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-white text-lg font-bold">{user.name}</h2>
            <TrustBadge score={trustScore} size="sm" />
          </div>
          <p className="text-gray-500 text-sm">{user.userName}</p>
          {profile?.niche?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profile.niche.map(n => (
                <span key={n} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{n}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <p className="text-gray-300 text-sm leading-relaxed bg-gray-900 rounded-xl p-4">
          {profile.bio}
        </p>
      )}

      {/* Content format */}
      {contentType && (
        <div className="flex items-center gap-3 bg-gray-900 rounded-xl px-4 py-3">
          <contentType.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-white text-sm font-medium">{contentType.label}</p>
            <p className="text-gray-500 text-xs">{contentType.desc}</p>
          </div>
        </div>
      )}

      {/* Social platforms */}
      {Object.entries(ss).some(([, v]) => v?.handle || v?.followers || v?.subscribers) && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Social reach</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'instagram', Icon: Instagram, color: 'text-pink-400', label: 'Instagram', countKey: 'followers', urlFn: h => `https://instagram.com/${h.replace('@','')}` },
              { key: 'youtube',   Icon: Youtube,   color: 'text-red-400',  label: 'YouTube',   countKey: 'subscribers', urlFn: h => `https://youtube.com/@${h.replace('@','')}` },
              { key: 'tiktok',    Icon: null,      color: 'text-gray-300', label: 'TikTok',    countKey: 'followers', urlFn: h => `https://tiktok.com/@${h.replace('@','')}` },
              { key: 'twitter',   Icon: Twitter,   color: 'text-blue-400', label: 'X/Twitter', countKey: 'followers', urlFn: h => `https://twitter.com/${h.replace('@','')}` },
            ].filter(p => ss[p.key]?.handle || ss[p.key]?.[p.countKey]).map(({ key, Icon, color, label, countKey, urlFn }) => {
              const d = ss[key];
              return (
                <div key={key} className="bg-black border border-gray-800 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {Icon ? <Icon className={`w-3.5 h-3.5 ${color}`} /> : <span className={`text-xs font-bold ${color}`}>TT</span>}
                      <span className="text-gray-400 text-xs">{label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {d.verified && <span className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">✓</span>}
                      {!d.verified && (d.handle || d[countKey]) && <span className="text-xs text-gray-700">self-rep.</span>}
                      {d.handle && (
                        <a href={urlFn(d.handle)} target="_blank" rel="noopener noreferrer" className={`${color} opacity-70 hover:opacity-100`}>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  {d.handle && <p className={`text-xs font-medium ${color} mb-1`}>{d.handle}</p>}
                  {d[countKey] > 0 && <p className="text-white text-base font-semibold">{fmt(d[countKey])}</p>}
                  {d.engagementRate > 0 && <p className="text-gray-600 text-xs">{d.engagementRate}% eng.</p>}
                  {d.avgViews > 0 && <p className="text-gray-600 text-xs">{fmt(d.avgViews)} avg views</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past collaborations */}
      {profile?.portfolio?.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Past collaborations</p>
          <div className="space-y-2">
            {profile.portfolio.slice(0, 3).map((item, i) => (
              <div key={i} className="bg-black border border-gray-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.brandName}</p>
                  <p className="text-gray-500 text-xs truncate">{item.campaignTitle} · {item.platform}</p>
                  {item.results && <p className="text-gray-400 text-xs mt-0.5">{item.results}</p>}
                </div>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex-shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onMessage}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black py-3 rounded-xl text-sm font-semibold transition-colors"
      >
        <MessageSquare className="w-4 h-4" /> Message this creator
      </button>
    </div>
  );
}

// ── Brand profile ─────────────────────────────────────────────────────────────
function BrandProfile({ user, profile, onMessage, onClose }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <Avatar src={profile?.avatar} name={user.name} size="xl" shape="rounded" />
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-lg font-bold mb-0.5">{user.name}</h2>
          <p className="text-gray-500 text-sm">{profile?.industry || 'Brand'}</p>
          {profile?.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1.5 transition-colors">
              <Globe className="w-3 h-3" /> {profile.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>

      {profile?.bio && (
        <p className="text-gray-300 text-sm leading-relaxed bg-gray-900 rounded-xl p-4">{profile.bio}</p>
      )}

      {profile?.campaignTypes?.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Campaign types</p>
          <div className="flex flex-wrap gap-2">
            {profile.campaignTypes.map(t => (
              <span key={t} className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onMessage}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black py-3 rounded-xl text-sm font-semibold transition-colors"
      >
        <MessageSquare className="w-4 h-4" /> Message this brand
      </button>
    </div>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
export default function ProfileModal({ user, profile, dashboardBase, onClose }) {
  const navigate = useNavigate();
  if (!user) return null;

  const isCreator = user.userType === 'influencer';

  const handleMessage = () => {
    onClose();
    navigate(`${dashboardBase}/messages?with=${user._id}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-gray-950 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Handle bar (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-gray-700 rounded-full" />
          </div>

          {/* Close (desktop) */}
          <div className="flex items-center justify-between px-6 pt-4 pb-2">
            <p className="text-gray-500 text-xs uppercase tracking-wider">
              {isCreator ? 'Creator profile' : 'Brand profile'}
            </p>
            <button onClick={onClose} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pb-8">
            {isCreator
              ? <CreatorProfile user={user} profile={profile} onMessage={handleMessage} onClose={onClose} />
              : <BrandProfile   user={user} profile={profile} onMessage={handleMessage} onClose={onClose} />
            }
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}