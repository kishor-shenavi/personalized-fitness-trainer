const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { protect } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

router.post('/generate-plan', 
  protect,
  [
    check('weight').isNumeric().withMessage('Weight must be a number'),
    check('height').isNumeric().withMessage('Height must be a number'),
    check('goalWeight').isNumeric().withMessage('Goal weight must be a number'),
    check('fitnessLevel').isIn(['Beginner', 'Intermediate', 'Advanced'])
  ],
  workoutController.generateWorkoutPlan
);

module.exports = router;