const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// GET trust score for any user
router.get('/trust/:userId', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId });
    const completedCampaigns = await Campaign.countDocuments({ accepted: req.params.userId, status: 'completed' });
    const brandCampaigns = await Campaign.countDocuments({ brand: req.params.userId, status: 'completed' });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    // Trust score formula:
    // 60% based on avg rating (out of 5), 40% based on completed campaigns (max 5)
    const campaignCount = Math.max(completedCampaigns, brandCampaigns);
    const trustScore = reviews.length === 0 && campaignCount === 0
      ? 0
      : Math.min(100, Math.round((avgRating / 5) * 60 + Math.min(campaignCount, 5) * 8));

    res.json({
      trustScore,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
      completedCampaigns: campaignCount,
      level: trustScore >= 80 ? 'Elite' : trustScore >= 60 ? 'Trusted' : trustScore >= 40 ? 'Rising' : trustScore > 0 ? 'New' : 'Unrated',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all reviews for a user (their profile reviews)
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name userName userType')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST submit a review after campaign completion
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { campaignId, revieweeId, rating, comment } = req.body;
    if (!campaignId || !revieweeId || !rating) {
      return res.status(400).json({ message: 'campaignId, revieweeId and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Verify the campaign exists and reviewer is part of it
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const reviewer = await User.findById(req.user.id);
    const isBrand = campaign.brand.toString() === req.user.id;
    const isCreator = campaign.accepted.map(id => id.toString()).includes(req.user.id);

    if (!isBrand && !isCreator) {
      return res.status(403).json({ message: 'You are not part of this campaign' });
    }

    const existing = await Review.findOne({ campaign: campaignId, reviewer: req.user.id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this campaign' });

    const review = new Review({
      campaign: campaignId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating: Number(rating),
      comment: comment || '',
      reviewerType: isBrand ? 'brand' : 'influencer',
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;