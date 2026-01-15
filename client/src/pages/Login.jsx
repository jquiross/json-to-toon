import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Welcome back! 🎮');
      navigate('/converter');
    } else {
      toast.error(result.error);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card-retro">
          <h1 className="text-4xl font-pixel text-center mb-8 glitch" data-text="LOGIN">
            LOGIN
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Mail size={16} />
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-retro"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Lock size={16} />
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-retro"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-neon px-6 py-3 text-lg flex items-center justify-center gap-2 ${
                isLoading ? 'animate-pulse' : ''
              }`}
            >
              <LogIn size={20} />
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-terminal-dim">
              Don't have an account?{' '}
              <Link to="/register" className="text-terminal-bright hover:underline font-bold">
                REGISTER HERE
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-terminal-dim hover:text-terminal-bright">
              Forgot password?
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-terminal-dim">
          <p>By logging in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
