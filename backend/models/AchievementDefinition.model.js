import mongoose from 'mongoose';

const achievementDefinitionSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
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
    enum: ['conversion', 'social', 'exploration', 'special', 'milestone'],
    required: true,
  },
  requirement: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  experienceReward: {
    type: Number,
    default: 50,
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  isSecret: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('AchievementDefinition', achievementDefinitionSchema);
