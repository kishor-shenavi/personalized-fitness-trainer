import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeneratePlan = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRecentPlan, setHasRecentPlan] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchExistingPlan = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/get-plan/${userId}`);
        if (res.data?.plan) {
          setPlan(res.data.plan);
          setHasRecentPlan(true);

          // Calculate remaining time
          const createdAt = new Date(res.data.createdAt);
          const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
          const remaining = expiresAt - Date.now();

          if (remaining > 0) {
            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((remaining / (1000 * 60)) % 60);
            setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
          }
        } else {
          setHasRecentPlan(false);
        }
      } catch (err) {
        console.error('Error fetching existing plan:', err);
      }
    };

    fetchExistingPlan();
  }, []);

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bmi = calculateBMI(weight, height);
    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.post('http://localhost:5000/generate-plan', {
        userId,
        weight,
        height,
        goalWeight,
        bmi,
      });

      if (response.data?.plan) {
        setPlan(response.data.plan);
        setHasRecentPlan(true);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate plan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Your Weekly Workout Plan</h2>

      {hasRecentPlan && plan ? (
        <div
          style={{
            marginTop: '2rem',
            whiteSpace: 'pre-wrap',
            backgroundColor: '#f4f4f4',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <h3>Personalized Plan (valid for 7 days):</h3>
          {timeRemaining && <p><strong>Time Remaining:</strong> {timeRemaining}</p>}
          <p>{plan}</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Goal Weight (kg)"
            value={goalWeight}
            onChange={(e) => setGoalWeight(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Plan'}
          </button>
        </form>
      )}
    </div>
  );
};

export default GeneratePlan;
