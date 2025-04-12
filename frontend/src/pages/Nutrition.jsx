import React, { useState } from 'react';
import axios from 'axios';
import NutritionForm from '../components/NutritionForm';
import WeekPlan from '../components/WeekPlan';

const Nutrition = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(0);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Indian Diet Planner</h1>
      
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
  );
};

export default Nutrition;