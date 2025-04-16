import React from 'react';
import DayPlan from './DayPlan';

const WeekPlan = ({ plan, activeDay, setActiveDay }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold">{plan.name}</h2>
        <p className="mt-2">{plan.description}</p>
      </div>

      {/* Day Navigation Tabs */}
      <div className="flex overflow-x-auto border-b">
        {plan.days.map((day, index) => (
          <button
            key={day.day}
            onClick={() => setActiveDay(index)}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeDay === index
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* Active Day's Plan */}
      <DayPlan day={plan.days[activeDay]} />
    </div>
  );
};

export default WeekPlan;

// // weekplan.jsx
// import React from 'react';
// import DayPlan from './DayPlan';

// const WeekPlan = ({ plan, activeDay, setActiveDay }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
//       <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
//         <h2 className="text-2xl font-bold">{plan.name}</h2>
//         <p className="mt-2 opacity-90">{plan.description}</p>
//       </div>

//       {/* Day Navigation Tabs */}
//       <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200">
//         {plan.days.map((day, index) => (
//           <button
//             key={day.day}
//             onClick={() => setActiveDay(index)}
//             className={`px-6 py-4 font-medium whitespace-nowrap relative transition-colors ${
//               activeDay === index
//                 ? 'text-blue-600'
//                 : 'text-gray-500 hover:text-blue-500'
//             }`}
//           >
//             {day.day}
//             {activeDay === index && (
//               <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t"></span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Active Day's Plan */}
//       <div className="p-6">
//         <DayPlan day={plan.days[activeDay]} />
//       </div>
//     </div>
//   );
// };

// export default WeekPlan;


// WeekPlan.jsx
// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';

// const WeekPlan = ({ plan }) => {
//   const [expandedDays, setExpandedDays] = useState({});

//   // Parse the plan text to extract days
//   const parsePlan = (planText) => {
//     const days = [];
//     const daySections = planText.split('**Day ');
    
//     // Skip the first section (intro text)
//     for (let i = 1; i < daySections.length; i++) {
//       const dayPart = daySections[i];
//       const dayEnd = dayPart.indexOf('**\n\n');
//       const dayNumber = i;
//       const dayName = dayPart.substring(0, dayEnd);
//       const dayContent = dayPart.substring(dayEnd + 3).trim();
      
//       // Split exercises
//       const exercises = dayContent.split('* ').slice(1).map(ex => ({
//         text: ex.replace(/\n/g, '').trim()
//       }));

//       days.push({
//         dayNumber,
//         name: `Day ${dayNumber}: ${dayName}`,
//         exercises,
//         isRestDay: dayName.toLowerCase().includes('rest')
//       });
//     }

//     return days;
//   };

//   const days = parsePlan(plan.plan);

//   const toggleDay = (dayNumber) => {
//     setExpandedDays(prev => ({
//       ...prev,
//       [dayNumber]: !prev[dayNumber]
//     }));
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
//       <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
//         <h2 className="text-2xl font-bold">Your Weekly Workout Plan</h2>
//         <p className="mt-2 opacity-90">
//           Goal: {plan.stats.weight}kg → {plan.stats.goalWeight}kg (BMI: {plan.stats.bmi})
//         </p>
//       </div>

//       <div className="p-4">
//         {/* Display the introduction text */}
//         <div className="prose prose-sm max-w-none mb-6 text-gray-700">
//           {plan.plan.split('**Day 1:')[0]}
//         </div>

//         {/* Display the days as expandable cards */}
//         <div className="space-y-3">
//           {days.map((day) => (
//             <div 
//               key={day.dayNumber} 
//               className={`border rounded-lg overflow-hidden transition-all duration-200 ${
//                 day.isRestDay ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'
//               }`}
//             >
//               <button
//                 onClick={() => toggleDay(day.dayNumber)}
//                 className={`w-full flex justify-between items-center p-4 text-left ${
//                   expandedDays[day.dayNumber] ? 'bg-opacity-70' : 'hover:bg-opacity-30'
//                 } ${day.isRestDay ? 'bg-yellow-100' : 'bg-blue-100'}`}
//               >
//                 <div className="flex items-center">
//                   <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
//                     day.isRestDay ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
//                   }`}>
//                     {day.dayNumber}
//                   </span>
//                   <h3 className={`font-medium ${
//                     day.isRestDay ? 'text-yellow-800' : 'text-blue-800'
//                   }`}>{day.name}</h3>
//                 </div>
//                 {expandedDays[day.dayNumber] ? (
//                   <ChevronUp className={`h-5 w-5 ${
//                     day.isRestDay ? 'text-yellow-600' : 'text-blue-600'
//                   }`} />
//                 ) : (
//                   <ChevronDown className={`h-5 w-5 ${
//                     day.isRestDay ? 'text-yellow-600' : 'text-blue-600'
//                   }`} />
//                 )}
//               </button>

//               {expandedDays[day.dayNumber] && (
//                 <div className={`p-4 border-t ${
//                   day.isRestDay ? 'border-yellow-200' : 'border-blue-200'
//                 }`}>
//                   <h4 className="font-semibold text-gray-800 mb-3">Exercises:</h4>
//                   <ul className="space-y-2">
//                     {day.exercises.map((exercise, index) => (
//                       <li key={index} className="flex items-start">
//                         <span className={`flex-shrink-0 h-5 w-5 mt-0.5 mr-2 ${
//                           day.isRestDay ? 'text-yellow-500' : 'text-blue-500'
//                         }`}>•</span>
//                         <p className="text-gray-700">{exercise.text}</p>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Display the footer notes */}
//         <div className="mt-6 prose prose-sm max-w-none text-gray-700">
//           {plan.plan.split('**Important Considerations:**')[1]}
//         </div>

//         {plan.isCached && (
//           <div className="mt-4 text-sm text-gray-500 flex items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
//             </svg>
//             This plan was loaded from cache
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WeekPlan;

// import React, { useState } from 'react';

// const WeekPlan = ({ plan }) => {
//   const [activeDayNumber, setActiveDayNumber] = useState(1);

//   const parsePlan = (planText) => {
//     const days = [];
//     const daySections = planText.split('**Day ');

//     for (let i = 1; i < daySections.length; i++) {
//       const dayPart = daySections[i];
//       const dayEnd = dayPart.indexOf('**\n\n');
//       const dayNumber = i;
//       const dayName = dayPart.substring(0, dayEnd);
//       const dayContent = dayPart.substring(dayEnd + 3).trim();

//       const exercises = dayContent.split('* ').slice(1).map(ex => ({
//         text: ex.replace(/\n/g, '').trim()
//       }));

//       days.push({
//         dayNumber,
//         name: `Day ${dayNumber}: ${dayName}`,
//         exercises,
//         isRestDay: dayName.toLowerCase().includes('rest')
//       });
//     }

//     return days;
//   };

//   const days = parsePlan(plan.plan);
//   const activeDay = days.find(d => d.dayNumber === activeDayNumber);

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
//       <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
//         <h2 className="text-2xl font-bold">Your Weekly Workout Plan</h2>
//         <p className="mt-2 opacity-90">
//           Goal: {plan.stats.weight}kg → {plan.stats.goalWeight}kg (BMI: {plan.stats.bmi})
//         </p>
//       </div>

//       <div className="p-4">
//         {/* Day Selector */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           {days.map((day) => (
//             <button
//               key={day.dayNumber}
//               onClick={() => setActiveDayNumber(day.dayNumber)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
//                 ${activeDayNumber === day.dayNumber
//                   ? day.isRestDay 
//                     ? 'bg-yellow-500 text-white border-yellow-600'
//                     : 'bg-blue-600 text-white border-blue-700'
//                   : day.isRestDay 
//                     ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
//                     : 'bg-blue-100 text-blue-800 border-blue-300'
//                 }`}
//             >
//               {day.name}
//             </button>
//           ))}
//         </div>

//         {/* Selected Day Content */}
//         <div className="bg-gray-50 rounded-lg p-6 border">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">{activeDay.name}</h3>
//           <ul className="space-y-2">
//             {activeDay.exercises.length > 0 ? (
//               activeDay.exercises.map((exercise, idx) => (
//                 <li key={idx} className="flex items-start">
//                   <span className={`h-5 w-5 mt-0.5 mr-2 ${
//                     activeDay.isRestDay ? 'text-yellow-500' : 'text-blue-500'
//                   }`}>•</span>
//                   <p className="text-gray-700">{exercise.text}</p>
//                 </li>
//               ))
//             ) : (
//               <p className="text-gray-600">Rest day — no exercises today.</p>
//             )}
//           </ul>
//         </div>

//         {/* Footer note */}
//         <div className="mt-6 prose prose-sm max-w-none text-gray-700">
//           {plan.plan.split('**Important Considerations:**')[1]}
//         </div>

//         {plan.isCached && (
//           <div className="mt-4 text-sm text-gray-500 flex items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
//             </svg>
//             This plan was loaded from cache
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WeekPlan;
