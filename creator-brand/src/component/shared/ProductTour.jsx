import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

// ── Tour step definitions ─────────────────────────────────────────────────────
// Each step targets a CSS selector OR uses a fixed position description
// position: where the tooltip appears relative to the spotlight

const CREATOR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Liflu! 👋',
    description: 'You\'re now part of the platform that connects real creators with real brands — no fake followers, no getting ghosted. Let\'s show you around in 30 seconds.',
    target: null, // No spotlight — full screen welcome card
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Your dashboard',
    description: 'This is your home base. See your active campaigns, open opportunities from brands, and your key stats — all pulling from real data, not placeholders.',
    target: '[data-tour="dashboard-stats"]',
    position: 'bottom',
  },
  {
    id: 'campaigns',
    title: 'Browse & apply to campaigns',
    description: 'Click Campaigns in the sidebar to see all live brand campaigns. Filter by platform and niche. Hit Apply — the brand reviews your profile and trust score before accepting.',
    target: '[data-tour="sidebar-campaigns"]',
    position: 'right',
  },
  {
    id: 'profile',
    title: 'Your trust score grows here',
    description: 'Complete your profile — bio, niche, follower counts, past collaborations. The more complete it is, the more brands reach out. Trust score builds automatically as you complete campaigns.',
    target: '[data-tour="sidebar-portfolio"]',
    position: 'right',
  },
  {
    id: 'escrow',
    title: 'You always get paid',
    description: 'When a brand accepts you, they lock payment into escrow before you start work. You submit milestones, brand approves, money releases. No more getting ghosted after delivery.',
    target: '[data-tour="sidebar-payments"]',
    position: 'right',
  },
  {
    id: 'done',
    title: 'You\'re all set 🚀',
    description: 'Start by browsing open campaigns and applying to ones that match your content. Good luck — your first collaboration is closer than you think.',
    target: null,
    position: 'center',
  },
];

const BRAND_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Liflu! 👋',
    description: 'The platform that connects brands with verified creators — with escrow payments, milestone tracking, and trust scores built in. Let\'s take a quick look around.',
    target: null,
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Your campaign command center',
    description: 'See all your active campaigns, total applicants, and accepted creators at a glance. The "How it works" checklist tracks your progress toward your first successful collaboration.',
    target: '[data-tour="dashboard-stats"]',
    position: 'bottom',
  },
  {
    id: 'campaigns',
    title: 'Post your first campaign',
    description: 'Click Campaigns → New Campaign to post a campaign. Set your budget, platform, requirements, and whether you\'re open to new creators. Takes 2 minutes.',
    target: '[data-tour="sidebar-campaigns"]',
    position: 'right',
  },
  {
    id: 'applicants',
    title: 'Review creators with trust scores',
    description: 'When creators apply, you\'ll see their trust score, follower counts, past collaborations, and review history. Accept the right fit, set milestones, and lock payment into escrow.',
    target: '[data-tour="sidebar-browse"]',
    position: 'right',
  },
  {
    id: 'escrow',
    title: 'Escrow protects both sides',
    description: 'You deposit budget when you accept a creator. They work, you review. Payment releases only when you approve. Creators commit harder when they know payment is locked.',
    target: '[data-tour="sidebar-payments"]',
    position: 'right',
  },
  {
    id: 'done',
    title: 'Ready to find your creators 🎯',
    description: 'Post your first campaign and watch applications come in. Brands with complete profiles get better quality applicants — fill yours in from the profile menu.',
    target: null,
    position: 'center',
  },
];

// ── Spotlight overlay ──────────────────────────────────────────────────────────
function SpotlightOverlay({ targetEl, padding = 12 }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!targetEl) { setRect(null); return; }
    const update = () => {
      const r = targetEl.getBoundingClientRect();
      setRect({ top: r.top - padding, left: r.left - padding, width: r.width + padding * 2, height: r.height + padding * 2 });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [targetEl, padding]);

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left} y={rect.top}
                width={rect.width} height={rect.height}
                rx="12" fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%" height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#spotlight-mask)"
        />
        {rect && (
          <rect
            x={rect.left} y={rect.top}
            width={rect.width} height={rect.height}
            rx="12" fill="none"
            stroke="white" strokeWidth="2" strokeOpacity="0.4"
          />
        )}
      </svg>
    </div>
  );
}

// ── Tooltip card ──────────────────────────────────────────────────────────────
function TooltipCard({ step, current, total, targetEl, onNext, onPrev, onSkip }) {
  const [style, setStyle] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });

  useEffect(() => {
    if (!targetEl || step.position === 'center') {
      setStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
      return;
    }
    const r = targetEl.getBoundingClientRect();
    const GAP = 20;
    const CARD_W = 340;
    const CARD_H = 220;

    if (step.position === 'right') {
      setStyle({ top: Math.min(r.top + r.height / 2, window.innerHeight - CARD_H - 20), left: r.right + GAP, transform: 'translateY(-50%)' });
    } else if (step.position === 'bottom') {
      setStyle({ top: r.bottom + GAP, left: Math.max(16, Math.min(r.left + r.width / 2 - CARD_W / 2, window.innerWidth - CARD_W - 16)), transform: 'none' });
    } else if (step.position === 'left') {
      setStyle({ top: r.top + r.height / 2, left: r.left - CARD_W - GAP, transform: 'translateY(-50%)' });
    }
  }, [targetEl, step]);

  const isFirst = current === 0;
  const isLast = current === total - 1;
  const isDone = step.id === 'done';

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.2 }}
      style={{ position: 'fixed', zIndex: 9999, width: 340, ...style }}
      className="bg-gray-950 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Progress bar */}
      <div className="h-0.5 bg-gray-800">
        <motion.div
          className="h-full bg-white"
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-5">
        {/* Step counter */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-xs">{current + 1} of {total}</span>
          <button onClick={onSkip} className="text-gray-600 hover:text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 disabled:opacity-0 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            {isDone ? 'Get started' : 'Next'}
            {!isDone && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main ProductTour ──────────────────────────────────────────────────────────
export default function ProductTour({ userType = 'influencer', onDone }) {
  const steps = userType === 'brand' ? BRAND_STEPS : CREATOR_STEPS;
  const [current, setCurrent] = useState(0);
  const [targetEl, setTargetEl] = useState(null);

  const step = steps[current];

  // Find and scroll to the target element
  useEffect(() => {
    if (!step.target) { setTargetEl(null); return; }
    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTargetEl(el);
    } else {
      setTargetEl(null);
    }
  }, [step]);

  const next = () => {
    if (current < steps.length - 1) setCurrent(c => c + 1);
    else onDone();
  };

  const prev = () => { if (current > 0) setCurrent(c => c - 1); };

  return (
    <>
      <SpotlightOverlay targetEl={targetEl} />
      <AnimatePresence mode="wait">
        <TooltipCard
          key={step.id}
          step={step}
          current={current}
          total={steps.length}
          targetEl={targetEl}
          onNext={next}
          onPrev={prev}
          onSkip={onDone}
        />
      </AnimatePresence>
    </>
  );
}