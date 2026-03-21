const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  description:     { type: String, required: true },
  brand:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandName:       { type: String, required: true },
  platform:        { type: String, enum: ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'Multiple'], required: true },
  category:        { type: String, required: true },
  budget:          { type: Number, required: true },
  deadline:        { type: Date, required: true },
  status:          { type: String, enum: ['draft', 'active', 'paused', 'completed'], default: 'active' },
  requirements:    { type: String },
  targetAudience:  { type: String },
  applicants:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  accepted:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Cold-start: brands can explicitly invite new creators
  openToNewCreators: { type: Boolean, default: false },
  // Post-campaign metrics submitted by creator (keyed by creator userId)
  postMetrics: [{
    creator:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reach:       { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    likes:       { type: Number, default: 0 },
    comments:    { type: Number, default: 0 },
    saves:       { type: Number, default: 0 },
    shares:      { type: Number, default: 0 },
    screenshotUrl: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);