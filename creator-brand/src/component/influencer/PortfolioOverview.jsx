import React, { memo, useState } from 'react';
import useAuthStore from '../../store/authStore';
import {
  Edit3, Camera, Briefcase, Instagram, Youtube, Twitter,
  Shield, AlertCircle, CheckCircle, Plus, Link2, X
} from 'lucide-react';

const NICHES = [
  'Fashion', 'Technology', 'Lifestyle', 'Fitness', 'Travel',
  'Food', 'Beauty', 'Gaming', 'Finance', 'Education', 'Health', 'Music'
];

const PLATFORMS = [
  { key: 'Instagram', icon: Instagram, color: 'text-pink-400', placeholder: '12500' },
  { key: 'YouTube',   icon: Youtube,   color: 'text-red-400',  placeholder: '8900' },
  { key: 'Twitter',   icon: Twitter,   color: 'text-blue-400', placeholder: '5000' },
];

function formatFollowers(n) {
  const num = Number(n);
  if (!num || isNaN(num)) return null;
  return num >= 1000000 ? `${(num / 1000000).toFixed(1)}M`
    : num >= 1000 ? `${(num / 1000).toFixed(1)}K`
    : String(num);
}

const PortfolioOverview = memo(({ setIsProfileModalOpen }) => {
  const { user } = useAuthStore();

  // Editable state — in production these save to /api/profiles/me
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [niches, setNiches] = useState([]);
  const [followers, setFollowers] = useState({ Instagram: '', YouTube: '', Twitter: '' });
  const [editingFollowers, setEditingFollowers] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [showAddWork, setShowAddWork] = useState(false);
  const [workForm, setWorkForm] = useState({ brand: '', campaign: '', platform: 'Instagram', results: '', link: '' });

  const toggleNiche = (n) => setNiches(prev =>
    prev.includes(n) ? prev.filter(x => x !== n) : prev.length < 5 ? [...prev, n] : prev
  );

  const handleAddWork = () => {
    if (!workForm.brand.trim() || !workForm.campaign.trim()) return;
    setPortfolioItems(prev => [{ ...workForm, id: Date.now() }, ...prev]);
    setWorkForm({ brand: '', campaign: '', platform: 'Instagram', results: '', link: '' });
    setShowAddWork(false);
  };

  // Completion steps
  const steps = [
    { label: 'Add a bio', done: bio.trim().length > 10 },
    { label: 'Select your niche (up to 5)', done: niches.length > 0 },
    { label: 'Add follower counts', done: Object.values(followers).some(v => v) },
    { label: 'Add past collaboration', done: portfolioItems.length > 0 },
  ];
  const pct = Math.round((steps.filter(s => s.done).length / steps.length) * 100);
  const complete = pct === 100;

  return (
    <div className="space-y-5">

      {/* ── Completion banner ─────────────────────────────────────────── */}
      {!complete && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-amber-400 text-sm font-medium">
              Complete your profile to get discovered by brands
            </p>
            <span className="text-amber-400 text-xs font-semibold">{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {steps.filter(s => !s.done).map(s => (
              <span key={s.label}
                className="flex items-center gap-1 text-xs text-gray-400 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-lg">
                <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Identity card ────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-4">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 border-2 border-gray-700 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white p-1 rounded-full transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>

          {/* Name + bio */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-white font-semibold">{user?.name}</h3>
              {complete && <CheckCircle className="w-4 h-4 text-green-400" />}
            </div>
            <p className="text-gray-500 text-xs mb-3">{user?.userName} · {user?.email}</p>

            {/* Bio inline edit */}
            {editingBio ? (
              <div>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell brands what you create — your niche, style, and what makes your content unique..."
                  rows={3}
                  maxLength={200}
                  autoFocus
                  className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600 text-xs">{bio.length}/200</span>
                  <button
                    onClick={() => setEditingBio(false)}
                    className="bg-white hover:bg-gray-100 text-black text-xs px-4 py-1.5 rounded-lg font-semibold transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingBio(true)}
                className="flex items-start gap-1.5 text-sm text-left group w-full"
              >
                <Edit3 className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 mt-0.5 flex-shrink-0 transition-colors" />
                {bio
                  ? <span className="text-gray-300 leading-relaxed">{bio}</span>
                  : <span className="text-gray-600 italic">Add your bio — brands read this before reaching out</span>
                }
              </button>
            )}
          </div>

          {/* Trust score placeholder */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-2 rounded-xl">
              <Shield className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-gray-500 text-xs leading-none">Trust score</p>
                <p className="text-gray-700 text-xs mt-0.5">Builds with campaigns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Platforms + followers ─────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-sm">Your platforms</h3>
          <button
            onClick={() => setEditingFollowers(f => !f)}
            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors border border-gray-800 hover:border-gray-600 px-2.5 py-1 rounded-lg"
          >
            <Edit3 className="w-3 h-3" />
            {editingFollowers ? 'Done' : 'Edit'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PLATFORMS.map(({ key, icon: Icon, color, placeholder }) => (
            <div key={key} className="bg-black border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-gray-400 text-xs">{key}</span>
              </div>
              {editingFollowers ? (
                <input
                  type="number"
                  value={followers[key]}
                  onChange={e => setFollowers(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-gray-500"
                />
              ) : (
                <p className={`text-xl font-semibold ${followers[key] ? 'text-white' : 'text-gray-700'}`}>
                  {formatFollowers(followers[key]) || '—'}
                </p>
              )}
              <p className="text-gray-600 text-xs mt-1">followers</p>
            </div>
          ))}
        </div>
        {editingFollowers && (
          <p className="text-gray-600 text-xs mt-3">
            These help brands understand your reach. Enter full numbers (e.g. 12500 not 12.5K).
          </p>
        )}
      </div>

      {/* ── Niche ────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium text-sm">Your niche</h3>
          <span className="text-gray-600 text-xs">{niches.length}/5 selected</span>
        </div>
        <p className="text-gray-500 text-xs mb-4 leading-relaxed">
          Brands search by niche. Choose what you genuinely create — this determines which campaigns are recommended to you.
        </p>
        <div className="flex flex-wrap gap-2">
          {NICHES.map(n => (
            <button
              key={n}
              onClick={() => toggleNiche(n)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                niches.includes(n)
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-gray-400 border-gray-800 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ── Past collaborations ───────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-medium text-sm">Past collaborations</h3>
          </div>
          <button
            onClick={() => setShowAddWork(true)}
            className="flex items-center gap-1.5 text-xs border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3 h-3" /> Add work
          </button>
        </div>

        {/* Add work form */}
        {showAddWork && (
          <div className="bg-black border border-gray-700 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white text-sm font-medium">Add a collaboration</p>
              <button onClick={() => setShowAddWork(false)} className="text-gray-600 hover:text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Brand name *</label>
                  <input
                    value={workForm.brand}
                    onChange={e => setWorkForm(p => ({ ...p, brand: e.target.value }))}
                    placeholder="e.g. Nike"
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Platform</label>
                  <select
                    value={workForm.platform}
                    onChange={e => setWorkForm(p => ({ ...p, platform: e.target.value }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-600"
                  >
                    {['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Multiple'].map(pl => (
                      <option key={pl}>{pl}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Campaign / project title *</label>
                <input
                  value={workForm.campaign}
                  onChange={e => setWorkForm(p => ({ ...p, campaign: e.target.value }))}
                  placeholder="e.g. Summer collection launch"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Results (optional)</label>
                <input
                  value={workForm.results}
                  onChange={e => setWorkForm(p => ({ ...p, results: e.target.value }))}
                  placeholder="e.g. 2.3M impressions, 4.8% engagement"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Content link (optional)</label>
                <input
                  value={workForm.link}
                  onChange={e => setWorkForm(p => ({ ...p, link: e.target.value }))}
                  placeholder="https://instagram.com/p/..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>
              <button
                onClick={handleAddWork}
                disabled={!workForm.brand.trim() || !workForm.campaign.trim()}
                className="bg-white hover:bg-gray-100 disabled:opacity-40 text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Add to portfolio
              </button>
            </div>
          </div>
        )}

        {/* Portfolio list */}
        {portfolioItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
            <Briefcase className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-1">No past work added yet</p>
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs mx-auto">
              Adding past collaborations builds trust with brands and increases your chances of getting accepted
            </p>
            <button
              onClick={() => setShowAddWork(true)}
              className="mt-4 text-xs bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Add your first collaboration
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {portfolioItems.map(item => (
              <div key={item.id} className="bg-black border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white text-sm font-medium">{item.brand}</span>
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{item.platform}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{item.campaign}</p>
                    {item.results && (
                      <p className="text-gray-500 text-xs">{item.results}</p>
                    )}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1.5 transition-colors">
                        <Link2 className="w-3 h-3" /> View content
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setPortfolioItems(prev => prev.filter(p => p.id !== item.id))}
                    className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
});

export default PortfolioOverview;