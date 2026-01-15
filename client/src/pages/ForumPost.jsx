import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { forumAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Eye, 
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ForumPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [commentContent, setCommentContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['forum-post', postId],
    queryFn: () => forumAPI.getPostById(postId),
  });

  const voteMutation = useMutation({
    mutationFn: ({ type }) => forumAPI.votePost(postId, type),
    onSuccess: () => {
      queryClient.invalidateQueries(['forum-post', postId]);
      toast.success('Vote registered!');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content) => forumAPI.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['forum-post', postId]);
      setCommentContent('');
      toast.success('Comment added! 🎉');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
      console.error('Comment error:', error);
    },
  });

  const solveMutation = useMutation({
    mutationFn: (commentId) => forumAPI.markAsSolved(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['forum-post', postId]);
      toast.success('Post marked as solved! 🎉');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => forumAPI.deletePost(postId),
    onSuccess: () => {
      toast.success('Post deleted');
      navigate('/forum');
    },
  });

  const handleVote = (type) => {
    if (!isAuthenticated) {
      toast.error('Login required to vote');
      return;
    }
    voteMutation.mutate({ type });
  };

  const handleComment = (e) => {
    e.preventDefault();
    console.log('HandleComment called:', { 
      isAuthenticated, 
      commentContent: commentContent.trim(), 
      length: commentContent.trim().length,
      postId
    });
    
    if (!isAuthenticated) {
      toast.error('Login required to comment');
      return;
    }
    
    if (commentContent.trim().length < 10) {
      toast.error('Comment must be at least 10 characters');
      return;
    }
    
    console.log('Submitting comment:', commentContent);
    commentMutation.mutate(commentContent);
  };

  const handleSolve = (commentId) => {
    solveMutation.mutate(commentId);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-2xl">LOADING POST...</div>
      </div>
    );
  }

  const post = data?.post;
  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">POST NOT FOUND</h2>
        <Link to="/forum" className="btn-neon px-6 py-3">
          BACK TO FORUM
        </Link>
      </div>
    );
  }

  const isAuthor = user?._id === post.author?._id;
  const hasUpvoted = post.upvotes?.includes(user?._id);
  const hasDownvoted = post.downvotes?.includes(user?._id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link 
        to="/forum" 
        className="inline-flex items-center gap-2 hover:text-terminal-bright"
      >
        <ArrowLeft size={20} />
        BACK TO FORUM
      </Link>

      {/* Post Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-retro"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-grow">
            <h1 className="text-4xl font-pixel mb-3 text-terminal-bright">
              {post.isPinned && '📌 '}
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-terminal-dim">
              <Link 
                to={`/profile/${post.author._id}`}
                className="flex items-center gap-2 hover:text-terminal-bright"
              >
                <div className="w-10 h-10 rounded-full bg-terminal-dim flex items-center justify-center font-bold">
                  {post.author.username[0].toUpperCase()}
                </div>
                <span className="font-bold">{post.author.username}</span>
                <div className="level-badge w-8 h-8 text-xs">
                  {post.author.level}
                </div>
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {post.views} views
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              post.status === 'solved' ? 'bg-green-500/20 text-green-500' : 
              'bg-terminal-dim text-terminal-text'
            }`}>
              {post.status === 'solved' && <CheckCircle size={12} className="inline mr-1" />}
              {post.status.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-terminal-dim rounded-full text-xs font-bold">
              {post.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-terminal-bg border border-terminal-dim rounded text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-invert max-w-none mb-6">
          <p className="whitespace-pre-wrap text-terminal-text leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Code Snippet */}
        {post.codeSnippet && (
          <div className="code-block mb-6">
            <pre className="whitespace-pre-wrap">
              <code>{post.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-terminal-dim">
          <div className="flex items-center gap-4">
            {/* Voting */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote('up')}
                className={`p-2 rounded transition-colors ${
                  hasUpvoted 
                    ? 'bg-terminal-bright text-terminal-bg' 
                    : 'hover:bg-terminal-dim'
                }`}
                disabled={!isAuthenticated}
              >
                <ThumbsUp size={20} />
              </button>
              <span className="font-bold text-xl min-w-[3rem] text-center">
                {post.score || 0}
              </span>
              <button
                onClick={() => handleVote('down')}
                className={`p-2 rounded transition-colors ${
                  hasDownvoted 
                    ? 'bg-red-500/20 text-red-500' 
                    : 'hover:bg-terminal-dim'
                }`}
                disabled={!isAuthenticated}
              >
                <ThumbsDown size={20} />
              </button>
            </div>

            {/* Comment count */}
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <span>{post.comments?.length || 0} replies</span>
            </div>
          </div>

          {/* Author actions */}
          {isAuthor && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-pixel flex items-center gap-2">
          <MessageSquare />
          REPLIES ({post.comments?.length || 0})
        </h2>

        {/* Comment Form */}
        {isAuthenticated && post.status !== 'closed' ? (
          <form onSubmit={handleComment} className="card-retro">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write your reply... (minimum 10 characters)"
              className="input-retro min-h-[120px] mb-3"
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-terminal-dim">
                {commentContent.length} / 2000
                {commentContent.trim().length < 10 && commentContent.length > 0 && (
                  <span className="text-red-500 ml-2">
                    Need {10 - commentContent.trim().length} more characters
                  </span>
                )}
              </span>
              <button
                type="submit"
                disabled={commentContent.trim().length < 10 || commentMutation.isPending}
                className="btn-neon px-6 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                {commentMutation.isPending ? 'POSTING...' : 'POST REPLY'}
              </button>
            </div>
          </form>
        ) : !isAuthenticated ? (
          <div className="card-retro border-terminal-dim/50 bg-terminal-dim/10">
            <div className="text-center py-6">
              <p className="text-terminal-dim mb-4">You must be logged in to reply</p>
              <Link 
                to="/login" 
                className="btn-neon px-6 py-2 inline-flex items-center gap-2"
              >
                <Send size={16} />
                LOGIN TO REPLY
              </Link>
            </div>
          </div>
        ) : (
          <div className="card-retro border-terminal-dim/50 bg-terminal-dim/10">
            <div className="text-center py-6">
              <p className="text-terminal-dim">This post is closed for new replies</p>
            </div>
          </div>
        )}

        {/* Comments List */}
        {post.comments?.map((comment, index) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`card-retro ${
              post.acceptedAnswer === comment._id 
                ? 'border-green-500 bg-green-500/5' 
                : ''
            }`}
          >
            <div className="flex gap-4">
              {/* User avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-terminal-dim flex items-center justify-center font-bold">
                  {comment.user?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="level-badge mt-2 w-12">
                  {comment.user?.level || 1}
                </div>
              </div>

              {/* Comment content */}
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{comment.user?.username}</span>
                    {post.acceptedAnswer === comment._id && (
                      <span className="achievement-badge text-xs">
                        <CheckCircle size={12} />
                        ACCEPTED ANSWER
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-terminal-dim">
                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-terminal-text mb-3">
                  {comment.content}
                </p>

                {/* Mark as solution */}
                {isAuthor && post.status !== 'solved' && post.acceptedAnswer !== comment._id && (
                  <button
                    onClick={() => handleSolve(comment._id)}
                    className="text-sm hover:text-green-500 flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle size={16} />
                    Mark as solution
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {post.comments?.length === 0 && (
          <div className="text-center py-12 text-terminal-dim">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
            <p>No replies yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPost;
