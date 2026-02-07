import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ─── Recommendations ───────────────────────────────────────
export const recommendationAPI = {
  getRecommendations: (userId, params = {}) =>
    apiClient.get(`/recommendations/${userId}`, { params }),

  getExplanation: (userId, movieId) =>
    apiClient.get(`/explanations/${userId}/${movieId}`),
};

// ─── Movies ────────────────────────────────────────────────
export const movieAPI = {
  getMovieDetails: (movieId) =>
    apiClient.get(`/movies/${movieId}`),

  getSimilarMovies: (movieId, params = {}) =>
    apiClient.get(`/movies/${movieId}/similar`, { params }),

  searchMovies: (query) =>
    apiClient.get('/movies/search', { params: { q: query } }),

  getPopularMovies: (params = {}) =>
    apiClient.get('/movies/popular', { params }),

  getTopRatedMovies: (params = {}) =>
    apiClient.get('/movies/top-rated', { params }),
};

// ─── Users ─────────────────────────────────────────────────
export const userAPI = {
  getProfile: (userId) =>
    apiClient.get(`/users/${userId}`),

  getHistory: (userId, params = {}) =>
    apiClient.get(`/users/${userId}/history`, { params }),

  rateMovie: (userId, movieId, rating) =>
    apiClient.post(`/users/${userId}/ratings`, { movieId, rating }),

  updatePreferences: (userId, preferences) =>
    apiClient.put(`/users/${userId}/preferences`, preferences),
};

// ─── Analytics ─────────────────────────────────────────────
export const analyticsAPI = {
  getAnalytics: () =>
    apiClient.get('/analytics'),

  getStats: () =>
    apiClient.get('/stats'),

  getGenres: () =>
    apiClient.get('/genres'),
};

// ─── Health ────────────────────────────────────────────────
export const healthAPI = {
  check: () =>
    apiClient.get('/health'),
};

export default apiClient;
