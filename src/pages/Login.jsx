import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center">Enter your login credentials</h2>
        <div className="mt-4">
          <label className="block">Username:</label>
          <input type="text" className="w-full p-2 border rounded-md" />
        </div>
        <div className="mt-4">
          <label className="block">Password:</label>
          <input type="password" className="w-full p-2 border rounded-md" />
        </div>
        <button className="mt-4 bg-blue-500 text-white w-full p-2 rounded-md">Submit</button>
        <p className="mt-4 text-center">
          Not registered? <Link to="/signup" className="text-blue-500 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
