import { api } from '../store/authStore';

export const converterAPI = {
  jsonToToon: async (input, options = {}) => {
    const { data } = await api.post('/converter/json-to-toon', { input, options });
    return data;
  },

  toonToJson: async (input, options = {}) => {
    const { data } = await api.post('/converter/toon-to-json', { input, options });
    return data;
  },

  validate: async (input, options = {}) => {
    const { data } = await api.post('/converter/validate', { input, options });
    return data;
  },

  explain: async input => {
    const { data } = await api.post('/converter/explain', { input });
    return data;
  },

  uploadAndConvert: async (file, conversionMode = 'json-to-toon') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversionMode', conversionMode);
    
    const { data } = await api.post('/converter/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  saveConversion: async conversionData => {
    const { data } = await api.post('/converter/save', conversionData);
    return data;
  },

  getMyConversions: async (page = 1, search = '') => {
    const { data } = await api.get('/converter/my-conversions', {
      params: { page, search },
    });
    return data;
  },

  getPublicConversions: async (page = 1, sort = 'recent', tags = '') => {
    const { data } = await api.get('/converter/public', {
      params: { page, sort, tags },
    });
    return data;
  },

  getConversionById: async id => {
    const { data } = await api.get(`/converter/${id}`);
    return data;
  },

  deleteConversion: async id => {
    const { data } = await api.delete(`/converter/${id}`);
    return data;
  },

  toggleLike: async id => {
    const { data } = await api.post(`/converter/${id}/like`);
    return data;
  },
};

export const forumAPI = {
  getPosts: async (params = {}) => {
    const { data } = await api.get('/forum/posts', { params });
    return data;
  },

  getPostById: async id => {
    const { data } = await api.get(`/forum/posts/${id}`);
    return data;
  },

  createPost: async postData => {
    const { data } = await api.post('/forum/posts', postData);
    return data;
  },

  updatePost: async (id, postData) => {
    const { data } = await api.put(`/forum/posts/${id}`, postData);
    return data;
  },

  deletePost: async id => {
    const { data } = await api.delete(`/forum/posts/${id}`);
    return data;
  },

  votePost: async (id, type) => {
    const { data } = await api.post(`/forum/posts/${id}/vote`, { type });
    return data;
  },

  addComment: async (id, content) => {
    const { data } = await api.post(`/forum/posts/${id}/comments`, { content });
    return data;
  },

  markAsSolved: async (id, commentId) => {
    const { data } = await api.post(`/forum/posts/${id}/solve`, { commentId });
    return data;
  },
};

export const userAPI = {
  getProfile: async userId => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },

  updateProfile: async profileData => {
    const { data } = await api.put('/users/profile', profileData);
    return data;
  },

  getStats: async userId => {
    const { data } = await api.get(`/users/${userId}/stats`);
    return data;
  },

  getLeaderboard: async (type = 'reputation', limit = 10) => {
    const { data } = await api.get('/users/leaderboard', {
      params: { type, limit },
    });
    return data;
  },
};

export const achievementAPI = {
  getAll: async () => {
    const { data } = await api.get('/achievements');
    return data;
  },

  getUserAchievements: async userId => {
    const { data } = await api.get(`/achievements/user/${userId}`);
    return data;
  },
};

export const notificationAPI = {
  getNotifications: async (page = 1, unreadOnly = false) => {
    const { data } = await api.get('/notifications', {
      params: { page, unreadOnly },
    });
    return data;
  },

  markAsRead: async id => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },

  deleteNotification: async id => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },
};
