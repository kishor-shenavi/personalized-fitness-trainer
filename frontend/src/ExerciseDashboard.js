import React, { useState } from 'react';
import axios from 'axios';

function ExerciseDashboard({ token }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState('');

  const calculateBMI = (weight, height) => {
    return (weight / ((height / 100) ** 2)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bmi = calculateBMI(weight, height);

    try {
      const response = await axios.post(
        'http://localhost:5000/workout-plan',
        { weight, height, goalWeight, bmi },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkoutPlan(response.data.plan);
    } catch (err) {
      console.error('Error fetching workout plan', err);
    }
  };

  return (
    <div>
      <h2>Get Your Personalized Workout Plan</h2>
      <form onSubmit={handleSubmit}>
        <label>Current Weight (kg):</label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        <br />
        <label>Height (cm):</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
        <br />
        <label>Goal Weight (kg):</label>
        <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} required />
        <br />
        <button type="submit">Generate Plan</button>
      </form>

      {workoutPlan && (
        <div>
          <h3>Your Workout Plan:</h3>
          <pre>{workoutPlan}</pre>
        </div>
      )}
    </div>
  );
}

export default ExerciseDashboard;
