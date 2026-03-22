import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, CheckCircle, TrendingUp, Sparkles, Loader2,
  Instagram, Youtube, Twitter, Edit3, AlertCircle, ChevronDown,
  ChevronUp, Send, Shield, Eye, Star, Link2, Play, ExternalLink,
  Video, Film
} from 'lucide-react';
import {
  getAcceptedCampaigns, getMyProfile, updateMyProfile,
  getAnalyticsInsight, submitPostMetrics
} from '../../services/apiService';
import useAuthStore from '../../store/authStore';
import Avatar from '../shared/Avatar';
import TrustBadge, { CompletionBar } from '../shared/TrustBadge';
import toast from 'react-hot-toast';

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  if (!n || n === 0) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const CONTENT_TYPES = [
  { key: 'short-form',   label: 'Short-form',   desc: 'Reels, Shorts, TikToks (< 60s)',  icon: Play  },
  { key: 'long-form',    label: 'Long-form',     desc: 'YouTube videos, podcasts (> 5m)', icon: Film  },
  { key: 'mixed',        label: 'Mixed',          desc: 'Both short and long content',     icon: Video },
  { key: 'stories-live', label: 'Stories / Live', desc: 'Live streams, ephemeral content', icon: Eye   },
];

// ── Platform config ───────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    key: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    color: 'text-pink-400',
    border: 'border-pink-500/20',
    bg: 'bg-pink-500/5',
    urlFn: h => `https://instagram.com/${h.replace('@', '')}`,
    fields: [
      { key: 'handle',         label: '@username',       placeholder: '@yourhandle', type: 'text'   },
      { key: 'followers',      label: 'Followers',       placeholder: '12500',       type: 'number' },
      { key: 'engagementRate', label: 'Engagement rate %', placeholder: '4.2',      type: 'number' },
    ],
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: Youtube,
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/5',
    urlFn: h => `https://youtube.com/@${h.replace('@', '')}`,
    fields: [
      { key: 'handle',      label: '@channel',          placeholder: '@yourchannel', type: 'text'   },
      { key: 'subscribers', label: 'Subscribers',       placeholder: '5000',         type: 'number' },
      { key: 'avgViews',    label: 'Avg views / video', placeholder: '2500',         type: 'number' },
    ],
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: null,
    color: 'text-gray-300',
    border: 'border-gray-500/20',
    bg: 'bg-gray-500/5',
    urlFn: h => `https://tiktok.com/@${h.replace('@', '')}`,
    fields: [
      { key: 'handle',    label: '@username',        placeholder: '@yourhandle', type: 'text'   },
      { key: 'followers', label: 'Followers',        placeholder: '12500',       type: 'number' },
      { key: 'avgViews',  label: 'Avg views / video', placeholder: '8000',      type: 'number' },
    ],
  },
  {
    key: 'twitter',
    label: 'X / Twitter',
    icon: Twitter,
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
    urlFn: h => `https://twitter.com/${h.replace('@', '')}`,
    fields: [
      { key: 'handle',    label: '@username',  placeholder: '@yourhandle', type: 'text'   },
      { key: 'followers', label: 'Followers',  placeholder: '3200',        type: 'number' },
    ],
  },
];

