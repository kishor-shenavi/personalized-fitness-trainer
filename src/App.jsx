import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
//import Navbar from "./components/Navbar";
import Fitness from './pages/Fitness';
import Nutrition from './pages/Nutrition';
import Flexibility from './pages/Flexibility';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/fitness" element={<Fitness />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/flexibility" element={<Flexibility />} />
      </Routes>
    </Router>
  );
}

export default App;
