import React, { useState, useEffect } from 'react';
import { Search, X, Film, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../services/api';

const MovieSearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchMovies(query);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchMovies = async (searchQuery) => {
    try {
      setIsSearching(true);
      const response = await movieAPI.searchMovies(searchQuery);
      setResults(response.data.results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-txt-muted" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies by title or genre..."
          className="w-full pl-12 pr-12 py-3 bg-bg-card border border-bg-hover rounded-xl text-txt-primary placeholder-txt-muted focus:outline-none focus:border-accent-red focus:ring-2 focus:ring-accent-red focus:ring-opacity-20 transition-all"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSearching && <Loader2 className="w-4 h-4 text-accent-red animate-spin" />}
          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="text-txt-muted hover:text-txt-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-bg-card border border-bg-hover rounded-xl shadow-card-hover max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-txt-muted px-3 py-2">
              Found {results.length} {results.length === 1 ? 'movie' : 'movies'}
            </div>
            
            {results.map((movie) => (
              <button
                key={movie.movieId}
                onClick={() => handleMovieClick(movie.movieId)}
                className="w-full flex items-center gap-3 p-3 hover:bg-bg-hover rounded-lg transition-colors text-left"
              >
                {/* Movie Poster Thumbnail */}
                <div className="w-12 h-16 flex-shrink-0 bg-gradient-to-br from-bg-elevated to-bg-hover rounded-lg overflow-hidden">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-6 h-6 text-txt-muted opacity-40" />
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-txt-primary font-medium truncate">
                    {movie.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {movie.year && (
                      <span className="text-xs text-txt-muted">{movie.year}</span>
                    )}
                    {movie.genres && movie.genres.length > 0 && (
                      <>
                        <span className="text-xs text-txt-muted">•</span>
                        <span className="text-xs text-txt-secondary">
                          {movie.genres.slice(0, 2).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                  {movie.avg_rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-accent-gold">★</span>
                      <span className="text-xs text-txt-muted">
                        {movie.avg_rating.toFixed(1)}/5
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-2 bg-bg-card border border-bg-hover rounded-xl shadow-card-hover p-6 text-center">
          <Film className="w-12 h-12 text-txt-muted opacity-40 mx-auto mb-3" />
          <p className="text-txt-secondary">No movies found for "{query}"</p>
          <p className="text-txt-muted text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default MovieSearchBar;
