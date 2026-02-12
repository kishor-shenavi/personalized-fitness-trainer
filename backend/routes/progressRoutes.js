const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Start new session
router.post('/sessions', async (req, res) => {
  try {
    const session = new Progress({ 
      startTime: new Date(),
      status: 'active'
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ 
      error: 'Failed to start session',
      details: err.message 
    });
  }
});

// Add exercise to session
router.post('/sessions/:id/exercises', async (req, res) => {
  try {
    const session = await Progress.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const newExercise = {
      name: req.body.name,
      caloriesPerMinute: req.body.caloriesPerMinute,
      duration: req.body.duration || 0, // Start with 0 duration
      videoWatched: req.body.videoWatched || false,
      exerciseId: req.body.exerciseId // Reference to original exercise
    };

    session.exercises.push(newExercise);
    await session.save();

    // Return the added exercise with its generated ID
    const addedExercise = session.exercises[session.exercises.length - 1];
    res.status(201).json(addedExercise);
  } catch (err) {
    res.status(400).json({ 
      error: 'Failed to add exercise',
      details: err.message 
    });
  }
});
router.delete('/sessions/:id', async (req, res) => {
  try {
    const session = await Progress.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update exercise in session (duration or video watched)
router.patch('/sessions/:sessionId/exercises/:exerciseId', async (req, res) => {
  try {
    const session = await Progress.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const exercise = session.exercises.id(req.params.exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found in session' });
    }

    // Update fields if they exist in request
    if (req.body.duration !== undefined) {
      exercise.duration = req.body.duration;
    }
    if (req.body.videoWatched !== undefined) {
      exercise.videoWatched = req.body.videoWatched;
    }

    await session.save();
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ 
      error: 'Failed to update exercise',
      details: err.message 
    });
  }
});

// End session
router.patch('/sessions/:id/end', async (req, res) => {
  try {
    const session = await Progress.findByIdAndUpdate(
      req.params.id,
      { 
        endTime: new Date(), 
        status: 'completed' 
      },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (err) {
    res.status(400).json({ 
      error: 'Failed to end session',
      details: err.message 
    });
  }
});

// Get single session
router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await Progress.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch session',
      details: err.message 
    });
  }
});

// Get enhanced session data
router.get('/sessions/enhanced', async (req, res) => {
  try {
    const sessions = await Progress.aggregate([
      { $match: { status: 'completed' } },
      { $sort: { startTime: -1 } },
      { $limit: 10 },
      { $project: {
        _id: 1,
        startTime: 1,
        endTime: 1,
        durationMinutes: { 
          $divide: [
            { $subtract: ['$endTime', '$startTime'] },
            60000 // Convert ms to minutes
          ]
        },
        exercises: 1,
        videoWatchCount: {
          $sum: {
            $map: {
              input: '$exercises',
              as: 'ex',
              in: { $cond: [{ $eq: ['$$ex.videoWatched', true] }, 1, 0] }
            }
          }
        },
        totalCalories: {
          $sum: {
            $map: {
              input: '$exercises',
              as: 'ex',
              in: { $multiply: ['$$ex.caloriesPerMinute', '$$ex.duration'] }
            }
          }
        }
      }}
    ]);
    
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch enhanced sessions',
      details: err.message 
    });
  }
});

// Get session history
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Progress.find()
      .sort({ startTime: -1 })
      .limit(10);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch sessions',
      details: err.message 
    });
  }
});

module.exports = router;