import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Check, XCircle, Plus, Trash2, Loader2, Calendar, Star } from 'lucide-react';
import { getApplicants, acceptCreator, rejectCreator, createMilestone, getMilestones } from '../../services/apiService';
import TrustBadge from '../shared/TrustBadge';
import toast from 'react-hot-toast';
import { notifyAccepted } from '../../store/notificationStore';

export default function Applicants({ campaign, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'milestones'
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', dueDate: '' });
  const [savingMilestone, setSavingMilestone] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await getApplicants(campaign._id);
      setApplicants(data);
    } catch {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (creatorId) => {
    setActing(creatorId + '_accept');
    try {
      await acceptCreator(campaign._id, creatorId);
      setApplicants(prev => prev.map(a =>
        a.user._id === creatorId ? { ...a, isAccepted: true } : a
      ));
      // In real app, this notification goes to the creator's device
      // For now it fires locally so the brand gets confirmation
      notifyAccepted(campaign.title, campaign.brandName || 'Brand');
      toast.success('Creator accepted!');
    } catch (err) {
      toast.error(err.message || 'Failed to accept');
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (creatorId) => {
    setActing(creatorId + '_reject');
    try {
      await rejectCreator(campaign._id, creatorId);
      setApplicants(prev => prev.filter(a => a.user._id !== creatorId));
      toast.success('Creator removed');
    } catch {
      toast.error('Failed to reject');
    } finally {
      setActing(null);
    }
  };

  const openMilestones = async (applicant) => {
    setSelectedCreator(applicant);
    setView('milestones');
    try {
      const data = await getMilestones(campaign._id);
      setMilestones(data.filter(m => m.creator === applicant.user._id));
    } catch {
      setMilestones([]);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      toast.error('Title and due date are required');
      return;
    }
    setSavingMilestone(true);
    try {
      const m = await createMilestone({
        campaignId: campaign._id,
        creatorId: selectedCreator.user._id,
        title: newMilestone.title,
        description: newMilestone.description,
        dueDate: newMilestone.dueDate,
        order: milestones.length,
      });
      setMilestones(prev => [...prev, m]);
      setNewMilestone({ title: '', description: '', dueDate: '' });
      toast.success('Milestone added!');
    } catch {
      toast.error('Failed to add milestone');
    } finally {
      setSavingMilestone(false);
    }
  };

  const statusColor = {
    pending:   'bg-gray-500/10 text-gray-400 border-gray-500/20',
    submitted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    approved:  'bg-green-500/10 text-green-400 border-green-500/20',
    rejected:  'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {view === 'milestones' && (
              <button onClick={() => setView('list')} className="text-gray-400 hover:text-white text-sm mr-1">← Back</button>
            )}
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-white font-semibold">
                {view === 'list' ? `Applicants — ${campaign.title}` : `Milestones for ${selectedCreator?.user?.name}`}
              </h2>
              <p className="text-gray-500 text-xs">
                {view === 'list' ? `${applicants.length} people applied` : `${milestones.length} milestone${milestones.length !== 1 ? 's' : ''} set`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-2 rounded-lg hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">

            {/* APPLICANTS LIST */}
            {view === 'list' && (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {loading ? (
                  <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-gray-600 animate-spin" /></div>
                ) : applicants.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No applicants yet</p>
                    <p className="text-gray-600 text-xs mt-1">Share your campaign to attract creators</p>
                  </div>
                ) : applicants.map((a, i) => (
                  <motion.div
                    key={a.user._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-black border rounded-xl p-5 transition-colors ${a.isAccepted ? 'border-green-500/30' : 'border-gray-800 hover:border-gray-700'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-gray-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {a.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-white font-medium text-sm">{a.user?.name}</span>
                            <span className="text-gray-500 text-xs">{a.user?.userName}</span>
                            <TrustBadge score={a.trustScore} />
                            {a.isAccepted && (
                              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Accepted</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                            {a.profile?.niche?.length > 0 && (
                              <span>{a.profile.niche.slice(0, 2).join(' · ')}</span>
                            )}
                            {a.profile?.followers > 0 && (
                              <span>{(a.profile.followers / 1000).toFixed(1)}K followers</span>
                            )}
                            {a.reviewCount > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400" />
                                {a.avgRating} ({a.reviewCount} reviews)
                              </span>
                            )}
                          </div>
                          {a.profile?.bio && (
                            <p className="text-gray-400 text-xs line-clamp-2">{a.profile.bio}</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {!a.isAccepted ? (
                          <>
                            <button
                              onClick={() => handleAccept(a.user._id)}
                              disabled={acting === a.user._id + '_accept'}
                              className="flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              {acting === a.user._id + '_accept' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(a.user._id)}
                              disabled={acting === a.user._id + '_reject'}
                              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              {acting === a.user._id + '_reject' ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openMilestones(a)}
                            className="flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Calendar className="w-3 h-3" />
                            Set milestones
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* MILESTONE SETTER */}
            {view === 'milestones' && (
              <motion.div key="milestones" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-300">
                  Set clear deliverables for {selectedCreator?.user?.name}. They'll see these as tasks to complete — no more WhatsApp confusion.
                </div>

                {/* Existing milestones */}
                {milestones.length > 0 && (
                  <div className="space-y-2">
                    {milestones.map((m, i) => (
                      <div key={m._id} className="bg-black border border-gray-800 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            <div>
                              <p className="text-white text-sm font-medium">{m.title}</p>
                              {m.description && <p className="text-gray-500 text-xs mt-0.5">{m.description}</p>}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span>Due {new Date(m.dueDate).toLocaleDateString()}</span>
                                <span className={`px-2 py-0.5 rounded-full border capitalize ${statusColor[m.status]}`}>{m.status}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {m.submissionNote && (
                          <div className="mt-3 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                            <p className="text-blue-400 text-xs font-medium mb-1">Creator's submission:</p>
                            <p className="text-gray-300 text-xs">{m.submissionNote}</p>
                            {m.submissionUrl && (
                              <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs underline mt-1 block">View link</a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new milestone */}
                <div className="bg-black border border-gray-800 rounded-xl p-5">
                  <p className="text-gray-400 text-xs font-medium mb-4 uppercase tracking-wider">Add milestone</p>
                  <div className="space-y-3">
                    <input
                      value={newMilestone.title}
                      onChange={e => setNewMilestone(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Submit draft Reel for review"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
                    />
                    <input
                      value={newMilestone.description}
                      onChange={e => setNewMilestone(p => ({ ...p, description: e.target.value }))}
                      placeholder="Details or requirements (optional)"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
                    />
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={newMilestone.dueDate}
                        onChange={e => setNewMilestone(p => ({ ...p, dueDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gray-600"
                      />
                      <button
                        onClick={handleAddMilestone}
                        disabled={savingMilestone}
                        className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-5 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                      >
                        {savingMilestone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}