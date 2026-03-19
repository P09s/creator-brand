const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// GET own profile (creates one if doesn't exist)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({ user: req.user.id });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all influencers (for brands to browse)
router.get('/influencers', authMiddleware, async (req, res) => {
  try {
    const { niche, platform, search } = req.query;
    const influencerUsers = await User.find({ userType: 'influencer' }).select('-password');
    const profiles = await Promise.all(
      influencerUsers.map(async (u) => {
        const profile = await Profile.findOne({ user: u._id });
        return { user: u, profile: profile || {} };
      })
    );
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all brands (for influencers to browse)
router.get('/brands', authMiddleware, async (req, res) => {
  try {
    const brandUsers = await User.find({ userType: 'brand' }).select('-password');
    const profiles = await Promise.all(
      brandUsers.map(async (u) => {
        const profile = await Profile.findOne({ user: u._id });
        return { user: u, profile: profile || {} };
      })
    );
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update own profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add portfolio item (influencers)
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

module.exports = router;