import React from 'react';
import { Shield } from 'lucide-react';

const levelConfig = {
  Elite:   { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', dot: '#a78bfa' },
  Trusted: { color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',  dot: '#34d399' },
  Rising:  { color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',    dot: '#60a5fa' },
  New:     { color: 'text-gray-400',   bg: 'bg-gray-500/10 border-gray-500/20',    dot: '#9ca3af' },
  Unrated: { color: 'text-gray-600',   bg: 'bg-gray-900 border-gray-800',          dot: '#4b5563' },
};

function getLevel(score) {
  if (score >= 80) return 'Elite';
  if (score >= 60) return 'Trusted';
  if (score >= 40) return 'Rising';
  if (score > 0)   return 'New';
  return 'Unrated';
}

export default function TrustBadge({ score = 0, size = 'sm', showLabel = true }) {
  const level = getLevel(score);
  const cfg = levelConfig[level];

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg}`}>
        <Shield className={`w-4 h-4 ${cfg.color}`} />
        <div>
          <div className={`text-xs font-semibold ${cfg.color}`}>{level}</div>
          <div className="text-gray-500 text-xs">{score}/100 trust score</div>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {showLabel ? `${level} · ${score}` : score}
    </span>
  );
}