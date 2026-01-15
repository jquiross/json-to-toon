import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await register(formData.username, formData.email, formData.password);

    if (result.success) {
      toast.success('Account created! Welcome aboard! 🎮');
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
          <h1 className="text-4xl font-pixel text-center mb-8 glitch" data-text="REGISTER">
            REGISTER
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <User size={16} />
                USERNAME
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={30}
                className="input-retro"
                placeholder="cyberpunk2077"
              />
            </div>

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
                minLength={6}
                className="input-retro"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Lock size={16} />
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
              <UserPlus size={20} />
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-terminal-dim">
              Already have an account?{' '}
              <Link to="/login" className="text-terminal-bright hover:underline font-bold">
                LOGIN HERE
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-terminal-dim">
          <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
