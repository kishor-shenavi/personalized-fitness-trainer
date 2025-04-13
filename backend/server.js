const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const GoogleGenAI = require('@google/genai');
// const ai = new GoogleGenAI({ apiKey: "AIzaSyBAuNHpwEMq15xJwOQFit1Bwv_UQnWegq0"});
const { GoogleGenerativeAI } = require('@google/generative-ai');

const nodemailer = require('nodemailer');
const crypto = require('crypto');  // For generating verification token
const User = require('./User');
const Exercise = require('./Exercise');
const WorkoutHistory = require('./WorkoutHistory');
const WorkoutPlan = require('./WorkoutPlan');
const cors = require('cors');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("GEMINI KEY IN SERVER:", process.env.GEMINI_API_KEY);
 

const app = express();
const PORT = 5000;
app.use(bodyParser.json());
const JWT_SECRET="thisistheend";
const corsOptions = {
  origin: 'http://localhost:3000',  // Replace with your React app's URL
  methods: 'GET,POST,PUT',
  credentials: true,  // This allows cookies or other credentials
};
app.use(cors(corsOptions));


// MongoDB connection string
mongoose.connect('mongodb+srv://siddhant1100115:Dj954XfASXARyVh3@cluster1.0d6cj.mongodb.net/fitness?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected to fitness database'))
  .catch(err => console.log('MongoDB connection error:', err));

