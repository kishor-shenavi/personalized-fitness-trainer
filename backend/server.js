// require("dotenv").config();

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
console.log('Environment:', {
  db: process.env.MONGO_URI ? 'Configured' : 'Missing MONGO_URI',
  port: process.env.PORT || 5000
});
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require('./config/db');
const cors = require('cors');
// Add this before your routes

connectDB();
const blogRoutes=require('./routes/blogRoutes');
const contactRoutes =require('./routes/contactRoutes');
const nutritionRoutes = require("./routes/nutritionRoutes");
const DietPlan = require("./models/DietPlan");
const poseRoutes = require('./routes/poseRoutes');
// const Blog = require('./models/Blog'); 

const app = express();
app.use(express.json());
// app.use(cors({
//   origin:[ 'http://localhost:3000', 'http://localhost:3001'], // or your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors({
  origin: 'http://localhost:3000' // Your React app's URL
}));
app.get('/health', (req, res) => {
  res.json({ status: 'OK', dbState: mongoose.connection.readyState });
});

app.use("/api/nutrition", nutritionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blogs',blogRoutes);
app.use('/api/poses', poseRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
// MongoDB Atlas connection with improved options
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
// })
// .then(() => {
//   console.log("✅ MongoDB Atlas Connected");
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// })
// .catch(err => {
//   console.error("❌ MongoDB Atlas Connection Error:", err);
//   process.exit(1);
// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

app.get("/test-db", async (req, res) => {
  try {
    // Test both connection and model
    const testDoc = await DietPlan.findOne({});
    res.json({ 
      status: "success", 
      dbConnection: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      testDoc
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// After all your routes
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});