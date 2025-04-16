import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ActiveWorkoutTracker from './ActiveWorkoutTracker';

const ExercisesGrid = ({ setActiveTab }) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [activeLevel, setActiveLevel] = useState('Easy');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const workoutTrackerRef = useRef();
  const [selectedExerciseId, setSelectedExerciseId] = useState(null); // Moved selection state here
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
    
    if (searchTerm) {
      results = results.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeLevel !== 'All') {
      results = results.filter(ex => ex.difficulty === activeLevel);
    }
    
    setFilteredExercises(results);
  }, [searchTerm, activeLevel, exercises]);


  const handleExerciseClick = async (exercise) => {
    if (!workoutTrackerRef.current) return;
    
    try {
      if (selectedExerciseId === exercise._id) {
        setSelectedExerciseId(null);
        await workoutTrackerRef.current.removeExercise(exercise._id);
      } else {
        setSelectedExerciseId(exercise._id);
        await workoutTrackerRef.current.addExercise(exercise);
      }
    } catch (error) {
      console.error('Error handling exercise click:', error);
      setSelectedExerciseId(null);
    }
  };

  const handleVideoClick = (exercise, e) => {
    e.stopPropagation();
    window.open(exercise.videoUrl, '_blank');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Exercise Library</h2>
        
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search exercises..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Easy', 'Intermediate', 'Advanced'].map((level) => (
          <button
            key={level}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeLevel === level
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>

      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredExercises.map((exercise) => (
            <div 
              key={exercise._id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${
                selectedExerciseId === exercise._id
                  ? 'bg-blue-100 border-blue-400 shadow-md transform scale-[1.02]'
                  : 'border-gray-200 hover:shadow-md'
              }`}
              onClick={() => handleExerciseClick(exercise)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg mb-2">{exercise.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  exercise.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Calories: {exercise.caloriesPerMinute}/min
              </p>
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline inline-block mt-2"
                onClick={(e) => handleVideoClick(exercise, e)}
              >
                Watch Demo
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No exercises found matching your criteria
        </div>
      )}

      <div className="mt-6">
      <ActiveWorkoutTracker 
          fitnessLevel={activeLevel}
          ref={workoutTrackerRef}
          selectedExerciseId={selectedExerciseId}
          onExerciseChange={setSelectedExerciseId}
          onWorkoutEnd={() => setActiveTab('progress')} // Add this prop
        />
      </div>
    </div>
  );
};

export default ExercisesGrid;