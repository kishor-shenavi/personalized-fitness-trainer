// require("dotenv").config();
// const mongoose = require("mongoose");
// const DietPlan = require("./models/DietPlan");

// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log("✅ Connected to MongoDB");

//     await DietPlan.deleteMany({});
//     console.log("🗑️ Deleted old diet plans");

//     mongoose.connection.close();
//   })
//   .catch(err => console.error("❌ MongoDB Error:", err));
