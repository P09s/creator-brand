const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Campaign = require('../models/Campaign');
const Profile = require('../models/Profile');
const User = require('../models/User');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function callGroq(systemPrompt, userPrompt) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// POST /api/ai/match — Smart creator-brand matching score
router.post('/match', authMiddleware, async (req, res) => {
  try {
    const { campaignId, creatorId } = req.body;
    if (!campaignId || !creatorId) {
      return res.status(400).json({ message: 'campaignId and creatorId required' });
    }

    const campaign = await Campaign.findById(campaignId);
    const creatorUser = await User.findById(creatorId).select('-password');
    const creatorProfile = await Profile.findOne({ user: creatorId });

    if (!campaign || !creatorUser) {
      return res.status(404).json({ message: 'Campaign or creator not found' });
    }

    const systemPrompt = `You are a creator-brand matchmaking expert for LinkFluence.
Analyze compatibility between a creator and a campaign.
Respond ONLY with a valid JSON object — no markdown, no preamble, no backticks.
Format: { "score": <number 0-100>, "reasons": [<string>, <string>, <string>], "recommendation": <string 1-2 sentences> }`;

    const userPrompt = `Campaign:
Title: ${campaign.title}
Category: ${campaign.category}
Platform: ${campaign.platform}
Budget: $${campaign.budget}
Target Audience: ${campaign.targetAudience || 'Not specified'}
Description: ${campaign.description}

Creator:
Name: ${creatorUser.name}
Niche: ${creatorProfile?.niche?.join(', ') || 'Not specified'}
Platforms: ${creatorProfile?.platforms?.join(', ') || 'Not specified'}
Followers: ${creatorProfile?.followers || 0}
Engagement Rate: ${creatorProfile?.engagementRate || 0}%
Bio: ${creatorProfile?.bio || 'Not provided'}

Score this match from 0-100 and explain why.`;

    const raw = await callGroq(systemPrompt, userPrompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err) {
    console.error('AI match error:', err.message);
    res.status(500).json({ message: 'AI matching failed', error: err.message });
  }
});

// POST /api/ai/brief — Generate a campaign brief
router.post('/brief', authMiddleware, async (req, res) => {
  try {
    const { productName, goal, platform, budget, targetAudience } = req.body;

    const systemPrompt = `You are a campaign strategist for LinkFluence, an influencer marketing platform.
Generate a professional campaign brief.
Respond ONLY with a valid JSON object — no markdown, no preamble, no backticks.
Format: {
  "title": <string>,
  "description": <string 2-3 sentences>,
  "requirements": <string>,
  "targetAudience": <string>,
  "contentIdeas": [<string>, <string>, <string>],
  "kpis": [<string>, <string>, <string>]
}`;

    const userPrompt = `Product/Brand: ${productName}
Goal: ${goal}
Platform: ${platform}
Budget: $${budget}
Target Audience: ${targetAudience || 'General audience'}

Generate a complete campaign brief.`;

    const raw = await callGroq(systemPrompt, userPrompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err) {
    console.error('AI brief error:', err.message);
    res.status(500).json({ message: 'Brief generation failed', error: err.message });
  }
});

// POST /api/ai/suggestions — Content ideas for a creator
router.post('/suggestions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ user: userId });
    const { campaignDescription } = req.body;

    const systemPrompt = `You are a content strategist for LinkFluence.
Generate creative content ideas for a creator.
Respond ONLY with a valid JSON array — no markdown, no preamble, no backticks.
Return exactly 4 objects in this format:
[{ "idea": <string>, "format": <string e.g. "Reel", "Carousel", "Story">, "hook": <string opening line> }]`;

    const userPrompt = `Creator niche: ${profile?.niche?.join(', ') || 'General'}
Platforms: ${profile?.platforms?.join(', ') || 'Instagram'}
Campaign context: ${campaignDescription || 'General brand promotion'}

Generate 4 content ideas.`;

    const raw = await callGroq(systemPrompt, userPrompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err) {
    console.error('AI suggestions error:', err.message);
    res.status(500).json({ message: 'Content suggestions failed', error: err.message });
  }
});

// POST /api/ai/analytics-insight
router.post('/analytics-insight', authMiddleware, async (req, res) => {
  try {
    const { followers, engagementRate, campaignsCompleted, totalEarnings, topNiche } = req.body;

    const systemPrompt = `You are an analytics coach for LinkFluence.
Give a personal performance insight to a creator.
Respond ONLY with a valid JSON object — no markdown, no preamble, no backticks.
Format: { "summary": <string 2 sentences>, "strengths": [<string>, <string>], "improvements": [<string>, <string>], "tip": <string 1 actionable sentence> }`;

    const userPrompt = `Creator stats:
Followers: ${followers}
Engagement Rate: ${engagementRate}%
Campaigns Completed: ${campaignsCompleted}
Total Earned: $${totalEarnings}
Top Niche: ${topNiche}

Give a personal performance insight.`;

    const raw = await callGroq(systemPrompt, userPrompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err) {
    console.error('AI analytics error:', err.message);
    res.status(500).json({ message: 'Analytics insight failed', error: err.message });
  }
});

module.exports = router;