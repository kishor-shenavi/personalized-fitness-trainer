// src/services/api.js
const API_BASE_URL = "http://localhost:5000/api";

// Auth functions
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Nutrition functions
export const getNutritionData = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/nutrition/${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return response.json();
};

export const updateNutrition = async (data) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/nutrition`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const fetchMealPlan = async ({ calorieGoal, dietPreference }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/nutrition/generate-plan`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ calorieGoal, dietPreference }),
  });
  return response.json();
};

export const getDailyPlan = async (userId, day) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/nutrition/daily/${userId}/${day}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return response.json();
};