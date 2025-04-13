import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// Example components for each route
import Home from './components/Home';
import ExerciseList from './components/ExerciseList';
import WorkoutHistory from './components/WorkoutHistory';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import ExerciseProgress from './components/ExerciseProgress';
import GeneratePlan from './components/GeneratePlan'; // Import GeneratePlan component

// Backend Gemini route setup (optional depending on backend structure)
axios.defaults.baseURL = 'http://localhost:5000'; // Set base URL for convenience

const App = () => {
  const [user, setUser] = useState(null);

  // Check if there's a stored token (for maintaining user session)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token) {
      axios
        .get(`/user/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setUser(response.data))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/exercises">Exercises</Link></li>
            <li><Link to="/history">Workout History</Link></li>
            <li><Link to="/generate-plan">Generate Plan</Link></li> {/* Add link to Generate Plan */}
            {user && <li><Link to="/profile">Profile</Link></li>}
            {user && <li><Link to="/progress">Exercise Progress</Link></li>}
            {!user ? (
              <>
                <li><Link to="/signin">Sign In</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </>
            ) : (
              <li><button onClick={handleLogout}>Logout</button></li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<ExerciseList />} />
          <Route path="/history" element={<WorkoutHistory />} />
          <Route path="/generate-plan" element={<GeneratePlan />} /> {/* Add route */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/profile" 
            element={<UserProfile user={user} setUser={setUser} />} 
          />
          {user && (
            <Route 
              path="/progress" 
              element={<ExerciseProgress userId={user._id} />} 
            />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
