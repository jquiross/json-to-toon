import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Menu, X, User, LogOut, Settings, Bell, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const themes = [
    { id: 'retro-green', name: 'Terminal', icon: '🖥️' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌃' },
    { id: 'neon', name: 'Neon', icon: '✨' },
    { id: 'crt', name: 'CRT', icon: '📺' },
    { id: 'amber', name: 'Amber', icon: '🟠' },
    { id: 'matrix', name: 'Matrix', icon: '💚' },
  ];

  return (
    <nav className="border-b-2 border-terminal-dim bg-terminal-bg/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-pixel glitch" data-text="JSON⇄TOON">
              JSON⇄TOON
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/converter"
              className="hover:text-terminal-bright transition-colors font-bold"
            >
              [CONVERTER]
            </Link>
            <Link
              to="/forum"
              className="hover:text-terminal-bright transition-colors font-bold"
            >
              [FORUM]
            </Link>
            <Link
              to="/leaderboard"
              className="hover:text-terminal-bright transition-colors font-bold"
            >
              [LEADERBOARD]
            </Link>
            <Link
              to="/achievements"
              className="hover:text-terminal-bright transition-colors font-bold"
            >
              [ACHIEVEMENTS]
            </Link>

            {/* Theme Selector */}
            <div className="relative group">
              <button className="btn-neon px-3 py-1 text-sm">
                THEME
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-terminal-bg border-2 border-terminal-dim rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-full px-4 py-2 text-left hover:bg-terminal-dim/30 transition-colors ${
                      theme === t.id ? 'bg-terminal-dim/50 text-terminal-bright' : ''
                    }`}
                  >
                    {t.icon} {t.name}
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 hover:text-terminal-bright transition-colors"
                >
                  <div className="level-badge">{user?.level || 1}</div>
                  <span className="font-bold">{user?.username}</span>
                  <User size={20} />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-terminal-bg border-2 border-terminal-dim rounded-lg overflow-hidden"
                    >
                      <Link
                        to={`/profile/${user?.id}`}
                        className="block px-4 py-3 hover:bg-terminal-dim/30 transition-colors"
                      >
                        <User size={16} className="inline mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/my-conversions"
                        className="block px-4 py-3 hover:bg-terminal-dim/30 transition-colors"
                      >
                        <Trophy size={16} className="inline mr-2" />
                        My Conversions
                      </Link>
                      <Link
                        to="/notifications"
                        className="block px-4 py-3 hover:bg-terminal-dim/30 transition-colors"
                      >
                        <Bell size={16} className="inline mr-2" />
                        Notifications
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-terminal-dim/30 transition-colors border-t-2 border-terminal-dim"
                      >
                        <LogOut size={16} className="inline mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="btn-neon px-4 py-2">
                  LOGIN
                </Link>
                <Link to="/register" className="btn-neon px-4 py-2">
                  REGISTER
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t-2 border-terminal-dim py-4"
            >
              <Link
                to="/converter"
                className="block py-2 hover:text-terminal-bright transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONVERTER
              </Link>
              <Link
                to="/forum"
                className="block py-2 hover:text-terminal-bright transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FORUM
              </Link>
              <Link
                to="/leaderboard"
                className="block py-2 hover:text-terminal-bright transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                LEADERBOARD
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="block py-2 hover:text-terminal-bright transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    LOGIN
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 hover:text-terminal-bright transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    REGISTER
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
