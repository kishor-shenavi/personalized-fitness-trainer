import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // Message to show to user
  const [loading, setLoading] = useState(false);  // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent further submission if already loading
    if (loading) return;

    setLoading(true);  // Set loading to true when submitting the form

    const userData = { username, email, password };

    try {
      const response = await axios.post('http://localhost:5000/signup', userData);
      setMessage(response.data.message); // Show the confirmation message

      // Redirect user to Sign In page after successful sign-up
      setTimeout(() => {
        navigate('/signin'); // Redirect to sign-in page after 2 seconds
      }, 2000);  // Wait for 2 seconds before redirect

    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);  // Set loading back to false after request completes
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      {/* Display message to the user */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;
