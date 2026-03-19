const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');
const Campaign = require('../models/Campaign');
const authMiddleware = require('../middlewares/authMiddleware');

// GET all milestones for a campaign
router.get('/campaign/:campaignId', authMiddleware, async (req, res) => {
  try {
    const milestones = await Milestone.find({ campaign: req.params.campaignId }).sort({ order: 1 });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create milestone (brand only, after accepting creator)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { campaignId, creatorId, title, description, dueDate, order } = req.body;
    if (!campaignId || !creatorId || !title || !dueDate) {
      return res.status(400).json({ message: 'campaignId, creatorId, title and dueDate are required' });
    }
    // Verify brand owns this campaign
    const campaign = await Campaign.findOne({ _id: campaignId, brand: req.user.id });
    if (!campaign) return res.status(403).json({ message: 'Unauthorized' });

    const milestone = new Milestone({
      campaign: campaignId,
      creator: creatorId,
      brand: req.user.id,
      title,
      description: description || '',
      dueDate: new Date(dueDate),
      order: order || 0,
    });
    await milestone.save();
    res.status(201).json(milestone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST creator submits a milestone
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.findOne({ _id: req.params.id, creator: req.user.id });
    if (!milestone) return res.status(404).json({ message: 'Milestone not found or unauthorized' });
    if (milestone.status === 'approved') {
      return res.status(400).json({ message: 'Milestone already approved' });
    }
    const { submissionNote, submissionUrl } = req.body;
    milestone.status = 'submitted';
    milestone.submissionNote = submissionNote || '';
    milestone.submissionUrl = submissionUrl || '';
    milestone.rejectionReason = '';
    await milestone.save();
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST brand approves a milestone
router.post('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.findOne({ _id: req.params.id, brand: req.user.id });
    if (!milestone) return res.status(404).json({ message: 'Milestone not found or unauthorized' });
    if (milestone.status !== 'submitted') {
      return res.status(400).json({ message: 'Milestone must be submitted first' });
    }
    milestone.status = 'approved';
    await milestone.save();

    // Check if all milestones for this campaign+creator are approved → mark campaign in_progress or completed
    const allMilestones = await Milestone.find({ campaign: milestone.campaign, creator: milestone.creator });
    const allApproved = allMilestones.every(m => m.status === 'approved');
    if (allApproved && allMilestones.length > 0) {
      await Campaign.findByIdAndUpdate(milestone.campaign, { status: 'completed' });
    }

    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST brand rejects a milestone with reason
router.post('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.findOne({ _id: req.params.id, brand: req.user.id });
    if (!milestone) return res.status(404).json({ message: 'Milestone not found or unauthorized' });
    milestone.status = 'rejected';
    milestone.rejectionReason = req.body.reason || 'Does not meet requirements';
    await milestone.save();
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE milestone (brand only, only if pending)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.findOneAndDelete({ _id: req.params.id, brand: req.user.id, status: 'pending' });
    if (!milestone) return res.status(404).json({ message: 'Not found, unauthorized, or already in progress' });
    res.json({ message: 'Milestone deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;