const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// GET all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single exercise
router.get('/:id', getExercise, (req, res) => {
  res.json(res.exercise);
});

// POST a new exercise
router.post('/', async (req, res) => {
  const exercise = new Exercise({
    name: req.body.name,
    difficulty: req.body.difficulty,
    caloriesPerMinute: req.body.caloriesPerMinute,
    description: req.body.description,
    videoUrl: req.body.videoUrl
  });

  try {
    const newExercise = await exercise.save();
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an exercise
router.patch('/:id', getExercise, async (req, res) => {
  if (req.body.name != null) {
    res.exercise.name = req.body.name;
  }
  if (req.body.difficulty != null) {
    res.exercise.difficulty = req.body.difficulty;
  }
  if (req.body.caloriesPerMinute != null) {
    res.exercise.caloriesPerMinute = req.body.caloriesPerMinute;
  }
  if (req.body.description != null) {
    res.exercise.description = req.body.description;
  }
  if (req.body.videoUrl != null) {
    res.exercise.videoUrl = req.body.videoUrl;
  }

  try {
    const updatedExercise = await res.exercise.save();
    res.json(updatedExercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/difficulty/:level', async (req, res) => {
    try {
      const exercises = await Exercise.find({ difficulty: req.params.level });
      res.json(exercises);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// DELETE an exercise
router.delete('/:id', getExercise, async (req, res) => {
  try {
    await res.exercise.remove();
    res.json({ message: 'Exercise deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get exercise by ID
async function getExercise(req, res, next) {
  let exercise;
  try {
    exercise = await Exercise.findById(req.params.id);
    if (exercise == null) {
      return res.status(404).json({ message: 'Cannot find exercise' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.exercise = exercise;
  next();
}

module.exports = router;