import express from 'express';
import User from '../models/User.model.js';
import { protect } from '../middleware/auth.middleware.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-refreshToken');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
router.put('/profile', async (req, res, next) => {
  try {
    const { username, bio, avatar, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user stats
// @route   GET /api/users/:id/stats
router.get('/:id/stats', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const stats = {
      level: user.level,
      experience: user.experience,
      reputation: user.reputation,
      conversionsCount: user.conversionsCount,
      forumPostsCount: user.forumPostsCount,
      achievements: user.achievements.length,
      memberSince: user.createdAt,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { type = 'reputation', limit = 10 } = req.query;

    let sortField = 'reputation';
    if (type === 'level') sortField = 'level';
    if (type === 'conversions') sortField = 'conversionsCount';

    const users = await User.find({ isActive: true })
      .select('username avatar level reputation conversionsCount achievements')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      leaderboard: users,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
