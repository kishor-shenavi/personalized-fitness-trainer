import React from 'react';
import PropTypes from 'prop-types';

const MealCard = ({ mealType, meal }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition">
    <h3 className="text-lg font-bold capitalize mb-3">{mealType}</h3>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3 bg-gray-100 rounded-lg flex items-center justify-center h-48">
        <img
          src={meal.image}
          alt={meal.name}
          className="h-full w-full object-cover rounded-lg"
          onError={(e) => {
            e.target.src = process.env.REACT_APP_DEFAULT_MEAL_IMAGE || '/meal-placeholder.jpg';
            e.target.className = 'h-full w-full object-contain p-4 bg-gray-100 rounded-lg';
          }}
        />
      </div>
      <div className="flex-1">
        <h4 className="text-xl font-semibold">{meal.name}</h4>
        <p className="text-gray-600 mt-1">{meal.calories} calories</p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <span className="text-sm">Protein: {meal.protein}g</span>
          <span className="text-sm">Carbs: {meal.carbs}g</span>
          <span className="text-sm">Fats: {meal.fats}g</span>
        </div>
        {meal.ingredients && (
          <div className="mt-3">
            <h5 className="font-medium mb-1">Ingredients:</h5>
            <ul className="list-disc list-inside text-gray-700">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

MealCard.propTypes = {
  mealType: PropTypes.string.isRequired,
  meal: PropTypes.shape({
    name: PropTypes.string,
    calories: PropTypes.number,
    protein: PropTypes.number,
    carbs: PropTypes.number,
    fats: PropTypes.number,
    ingredients: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
  }).isRequired,
};

export default MealCard;