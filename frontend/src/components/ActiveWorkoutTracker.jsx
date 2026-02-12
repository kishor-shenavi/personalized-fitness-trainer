import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:5000/api';

const ActiveWorkoutTracker = forwardRef(({ fitnessLevel, selectedExerciseId, onExerciseChange,onWorkoutEnd  }, ref) => {
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseTimer, setExerciseTimer] = useState(null);
  const [currentDuration, setCurrentDuration] = useState(0);
  
  useEffect(() => {
    let interval;
    if (exerciseTimer) {
      interval = setInterval(() => {
        setCurrentDuration(Math.floor((new Date() - exerciseTimer) / (1000 * 60)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [exerciseTimer]);

  const startWorkout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/progress/sessions`);
      setActiveSession({
        ...response.data,
        exercises: []
      });
      onExerciseChange(null);
      setExerciseTimer(null);
      setCurrentDuration(0);
    } catch (error) {
      console.error('Error starting workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExercise = async (exercise) => {
    if (!activeSession) return;
    
    // Complete previous exercise if any
    if (selectedExerciseId) {
      await completeExercise(selectedExerciseId);
    }

    const now = new Date();
    setExerciseTimer(now);
    setCurrentDuration(0);
    onExerciseChange(exercise._id);
    
    try {
      const response = await axios.post(
        `${API_BASE}/progress/sessions/${activeSession._id}/exercises`,
        {
          name: exercise.name,
          caloriesPerMinute: exercise.caloriesPerMinute,
          duration: 0,
          exerciseId: exercise._id
        }
      );

      setActiveSession(prev => ({
        ...prev,
        exercises: [...prev.exercises, response.data]
      }));
    } catch (error) {
      console.error('Error adding exercise:', error);
      onExerciseChange(null);
      setExerciseTimer(null);
      setCurrentDuration(0);
    }
  };

  const completeExercise = async (exerciseId) => {
    if (!activeSession || !exerciseTimer) return;
    
    const duration = currentDuration;
    
    try {
      const exercise = activeSession.exercises.find(ex => ex.exerciseId === exerciseId);
      if (!exercise) return;

      await axios.patch(
        `${API_BASE}/progress/sessions/${activeSession._id}/exercises/${exercise._id}`,
        { duration }
      );

      setActiveSession(prev => ({
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex._id === exercise._id ? { ...ex, duration } : ex
        )
      }));
    } catch (error) {
      console.error('Error completing exercise:', error);
    } finally {
      onExerciseChange(null);
      setCurrentDuration(0);
    }
  };
  const endWorkout = async () => {
    if (!activeSession) return;
    
    if (selectedExerciseId) {
      await completeExercise(selectedExerciseId);
    }
    
    try {
      await axios.patch(`${API_BASE}/progress/sessions/${activeSession._id}/end`);
      setActiveSession(null);
      onExerciseChange(null);
      setExerciseTimer(null);
      setCurrentDuration(0);
      
      // Navigate to progress tab after ending
      if (onWorkoutEnd) {
        onWorkoutEnd();
      }
    } catch (error) {
      console.error('Error ending workout:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    addExercise,
    removeExercise: completeExercise,
    isExerciseSelected: (exerciseId) => selectedExerciseId === exerciseId
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {!activeSession ? (
        <button
          onClick={startWorkout}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#003459] text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Starting...' : 'Start Workout Session'}
        </button>
      ) : (
        <div>
          <h3 className="font-bold mb-2">Active Workout</h3>
          <button 
            onClick={endWorkout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm mb-4"
          >
            End Workout
          </button>
          
          {selectedExerciseId && (
            <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-semibold">Currently Doing:</h4>
              <p>
                {activeSession.exercises.find(ex => ex.exerciseId === selectedExerciseId)?.name || 'Exercise'}
                <span className="text-gray-500 ml-2">
                  (Active for {currentDuration} min)
                </span>
              </p>
            </div>
          )}

          {activeSession.exercises.filter(ex => ex.duration > 0).length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Completed Exercises:</h4>
              <ul className="list-disc pl-5">
                {activeSession.exercises
                  .filter(ex => ex.duration > 0)
                  .map((ex, index) => (
                    <li key={index}>
                      {ex.name} - {ex.duration} min ({ex.caloriesPerMinute * ex.duration} cal)
                    </li>
                  ))}
              </ul>
              <p className="font-bold mt-2">
                Total Calories: {activeSession.exercises
                  .reduce((sum, ex) => sum + (ex.caloriesPerMinute * (ex.duration || 0)), 0)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ActiveWorkoutTracker;