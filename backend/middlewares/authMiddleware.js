const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🔥 Raw token from header:', token); 
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }
  console.log("🧾 Request headers:", req.headers);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }
};



// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// exports.protect = async (req, res, next) => {
//   let token;

//   // Check both Authorization header and cookies
//   if (req.headers.authorization?.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies?.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     return res.status(401).json({ 
//       success: false, 
//       message: 'Not authorized, no token' 
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err);
//     return res.status(401).json({ 
//       success: false, 
//       message: 'Not authorized, token failed' 
//     });
//   }
// };