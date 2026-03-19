import React, { useState } from 'react';
import { Shield, Lock, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, CreditCard, Users, Zap, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const escrowExplained = [
  { q: 'Why do I need to pay upfront?', a: 'Creators — especially micro and nano creators — get ghosted by brands constantly. By locking payment into escrow before they start work, you signal that you are a serious, trustworthy brand. This gets you better creators and better results.' },
  { q: 'What if I am not happy with the work?', a: 'You review the content before payment is released. If a milestone is not right, you reject it with feedback and the creator resubmits. Payment only releases when you approve. You stay in full control.' },
  { q: 'Can I get a refund if a creator disappears?', a: 'If a creator does not deliver and misses all milestones, the escrow is fully refundable to you. Our team handles dispute resolution in these cases.' },
];

const mockEscrow = [
  { id: 1, campaign: 'Summer Launch 2025', creator: 'Priya Mehta', amount: 2500, status: 'active', milestones: 2, milestonesApproved: 1, deadline: '2025-08-20', creatorHandle: '@priya_creates' },
  { id: 2, campaign: 'Tech Review Series', creator: 'Rahul Dev', amount: 1800, status: 'approving', milestones: 3, milestonesApproved: 3, deadline: '2025-08-10', creatorHandle: '@rahuldev' },
  { id: 3, campaign: 'Fitness Challenge', creator: 'Ananya Singh', amount: 1200, status: 'completed', milestones: 2, milestonesApproved: 2, deadline: '2025-07-30', creatorHandle: '@ananya_fit' },
];

const statusConfig = {
  active:     { label: 'Locked — creator working', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: Lock },
  approving:  { label: 'Ready to release', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Clock },
  completed:  { label: 'Released to creator', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
};

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-white text-sm font-medium">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pb-4">
            <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OrgPayments() {
  const totalLocked = mockEscrow.filter(e => e.status === 'active').reduce((s, e) => s + e.amount, 0);
  const totalApproving = mockEscrow.filter(e => e.status === 'approving').reduce((s, e) => s + e.amount, 0);
  const totalSpent = mockEscrow.filter(e => e.status === 'completed').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Payments & Escrow</h1>
        <p className="text-gray-500 text-xs mt-1">Lock payments when you accept a creator. Release when work is approved.</p>
      </div>

      {/* Explainer */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-medium mb-1">Why escrow makes creators work harder for you</p>
            <p className="text-gray-400 text-xs leading-relaxed">Creators commit more seriously when they see money is actually locked. It's not a promise — it's proof. Brands using escrow report 3× higher content quality and zero ghosting.</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Currently locked', value: `₹${(totalLocked * 83).toLocaleString()}`, sub: `${mockEscrow.filter(e => e.status === 'active').length} active campaigns`, color: 'text-blue-400', icon: Lock },
          { label: 'Awaiting your approval', value: `₹${(totalApproving * 83).toLocaleString()}`, sub: 'Ready to release', color: 'text-amber-400', icon: Clock },
          { label: 'Total paid out', value: `₹${(totalSpent * 83).toLocaleString()}`, sub: 'Campaigns completed', color: 'text-green-400', icon: CheckCircle },
        ].map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="bg-gray-950 border border-gray-800 rounded-xl p-5">
            <Icon className={`w-4 h-4 ${color} mb-3`} />
            <p className={`text-xl font-semibold ${color}`}>{value}</p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
            <p className="text-gray-600 text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Escrow entries */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-white font-medium text-sm">Active escrow accounts</h2>
          <p className="text-gray-500 text-xs mt-0.5">Each accepted creator gets their own escrow</p>
        </div>
        <div className="divide-y divide-gray-800">
          {mockEscrow.map((e, i) => {
            const cfg = statusConfig[e.status];
            const Icon = cfg.icon;
            const pct = Math.round((e.milestonesApproved / e.milestones) * 100);
            return (
              <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                className="p-5 hover:bg-gray-900/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-white text-sm font-medium">{e.campaign}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" /> {e.creator} · {e.creatorHandle}
                      </span>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border w-fit mb-3 ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3 h-3" />{cfg.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-gray-500 text-xs whitespace-nowrap">{e.milestonesApproved}/{e.milestones} milestones approved</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-semibold">₹{(e.amount * 83).toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">${e.amount}</p>
                    {e.status === 'approving' && (
                      <button className="mt-2 flex items-center gap-1 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs px-3 py-1.5 rounded-lg transition-colors">
                        <Zap className="w-3 h-3" /> Approve & release
                      </button>
                    )}
                    {e.status === 'completed' && (
                      <p className="text-green-400 text-xs mt-1">Released ✓</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Deposit new campaign */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <CreditCard className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-medium mb-1">How to lock payment for a new campaign</p>
            <p className="text-gray-500 text-xs mb-3">When you accept a creator from the Applicants panel, you'll be prompted to deposit the campaign budget into escrow via Razorpay. It takes under 2 minutes.</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="bg-gray-900 px-2 py-1 rounded">UPI</span>
              <span className="bg-gray-900 px-2 py-1 rounded">Net banking</span>
              <span className="bg-gray-900 px-2 py-1 rounded">Debit / Credit card</span>
              <span className="bg-gray-900 px-2 py-1 rounded">NEFT / RTGS</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-gray-400" />
          <h2 className="text-white font-medium text-sm">Common questions</h2>
        </div>
        {escrowExplained.map(item => <FAQItem key={item.q} {...item} />)}
      </div>
    </div>
  );
}