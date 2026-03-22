const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio:      { type: String, default: '' },
  avatar:   { type: String, default: '' },
  niche:    { type: [String], default: [] },
  platforms: { type: [String], default: [] },

  // ── Influencer specific ───────────────────────────────────────────────
  followers:       { type: Number, default: 0 },
  engagementRate:  { type: Number, default: 0 },

  // Self-reported social stats per platform
  socialStats: {
    instagram: {
      handle:        { type: String,  default: '' },
      followers:     { type: Number,  default: 0  },
      engagementRate:{ type: Number,  default: 0  },
      verified:      { type: Boolean, default: false },
    },
    youtube: {
      handle:         { type: String,  default: '' },
      subscribers:    { type: Number,  default: 0  },
      avgViews:       { type: Number,  default: 0  }, // avg views per video
      verified:       { type: Boolean, default: false },
    },
    tiktok: {
      handle:        { type: String,  default: '' },
      followers:     { type: Number,  default: 0  },
      avgViews:      { type: Number,  default: 0  },
      verified:      { type: Boolean, default: false },
    },
    twitter: {
      handle:        { type: String,  default: '' },
      followers:     { type: Number,  default: 0  },
      verified:      { type: Boolean, default: false },
    },
  },

  // Content format the creator specialises in
  contentType: { type: String, default: '' }, // 'short-form' | 'long-form' | 'mixed' | 'stories-live'

  portfolio: [{
    brandName:     String,
    campaignTitle: String,
    platform:      String,
    results:       String,
    campaignDate:  Date,
    link:          String,
  }],

  // ── Brand specific ────────────────────────────────────────────────────
  // Social profile links
  socialLinks: {
    instagram: { type: String, default: '' },
    youtube:   { type: String, default: '' },
    tiktok:    { type: String, default: '' },
    twitter:   { type: String, default: '' },
    website:   { type: String, default: '' },
  },

  website:          { type: String, default: '' },
  industry:         { type: String, default: '' },
  campaignTypes:    { type: [String], default: [] },
  campaignsLaunched: { type: Number, default: 0 },

  // ── Brand extended fields ─────────────────────────────────────────────
  budgetRange:      { type: String, default: '' }, // '1k-5k' | '5k-25k' | '25k-1l' | '1l+'
  preferredCreatorSize: { type: String, default: '' }, // 'nano' | 'micro' | 'macro' | 'any'
  companySize:      { type: String, default: '' }, // 'solo' | 'startup' | 'smb' | 'enterprise'
  linkedinUrl:      { type: String, default: '' },
  instagramHandle:  { type: String, default: '' },

  // ── Shared ────────────────────────────────────────────────────────────
  totalEarnings:  { type: Number, default: 0 },
  totalSpent:     { type: Number, default: 0 },
  isPro:          { type: Boolean, default: false },
  profileViews:   { type: Number, default: 0 },

}, { timestamps: true });

// ── Virtual: profile completion score ────────────────────────────────────
profileSchema.virtual('completionScore').get(function() {
  // This is recalculated on the route with userType context
  return 0;
});

module.exports = mongoose.model('Profile', profileSchema);