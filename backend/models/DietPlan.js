// models/DietPlan.js
const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  age: Number,
  weight: Number,
  height: Number,
  gender: String,
  activityLevel: String,
  dietPreference: String,
  targetWeight: Number,
  plan: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now } // Removed the expiration
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);