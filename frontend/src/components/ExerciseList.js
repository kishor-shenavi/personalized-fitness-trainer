import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);  // Store the list of exercises
  const [selectedExercise, setSelectedExercise] = useState(null);  // Store selected exercise to inspect
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);  // Track if the exercise has started
  const [videoUrl, setVideoUrl] = useState('');  // Store the URL of the video for the exercise
  const [difficulty, setDifficulty] = useState('Medium');  // Track selected difficulty level (default to 'Medium')

  // Fetch exercises from backend based on selected difficulty
  useEffect(() => {
    axios.get(`http://localhost:5000/exercises/${difficulty}`)  // Modify URL to use the selected difficulty
      .then(response => setExercises(response.data))
      .catch(error => console.error('Error fetching exercises:', error));
  }, [difficulty]);  // Re-run the effect when difficulty changes

  // Handle the Inspect button click
  const handleInspectExercise = (exerciseId, videoUrl) => {
    setSelectedExercise(exerciseId);
    setVideoUrl(videoUrl);  // Set the URL for the video
  };

  // Handle the Start button click
  const handleStartExercise = (exerciseId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Please log in to start an exercise.");
      return;
    }

    // Call backend to start the exercise
    axios.post(`http://localhost:5000/user/${userId}/exercise/${exerciseId}/start`)
      .then(response => {
        console.log('Exercise started:', response.data);
        setIsExerciseStarted(true);  // Exercise has started
      })
      .catch(error => {
        console.error('Error starting exercise:', error);
        alert("There was an error starting the exercise.");
      });
  };

  // Handle the End button click
  const handleCompleteExercise = (exerciseId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Please log in to complete the exercise.");
      return;
    }

    // Call backend to complete the exercise
    axios.post(`http://localhost:5000/user/${userId}/exercise/${exerciseId}/complete`)
      .then(response => {
        console.log('Exercise completed:', response.data);
        alert("Exercise completed successfully.");
        setIsExerciseStarted(false);  // Reset the started state
        setSelectedExercise(null);  // Reset the selected exercise
        setVideoUrl('');  // Reset video URL
      })
      .catch(error => {
        console.error('Error completing exercise:', error);
        alert("There was an error completing the exercise.");
      });
  };

  // Check if the video URL is from YouTube or Vimeo and render the appropriate tag
  const renderVideo = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // YouTube embed URL
      const videoId = new URL(url).searchParams.get("v") || url.split("/").pop();
      return (
        <iframe 
          width="80%" 
          height="400" 
          src={`https://www.youtube.com/embed/${videoId}`} 
          frameBorder="0" 
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen>
        </iframe>
      );
    } else if (url.includes("vimeo.com")) {
      // Vimeo embed URL
      const videoId = url.split("/").pop();
      return (
        <iframe 
          src={`https://player.vimeo.com/video/${videoId}`} 
          width="80%" 
          height="400" 
          frameBorder="0" 
          allow="autoplay; fullscreen" 
          allowFullScreen>
        </iframe>
      );
    } else {
      // If it's a direct video URL (e.g., .mp4), use the video tag
      return (
        <video width="80%" controls>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <div>
      <h2>Exercises</h2>
      
      {/* Difficulty Buttons */}
      <div>
        <button onClick={() => setDifficulty('Easy')}>Easy</button>
        <button onClick={() => setDifficulty('Intermediate')}>Intermediate</button>
        <button onClick={() => setDifficulty('Advanced')}>Advanced</button>
      </div>

      {/* Exercise List */}
      <ul>
        {exercises.map(exercise => (
          <li key={exercise._id}>
            {exercise.name} - {exercise.difficulty} (Calories per minute: {exercise.caloriesPerMinute})
            <button onClick={() => handleInspectExercise(exercise._id, exercise.videoUrl)}>
              Inspect
            </button>
          </li>
        ))}
      </ul>

      {/* Exercise Inspection and Start */}
      {selectedExercise && !isExerciseStarted && (
        <div className="exercise-inspection">
          <h3>Inspect Exercise</h3>
          <div className="video-container" style={{ textAlign: 'center' }}>
            {renderVideo(videoUrl)}  {/* Render video or iframe based on URL */}
          </div>
          <button onClick={() => handleStartExercise(selectedExercise)}>
            Start Exercise
          </button>
        </div>
      )}

      {/* Exercise In Progress */}
      {isExerciseStarted && (
        <div className="exercise-controls">
          <h3>Exercise In Progress</h3>
          <div className="video-container" style={{ textAlign: 'center' }}>
            {renderVideo(videoUrl)}  {/* Render video or iframe based on URL */}
          </div>
          <button onClick={() => handleCompleteExercise(selectedExercise)}>
            End Exercise
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
