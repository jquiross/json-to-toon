# Contributing to JSON-TO-TOON

First off, thank you for considering contributing to JSON-TO-TOON! 🎮

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/json-to-toon.git

# Install dependencies
npm run install:all

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Coding Standards

- **Use ESLint and Prettier** - Code is automatically formatted
- **Write meaningful commit messages** - Follow conventional commits
- **Comment complex logic** - Help others understand your code
- **Keep functions small** - Single responsibility principle
- **Write tests** - Aim for high coverage

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Example:
```
feat(converter): add multi-line string support

Added support for multi-line strings in TOON format using the pipe (|) syntax.
This allows for better representation of long text content.

Closes #123
```

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/doc-update` - Documentation
- `refactor/refactor-description` - Refactoring

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

### Code Review Process

1. All submissions require review
2. Reviewers will check:
   - Code quality and style
   - Test coverage
   - Documentation
   - Performance implications
   - Security concerns

## Project Structure

```
json-to-toon/
├── backend/              # Node.js backend
│   ├── config/          # Configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── client/              # React frontend
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       ├── store/       # State management
│       └── styles/      # Global styles
└── docs/                # Documentation
```

## Style Guide

### JavaScript

```javascript
// Good
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// Bad
async function getUserById(userId) {
  return await User.findById(userId);
}
```

### React Components

```javascript
// Good - Functional component with hooks
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  return <div>{state}</div>;
};

// Bad - Class component
class MyComponent extends React.Component {
  // ...
}
```

### CSS/Tailwind

```javascript
// Good - Utility classes
<div className="card-retro hover:scale-105 transition-transform">

// Bad - Inline styles
<div style={{ backgroundColor: '#000', padding: '20px' }}>
```

## Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Add JSDoc comments for functions
- Update ARCHITECTURE.md for structural changes

## Community

- Join our [Discord server](https://discord.gg/jsontotoon)
- Follow us on [Twitter](https://twitter.com/jsontotoon)
- Star the repo if you find it useful!

## Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- Community spotlight

## Questions?

Feel free to:
- Open an issue with your question
- Ask in our Discord server
- Email us at dev@jsontotoon.com

Thank you for contributing! 💚
