import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Trophy, Code } from 'lucide-react';
import { useEffect, useState } from 'react';

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'WELCOME TO THE MATRIX OF DATA CONVERSION';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Lightning Fast',
      description: 'Convert JSON to TOON in milliseconds with our optimized engine',
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: 'Developer Friendly',
      description: 'Syntax highlighting, error detection, and smart validation',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Community Driven',
      description: 'Share, discuss, and learn from other developers in our forum',
    },
    {
      icon: <Trophy className="w-12 h-12" />,
      title: 'Achievement System',
      description: 'Level up, earn badges, and compete on the leaderboard',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 py-16"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-pixel glitch mb-4 px-4" data-text="JSON ⇄ TOON">
          JSON ⇄ TOON
        </h1>
        
        <div className="h-auto min-h-[4rem] md:h-16 flex items-center justify-center px-4">
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-mono text-terminal-bright typing-cursor text-center">
            {typedText}
          </p>
        </div>

        <p className="text-base md:text-lg lg:text-xl text-terminal-dim max-w-2xl mx-auto px-4">
          The most advanced retro-styled JSON to TOON conversion platform.
          Built with love for developers who appreciate both functionality and aesthetics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/converter"
            className="btn-neon px-8 py-4 text-lg flex items-center gap-2 hover:scale-105 transform transition-transform"
          >
            START CONVERTING
            <ArrowRight />
          </Link>
          <Link
            to="/register"
            className="btn-neon px-8 py-4 text-lg flex items-center gap-2 hover:scale-105 transform transition-transform"
          >
            JOIN THE COMMUNITY
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="card-retro text-center space-y-4 hover:scale-105 transform transition-transform"
          >
            <div className="text-terminal-bright flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-terminal-bright">{feature.title}</h3>
            <p className="text-terminal-dim">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Demo Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="card-retro"
      >
        <h2 className="text-3xl font-bold mb-6 text-terminal-bright text-center">
          TOON FORMAT PREVIEW
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-3 text-terminal-bright">JSON</h3>
            <pre className="code-block">
{`{
  "user": {
    "name": "CyberDev",
    "level": 42,
    "achievements": [
      "First Conversion",
      "Forum Master"
    ]
  }
}`}
            </pre>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3 text-terminal-bright">TOON</h3>
            <pre className="code-block">
{`user:
  name: CyberDev
  level: 42
  achievements:
    - First Conversion
    - Forum Master`}
            </pre>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'CONVERSIONS', value: '1M+' },
          { label: 'DEVELOPERS', value: '10K+' },
          { label: 'FORUM POSTS', value: '50K+' },
          { label: 'ACHIEVEMENTS', value: '100+' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 1 }}
            className="card-retro text-center"
          >
            <div className="text-4xl font-bold text-terminal-bright mb-2">{stat.value}</div>
            <div className="text-terminal-dim">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="card-retro text-center space-y-6 bg-gradient-to-r from-terminal-bg to-terminal-dim/20"
      >
        <h2 className="text-4xl font-bold text-terminal-bright">
          READY TO START YOUR JOURNEY?
        </h2>
        <p className="text-xl text-terminal-dim max-w-2xl mx-auto">
          Join thousands of developers who are already using JSON-TO-TOON
          for their data conversion needs.
        </p>
        <Link
          to="/register"
          className="inline-block btn-neon px-12 py-4 text-xl hover:scale-110 transform transition-transform"
        >
          CREATE FREE ACCOUNT
        </Link>
        <p className="text-sm text-terminal-dim">
          No credit card required • Free forever • Cancel anytime
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
