import React from 'react';
import DayPlan from './DayPlan';

const WeekPlan = ({ plan, activeDay, setActiveDay }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden relative z-5">
      <div className="bg-[#003459] p-6 text-white">
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
                ? 'border-b-2 border-blue-500 text-[#007EA7] '
                : 'text-gray-600 hover:text-[#00A8E8]'
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