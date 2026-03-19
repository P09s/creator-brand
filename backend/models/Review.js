const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  campaign:     { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  reviewer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:       { type: Number, min: 1, max: 5, required: true },
  comment:      { type: String, default: '' },
  reviewerType: { type: String, enum: ['brand', 'influencer'], required: true },
}, { timestamps: true });

// One review per campaign per reviewer
reviewSchema.index({ campaign: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);