// Mock Data: Exercises categorized by difficulty
// const exercises = [
//   { name: 'Lunges', difficulty: 'Easy', caloriesPerMinute: 6, videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
//   { name: 'Plank', difficulty: 'Easy', caloriesPerMinute: 4, videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
//   { name: 'Jump Rope', difficulty: 'Easy', caloriesPerMinute: 7, videoUrl: 'https://www.youtube.com/watch?v=1BZM7ZQJ4N4' },
//   { name: 'Mountain Climbers', difficulty: 'Intermediate', caloriesPerMinute: 9, videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
//   { name: 'Bicycle Crunches', difficulty: 'Intermediate', caloriesPerMinute: 8, videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8' },
//   { name: 'Kettlebell Swings', difficulty: 'Advanced', caloriesPerMinute: 11, videoUrl: 'https://www.youtube.com/watch?v=YSxHifyIh9Y' },
//   { name: 'Handstand Push-ups', difficulty: 'Advanced', caloriesPerMinute: 10, videoUrl: 'https://www.youtube.com/watch?v=0tKXrChpKjw' },
//   { name: 'Dips', difficulty: 'Intermediate', caloriesPerMinute: 8, videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As' },
//   { name: 'Box Jumps', difficulty: 'Advanced', caloriesPerMinute: 9, videoUrl: 'https://www.youtube.com/watch?v=NBy6zyj7Fxw' },
//   { name: 'Russian Twists', difficulty: 'Intermediate', caloriesPerMinute: 7, videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI' },
//   { name: 'Leg Raises', difficulty: 'Easy', caloriesPerMinute: 5, videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI' },
//   { name: 'Side Plank', difficulty: 'Easy', caloriesPerMinute: 4, videoUrl: 'https://www.youtube.com/watch?v=K_9dfqZZjGI' },
//   { name: 'Flutter Kicks', difficulty: 'Intermediate', caloriesPerMinute: 7, videoUrl: 'https://www.youtube.com/watch?v=L4CEhHZJqjo' },
//   { name: 'Tuck Jumps', difficulty: 'Advanced', caloriesPerMinute: 9, videoUrl: 'https://www.youtube.com/watch?v=wv3byfHUYpI' },
//   { name: 'Front Lever', difficulty: 'Advanced', caloriesPerMinute: 10, videoUrl: 'https://www.youtube.com/watch?v=sAVQpz9sW90' },
//   { name: 'Hanging Leg Raises', difficulty: 'Intermediate', caloriesPerMinute: 8, videoUrl: 'https://www.youtube.com/watch?v=NSNkq3GZFMo' },
//   { name: 'Farmer’s Walk', difficulty: 'Intermediate', caloriesPerMinute: 7, videoUrl: 'https://www.youtube.com/watch?v=VAFIyTq2fcY' },
//   { name: 'Jump Squats', difficulty: 'Intermediate', caloriesPerMinute: 8, videoUrl: 'https://www.youtube.com/watch?v=Azl5tkCzDcc' },
//   { name: 'Battle Ropes', difficulty: 'Advanced', caloriesPerMinute: 11, videoUrl: 'https://www.youtube.com/watch?v=NQ8uIegp5_g' },
//   { name: 'Medicine Ball Slams', difficulty: 'Advanced', caloriesPerMinute: 10, videoUrl: 'https://www.youtube.com/watch?v=8QikxHEKgJY' },
//   { name: 'Sledgehammer Swings', difficulty: 'Advanced', caloriesPerMinute: 11, videoUrl: 'https://www.youtube.com/watch?v=aOVdT9J3Hcc' },
//   { name: 'Turkish Get-Up', difficulty: 'Advanced', caloriesPerMinute: 10, videoUrl: 'https://www.youtube.com/watch?v=0bWRPC49-KI' },
//   { name: 'Wall Sits', difficulty: 'Easy', caloriesPerMinute: 5, videoUrl: 'https://www.youtube.com/watch?v=4Bc_JM1Jf7o' },
//   { name: 'Glute Bridges', difficulty: 'Easy', caloriesPerMinute: 6, videoUrl: 'https://www.youtube.com/watch?v=8bbE64NuDTU' },
//   { name: 'Superman Exercise', difficulty: 'Easy', caloriesPerMinute: 5, videoUrl: 'https://www.youtube.com/watch?v=cc6UVRS7PW4' },
//   { name: 'Pistol Squats', difficulty: 'Advanced', caloriesPerMinute: 9, videoUrl: 'https://www.youtube.com/watch?v=Fq4oCQTzg-I' },
//   { name: 'Jumping Jacks', difficulty: 'Easy', caloriesPerMinute: 7, videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8' },
//   { name: 'TRX Rows', difficulty: 'Intermediate', caloriesPerMinute: 8, videoUrl: 'https://www.youtube.com/watch?v=lGSI1pRo1WQ' },
//   { name: 'Step-Ups', difficulty: 'Easy', caloriesPerMinute: 6, videoUrl: 'https://www.youtube.com/watch?v=QC6vjSxa5eY' },
//   { name: 'Sled Push', difficulty: 'Advanced', caloriesPerMinute: 11, videoUrl: 'https://www.youtube.com/watch?v=5AF3gpeDpmA' },
//   { name: 'Sumo Deadlift', difficulty: 'Advanced', caloriesPerMinute: 10, videoUrl: 'https://www.youtube.com/watch?v=Tykc4tX9XzU' },
//   { name: 'Hip Thrusts', difficulty: 'Intermediate', caloriesPerMinute: 7, videoUrl: 'https://www.youtube.com/watch?v=GzQjE0CwRpY' },
//   { name: 'Boxing', difficulty: 'Advanced', caloriesPerMinute: 12, videoUrl: 'https://www.youtube.com/watch?v=d3By5hIktC4' },
//   { name: 'Bear Crawls', difficulty: 'Intermediate', caloriesPerMinute: 9, videoUrl: 'https://www.youtube.com/watch?v=In3oKaqmFu4' },
//   { name: 'Jumping Knee Tucks', difficulty: 'Advanced', caloriesPerMinute: 10, videoUrl: 'https://www.youtube.com/watch?v=8nRmkMbxkz0' },
//   { name: 'Battle Rope Slams', difficulty: 'Advanced', caloriesPerMinute: 11, videoUrl: 'https://www.youtube.com/watch?v=BX5e7U7kciM' },
//   { name: 'Skater Jumps', difficulty: 'Intermediate', caloriesPerMinute: 8, videoUrl: 'https://www.youtube.com/watch?v=7DwXvZGrZ2o' },
//   { name: 'Wall Ball Shots', difficulty: 'Advanced', caloriesPerMinute: 10, videoUrl: 'https://www.youtube.com/watch?v=fkjTa7tWtNs' },
//   { name: 'Jump Rope Double Unders', difficulty: 'Advanced', caloriesPerMinute: 12, videoUrl: 'https://www.youtube.com/watch?v=6k2Kf_Xl1w8' }
// ];


