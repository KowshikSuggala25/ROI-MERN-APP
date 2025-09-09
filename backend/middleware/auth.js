import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // cleaner than replace
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    const user = await User.findById(decoded.id); 
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Attach minimal safe payload
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Admin access required' });
};

const weekdayMiddleware = (req, res, next) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return res.status(400).json({
      message: 'Withdrawals are only allowed on weekdays (Monday to Friday)',
    });
  }

  next();
};

export { authMiddleware, adminMiddleware, weekdayMiddleware };
