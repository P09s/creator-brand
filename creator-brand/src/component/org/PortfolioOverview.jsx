import React, { memo, useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import {
  Edit3, Globe, CheckCircle, Loader2,
  Linkedin, Instagram, ChevronDown,
  Building2, Megaphone
} from 'lucide-react';
import { getMyProfile, updateMyProfile, getMyCampaigns } from '../../services/apiService';
import { CompletionBar } from '../shared/TrustBadge';
import Avatar from '../shared/Avatar';
import AvatarUpload from '../shared/AvatarUpload';
import toast from 'react-hot-toast';

// ── Constants ─────────────────────────────────────────────────────────────────
const INDUSTRIES = [
  'Fashion & Apparel','Technology','Food & Beverage','Health & Fitness',
  'Beauty & Skincare','Gaming','Finance','Travel','Education',
  'Home & Lifestyle','Sports','Entertainment',
];

const CAMPAIGN_TYPES = [
  'Product Launch','Brand Awareness','User Generated Content',
  'Event Promotion','Seasonal Campaign','Long-term Partnership',
];

const BUDGET_RANGES = [
  { key: '1k-5k',   label: '₹1K – ₹5K',   desc: 'Nano creators' },
  { key: '5k-25k',  label: '₹5K – ₹25K',  desc: 'Micro creators' },
  { key: '25k-1l',  label: '₹25K – ₹1L',  desc: 'Mid-tier creators' },
  { key: '1l+',     label: '₹1L+',         desc: 'Macro / celebrity' },
];

const CREATOR_SIZES = [
  { key: 'nano',  label: 'Nano',  desc: '1K – 10K followers' },
  { key: 'micro', label: 'Micro', desc: '10K – 100K followers' },
  { key: 'macro', label: 'Macro', desc: '100K+ followers' },
  { key: 'any',   label: 'Any size', desc: 'Open to all' },
];

const COMPANY_SIZES = [
  { key: 'solo',       label: 'Solo founder' },
  { key: 'startup',    label: 'Startup (2–10)' },
  { key: 'smb',        label: 'SMB (11–100)' },
  { key: 'enterprise', label: 'Enterprise (100+)' },
];

// ── Inline editable field ─────────────────────────────────────────────────────
function EditableText({ value, placeholder, onSave, saving, multiline = false, maxLen = 300 }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value || '');

  useEffect(() => { setLocal(value || ''); }, [value]);

  const handleSave = async () => { await onSave(local); setEditing(false); };

  if (editing) return (
    <div className={multiline ? 'w-full' : 'flex items-center gap-2 w-full'}>
      {multiline ? (
        <>
          <textarea value={local} onChange={e => setLocal(e.target.value)} autoFocus rows={3}
            maxLength={maxLen} placeholder={placeholder}
            className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 resize-none" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-600 text-xs">{local.length}/{maxLen}</span>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="text-gray-600 text-xs hover:text-gray-400 px-2 py-1">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="bg-white text-black text-xs px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1 disabled:opacity-50">
                {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <input value={local} onChange={e => setLocal(e.target.value)} autoFocus
            placeholder={placeholder}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
            className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-500 min-w-0" />
          <button onClick={() => setEditing(false)} className="text-gray-600 text-xs hover:text-gray-400 flex-shrink-0">✕</button>
          <button onClick={handleSave} disabled={saving}
            className="bg-white text-black text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 disabled:opacity-50 flex-shrink-0">
            {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save
          </button>
        </>
      )}
    </div>
  );

  return (
    <button onClick={() => setEditing(true)} className="flex items-start gap-1.5 text-sm text-left group w-full">
      <Edit3 className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 mt-0.5 flex-shrink-0 transition-colors" />
      {value
        ? <span className="text-gray-300 leading-relaxed">{value}</span>
        : <span className="text-gray-600 italic">{placeholder}</span>}
    </button>
  );
}

// ── Pill selector ─────────────────────────────────────────────────────────────
function PillSelector({ label, desc, options, value, onSelect, saving }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.key === value);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-medium text-sm">{label}</h3>
          {desc && <p className="text-gray-500 text-xs mt-0.5">{desc}</p>}
        </div>
        {value && (
          <button onClick={() => onSelect('')} className="text-gray-600 text-xs hover:text-gray-400 transition-colors">Clear</button>
        )}
      </div>
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 text-sm transition-all px-4 py-2 rounded-xl border ${
          value ? 'text-white bg-gray-800 border-gray-700' : 'text-gray-600 italic border-gray-800 hover:border-gray-600'
        }`}>
        {selected ? selected.label : `Select ${label.toLowerCase()}`}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="flex flex-wrap gap-2 mt-3">
          {options.map(o => (
            <button key={o.key} onClick={() => { onSelect(o.key); setOpen(false); }}
              className={`flex flex-col items-start px-3 py-2 rounded-xl border text-left transition-all ${
                value === o.key ? 'border-white bg-white/5 text-white' : 'border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
              }`}>
              <span className="text-xs font-medium">{o.label}</span>
              {o.desc && <span className="text-gray-600 text-xs mt-0.5">{o.desc}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const OrgPortfolioOverview = memo(() => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaignTypes, setCampaignTypes] = useState([]);

  useEffect(() => {
    Promise.all([getMyProfile(), getMyCampaigns()])
      .then(([p, c]) => {
        setProfile(p);
        setCampaignTypes(p.campaignTypes || []);
        setCampaigns(c || []);
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const save = async (data) => {
    setSaving(true);
    try {
      const updated = await updateMyProfile(data);
      setProfile(updated);
      toast.success('Saved');
      return updated;
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleToggleCampaignType = async (t) => {
    const updated = campaignTypes.includes(t)
      ? campaignTypes.filter(x => x !== t)
      : [...campaignTypes, t];
    setCampaignTypes(updated);
    await save({ campaignTypes: updated });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
    </div>
  );

  const activeCampaigns    = campaigns.filter(c => c.status === 'active');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');
  const totalApplicants    = campaigns.reduce((s, c) => s + (c.applicants?.length || 0), 0);
  const totalAccepted      = campaigns.reduce((s, c) => s + (c.accepted?.length || 0), 0);

  return (
    <div className="space-y-5">

      {/* ── Identity card ─────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          {/* Logo upload */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <AvatarUpload size="xl" shape="rounded" />
            <span className="text-gray-600 text-xs">Brand logo</span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + verified */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="text-white font-semibold text-base">{user?.name}</h3>
              {profile?.completionScore >= 100 && <CheckCircle className="w-4 h-4 text-green-400" />}
            </div>

            {/* @handle + email */}
            <p className="text-gray-500 text-xs mb-3">
              {user?.userName} · {user?.email}
            </p>

            {/* Bio */}
            <EditableText
              value={profile?.bio}
              placeholder="e.g. D2C fitness brand looking for authentic creators in the health space."
              onSave={bio => save({ bio })}
              saving={saving}
              multiline
              maxLen={300}
            />
          </div>
        </div>

        {/* Website + Social — evenly spread like stats row */}
        <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <EditableText
              value={profile?.website}
              placeholder="Website"
              onSave={website => save({ website })}
              saving={saving}
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Linkedin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <EditableText
              value={profile?.linkedinUrl}
              placeholder="LinkedIn URL"
              onSave={linkedinUrl => save({ linkedinUrl })}
              saving={saving}
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Instagram className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
            <EditableText
              value={profile?.instagramHandle}
              placeholder="@brandinsta"
              onSave={instagramHandle => save({ instagramHandle })}
              saving={saving}
            />
          </div>
        </div>

        {/* Quick stats row */}
        {campaigns.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-4 gap-3 text-center">
            {[
              { label: 'Campaigns', value: campaigns.length },
              { label: 'Active',    value: activeCampaigns.length },
              { label: 'Applicants', value: totalApplicants },
              { label: 'Accepted',  value: totalAccepted },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white font-semibold text-base">{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Completion bar (below identity, not above) ─────────────── */}
      <CompletionBar
        completionScore={profile?.completionScore || 0}
        steps={profile?.completionSteps || []}
        userType="brand"
      />

      {/* ── Industry ─────────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
        <PillSelector
          label="Industry"
          desc="Creators in your niche discover your campaigns through this"
          options={INDUSTRIES.map(i => ({ key: i, label: i }))}
          value={profile?.industry || ''}
          onSelect={ind => save({ industry: ind })}
          saving={saving}
        />
      </div>

      {/* ── Budget range + creator size (side by side) ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
          <PillSelector
            label="Budget per campaign"
            desc="Creators self-filter based on this — set it accurately"
            options={BUDGET_RANGES}
            value={profile?.budgetRange || ''}
            onSelect={budgetRange => save({ budgetRange })}
            saving={saving}
          />
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
          <PillSelector
            label="Creator size"
            desc="What follower range do your campaigns work best with?"
            options={CREATOR_SIZES}
            value={profile?.preferredCreatorSize || ''}
            onSelect={preferredCreatorSize => save({ preferredCreatorSize })}
            saving={saving}
          />
        </div>
      </div>

      {/* ── Company size ──────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
        <PillSelector
          label="Company size"
          desc="Helps creators understand who they're working with"
          options={COMPANY_SIZES}
          value={profile?.companySize || ''}
          onSelect={companySize => save({ companySize })}
          saving={saving}
        />
      </div>

      {/* ── Campaign types ────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-medium text-sm mb-1">Campaign types</h3>
        <p className="text-gray-500 text-xs mb-4">Helps creators understand the kind of work you do</p>
        <div className="flex flex-wrap gap-2">
          {CAMPAIGN_TYPES.map(t => (
            <button key={t} onClick={() => handleToggleCampaignType(t)}
              disabled={saving}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all disabled:opacity-50 ${
                campaignTypes.includes(t)
                  ? 'bg-white text-black border-white'
                  : 'border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Campaign activity (real data, replaces dead empty state) ── */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-gray-800">
          <Megaphone className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-medium text-sm">Campaign activity</h3>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-1">No campaigns posted yet</p>
            <p className="text-gray-600 text-xs">Post your first campaign to start attracting creators</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {campaigns.slice(0, 5).map(c => (
              <div key={c._id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{c.title}</p>
                  <p className="text-gray-500 text-xs">{c.platform} · ${c.budget?.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className="text-gray-400 text-xs">
                    {c.applicants?.length || 0} applied · {c.accepted?.length || 0} accepted
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    c.status === 'active'    ? 'bg-green-500/10 text-green-400'
                    : c.status === 'completed' ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-gray-500/10 text-gray-400'
                  }`}>{c.status}</span>
                </div>
              </div>
            ))}
            {campaigns.length > 5 && (
              <p className="text-gray-600 text-xs text-center py-3">
                +{campaigns.length - 5} more campaigns · view all from Campaigns tab
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
});

export default OrgPortfolioOverview;