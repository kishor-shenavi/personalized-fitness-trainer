const WorkoutHistory = require('../models/WorkoutHistory');

exports.getProgress = async (req, res) => {
  try {
    const history = await WorkoutHistory.find({ userId: req.params.userId })
      .populate('exerciseId', 'name caloriesPerMinute');

    const totalCalories = history.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
    const totalDuration = history.reduce((sum, entry) => sum + entry.durationMinutes, 0);

    res.json({
      totalCaloriesBurned: totalCalories,
      totalDurationMinutes: totalDuration,
      history: history.map(entry => ({
        exerciseName: entry.exerciseId.name,
        caloriesBurned: entry.caloriesBurned,
        duration: entry.durationMinutes,
        date: entry.startTime
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error });
  }
};