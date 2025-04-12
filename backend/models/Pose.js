const mongoose = require('mongoose');

const poseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['basic', 'intermediate', 'advanced']
  },
  description: {
    type: String,
    required: true
  },
  steps: {
    type: [String],
    required: true
  },
  video: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Pose', poseSchema);