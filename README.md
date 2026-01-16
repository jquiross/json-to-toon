# 🎮 JSON ⇄ TOON Platform

<div align="center">

![JSON TO TOON](https://img.shields.io/badge/JSON-TO_TOON-00ff41?style=for-the-badge&logo=json&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-00ff41?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-00ff41?style=for-the-badge)

**The Ultimate Retro-Inspired Developer Platform for JSON ↔ TOON Conversion**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About

**JSON-TO-TOON** is a modern, retro-styled developer platform that provides powerful JSON to TOON (Tree Object Notation) conversion capabilities with a unique gaming-inspired user experience. Built with cutting-edge technologies and developer-friendly features, it combines functionality with an aesthetic that pays homage to classic terminal interfaces and retro gaming.

### What is TOON?

TOON (Tree Object Notation) is a hierarchical data format designed for visual clarity:
- Uses indentation for nesting (similar to YAML)
- Simple `key: value` syntax
- Support for arrays with `-` prefix
- Comments with `#` or `//`
- Multi-line strings with `|`

**Example:**
```toon
user:
  name: RetroGamer
  level: 42
  achievements:
    - First Conversion
    - Forum Master
  config:
    theme: cyberpunk
    soundEnabled: true
```

---

## ✨ Features

### 🔄 Core Conversion Engine
- **Bidirectional Conversion**: JSON ↔ TOON with full fidelity
- **Real-time Validation**: Instant syntax checking and error detection
- **Smart Error Highlighting**: Line-by-line error reporting with suggestions
- **Optimization Tools**: Automatic code cleanup and formatting
- **Syntax Highlighting**: Monaco Editor integration with custom themes
- **Performance Metrics**: Processing time, size comparison, compression ratios

### 🎨 UI/UX Features
- **6 Retro Themes**: Terminal Green, Cyberpunk, Neon, CRT, Amber, Matrix
- **CRT Screen Effects**: Optional scanlines and screen flicker
- **Glitch Effects**: Animated text effects and transitions
- **Particle Background**: Dynamic canvas-based animations
- **Responsive Design**: Mobile-first, works on all devices
- **Accessibility**: Keyboard navigation and screen reader support

### 👥 Community Features
- **Forum System**: 
  - Create posts with multiple categories
  - Upvote/downvote system
  - Comment threads
  - Mark solutions
  - Rich code snippet support
- **User Profiles**: 
  - Customizable avatars
  - Bio and preferences
  - Activity history
- **Achievement System**: 
  - 10+ unique achievements
  - Experience points and leveling
  - Rare and legendary badges
- **Leaderboard**: 
  - Multiple ranking types
  - Real-time updates
  - Seasonal competitions

### 🚀 Advanced Features
- **Debug Mode**: Step-by-step conversion visualization
- **AI Explanation**: Automatic structure analysis (optional OpenAI integration)
- **Conversion History**: Save and revisit past conversions
- **Public Gallery**: Share conversions with the community
- **Export/Import**: Download as files or share via links
- **API Access**: RESTful API for programmatic access
- **WebSocket Support**: Real-time notifications and updates

### 🎯 Easter Eggs
- Konami Code secret
- Hidden achievement triggers
- Retro sound effects (optional)
- Special terminal commands

---

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Winston** - Logging

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Monaco Editor** - Code editing
- **Zustand** - State management
- **React Query** - Data fetching
- **React Router** - Routing

### DevOps & Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing
- **Nodemon** - Development
- **Concurrently** - Script management

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/json-to-toon.git
cd json-to-toon
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

5. **Run the application**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/json-to-toon

# JWT
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=30d

# Security
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Features (Optional)
ENABLE_FORUM=true
ENABLE_AI_EXPLAIN=true
ENABLE_SOUNDS=true
ENABLE_ACHIEVEMENTS=true

# Email (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=your-openai-key
```

---

## 🎯 Usage

### Basic Conversion

1. **Navigate to Converter** (`/converter`)
2. **Paste your JSON** in the left editor
3. **Click "CONVERT NOW"** 
4. **View TOON output** in the right editor
5. **Copy, download, or save** the result

### Using the Forum

1. **Register/Login** to access forum features
2. **Browse posts** by category or search
3. **Create new posts** with rich formatting
4. **Vote and comment** on discussions
5. **Mark solutions** to help others

### Earning Achievements

- Complete your first conversion
- Create forum posts
- Help other users
- Reach level milestones
- Discover easter eggs

---

## 🏗 Architecture

### Backend Structure
```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
└── utils/           # Utility functions
```

### Frontend Structure
```
client/
├── public/          # Static assets
└── src/
    ├── components/  # Reusable components
    ├── pages/       # Page components
    ├── services/    # API services
    ├── store/       # State management
    └── styles/      # Global styles
```

### Design Patterns

- **MVC Pattern**: Clean separation of concerns
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic isolation
- **Middleware Chain**: Request/response processing
- **Component Composition**: Reusable UI components

---

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Converter

#### JSON to TOON
```http
POST /api/converter/json-to-toon
Content-Type: application/json

{
  "input": "string (JSON)",
  "options": {
    "indentSize": 2,
    "sortKeys": false
  }
}
```

#### TOON to JSON
```http
POST /api/converter/toon-to-json
Content-Type: application/json

{
  "input": "string (TOON)",
  "options": {}
}
```

### Forum

#### Get Posts
```http
GET /api/forum/posts?category=general&sort=recent&page=1
```

#### Create Post
```http
POST /api/forum/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "string",
  "content": "string",
  "category": "general",
  "tags": ["string"]
}
```

For complete API documentation, see [API.md](./docs/API.md)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm run test:watch
```

---

## 📈 Performance

- Conversion speed: < 100ms for typical payloads
- API response time: < 50ms (average)
- Lighthouse score: 95+ (Performance)
- Bundle size: < 500KB (gzipped)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

---

## 💡 Feature Requests

Have an idea? We'd love to hear it! Open an issue with:
- Clear description of the feature
- Use cases and benefits
- Mockups or examples (if applicable)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Jeremy Quirós**
- Email: jeremyquiros03@gmail.com
- LinkedIn: [Jeremy Quirós](https://www.linkedin.com/in/jeremy-quirós-84b746288/)

---

## 🙏 Acknowledgments

- Retro terminal aesthetics inspired by classic computing
- Community feedback and contributions
- Open source libraries and tools

---

<div align="center">

**Made with 💚 by developers, for developers**

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/json-to-toon?style=social)](https://github.com/yourusername/json-to-toon)

</div>
just a practice project, made with love <3