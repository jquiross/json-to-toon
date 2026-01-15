import express from 'express';
import User from '../models/User.model.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public (but enhanced for authenticated users)
router.get('/leaderboard', optionalAuth, async (req, res, next) => {
  try {
    const { type = 'reputation', limit = 10 } = req.query;

    let sortField = 'reputation';
    let selectFields = 'username avatar level reputation experience conversionsCount forumPostsCount achievements';

    // Set sort field based on type
    switch(type) {
      case 'level': sortField = 'level'; break;
      case 'experience': sortField = 'experience'; break;
      case 'conversions': sortField = 'conversionsCount'; break;
      case 'posts': sortField = 'forumPostsCount'; break;
      default: sortField = 'reputation';
    }

    // Get leaderboard users
    const users = await User.find({ isActive: true })
      .select(selectFields)
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    // Get total user count for percentage calculation
    const totalUsers = await User.countDocuments({ isActive: true });

    // If user is authenticated, get their position
    let userPosition = null;
    if (req.user) {
      const userRank = await User.countDocuments({
        isActive: true,
        [sortField]: { $gt: req.user[sortField] }
      }) + 1;

      userPosition = {
        rank: userRank,
        user: {
          _id: req.user._id,
          username: req.user.username,
          [sortField]: req.user[sortField]
        }
      };
    }

    res.json({
      success: true,
      users: users,
      totalUsers,
      userPosition,
      leaderboardType: type
    });
  } catch (error) {
    next(error);
  }
});

// All routes below are protected
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

export default router;
