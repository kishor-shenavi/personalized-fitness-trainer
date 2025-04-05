// // //console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY);



import fetch from "node-fetch";

 const GEMINI_API_KEY = "AIzaSyChRmDjIx8i782BgeaDyed5zqWz9Um2O6Y";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
//const GEMINI_API_KEY = "AIzaSyChRmDjIx8i782BgeaDyed5zqWz9Um2O6Y"; // Replace with actual key
//const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
export async function generateDietPlan(userData) {
  const { age, weight, height, gender, activityLevel, dietPreference, targetWeight } = userData;
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
  Return ONLY valid JSON (no markdown). Include all 7 days with:
  - Breakfast
  - Mid-morning snack
  - Lunch
  - Evening snack
  - Dinner`;
 
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
    
    // Clean and parse the response
    dietPlanText = dietPlanText.replace(/^```json|```$/g, '').trim();
    const dietPlan = JSON.parse(dietPlanText);

    // Validate structure
    if (!dietPlan.days || dietPlan.days.length !== 7) {
      throw new Error("Invalid diet plan: Must include all 7 days");
    }

    console.log("✅ Generated Diet Plan:", JSON.stringify(dietPlan, null, 2));
    return dietPlan;
    
  } catch (error) {
    console.error("❌ Error generating diet plan:", error);
    throw error;
  }
}



 // const prompt = `Create a personalized indian weekly JSON diet plan for:
  // - Age: ${age}
  // - Weight: ${weight} kg
  // - Height: ${height} cm
  // - Gender: ${gender}
  // - Activity Level: ${activityLevel}
  // - Diet Preference: ${dietPreference}
  // - Target Weight: ${targetWeight} kg

  // Use this exact structure:
  // {
  //   "name": "Weekly Diet Plan",
  //   "description": string,
  //   "days": [
  //     {
  //       "day": "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
  //       "meals": [
  //         {
  //           "meal": "Breakfast" | "Morning Snack" | "Lunch" | "Afternoon Snack" | "Dinner" | "Evening Snack",
  //           "time": string (e.g., "8:00 AM"),
  //           "items": string[],
  //           "calories": string (e.g., "350 kcal"),
  //           "nutrition": {
  //             "protein": string,
  //             "carbs": string,
  //             "fats": string
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // }
  // Return ONLY valid JSON (no markdown code blocks or extra text). Include all 7 days with 3-5 meals per day.`;














// import fetch from "node-fetch";

// const GEMINI_API_KEY = "AIzaSyChRmDjIx8i782BgeaDyed5zqWz9Um2O6Y"; // Replace with your actual API key
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;



// export async function fetchWeeklyDietPlan() {
//   const apiKey = "AIzaSyChRmDjIx8i782BgeaDyed5zqWz9Um2O6Y"; // Replace with your actual API key
//   const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  
//   const requestBody = {
//     contents: [
//       {
//         role: "user",
//         parts: [{ 
//           text: `Create a complete weekly JSON diet plan (Monday through Sunday) with this exact structure:
//           {
//             "name": "Weekly Diet Plan",
//             "description": string,
//             "days": [
//               {
//                 "day": "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
//                 "meals": [
//                   {
//                     "meal": "Breakfast" | "Morning Snack" | "Lunch" | "Afternoon Snack" | "Dinner" | "Evening Snack",
//                     "time": string (e.g., "8:00 AM"),
//                     "items": string[],
//                     "calories": string (e.g., "350 kcal"),
//                     "nutrition": {
//                       "protein": string,
//                       "carbs": string,
//                       "fats": string
//                     }
//                   }
//                 ]
//               }
//             ]
//           }
//           Return ONLY valid JSON (no markdown code blocks or extra text). Include all 7 days with 3-5 meals per day.`
//         }],
//       },
//     ],
//   };

//   try {
//     const response = await fetch(apiUrl, {
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

//     console.log("✅ Complete Weekly Diet Plan:", JSON.stringify(dietPlan, null, 2));
//     return dietPlan;
    
//   } catch (error) {
//     console.error("❌ Error fetching weekly diet plan:", error);
//     throw error;
//   }
// }

// // Example usage
// async function displayWeeklyDietPlan() {
//   try {
//     const plan = await fetchWeeklyDietPlan();
    
//     console.log("\nWeekly Plan Overview:");
//     plan.days.forEach(day => {
//       console.log(`\n${day.day}:`);
//       day.meals.forEach(meal => {
//         console.log(`- ${meal.meal} (${meal.time}): ${meal.items.join(", ")} [${meal.calories}]`);
//       });
//     });

//   } catch (error) {
//     console.error("Failed to load weekly plan:", error.message);
//   }
// }

// displayWeeklyDietPlan();

