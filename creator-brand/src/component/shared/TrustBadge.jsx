import React from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

const STATES = {
  Incomplete:         { color: 'text-gray-600',   bg: 'bg-gray-900 border-gray-800',          dot: '#374151' },
  'Profile Verified': { color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',    dot: '#60a5fa' },
  New:                { color: 'text-gray-400',   bg: 'bg-gray-500/10 border-gray-500/20',     dot: '#9ca3af' },
  Rising:             { color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',     dot: '#60a5fa' },
  Trusted:            { color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',   dot: '#34d399' },
  Elite:              { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', dot: '#a78bfa' },
};

const TOOLTIP = {
  Incomplete:         'Complete your profile to build trust with brands',
  'Profile Verified': 'Profile complete — no campaign history yet',
  New:                'New creator — building their track record',
  Rising:             'Rising creator — completed a few campaigns',
  Trusted:            'Trusted creator — consistent delivery and good reviews',
  Elite:              'Elite creator — top performer with excellent track record',
};

export function getTrustState({ score = 0, completionScore = 100, completedCampaigns = 0 }) {
  if (completionScore < 100) return 'Incomplete';
  if (completedCampaigns === 0) return 'Profile Verified';
  if (score >= 80) return 'Elite';
  if (score >= 60) return 'Trusted';
  if (score >= 40) return 'Rising';
  return 'New';
}

export default function TrustBadge({ score = 0, completionScore = 100, completedCampaigns = 0, size = 'sm', showLabel = true }) {
  const state = getTrustState({ score, completionScore, completedCampaigns });
  const cfg = STATES[state];

  if (size === 'lg') {
    const IconComp = state === 'Incomplete' ? AlertCircle : state === 'Profile Verified' ? CheckCircle : Shield;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg}`} title={TOOLTIP[state]}>
        <IconComp className={`w-4 h-4 ${cfg.color} flex-shrink-0`} />
        <div>
          <div className={`text-xs font-semibold ${cfg.color}`}>{state}</div>
          <div className="text-gray-500 text-xs">
            {state === 'Incomplete' && 'Complete your profile'}
            {state === 'Profile Verified' && 'Ready for campaigns'}
            {state !== 'Incomplete' && state !== 'Profile Verified' && `${score}/100 trust score`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color}`} title={TOOLTIP[state]}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {showLabel
        ? state === 'Incomplete' ? 'Incomplete'
        : state === 'Profile Verified' ? 'Verified'
        : `${state} · ${score}`
        : score}
    </span>
  );
}

export function CompletionBar({ completionScore = 0, steps = [], userType = 'influencer' }) {
  if (completionScore >= 100) return (
    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
      <p className="text-green-400 text-sm font-medium">
        Profile complete — discoverable by {userType === 'influencer' ? 'brands' : 'creators'}
      </p>
    </div>
  );

  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-amber-400 text-sm font-medium">Complete your profile to get discovered</p>
        <span className="text-amber-400 text-xs font-semibold">{completionScore}%</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${completionScore}%` }} />
      </div>
      <div className="flex flex-wrap gap-2">
        {steps.filter(s => !s.done).map(s => (
          <span key={s.key} className="flex items-center gap-1 text-xs text-gray-400 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-lg">
            <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />{s.label}
          </span>
        ))}
      </div>
    </div>
  );
}