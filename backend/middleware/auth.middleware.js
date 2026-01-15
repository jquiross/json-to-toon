import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { AppError } from './errorHandler.js';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return next(new AppError('User no longer exists', 401));
      }

      next();
    } catch (error) {
      return next(new AppError('Token is invalid or has expired', 401));
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, continue without user (public access)
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id).select('-password');
      
      // Only set req.user if user exists and is active
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid or expired - continue without user
      // Don't throw error for optional auth
    }

    next();
  } catch (error) {
    next(error);
  }
};
