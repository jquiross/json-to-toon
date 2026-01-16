import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { forumAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  Eye, 
  MessageCircle,
  Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Forum = () => {
  const { isAuthenticated } = useAuthStore();
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('recent');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['forum-posts', category, sort, search, page],
    queryFn: () => forumAPI.getPosts({ category, sort, search, page }),
    retry: 1,
    onError: (err) => {
      console.error('Error fetching posts:', err);
    },
  });

  const categories = [
    { id: 'all', name: 'All Posts', icon: '📋' },
    { id: 'general', name: 'General', icon: '💬' },
    { id: 'help', name: 'Help', icon: '❓' },
    { id: 'showcase', name: 'Showcase', icon: '🎨' },
    { id: 'feature-request', name: 'Feature Request', icon: '💡' },
    { id: 'bug-report', name: 'Bug Report', icon: '🐛' },
    { id: 'tutorials', name: 'Tutorials', icon: '📚' },
  ];

  const statusColors = {
    open: 'text-terminal-bright',
    solved: 'text-green-500',
    closed: 'text-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-5xl font-pixel mb-2">COMMUNITY FORUM</h1>
          <p className="text-terminal-dim">
            Discuss, share knowledge, and help other developers
          </p>
        </div>
        {isAuthenticated ? (
          <Link to="/forum/new" className="btn-neon px-6 py-3 flex items-center gap-2">
            <Plus size={20} />
            NEW POST
          </Link>
        ) : (
          <Link to="/login" className="btn-neon px-6 py-3 flex items-center gap-2">
            <Plus size={20} />
            LOGIN TO POST
          </Link>
        )}
      </motion.div>

      {/* Filters */}
      <div className="card-retro">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold mb-2">CATEGORY</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="input-retro"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-bold mb-2">SORT BY</label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input-retro"
            >
              <option value="recent">Recent</option>
              <option value="popular">Popular</option>
              <option value="votes">Most Votes</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-bold mb-2">SEARCH</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="input-retro"
            />
          </div>
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-2xl">LOADING POSTS...</div>
        </div>
      ) : error ? (
        <div className="card-retro text-center py-12 border-2 border-red-500">
          <h3 className="text-2xl font-bold text-red-500 mb-2">ERROR LOADING POSTS</h3>
          <p className="text-terminal-dim">{error.message || 'Something went wrong'}</p>
        </div>
      ) : !data?.posts || data.posts.length === 0 ? (
        <div className="card-retro text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-terminal-dim" />
          <h3 className="text-2xl font-bold mb-2">No posts found</h3>
          <p className="text-terminal-dim">
            {search
              ? 'Try different search terms'
              : 'Be the first to create a post!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/forum/${post._id}`}>
                <div className="card-retro hover:scale-[1.02] transform transition-transform">
                  <div className="flex items-start gap-4">
                    {/* Author Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-terminal-dim flex items-center justify-center font-bold">
                        {post.author?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="level-badge mt-2 w-12">
                        {post.author?.level || 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-terminal-bright hover:text-terminal-text">
                            {post.isPinned && '📌 '}
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-terminal-dim mt-1">
                            <span className="font-bold">{post.author?.username}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                            <span>•</span>
                            <span className={statusColors[post.status]}>
                              [{post.status.toUpperCase()}]
                            </span>
                          </div>
                        </div>

                        {/* Category Badge */}
                        <span className="px-3 py-1 bg-terminal-dim rounded-full text-xs font-bold whitespace-nowrap">
                          {post.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Tags */}
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-terminal-bg border border-terminal-dim rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={16} />
                          <span>{post.score || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{post.comments?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          <span>{post.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-neon px-4 py-2 disabled:opacity-50"
          >
            PREVIOUS
          </button>
          <span className="px-4 py-2 border-2 border-terminal-dim rounded">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="btn-neon px-4 py-2 disabled:opacity-50"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default Forum;
