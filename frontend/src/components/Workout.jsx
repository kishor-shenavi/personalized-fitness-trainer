
// workout.jsx
import React from 'react';

const Workout = ({ plan }) => {
  const formatPlanText = (text) => {
    return text.split('\n').map((paragraph, i) => {
      if (!paragraph.trim()) return <br key={i} />;
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return <h3 key={i} className="text-xl font-bold my-4 text-gray-800">{paragraph.replace(/\*\*/g, '')}</h3>;
      }
      if (paragraph.startsWith('* ')) {
        return <li key={i} className="ml-5 mb-2 text-gray-700 before:content-['•'] before:mr-2 before:text-blue-500">{paragraph.substring(2)}</li>;
      }
      return <p key={i} className="mb-3 text-gray-700 leading-relaxed">{paragraph}</p>;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Personalized Workout Plan</h2>
        {plan.isCached && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
            From Cache
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium text-sm text-blue-600 mb-1">Current Weight</h3>
          <p className="font-bold text-xl text-gray-800">{plan.stats.weight} kg</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-medium text-sm text-green-600 mb-1">Goal Weight</h3>
          <p className="font-bold text-xl text-gray-800">{plan.stats.goalWeight} kg</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-medium text-sm text-purple-600 mb-1">BMI</h3>
          <p className="font-bold text-xl text-gray-800">{plan.stats.bmi}</p>
        </div>
      </div>

      <div className="workout-content bg-gray-50 rounded-lg p-6 mb-6">
        {formatPlanText(plan.plan)}
      </div>

      <div className="mt-6 text-sm text-gray-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Generated on: {new Date(plan.generatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default Workout;