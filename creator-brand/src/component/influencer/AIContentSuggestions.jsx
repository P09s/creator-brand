import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { getContentSuggestions } from '../../services/apiService';

export default function AIContentSuggestions({ campaignDescription = '' }) {
  const [ideas, setIdeas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [context, setContext] = useState(campaignDescription);

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getContentSuggestions(context);
      setIdeas(result);
    } catch {
      setError('Could not generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatColors = ['border-purple-500/30 bg-purple-500/5', 'border-blue-500/30 bg-blue-500/5', 'border-green-500/30 bg-green-500/5', 'border-amber-500/30 bg-amber-500/5'];

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-purple-500/10">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <h3 className="text-white font-medium text-sm">AI Content Ideas</h3>
      </div>

      {!ideas && (
        <div className="space-y-3">
          <textarea
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Paste a campaign description or leave blank to get general ideas based on your niche..."
            rows={3}
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 resize-none"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            {loading ? 'Generating...' : 'Get AI Content Ideas'}
          </button>
        </div>
      )}

      <AnimatePresence>
        {ideas && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {ideas.map((idea, i) => (
              <div key={i} className={`border rounded-xl p-4 ${formatColors[i % 4]}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{idea.format}</span>
                </div>
                <p className="text-white text-sm font-medium mb-1">{idea.idea}</p>
                <p className="text-gray-400 text-xs italic">Hook: "{idea.hook}"</p>
              </div>
            ))}
            <button
              onClick={() => { setIdeas(null); }}
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 text-xs py-2 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Generate new ideas
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}