// ── Social reach section ──────────────────────────────────────────────────────
function SocialReachSection({ stats, onSave }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(() => {
    // Deep clone so we don't mutate prop
    const out = {};
    PLATFORMS.forEach(p => { out[p.key] = { ...(stats?.[p.key] || {}) }; });
    return out;
  });
  const [saving, setSaving] = useState(false);

  // Sync when parent profile loads
  useEffect(() => {
    const out = {};
    PLATFORMS.forEach(p => { out[p.key] = { ...(stats?.[p.key] || {}) }; });
    setLocal(out);
  }, [stats]);

  const set = (platform, field, val) =>
    setLocal(prev => ({ ...prev, [platform]: { ...prev[platform], [field]: val } }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(local);
    setSaving(false);
    setEditing(false);
  };

  const hasAny = PLATFORMS.some(p => local[p.key]?.handle || local[p.key]?.followers || local[p.key]?.subscribers);

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <div>
          <h2 className="text-white font-medium text-sm">Social reach</h2>
          <p className="text-gray-500 text-xs mt-0.5">Add your handles and stats — brands see these when reviewing your profile</p>
        </div>
        <button
          onClick={() => setEditing(e => !e)}
          className="flex items-center gap-1.5 text-xs border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Edit3 className="w-3 h-3" /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Self-reported notice */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 text-xs leading-relaxed">
              Stats are self-reported and shown with a "Self-reported" label to brands.
              To get a <span className="font-semibold">Verified</span> badge, email a screenshot of your analytics dashboard to <span className="text-white">verify@linkfluence.in</span> — we review within 24 hours.
            </p>
          </div>
        </div>

        {/* Platform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORMS.map(({ key, label, icon: Icon, color, border, bg, urlFn, fields }) => {
            const data = local[key] || {};
            const hasData = data.handle || data.followers || data.subscribers;
            return (
              <div key={key} className={`border rounded-xl p-4 ${hasData ? border + ' ' + bg : 'border-gray-800'}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {Icon
                      ? <Icon className={`w-4 h-4 ${color}`} />
                      : <span className={`text-xs font-bold ${color}`}>TT</span>}
                    <span className="text-gray-300 text-sm font-medium">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.verified && (
                      <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Verified</span>
                    )}
                    {!data.verified && hasData && (
                      <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">Self-reported</span>
                    )}
                    {data.handle && !editing && (
                      <a href={urlFn(data.handle)} target="_blank" rel="noopener noreferrer"
                        className={`${color} hover:opacity-80 transition-opacity`}>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {editing ? (
                  <div className="space-y-2">
                    {fields.map(f => (
                      <div key={f.key}>
                        <label className="text-gray-600 text-xs mb-1 block">{f.label}</label>
                        <input
                          type={f.type}
                          step={f.type === 'number' ? 'any' : undefined}
                          value={data[f.key] || ''}
                          onChange={e => set(key, f.key, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {data.handle && (
                      <p className={`text-sm font-medium ${color}`}>{data.handle}</p>
                    )}
                    {(data.followers || data.subscribers) ? (
                      <p className="text-white text-xl font-semibold">
                        {fmt(data.followers || data.subscribers)}
                        <span className="text-gray-500 text-xs font-normal ml-1">
                          {key === 'youtube' ? 'subscribers' : 'followers'}
                        </span>
                      </p>
                    ) : (
                      !data.handle && <p className="text-gray-700 text-sm italic">Not added yet</p>
                    )}
                    {data.engagementRate > 0 && (
                      <p className="text-gray-500 text-xs">{data.engagementRate}% engagement</p>
                    )}
                    {data.avgViews > 0 && (
                      <p className="text-gray-500 text-xs">{fmt(data.avgViews)} avg views/video</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {editing && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-gray-600 text-xs">Enter full numbers (e.g. 12500, not 12.5K)</p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Save stats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Content type section ──────────────────────────────────────────────────────
function ContentTypeSection({ value, onSave }) {
  const [saving, setSaving] = useState(false);

  const handleSelect = async (key) => {
    if (key === value) return;
    setSaving(true);
    await onSave(key);
    setSaving(false);
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-white font-medium text-sm">Content format</h2>
        <p className="text-gray-500 text-xs mt-0.5">Brands filter by this when looking for the right creator for their campaign</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CONTENT_TYPES.map(({ key, label, desc, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={saving}
            className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all disabled:opacity-50 ${
              value === key
                ? 'border-white bg-white/5'
                : 'border-gray-800 hover:border-gray-600'
            }`}
          >
            <Icon className={`w-4 h-4 ${value === key ? 'text-white' : 'text-gray-500'}`} />
            <div>
              <p className={`text-xs font-semibold ${value === key ? 'text-white' : 'text-gray-400'}`}>{label}</p>
              <p className="text-gray-600 text-xs mt-0.5 leading-tight">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Post metrics form ─────────────────────────────────────────────────────────
function PostMetricsForm({ campaign, onSaved }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ reach: '', impressions: '', likes: '', comments: '', saves: '', shares: '' });
  const [saving, setSaving] = useState(false);
  const existing = campaign.postMetrics?.[0];

  const handleSave = async () => {
    setSaving(true);
    try {
      await submitPostMetrics(campaign._id, form);
      toast.success('Metrics saved!');
      setOpen(false);
      onSaved?.();
    } catch { toast.error('Failed to save metrics'); }
    finally { setSaving(false); }
  };

  if (existing) return (
    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
      <p className="text-green-400 text-xs font-medium mb-2">Metrics submitted ✓</p>
      <div className="grid grid-cols-3 gap-3">
        {[['Reach', existing.reach], ['Likes', existing.likes], ['Comments', existing.comments],
          ['Saves', existing.saves], ['Shares', existing.shares], ['Impressions', existing.impressions]
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-white text-sm font-medium">{fmt(val) || '—'}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-900/50 transition-colors text-left">
        <p className="text-gray-400 text-xs">Add post performance metrics</p>
        {open ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4 border-t border-gray-800 space-y-3">
              <p className="text-gray-500 text-xs">Enter numbers from your post analytics. Brands see these when evaluating you.</p>
              <div className="grid grid-cols-2 gap-3">
                {[['reach','Reach'],['impressions','Impressions'],['likes','Likes'],
                  ['comments','Comments'],['saves','Saves'],['shares','Shares']].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-gray-600 text-xs mb-1 block">{label}</label>
                    <input type="number" value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="0"
                      className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-600" />
                  </div>
                ))}
              </div>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit metrics
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── AI Insight ────────────────────────────────────────────────────────────────
function AIInsight({ campaigns, profile }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const totalFollowers = Object.values(profile?.socialStats || {})
    .reduce((s, p) => s + (p.followers || p.subscribers || 0), 0);

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAnalyticsInsight({
        followers:           totalFollowers || profile?.followers || 0,
        engagementRate:      profile?.engagementRate || 0,
        campaignsCompleted:  campaigns.filter(c => c.status === 'completed').length,
        totalEarnings:       profile?.totalEarnings || 0,
        topNiche:            profile?.niche?.[0] || 'General',
        contentType:         profile?.contentType || 'mixed',
      });
      setInsight(result);
    } catch { setError('Could not load insight. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-white font-medium text-sm">AI performance insight</h3>
        </div>
        {!insight && (
          <button onClick={generate} disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {loading ? 'Analysing...' : 'Analyse my stats'}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {insight ? (
        <div className="space-y-3">
          {insight.summary && <p className="text-gray-300 text-sm leading-relaxed">{insight.summary}</p>}
          {insight.tip && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
              <p className="text-purple-300 text-xs font-medium mb-1">💡 Tip</p>
              <p className="text-gray-300 text-xs leading-relaxed">{insight.tip}</p>
            </div>
          )}
          <button onClick={() => setInsight(null)} className="text-gray-600 text-xs hover:text-gray-400 transition-colors">Refresh</button>
        </div>
      ) : (
        <p className="text-gray-600 text-xs">Get a personalised analysis based on your campaign history, reach, and content style.</p>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Analytics() {
  const { user } = useAuthStore();
  const [campaigns, setCampaigns] = useState([]);
  const [profile,   setProfile]   = useState(null);
  const [loading,   setLoading]   = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [camps, prof] = await Promise.all([getAcceptedCampaigns(), getMyProfile()]);
      setCampaigns(camps);
      setProfile(prof);
    } catch { toast.error('Failed to load analytics'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSaveSocialStats = async (socialStats) => {
    try {
      const updated = await updateMyProfile({ socialStats });
      setProfile(updated);
      toast.success('Social stats saved');
    } catch { toast.error('Failed to save'); }
  };

  const handleSaveContentType = async (contentType) => {
    try {
      const updated = await updateMyProfile({ contentType });
      setProfile(updated);
      toast.success('Content format saved');
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
    </div>
  );

  const completed  = campaigns.filter(c => c.status === 'completed');
  const active     = campaigns.filter(c => c.status === 'active');

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 text-xs mt-1">Your platform activity, social reach, and campaign performance</p>
      </div>

      {/* Profile trust card — FIXED: uses Avatar component */}
      <div className="flex items-center justify-between gap-4 bg-gray-950 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar} name={user?.name} size="lg" />
          <div>
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-gray-500 text-xs">{user?.userName}</p>
          </div>
        </div>
        <TrustBadge
          score={0}
          completionScore={profile?.completionScore || 0}
          completedCampaigns={completed.length}
          size="lg"
        />
      </div>

      {/* Completion bar */}
      {(profile?.completionScore || 0) < 100 && (
        <CompletionBar
          completionScore={profile?.completionScore || 0}
          steps={profile?.completionSteps || []}
          userType="influencer"
        />
      )}

      {/* Platform activity — 4 real stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-tour="dashboard-stats">
        {[
          { label: 'Campaigns accepted', value: campaigns.length, icon: Target,       color: 'text-blue-400'   },
          { label: 'Completed',          value: completed.length,  icon: CheckCircle,  color: 'text-green-400'  },
          { label: 'Active now',         value: active.length,     icon: TrendingUp,   color: 'text-amber-400'  },
          { label: 'Profile views',      value: profile?.profileViews || 0, icon: Eye, color: 'text-purple-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <s.icon className={`w-4 h-4 ${s.color} mb-3`} />
            <p className="text-2xl font-semibold text-white">{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Content format */}
      <ContentTypeSection value={profile?.contentType || ''} onSave={handleSaveContentType} />

      {/* Social reach — handles + stats merged */}
      <SocialReachSection stats={profile?.socialStats || {}} onSave={handleSaveSocialStats} />

      {/* Campaign performance */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-white font-medium text-sm">Campaign performance</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Submit post metrics after each campaign — builds your verified track record
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No campaigns yet</p>
            <p className="text-gray-600 text-xs mt-1">Accept campaigns to start building your performance history</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {campaigns.map((campaign, i) => (
              <motion.div key={campaign._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-white font-medium text-sm">{campaign.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        campaign.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        campaign.status === 'active'    ? 'bg-blue-500/10 text-blue-400'   :
                        'bg-gray-500/10 text-gray-400'
                      }`}>{campaign.status}</span>
                    </div>
                    <p className="text-gray-500 text-xs">by {campaign.brandName} · {campaign.platform} · ${campaign.budget?.toLocaleString()}</p>
                  </div>
                </div>
                <PostMetricsForm campaign={campaign} onSaved={fetchAll} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insight */}
      <AIInsight campaigns={campaigns} profile={profile} />

    </div>
  );
}