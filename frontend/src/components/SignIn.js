import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
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

    try {
      const response = await axios.post('http://localhost:5000/signin', { email, password });
      
      // Store token and user ID in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);

      // Redirect to home page after successful sign-in
      navigate('/');

    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);  // Set loading back to false after request completes
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Display message to the user */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;
