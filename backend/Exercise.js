const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Intermediate', 'Advanced'],
    required: true,
  },
  caloriesPerMinute: {
    type: Number,
    required: true, // Calories burned per minute for this exercise
  },
  description: String,
  videoUrl: { type: String, required: true }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
