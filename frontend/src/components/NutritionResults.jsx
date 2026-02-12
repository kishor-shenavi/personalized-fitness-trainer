import React from 'react';

const NutritionResults = ({ plan }) => {
  if (!plan) return null;
 
  return (
    <div className=" rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">Plan Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Plan Type:</span>
          <span className="font-medium capitalize">{plan.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium">7 days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Meals per day:</span>
          <span className="font-medium">
            {plan.days[0]?.meals.length || 3}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NutritionResults;