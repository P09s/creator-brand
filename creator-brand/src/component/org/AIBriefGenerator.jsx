import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Copy, Check, Loader2, Wand2 } from 'lucide-react';
import { generateCampaignBrief } from '../../services/apiService';

const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'Multiple'];

export default function AIBriefGenerator({ onUseBrief, onClose }) {
  const [step, setStep] = useState('form'); // form | loading | result
  const [copied, setCopied] = useState(false);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    productName: '',
    goal: '',
    platform: 'Instagram',
    budget: '',
    targetAudience: '',
  });

  const handleGenerate = async () => {
    if (!form.productName || !form.goal || !form.budget) {
      setError('Please fill in product name, goal, and budget.');
      return;
    }
    setError('');
    setStep('loading');
    try {
      const result = await generateCampaignBrief(form);
      setBrief(result);
      setStep('result');
    } catch (err) {
      setError('AI generation failed. Please try again.');
      setStep('form');
    }
  };

  const handleCopy = () => {
    const text = `${brief.title}\n\n${brief.description}\n\nRequirements:\n${brief.requirements}\n\nContent Ideas:\n${brief.contentIdeas.map(i => `• ${i}`).join('\n')}\n\nKPIs:\n${brief.kpis.map(k => `• ${k}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">AI Campaign Brief</h2>
              <p className="text-gray-400 text-xs">Generate a complete brief in seconds</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* FORM */}
            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Product / Brand Name *</label>
                    <input
                      value={form.productName}
                      onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
                      placeholder="e.g. FitTrack Pro"
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Campaign Goal *</label>
                    <input
                      value={form.goal}
                      onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                      placeholder="e.g. Drive 500 app downloads in 30 days"
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Platform</label>
                    <select
                      value={form.platform}
                      onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Budget ($) *</label>
                    <input
                      type="number"
                      value={form.budget}
                      onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                      placeholder="e.g. 2500"
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Target Audience</label>
                    <input
                      value={form.targetAudience}
                      onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                      placeholder="e.g. Fitness enthusiasts aged 18-35"
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  onClick={handleGenerate}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate Brief with AI
                </button>
              </motion.div>
            )}

            {/* LOADING */}
            {step === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                <p className="text-gray-400 text-sm">AI is crafting your brief...</p>
              </motion.div>
            )}

            {/* RESULT */}
            {step === 'result' && brief && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <h3 className="text-white font-semibold text-lg mb-1">{brief.title}</h3>
                  <p className="text-gray-300 text-sm">{brief.description}</p>
                </div>

                <div className="bg-black border border-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Requirements</p>
                  <p className="text-gray-300 text-sm">{brief.requirements}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Content Ideas</p>
                    <ul className="space-y-2">
                      {brief.contentIdeas?.map((idea, i) => (
                        <li key={i} className="text-gray-300 text-sm flex gap-2">
                          <span className="text-purple-400 mt-0.5">•</span>{idea}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-black border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">KPIs</p>
                    <ul className="space-y-2">
                      {brief.kpis?.map((kpi, i) => (
                        <li key={i} className="text-gray-300 text-sm flex gap-2">
                          <span className="text-green-400 mt-0.5">•</span>{kpi}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Brief'}
                  </button>
                  <button
                    onClick={() => onUseBrief && onUseBrief(brief)}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Use This Brief
                  </button>
                </div>

                <button onClick={() => setStep('form')} className="w-full text-gray-500 hover:text-gray-300 text-sm py-2 transition-colors">
                  ← Generate another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}