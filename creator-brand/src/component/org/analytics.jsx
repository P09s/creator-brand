import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Users, DollarSign, CheckCircle, TrendingUp,
  Calendar, Loader2, BarChart3, Zap
} from 'lucide-react';
import { getMyCampaigns } from '../../services/apiService';
import * as Chart from 'chart.js';
import toast from 'react-hot-toast';

export default function OrgAnalytics() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const budgetChartRef = useRef(null);
  const budgetChartInstance = useRef(null);

  useEffect(() => {
    getMyCampaigns()
      .then(setCampaigns)
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  // Build budget chart once data loads
  useEffect(() => {
    if (loading || campaigns.length === 0 || !budgetChartRef.current) return;

    Chart.Chart.register(...Chart.registerables);
    Chart.Chart.defaults.color = '#6b7280';
    Chart.Chart.defaults.borderColor = '#1f2937';

    if (budgetChartInstance.current) {
      budgetChartInstance.current.destroy();
    }

    const labels = campaigns.slice(0, 6).map(c =>
      c.title.length > 14 ? c.title.slice(0, 14) + '…' : c.title
    );
    const budgets = campaigns.slice(0, 6).map(c => c.budget || 0);
    const colors = campaigns.slice(0, 6).map((_, i) => [
      'rgba(139,92,246,0.7)',
      'rgba(59,130,246,0.7)',
      'rgba(52,211,153,0.7)',
      'rgba(251,191,36,0.7)',
      'rgba(239,68,68,0.7)',
      'rgba(236,72,153,0.7)',
    ][i % 6]);

    budgetChartInstance.current = new Chart.Chart(budgetChartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Budget ($)',
          data: budgets,
          backgroundColor: colors,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `$${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: {
            grid: { color: '#1f2937' },
            ticks: {
              font: { size: 11 },
              callback: v => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`
            }
          }
        }
      }
    });

    return () => { budgetChartInstance.current?.destroy(); };
  }, [campaigns, loading]);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalBudget     = campaigns.reduce((s, c) => s + (c.budget || 0), 0);
  const totalApplicants = campaigns.reduce((s, c) => s + (c.applicants?.length || 0), 0);
  const totalAccepted   = campaigns.reduce((s, c) => s + (c.accepted?.length || 0), 0);
  const completed       = campaigns.filter(c => c.status === 'completed');
  const active          = campaigns.filter(c => c.status === 'active');
  const acceptanceRate  = totalApplicants > 0
    ? Math.round((totalAccepted / totalApplicants) * 100) : 0;

  // Post metrics aggregated across all campaigns
  const allMetrics = campaigns.flatMap(c => c.postMetrics || []);
  const totalReach    = allMetrics.reduce((s, m) => s + (m.reach || 0), 0);
  const totalLikes    = allMetrics.reduce((s, m) => s + (m.likes || 0), 0);
  const totalComments = allMetrics.reduce((s, m) => s + (m.comments || 0), 0);

  const statCards = [
    { label: 'Campaigns posted',    value: campaigns.length,                icon: Target,       color: 'text-blue-400'   },
    { label: 'Total budget',         value: `$${totalBudget.toLocaleString()}`, icon: DollarSign,   color: 'text-green-400'  },
    { label: 'Total applicants',     value: totalApplicants,                icon: Users,        color: 'text-purple-400' },
    { label: 'Creators accepted',    value: totalAccepted,                  icon: CheckCircle,  color: 'text-amber-400'  },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 text-xs mt-1">
          {campaigns.length === 0
            ? 'Post your first campaign to start seeing analytics here'
            : 'Campaign performance based on your real data'}
        </p>
      </div>

      {/* Empty state */}
      {campaigns.length === 0 && (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-16 text-center">
          <BarChart3 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 font-medium mb-2">No data yet</p>
          <p className="text-gray-600 text-sm">Create a campaign and start accepting creators to see your analytics here.</p>
        </div>
      )}

      {campaigns.length > 0 && (
        <>
          {/* Stat cards — all real */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
                <s.icon className={`w-4 h-4 ${s.color} mb-3`} />
                <p className="text-2xl font-semibold text-white">{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Creator-reported post metrics — only shows if creators submitted them */}
          {allMetrics.length > 0 && (
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <h2 className="text-white font-medium text-sm">Creator-reported post performance</h2>
                <span className="text-xs text-gray-600">· submitted by creators after posting</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total reach', value: totalReach >= 1000 ? `${(totalReach/1000).toFixed(1)}K` : totalReach, icon: Users, color: 'text-blue-400' },
                  { label: 'Total likes', value: totalLikes >= 1000 ? `${(totalLikes/1000).toFixed(1)}K` : totalLikes, icon: Zap, color: 'text-amber-400' },
                  { label: 'Total comments', value: totalComments, icon: TrendingUp, color: 'text-green-400' },
                ].map((m, i) => (
                  <div key={i} className="bg-black border border-gray-800 rounded-xl p-4">
                    <m.icon className={`w-4 h-4 ${m.color} mb-2`} />
                    <p className="text-xl font-semibold text-white">{m.value || 0}</p>
                    <p className="text-gray-500 text-xs mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-xs mt-3">
                These are self-reported by creators. More campaigns = more data points.
              </p>
            </div>
          )}

          {/* Budget chart */}
          {campaigns.length > 0 && (
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <DollarSign className="w-4 h-4 text-green-400" />
                <h2 className="text-white font-medium text-sm">Budget per campaign</h2>
              </div>
              <div style={{ height: 200 }}>
                <canvas ref={budgetChartRef} />
              </div>
            </div>
          )}

          {/* Campaign breakdown table */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-gray-800">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-medium text-sm">Campaign breakdown</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {/* Table header */}
              <div className="grid grid-cols-5 px-5 py-2.5 text-xs text-gray-600 uppercase tracking-wider">
                <span className="col-span-2">Campaign</span>
                <span className="text-right">Budget</span>
                <span className="text-right">Applicants</span>
                <span className="text-right">Status</span>
              </div>
              {campaigns.map((c, i) => (
                <motion.div key={c._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-5 px-5 py-4 hover:bg-gray-900/40 transition-colors items-center">
                  <div className="col-span-2 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                      <span>{c.platform}</span>
                      <span>·</span>
                      <span>{c.category}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm text-right">${c.budget?.toLocaleString()}</p>
                  <div className="text-right">
                    <p className="text-white text-sm">{c.applicants?.length || 0}</p>
                    {c.accepted?.length > 0 && (
                      <p className="text-green-400 text-xs">{c.accepted.length} accepted</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      c.status === 'active'    ? 'bg-green-500/10 text-green-400'  :
                      c.status === 'completed' ? 'bg-blue-500/10 text-blue-400'   :
                      c.status === 'paused'    ? 'bg-yellow-500/10 text-yellow-400':
                      'bg-gray-500/10 text-gray-400'
                    }`}>{c.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary row */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-gray-400" />
              <h2 className="text-white font-medium text-sm">Summary</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-black border border-gray-800 rounded-xl p-4">
                <p className="text-2xl font-semibold text-green-400">{active.length}</p>
                <p className="text-gray-500 text-xs mt-1">Active campaigns</p>
              </div>
              <div className="bg-black border border-gray-800 rounded-xl p-4">
                <p className="text-2xl font-semibold text-blue-400">{completed.length}</p>
                <p className="text-gray-500 text-xs mt-1">Completed</p>
              </div>
              <div className="bg-black border border-gray-800 rounded-xl p-4">
                <p className="text-2xl font-semibold text-amber-400">{acceptanceRate}%</p>
                <p className="text-gray-500 text-xs mt-1">Acceptance rate</p>
              </div>
            </div>
            {allMetrics.length === 0 && completed.length > 0 && (
              <p className="text-gray-600 text-xs mt-4 text-center leading-relaxed">
                Ask creators to submit post metrics after campaigns complete — reach, likes, and comments will appear here
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}