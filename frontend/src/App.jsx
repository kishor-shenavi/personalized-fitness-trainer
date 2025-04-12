// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Fitness from './pages/Fitness';
import ProtectedRoute from './components/ProtectedRoute';
import Contact from './pages/Contact';
import Nutrition from './pages/Nutrition';
import Flexibility from './pages/Flexibility';
import { AuthProvider } from "./context/AuthContext";
import BlogPage from "./pages/BlogPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:id" element={<BlogPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/flexibility" element={<Flexibility />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;