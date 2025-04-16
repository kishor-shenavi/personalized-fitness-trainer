// workout.jsx
import React, { useState } from 'react';

const Workout = ({ plan }) => {
  const [activeDay, setActiveDay] = useState(0); // Start with Day 1 (index 0)

  const renderExercise = (exercise) => {
    return (
      <div key={exercise.name} className="mb-4 pl-4 border-l-2 border-blue-200">
        <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
        {exercise.description && <p className="text-gray-600 text-sm mb-2">{exercise.description}</p>}
        <div className="text-gray-700 text-sm">
          {exercise.sets.count > 1 && <span>{exercise.sets.count} sets</span>}
          {exercise.sets.minReps && <span> of {exercise.sets.minReps}-{exercise.sets.maxReps} reps</span>}
          {exercise.sets.duration && <span> for {exercise.sets.duration}</span>}
          {exercise.sets.rest && <span>, rest {exercise.sets.rest} between sets</span>}
        </div>
      </div>
    );
  };

  const renderSection = (section) => {
    return (
      <div key={section.name} className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">
            {section.name === 'Warm-up' ? '🔥' : section.name === 'Workout' ? '💪' : '🧘'}
          </span>
          {section.name} - {section.duration}
        </h3>
        <div className="pl-2">
          {section.exercises.map(renderExercise)}
        </div>
      </div>
    );
  };

  const renderDayTab = (day, index) => {
    return (
      <button
        key={day.dayNumber}
        onClick={() => setActiveDay(index)}
        className={`px-4 py-2 rounded-lg mr-2 mb-2 ${activeDay === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        Day {day.dayNumber}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{plan.plan.overview}</h2>
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

      {/* Day Tabs */}
      <div className="flex flex-wrap mb-6">
        {plan.plan.days.map(renderDayTab)}
      </div>

      {/* Active Day Content */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Day {plan.plan.days[activeDay].dayNumber}: {plan.plan.days[activeDay].title}</h2>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
            {plan.plan.days[activeDay].focus}
          </span>
        </div>
        {plan.plan.days[activeDay].sections.map(renderSection)}
      </div>

      {plan.plan.notes && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{plan.plan.notes}</p>
            </div>
          </div>
        </div>
      )}

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



































// // workout.jsx
// import React from 'react';

// const Workout = ({ plan }) => {
//   const formatPlanText = (text) => {
//     return text.split('\n').map((paragraph, i) => {
//       if (!paragraph.trim()) return <br key={i} />;
//       if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
//         return <h3 key={i} className="text-xl font-bold my-4 text-gray-800">{paragraph.replace(/\*\*/g, '')}</h3>;
//       }
//       if (paragraph.startsWith('* ')) {
//         return <li key={i} className="ml-5 mb-2 text-gray-700 before:content-['•'] before:mr-2 before:text-blue-500">{paragraph.substring(2)}</li>;
//       }
//       return <p key={i} className="mb-3 text-gray-700 leading-relaxed">{paragraph}</p>;
//     });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 transition-all hover:shadow-xl">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Your Personalized Workout Plan</h2>
//         {plan.isCached && (
//           <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
//             </svg>
//             From Cache
//           </span>
//         )}
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//         <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//           <h3 className="font-medium text-sm text-blue-600 mb-1">Current Weight</h3>
//           <p className="font-bold text-xl text-gray-800">{plan.stats.weight} kg</p>
//         </div>
//         <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//           <h3 className="font-medium text-sm text-green-600 mb-1">Goal Weight</h3>
//           <p className="font-bold text-xl text-gray-800">{plan.stats.goalWeight} kg</p>
//         </div>
//         <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
//           <h3 className="font-medium text-sm text-purple-600 mb-1">BMI</h3>
//           <p className="font-bold text-xl text-gray-800">{plan.stats.bmi}</p>
//         </div>
//       </div>

//       <div className="workout-content bg-gray-50 rounded-lg p-6 mb-6">
//         {formatPlanText(plan.plan)}
//       </div>

//       <div className="mt-6 text-sm text-gray-500 flex items-center">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//         </svg>
//         Generated on: {new Date(plan.generatedAt).toLocaleString()}
//       </div>
//     </div>
//   );
// };

// export default Workout;