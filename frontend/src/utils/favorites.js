/**
 * Favorites Manager Utility
 * Handles favorited movies and watchlist functionality
 */

const FAVORITES_STORAGE_KEY = 'reelsense_favorites';
const WATCHLIST_STORAGE_KEY = 'reelsense_watchlist';

export const favoritesManager = {
  // Favorites Management
  getFavorites: () => {
    try {
      const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  addFavorite: (movie) => {
    try {
      const favorites = favoritesManager.getFavorites();
      if (!favorites.find(m => m.id === movie.id)) {
        favorites.push(movie);
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      }
      return favorites;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return [];
    }
  },

  removeFavorite: (movieId) => {
    try {
      const favorites = favoritesManager.getFavorites().filter(m => m.id !== movieId);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      return favorites;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return [];
    }
  },

  isFavorited: (movieId) => {
    return favoritesManager.getFavorites().some(m => m.id === movieId);
  },

  // Watchlist Management
  getWatchlist: () => {
    try {
      const watchlist = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return watchlist ? JSON.parse(watchlist) : [];
    } catch (error) {
      console.error('Error getting watchlist:', error);
      return [];
    }
  },

  addToWatchlist: (movie) => {
    try {
      const watchlist = favoritesManager.getWatchlist();
      if (!watchlist.find(m => m.id === movie.id)) {
        watchlist.push({
          ...movie,
          addedAt: new Date().toISOString(),
          watched: false,
        });
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
      }
      return watchlist;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return [];
    }
  },

  removeFromWatchlist: (movieId) => {
    try {
      const watchlist = favoritesManager.getWatchlist().filter(m => m.id !== movieId);
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
      return watchlist;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return [];
    }
  },

  isInWatchlist: (movieId) => {
    return favoritesManager.getWatchlist().some(m => m.id === movieId);
  },

  markAsWatched: (movieId) => {
    try {
      const watchlist = favoritesManager.getWatchlist();
      const movie = watchlist.find(m => m.id === movieId);
      if (movie) {
        movie.watched = true;
        movie.watchedAt = new Date().toISOString();
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
      }
      return watchlist;
    } catch (error) {
      console.error('Error marking as watched:', error);
      return [];
    }
  },

  // Ratings Management
  rateMovie: (movieId, rating) => {
    try {
      const favorites = favoritesManager.getFavorites();
      const movie = favorites.find(m => m.id === movieId);
      if (movie) {
        movie.userRating = rating;
        movie.ratedAt = new Date().toISOString();
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      }
      return favorites;
    } catch (error) {
      console.error('Error rating movie:', error);
      return [];
    }
  },

  getUserRating: (movieId) => {
    const movie = favoritesManager.getFavorites().find(m => m.id === movieId);
    return movie ? movie.userRating : null;
  },
};

export default favoritesManager;
