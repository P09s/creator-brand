const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  campaign:        { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  creator:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:           { type: String, required: true },
  description:     { type: String, default: '' },
  dueDate:         { type: Date, required: true },
  order:           { type: Number, default: 0 },
  status:          { type: String, enum: ['pending', 'submitted', 'approved', 'rejected'], default: 'pending' },
  submissionNote:  { type: String, default: '' },
  submissionUrl:   { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);