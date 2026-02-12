

// fitness.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import Workout from '../components/Workout';
//import WeekPlan from '../components/WeekPlan';
import Workout from '../components/Workout';
// Add this import at the top
//import Exercises from '../components/Exercises';
import ExercisesGrid from '../components/ExercisesGrid';
//import WeekPlan from '../components/WeekPlan';
import ProgressTracker from '../components/ProgressTracker';
function Fitness() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('generator');
  const navigate = useNavigate();
//  const [activeTab, setActiveTab] = useState('generator'); 
  //const [showExercises, setShowExercises] = useState(false);
  const [formData, setFormData] = useState({
    weight: 70,
    height: 175,
    goalWeight: 65,
    fitnessLevel: 'Intermediate',
  });

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to generate a workout plan');
      }
  
      // Clear previous plan while loading
      setWorkoutPlan(null);
  
      // Add cache busting parameter
      // const params = {
      //   ...formData,
      //   timestamp: new Date().getTime()  // Ensures unique request
      // };
      const response = await axios.post(
        'http://localhost:5000/api/workout/generate-plan',
        {
          weight: formData.weight,
          height: formData.height,
          goalWeight: formData.goalWeight,
          fitnessLevel: formData.fitnessLevel
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // const response = await axios.post(
      //   'http://localhost:5000/api/workout/generate-plan',
      //   params,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`
      //     }
      //   }
      // );
  
      // Force fresh data in UI
      setWorkoutPlan({
        ...response.data,
        isCached: false,
        generatedAt: new Date().toISOString()
      });
  
    } catch (err) {
      // Error handling remains same
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleBackToHome = () => {
    navigate('/');
  };

return (
  <div className="min-h-screen bg-[#DEF4FC] py-12 px-4 sm:px-6 lg:px-8">
     <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors absolute top-[20px] left-[20px]"
              aria-label="Back to home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
  <div className="max-w-7xl mx-auto">
    {/* Toggle Buttons */}
    <div className="flex justify-center mb-6 space-x-2 gap-16">
      <button onClick={() => setActiveTab('generator')} className={`px-4 py-2 rounded-lg ${activeTab === 'generator' ? 'bg-[#003459] text-white' : 'bg-gray-200 text-gray-700'}`}>
        Workout Generator
      </button>
      <button onClick={() => setActiveTab('library')} className={`px-4 py-2 rounded-lg ${activeTab === 'library' ? 'bg-[#003459]  text-white' : 'bg-gray-200 text-gray-700'}`}>
        Exercise Library
      </button>
      <button onClick={() => setActiveTab('progress')} className={`px-4 py-2 rounded-lg ${activeTab === 'progress' ? 'bg-[#003459]  text-white' : 'bg-gray-200 text-gray-700'}`}>
        My Progress
      </button>
    </div>

    {activeTab === 'library' ? (
      <ExercisesGrid setActiveTab={setActiveTab} />
    ) : activeTab === 'progress' ? (
      <ProgressTracker />
    ) :(
      <div className="max-w-3xl mx-auto">
        {/* Your existing workout generator UI */}
        <div className="text-center mb-10 mt-16">
          <h1 className="text-4xl font-extrabold text-[#003459]  mb-2">Workout Plan Generator</h1>
          <p className="text-lg text-gray-600">Get your personalized fitness plan in seconds</p>
        </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Create Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  min="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  min="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Weight (kg)</label>
                <input
                  type="number"
                  name="goalWeight"
                  value={formData.goalWeight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  min="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <button
              onClick={fetchWorkoutPlan}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#003459] text-white py-3 px-6 rounded-lg font-medium hover:to-[#007EA7]  disabled:opacity-70 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Plan'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {workoutPlan && (
            <Workout plan={workoutPlan} />
          )}
        </div>
      )}
    </div>
  </div>
);

}

export default Fitness;