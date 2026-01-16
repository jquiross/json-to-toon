import TOONConverter from '../services/converter.service.js';
import Conversion from '../models/Conversion.model.js';
import User from '../models/User.model.js';
import { AppError } from '../middleware/errorHandler.js';
import { checkAchievement } from '../services/achievement.service.js';

// @desc    Upload and convert file
// @route   POST /api/converter/upload
// @access  Public/Private
export const uploadAndConvert = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    const { conversionMode = 'json-to-toon' } = req.body;
    const input = req.fileContent; // Content validated by middleware

    const converter = new TOONConverter();
    let result;

    if (conversionMode === 'json-to-toon') {
      result = converter.jsonToToon(input);
    } else {
      result = converter.toonToJson(input);
    }

    res.json({
      success: result.success,
      output: result.output,
      errors: result.errors,
      warnings: result.warnings,
      metrics: result.metrics,
      filename: req.file.originalname,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Convert JSON to TOON
// @route   POST /api/converter/json-to-toon
// @access  Public/Private
export const jsonToToon = async (req, res, next) => {
  try {
    const { input, options } = req.body;

    if (!input) {
      return next(new AppError('Input data is required', 400));
    }

    const converter = new TOONConverter(options);
    const result = converter.jsonToToon(input);

    res.json({
      success: result.success,
      output: result.output,
      errors: result.errors,
      warnings: result.warnings,
      metrics: result.metrics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Convert TOON to JSON
// @route   POST /api/converter/toon-to-json
// @access  Public/Private
export const toonToJson = async (req, res, next) => {
  try {
    const { input, options } = req.body;

    if (!input) {
      return next(new AppError('Input data is required', 400));
    }

    const converter = new TOONConverter(options);
    const result = converter.toonToJson(input);

    res.json({
      success: result.success,
      output: result.output,
      parsed: result.parsed,
      errors: result.errors,
      warnings: result.warnings,
      metrics: result.metrics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate TOON syntax
// @route   POST /api/converter/validate
// @access  Public
export const validateToon = async (req, res, next) => {
  try {
    const { input, options } = req.body;

    if (!input) {
      return next(new AppError('Input data is required', 400));
    }

    const converter = new TOONConverter(options);
    const result = converter.validateToon(input);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Explain JSON structure
// @route   POST /api/converter/explain
// @access  Public
export const explainJson = async (req, res, next) => {
  try {
    const { input } = req.body;

    if (!input) {
      return next(new AppError('Input data is required', 400));
    }

    const converter = new TOONConverter();
    const explanation = converter.explainJson(input);

    res.json({
      success: true,
      explanation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save conversion
// @route   POST /api/converter/save
// @access  Private
export const saveConversion = async (req, res, next) => {
  try {
    const { name, description, inputType, outputType, inputData, outputData, isPublic, tags } =
      req.body;

    const converter = new TOONConverter();
    let metrics = {};

    // Calculate metrics
    if (inputType === 'json') {
      const result = converter.jsonToToon(inputData);
      metrics = result.metrics;
    } else {
      const result = converter.toonToJson(inputData);
      metrics = result.metrics;
    }

    const conversion = await Conversion.create({
      user: req.user.id,
      name,
      description,
      inputType,
      outputType,
      inputData,
      outputData,
      isPublic: isPublic || false,
      tags: tags || [],
      metadata: metrics,
    });

    // Update user conversion count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { conversionsCount: 1 },
    });

    // Add experience
    req.user.addExperience(10);
    await req.user.save();

    // Check achievements
    if (req.user) {
      await checkAchievement(req.user.id, 'first_conversion');
      await checkAchievement(req.user.id, 'conversion_master', req.user.conversionsCount);
    }

    res.status(201).json({
      success: true,
      conversion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's conversions
// @route   GET /api/converter/my-conversions
// @access  Private
export const getMyConversions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = { user: req.user.id };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const conversions = await Conversion.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-inputData -outputData');

    const count = await Conversion.countDocuments(query);

    res.json({
      success: true,
      conversions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversion by ID
// @route   GET /api/converter/:id
// @access  Public/Private
export const getConversionById = async (req, res, next) => {
  try {
    const conversion = await Conversion.findById(req.params.id).populate(
      'user',
      'username avatar level'
    );

    if (!conversion) {
      return next(new AppError('Conversion not found', 404));
    }

    // Check if private and user is not owner
    if (!conversion.isPublic && (!req.user || req.user.id !== conversion.user._id.toString())) {
      return next(new AppError('Not authorized to access this conversion', 403));
    }

    // Increment views
    conversion.views += 1;
    await conversion.save();

    res.json({
      success: true,
      conversion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete conversion
// @route   DELETE /api/converter/:id
// @access  Private
export const deleteConversion = async (req, res, next) => {
  try {
    const conversion = await Conversion.findById(req.params.id);

    if (!conversion) {
      return next(new AppError('Conversion not found', 404));
    }

    if (conversion.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this conversion', 403));
    }

    await conversion.deleteOne();

    res.json({
      success: true,
      message: 'Conversion deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public conversions
// @route   GET /api/converter/public
// @access  Public
export const getPublicConversions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = 'recent', tags } = req.query;

    const query = { isPublic: true };
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { views: -1 };
    if (sort === 'likes') sortOption = { likes: -1 };

    const conversions = await Conversion.find(query)
      .populate('user', 'username avatar level')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-inputData -outputData');

    const count = await Conversion.countDocuments(query);

    res.json({
      success: true,
      conversions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on conversion
// @route   POST /api/converter/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const conversion = await Conversion.findById(req.params.id);

    if (!conversion) {
      return next(new AppError('Conversion not found', 404));
    }

    const likeIndex = conversion.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      conversion.likes.splice(likeIndex, 1);
    } else {
      conversion.likes.push(req.user.id);
    }

    await conversion.save();

    res.json({
      success: true,
      likes: conversion.likes.length,
      isLiked: likeIndex === -1,
    });
  } catch (error) {
    next(error);
  }
};
