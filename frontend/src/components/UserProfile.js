import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    age: '',
    weight: '',
  });

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      // Redirect or show message if userId is not found in localStorage
      alert('User not logged in');
      return;
    }

    // Fetch user profile
    axios.get(`http://localhost:5000/user/${userId}/profile`)
      .then(response => {
        setUser(response.data);
        setFormData({
          username: response.data.username,
          bio: response.data.bio,
          age: response.data.age,
          weight: response.data.weight,
        });
      })
      .catch(error => console.error('Error fetching profile:', error));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user profile
    axios.put(`http://localhost:5000/user/${userId}/profile`, formData)
      .then(response => {
        alert('Profile updated successfully');
        setUser(response.data.user);
      })
      .catch(error => console.error('Error updating profile:', error));
  };

  return (
    <div>
      <h2>User Profile</h2>
      {user && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
