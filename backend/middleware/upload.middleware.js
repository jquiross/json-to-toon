import multer from 'multer';
import path from 'path';
import { AppError } from './errorHandler.js';

// File type validation
const ALLOWED_FILE_TYPES = {
  json: ['application/json', 'text/json'],
  toon: ['text/plain', 'application/octet-stream'],
  all: ['application/json', 'text/json', 'text/plain', 'application/octet-stream'],
};

const ALLOWED_EXTENSIONS = ['.json', '.toon', '.txt'];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configure storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  // Check file extension
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new AppError(
        `Invalid file type. Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed.`,
        400
      ),
      false
    );
  }

  // Check MIME type
  if (!ALLOWED_FILE_TYPES.all.includes(mimeType)) {
    return cb(
      new AppError(
        `Invalid MIME type. File type ${mimeType} is not allowed.`,
        400
      ),
      false
    );
  }

  cb(null, true);
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Only one file at a time
  },
});

// Security validation middleware
export const validateFileContent = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const fileContent = req.file.buffer.toString('utf8');
    
    // Check for potentially dangerous patterns
    const dangerousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // Event handlers like onclick, onerror, etc.
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /eval\(/gi,
      /Function\(/gi,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(fileContent)) {
        return next(
          new AppError(
            'File contains potentially dangerous content and cannot be processed.',
            400
          )
        );
      }
    }

    // Validate JSON structure if file is JSON
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext === '.json') {
      try {
        JSON.parse(fileContent);
      } catch (error) {
        return next(new AppError('Invalid JSON file structure.', 400));
      }
    }

    // Check for excessive nesting (potential DoS attack)
    const nestingLevel = checkNestingLevel(fileContent);
    if (nestingLevel > 100) {
      return next(
        new AppError(
          'File has excessive nesting depth and cannot be processed.',
          400
        )
      );
    }

    // Add validated content to request
    req.fileContent = fileContent;
    next();
  } catch (error) {
    next(new AppError('Error validating file content: ' + error.message, 400));
  }
};

// Helper function to check nesting level
function checkNestingLevel(content) {
  let maxDepth = 0;
  let currentDepth = 0;

  for (const char of content) {
    if (char === '{' || char === '[') {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (char === '}' || char === ']') {
      currentDepth--;
    }
  }

  return maxDepth;
}

// Sanitize filename
export const sanitizeFilename = filename => {
  // Remove any path traversal attempts
  let sanitized = path.basename(filename);
  
  // Remove or replace dangerous characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit filename length
  if (sanitized.length > 100) {
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext).substring(0, 100 - ext.length);
    sanitized = name + ext;
  }
  
  return sanitized;
};

// Error handler for multer
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(
        new AppError(
          `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
          400
        )
      );
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('Too many files. Only one file allowed.', 400));
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new AppError('Unexpected file field.', 400));
    }
  }
  next(error);
};

export default upload;
