import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Converter from './pages/Converter';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import MyConversions from './pages/MyConversions';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

function App() {
  const { initializeAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Apply theme class to body
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <div className="min-h-screen crt-effect scanline">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="converter" element={<Converter />} />
          <Route path="forum" element={<Forum />} />
          <Route 
            path="forum/new" 
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } 
          />
          <Route path="forum/:postId" element={<ForumPost />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route
            path="profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-conversions"
            element={
              <ProtectedRoute>
                <MyConversions />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
