import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Zap, 
  MessageSquare, 
  RotateCw,
  TrendingUp,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('reputation');
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', activeTab, limit],
    queryFn: () => userAPI.getLeaderboard(activeTab, limit),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const tabs = [
    { 
      id: 'reputation', 
      name: 'Reputation', 
      icon: Crown, 
      color: 'text-yellow-500',
      description: 'Top users by community reputation'
    },
    { 
      id: 'level', 
      name: 'Level', 
      icon: Star, 
      color: 'text-blue-500',
      description: 'Highest level players'
    },
    { 
      id: 'experience', 
      name: 'Experience', 
      icon: Zap, 
      color: 'text-purple-500',
      description: 'Most experienced users'
    },
    { 
      id: 'conversions', 
      name: 'Conversions', 
      icon: RotateCw, 
      color: 'text-green-500',
      description: 'Most JSON↔TOON conversions'
    },
    { 
      id: 'posts', 
      name: 'Forum Posts', 
      icon: MessageSquare, 
      color: 'text-cyan-500',
      description: 'Most active forum contributors'
    },
  ];

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="text-yellow-500" size={24} />;
      case 2: return <Medal className="text-gray-400" size={24} />;
      case 3: return <Medal className="text-amber-600" size={24} />;
      default: return <Trophy className="text-terminal-dim" size={20} />;
    }
  };

  const getRankBadge = (rank) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-bold";
    switch(rank) {
      case 1: return `${baseClass} bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-neon`;
      case 2: return `${baseClass} bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-neon-sm`;
      case 3: return `${baseClass} bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-neon-sm`;
      default: return `${baseClass} bg-terminal-dim text-terminal-text`;
    }
  };

  const getStatValue = (user, type) => {
    switch(type) {
      case 'reputation': return user.reputation || 0;
      case 'level': return user.level || 1;
      case 'experience': return user.experience || 0;
      case 'conversions': return user.conversionsCount || 0;
      case 'posts': return user.forumPostsCount || 0;
      default: return 0;
    }
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-2xl">LOADING LEADERBOARD...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">ERROR LOADING LEADERBOARD</h2>
        <p className="text-terminal-dim mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-neon px-6 py-3"
        >
          RETRY
        </button>
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
        <h1 className="text-6xl font-pixel mb-4 bg-gradient-to-r from-terminal-bright to-cyan-500 bg-clip-text text-transparent">
          🏆 LEADERBOARD
        </h1>
        <p className="text-terminal-dim mb-6">
          Compete with the best developers in the JSON-to-TOON community
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="card-retro">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-lg transition-all duration-300 text-center ${
                activeTab === tab.id 
                  ? 'bg-terminal-bright text-terminal-bg shadow-neon' 
                  : 'hover:bg-terminal-dim/30 border-2 border-terminal-dim'
              }`}
            >
              <tab.icon className={`mx-auto mb-2 ${activeTab === tab.id ? 'text-terminal-bg' : tab.color}`} size={24} />
              <div className={`font-bold text-sm ${activeTab === tab.id ? 'text-terminal-bg' : ''}`}>
                {tab.name}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Tab Info */}
      {currentTab && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-retro border-l-4 border-terminal-bright"
        >
          <div className="flex items-center gap-3 mb-2">
            <currentTab.icon className={currentTab.color} size={24} />
            <h2 className="text-2xl font-pixel">{currentTab.name.toUpperCase()} RANKINGS</h2>
          </div>
          <p className="text-terminal-dim">{currentTab.description}</p>
        </motion.div>
      )}

      {/* Limit Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">SHOWING:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="input-retro py-1 px-3 text-sm"
          >
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>
        <div className="text-sm text-terminal-dim">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {data?.users?.map((leadUser, index) => {
          const rank = index + 1;
          const isCurrentUser = user?._id === leadUser._id;
          
          return (
            <motion.div
              key={leadUser._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`card-retro transition-all duration-300 ${
                isCurrentUser 
                  ? 'border-terminal-bright bg-terminal-bright/10 shadow-neon-sm' 
                  : 'hover:border-terminal-text hover:shadow-neon-sm hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  {getRankIcon(rank)}
                  <div className={getRankBadge(rank)}>
                    #{rank}
                  </div>
                </div>

                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                    isCurrentUser ? 'bg-terminal-bright text-terminal-bg' : 'bg-terminal-dim'
                  }`}>
                    {leadUser.username?.[0]?.toUpperCase() || '?'}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <Link 
                      to={`/profile/${leadUser._id}`}
                      className={`text-xl font-bold hover:text-terminal-bright transition-colors ${
                        isCurrentUser ? 'text-terminal-bright' : ''
                      }`}
                    >
                      {leadUser.username}
                      {isCurrentUser && <span className="ml-2 text-sm">(You)</span>}
                    </Link>
                    <div className="level-badge">
                      {leadUser.level || 1}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-terminal-dim">
                    <span>Level {leadUser.level || 1}</span>
                    <span>•</span>
                    <span>{leadUser.experience || 0} XP</span>
                    <span>•</span>
                    <span>{leadUser.reputation || 0} Rep</span>
                  </div>
                </div>

                {/* Stat Value */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-3xl font-bold text-terminal-bright mb-1">
                    {getStatValue(leadUser, activeTab).toLocaleString()}
                  </div>
                  <div className="text-sm text-terminal-dim uppercase">
                    {currentTab?.name}
                  </div>
                </div>

                {/* Trend Arrow */}
                <div className="flex-shrink-0 text-green-500">
                  <TrendingUp size={20} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {!data?.users?.length && (
        <div className="text-center py-12">
          <Trophy size={64} className="mx-auto mb-4 text-terminal-dim" />
          <h3 className="text-2xl font-bold mb-2">NO RANKINGS YET</h3>
          <p className="text-terminal-dim mb-6">
            Be the first to appear on the leaderboard!
          </p>
          <Link to="/converter" className="btn-neon px-6 py-3">
            START CONVERTING
          </Link>
        </div>
      )}

      {/* Your Position */}
      {user && data?.userPosition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-retro border-2 border-terminal-bright bg-terminal-bright/5"
        >
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">YOUR POSITION</h3>
            <div className="flex justify-center items-center gap-4">
              <User className="text-terminal-bright" size={24} />
              <div>
                <div className="text-2xl font-bold text-terminal-bright">
                  #{data.userPosition.rank}
                </div>
                <div className="text-sm text-terminal-dim">
                  out of {data.totalUsers} users
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;
