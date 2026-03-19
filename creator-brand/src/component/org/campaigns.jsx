import React, { useState } from 'react';
import { Calendar, Target, DollarSign, Users, Plus, Trash2, Loader2, Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaigns } from '../../hooks/useCampaigns';
import AIBriefGenerator from './AIBriefGenerator';
import CampaignModal from './campaign/campaignModal';
import Applicants from './Applicants';

const statusColors = {
  active:    'bg-green-500/10 text-green-400 border border-green-500/20',
  draft:     'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  paused:    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
};

export default function OrgCampaigns() {
  const { campaigns, loading, error, remove } = useCampaigns();
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAIBrief, setShowAIBrief] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [applicantsCampaign, setApplicantsCampaign] = useState(null);

  const filtered = campaigns.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch = !q || c.title?.toLowerCase().includes(q) || c.brandName?.toLowerCase().includes(q);
    const matchesPlatform = !platformFilter || c.platform === platformFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    setDeleting(id);
    await remove(id);
    setDeleting(null);
  };

  const handleUseBrief = (brief) => {
    setPrefillData(brief);
    setShowAIBrief(false);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-400 text-xs mt-1">{campaigns.length} total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAIBrief(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Sparkles className="w-4 h-4" /> AI Brief
          </button>
          <button onClick={() => { setPrefillData(null); setShowCreateModal(true); }}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..."
            className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600" />
        </div>
        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}
          className="bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none">
          <option value="">All Platforms</option>
          {['Instagram','YouTube','TikTok','Twitter','LinkedIn','Multiple'].map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none">
          <option value="">All Status</option>
          {['active','draft','paused','completed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-400 text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-16 text-center">
          <Target className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No campaigns yet.</p>
          <p className="text-gray-600 text-xs mt-1">Click "New Campaign" or use AI Brief to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-white font-medium text-sm">{c.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[c.status] || statusColors.draft}`}>{c.status}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{c.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${c.budget?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.deadline).toLocaleDateString()}</span>
                      <button
                        onClick={() => setApplicantsCampaign(c)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        {c.applicants?.length || 0} applicant{c.applicants?.length !== 1 ? 's' : ''}
                        {c.applicants?.length > 0 && <span className="text-blue-400 ml-1">→ Review</span>}
                      </button>
                      <span className="bg-gray-800 px-2 py-0.5 rounded-full">{c.platform}</span>
                      <span className="bg-gray-800 px-2 py-0.5 rounded-full">{c.category}</span>
                    </div>
                    {c.accepted?.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span className="text-green-400 text-xs">{c.accepted.length} creator{c.accepted.length !== 1 ? 's' : ''} working on this</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id}
                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0">
                    {deleting === c._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showAIBrief && <AIBriefGenerator onUseBrief={handleUseBrief} onClose={() => setShowAIBrief(false)} />}
        {applicantsCampaign && (
          <Applicants campaign={applicantsCampaign} onClose={() => setApplicantsCampaign(null)} />
        )}
      </AnimatePresence>

      <CampaignModal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setPrefillData(null); }} prefillData={prefillData} />
    </div>
  );
}