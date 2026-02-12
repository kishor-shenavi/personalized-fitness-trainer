const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: Date,
  exercises: [{
    name: {
      type: String,
      required: true
    },
    caloriesPerMinute: {
      type: Number,
      required: true,
      min: 0
    },
    duration: { 
      type: Number, 
      default: 0,
      min: 0
    },
    videoWatched: { 
      type: Boolean, 
      default: false 
    },
    exerciseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Exercise',
      required: true
    }
  }],
  status: { 
    type: String, 
    enum: ['active', 'completed'], 
    default: 'active' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, // Ensure virtuals are included when converted to JSON
  toObject: { virtuals: true } // Ensure virtuals are included when converted to objects
});

// Calculate total calories burned (virtual property)
progressSchema.virtual('totalCalories').get(function() {
  return this.exercises.reduce((total, ex) => {
    return total + (ex.caloriesPerMinute * ex.duration);
  }, 0);
});

// Calculate total duration in minutes (virtual property)
progressSchema.virtual('totalDuration').get(function() {
  if (this.endTime && this.startTime) {
    return (this.endTime - this.startTime) / (1000 * 60); // Convert ms to minutes
  }
  return 0;
});

// Indexes for optimized queries
progressSchema.index({ status: 1, startTime: -1 }); // For enhanced sessions query
progressSchema.index({ 'exercises._id': 1 }); // For exercise lookups
progressSchema.index({ 'exercises.exerciseId': 1 }); // For exercise reference lookups

module.exports = mongoose.model('Progress', progressSchema);