import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { forumAPI } from '../services/api';
import { ArrowLeft, Send, Code, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    codeSnippet: '',
  });

  const createMutation = useMutation({
    mutationFn: (data) => forumAPI.createPost(data),
    onSuccess: (response) => {
      toast.success('Post created successfully! 🎉');
      navigate(`/forum/${response.post._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create post');
    },
  });

  const categories = [
    { id: 'general', name: 'General Discussion', icon: '💬' },
    { id: 'help', name: 'Help & Support', icon: '❓' },
    { id: 'showcase', name: 'Showcase', icon: '🎨' },
    { id: 'feature-request', name: 'Feature Request', icon: '💡' },
    { id: 'bug-report', name: 'Bug Report', icon: '🐛' },
    { id: 'tutorials', name: 'Tutorials', icon: '📚' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.title.trim().length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }

    if (formData.content.trim().length < 10) {
      toast.error('Content must be at least 10 characters');
      return;
    }

    // Parse tags
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)
      .slice(0, 5); // Max 5 tags

    createMutation.mutate({
      ...formData,
      tags: tagsArray,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link 
            to="/forum" 
            className="inline-flex items-center gap-2 hover:text-terminal-bright mb-4"
          >
            <ArrowLeft size={20} />
            BACK TO FORUM
          </Link>
          <h1 className="text-5xl font-pixel">CREATE NEW POST</h1>
          <p className="text-terminal-dim mt-2">
            Share your thoughts, questions, or showcase your work
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Title */}
        <div className="card-retro">
          <label className="block text-sm font-bold mb-2">
            POST TITLE *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title (5-200 characters)"
            className="input-retro"
            maxLength={200}
            required
          />
          <div className="text-sm text-terminal-dim mt-2">
            {formData.title.length} / 200
          </div>
        </div>

        {/* Category */}
        <div className="card-retro">
          <label className="block text-sm font-bold mb-2">
            CATEGORY *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-retro"
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="card-retro">
          <label className="block text-sm font-bold mb-2">
            POST CONTENT *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Describe your question, idea, or showcase in detail (10-10000 characters)"
            className="input-retro min-h-[300px]"
            maxLength={10000}
            required
          />
          <div className="text-sm text-terminal-dim mt-2">
            {formData.content.length} / 10000
          </div>
        </div>

        {/* Tags */}
        <div className="card-retro">
          <label className="block text-sm font-bold mb-2 flex items-center gap-2">
            <Tag size={16} />
            TAGS (Optional)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas (max 5)"
            className="input-retro"
          />
          <div className="text-sm text-terminal-dim mt-2">
            Separate tags with commas. Example: json, converter, help
          </div>
          {formData.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag)
                .slice(0, 5)
                .map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-terminal-bg border border-terminal-dim rounded text-sm"
                  >
                    #{tag.toLowerCase()}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Code Snippet */}
        <div className="card-retro">
          <label className="block text-sm font-bold mb-2 flex items-center gap-2">
            <Code size={16} />
            CODE SNIPPET (Optional)
          </label>
          <textarea
            name="codeSnippet"
            value={formData.codeSnippet}
            onChange={handleChange}
            placeholder="Paste your code here if relevant to your post"
            className="input-retro min-h-[200px] font-mono text-sm"
          />
          <div className="text-sm text-terminal-dim mt-2">
            Add code examples, JSON samples, or TOON examples
          </div>
        </div>

        {/* Guidelines */}
        <div className="card-retro bg-terminal-dim/20">
          <h3 className="font-bold mb-2">📋 POSTING GUIDELINES</h3>
          <ul className="text-sm space-y-1 text-terminal-dim">
            <li>• Be respectful and constructive</li>
            <li>• Use a clear, descriptive title</li>
            <li>• Provide enough context for others to help</li>
            <li>• Search for existing posts before creating duplicates</li>
            <li>• Choose the appropriate category</li>
            <li>• Format code snippets for readability</li>
          </ul>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn-neon px-8 py-3 flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={20} />
            {createMutation.isPending ? 'POSTING...' : 'CREATE POST'}
          </button>
          <Link
            to="/forum"
            className="px-8 py-3 border-2 border-terminal-dim rounded hover:border-terminal-text transition-colors"
          >
            CANCEL
          </Link>
        </div>
      </motion.form>
    </div>
  );
};

export default CreatePost;
