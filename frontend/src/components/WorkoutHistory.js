import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkoutHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');  // Retrieve userId from localStorage
    if (token && userId) {
      // Modify API URL to include userId
      axios.get(`http://localhost:5000/user/${userId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setHistory(response.data))
        .catch(error => console.error('Error fetching workout history:', error));
    } else {
      console.error("User is not logged in.");
    }
  }, []);

  return (
    <div>
      <h2>Workout History</h2>
      <ul>
        {history.map(item => (
          <li key={item._id}>
            {item.exerciseId.name} - {item.durationMinutes} mins (Calories Burned: {item.caloriesBurned})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutHistory;
