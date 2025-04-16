const fetch = require("node-fetch");
const DietPlan = require('../models/DietPlan');
const crypto = require('crypto');

const GEMINI_API_KEY = "AIzaSyChRmDjIx8i782BgeaDyed5zqWz9Um2O6Y";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

async function generateDietPlan(userData) {
  const { userId, age, weight, height, gender, activityLevel, dietPreference, targetWeight } = userData;

  // Create a query object with all the relevant fields for caching
  const cacheQuery = {
    userId,
    age,
    weight,
    height,
    gender,
    activityLevel,
    dietPreference,
    targetWeight
  };

  // Try to find existing plan first
  try {
    const cachedPlan = await DietPlan.findOne(cacheQuery)
      .sort({ createdAt: -1 }) // Get the most recent plan
      .lean(); // Return plain JS object

    if (cachedPlan) {
      console.log("✅ Serving cached diet plan");
      return cachedPlan.plan;
    }
  } catch (dbError) {
    console.error("Database lookup error:", dbError);
    // Continue to generate new plan if lookup fails
  }

  // If no cached plan found, generate new one
  const prompt = `Create a personalized INDIAN weekly JSON diet plan for:
  - Age: ${age}
  - Weight: ${weight} kg
  - Height: ${height} cm
  - Gender: ${gender}
  - Activity Level: ${activityLevel}
  - Diet Preference: ${dietPreference} (vegetarian/non-vegetarian/vegan)
  - Target Weight: ${targetWeight} kg

  Requirements:
  - Use only traditional Indian foods and meals
  - Include regional variations if possible
  - Follow standard Indian meal timings
  - Use Indian measurements (e.g. 2 roti)
  - Include common Indian snacks

  JSON Structure:
  {
    "name": "Weekly Indian Diet Plan",
    "description": string,
    "days": [
      {
        "day": "Monday"..."Sunday",
        "meals": [
          {
            "meal": "Breakfast"..."Evening Snack",
            "time": "8:00 AM" etc.,
            "items": string[],
            "calories": "350 kcal",
            "nutrition": {
              "protein": "15g",
              "carbs": "50g",
              "fats": "12g"
            }
          }
        ]
      }
    ]
  }
  
  IMPORTANT:
  - Return ONLY pure JSON without any comments or markdown
  - Do not include any text outside the JSON structure
  - Ensure all strings are properly escaped
  - The response must parse with JSON.parse() directly`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let dietPlanText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    dietPlanText = dietPlanText
      .replace(/^```json|```$/g, '') // Remove markdown code blocks
      .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '') // Remove comments
      .trim();

    const dietPlan = JSON.parse(dietPlanText);

    // Validate structure
    if (!dietPlan.days || !Array.isArray(dietPlan.days) || dietPlan.days.length !== 7) {
      throw new Error("Invalid diet plan: Must include all 7 days");
    }

    // Cache the new plan in MongoDB
    try {
      await DietPlan.create({
        ...cacheQuery,
        plan: dietPlan
      });
      console.log("✅ New diet plan cached in MongoDB");
    } catch (saveError) {
      console.error("Failed to cache diet plan:", saveError);
      // Don't fail the request if caching fails
    }

    return dietPlan;
    
  } catch (error) {
    console.error("❌ Error generating diet plan:", error);
    throw new Error(`Failed to generate diet plan: ${error.message}`);
  }
}

module.exports = { generateDietPlan };






















// // utils/geminiClient.js
// const fetch = require("node-fetch");

// const GEMINI_API_KEY = "AIzaSyChRmDjIx8i782BgeaDyed5zqWz9Um2O6Y";
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// async function generateDietPlan(userData) {
//   const { age, weight, height, gender, activityLevel, dietPreference, targetWeight } = userData;
//   const prompt = `Create a personalized INDIAN weekly JSON diet plan for:
//   - Age: ${age}
//   - Weight: ${weight} kg
//   - Height: ${height} cm
//   - Gender: ${gender}
//   - Activity Level: ${activityLevel}
//   - Diet Preference: ${dietPreference} (vegetarian/non-vegetarian/vegan)
//   - Target Weight: ${targetWeight} kg

//   Requirements:
//   - Use only traditional Indian foods and meals
//   - Include regional variations if possible
//   - Follow standard Indian meal timings
//   - Use Indian measurements (e.g. 2 roti)
//   - Include common Indian snacks

