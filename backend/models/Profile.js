const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  niche: { type: [String], default: [] },
  platforms: { type: [String], default: [] },
  // Influencer specific
  followers: { type: Number, default: 0 },
  engagementRate: { type: Number, default: 0 },
  portfolio: [{
    brandName: String,
    campaignTitle: String,
    platform: String,
    results: String,
    date: Date,
  }],
  // Brand specific
  website: { type: String, default: '' },
  industry: { type: String, default: '' },
  campaignsLaunched: { type: Number, default: 0 },
  // Shared
  totalEarnings: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  isPro: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);