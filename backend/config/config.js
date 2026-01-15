import dotenv from 'dotenv';
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/json-to-toon',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // Security
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // File upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // Features
  enableForum: process.env.ENABLE_FORUM === 'true',
  enableAIExplain: process.env.ENABLE_AI_EXPLAIN === 'true',
  enableSounds: process.env.ENABLE_SOUNDS === 'true',
  enableAchievements: process.env.ENABLE_ACHIEVEMENTS === 'true',
};
