import ForumPost from '../models/ForumPost.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';
import { AppError } from '../middleware/errorHandler.js';
import { checkAchievement } from '../services/achievement.service.js';

// @desc    Create new forum post
// @route   POST /api/forum/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, codeSnippet, conversionReference } = req.body;

    const post = await ForumPost.create({
      author: req.user.id,
      title,
      content,
      category: category || 'general',
      tags: tags || [],
      codeSnippet: codeSnippet || '',
      conversionReference: conversionReference || null,
    });

    // Update user post count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { forumPostsCount: 1 },
    });

    // Add experience
    req.user.addExperience(15);
    await req.user.save();

    // Check achievements
    await checkAchievement(req.user.id, 'first_post');
    await checkAchievement(req.user.id, 'forum_regular', req.user.forumPostsCount);

    const populatedPost = await ForumPost.findById(post._id).populate(
      'author',
      'username avatar level reputation'
    );

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all forum posts
// @route   GET /api/forum/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, status, sort = 'recent', search } = req.query;

    const query = {};
    if (category && category !== 'all') query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOption = { isPinned: -1, createdAt: -1 };
    if (sort === 'popular') sortOption = { isPinned: -1, views: -1 };
    if (sort === 'votes') {
      sortOption = { isPinned: -1, createdAt: -1 };
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'username avatar level reputation')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-comments')
      .lean();

    if (!posts) {
      return res.json({
        success: true,
        posts: [],
        totalPages: 0,
        currentPage: page,
      });
    }

    // Calculate score for each post
    const postsWithScore = posts.map(post => ({
      ...post,
      score: (post.upvotes?.length || 0) - (post.downvotes?.length || 0),
    }));

    // Sort by score if requested
    if (sort === 'votes') {
      postsWithScore.sort((a, b) => b.score - a.score);
    }

    const count = await ForumPost.countDocuments(query);

    res.json({
      success: true,
      posts: postsWithScore,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error in getPosts:', error);
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/forum/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'username avatar level reputation achievements')
      .populate('comments.user', 'username avatar level reputation')
      .populate('conversionReference');

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post: {
        ...post.toObject(),
        score: post.upvotes.length - post.downvotes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/forum/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    let post = await ForumPost.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this post', 403));
    }

    const { title, content, category, tags, codeSnippet } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.codeSnippet = codeSnippet !== undefined ? codeSnippet : post.codeSnippet;

    await post.save();

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/forum/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this post', 403));
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on post
// @route   POST /api/forum/posts/:id/vote
// @access  Private
export const votePost = async (req, res, next) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    const upvoteIndex = post.upvotes.indexOf(req.user.id);
    const downvoteIndex = post.downvotes.indexOf(req.user.id);

    // Remove existing votes
    if (upvoteIndex > -1) post.upvotes.splice(upvoteIndex, 1);
    if (downvoteIndex > -1) post.downvotes.splice(downvoteIndex, 1);

    // Add new vote
    if (type === 'up') {
      post.upvotes.push(req.user.id);
      
      // Add reputation to post author
      await User.findByIdAndUpdate(post.author, {
        $inc: { reputation: 1 },
      });
    } else if (type === 'down') {
      post.downvotes.push(req.user.id);
    }

    await post.save();

    res.json({
      success: true,
      score: post.upvotes.length - post.downvotes.length,
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/forum/posts/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.isLocked) {
      return next(new AppError('Post is locked', 403));
    }

    const comment = {
      user: req.user.id,
      content,
    };

    post.comments.push(comment);
    await post.save();

    // Add experience
    req.user.addExperience(5);
    await req.user.save();

    // Create notification for post author
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: 'comment',
        title: 'New comment on your post',
        message: `${req.user.username} commented on "${post.title}"`,
        link: `/forum/${post._id}`,
      });

      // Emit socket event
      const io = req.app.get('io');
      io.to(`user-${post.author}`).emit('notification', {
        type: 'comment',
        message: `${req.user.username} commented on your post`,
      });
    }

    const populatedPost = await ForumPost.findById(post._id)
      .populate('comments.user', 'username avatar level');

    res.status(201).json({
      success: true,
      comments: populatedPost.comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark post as solved
// @route   POST /api/forum/posts/:id/solve
// @access  Private
export const markAsSolved = async (req, res, next) => {
  try {
    const { commentId } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.author.toString() !== req.user.id) {
      return next(new AppError('Only post author can mark as solved', 403));
    }

    post.status = 'solved';
    post.acceptedAnswer = commentId;
    await post.save();

    // Give bonus reputation to comment author
    const comment = post.comments.id(commentId);
    if (comment) {
      await User.findByIdAndUpdate(comment.user, {
        $inc: { reputation: 10, experience: 25 },
      });

      // Create notification
      await Notification.create({
        recipient: comment.user,
        sender: req.user.id,
        type: 'post-solved',
        title: 'Your answer was accepted!',
        message: `Your answer to "${post.title}" was marked as the solution`,
        link: `/forum/${post._id}`,
        icon: '🏆',
      });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's forum posts
// @route   GET /api/forum/users/:userId/posts
// @access  Public
export const getUserPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const posts = await ForumPost.find({ author: req.params.userId })
      .populate('author', 'username avatar level')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-comments');

    const count = await ForumPost.countDocuments({ author: req.params.userId });

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};
