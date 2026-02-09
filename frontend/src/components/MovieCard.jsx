import React, { useState } from 'react';
import { Star, Film, Calendar, Tag, TrendingUp, Share2, Bookmark, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

// TMDB Image base URL - no API key needed for images
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const MoviePoster = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const getGenreGradient = (genres) => {
    if (!genres || genres.length === 0) return 'from-bg-elevated to-bg-hover';
    
    const genreColors = {
      'Action': 'from-red-900 to-red-700',
      'Adventure': 'from-orange-900 to-orange-700', 
      'Comedy': 'from-yellow-900 to-yellow-700',
      'Drama': 'from-blue-900 to-blue-700',
      'Horror': 'from-gray-900 to-gray-700',
      'Romance': 'from-pink-900 to-pink-700',
      'Sci-Fi': 'from-purple-900 to-purple-700',
      'Thriller': 'from-green-900 to-green-700',
      'Animation': 'from-cyan-900 to-cyan-700',
      'Fantasy': 'from-indigo-900 to-indigo-700',
    };
    
    return genreColors[genres[0]] || 'from-bg-elevated to-bg-hover';
  };

  // Generate poster URL from TMDB ID
  const getPosterUrl = () => {
    if (movie.poster_path) {
      return `${TMDB_IMAGE_BASE}${movie.poster_path}`;
    }
    return null;
  };

  const posterUrl = getPosterUrl();
  const showFallback = !posterUrl || imageError;

  return (
    <div 
      className={`aspect-[2/3] bg-gradient-to-br ${getGenreGradient(movie.genres)} rounded-xl overflow-hidden relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Actual Poster Image */}
      {posterUrl && !imageError && (
        <img
          src={posterUrl}
          alt={movie.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
      
      {/* Fallback - Genre gradient with icon */}
      {(showFallback || !imageLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="w-16 h-16 text-white opacity-40" />
        </div>
      )}
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      {/* Quick Actions - Top Right */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <button
          onClick={(e) => { e.preventDefault(); alert('Bookmark feature coming soon!'); }}
          className="p-1.5 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-accent-red transition-all"
          title="Bookmark"
        >
          <Bookmark className="w-3.5 h-3.5 text-white" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(window.location.origin + `/movie/${movie.movieId}`); alert('Link copied!'); }}
          className="p-1.5 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-accent-blue transition-all"
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-accent-red/90 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
        </div>
      </div>
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 poster-overlay opacity-100 group-hover:opacity-0 transition-opacity duration-300">
        <h4 className="text-white font-semibold text-sm line-clamp-2">{movie.title}</h4>
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < stars ? 'star-filled fill-current' : 'star-empty'}`}
          />
        ))}
      </div>
      <span className="text-xs text-txt-muted ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

const getBadge = (movie) => {
  if (movie.confidence > 0.8 && movie.cf_score > movie.content_score) {
    return { text: '🧠 Hybrid Pick', class: 'badge-red' };
  } else if (movie.predicted_rating > 4.0 && movie.content_score > 0.5) {
    return { text: '🌱 Long-Tail Discovery', class: 'badge-green' };
  } else if (movie.predicted_rating > 4.2) {
    return { text: '🔥 Popular Choice', class: 'badge-gold' };
  }
  return null;
};

const MovieCard = ({ movie, showExplanation = true, compact = false }) => {
  const badge = getBadge(movie);

  return (
    <Link 
      to={`/movie/${movie.movieId}`}
      className="block group"
    >
      <div className={`card-hover h-full flex flex-col ${compact ? 'p-2.5' : 'p-3'}`}>
        {/* Movie Poster */}
        <MoviePoster movie={movie} />

        {/* Movie Info */}
        <div className={`flex-1 ${compact ? 'pt-2 space-y-1.5' : 'pt-3 space-y-2'}`}>
          {/* Title */}
          <h3 className={`font-heading font-semibold text-txt-primary group-hover:text-accent-red transition-colors line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {movie.title}
          </h3>

          {/* Year & Genres */}
          <div className="flex flex-wrap gap-1">
            {movie.year && (
              <span className={`flex items-center gap-0.5 px-1.5 py-0.5 bg-bg-hover text-txt-muted rounded-md ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                <Calendar className="w-2.5 h-2.5" />
                {movie.year}
              </span>
            )}
            {movie.genres?.slice(0, compact ? 1 : 2).map((genre, index) => (
              <span 
                key={index}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md ${compact ? 'text-[10px]' : 'text-[11px]'}`}
              >
                <Tag className="w-2.5 h-2.5" />
                {genre}
              </span>
            ))}
          </div>

          {/* Rating */}
          {movie.predicted_rating && (
            <StarRating rating={movie.predicted_rating} />
          )}

          {/* Badge */}
          {badge && !compact && (
            <div className={`inline-block ${badge.class} text-[10px] font-medium`}>
              {badge.text}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && movie.explanation && !compact && (
            <div className="pt-1.5 border-t border-bg-hover">
              <p className="text-[10px] text-txt-secondary leading-relaxed line-clamp-2">
                <span className="text-accent-gold font-medium">Why: </span>
                {movie.explanation}
              </p>
            </div>
          )}

          {/* Confidence */}
          {movie.confidence && (
            <div className={`flex items-center gap-1 text-txt-muted ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
              <TrendingUp className="w-3 h-3" />
              <span>{(movie.confidence * 100).toFixed(0)}% match</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
