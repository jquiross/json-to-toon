# Project Architecture

## Overview

JSON-TO-TOON follows a **clean architecture** pattern with clear separation of concerns between presentation, business logic, and data layers.

## Backend Architecture

### Layer Structure

```
┌─────────────────────────────────────┐
│         Routes Layer                │
│  (Express routes, HTTP handling)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controllers Layer              │
│  (Request/Response handling)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Services Layer                │
│  (Business logic & algorithms)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Models Layer                 │
│  (Data schemas & validation)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Database Layer                │
│         (MongoDB)                   │
└─────────────────────────────────────┘
```

### Key Components

#### 1. Routes (`/backend/routes`)
- Define API endpoints
- Apply middleware (auth, validation, rate limiting)
- Route requests to controllers

#### 2. Controllers (`/backend/controllers`)
- Handle HTTP request/response
- Input validation
- Call appropriate services
- Format responses

#### 3. Services (`/backend/services`)
- Core business logic
- TOON conversion algorithms
- Achievement checking
- Complex computations

#### 4. Models (`/backend/models`)
- MongoDB schemas
- Data validation rules
- Virtual properties
- Instance methods

#### 5. Middleware (`/backend/middleware`)
- Authentication (JWT)
- Error handling
- Rate limiting
- Request logging

## Frontend Architecture

### Component Structure

```
┌─────────────────────────────────────┐
│          Pages Layer                │
│     (Route-level components)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Components Layer               │
│    (Reusable UI components)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        State Layer                  │
│   (Zustand stores, React Query)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Services Layer                 │
│       (API clients)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Backend API                  │
└─────────────────────────────────────┘
```

### State Management

- **Zustand**: Global state (auth, theme)
- **React Query**: Server state & caching
- **Local State**: Component-specific state

### Design System

- **TailwindCSS**: Utility-first styling
- **Custom Components**: Retro-themed UI library
- **Animations**: Framer Motion

## Data Flow

### Request Flow (Example: Convert JSON to TOON)

```
1. User clicks "Convert" button
   ↓
2. React component calls converterAPI.jsonToToon()
   ↓
3. API service makes HTTP POST to /api/converter/json-to-toon
   ↓
4. Express routes receives request
   ↓
5. Rate limiter middleware checks limits
   ↓
6. Validation middleware checks input
   ↓
7. Controller receives validated request
   ↓
8. Controller calls TOONConverter service
   ↓
9. Service processes conversion
   ↓
10. Result returned through layers
   ↓
11. React Query caches result
   ↓
12. Component updates UI
```

## Security Architecture

### Authentication Flow

```
1. User submits credentials
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT + Refresh Token
   ↓
4. Store refresh token in DB
   ↓
5. Return tokens to client
   ↓
6. Client stores in localStorage
   ↓
7. Include in Authorization header
   ↓
8. Middleware validates JWT
   ↓
9. Request proceeds if valid
```

### Security Layers

1. **Rate Limiting**: Prevent abuse
2. **Input Validation**: Sanitize user input
3. **JWT Authentication**: Stateless auth
4. **CORS**: Cross-origin protection
5. **Helmet**: Security headers
6. **Password Hashing**: bcrypt with salt rounds

## Database Schema

### Collections

#### Users
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  level: Number,
  experience: Number,
  reputation: Number,
  achievements: Array,
  preferences: Object
}
```

#### Conversions
```javascript
{
  user: ObjectId,
  inputType: String,
  outputType: String,
  inputData: String,
  outputData: String,
  metadata: Object,
  isPublic: Boolean
}
```

#### ForumPosts
```javascript
{
  author: ObjectId,
  title: String,
  content: String,
  category: String,
  upvotes: Array,
  downvotes: Array,
  comments: Array,
  status: String
}
```

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT)
- MongoDB replica sets
- Load balancer ready

### Caching Strategy
- React Query on frontend
- Redis for sessions (optional)
- MongoDB indexes

### Performance Optimization
- Code splitting (Vite)
- Lazy loading
- Image optimization
- Compression middleware

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Load Balancer               │
│           (Nginx)                   │
└──────────┬──────────────────────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐ ┌───▼─────┐
│ Node.js │ │ Node.js │
│ Server  │ │ Server  │
│   #1    │ │   #2    │
└────┬────┘ └───┬─────┘
     │          │
     └────┬─────┘
          │
    ┌─────▼─────┐
    │  MongoDB  │
    │  Cluster  │
    └───────────┘
```

## Testing Strategy

### Unit Tests
- Services (business logic)
- Utilities
- Pure functions

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- Critical user flows
- Conversion process
- Forum interactions

## Monitoring & Logging

### Logging Levels
- **Error**: Critical issues
- **Warn**: Potential problems
- **Info**: Important events
- **Debug**: Development info

### Metrics to Track
- API response times
- Conversion success rate
- User registration/login
- Error rates
- Database queries

## Best Practices Applied

1. **SOLID Principles**: Clean, maintainable code
2. **DRY**: Reusable components and utilities
3. **Error Handling**: Comprehensive error boundaries
4. **Type Safety**: Validation at boundaries
5. **Documentation**: Inline comments and README
6. **Git Workflow**: Feature branches, PR reviews
7. **Code Style**: ESLint + Prettier
8. **Security First**: Defense in depth

---

For more details, see individual component documentation in `/docs` directory.
