import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, CheckCircle, Users, TrendingUp, Sparkles, Loader2,
  Instagram, Youtube, Twitter, Edit3, AlertCircle, ChevronDown,
  ChevronUp, Send, Shield, Eye, Star
} from 'lucide-react';
import { getAcceptedCampaigns, getMyProfile, updateMyProfile, getAnalyticsInsight } from '../../services/apiService';
import { submitPostMetrics } from '../../services/apiService';
import useAuthStore from '../../store/authStore';
import TrustBadge, { CompletionBar, getTrustState } from '../shared/TrustBadge';
import toast from 'react-hot-toast';

// ── Platform social stats section ─────────────────────────────────────────────
const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400' },
  { key: 'youtube',   label: 'YouTube',   icon: Youtube,   color: 'text-red-400' },
  { key: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'text-blue-400' },
];

function fmt(n) {
  if (!n) return '—';
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n/1000).toFixed(1)}K`;
  return String(n);
}

function SocialStatsSection({ stats, onSave }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(stats || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(local);
    setSaving(false);
    setEditing(false);
    toast.success('Social stats saved');
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <div>
          <h2 className="text-white font-medium text-sm">Social platforms</h2>
          <p className="text-gray-500 text-xs mt-0.5">Self-reported — brands see these when reviewing your profile</p>
        </div>
        <button onClick={() => setEditing(e => !e)}
          className="flex items-center gap-1.5 text-xs border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
          <Edit3 className="w-3 h-3" /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="p-5">
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-5 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-300 text-xs leading-relaxed">
            These are self-reported. A "Self-reported" label is shown to brands. To get a "Verified" badge, upload a screenshot of your analytics dashboard — our team reviews it within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLATFORMS.map(({ key, label, icon: Icon, color }) => {
            const p = local[key] || {};
            return (
              <div key={key} className="bg-black border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-gray-400 text-xs">{label}</span>
                  </div>
                  {p.verified
                    ? <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Verified</span>
                    : p.followers > 0
                    ? <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">Self-reported</span>
                    : null}
                </div>

                {editing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Followers</label>
                      <input type="number" value={p.followers || ''}
                        onChange={e => setLocal(prev => ({ ...prev, [key]: { ...prev[key], followers: Number(e.target.value) } }))}
                        placeholder="e.g. 12500"
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-600" />
                    </div>
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Engagement rate %</label>
                      <input type="number" step="0.1" value={p.engagementRate || ''}
                        onChange={e => setLocal(prev => ({ ...prev, [key]: { ...prev[key], engagementRate: parseFloat(e.target.value) } }))}
                        placeholder="e.g. 4.2"
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-600" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className={`text-2xl font-semibold ${p.followers ? 'text-white' : 'text-gray-700'}`}>
                      {fmt(p.followers)}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">followers</p>
                    {p.engagementRate > 0 && (
                      <p className="text-gray-400 text-xs mt-2">{p.engagementRate}% engagement</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {editing && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-gray-600 text-xs">Enter full numbers (e.g. 12500, not 12.5K)</p>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Save stats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Post metrics form for a single campaign ───────────────────────────────────
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
        {[
          ['Reach', existing.reach], ['Likes', existing.likes],
          ['Comments', existing.comments], ['Saves', existing.saves],
          ['Shares', existing.shares], ['Impressions', existing.impressions],
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
              <p className="text-gray-500 text-xs leading-relaxed">
                These metrics build your verified track record and are shown to brands. Enter numbers from your post analytics.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[['reach','Reach'],['impressions','Impressions'],['likes','Likes'],['comments','Comments'],['saves','Saves'],['shares','Shares']].map(([key, label]) => (
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

// ── AI Insight panel ──────────────────────────────────────────────────────────
function AIInsight({ campaigns, profile }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAnalyticsInsight({
        followers: profile?.followers || Object.values(profile?.socialStats || {}).reduce((s, p) => s + (p.followers || 0), 0),
        engagementRate: profile?.engagementRate || 0,
        campaignsCompleted: campaigns.filter(c => c.status === 'completed').length,
        totalEarnings: profile?.totalEarnings || 0,
        topNiche: profile?.niche?.[0] || 'General',
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
        <p className="text-gray-600 text-xs">Get a personalised analysis of your creator performance based on your campaign history and social stats.</p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Analytics() {
  const { user } = useAuthStore();
  const [campaigns, setCampaigns] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [camps, prof] = await Promise.all([getAcceptedCampaigns(), getMyProfile()]);
      setCampaigns(camps);
      setProfile(prof);
    } catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSaveSocialStats = async (socialStats) => {
    try {
      const updated = await updateMyProfile({ socialStats });
      setProfile(updated);
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
    </div>
  );

  const completed = campaigns.filter(c => c.status === 'completed');
  const active = campaigns.filter(c => c.status === 'active');
  const totalFollowers = Object.values(profile?.socialStats || {}).reduce((s, p) => s + (p.followers || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 text-xs mt-1">Your platform activity, social reach, and campaign performance</p>
      </div>

      {/* Profile trust state */}
      <div className="flex items-start justify-between gap-4 bg-gray-950 border border-gray-800 rounded-xl p-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 border-2 border-gray-700 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.userName}</p>
            </div>
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

      {/* Platform activity stats — all real from DB */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Campaigns accepted', value: campaigns.length, icon: Target, color: 'text-blue-400' },
          { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Active now', value: active.length, icon: TrendingUp, color: 'text-amber-400' },
          { label: 'Profile views', value: profile?.profileViews || 0, icon: Eye, color: 'text-purple-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <s.icon className={`w-4 h-4 ${s.color} mb-3`} />
            <p className="text-2xl font-semibold text-white">{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Social platform stats */}
      <SocialStatsSection stats={profile?.socialStats || {}} onSave={handleSaveSocialStats} />

      {/* Campaign performance history */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-white font-medium text-sm">Campaign performance</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Add post metrics after each campaign — brands see these when evaluating you
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
                        campaign.status === 'completed' ? 'bg-green-500/10 text-green-400'
                        : campaign.status === 'active' ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-gray-500/10 text-gray-400'
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