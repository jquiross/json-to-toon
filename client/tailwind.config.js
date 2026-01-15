/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Retro Terminal Green Theme
        terminal: {
          bg: '#0a0e0a',
          text: '#00ff41',
          dim: '#00aa2e',
          bright: '#33ff66',
          accent: '#ff00ff',
        },
        // Cyberpunk Theme
        cyber: {
          bg: '#0d1117',
          purple: '#bd93f9',
          pink: '#ff79c6',
          cyan: '#8be9fd',
          green: '#50fa7b',
          yellow: '#f1fa8c',
        },
        // Neon Theme
        neon: {
          bg: '#000814',
          blue: '#00d9ff',
          pink: '#ff006e',
          yellow: '#ffd60a',
          purple: '#b967ff',
        },
        // CRT Amber Theme
        amber: {
          bg: '#1a0f00',
          text: '#ffb000',
          dim: '#cc8c00',
          bright: '#ffd24d',
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'Courier New', 'monospace'],
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glitch': 'glitch 1s infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor' },
          '100%': { textShadow: '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      boxShadow: {
        'neon': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'neon-sm': '0 0 5px currentColor, 0 0 10px currentColor',
      },
    },
  },
  plugins: [],
};
