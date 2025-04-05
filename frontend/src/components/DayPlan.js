import React from 'react';

const DayPlan = ({ day }) => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">{day.day}'s Meal Plan</h3>
      
      <div className="space-y-6">
        {day.meals.map((meal) => (
          <div key={`${day.day}-${meal.meal}`} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h4 className="font-medium">
                {meal.meal} • {meal.time}
              </h4>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Meal Items</h5>
                <ul className="space-y-1">
                  {meal.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-800">• {item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Calories</p>
                  <p className="text-lg font-bold">{meal.calories}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Protein</p>
                  <p className="text-lg font-bold">{meal.nutrition.protein}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Carbs/Fats</p>
                  <p className="text-lg font-bold">
                    {meal.nutrition.carbs} / {meal.nutrition.fats}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayPlan;