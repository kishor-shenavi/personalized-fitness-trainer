import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      signIn(data.user);
      
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#DEF4FC]">

      <div className="bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#003459] absolute h-[625px] w-[1300px] right-[0px] top-[125px] rounded-l-[300px]"> </div>

      <nav className=" text-black   flex justify-between items-center ">

         {/* Logo */}
         <div className="text-2xl font-bold  absolute top-[10px] left-[10px] ">
         <div className="w-[100px] absolute top-[0px]">
      <img src="/ProjectImages/logo.png"></img>
     </div>
         </div>
      
      {/* Navigation Links */}
      <ul className="flex space-x-[75px] ml-[150px] text-xl  absolute top-[10px] right-[480px]">
        <li><Link to="/" className="hover:text-[#007EA7]">Home</Link></li>
        <li> <button onClick={scrollToAbout} className="hover:text-[#007EA7]">
            About Us
          </button></li>
        <li><Link to="/contact" className="hover:text-[#007EA7]">Contact Us</Link></li>
        <li><Link to="/blogs" className="hover:text-[#007EA7]">Blogs</Link></li>
      </ul>
      </nav>
      <div className="bg-white p-6 rounded-[20px] shadow-lg w-96 relative z-5 w-[800px] left-[10px]">
        <h2 className="text-xl font-semibold text-center">Enter your login credentials</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block ">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#003459] text-white w-full p-2 rounded-md ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-4 text-center">
        Not registered? <Link to="/signup" className="text-[#007EA7] hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;