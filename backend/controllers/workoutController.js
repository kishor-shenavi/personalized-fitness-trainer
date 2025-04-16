const crypto = require('crypto'); // Add at top
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const WorkoutPlan = require('../models/WorkoutPlan');

// ====================
// 1. MAIN CONTROLLER
// ====================

// ====================
exports.generateWorkoutPlan = async (req, res) => {
  const { weight, height, goalWeight, fitnessLevel } = req.body;
  const userId = req.user?.id || "000000000000000000000001";

  try {
    // Generate unique cache key based on all input parameters
    const inputHash = this.generateInputHash({ weight, height, goalWeight, fitnessLevel });

    // Check for existing cached plan first
    const cachedPlan = await this.getCachedPlan(userId, inputHash);
    if (cachedPlan) {
      return this.sendPlanResponse(res, cachedPlan, true);
    }

    // Generate new plan if no cached version exists
    const { bmi, prompt } = this.createPrompt(weight, height, goalWeight, fitnessLevel);
    const planContent = await this.generateWithGemini(prompt);
    const structuredPlan = this.parseWorkoutPlan(planContent);

    // Save the new plan with cache key
    const newPlan = await this.savePlan(
      userId, 
      weight, 
      height, 
      goalWeight, 
      bmi, 
      fitnessLevel, 
      structuredPlan,
      inputHash
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

// ====================
// 2. NEW CACHE HELPERS
// ====================
exports.generateInputHash = (params) => {
  return crypto.createHash('sha256')
    .update(JSON.stringify(params))
    .digest('hex');
};
exports.getCachedPlan = async (userId, inputHash) => {
  return await WorkoutPlan.findOne({
    userId,
    inputHash,
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  }).sort({ createdAt: -1 }); // Get most recent
};
// ====================
// 2. CORE HELPERS
// ====================
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

  const prompt = `Create a detailed ${fitnessLevel} 7-day workout plan in STRICT JSON format for:
- Current Weight: ${weight}kg
- Target Weight: ${goalWeight}kg
- Height: ${height}cm
- BMI: ${bmi}
- Fitness Level: ${fitnessLevel}

Requirements:
1. Different exercises for each day
2. Include strength, cardio, and flexibility
3. Specify exact sets/reps/rest periods
4. Warm-up and cool-down for each day
5. Muscle group focus for each day

Required JSON Structure:
{
  "overview": "string",
  "days": [
    {
      "dayNumber": 1-7,
      "title": "string (e.g., 'Upper Body')",
      "focus": "string (e.g., 'Chest, Triceps')",
      "sections": [
        {
          "name": "Warm-up/Workout/Cool-down",
          "duration": "string",
          "exercises": [
            {
              "name": "string",
              "description": "string",
              "sets": {
                "count": number,
                "minReps": number,
                "maxReps": number,
                "rest": "string"
              }
            }
          ]
        }
      ]
    }
  ],
  "notes": "string"
}

IMPORTANT:
- Return ONLY valid JSON
- No markdown or extra text
- Must parse with JSON.parse()`;

  return { bmi, prompt };
};

exports.generateWithGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return (await result.response).text();
};

// ====================
// 3. PARSING LAYER
// ====================
exports.parseWorkoutPlan = (planText) => {
  try {
    // Extract JSON from response
    const jsonStart = planText.indexOf('{');
    const jsonEnd = planText.lastIndexOf('}') + 1;
    let jsonString = planText.slice(jsonStart, jsonEnd)
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix keys
      .replace(/'/g, '"'); // Standardize quotes

    const plan = JSON.parse(jsonString);
    
    // Validate and enhance structure
    if (!plan.days || !Array.isArray(plan.days)) {
      throw new Error('Invalid days array');
    }

    plan.days.forEach(day => {
      if (!day.sections) {
        day.sections = this.createDefaultSections();
      }
      day.sections.forEach(section => {
        section.exercises = section.exercises || [];
      });
    });

    return plan;
  } catch (err) {
    console.error('Error parsing plan:', err);
    return this.createDefaultPlan();
  }
};

exports.createDefaultPlan = () => {
  const days = [];
  const dayTypes = [
    { title: "Upper Body", focus: "Chest, Shoulders, Triceps" },
    { title: "Lower Body", focus: "Quads, Hamstrings, Glutes" },
    { title: "Active Recovery", focus: "Mobility & Cardio" },
    { title: "Push Day", focus: "Chest, Triceps" },
    { title: "Pull Day", focus: "Back, Biceps" },
    { title: "Leg Day", focus: "Full Lower Body" },
    { title: "Full Body", focus: "Compound Movements" }
  ];

  dayTypes.forEach((type, i) => {
    days.push({
      dayNumber: i + 1,
      title: type.title,
      focus: type.focus,
      sections: this.createDefaultSections(type.title)
    });
  });

  return {
    overview: "7-day customized workout plan",
    days,
    notes: "Progress by increasing weight 5-10% weekly"
  };
};

exports.createDefaultSections = (dayType) => {
  const isRecovery = dayType.includes("Recovery");
  
  return [
    {
      name: "Warm-up",
      duration: "10-15 minutes",
      exercises: [
        {
          name: "Dynamic Movements",
          description: "Prepare muscles for workout",
          sets: { count: 1, duration: "5-10 minutes" }
        }
      ]
    },
    {
      name: "Workout",
      duration: isRecovery ? "30 minutes" : "45-60 minutes",
      exercises: isRecovery ? [
        {
          name: "Yoga Flow",
          description: "Focus on mobility",
          sets: { count: 1, duration: "20 minutes" }
        }
      ] : [
        {
          name: dayType.includes("Upper") ? "Push-ups" : "Squats",
          description: "Focus on proper form",
          sets: { count: 3, minReps: 10, maxReps: 15, rest: "60s" }
        }
      ]
    },
    {
      name: "Cool-down",
      duration: "10 minutes",
      exercises: [
        {
          name: "Static Stretching",
          description: "Hold each stretch 30 seconds",
          sets: { count: 1, duration: "per muscle group" }
        }
      ]
    }
  ];
};

// ====================
// 4. UTILITIES
// ====================
//3. UPDATED SAVE PLAN
// ====================
exports.savePlan = async (userId, weight, height, goalWeight, bmi, fitnessLevel, plan, inputHash) => {
  return await WorkoutPlan.create({
    userId,
    weight,
    height,
    goalWeight,
    bmi,
    fitnessLevel, // Store this now
    plan: JSON.stringify(plan),
    inputHash // Store the cache key
  });
};

exports.sendPlanResponse = (res, plan, isCached) => {
  try {
    const planData = typeof plan.plan === 'string' ? 
      JSON.parse(plan.plan) : 
      plan.plan;

    res.json({
      success: true,
      plan: planData,
      isCached,
      generatedAt: plan.createdAt,
      stats: {
        weight: plan.weight,
        goalWeight: plan.goalWeight,
        bmi: plan.bmi
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error formatting response'
    });
  }
};





















































































































// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const WorkoutPlan = require('../models/WorkoutPlan');

// exports.generateWorkoutPlan = async (req, res) => {
//   const { weight, height, goalWeight, fitnessLevel } = req.body;
//   const userId = req.user.id;
//   //const userId = req.user?.id || "000000000000000000000001"; // 👈 valid ObjectId string


//   try {
//     // 1. Check for existing valid plan
//     //const existingPlan = await this.getValidPlan(userId);
//     const existingPlan = await this.getValidPlan(
//       userId, weight, height, goalWeight, fitnessLevel
//     );
//     if (existingPlan) {
//       return this.sendPlanResponse(res, existingPlan, true);
//     }

//     // 2. Generate new plan
//     const { bmi, prompt } = this.createPrompt(weight, height, goalWeight, fitnessLevel);
//     const planContent = await this.generateWithGemini(prompt);
//     const formattedPlan = this.formatPlan(planContent);

//     // 3. Save and return
//     const newPlan = await this.savePlan(
//       userId, weight, height, goalWeight, bmi, fitnessLevel, formattedPlan
//     );
    
//     return this.sendPlanResponse(res, newPlan, false);

//   } catch (err) {
//     console.error('Generation failed:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate workout plan',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// // Helper Methods
// // exports.getValidPlan = async (userId) => {
// //   return await WorkoutPlan.findOne({
// //     userId,
// //     createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
// //   }).sort({ createdAt: -1 });
// // };
// exports.getValidPlan = async (userId, weight, height, goalWeight, fitnessLevel) => {
//   return await WorkoutPlan.findOne({
//     userId,
//     weight,
//     height,
//     goalWeight,
//     fitnessLevel,
//     createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//   }).sort({ createdAt: -1 });
// };
// exports.createPrompt = (weight, height, goalWeight, fitnessLevel) => {
//   const heightInMeters = height / 100;
//   const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

//   const prompt = `Create a ${fitnessLevel} 7-day workout plan for:
// - Weight: ${weight}kg → Goal: ${goalWeight}kg
// - BMI: ${bmi}
// Include strength, cardio, rest days, warmups, and cooldowns.
// Format with Markdown headers and bullet points.`;
  
//   return { bmi, prompt };
// };

// exports.generateWithGemini = async (prompt) => {
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//   const result = await model.generateContent(prompt);
//   return (await result.response).text();
// };

// exports.formatPlan = (planText) => {
//   return planText
//     .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
//     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em>$1</em>');
// };

// exports.savePlan = async (userId, weight, height, goalWeight, bmi, fitnessLevel, plan) => {
//   return await WorkoutPlan.create({
//     userId,
//     weight,
//     height,
//     goalWeight,
//     bmi,
//     fitnessLevel,
//     plan
//   });
// };

// exports.sendPlanResponse = (res, plan, isCached) => {
//   res.json({
//     success: true,
//     plan: plan.plan,
//     isCached,
//     generatedAt: plan.createdAt,
//     stats: {
//       weight: plan.weight,
//       goalWeight: plan.goalWeight,
//       bmi: plan.bmi
//     }
//   });


// };




//best  

// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const WorkoutPlan = require('../models/WorkoutPlan');

// exports.generateWorkoutPlan = async (req, res) => {
//   const { weight, height, goalWeight, fitnessLevel } = req.body;
//   const userId = req.user?.id || "000000000000000000000001";

//   try {
//     // 1. Check for existing valid plan
//     const existingPlan = await this.getValidPlan(
//       userId, weight, height, goalWeight, fitnessLevel
//     );
//     if (existingPlan) {
//       return this.sendPlanResponse(res, existingPlan, true);
//     }

//     // 2. Generate new plan
//     const { bmi, prompt } = this.createPrompt(weight, height, goalWeight, fitnessLevel);
//     const planContent = await this.generateWithGemini(prompt);
    
//     // 3. Parse and structure the response
//     const structuredPlan = this.parseWorkoutPlan(planContent);

//     // 4. Save and return
//     const newPlan = await this.savePlan(
//       userId, weight, height, goalWeight, bmi, fitnessLevel, structuredPlan
//     );
    
//     return this.sendPlanResponse(res, newPlan, false);

//   } catch (err) {
//     console.error('Generation failed:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate workout plan',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// // Helper Methods
// exports.getValidPlan = async (userId, weight, height, goalWeight, fitnessLevel) => {
//   return await WorkoutPlan.findOne({
//     userId,
//     weight,
//     height,
//     goalWeight,
//     fitnessLevel,
//     createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//   }).sort({ createdAt: -1 });
// };

// exports.createPrompt = (weight, height, goalWeight, fitnessLevel) => {
//   const heightInMeters = height / 100;
//   const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

//   const prompt = `Create a detailed ${fitnessLevel} 7-day workout plan in STRICT JSON format for:
// - Current Weight: ${weight}kg
// - Target Weight: ${goalWeight}kg
// - Height: ${height}cm
// - BMI: ${bmi}
// - Fitness Level: ${fitnessLevel}

// Requirements:
// 1. Include strength training, cardio, and flexibility
// 2. Vary muscle groups across days
// 3. Specify exact exercises with sets/reps
// 4. Include warm-up and cool-down for each day
// 5. Add progression recommendations

// Required JSON Structure:
// {
//   "overview": "string",
//   "days": [
//     {
//       "dayNumber": 1-7,
//       "title": "string (e.g., 'Upper Body & Core')",
//       "focus": "string (e.g., 'Chest, Triceps, Abs')",
//       "sections": [
//         {
//           "name": "Warm-up/Workout/Cool-down",
//           "duration": "string (e.g., '10-15 minutes')",
//           "exercises": [
//             {
//               "name": "string",
//               "description": "string",
//               "sets": {
//                 "count": number,
//                 "minReps": number,
//                 "maxReps": number,
//                 "rest": "string (e.g., '60s between sets')"
//               }
//             }
//           ]
//         }
//       ]
//     }
//   ],
//   "notes": "string (include progression tips)"
// }

// IMPORTANT:
// - Return ONLY valid JSON with no additional text
// - All fields must be included
// - Must parse with JSON.parse()`;

//   return { bmi, prompt };
// };

// exports.generateWithGemini = async (prompt) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (err) {
//     console.error('Gemini API error:', err);
//     throw new Error('Failed to generate content with Gemini');
//   }
// };

// exports.parseWorkoutPlan = (planText) => {
//   try {
//     // Clean the response
//     const jsonStart = planText.indexOf('{');
//     const jsonEnd = planText.lastIndexOf('}') + 1;
//     let jsonString = planText.slice(jsonStart, jsonEnd)
//       .replace(/\/\/.*$/gm, '') // Remove comments
//       .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
//       .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'); // Fix keys

//     // Handle common JSON issues
//     jsonString = jsonString
//       .replace(/'/g, '"') // Replace single quotes
//       .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas

//     const plan = JSON.parse(jsonString);
    
//     // Validate structure
//     if (!plan.days || !Array.isArray(plan.days) || plan.days.length !== 7) {
//       throw new Error('Invalid day count in response');
//     }

//     // Ensure all days have complete sections
//     plan.days.forEach(day => {
//       if (!day.sections || day.sections.length === 0) {
//         day.sections = this.createDefaultSections();
//       } else {
//         // Ensure each section has exercises
//         day.sections.forEach(section => {
//           if (!section.exercises || section.exercises.length === 0) {
//             section.exercises = this.createDefaultExercises(section.name);
//           }
//         });
//       }
//     });

//     return plan;
//   } catch (err) {
//     console.error('Error parsing workout plan:', err);
//     return this.createDefaultPlan();
//   }
// };

// exports.createDefaultPlan = () => {
//   const days = [];
//   const dayTypes = [
//     { title: "Upper Body Strength", focus: "Chest, Shoulders, Triceps" },
//     { title: "Lower Body Power", focus: "Quads, Hamstrings, Glutes" },
//     { title: "Active Recovery", focus: "Mobility & Light Cardio" },
//     { title: "Push Day", focus: "Chest, Triceps, Shoulders" },
//     { title: "Pull Day", focus: "Back, Biceps" },
//     { title: "Leg Day", focus: "Full Lower Body" },
//     { title: "Full Body Circuit", focus: "Compound Movements" }
//   ];

//   for (let i = 0; i < 7; i++) {
//     days.push({
//       dayNumber: i + 1,
//       title: dayTypes[i].title,
//       focus: dayTypes[i].focus,
//       sections: this.createDefaultSections()
//     });
//   }

//   return {
//     overview: "7-day customized workout plan for your fitness goals",
//     days,
//     notes: "Progressively increase weights by 5-10% each week. Maintain proper form."
//   };
// };

// exports.createDefaultSections = () => {
//   return [
//     {
//       name: "Warm-up",
//       duration: "10-15 minutes",
//       exercises: [
//         {
//           name: "Dynamic Stretching",
//           description: "Arm circles, leg swings, torso twists",
//           sets: { count: 1, minReps: 10, maxReps: 12, rest: "30s between exercises" }
//         },
//         {
//           name: "Light Cardio",
//           description: "Jump rope or jog in place",
//           sets: { count: 1, minReps: 3, maxReps: 5, rest: "None", duration: "minutes" }
//         }
//       ]
//     },
//     {
//       name: "Workout",
//       duration: "45-60 minutes",
//       exercises: [
//         {
//           name: "Bodyweight Squats",
//           description: "Keep chest up, knees over toes",
//           sets: { count: 3, minReps: 12, maxReps: 15, rest: "60s" }
//         }
//       ]
//     },
//     {
//       name: "Cool-down",
//       duration: "10 minutes",
//       exercises: [
//         {
//           name: "Static Stretching",
//           description: "Hold each stretch for 30 seconds",
//           sets: { count: 1, minReps: 1, maxReps: 1, rest: "None" }
//         }
//       ]
//     }
//   ];
// };

// exports.savePlan = async (userId, weight, height, goalWeight, bmi, fitnessLevel, plan) => {
//   try {
//     return await WorkoutPlan.create({
//       userId,
//       weight,
//       height,
//       goalWeight,
//       bmi,
//       fitnessLevel,
//       plan: JSON.stringify(plan) // Store as string
//     });
//   } catch (err) {
//     console.error('Error saving workout plan:', err);
//     throw new Error('Failed to save workout plan');
//   }
// };

// exports.sendPlanResponse = (res, plan, isCached) => {
//   try {
//     // Parse the stored string back to object
//     const planData = typeof plan.plan === 'string' ? 
//       JSON.parse(plan.plan) : 
//       plan.plan;

//     res.json({
//       success: true,
//       plan: planData,
//       isCached,
//       generatedAt: plan.createdAt,
//       stats: {
//         weight: plan.weight,
//         goalWeight: plan.goalWeight,
//         bmi: plan.bmi
//       }
//     });
//   } catch (err) {
//     console.error('Error sending response:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Error formatting response'
//     });
//   }
// };












// sabase best 



// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const WorkoutPlan = require('../models/WorkoutPlan');

// // ====================
// // 1. MAIN CONTROLLER
// // ====================
// exports.generateWorkoutPlan = async (req, res) => {
//   const { weight, height, goalWeight, fitnessLevel } = req.body;
//   const userId = req.user?.id || "000000000000000000000001";

//   try {
//     // Check for existing plan
//     const existingPlan = await this.getValidPlan(
//       userId, weight, height, goalWeight, fitnessLevel
//     );
//     if (existingPlan) {
//       return this.sendPlanResponse(res, existingPlan, true);
//     }

//     // Generate new plan
//     const { bmi, prompt } = this.createPrompt(weight, height, goalWeight, fitnessLevel);
//     const planContent = await this.generateWithGemini(prompt);
//     const structuredPlan = this.parseWorkoutPlan(planContent);

//     // Save and return
//     const newPlan = await this.savePlan(
//       userId, weight, height, goalWeight, bmi, fitnessLevel, structuredPlan
//     );
    
//     return this.sendPlanResponse(res, newPlan, false);

//   } catch (err) {
//     console.error('Generation failed:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate workout plan',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// // ====================
// // 2. CORE HELPERS
// // ====================
// exports.getValidPlan = async (userId, weight, height, goalWeight, fitnessLevel) => {
//   return await WorkoutPlan.findOne({
//     userId,
//     weight,
//     height,
//     goalWeight,
//     fitnessLevel,
//     createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//   }).sort({ createdAt: -1 });
// };

// exports.createPrompt = (weight, height, goalWeight, fitnessLevel) => {
//   const heightInMeters = height / 100;
//   const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

//   const prompt = `Create a detailed ${fitnessLevel} 7-day workout plan in STRICT JSON format for:
// - Current Weight: ${weight}kg
// - Target Weight: ${goalWeight}kg
// - Height: ${height}cm
// - BMI: ${bmi}
// - Fitness Level: ${fitnessLevel}

// Requirements:
// 1. Different exercises for each day
// 2. Include strength, cardio, and flexibility
// 3. Specify exact sets/reps/rest periods
// 4. Warm-up and cool-down for each day
// 5. Muscle group focus for each day

// Required JSON Structure:
// {
//   "overview": "string",
//   "days": [
//     {
//       "dayNumber": 1-7,
//       "title": "string (e.g., 'Upper Body')",
//       "focus": "string (e.g., 'Chest, Triceps')",
//       "sections": [
//         {
//           "name": "Warm-up/Workout/Cool-down",
//           "duration": "string",
//           "exercises": [
//             {
//               "name": "string",
//               "description": "string",
//               "sets": {
//                 "count": number,
//                 "minReps": number,
//                 "maxReps": number,
//                 "rest": "string"
//               }
//             }
//           ]
//         }
//       ]
//     }
//   ],
//   "notes": "string"
// }

// IMPORTANT:
// - Return ONLY valid JSON
// - No markdown or extra text
// - Must parse with JSON.parse()`;

//   return { bmi, prompt };
// };

// exports.generateWithGemini = async (prompt) => {
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//   const result = await model.generateContent(prompt);
//   return (await result.response).text();
// };

// // ====================
// // 3. PARSING LAYER
// // ====================
// exports.parseWorkoutPlan = (planText) => {
//   try {
//     // Extract JSON from response
//     const jsonStart = planText.indexOf('{');
//     const jsonEnd = planText.lastIndexOf('}') + 1;
//     let jsonString = planText.slice(jsonStart, jsonEnd)
//       .replace(/\/\/.*$/gm, '') // Remove comments
//       .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix keys
//       .replace(/'/g, '"'); // Standardize quotes

//     const plan = JSON.parse(jsonString);
    
//     // Validate and enhance structure
//     if (!plan.days || !Array.isArray(plan.days)) {
//       throw new Error('Invalid days array');
//     }

//     plan.days.forEach(day => {
//       if (!day.sections) {
//         day.sections = this.createDefaultSections();
//       }
//       day.sections.forEach(section => {
//         section.exercises = section.exercises || [];
//       });
//     });

//     return plan;
//   } catch (err) {
//     console.error('Error parsing plan:', err);
//     return this.createDefaultPlan();
//   }
// };

// exports.createDefaultPlan = () => {
//   const days = [];
//   const dayTypes = [
//     { title: "Upper Body", focus: "Chest, Shoulders, Triceps" },
//     { title: "Lower Body", focus: "Quads, Hamstrings, Glutes" },
//     { title: "Active Recovery", focus: "Mobility & Cardio" },
//     { title: "Push Day", focus: "Chest, Triceps" },
//     { title: "Pull Day", focus: "Back, Biceps" },
//     { title: "Leg Day", focus: "Full Lower Body" },
//     { title: "Full Body", focus: "Compound Movements" }
//   ];

//   dayTypes.forEach((type, i) => {
//     days.push({
//       dayNumber: i + 1,
//       title: type.title,
//       focus: type.focus,
//       sections: this.createDefaultSections(type.title)
//     });
//   });

//   return {
//     overview: "7-day customized workout plan",
//     days,
//     notes: "Progress by increasing weight 5-10% weekly"
//   };
// };

// exports.createDefaultSections = (dayType) => {
//   const isRecovery = dayType.includes("Recovery");
  
//   return [
//     {
//       name: "Warm-up",
//       duration: "10-15 minutes",
//       exercises: [
//         {
//           name: "Dynamic Movements",
//           description: "Prepare muscles for workout",
//           sets: { count: 1, duration: "5-10 minutes" }
//         }
//       ]
//     },
//     {
//       name: "Workout",
//       duration: isRecovery ? "30 minutes" : "45-60 minutes",
//       exercises: isRecovery ? [
//         {
//           name: "Yoga Flow",
//           description: "Focus on mobility",
//           sets: { count: 1, duration: "20 minutes" }
//         }
//       ] : [
//         {
//           name: dayType.includes("Upper") ? "Push-ups" : "Squats",
//           description: "Focus on proper form",
//           sets: { count: 3, minReps: 10, maxReps: 15, rest: "60s" }
//         }
//       ]
//     },
//     {
//       name: "Cool-down",
//       duration: "10 minutes",
//       exercises: [
//         {
//           name: "Static Stretching",
//           description: "Hold each stretch 30 seconds",
//           sets: { count: 1, duration: "per muscle group" }
//         }
//       ]
//     }
//   ];
// };

// // ====================
// // 4. UTILITIES
// // ====================
// exports.savePlan = async (userId, weight, height, goalWeight, bmi, fitnessLevel, plan) => {
//   return await WorkoutPlan.create({
//     userId,
//     weight,
//     height,
//     goalWeight,
//     bmi,
//     fitnessLevel,
//     plan: JSON.stringify(plan) // Store as string
//   });
// };

// exports.sendPlanResponse = (res, plan, isCached) => {
//   try {
//     const planData = typeof plan.plan === 'string' ? 
//       JSON.parse(plan.plan) : 
//       plan.plan;

//     res.json({
//       success: true,
//       plan: planData,
//       isCached,
//       generatedAt: plan.createdAt,
//       stats: {
//         weight: plan.weight,
//         goalWeight: plan.goalWeight,
//         bmi: plan.bmi
//       }
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: 'Error formatting response'
//     });
//   }
// };





































































































// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const WorkoutPlan = require('../models/WorkoutPlan');

// exports.generateWorkoutPlan = async (req, res) => {
//   // Validate input
//   const { weight, height, goalWeight, fitnessLevel } = req.body;
//   const userId = req.user?.id;

//   if (!weight || !height || !goalWeight || !fitnessLevel) {
//     return res.status(400).json({
//       success: false,
//       message: 'Missing required fields: weight, height, goalWeight, fitnessLevel'
//     });
//   }

//   try {
//     // 1. Check for existing valid plan
//     const existingPlan = await this.getValidPlan(
//       userId, weight, height, goalWeight, fitnessLevel
//     );
//     if (existingPlan) {
//       return this.sendPlanResponse(res, existingPlan, true);
//     }

//     // 2. Generate new plan
//     const { bmi, prompt } = this.createPrompt(weight, height, goalWeight, fitnessLevel);
//     const planContent = await this.generateWithGemini(prompt);
//     const formattedPlan = this.formatPlan(planContent);

//     // 3. Save and return
//     const newPlan = await this.savePlan(
//       userId, weight, height, goalWeight, bmi, fitnessLevel, formattedPlan
//     );
    
//     return this.sendPlanResponse(res, newPlan, false);

//   } catch (err) {
//     console.error('Generation failed:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate workout plan',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// // Helper Methods
// exports.getValidPlan = async (userId, weight, height, goalWeight, fitnessLevel) => {
//   try {
//     return await WorkoutPlan.findOne({
//       userId,
//       weight,
//       height,
//       goalWeight,
//       fitnessLevel,
//       createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//     }).sort({ createdAt: -1 });
//   } catch (err) {
//     console.error('Error fetching existing plan:', err);
//     return null;
//   }
// };

// exports.createPrompt = (weight, height, goalWeight, fitnessLevel) => {
//   const heightInMeters = height / 100;
//   const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

//   const prompt = `Create a detailed ${fitnessLevel} 7-day workout plan for:
// - Current Weight: ${weight}kg
// - Goal Weight: ${goalWeight}kg
// - BMI: ${bmi}

// Include:
// 1. Strength training exercises with sets/reps
// 2. Cardio sessions with duration/intensity
// 3. Rest or active recovery days
// 4. Proper warmups and cooldowns
// 5. Clear section headers for each part

// Format with Markdown using:
// - ## for day headers
// - **bold** for section headers
// - * for exercise lists
// - Include sets/reps for each exercise`;

//   return { bmi, prompt };
// };

// exports.generateWithGemini = async (prompt) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     if (!response.text) {
//       throw new Error('No response text from Gemini');
//     }
//     return response.text();
//   } catch (err) {
//     console.error('Gemini API error:', err);
//     throw new Error('Failed to generate content with Gemini');
//   }
// };

// exports.formatPlan = (planText) => {
//   if (!planText) return '';
  
//   return planText
//     .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
//     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em>$1</em>')
//     .replace(/##\s*(.*?)\n/g, '<strong>$1</strong>\n');
// };

// exports.savePlan = async (userId, weight, height, goalWeight, bmi, fitnessLevel, plan) => {
//   try {
//     return await WorkoutPlan.create({
//       userId,
//       weight,
//       height,
//       goalWeight,
//       bmi,
//       fitnessLevel,
//       plan
//     });
//   } catch (err) {
//     console.error('Error saving workout plan:', err);
//     throw new Error('Failed to save workout plan');
//   }
// };

// exports.sendPlanResponse = (res, plan, isCached) => {
//   try {
//     if (!plan || !plan.plan) {
//       throw new Error('Invalid plan data');
//     }

//     const structuredPlan = this.parsePlanToStructure(plan.plan);
    
//     res.json({
//       success: true,
//       plan: {
//         overview: structuredPlan.overview,
//         days: structuredPlan.days,
//         notes: structuredPlan.notes
//       },
//       isCached,
//       generatedAt: plan.createdAt.toISOString(),
//       stats: {
//         weight: plan.weight,
//         goalWeight: plan.goalWeight,
//         bmi: plan.bmi
//       }
//     });
//   } catch (error) {
//     console.error('Error formatting response:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error formatting workout plan response'
//     });
//   }
// };

// exports.parsePlanToStructure = (planText) => {
//   if (!planText || typeof planText !== 'string') {
//     return {
//       overview: '',
//       days: [],
//       notes: ''
//     };
//   }

//   // Extract the overview (text before the first day)
//   const overviewEnd = planText.indexOf('<strong>Day 1:');
//   const overview = overviewEnd !== -1 ? 
//     planText.substring(0, overviewEnd).trim() : 
//     planText;

//   // Extract all days
//   const dayRegex = /<strong>Day (\d+):([^<]+)<\/strong>/gi;
//   const days = [];
//   let dayMatch;
  
//   while ((dayMatch = dayRegex.exec(planText)) !== null) {
//     const dayNumber = parseInt(dayMatch[1]);
//     const title = dayMatch[2].trim();
//     const dayContent = this.getDayContent(planText, dayMatch);
    
//     days.push({
//       dayNumber,
//       title,
//       sections: this.parseDaySections(dayContent)
//     });
//   }

//   // Extract notes
//   const notesStart = planText.indexOf('<strong>Important Considerations:</strong>');
//   const notes = notesStart !== -1 ? 
//     planText.substring(notesStart + '<strong>Important Considerations:</strong>'.length).trim() : 
//     '';

//   return {
//     overview,
//     days,
//     notes
//   };
// };

// exports.getDayContent = (fullText, dayMatch) => {
//   const nextDayIndex = fullText.indexOf(`<strong>Day ${parseInt(dayMatch[1]) + 1}:`);
//   const notesIndex = fullText.indexOf('<strong>Important Considerations:</strong>');
  
//   const endIndex = nextDayIndex !== -1 ? 
//     nextDayIndex : 
//     (notesIndex !== -1 ? notesIndex : fullText.length);
    
//   return fullText.substring(dayMatch.index + dayMatch[0].length, endIndex).trim();
// };

// exports.parseDaySections = (dayContent) => {
//   const sections = [];
//   const sectionPatterns = [
//     { name: 'Warm-up', regex: /<strong>Warm-up(?:\(.*?\))?:<\/strong>/i },
//     { name: 'Workout', regex: /<strong>Workout:<\/strong>/i },
//     { name: 'Cool-down', regex: /<strong>Cool-down(?:\(.*?\))?:<\/strong>/i }
//   ];

//   let lastIndex = 0;
  
//   sectionPatterns.forEach((pattern, i) => {
//     const match = dayContent.substring(lastIndex).match(pattern.regex);
//     if (match) {
//       const start = lastIndex + match.index;
//       const nextPattern = sectionPatterns[i+1];
//       let end = dayContent.length;
      
//       if (nextPattern) {
//         const nextMatch = dayContent.substring(start).match(nextPattern.regex);
//         if (nextMatch) end = start + nextMatch.index;
//       }
      
//       const content = dayContent.substring(start + match[0].length, end).trim();
//       if (content) {
//         sections.push(this.parseSection(pattern.name, match[0] + content));
//       }
      
//       lastIndex = start + match[0].length;
//     }
//   });

//   return sections;
// };

// exports.parseSection = (name, sectionContent) => {
//   const contentStart = sectionContent.indexOf('</strong>') + 9;
//   const content = sectionContent.substring(contentStart).trim();
  
//   return {
//     name,
//     content,
//     exercises: this.extractExercises(content)
//   };
// };

// exports.extractExercises = (sectionContent) => {
//   const exercises = [];
//   const exerciseRegex = /(?:\*|\d+\.)\s*(.+?):\s*(.+?)(?=\n\s*(?:\*|\d+\.)|$)/g;
//   let match;
  
//   while ((match = exerciseRegex.exec(sectionContent)) !== null) {
//     exercises.push({
//       name: match[1].trim(),
//       description: match[2].trim(),
//       sets: this.extractSets(match[2])
//     });
//   }
  
//   return exercises;
// };

// exports.extractSets = (description) => {
//   const setPatterns = [
//     /(\d+)\s*sets\s*of\s*(\d+)(?:\s*-\s*(\d+))?\s*reps?/i, // "3 sets of 8-12 reps"
//     /(\d+)\s*x\s*(\d+)(?:\s*-\s*(\d+))?/i,                 // "3x8-12"
//     /(\d+)\s*reps?\s*of\s*(\d+)/i,                         // "10 reps of 3"
//     /(\d+)\s*times\s*(\d+)(?:\s*-\s*(\d+))?/i              // "3 times 8-12"
//   ];
  
//   for (const pattern of setPatterns) {
//     const match = description.match(pattern);
//     if (match) {
//       return {
//         count: match[1] ? parseInt(match[1]) : 1,
//         minReps: parseInt(match[2]),
//         maxReps: match[3] ? parseInt(match[3]) : parseInt(match[2])
//       };
//     }
//   }
  
//   return null;
// };

