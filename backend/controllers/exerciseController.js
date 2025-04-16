const Exercise = require('../models/Exercise');
const { generateWorkoutPlan } = require('../services/geminiService');

// Get exercises by difficulty
exports.getExercisesByDifficulty = async (req, res) => {
  try {
    const exercises = await Exercise.find({ 
      difficulty: req.params.difficulty 
    });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate workout plan
exports.generatePlan = async (req, res) => {
  try {
    const { weight, height, goalWeight, fitnessLevel } = req.body;
    const userId = req.user.id;

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Get exercises from database
    const exercises = await Exercise.find({ difficulty: fitnessLevel });

    // Generate plan using Gemini
    const plan = await generateWorkoutPlan({
      weight,
      height,
      goalWeight,
      bmi,
      exercises,
      fitnessLevel
    });

    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};