const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Intermediate', 'Advanced'],
    required: true,
  },
  caloriesPerMinute: {
    type: Number,
    required: true,
  },
  description: String,
  videoUrl: { 
    type: String, 
    required: true 
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);