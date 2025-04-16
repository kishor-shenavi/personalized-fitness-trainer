const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const WorkoutPlan = require('../models/WorkoutPlan');

exports.generateWorkoutPlan = async (req, res) => {
  const { weight, height, goalWeight, fitnessLevel } = req.body;
  const userId = req.user.id;
  //const userId = req.user?.id || "000000000000000000000001"; // 👈 valid ObjectId string


  try {
    // 1. Check for existing valid plan
    //const existingPlan = await this.getValidPlan(userId);
    const existingPlan = await this.getValidPlan(
      userId, weight, height, goalWeight, fitnessLevel
    );
    if (existingPlan) {
      return this.sendPlanResponse(res, existingPlan, true);
    }

    // 2. Generate new plan
    const { bmi, prompt } = this.createPrompt(weight, height, goalWeight, fitnessLevel);
    const planContent = await this.generateWithGemini(prompt);
    const formattedPlan = this.formatPlan(planContent);

    // 3. Save and return
    const newPlan = await this.savePlan(
      userId, weight, height, goalWeight, bmi, fitnessLevel, formattedPlan
    );
    
    return this.sendPlanResponse(res, newPlan, false);

  } catch (err) {
    console.error('Generation failed:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate workout plan',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Helper Methods
// exports.getValidPlan = async (userId) => {
//   return await WorkoutPlan.findOne({
//     userId,
//     createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//   }).sort({ createdAt: -1 });
// };
exports.getValidPlan = async (userId, weight, height, goalWeight, fitnessLevel) => {
  return await WorkoutPlan.findOne({
    userId,
    weight,
    height,
    goalWeight,
    fitnessLevel,
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  }).sort({ createdAt: -1 });
};
exports.createPrompt = (weight, height, goalWeight, fitnessLevel) => {
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

  const prompt = `Create a ${fitnessLevel} 7-day workout plan for:
- Weight: ${weight}kg → Goal: ${goalWeight}kg
- BMI: ${bmi}
Include strength, cardio, rest days, warmups, and cooldowns.
Format with Markdown headers and bullet points.`;
  
  return { bmi, prompt };
};

exports.generateWithGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return (await result.response).text();
};

exports.formatPlan = (planText) => {
  return planText
    .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

exports.savePlan = async (userId, weight, height, goalWeight, bmi, fitnessLevel, plan) => {
  return await WorkoutPlan.create({
    userId,
    weight,
    height,
    goalWeight,
    bmi,
    fitnessLevel,
    plan
  });
};

exports.sendPlanResponse = (res, plan, isCached) => {
  res.json({
    success: true,
    plan: plan.plan,
    isCached,
    generatedAt: plan.createdAt,
    stats: {
      weight: plan.weight,
      goalWeight: plan.goalWeight,
      bmi: plan.bmi
    }
  });
};