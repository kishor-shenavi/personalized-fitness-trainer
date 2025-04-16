import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const API_BASE = 'http://localhost:5000/api';

const ProgressTracker = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/progress/sessions`);
      // Sort sessions by date (newest first)
      const sortedSessions = response.data.sort((a, b) => 
        new Date(b.startTime) - new Date(a.startTime)
      );
      setSessions(sortedSessions);
    } catch (err) {
      setError('Failed to load workout history');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await axios.delete(`${API_BASE}/progress/sessions/${sessionId}`);
      // Optimistically remove from UI
      setSessions(prev => prev.filter(session => session._id !== sessionId));
    } catch (err) {
      setError('Failed to delete session');
      console.error('Error deleting session:', err);
      fetchSessions(); // Refresh data if delete fails
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">
      {error}
      <button onClick={fetchSessions} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
        Retry
      </button>
    </div>;
  }

  // Create labels with consistent numbering (Session 1, Session 2, etc.)
  const chartLabels = sessions.map((_, index) => `Session ${index + 1}`);

  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Calories Burned',
      data: sessions.map(s => s.exercises.reduce((sum, ex) => sum + (ex.caloriesPerMinute * ex.duration), 0)),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3
    }]
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Workout Progress</h2>
      
      <div className="h-64 mb-6">
        <Line 
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
          }}
        />
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div key={session._id} className="border p-4 rounded-lg relative">
            <button
              onClick={() => deleteSession(session._id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete session"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-semibold pr-6">
              Session {index + 1} - {new Date(session.startTime).toLocaleDateString()}
            </h3>
            <p className="text-gray-600">
              Duration: {session.endTime ? 
                Math.floor((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60)) : 0} minutes | 
              Calories: {session.exercises.reduce((sum, ex) => sum + (ex.caloriesPerMinute * ex.duration), 0)}
            </p>
            <div className="mt-2">
              {session.exercises
                .filter(ex => ex.duration > 0)
                .map((exercise, idx) => (
                  <div key={idx} className="text-sm text-gray-500">
                    • {exercise.name} ({exercise.duration} min) - {exercise.caloriesPerMinute * exercise.duration} cal
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;