import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { api } from '../store/authStore';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Calendar,
  Edit2,
  Save,
  X,
  Trophy,
  MessageSquare,
  Zap,
  Award,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuthStore();
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    bio: '',
  });

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${userId}`);
      setProfileUser(data.user);
      if (isOwnProfile) {
        setEditData({
          username: data.user.username || '',
          email: data.user.email || '',
          bio: data.user.bio || '',
        });
      }
    } catch (error) {
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data } = await api.put(`/users/profile`, editData);
      setProfileUser(data.user);
      updateUser(data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      username: profileUser.username || '',
      email: profileUser.email || '',
      bio: profileUser.bio || '',
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-2xl">LOADING PROFILE...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">USER NOT FOUND</h2>
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
        <h1 className="text-4xl md:text-5xl font-pixel mb-2">USER PROFILE</h1>
        <p className="text-terminal-dim">Level {profileUser.level} Developer</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-retro"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-terminal-dim flex items-center justify-center text-6xl font-bold border-4 border-terminal-bright">
              {profileUser.username?.[0]?.toUpperCase()}
            </div>
            <div className="level-badge text-2xl px-4 py-2">
              LVL {profileUser.level}
            </div>
            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-neon px-4 py-2 flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <>
                {/* Edit Mode */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">USERNAME</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={e =>
                        setEditData({ ...editData, username: e.target.value })
                      }
                      className="input-retro w-full"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">EMAIL</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={e =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="input-retro w-full"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">BIO</label>
                    <textarea
                      value={editData.bio}
                      onChange={e => setEditData({ ...editData, bio: e.target.value })}
                      className="input-retro w-full h-24 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="btn-neon px-4 py-2 flex items-center gap-2"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-neon px-4 py-2 flex items-center gap-2 bg-red-500/20"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div>
                  <h2 className="text-3xl font-bold text-terminal-bright mb-2">
                    {profileUser.username}
                  </h2>
                  {profileUser.bio && (
                    <p className="text-terminal-dim">{profileUser.bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <span>{profileUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>
                      Joined {formatDistanceToNow(new Date(profileUser.createdAt))} ago
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-retro text-center"
        >
          <Zap className="w-8 h-8 mx-auto mb-2 text-terminal-bright" />
          <div className="text-2xl font-bold">{profileUser.experience || 0}</div>
          <div className="text-terminal-dim text-sm">Experience</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-retro text-center"
        >
          <Trophy className="w-8 h-8 mx-auto mb-2 text-terminal-bright" />
          <div className="text-2xl font-bold">{profileUser.conversionsCount || 0}</div>
          <div className="text-terminal-dim text-sm">Conversions</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-retro text-center"
        >
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-terminal-bright" />
          <div className="text-2xl font-bold">{profileUser.forumPostsCount || 0}</div>
          <div className="text-terminal-dim text-sm">Forum Posts</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-retro text-center"
        >
          <Award className="w-8 h-8 mx-auto mb-2 text-terminal-bright" />
          <div className="text-2xl font-bold">{profileUser.achievements?.length || 0}</div>
          <div className="text-terminal-dim text-sm">Achievements</div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-retro"
      >
        <h3 className="text-xl font-bold mb-4">LEVEL PROGRESS</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level {profileUser.level}</span>
            <span>
              {profileUser.experience || 0} / {(profileUser.level || 1) * 100} XP
            </span>
          </div>
          <div className="h-4 bg-terminal-dim rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((profileUser.experience || 0) / ((profileUser.level || 1) * 100)) * 100
                }%`,
              }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-full bg-gradient-to-r from-terminal-bright to-terminal-text"
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      {isOwnProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Link to="/my-conversions" className="card-retro hover:scale-105 transition-transform">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-terminal-bright" />
              <div>
                <h4 className="font-bold">My Conversions</h4>
                <p className="text-sm text-terminal-dim">View your saved conversions</p>
              </div>
            </div>
          </Link>

          <Link to="/achievements" className="card-retro hover:scale-105 transition-transform">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-terminal-bright" />
              <div>
                <h4 className="font-bold">Achievements</h4>
                <p className="text-sm text-terminal-dim">Track your progress</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;

