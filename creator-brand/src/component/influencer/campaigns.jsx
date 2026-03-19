import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Target, ChevronDown, ChevronUp, Search, Loader2, CheckCircle, XCircle, AlertCircle, Clock, Send, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAcceptedCampaigns, getMilestones, submitMilestone, submitReview, getTrustScore } from '../../services/apiService';
import useAuthStore from '../../store/authStore';
import TrustBadge from '../shared/TrustBadge';
import toast from 'react-hot-toast';

const statusColors = {
  active: 'bg-green-500/10 text-green-400 border border-green-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  paused: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  draft: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
};
const msIcon = { pending: Clock, submitted: AlertCircle, approved: CheckCircle, rejected: XCircle };
const msColor = { pending: 'text-gray-400', submitted: 'text-blue-400', approved: 'text-green-400', rejected: 'text-red-400' };

function MilestoneRow({ milestone, onSubmit }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ submissionNote: '', submissionUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const Icon = msIcon[milestone.status];

  const handle = async () => {
    if (!form.submissionNote.trim()) { toast.error('Add a note about your submission'); return; }
    setSubmitting(true);
    try { await onSubmit(milestone._id, form); toast.success('Submitted!'); setOpen(false); }
    catch { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-4 hover:bg-gray-900/50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 flex-shrink-0 ${msColor[milestone.status]}`} />
          <div>
            <p className="text-white text-sm font-medium">{milestone.title}</p>
            <p className="text-gray-500 text-xs">Due {new Date(milestone.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${msColor[milestone.status]} bg-gray-900`}>{milestone.status}</span>
          {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-800">
            <div className="p-4 space-y-3">
              {milestone.description && <p className="text-gray-400 text-xs">{milestone.description}</p>}
              {milestone.status === 'rejected' && milestone.rejectionReason && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-xs font-medium mb-1">Brand feedback:</p>
                  <p className="text-gray-300 text-xs">{milestone.rejectionReason}</p>
                </div>
              )}
              {milestone.status === 'approved' && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-green-400 text-xs">Approved by brand ✓</div>
              )}
              {milestone.status === 'submitted' && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-blue-400 text-xs">Waiting for brand review...</div>
              )}
              {(milestone.status === 'pending' || milestone.status === 'rejected') && (
                <div className="space-y-2">
                  <textarea value={form.submissionNote} onChange={e => setForm(p => ({ ...p, submissionNote: e.target.value }))}
                    placeholder="Describe what you've completed..." rows={3}
                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600 resize-none" />
                  <input value={form.submissionUrl} onChange={e => setForm(p => ({ ...p, submissionUrl: e.target.value }))}
                    placeholder="Link to your content (optional)"
                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
                  <button onClick={handle} disabled={submitting}
                    className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {milestone.status === 'rejected' ? 'Resubmit' : 'Submit for review'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewModal({ campaign, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handle = async () => {
    if (!rating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try { await onSubmit({ campaignId: campaign._id, revieweeId: campaign.brand, rating, comment }); toast.success('Review submitted!'); onClose(); }
    catch { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md p-6">
        <h3 className="text-white font-semibold mb-1">Rate this campaign</h3>
        <p className="text-gray-500 text-xs mb-5">How was your experience with {campaign.brandName}?</p>
        <div className="flex justify-center gap-1 mb-5">
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>
              <Star className={`w-8 h-8 transition-colors ${s <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience (optional)..." rows={3}
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600 resize-none mb-4" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-800 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
          <button onClick={handle} disabled={submitting}
            className="flex-1 bg-white hover:bg-gray-100 text-black py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Submit review'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Campaigns() {
  const { user } = useAuthStore();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [milestones, setMilestones] = useState({});
  const [loadingMs, setLoadingMs] = useState({});
  const [reviewCampaign, setReviewCampaign] = useState(null);
  const [myTrust, setMyTrust] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [camps, trust] = await Promise.all([
          getAcceptedCampaigns(),
          user?._id ? getTrustScore(user._id).catch(() => null) : null,
        ]);
        setCampaigns(camps);
        if (trust) setMyTrust(trust);
      } catch { toast.error('Failed to load'); }
      finally { setLoading(false); }
    })();
  }, [user?._id]);

  const toggleExpand = useCallback(async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!milestones[id]) {
      setLoadingMs(p => ({ ...p, [id]: true }));
      try {
        const data = await getMilestones(id);
        setMilestones(p => ({ ...p, [id]: data.filter(m => m.creator === user?._id) }));
      } catch { setMilestones(p => ({ ...p, [id]: [] })); }
      finally { setLoadingMs(p => ({ ...p, [id]: false })); }
    }
  }, [expandedId, milestones, user]);

  const handleSubmitMs = async (milestoneId, form) => {
    await submitMilestone(milestoneId, form);
    if (expandedId) {
      const data = await getMilestones(expandedId);
      setMilestones(p => ({ ...p, [expandedId]: data.filter(m => m.creator === user?._id) }));
    }
  };

  const filtered = campaigns.filter(c => !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.brandName?.toLowerCase().includes(search.toLowerCase()));

  const getProgress = (cms) => {
    if (!cms?.length) return null;
    const approved = cms.filter(m => m.status === 'approved').length;
    return { approved, total: cms.length, pct: Math.round((approved / cms.length) * 100) };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">My Campaigns</h1>
          <p className="text-gray-500 text-xs mt-1">Campaigns you've been accepted into</p>
        </div>
        {myTrust && <TrustBadge score={myTrust.trustScore} size="lg" />}
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..."
          className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gray-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-16 text-center">
          <Target className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No active campaigns yet</p>
          <p className="text-gray-600 text-xs mt-1">Browse campaigns, apply, and wait for brand approval</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => {
            const cms = milestones[c._id];
            const progress = getProgress(cms);
            const isExpanded = expandedId === c._id;
            return (
              <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-white font-medium text-sm">{c.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[c.status] || statusColors.active}`}>{c.status}</span>
                      </div>
                      <p className="text-gray-500 text-xs mb-3">by {c.brandName}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {new Date(c.deadline).toLocaleDateString()}</span>
                        <span>${c.budget?.toLocaleString()}</span>
                        <span className="bg-gray-800 px-2 py-0.5 rounded-full">{c.platform}</span>
                      </div>
                      {progress && (
                        <div className="mt-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Milestones</span>
                            <span className="text-xs text-gray-400">{progress.approved}/{progress.total} done</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progress.pct}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {c.status === 'completed' && (
                        <button onClick={() => setReviewCampaign(c)}
                          className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                          <Star className="w-3 h-3" /> Rate
                        </button>
                      )}
                      <button onClick={() => toggleExpand(c._id)}
                        className="flex items-center gap-1.5 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors">
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        Tasks
                      </button>
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-800 overflow-hidden">
                      <div className="p-5 space-y-3 bg-black/30">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Your deliverables</p>
                        {loadingMs[c._id] ? (
                          <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-gray-600 animate-spin" /></div>
                        ) : !cms?.length ? (
                          <div className="text-center py-8 text-gray-600 text-sm">Brand will add your milestones soon</div>
                        ) : cms.map(m => <MilestoneRow key={m._id} milestone={m} onSubmit={handleSubmitMs} />)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {reviewCampaign && (
          <ReviewModal campaign={reviewCampaign} onClose={() => setReviewCampaign(null)} onSubmit={handleReview} />
        )}
      </AnimatePresence>
    </div>
  );
  async function handleReview(data) { await submitReview(data); }
}