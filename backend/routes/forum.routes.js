import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  votePost,
  addComment,
  markAsSolved,
  getUserPosts,
} from '../controllers/forum.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

const postValidation = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
];

const commentValidation = [
  body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Comment must be 1-2000 characters'),
];

// Public routes
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.get('/users/:userId/posts', getUserPosts);

// Protected routes
router.post('/posts', protect, postValidation, createPost);
router.put('/posts/:id', protect, postValidation, updatePost);
router.delete('/posts/:id', protect, deletePost);
router.post('/posts/:id/vote', protect, votePost);
router.post('/posts/:id/comments', protect, commentValidation, addComment);
router.post('/posts/:id/solve', protect, markAsSolved);

export default router;