//   JSON Structure:
//   {
//     "name": "Weekly Indian Diet Plan",
//     "description": string,
//     "days": [
//       {
//         "day": "Monday"..."Sunday",
//         "meals": [
//           {
//             "meal": "Breakfast"..."Evening Snack",
//             "time": "8:00 AM" etc.,
//             "items": string[],
//             "calories": "350 kcal",
//             "nutrition": {
//               "protein": "15g",
//               "carbs": "50g",
//               "fats": "12g"
//             }
//           }
//         ]
//       }
//     ]
//   }
  
//   IMPORTANT:
//   - Return ONLY pure JSON without any comments or markdown
//   - Do not include any text outside the JSON structure
//   - Ensure all strings are properly escaped
//   - The response must parse with JSON.parse() directly`;

//   const requestBody = {
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: prompt }],
//       },
//     ],
//   };

//   try {
//     const response = await fetch(GEMINI_API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     let dietPlanText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
//     // Enhanced cleaning process
//     dietPlanText = dietPlanText
//       .replace(/^```json|```$/g, '') // Remove markdown code blocks
//       .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '') // Remove both /* */ and // comments
//       .trim();

//     try {
//       const dietPlan = JSON.parse(dietPlanText);

//       // Validate structure
//       if (!dietPlan.days || !Array.isArray(dietPlan.days) || dietPlan.days.length !== 7) {
//         throw new Error("Invalid diet plan: Must include all 7 days");
//       }

//       console.log("✅ Generated Diet Plan:", JSON.stringify(dietPlan, null, 2));
//       return dietPlan;
//     } catch (parseError) {
//       console.error("❌ Failed to parse response:", dietPlanText);
//       throw new Error(`Invalid JSON response from API: ${parseError.message}`);
//     }
    
//   } catch (error) {
//     console.error("❌ Error generating diet plan:", error);
//     throw new Error(`Failed to generate diet plan: ${error.message}`);
//   }
// }

// module.exports = { generateDietPlan };



































// import fetch from "node-fetch";

//  const GEMINI_API_KEY = "AIzaSyChRmDjIx8i782BgeaDyed5zqWz9Um2O6Y";
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
// //const GEMINI_API_KEY = "AIzaSyChRmDjIx8i782BgeaDyed5zqWz9Um2O6Y"; // Replace with actual key
// //const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
// export async function generateDietPlan(userData) {
//   const { age, weight, height, gender, activityLevel, dietPreference, targetWeight } = userData;
//   const prompt = `Create a personalized INDIAN weekly JSON diet plan for:
//   - Age: ${age}
//   - Weight: ${weight} kg
//   - Height: ${height} cm
//   - Gender: ${gender}
//   - Activity Level: ${activityLevel}
//   - Diet Preference: ${dietPreference} (vegetarian/non-vegetarian/vegan)
//   - Target Weight: ${targetWeight} kg

//   Requirements:
//   - Use only traditional Indian foods and meals
//   - Include regional variations if possible
//   - Follow standard Indian meal timings
//   - Use Indian measurements (e.g. 2 roti)
//   - Include common Indian snacks

//   JSON Structure:
//   {
//     "name": "Weekly Indian Diet Plan",
//     "description": string,
//     "days": [
//       {
//         "day": "Monday"..."Sunday",
//         "meals": [
//           {
//             "meal": "Breakfast"..."Evening Snack",
//             "time": "8:00 AM" etc.,
//             "items": string[],
//             "calories": "350 kcal",
//             "nutrition": {
//               "protein": "15g",
//               "carbs": "50g",
//               "fats": "12g"
//             }
//           }
//         ]
//       }
//     ]
//   }
//   Return ONLY valid JSON (no markdown). Include all 7 days with:
//   - Breakfast
//   - Mid-morning snack
//   - Lunch
//   - Evening snack
//   - Dinner`;
 
//   const requestBody = {
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: prompt }],
//       },
//     ],
//   };

//   try {
//     const response = await fetch(GEMINI_API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     let dietPlanText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
//     // Clean and parse the response
//     dietPlanText = dietPlanText.replace(/^```json|```$/g, '').trim();
//     const dietPlan = JSON.parse(dietPlanText);

//     // Validate structure
//     if (!dietPlan.days || dietPlan.days.length !== 7) {
//       throw new Error("Invalid diet plan: Must include all 7 days");
//     }

//     console.log("✅ Generated Diet Plan:", JSON.stringify(dietPlan, null, 2));
//     return dietPlan;
    
//   } catch (error) {
//     console.error("❌ Error generating diet plan:", error);
//     throw error;
//   }
// }


