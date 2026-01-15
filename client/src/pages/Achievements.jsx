import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { achievementAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Shield, 
  Award,
  Lock,
  CheckCircle,
  Calendar,
  TrendingUp,
  Users,
  Code,
  MessageSquare,
  Heart,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Achievements = () => {
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  const { data: allAchievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementAPI.getAll(),
  });

  const { data: userAchievements } = useQuery({
    queryKey: ['user-achievements', user?._id],
    queryFn: () => user?._id ? achievementAPI.getUserAchievements(user._id) : null,
    enabled: !!user?._id,
  });

  const categories = [
    { id: 'all', name: 'All', icon: Star, color: 'text-terminal-bright' },
    { id: 'conversion', name: 'Conversion', icon: Code, color: 'text-green-500' },
    { id: 'social', name: 'Social', icon: Users, color: 'text-blue-500' },
    { id: 'special', name: 'Special', icon: Crown, color: 'text-purple-500' },
  ];

  const rarityConfig = {
    common: { 
      color: 'from-gray-600 to-gray-800', 
      textColor: 'text-gray-300', 
      icon: Award,
      glow: 'shadow-gray-500/20'
    },
    rare: { 
      color: 'from-blue-600 to-blue-800', 
      textColor: 'text-blue-300', 
      icon: Shield,
      glow: 'shadow-blue-500/30'
    },
    epic: { 
      color: 'from-purple-600 to-purple-800', 
      textColor: 'text-purple-300', 
      icon: Star,
      glow: 'shadow-purple-500/40'
    },
    legendary: { 
      color: 'from-yellow-500 to-orange-600', 
      textColor: 'text-yellow-200', 
      icon: Crown,
      glow: 'shadow-yellow-500/50'
    },
  };

  const achievementIcons = {
    first_conversion: Code,
    conversion_master: Zap,
    first_post: MessageSquare,
    forum_regular: Users,
    early_adopter: Calendar,
    bug_hunter: Target,
    helpful_citizen: Heart,
    level_10: TrendingUp,
    easter_egg_1: Sparkles,
    speed_demon: Zap,
  };

  const isAchievementUnlocked = (achievementKey) => {
    return userAchievements?.achievements?.some(ua => ua.key === achievementKey);
  };

  const getUserAchievement = (achievementKey) => {
    return userAchievements?.achievements?.find(ua => ua.key === achievementKey);
  };

  const filteredAchievements = allAchievements?.achievements?.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = !showOnlyUnlocked || isAchievementUnlocked(achievement.key);
    return categoryMatch && unlockedMatch;
  }) || [];

  const stats = {
    total: allAchievements?.achievements?.length || 0,
    unlocked: userAchievements?.achievements?.length || 0,
    totalXP: userAchievements?.achievements?.reduce((sum, ua) => sum + (ua.experienceReward || 0), 0) || 0,
    totalRep: userAchievements?.achievements?.reduce((sum, ua) => sum + (ua.reputationReward || 0), 0) || 0,
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-2xl">LOADING ACHIEVEMENTS...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-pixel mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          🏆 ACHIEVEMENTS
        </h1>
        <p className="text-terminal-dim mb-6">
          Unlock achievements by using the platform and helping the community
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-retro text-center"
        >
          <div className="text-3xl font-bold text-terminal-bright mb-1">
            {stats.unlocked}/{stats.total}
          </div>
          <div className="text-sm text-terminal-dim uppercase">Unlocked</div>
          <div className="w-full bg-terminal-dim rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.unlocked / stats.total) * 100 : 0}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-retro text-center"
        >
          <div className="text-3xl font-bold text-purple-500 mb-1">
            {stats.totalXP.toLocaleString()}
          </div>
          <div className="text-sm text-terminal-dim uppercase">Bonus XP</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card-retro text-center"
        >
          <div className="text-3xl font-bold text-yellow-500 mb-1">
            {stats.totalRep.toLocaleString()}
          </div>
          <div className="text-sm text-terminal-dim uppercase">Bonus Rep</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card-retro text-center"
        >
          <div className="text-3xl font-bold text-cyan-500 mb-1">
            {Math.round((stats.unlocked / stats.total) * 100) || 0}%
          </div>
          <div className="text-sm text-terminal-dim uppercase">Progress</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="card-retro">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id 
                    ? 'bg-terminal-bright text-terminal-bg shadow-neon' 
                    : 'hover:bg-terminal-dim/30 border-2 border-terminal-dim'
                }`}
              >
                <category.icon className={selectedCategory === category.id ? 'text-terminal-bg' : category.color} size={16} />
                <span className="font-bold text-sm">{category.name.toUpperCase()}</span>
              </motion.button>
            ))}
          </div>

          {/* Show Only Unlocked Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyUnlocked}
              onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
              showOnlyUnlocked ? 'bg-terminal-bright' : 'bg-terminal-dim'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-all duration-300 transform ${
                showOnlyUnlocked ? 'translate-x-6' : 'translate-x-1'
              } mt-0.5`} />
            </div>
            <span className="text-sm font-bold">UNLOCKED ONLY</span>
          </label>
        </div>
      </div>

      {/* Achievements Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${showOnlyUnlocked}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredAchievements.map((achievement, index) => {
            const isUnlocked = isAchievementUnlocked(achievement.key);
            const userAchievement = getUserAchievement(achievement.key);
            const rarity = rarityConfig[achievement.rarity] || rarityConfig.common;
            const IconComponent = achievementIcons[achievement.key] || Trophy;

            return (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                  isUnlocked 
                    ? `bg-gradient-to-br ${rarity.color} ${rarity.glow} shadow-lg`
                    : 'bg-terminal-dim/30 border-2 border-terminal-dim'
                }`}
              >
                {/* Rarity Glow Effect */}
                {isUnlocked && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${rarity.color} opacity-20 animate-pulse`} />
                )}

                <div className="relative p-6">
                  {/* Lock/Unlock Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-full ${
                      isUnlocked 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : 'bg-terminal-dim'
                    }`}>
                      <IconComponent 
                        className={isUnlocked ? rarity.textColor : 'text-terminal-dim'} 
                        size={24} 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <CheckCircle className="text-green-400" size={20} />
                      ) : (
                        <Lock className="text-terminal-dim" size={20} />
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        isUnlocked ? rarity.textColor : 'text-terminal-dim'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>

                  {/* Achievement Info */}
                  <h3 className={`text-lg font-bold mb-2 ${
                    isUnlocked ? 'text-white' : 'text-terminal-text'
                  }`}>
                    {achievement.icon} {achievement.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${
                    isUnlocked ? 'text-white/80' : 'text-terminal-dim'
                  }`}>
                    {achievement.description}
                  </p>

                  {/* Rewards */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs">
                      {achievement.experienceReward > 0 && (
                        <div className={`flex items-center gap-1 ${
                          isUnlocked ? 'text-purple-300' : 'text-terminal-dim'
                        }`}>
                          <Zap size={12} />
                          +{achievement.experienceReward} XP
                        </div>
                      )}
                      {achievement.reputationReward > 0 && (
                        <div className={`flex items-center gap-1 ${
                          isUnlocked ? 'text-yellow-300' : 'text-terminal-dim'
                        }`}>
                          <Star size={12} />
                          +{achievement.reputationReward} Rep
                        </div>
                      )}
                    </div>

                    {/* Unlock Date */}
                    {isUnlocked && userAchievement && (
                      <div className="text-xs text-white/60">
                        {formatDistanceToNow(new Date(userAchievement.unlockedAt))} ago
                      </div>
                    )}
                  </div>

                  {/* Progress Bar (for progressive achievements) */}
                  {!isUnlocked && achievement.requirements?.target && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-terminal-dim mb-1">
                        <span>Progress</span>
                        <span>0/{achievement.requirements.target}</span>
                      </div>
                      <div className="w-full bg-terminal-dim/50 rounded-full h-1">
                        <div className="bg-terminal-bright h-1 rounded-full w-0" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Trophy size={64} className="mx-auto mb-4 text-terminal-dim" />
          <h3 className="text-2xl font-bold mb-2">NO ACHIEVEMENTS FOUND</h3>
          <p className="text-terminal-dim mb-6">
            {showOnlyUnlocked 
              ? "You haven't unlocked any achievements in this category yet."
              : "No achievements found for the selected filter."
            }
          </p>
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setShowOnlyUnlocked(false);
            }}
            className="btn-neon px-6 py-3"
          >
            SHOW ALL ACHIEVEMENTS
          </button>
        </motion.div>
      )}

      {/* Call to Action */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-retro border-2 border-terminal-bright bg-terminal-bright/5 text-center"
        >
          <h3 className="text-2xl font-bold mb-2">UNLOCK YOUR ACHIEVEMENTS</h3>
          <p className="text-terminal-dim mb-4">
            Register an account to start earning achievements and tracking your progress!
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/register" className="btn-neon px-6 py-3">
              REGISTER
            </a>
            <a href="/login" className="px-6 py-3 border-2 border-terminal-dim rounded hover:border-terminal-text transition-colors">
              LOGIN
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Achievements;
