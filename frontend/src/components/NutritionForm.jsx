import React, { useState } from 'react';

const NutritionForm = ({ initialData = {}, onSubmit }) => {
  // Provide default empty object if initialData not passed
  const [formData, setFormData] = useState({
    age: initialData.age || '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'moderate',
    targetWeight: '',
    dietPreference: 'veg'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Nutrition Calculator</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Age (years)</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              min="10"
              max="100"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              min="30"
              max="200"
              step="0.1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              min="100"
              max="250"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Activity Level</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="veryActive">Very Active</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Target Weight (kg)</label>
            <input
              type="number"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              min="30"
              max="200"
              step="0.1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Diet Preference</label>
            <select
              name="dietPreference"
              value={formData.dietPreference}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="veg">Vegetarian</option>
              <option value="nonveg">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition mt-4"
        >
          {initialData ? 'Update Plan' : 'Calculate Nutrition'}
        </button>
      </form>
    </div>
  );
};

export default NutritionForm;