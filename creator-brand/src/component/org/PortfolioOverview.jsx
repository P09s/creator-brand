import React, { memo, useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import {
  Edit3, Globe, Shield, CheckCircle, Megaphone, Tag, Plus, Building2, Loader2
} from 'lucide-react';
import { getMyProfile, updateMyProfile } from '../../services/apiService';
import { CompletionBar } from '../shared/TrustBadge';
import toast from 'react-hot-toast';

const INDUSTRIES = ['Fashion & Apparel','Technology','Food & Beverage','Health & Fitness','Beauty & Skincare','Gaming','Finance','Travel','Education','Home & Lifestyle','Sports','Entertainment'];
const CAMPAIGN_TYPES = ['Product Launch','Brand Awareness','User Generated Content','Event Promotion','Seasonal Campaign','Long-term Partnership'];

const OrgPortfolioOverview = memo(({ setIsProfileModalOpen }) => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [website, setWebsite] = useState('');
  const [editingWebsite, setEditingWebsite] = useState(false);
  const [industry, setIndustry] = useState('');
  const [editingIndustry, setEditingIndustry] = useState(false);
  const [campaignTypes, setCampaignTypes] = useState([]);

  useEffect(() => {
    getMyProfile().then(p => {
      setProfile(p);
      setBio(p.bio || '');
      setWebsite(p.website || '');
      setIndustry(p.industry || '');
      setCampaignTypes(p.campaignTypes || []);
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

  const handleSaveBio = async () => { await save({ bio }); setEditingBio(false); toast.success('Description saved'); };
  const handleSaveWebsite = async () => { await save({ website }); setEditingWebsite(false); toast.success('Website saved'); };
  const handleSaveIndustry = async (ind) => { setIndustry(ind); setEditingIndustry(false); await save({ industry: ind }); toast.success('Industry saved'); };
  const handleToggleCampaignType = async (t) => {
    const updated = campaignTypes.includes(t) ? campaignTypes.filter(x => x !== t) : [...campaignTypes, t];
    setCampaignTypes(updated);
    await save({ campaignTypes: updated });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <CompletionBar
        completionScore={profile?.completionScore || 0}
        steps={profile?.completionSteps || []}
        userType="brand"
      />

      {/* Brand card */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-gray-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold">{user?.name}</h3>
              {profile?.completionScore >= 100 && <CheckCircle className="w-4 h-4 text-green-400" />}
            </div>
            <p className="text-gray-400 text-xs mb-3">{user?.email}</p>

            {editingBio ? (
              <div>
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="What does your brand do? Who are your customers? What kind of collaborations are you looking for?" rows={3} maxLength={300} autoFocus
                  className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 resize-none" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600 text-xs">{bio.length}/300</span>
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
                  : <span className="text-gray-600 italic">Add a brand description — creators decide whether to apply based on this</span>}
              </button>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-2 rounded-xl">
              <Shield className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-gray-500 text-xs">Brand trust</p>
                <p className="text-gray-700 text-xs">Post campaigns first</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-800">
          {editingWebsite ? (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourbrand.com" autoFocus
                className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-gray-500" />
              <button onClick={handleSaveWebsite} disabled={saving}
                className="bg-white text-black text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 flex items-center gap-1">
                {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditingWebsite(true)} className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              <Globe className="w-4 h-4" />
              {website ? <span className="text-blue-400 underline">{website}</span> : <span className="italic">Add your website</span>}
            </button>
          )}
        </div>
      </div>

      {/* Industry */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-medium text-sm">Industry</h3>
            <p className="text-gray-500 text-xs mt-1">Helps creators in your niche find your campaigns</p>
          </div>
          {industry && <button onClick={() => handleSaveIndustry('')} className="text-gray-600 text-xs hover:text-gray-400">Clear</button>}
        </div>
        {editingIndustry ? (
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map(ind => (
              <button key={ind} onClick={() => handleSaveIndustry(ind)}
                className="px-3 py-1.5 rounded-full text-xs border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white transition-colors">
                {ind}
              </button>
            ))}
          </div>
        ) : (
          <button onClick={() => setEditingIndustry(true)}
            className={`flex items-center gap-2 text-sm transition-colors ${industry ? 'text-white bg-gray-800 px-4 py-2 rounded-full' : 'text-gray-600 italic'}`}>
            <Tag className="w-3.5 h-3.5" />
            {industry || 'Select your industry'}
          </button>
        )}
      </div>

      {/* Campaign types */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-medium text-sm mb-1">Campaign types</h3>
        <p className="text-gray-500 text-xs mb-4">Helps creators understand what kind of work you typically do</p>
        <div className="flex flex-wrap gap-2">
          {CAMPAIGN_TYPES.map(t => (
            <button key={t} onClick={() => handleToggleCampaignType(t)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                campaignTypes.includes(t) ? 'bg-white text-black border-white' : 'border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign history */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-medium text-sm">Campaign history</h3>
        </div>
        <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
          <Building2 className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-1">No completed campaigns yet</p>
          <p className="text-gray-600 text-xs">Completed campaigns will appear here with metrics and creator reviews</p>
        </div>
      </div>
    </div>
  );
});

export default OrgPortfolioOverview;