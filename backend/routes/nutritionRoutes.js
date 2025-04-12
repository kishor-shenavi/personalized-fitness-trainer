// routes/nutritionRoutes.js
const express = require("express");
const DietPlan = require("../models/DietPlan");
const { generateDietPlan } = require("../utils/geminiClient");

const router = express.Router();

router.post("/generate-plan", async (req, res) => {
  try {
    const { userId, age, weight, height, gender, activityLevel, dietPreference, targetWeight } = req.body;

    // Check if a recent plan exists (last 7 days)
    // const existingPlan = await DietPlan.findOne({ 
    //   userId, 
    //   createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    // });

    // if (existingPlan) {
    //   console.log("✅ Serving Cached Diet Plan");
    //   return res.json({ success: true, dietPlan: existingPlan.plan });
    // }
    
    // Generate new plan
    const dietPlan = await generateDietPlan(req.body);
    
    if (!dietPlan) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to generate diet plan." 
      });
    }

    // Save new plan
    await DietPlan.create({ 
      userId, 
      plan: dietPlan,
      age, 
      weight, 
      height, 
      gender, 
      activityLevel, 
      dietPreference, 
      targetWeight 
    });

    res.json({ success: true, dietPlan });

  } catch (error) {
    console.error("❌ Error generating diet plan:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate diet plan.",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;