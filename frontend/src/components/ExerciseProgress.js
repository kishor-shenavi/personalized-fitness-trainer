import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExerciseProgress = ({ userId }) => {
  const [progress, setProgress] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch workout progress
    axios.get(`http://localhost:5000/user/${userId}/progress`)  // Updated URL to match new endpoint
      .then(response => setProgress(response.data.history)) // Extracting the workout history
      .catch(error => console.error('Error fetching progress:', error));

    return () => {
      // Cleanup function to destroy chart on unmount
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [userId]);

  // Prepare data for the chart
  const chartData = {
    labels: progress.map((entry) => new Date(entry.startTime).toLocaleDateString()),
    datasets: [
      {
        label: 'Calories Burned',
        data: progress.map((entry) => entry.caloriesBurned),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,0.2)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h3>Exercise Progress</h3>
      <Line ref={chartRef} data={chartData} />
    </div>
  );
};

export default ExerciseProgress;
