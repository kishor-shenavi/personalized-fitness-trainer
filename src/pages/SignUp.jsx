import React from "react";
import { Link } from "react-router-dom";
function Signup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center">Create an Account</h2>

        <div className="mt-4">
          <label className="block">Username:</label>
          <input type="text" className="w-full p-2 border rounded-md" />
        </div>

        <div className="mt-4">
          <label className="block">Email ID:</label>
          <input type="email" className="w-full p-2 border rounded-md" />
        </div>

        <div className="mt-4">
          <label className="block">Phone Number:</label>
          <input type="tel" className="w-full p-2 border rounded-md" />
        </div>

        <div className="mt-4">
          <label className="block">Age:</label>
          <input type="number" className="w-full p-2 border rounded-md" />
        </div>

        <div className="mt-4">
          <label className="block">Gender:</label>
          <select className="w-full p-2 border rounded-md">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block">Current Weight:</label>
          <input type="number" className="w-full p-2 border rounded-md" />
        </div>

        <div className="mt-4">
          <label className="block">Target Weight:</label>
          <input type="number" className="w-full p-2 border rounded-md" />
        </div>

        {/* Diet Preference */}
        <div className="mt-4">
          <label className="block">Diet Preference:</label>
          <select className="w-full p-2 border rounded-md">
            <option>Vegetarian</option>
            <option>Non-Vegetarian</option>
            <option>Eggitarian</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block">Password:</label>
          <input type="password" className="w-full p-2 border rounded-md" />
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <label className="block">Confirm Password:</label>
          <input type="password" className="w-full p-2 border rounded-md" />
        </div>

        <Link to="/" className="mt-4 bg-blue-500 text-white w-full p-2 rounded-md">Submit</Link>
      </div>
    </div>
  );
}

export default Signup;
