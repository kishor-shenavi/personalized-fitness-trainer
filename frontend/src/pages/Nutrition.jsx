import React, { useState } from 'react';
import axios from 'axios';
import NutritionForm from '../components/NutritionForm';
import WeekPlan from '../components/WeekPlan';
import { useNavigate } from 'react-router-dom';

const Nutrition = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:5000/api/nutrition/generate-plan', {
        ...formData,
        userId: "user123" // You can generate this dynamically
      });
      
      setDietPlan(response.data.dietPlan);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate diet plan');
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className='bg-[#DEF4FC] w-full h-full'>
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

    <div className="container mx-auto px-4 py-8 bg-[#DEF4FC] w-full h-full">
    <div className=' absolute right-[0px] bottom-[0px] w-[400px] h-[450px] rounded-l-[400px]'>
      
      <img src="/ProjectImages/nut4.png" alt="Not found!!" className="rounded-l-[200px] shadow-md h-[350px] w-[350px] absolute bottom-[0px] right-[0px]  "></img>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8  text-[#003459]">Indian Diet Planner</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
    <p className="font-bold">Error:</p>
    <p>{error}</p>
    {error.details && (
      <pre className="text-xs mt-2">{error.details}</pre>
    )}
  </div>
)}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <NutritionForm onSubmit={handleSubmit} />
        </div>
        
        <div className="lg:col-span-3">
          {dietPlan ? (
            <WeekPlan plan={dietPlan} activeDay={activeDay} setActiveDay={setActiveDay} />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No meal plan generated</h3>
              <p>Fill out the form to create your personalized Indian diet plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Nutrition;