// // Create exercises in MongoDB
// async function createExercises() {
//   for (const exercise of exercises) {
//     await new Exercise(exercise).save();
//   }
// }

// createExercises();

// Route to get exercises by difficulty
// async function main() {

//   try{
//   const response = await genAI.getGenerativeModel({
//     model: "gemini-2.0-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log("response.text");
// }catch(err){
//   console.log("Nope");
// }
// }

// main();
app.post('/generate-plan', async (req, res) => {
  const { weight, height, goalWeight, bmi, userId } = req.body;

  try {
    // 1. Check for an existing plan within the last 7 days
    const existingPlan = await WorkoutPlan.findOne({
      userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    if (existingPlan) {
      return res.json({ plan: existingPlan.plan, message: 'Existing plan retrieved' });
    }

    // 2. Get exercises
    const exercises = await Exercise.find();

    // 3. Generate plan using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
User Details:
- Weight: ${weight} kg
- Height: ${height} cm
- BMI: ${bmi}
- Goal Weight: ${goalWeight} kg

Exercises available:
${exercises.map(ex => `- ${ex.name} (${ex.difficulty})`).join('\n')}

Based on this, suggest a personalized weekly workout plan using the available exercises.
Use bullet points and format by day.
`;

    const result = await model.generateContent(prompt);
    const plan = await result.response.text(); // ✅ plan is now defined

    // 4. Save to database
    const newPlan = new WorkoutPlan({
      userId,
      weight,
      height,
      goalWeight,
      bmi,
      plan
    });

    await newPlan.save();

    // 5. Send response
    res.json({ plan });
  } catch (err) {
    console.error('Error generating workout plan', err);
    res.status(500).json({ message: 'Failed to generate plan', error: err.message });
  }
});


app.get('/exercises/:difficulty', async (req, res) => {
  try {
    const exercises = await Exercise.find({ difficulty: req.params.difficulty });
    res.status(200).json(exercises);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching exercises', error: err });
  }
});

// Route to start an exercise (simulating the start of the exercise)
app.post('/user/:userId/exercise/:exerciseId/start', async (req, res) => {
    const { userId, exerciseId } = req.params;
    try {
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
  
      const workoutHistory = new WorkoutHistory({
        userId,
        exerciseId,
        startTime: new Date(),
        // Do not include endTime, as it is not required here
        caloriesBurned: 0,
        durationMinutes: 0,
      });
  
      await workoutHistory.save();
      res.status(200).json({ message: 'Exercise started', workoutHistory });
    } catch (error) {
      res.status(500).json({ message: 'Error starting exercise', error });
    }
  });
  
  app.get("/workout-plan", async (req, res) => {
    try {
        const workoutPlan = await getWorkoutPlan();
        res.json({ success: true, workoutPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// Route to complete an exercise (calculate time, calories burned, and store history)
app.post('/user/:userId/exercise/:exerciseId/complete', async (req, res) => {
    const { userId, exerciseId } = req.params;
    
    try {
      // Find the exercise and workout history
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
  
      const workoutHistory = await WorkoutHistory.findOne({
        userId,
        exerciseId,
        endTime: null, // Ensure this is the ongoing workout
      });
  
      if (!workoutHistory) {
        return res.status(404).json({ message: 'Workout not found' });
      }
  
      // Set the endTime to the current time
      workoutHistory.endTime = new Date();
  
      // Calculate the duration in minutes
      const durationMilliseconds = workoutHistory.endTime - workoutHistory.startTime; // in milliseconds
      const durationMinutes = Math.floor(durationMilliseconds / 60000); // convert milliseconds to minutes
  
      // Calculate calories burned
      workoutHistory.durationMinutes = durationMinutes;
      workoutHistory.caloriesBurned = exercise.caloriesPerMinute * durationMinutes;
  
      // Save the updated workout history
      await workoutHistory.save();
  
      res.status(200).json({ message: 'Exercise completed', workoutHistory });
    } catch (error) {
      res.status(500).json({ message: 'Error completing exercise', error });
    }
  });
  

// Route to get workout history of a user
app.get('/user/:userId/history', async (req, res) => {
  try {
    const history = await WorkoutHistory.find({ userId: req.params.userId })
      .populate('exerciseId', 'name difficulty caloriesPerMinute'); // Populate exercise details
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user history', error });
  }
});

// Sign Up Route
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use another email service
  auth: {
    user: 'siddhant1100115@gmail.com',  // Replace with your email
    pass: 'tywvsrvuxojrmovw',  // Replace with your email password or use app-specific password
  }
});

// Sign Up Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate email format for Google accounts
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|google\.com)$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid Google email address.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, verified: false });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;

    // Save user to the database (with the verification token)
    await user.save();

    // Send verification email
    const verificationLink = `http://localhost:5000/verify-email/${verificationToken}`;
    const mailOptions = {
      from: 'siddhant1100115@gmail.com',
      to: email,
      subject: 'Please verify your email address',
      text: `Click the following link to verify your email address: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending verification email' });
      }
      res.status(201).json({ message: 'User created successfully. Please check your email to verify your account.' });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
});
app.get('/get-plan/:userId', async (req, res) => {
  const { userId } = req.params;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const existingPlan = await WorkoutPlan.findOne({
      userId,
      createdAt: { $gte: oneWeekAgo },
    });

    if (existingPlan) {
      return res.json({ plan: existingPlan.plan, createdAt: existingPlan.createdAt });
    }

    res.json({ plan: null });
  } catch (err) {
    console.error('Error fetching workout plan:', err);
    res.status(500).json({ message: 'Failed to fetch plan' });
  }
});

// Email verification route
app.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // Update the user's email verification status
    user.verified = true;
    user.verificationToken = null;  // Remove the verification token
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now sign in.' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email', error });
  }
});

// Sign In Route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has verified their email
    if (!user.verified) {
      return res.status(400).json({ message: 'Please verify your email address first.' });
    }

    // Compare password with the hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,  // Use an environment variable for security
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Signin successful',
      token,
      userId: user._id, // Returning the userId as well
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
});

// Route to get user profile
app.get('/user/:userId/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
});

// Route to update user profile
app.put('/user/:userId/profile', async (req, res) => {
  const { username, bio, age, weight } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.age = age || user.age;
    user.weight = weight || user.weight;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

// Route to get user workout progress (total calories burned, workout duration, etc.)
app.get('/user/:userId/progress', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all workout history entries for the user
    const workoutHistory = await WorkoutHistory.find({ userId })
      .populate('exerciseId', 'name caloriesPerMinute')  // Populate exercise details (name, calories per minute)
      .exec();

    // Calculate total calories burned and total workout duration
    let totalCaloriesBurned = 0;
    let totalDuration = 0;

    workoutHistory.forEach((entry) => {
      totalCaloriesBurned += entry.caloriesBurned;
      totalDuration += entry.durationMinutes;
    });

    // Prepare data for the progress chart
    const progressData = {
      totalCaloriesBurned,
      totalDuration,
      history: workoutHistory.map(entry => ({
        exerciseName: entry.exerciseId.name,
        caloriesBurned: entry.caloriesBurned,
        startTime: entry.startTime,
      }))
    };

    res.status(200).json(progressData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user progress', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
