import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, ChevronRight, ChevronDown, Target, Shield, DollarSign, MessageSquare, Star, Zap } from 'lucide-react';

// ── Content definitions ───────────────────────────────────────────────────────

const CREATOR_SECTIONS = [
  {
    icon: Target,
    color: 'text-blue-400',
    title: 'How to get your first campaign',
    steps: [
      'Complete your profile — add bio, niche, and at least one social handle so brands can evaluate you',
      'Browse Campaigns → filter by platform and category → Apply to ones that match your content',
      'Brands review applications within a few days. Your trust score and profile quality determine acceptance',
      'Once accepted, go to My Campaigns → you\'ll see milestones the brand has set for you',
    ],
  },
  {
    icon: Shield,
    color: 'text-green-400',
    title: 'Trust score & what it means',
    steps: [
      '"Profile Verified" — profile is complete, no campaigns yet. Brands can still find you',
      '"New" — you\'ve completed 1–2 campaigns with reviews. Score starts here',
      '"Rising" → "Trusted" → "Elite" — score builds as you complete more campaigns with good ratings',
      'To build trust faster: submit post-metrics after every campaign and ask brands to leave a review',
    ],
  },
  {
    icon: DollarSign,
    color: 'text-amber-400',
    title: 'How payments work',
    steps: [
      'When a brand accepts you, they deposit your payment into escrow — it\'s held securely',
      'You work on the milestones the brand sets. Submit each one when done',
      'Brand approves your submissions. Payment releases per milestone approved',
      'You\'re always protected — money is locked in before you start work',
    ],
  },
  {
    icon: MessageSquare,
    color: 'text-purple-400',
    title: 'Messaging brands',
    steps: [
      'Go to Organizations → browse all brands → click "Message brand" on any card',
      'Or: click on a campaign → after applying you can message the brand directly',
      'Keep messages professional — introduce yourself and mention relevant work',
      'Brands receive your message in their inbox and can reply from their dashboard',
    ],
  },
  {
    icon: Star,
    color: 'text-pink-400',
    title: 'Analytics & social stats',
    steps: [
      'Go to Analytics → "Social reach" section → click Edit to add your handles and follower counts',
      'Add avg views per video for YouTube/TikTok — brands use this to estimate campaign ROI',
      'After posting for a campaign, submit your post metrics (reach, likes, comments) from Analytics',
      'To get a Verified badge on your stats, email verify@liflu.in with a screenshot of your analytics',
    ],
  },
];

const BRAND_SECTIONS = [
  {
    icon: Zap,
    color: 'text-blue-400',
    title: 'Posting your first campaign',
    steps: [
      'Click "Create Campaign" → fill in budget, platform, requirements in 3 steps',
      'Toggle "Open to new creators" to attract more applicants including newer creators',
      'Campaign goes live immediately — creators can start applying right away',
      'Share the campaign on social media to accelerate applications',
    ],
  },
  {
    icon: Target,
    color: 'text-green-400',
    title: 'Finding & reviewing creators',
    steps: [
      'Browse Influencer → search by name, filter by niche dropdown',
      'Click any creator card to see their full profile — handles, follower counts, past work',
      'When creators apply, click "Review" on your Campaigns page to see all applicants',
      'Sort by trust score or followers — accept the right fit, reject others with one click',
    ],
  },
  {
    icon: Shield,
    color: 'text-amber-400',
    title: 'Milestones & tracking work',
    steps: [
      'After accepting a creator, click "Set milestones" in the applicants panel',
      'Add deliverables with titles and due dates — e.g. "Submit draft Reel by April 5"',
      'Creators see these as tasks. They submit their work and you approve or request changes',
      'Payment releases only when you approve a milestone — you stay in control',
    ],
  },
  {
    icon: DollarSign,
    color: 'text-purple-400',
    title: 'Escrow & payments',
    steps: [
      'Budget is deposited into escrow when the campaign is created (Razorpay — coming soon)',
      'Each milestone approval triggers a partial payment release to the creator',
      'If a creator doesn\'t deliver, you can reject the milestone and request revisions',
      'Full refund available if no milestones are approved within the campaign period',
    ],
  },
];

// ── Accordion item ────────────────────────────────────────────────────────────
function AccordionItem({ section }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-900/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${section.color} flex-shrink-0`} />
          <p className="text-white text-sm font-medium">{section.title}</p>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-gray-800">
              <ol className="space-y-2.5 mt-3">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 bg-gray-800 ${section.color}`}>
                      {i + 1}
                    </span>
                    <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main HelpPanel ────────────────────────────────────────────────────────────
export default function HelpPanel({ userType, onClose }) {
  const sections = userType === 'brand' ? BRAND_SECTIONS : CREATOR_SECTIONS;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9980] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-gray-950 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[88vh] overflow-y-auto"
        >
          {/* Mobile handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-gray-700 rounded-full" />
          </div>

          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <HelpCircle className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">How Liflu works</h2>
                <p className="text-gray-500 text-xs">{userType === 'brand' ? 'Brand guide' : 'Creator guide'}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-3">
            {sections.map((s, i) => <AccordionItem key={i} section={s} />)}

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mt-4">
              <p className="text-blue-300 text-sm font-medium mb-1">Need more help?</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Email us at <span className="text-white">support@liflu.in</span> — we typically respond within 4 hours.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ── Trigger button (used in navbars) ──────────────────────────────────────────
export function HelpButton({ userType }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        title="Help & guide"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {open && <HelpPanel userType={userType} onClose={() => setOpen(false)} />}
    </>
  );
}