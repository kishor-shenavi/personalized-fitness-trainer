// src/utils/errorHandler.js
export const handleAuthError = (error) => {
    const errorMap = {
      'Invalid credentials': 'Email or password is incorrect',
      'User already exists': 'An account with this email already exists',
      // Add more mappings as needed
    };
    
    return errorMap[error] || error || 'An unexpected error occurred';
  };