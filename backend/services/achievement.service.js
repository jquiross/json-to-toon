import AchievementDefinition from '../models/AchievementDefinition.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';

/**
 * Check if user earned an achievement
 */
export const checkAchievement = async (userId, achievementKey, currentValue = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    // Check if already earned
    const alreadyEarned = user.achievements.some(a => a.name === achievementKey);
    if (alreadyEarned) return false;

    const achievement = await AchievementDefinition.findOne({ key: achievementKey });
    if (!achievement) return false;

    // Check if requirement is met
    let requirementMet = false;

    if (typeof achievement.requirement === 'number') {
      requirementMet = currentValue >= achievement.requirement;
    } else if (achievement.requirement === true) {
      requirementMet = true;
    }

    if (requirementMet) {
      // Award achievement
      user.achievements.push({
        name: achievement.key,
        description: achievement.description,
        icon: achievement.icon,
        earnedAt: new Date(),
      });

      // Add experience reward
      user.addExperience(achievement.experienceReward);
      await user.save();

      // Create notification
      await Notification.create({
        recipient: userId,
        type: 'achievement',
        title: 'Achievement Unlocked! 🎮',
        message: `You earned: ${achievement.name}`,
        icon: achievement.icon,
        metadata: { achievement: achievement.toObject() },
      });

      // Emit socket event
      // Note: io instance should be passed via app context
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking achievement:', error);
    return false;
  }
};

/**
 * Initialize default achievements
 */
export const initializeAchievements = async () => {
  const achievements = [
    {
      key: 'first_conversion',
      name: 'Hello TOON!',
      description: 'Perform your first conversion',
      icon: '🎯',
      category: 'conversion',
      requirement: true,
      experienceReward: 50,
      rarity: 'common',
    },
    {
      key: 'conversion_master',
      name: 'Conversion Master',
      description: 'Complete 100 conversions',
      icon: '🏆',
      category: 'conversion',
      requirement: 100,
      experienceReward: 500,
      rarity: 'epic',
    },
    {
      key: 'first_post',
      name: 'Forum Newbie',
      description: 'Create your first forum post',
      icon: '📝',
      category: 'social',
      requirement: true,
      experienceReward: 30,
      rarity: 'common',
    },
    {
      key: 'forum_regular',
      name: 'Forum Regular',
      description: 'Create 50 forum posts',
      icon: '💬',
      category: 'social',
      requirement: 50,
      experienceReward: 300,
      rarity: 'rare',
    },
    {
      key: 'early_adopter',
      name: 'Early Adopter',
      description: 'Join during beta period',
      icon: '🚀',
      category: 'special',
      requirement: true,
      experienceReward: 100,
      rarity: 'legendary',
      isSecret: true,
    },
    {
      key: 'bug_hunter',
      name: 'Bug Hunter',
      description: 'Report 5 bugs',
      icon: '🐛',
      category: 'special',
      requirement: 5,
      experienceReward: 200,
      rarity: 'rare',
    },
    {
      key: 'helpful_citizen',
      name: 'Helpful Citizen',
      description: 'Reach 100 reputation',
      icon: '⭐',
      category: 'social',
      requirement: 100,
      experienceReward: 150,
      rarity: 'rare',
    },
    {
      key: 'level_10',
      name: 'Rising Star',
      description: 'Reach level 10',
      icon: '🌟',
      category: 'milestone',
      requirement: true,
      experienceReward: 250,
      rarity: 'epic',
    },
    {
      key: 'easter_egg_1',
      name: 'Konami Code Master',
      description: 'Enter the legendary code',
      icon: '🎮',
      category: 'special',
      requirement: true,
      experienceReward: 500,
      rarity: 'legendary',
      isSecret: true,
    },
    {
      key: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete a conversion in under 100ms',
      icon: '⚡',
      category: 'conversion',
      requirement: true,
      experienceReward: 100,
      rarity: 'rare',
    },
  ];

  for (const achievement of achievements) {
    await AchievementDefinition.findOneAndUpdate(
      { key: achievement.key },
      achievement,
      { upsert: true, new: true }
    );
  }

  console.log('Achievements initialized');
};
