import mongoose from 'mongoose';

const achievementDefinitionSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['conversion', 'social', 'special'],
    required: true,
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  requirements: {
    type: {
      type: String,
      enum: ['count', 'milestone', 'special'],
    },
    target: Number,
    condition: String
  },
  experienceReward: {
    type: Number,
    default: 0,
  },
  reputationReward: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('AchievementDefinition', achievementDefinitionSchema);
