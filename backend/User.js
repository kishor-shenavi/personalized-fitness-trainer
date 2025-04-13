const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,  // Adding validation
    minlength: 3,    // Minimum length of username
  },
  email: {
    type: String,
    required: true,
    unique: true,    // Ensure email is unique
    //match: [/^[a-zA-Z0-9._%+-]+@(gmail\.com|google\.com)$/, 'Please provide a valid Google email address.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,    // Minimum password length
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: String,

  // New fields for user profile
  bio: { type: String, default: '' },        // Bio field for user
  age: { type: Number, min: 0, default: null }, // Age of the user (optional)
  weight: { type: Number, min: 0, default: null }, // Weight of the user (optional)

  // You can also add a profile picture if needed
  profilePicture: { type: String, default: '' }, // URL of the profile picture
});

// Add method to compare passwords
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Add method to update user profile
userSchema.methods.updateProfile = async function (updateData) {
  // Validating the updated data
  if (updateData.username) this.username = updateData.username;
  if (updateData.bio) this.bio = updateData.bio;
  if (updateData.age) this.age = updateData.age;
  if (updateData.weight) this.weight = updateData.weight;
  if (updateData.profilePicture) this.profilePicture = updateData.profilePicture;

  // Save the updated user document
  return await this.save();
};

module.exports = mongoose.model('User', userSchema);
