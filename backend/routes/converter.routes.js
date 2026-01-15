import express from 'express';
import {
  jsonToToon,
  toonToJson,
  validateToon,
  explainJson,
  saveConversion,
  getMyConversions,
  getConversionById,
  deleteConversion,
  getPublicConversions,
  toggleLike,
} from '../controllers/converter.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { converterLimiter } from '../middleware/rateLimiter.js';
import { body } from 'express-validator';

const router = express.Router();

const conversionValidation = [
  body('input').notEmpty().withMessage('Input data is required'),
];

// Public routes
router.post('/json-to-toon', converterLimiter, conversionValidation, jsonToToon);
router.post('/toon-to-json', converterLimiter, conversionValidation, toonToJson);
router.post('/validate', converterLimiter, conversionValidation, validateToon);
router.post('/explain', converterLimiter, conversionValidation, explainJson);
router.get('/public', getPublicConversions);
router.get('/:id', getConversionById);

// Protected routes
router.post('/save', protect, saveConversion);
router.get('/my-conversions', protect, getMyConversions);
router.delete('/:id', protect, deleteConversion);
router.post('/:id/like', protect, toggleLike);

export default router;
