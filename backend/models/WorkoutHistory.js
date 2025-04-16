const mongoose = require('mongoose');

const workoutHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: false,
  },
  caloriesBurned: {
    type: Number,
    default: 0,
  },
  durationMinutes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema);