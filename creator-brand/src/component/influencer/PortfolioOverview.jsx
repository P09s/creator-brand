import React, { memo, useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import AvatarUpload from '../shared/AvatarUpload';
import {
  Edit3, Briefcase, Instagram, Youtube, Twitter, Globe,
  CheckCircle, Plus, Link2, X, Loader2, Shield
} from 'lucide-react';
import { getMyProfile, updateMyProfile, addPortfolioItem, deletePortfolioItem } from '../../services/apiService';
import { CompletionBar } from '../shared/TrustBadge';
import toast from 'react-hot-toast';

const NICHES = ['Fashion','Technology','Lifestyle','Fitness','Travel','Food','Beauty','Gaming','Finance','Education','Health','Music'];
const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400' },
  { key: 'youtube',   label: 'YouTube',   icon: Youtube,   color: 'text-red-400'  },
  { key: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'text-blue-400' },
];

function fmt(n) {
  if (!n) return null;
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n/1000).toFixed(1)}K`;
  return String(n);
}

const PortfolioOverview = memo(({ setIsProfileModalOpen }) => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable local state
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [niches, setNiches] = useState([]);
  const [followers, setFollowers] = useState({ instagram: '', youtube: '', twitter: '' });
  const [editingFollowers, setEditingFollowers] = useState(false);
  const [socialLinks, setSocialLinks] = useState({ instagram: '', youtube: '', twitter: '', tiktok: '', website: '' });
  const [editingSocialLinks, setEditingSocialLinks] = useState(false);
  const [showAddWork, setShowAddWork] = useState(false);
  const [workForm, setWorkForm] = useState({ brandName: '', campaignTitle: '', platform: 'Instagram', results: '', link: '' });
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    getMyProfile().then(p => {
      setProfile(p);
      setBio(p.bio || '');
      setNiches(p.niche || []);
      // Populate followers from socialStats
      const ss = p.socialStats || {};
      setFollowers({
        instagram: ss.instagram?.followers || '',
        youtube:   ss.youtube?.subscribers || ss.youtube?.followers || '',
        twitter:   ss.twitter?.followers || '',
      });
      const sl = p.socialLinks || {};
      setSocialLinks({
        instagram: sl.instagram || '',
        youtube:   sl.youtube   || '',
        twitter:   sl.twitter   || '',
        tiktok:    sl.tiktok    || '',
        website:   sl.website   || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async (data) => {
    setSaving(true);
    try {
      const updated = await updateMyProfile(data);
      setProfile(updated);
      return updated;
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleSaveBio = async () => {
    await save({ bio });
    setEditingBio(false);
    toast.success('Bio saved');
  };

  const handleSaveSocialLinks = async () => {
    await save({ socialLinks });
    setEditingSocialLinks(false);
    toast.success('Social links saved');
  };

  const handleSaveFollowers = async () => {
    await save({
      socialStats: {
        instagram: { followers: Number(followers.instagram) || 0 },
        youtube:   { subscribers: Number(followers.youtube) || 0 },  // YouTube uses subscribers
        twitter:   { followers: Number(followers.twitter) || 0 },
      },
      followers: Math.max(
        Number(followers.instagram) || 0,
        Number(followers.youtube) || 0,
        Number(followers.twitter) || 0
      ),
    });
    setEditingFollowers(false);
    toast.success('Platform stats saved');
  };

  const handleToggleNiche = async (n) => {
    const updated = niches.includes(n)
      ? niches.filter(x => x !== n)
      : niches.length < 5 ? [...niches, n] : niches;
    setNiches(updated);
    await save({ niche: updated });
  };

  const handleAddWork = async () => {
    if (!workForm.brandName.trim() || !workForm.campaignTitle.trim()) return;
    setSaving(true);
    try {
      const updated = await addPortfolioItem(workForm);
      setProfile(updated);
      setWorkForm({ brandName: '', campaignTitle: '', platform: 'Instagram', results: '', link: '' });
      setShowAddWork(false);
      toast.success('Added to portfolio!');
    } catch { toast.error('Failed to add'); }
    finally { setSaving(false); }
  };

  const handleDeleteWork = async (itemId) => {
    setDeletingItem(itemId);
    try {
      const updated = await deletePortfolioItem(itemId);
      setProfile(updated);
      toast.success('Removed');
    } catch { toast.error('Failed to remove'); }
    finally { setDeletingItem(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
    </div>
  );

  const portfolio = profile?.portfolio || [];

  return (
    <div className="space-y-5">
      {/* Completion bar */}
      <CompletionBar
        completionScore={profile?.completionScore || 0}
        steps={profile?.completionSteps || []}
        userType="influencer"
      />

      {/* Identity card */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AvatarUpload size="xl" shape="circle" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-white font-semibold">{user?.name}</h3>
              {profile?.completionScore >= 100 && <CheckCircle className="w-4 h-4 text-green-400" />}
            </div>
            <p className="text-gray-500 text-xs mb-3">{user?.userName} · {user?.email}</p>

            {editingBio ? (
              <div>
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell brands what you create..." rows={3} maxLength={200} autoFocus
                  className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 resize-none" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600 text-xs">{bio.length}/200</span>
                  <button onClick={handleSaveBio} disabled={saving}
                    className="bg-white hover:bg-gray-100 disabled:opacity-50 text-black text-xs px-4 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5">
                    {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingBio(true)} className="flex items-start gap-1.5 text-sm text-left group w-full">
                <Edit3 className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 mt-0.5 flex-shrink-0 transition-colors" />
                {bio
                  ? <span className="text-gray-300 leading-relaxed">{bio}</span>
                  : <span className="text-gray-600 italic">Add your bio — brands read this before reaching out</span>}
              </button>
            )}
          </div>

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

      {/* Platform followers */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-sm">Your platforms</h3>
          <button onClick={() => setEditingFollowers(f => !f)}
            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors border border-gray-800 hover:border-gray-600 px-2.5 py-1 rounded-lg">
            <Edit3 className="w-3 h-3" /> {editingFollowers ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PLATFORMS.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="bg-black border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-gray-400 text-xs">{label}</span>
              </div>
              {editingFollowers ? (
                <input type="number" value={followers[key]} onChange={e => setFollowers(p => ({ ...p, [key]: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-gray-500" />
              ) : (
                <>
                  <p className={`text-xl font-semibold ${followers[key] ? 'text-white' : 'text-gray-700'}`}>{fmt(Number(followers[key])) || '—'}</p>
                  <p className="text-gray-600 text-xs mt-1">followers</p>
                </>
              )}
            </div>
          ))}
        </div>
        {editingFollowers && (
          <div className="flex justify-end mt-3">
            <button onClick={handleSaveFollowers} disabled={saving}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Save
            </button>
          </div>
        )}
      </div>

      {/* Niche */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium text-sm">Your niche</h3>
          <span className="text-gray-600 text-xs">{niches.length}/5</span>
        </div>
        <p className="text-gray-500 text-xs mb-4">Brands search by niche — this determines which campaigns are recommended to you</p>
        <div className="flex flex-wrap gap-2">
          {NICHES.map(n => (
            <button key={n} onClick={() => handleToggleNiche(n)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                niches.includes(n) ? 'bg-white text-black border-white' : 'border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-medium text-sm">Social profiles</h3>
            <p className="text-gray-500 text-xs mt-0.5">Brands tap these to check your content before accepting</p>
          </div>
          <button onClick={() => setEditingSocialLinks(f => !f)}
            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors border border-gray-800 hover:border-gray-600 px-2.5 py-1 rounded-lg">
            <Edit3 className="w-3 h-3" /> {editingSocialLinks ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editingSocialLinks ? (
          <div className="space-y-3">
            {[
              { key: 'instagram', label: 'Instagram username', placeholder: '@yourhandle', icon: Instagram, color: 'text-pink-400' },
              { key: 'youtube',   label: 'YouTube channel',    placeholder: '@yourchannel',  icon: Youtube,   color: 'text-red-400'  },
              { key: 'twitter',   label: 'Twitter / X handle', placeholder: '@yourhandle',  icon: Twitter,   color: 'text-blue-400' },
              { key: 'tiktok',    label: 'TikTok username',    placeholder: '@yourhandle',  icon: null,      color: 'text-gray-400' },
              { key: 'website',   label: 'Portfolio website',  placeholder: 'https://...',  icon: Globe,     color: 'text-green-400'},
            ].map(({ key, label, placeholder, icon: Icon, color }) => (
              <div key={key} className="flex items-center gap-3">
                {Icon ? <Icon className={`w-4 h-4 ${color} flex-shrink-0`} /> : <span className="w-4 text-center text-xs text-gray-500 flex-shrink-0">TT</span>}
                <input
                  value={socialLinks[key]}
                  onChange={e => setSocialLinks(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="flex-1 bg-black border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>
            ))}
            <button onClick={handleSaveSocialLinks}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              Save links
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {Object.entries(socialLinks).filter(([,v]) => v).length === 0 ? (
              <p className="text-gray-600 text-xs italic">No social profiles added yet — brands can't find you externally</p>
            ) : (
              Object.entries(socialLinks).filter(([,v]) => v).map(([key, val]) => {
                const href = key === 'website' ? val
                  : key === 'instagram' ? `https://instagram.com/${val.replace('@','')}`
                  : key === 'youtube'   ? `https://youtube.com/@${val.replace('@','')}`
                  : key === 'tiktok'    ? `https://tiktok.com/@${val.replace('@','')}`
                  : `https://twitter.com/${val.replace('@','')}`;

                const iconProps = { className: 'w-3.5 h-3.5 flex-shrink-0' };
                const Icon = key === 'instagram' ? <Instagram {...iconProps} className="w-3.5 h-3.5 text-pink-400" />
                           : key === 'youtube'   ? <Youtube   {...iconProps} className="w-3.5 h-3.5 text-red-400" />
                           : key === 'twitter'   ? <Twitter   {...iconProps} className="w-3.5 h-3.5 text-blue-400" />
                           : key === 'tiktok'    ? <span className="text-xs font-bold text-gray-300 leading-none">TT</span>
                           : <Globe className="w-3.5 h-3.5 text-green-400" />;

                const label = key === 'website' ? 'Portfolio' : key.charAt(0).toUpperCase() + key.slice(1);

                return (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs bg-gray-900 border border-gray-800 hover:border-gray-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                    {Icon}
                    {label}
                  </a>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Past collaborations */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-medium text-sm">Past collaborations</h3>
          </div>
          <button onClick={() => setShowAddWork(true)}
            className="flex items-center gap-1.5 text-xs border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
            <Plus className="w-3 h-3" /> Add work
          </button>
        </div>

        {showAddWork && (
          <div className="bg-black border border-gray-700 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white text-sm font-medium">Add a collaboration</p>
              <button onClick={() => setShowAddWork(false)} className="text-gray-600 hover:text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Brand name *</label>
                  <input value={workForm.brandName} onChange={e => setWorkForm(p => ({ ...p, brandName: e.target.value }))} placeholder="e.g. Nike"
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Platform</label>
                  <select value={workForm.platform} onChange={e => setWorkForm(p => ({ ...p, platform: e.target.value }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-600">
                    {['Instagram','YouTube','TikTok','Twitter','Multiple'].map(pl => <option key={pl}>{pl}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Campaign title *</label>
                <input value={workForm.campaignTitle} onChange={e => setWorkForm(p => ({ ...p, campaignTitle: e.target.value }))} placeholder="e.g. Summer collection"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Results (optional)</label>
                <input value={workForm.results} onChange={e => setWorkForm(p => ({ ...p, results: e.target.value }))} placeholder="e.g. 2.3M impressions"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Content link (optional)</label>
                <input value={workForm.link} onChange={e => setWorkForm(p => ({ ...p, link: e.target.value }))} placeholder="https://instagram.com/p/..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
              </div>
              <button onClick={handleAddWork} disabled={!workForm.brandName.trim() || !workForm.campaignTitle.trim() || saving}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 disabled:opacity-40 text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Add to portfolio
              </button>
            </div>
          </div>
        )}

        {portfolio.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
            <Briefcase className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-1">No past work added yet</p>
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs mx-auto">Adding past collaborations builds trust with brands and increases your chances of getting accepted</p>
            <button onClick={() => setShowAddWork(true)} className="mt-4 text-xs bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
              + Add your first collaboration
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {portfolio.map(item => (
              <div key={item._id} className="bg-black border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white text-sm font-medium">{item.brandName}</span>
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{item.platform}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-1">{item.campaignTitle}</p>
                    {item.results && <p className="text-gray-500 text-xs">{item.results}</p>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1.5 transition-colors">
                        <Link2 className="w-3 h-3" /> View content
                      </a>
                    )}
                  </div>
                  <button onClick={() => handleDeleteWork(item._id)} disabled={deletingItem === item._id}
                    className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0">
                    {deletingItem === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
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