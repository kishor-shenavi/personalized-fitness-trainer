const mongoose = require('mongoose');

const WorkoutPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: String,
  weight: Number,
  height: Number,
  goalWeight: Number,
  bmi: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7 // auto-delete after 7 days
  }
});

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);
