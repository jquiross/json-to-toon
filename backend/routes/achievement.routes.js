import express from 'express';
import AchievementDefinition from '../models/AchievementDefinition.model.js';
import User from '../models/User.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @desc    Get all achievement definitions
// @route   GET /api/achievements
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const achievements = await AchievementDefinition.find({ isActive: true });
    
    res.json({
      success: true,
      achievements,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user achievements
// @route   GET /api/achievements/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('achievements');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      achievements: user.achievements,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Manually grant achievement (admin only)
// @route   POST /api/achievements/grant
// @access  Private/Admin
router.post('/grant', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const { userId, achievementKey } = req.body;
    const achievement = await AchievementDefinition.findOne({ key: achievementKey });
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already has achievement
    const hasAchievement = user.achievements.some(a => a.name === achievementKey);
    if (hasAchievement) {
      return res.status(400).json({
        success: false,
        message: 'User already has this achievement',
      });
    }

    user.achievements.push({
      name: achievement.key,
      description: achievement.description,
      icon: achievement.icon,
    });

    user.addExperience(achievement.experienceReward);
    await user.save();

    res.json({
      success: true,
      message: 'Achievement granted',
      achievement,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
