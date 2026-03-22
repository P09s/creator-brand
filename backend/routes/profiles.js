const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Review = require('../models/Review');
const authMiddleware = require('../middlewares/authMiddleware');

// ── Completion score helper ───────────────────────────────────────────────────
function calcCompletionScore(profile, user, completedCampaigns, totalCampaigns) {
  const isInfluencer = user.userType === 'influencer';
  const steps = [];

  if (isInfluencer) {
    const hasBio      = profile.bio?.trim().length > 10;
    const hasNiche    = profile.niche?.length > 0;
    // Check followers OR subscribers (YouTube) in socialStats
    const ss = profile.socialStats || {};
    const hasSocialHandle = !!(
      ss.instagram?.handle || ss.youtube?.handle ||
      ss.tiktok?.handle    || ss.twitter?.handle ||
      ss.instagram?.followers > 0 || ss.youtube?.subscribers > 0 ||
      ss.tiktok?.followers > 0   || profile.followers > 0
    );
    const hasPortfolio = profile.portfolio?.length > 0;
    // Achievable: just need to APPLY and get accepted once, not COMPLETE
    const hasActiveCampaign = completedCampaigns > 0 || totalCampaigns > 0;

    steps.push({ key: 'bio',      label: 'Add a bio',               done: hasBio,            points: 25 });
    steps.push({ key: 'niche',    label: 'Select your niche',        done: hasNiche,          points: 25 });
    steps.push({ key: 'social',   label: 'Add a social handle',      done: hasSocialHandle,   points: 25 });
    steps.push({ key: 'portfolio',label: 'Add past work',            done: hasPortfolio,      points: 25 });
    // "Complete first campaign" is now a BONUS shown on TrustBadge, not blocking profile score
  } else {
    const hasBio      = profile.bio?.trim().length > 10;
    const hasIndustry = profile.industry?.trim().length > 0;
    const hasWebsite  = profile.website?.trim().length > 0;
    // For brands: count ANY campaign posted (active OR completed), not just completed
    const hasPostedCampaign = totalCampaigns > 0;

    steps.push({ key: 'bio',      label: 'Write brand description', done: hasBio,            points: 25 });
    steps.push({ key: 'industry', label: 'Set your industry',       done: hasIndustry,       points: 25 });
    steps.push({ key: 'website',  label: 'Add website',             done: hasWebsite,        points: 25 });
    steps.push({ key: 'campaign', label: 'Post first campaign',     done: hasPostedCampaign, points: 25 });
  }

  const score = steps.filter(s => s.done).reduce((sum, s) => sum + s.points, 0);
  return { score, steps };
}

// ── GET own profile with completion score ─────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({ user: req.user.id });
      await profile.save();
    }
    const user = await User.findById(req.user.id);
    const completedCampaigns = user.userType === 'influencer'
      ? await Campaign.countDocuments({ accepted: req.user.id, status: 'completed' })
      : await Campaign.countDocuments({ brand: req.user.id, status: 'completed' });
    const totalCampaigns = user.userType === 'influencer'
      ? await Campaign.countDocuments({ accepted: req.user.id })
      : await Campaign.countDocuments({ brand: req.user.id });

    const { score, steps } = calcCompletionScore(profile, user, completedCampaigns, totalCampaigns);
    res.json({ ...profile.toObject(), completionScore: score, completionSteps: steps });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PUT update own profile ────────────────────────────────────────────────────
router.put('/me', authMiddleware, async (req, res) => {
  try {
    // Flatten nested objects to dot notation so partial updates don't wipe siblings
    // e.g. { socialStats: { youtube: {..} } } => { 'socialStats.youtube': {..} }
    function flatten(obj, prefix = '') {
      return Object.keys(obj).reduce((acc, key) => {
        const full = prefix ? `${prefix}.${key}` : key;
        const val  = obj[key];
        if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
          Object.assign(acc, flatten(val, full));
        } else {
          acc[full] = val;
        }
        return acc;
      }, {});
    }
    const flatBody = flatten(req.body);

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: flatBody },
      { new: true, upsert: true }
    );
    const user = await User.findById(req.user.id);
    const completedCampaigns = user.userType === 'influencer'
      ? await Campaign.countDocuments({ accepted: req.user.id, status: 'completed' })
      : await Campaign.countDocuments({ brand: req.user.id, status: 'completed' });
    const totalCampaigns = user.userType === 'influencer'
      ? await Campaign.countDocuments({ accepted: req.user.id })
      : await Campaign.countDocuments({ brand: req.user.id });
    const { score, steps } = calcCompletionScore(profile, user, completedCampaigns, totalCampaigns);
    res.json({ ...profile.toObject(), completionScore: score, completionSteps: steps });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST add portfolio item ───────────────────────────────────────────────────
router.post('/me/portfolio', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $push: { portfolio: req.body } },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── DELETE portfolio item ─────────────────────────────────────────────────────
router.delete('/me/portfolio/:itemId', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { portfolio: { _id: req.params.itemId } } },
      { new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST record a profile view (called when brand views a creator) ────────────
router.post('/view/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.params.userId === req.user.id) return res.json({ ok: true }); // no self-views
    await Profile.findOneAndUpdate(
      { user: req.params.userId },
      { $inc: { profileViews: 1 } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET all influencers with trust + completion ───────────────────────────────
router.get('/influencers', authMiddleware, async (req, res) => {
  try {
    const { niche } = req.query;
    const users = await User.find({ userType: 'influencer' }).select('-password');
    const profiles = await Promise.all(
      users.map(async (u) => {
        const profile = await Profile.findOne({ user: u._id });
        const completedCampaigns = await Campaign.countDocuments({ accepted: u._id, status: 'completed' });
        const reviews = await Review.find({ reviewee: u._id });
        const avgRating = reviews.length
          ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        const trustScore = Math.min(100, Math.round((avgRating / 5) * 60 + Math.min(completedCampaigns, 5) * 8));
        const { score: completionScore } = profile
          ? calcCompletionScore(profile, u, completedCampaigns) : { score: 0 };
        return { user: u, profile: profile || {}, trustScore, completionScore, completedCampaigns };
      })
    );
    const filtered = niche
      ? profiles.filter(p => p.profile?.niche?.includes(niche))
      : profiles;
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET all brands ────────────────────────────────────────────────────────────
router.get('/brands', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ userType: 'brand' }).select('-password');
    const profiles = await Promise.all(
      users.map(async (u) => {
        const profile = await Profile.findOne({ user: u._id });
        const completedCampaigns = await Campaign.countDocuments({ brand: u._id, status: 'completed' });
        const reviews = await Review.find({ reviewee: u._id });
        const avgRating = reviews.length
          ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        const trustScore = Math.min(100, Math.round((avgRating / 5) * 60 + Math.min(completedCampaigns, 5) * 8));
        const { score: completionScore } = profile
          ? calcCompletionScore(profile, u, completedCampaigns) : { score: 0 };
        return { user: u, profile: profile || {}, trustScore, completionScore };
      })
    );
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;