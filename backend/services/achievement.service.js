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
      title: 'Hello TOON!',
      description: 'Perform your first conversion',
      icon: '🎯',
      category: 'conversion',
      requirements: { type: 'milestone', target: 1 },
      experienceReward: 50,
      reputationReward: 5,
      rarity: 'common',
    },
    {
      key: 'conversion_master',
      title: 'Conversion Master',
      description: 'Complete 100 conversions',
      icon: '🏆',
      category: 'conversion',
      requirements: { type: 'count', target: 100 },
      experienceReward: 500,
      reputationReward: 50,
      rarity: 'epic',
    },
    {
      key: 'first_post',
      title: 'Forum Newbie',
      description: 'Create your first forum post',
      icon: '📝',
      category: 'social',
      requirements: { type: 'milestone', target: 1 },
      experienceReward: 30,
      reputationReward: 10,
      rarity: 'common',
    },
    {
      key: 'forum_regular',
      title: 'Forum Regular',
      description: 'Create 10 forum posts',
      icon: '💬',
      category: 'social',
      requirements: { type: 'count', target: 10 },
      experienceReward: 200,
      reputationReward: 20,
      rarity: 'rare',
    },
    {
      key: 'early_adopter',
      title: 'Early Adopter',
      description: 'One of the first 100 users',
      icon: '🚀',
      category: 'special',
      requirements: { type: 'special', condition: 'early_user' },
      experienceReward: 100,
      reputationReward: 25,
      rarity: 'rare',
    },
    {
      key: 'bug_hunter',
      title: 'Bug Hunter',
      description: 'Report a bug that gets fixed',
      icon: '🐛',
      category: 'special',
      requirements: { type: 'special', condition: 'bug_report' },
      experienceReward: 150,
      reputationReward: 30,
      rarity: 'epic',
    },
    {
      key: 'helpful_citizen',
      title: 'Helpful Citizen',
      description: 'Get 5 upvotes on forum posts',
      icon: '❤️',
      category: 'social',
      requirements: { type: 'count', target: 5 },
      experienceReward: 100,
      reputationReward: 15,
      rarity: 'rare',
    },
    {
      key: 'level_10',
      title: 'Level Master',
      description: 'Reach level 10',
      icon: '🔥',
      category: 'special',
      requirements: { type: 'milestone', target: 10 },
      experienceReward: 300,
      reputationReward: 40,
      rarity: 'epic',
    },
    {
      key: 'easter_egg_1',
      title: 'Secret Hunter',
      description: 'Found a hidden easter egg',
      icon: '✨',
      category: 'special',
      requirements: { type: 'special', condition: 'easter_egg' },
      experienceReward: 75,
      reputationReward: 10,
      rarity: 'rare',
    },
    {
      key: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete a conversion in under 1 second',
      icon: '⚡',
      category: 'conversion',
      requirements: { type: 'special', condition: 'fast_conversion' },
      experienceReward: 200,
      reputationReward: 20,
      rarity: 'legendary',
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
