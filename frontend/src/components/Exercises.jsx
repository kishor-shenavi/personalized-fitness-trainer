import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [difficulty, setDifficulty] = useState('Easy');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/exercises');
        setExercises(response.data);
        setFilteredExercises(response.data.filter(ex => ex.difficulty === 'Easy'));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    let results = exercises;
    
    // Filter by difficulty
    if (difficulty) {
      results = results.filter(ex => ex.difficulty === difficulty);
    }
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredExercises(results);
  }, [difficulty, searchTerm, exercises]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Exercises</h2>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search exercises..."
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Difficulty Filter */}
      <div className="flex space-x-2 mb-4">
        {['Easy', 'Intermediate', 'Advanced'].map((level) => (
          <button
            key={level}
            className={`px-3 py-1 rounded-lg ${
              difficulty === level 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setDifficulty(level)}
          >
            {level}
          </button>
        ))}
      </div>
      
      {/* Exercises List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <div key={exercise._id} className="border-b border-gray-100 pb-3">
                <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                <p className="text-sm text-gray-500">
                  Difficulty: {exercise.difficulty} | Calories: {exercise.caloriesPerMinute}/min
                </p>
                <a 
                  href={exercise.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  Watch Video
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No exercises found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Exercises;