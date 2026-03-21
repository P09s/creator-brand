const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Review = require('../models/Review');
const authMiddleware = require('../middlewares/authMiddleware');

// GET all active campaigns (influencers browsing)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { platform, category, search } = req.query;
    let query = { status: 'active' };
    if (platform) query.platform = platform;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { brandName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET campaigns created by the brand
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ brand: req.user.id }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET campaigns an influencer applied to
router.get('/applied', authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ applicants: req.user.id }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET campaigns where influencer has been ACCEPTED — their real active work
router.get('/accepted-campaigns', authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ accepted: req.user.id }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET applicants for a campaign with full profile + trust score (brand only)
router.get('/:id/applicants', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, brand: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found or unauthorized' });

    const applicants = await Promise.all(
      campaign.applicants.map(async (userId) => {
        const user = await User.findById(userId).select('-password');
        const profile = await Profile.findOne({ user: userId });
        const reviews = await Review.find({ reviewee: userId });
        const avgRating = reviews.length
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        const completedCampaigns = await Campaign.countDocuments({ accepted: userId, status: 'completed' });
        const trustScore = Math.min(100, Math.round((avgRating / 5) * 60 + Math.min(completedCampaigns, 5) * 8));
        const isAccepted = campaign.accepted.map(id => id.toString()).includes(userId.toString());
        return { user, profile: profile || {}, trustScore, reviewCount: reviews.length, avgRating: Math.round(avgRating * 10) / 10, isAccepted };
      })
    );
    res.json(applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST accept a creator
router.post('/:id/accept/:creatorId', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, brand: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Not found or unauthorized' });
    if (!campaign.applicants.map(id => id.toString()).includes(req.params.creatorId)) {
      return res.status(400).json({ message: 'Creator has not applied' });
    }
    if (!campaign.accepted.map(id => id.toString()).includes(req.params.creatorId)) {
      campaign.accepted.push(req.params.creatorId);
      await campaign.save();
    }
    res.json({ message: 'Creator accepted', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST reject a creator
router.post('/:id/reject/:creatorId', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, brand: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Not found or unauthorized' });
    campaign.applicants = campaign.applicants.filter(id => id.toString() !== req.params.creatorId);
    campaign.accepted = campaign.accepted.filter(id => id.toString() !== req.params.creatorId);
    await campaign.save();
    res.json({ message: 'Creator rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create campaign
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, platform, category, budget, deadline, requirements, targetAudience, brandName } = req.body;
    if (!title || !description || !platform || !category || !budget || !deadline) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    const campaign = new Campaign({
      title, description, platform, category,
      budget: Number(budget), deadline: new Date(deadline),
      requirements, targetAudience,
      brand: req.user.id, brandName: brandName || req.user.name,
      openToNewCreators: req.body.openToNewCreators === true || req.body.openToNewCreators === 'true',
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST apply to a campaign
router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    if (campaign.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already applied' });
    }
    campaign.applicants.push(req.user.id);
    await campaign.save();
    res.json({ message: 'Applied successfully', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH update campaign
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, brand: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Not found or unauthorized' });
    Object.assign(campaign, req.body);
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE campaign
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, brand: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// POST creator submits post-campaign metrics
router.post('/:id/metrics', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    if (!campaign.accepted.map(id => id.toString()).includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not an accepted creator on this campaign' });
    }
    // Remove existing metrics from this creator then push new
    campaign.postMetrics = campaign.postMetrics.filter(
      m => m.creator.toString() !== req.user.id
    );
    campaign.postMetrics.push({
      creator: req.user.id,
      reach:       Number(req.body.reach || 0),
      impressions: Number(req.body.impressions || 0),
      likes:       Number(req.body.likes || 0),
      comments:    Number(req.body.comments || 0),
      saves:       Number(req.body.saves || 0),
      shares:      Number(req.body.shares || 0),
      screenshotUrl: req.body.screenshotUrl || '',
    });
    await campaign.save();
    res.json({ message: 'Metrics saved', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;