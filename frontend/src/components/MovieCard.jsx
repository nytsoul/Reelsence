import React from 'react';
import { Star, Film, Calendar, Tag, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const MoviePoster = ({ movie }) => {
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

  return (
    <div className={`aspect-[2/3] bg-gradient-to-br ${getGenreGradient(movie.genres)} rounded-xl overflow-hidden relative group`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Film className="w-16 h-16 text-white opacity-40" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 poster-overlay">
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

const MovieCard = ({ movie, showExplanation = true }) => {
  const badge = getBadge(movie);

  return (
    <Link 
      to={`/movie/${movie.movieId}`}
      className="block group"
    >
      <div className="card-hover h-full flex flex-col p-4">
        {/* Movie Poster */}
        <MoviePoster movie={movie} />

        {/* Movie Info */}
        <div className="flex-1 pt-4 space-y-3">
          {/* Title */}
          <h3 className="font-heading font-semibold text-txt-primary group-hover:text-accent-red transition-colors line-clamp-2">
            {movie.title}
          </h3>

          {/* Year & Genres */}
          <div className="flex flex-wrap gap-1.5">
            {movie.year && (
              <span className="flex items-center gap-1 px-2 py-1 bg-bg-hover text-txt-muted text-xs rounded-lg">
                <Calendar className="w-3 h-3" />
                {movie.year}
              </span>
            )}
            {movie.genres?.slice(0, 2).map((genre, index) => (
              <span 
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-accent-blue bg-opacity-20 text-accent-blue text-xs rounded-lg"
              >
                <Tag className="w-3 h-3" />
                {genre}
              </span>
            ))}
          </div>

          {/* Rating */}
          {movie.predicted_rating && (
            <StarRating rating={movie.predicted_rating} />
          )}

          {/* Badge */}
          {badge && (
            <div className={`inline-block ${badge.class} text-xs font-medium`}>
              {badge.text}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && movie.explanation && (
            <div className="pt-2 border-t border-bg-hover">
              <p className="text-xs text-txt-secondary leading-relaxed line-clamp-3">
                <span className="text-accent-gold font-medium">Why: </span>
                {movie.explanation}
              </p>
            </div>
          )}

          {/* Confidence */}
          {movie.confidence && (
            <div className="flex items-center gap-2 text-xs text-txt-muted">
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
