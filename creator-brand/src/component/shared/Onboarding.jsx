import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, Instagram, Youtube, Twitter, Loader2, Sparkles } from 'lucide-react';
import { updateMyProfile } from '../../services/apiService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

// ── Data ──────────────────────────────────────────────────────────────────────

const CREATOR_NICHES = [
  'Fashion', 'Technology', 'Lifestyle', 'Fitness', 'Travel',
  'Food', 'Beauty', 'Gaming', 'Finance', 'Education', 'Health', 'Music'
];

const BRAND_INDUSTRIES = [
  'Fashion & Apparel', 'Technology', 'Food & Beverage', 'Health & Fitness',
  'Beauty & Skincare', 'Gaming', 'Finance', 'Travel', 'Education', 'Entertainment'
];

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10' },
  { key: 'youtube',   label: 'YouTube',   icon: Youtube,   color: 'text-red-400',  border: 'border-red-500/30',  bg: 'bg-red-500/10'  },
  { key: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
];

// ── Step progress bar ─────────────────────────────────────────────────────────

function StepBar({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full flex-1 transition-all duration-500 ${
          i < current ? 'bg-white' : i === current ? 'bg-white/60' : 'bg-gray-800'
        }`} />
      ))}
    </div>
  );
}

// ── Creator steps ─────────────────────────────────────────────────────────────

function CreatorOnboarding({ user, onDone }) {
  const [step, setStep] = useState(0);
  const [niches, setNiches] = useState([]);
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState({ instagram: '', youtube: '', twitter: '' });
  const [saving, setSaving] = useState(false);

  const toggleNiche = (n) =>
    setNiches(prev => prev.includes(n) ? prev.filter(x => x !== n) : prev.length < 5 ? [...prev, n] : prev);

  const next = () => setStep(s => s + 1);

  const handleFinish = async () => {
    setSaving(true);
    try {
      const ss = {};
      PLATFORMS.forEach(({ key }) => {
        if (followers[key]) ss[key] = { followers: Number(followers[key]), verified: false };
      });
      await updateMyProfile({
        niche: niches,
        bio,
        socialStats: ss,
        followers: Math.max(...PLATFORMS.map(({ key }) => Number(followers[key]) || 0)),
      });
      toast.success("Profile set up — let's find you campaigns! 🚀");
      onDone();
    } catch {
      toast.error('Could not save profile. You can update it in your portfolio.');
      onDone();
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    // Step 0 — welcome
    <div key="welcome" className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-gray-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
        {user?.name?.[0]?.toUpperCase()}
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to LinkFluence, {user?.name?.split(' ')[0]}!</h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
        Let's set up your creator profile in 3 quick steps so brands can discover you.
      </p>
      <button onClick={next} className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        Get started <ChevronRight className="w-4 h-4" />
      </button>
      <p className="text-gray-600 text-xs mt-3">Takes about 2 minutes</p>
    </div>,

    // Step 1 — niche
    <div key="niche">
      <h2 className="text-xl font-bold text-white mb-1">What do you create?</h2>
      <p className="text-gray-400 text-sm mb-6">Pick up to 5 niches. Brands search by these to find you.</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {CREATOR_NICHES.map(n => (
          <button key={n} onClick={() => toggleNiche(n)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
              niches.includes(n) ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
            }`}>
            {n}
          </button>
        ))}
      </div>
      <button onClick={next} disabled={niches.length === 0}
        className="w-full bg-white hover:bg-gray-100 disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        Continue <ChevronRight className="w-4 h-4" />
      </button>
      <button onClick={next} className="w-full text-gray-600 hover:text-gray-400 text-sm mt-3 transition-colors">Skip for now</button>
    </div>,

    // Step 2 — bio + followers
    <div key="bio">
      <h2 className="text-xl font-bold text-white mb-1">Tell brands about yourself</h2>
      <p className="text-gray-400 text-sm mb-5">A good bio gets you more campaign invitations.</p>
      <textarea
        value={bio} onChange={e => setBio(e.target.value)}
        placeholder="e.g. Tech + lifestyle creator from Mumbai. I make honest reviews and travel content. 4.2% avg engagement."
        rows={3} maxLength={200}
        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600 resize-none mb-1"
      />
      <p className="text-gray-700 text-xs text-right mb-5">{bio.length}/200</p>

      <p className="text-gray-400 text-sm font-medium mb-3">Follower counts (optional)</p>
      <div className="space-y-3 mb-8">
        {PLATFORMS.map(({ key, label, icon: Icon, color, border, bg }) => (
          <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border ${border} ${bg}`}>
            <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
            <span className="text-gray-300 text-sm flex-1">{label}</span>
            <input
              type="number" value={followers[key]}
              onChange={e => setFollowers(p => ({ ...p, [key]: e.target.value }))}
              placeholder="0"
              className="w-28 bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm text-right focus:outline-none focus:border-gray-500"
            />
          </div>
        ))}
      </div>
      <button onClick={handleFinish} disabled={saving}
        className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {saving ? 'Setting up...' : 'Go to my dashboard'}
      </button>
    </div>,
  ];

  return (
    <div>
      <StepBar current={step} total={steps.length} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Brand steps ───────────────────────────────────────────────────────────────

function BrandOnboarding({ user, onDone }) {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);

  const next = () => setStep(s => s + 1);

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateMyProfile({ industry, bio, website });
      toast.success("Brand profile set up — post your first campaign! 🚀");
      onDone();
    } catch {
      toast.error('Could not save profile. You can update it in your portfolio.');
      onDone();
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    // Step 0 — welcome
    <div key="welcome" className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-gray-700 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
        {user?.name?.[0]?.toUpperCase()}
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to LinkFluence, {user?.name?.split(' ')[0]}!</h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
        Let's set up your brand profile so creators know who they're working with.
      </p>
      <button onClick={next} className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        Get started <ChevronRight className="w-4 h-4" />
      </button>
      <p className="text-gray-600 text-xs mt-3">Takes about 2 minutes</p>
    </div>,

    // Step 1 — industry
    <div key="industry">
      <h2 className="text-xl font-bold text-white mb-1">What industry are you in?</h2>
      <p className="text-gray-400 text-sm mb-6">Creators in your niche will see your campaigns first.</p>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {BRAND_INDUSTRIES.map(ind => (
          <button key={ind} onClick={() => setIndustry(ind)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium border text-left transition-all ${
              industry === ind ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
            }`}>
            {industry === ind && <CheckCircle className="w-3 h-3 inline mr-1.5" />}{ind}
          </button>
        ))}
      </div>
      <button onClick={next} disabled={!industry}
        className="w-full bg-white hover:bg-gray-100 disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        Continue <ChevronRight className="w-4 h-4" />
      </button>
      <button onClick={next} className="w-full text-gray-600 hover:text-gray-400 text-sm mt-3 transition-colors">Skip for now</button>
    </div>,

    // Step 2 — bio + website
    <div key="bio">
      <h2 className="text-xl font-bold text-white mb-1">Describe your brand</h2>
      <p className="text-gray-400 text-sm mb-5">Creators read this before deciding to apply. Be specific about what you're looking for.</p>
      <textarea
        value={bio} onChange={e => setBio(e.target.value)}
        placeholder="e.g. We're a D2C fitness brand looking for authentic creators in the health and lifestyle space. We value long-term partnerships and creative freedom."
        rows={4} maxLength={300}
        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600 resize-none mb-1"
      />
      <p className="text-gray-700 text-xs text-right mb-5">{bio.length}/300</p>

      <label className="text-gray-400 text-sm font-medium block mb-2">Website (optional)</label>
      <input
        value={website} onChange={e => setWebsite(e.target.value)}
        placeholder="https://yourbrand.com"
        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600 mb-8"
      />
      <button onClick={handleFinish} disabled={saving}
        className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {saving ? 'Setting up...' : 'Go to my dashboard'}
      </button>
    </div>,
  ];

  return (
    <div>
      <StepBar current={step} total={steps.length} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Wrapper modal ─────────────────────────────────────────────────────────────

export default function Onboarding({ onDone }) {
  const { user } = useAuthStore();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl"
      >
        {user?.userType === 'influencer'
          ? <CreatorOnboarding user={user} onDone={onDone} />
          : <BrandOnboarding user={user} onDone={onDone} />
        }
      </motion.div>
    </div>
  );
}