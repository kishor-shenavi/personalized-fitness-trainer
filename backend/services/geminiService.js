// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.generateWorkoutPlan = async ({ weight, height, goalWeight, bmi, exercises, fitnessLevel }) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
//     const prompt = `
// **Fitness Plan Generation Request**

// User Profile:
// - Current Weight: ${weight} kg
// - Height: ${height} cm
// - BMI: ${bmi}
// - Goal Weight: ${goalWeight} kg
// - Fitness Level: ${fitnessLevel}

// Available Exercises:
// ${exercises.map(ex => 
//   `• ${ex.name} (${ex.difficulty}, ${ex.caloriesPerMinute} cal/min) - ${ex.description || 'No description'}`
// ).join('\n')}

// **Instructions:**
// 1. Create a 7-day progressive program
// 2. Include warm-up and cool-down routines
// 3. Balance strength, cardio, and flexibility
// 4. Specify exact durations and sets
// 5. Include rest days strategically
// 6. Format with clear daily sections

// **Output Format:**
// \`\`\`markdown
// ## [Day X: Workout Focus]
// ### Warm-up (5-10 min)
// - Exercise 1
// - Exercise 2

// ### Main Workout
// - Exercise: Duration/Sets (Intensity)
// - ...

// ### Cool-down (5 min)
// - Stretches
// \`\`\`
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error('Gemini API Error:', error);
//     throw new Error('Failed to generate plan. Please try again later.');
//   }
// };