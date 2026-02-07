import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Tag, 
  ExternalLink,
  Lightbulb,
  Brain,
  Layers,
  Loader2,
  AlertCircle,
  Film
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { movieAPI } from '../services/api';

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
    <div className={`aspect-[2/3] bg-gradient-to-br ${getGenreGradient(movie.genres)} rounded-xl overflow-hidden relative`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Film className="w-24 h-24 text-white opacity-40" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 poster-overlay">
        <h3 className="text-white font-semibold text-lg line-clamp-2">{movie.title}</h3>
      </div>
    </div>
  );
};

const StarRating = ({ rating, size = 'md' }) => {
  const stars = Math.round(rating);
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${iconSize} ${i < stars ? 'star-filled fill-current' : 'star-empty'}`}
          />
        ))}
      </div>
      <span className={`text-txt-muted ml-1 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const ExplanationCard = ({ explanation, level, icon: Icon, color }) => {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color} bg-opacity-20`}>
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
        <h3 className="font-heading font-semibold text-txt-primary capitalize">
          {level} Explanation
        </h3>
      </div>
      
      <p className="text-txt-secondary leading-relaxed">
        {explanation}
      </p>
    </div>
  );
};

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch movie details and similar movies
        const [movieResponse, similarResponse] = await Promise.all([
          movieAPI.getMovieDetails(movieId),
          movieAPI.getSimilarMovies(movieId, { top_n: 6 })
        ]);

        setMovie(movieResponse.data);
        setSimilarMovies(similarResponse.data.similar_movies || []);

      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err.response?.data?.error || 'Failed to load movie details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchData();
    }
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent-red mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-semibold text-txt-primary">
              Loading Movie Details
            </h2>
            <p className="text-txt-secondary">
              Fetching information and similar recommendations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-6">
          <AlertCircle className="w-16 h-16 text-accent-red mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-semibold text-txt-primary">
              Movie Not Found
            </h2>
            <p className="text-txt-secondary">
              {error || 'This movie could not be found in our database.'}
            </p>
          </div>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Parse year from title if available
  const yearMatch = movie.title?.match(/\\((\\d{4})\\)$/);
  const year = yearMatch ? yearMatch[1] : null;
  const cleanTitle = movie.title?.replace(/\\(\\d{4}\\)$/, '').trim() || 'Unknown Movie';

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-txt-secondary hover:text-txt-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Movie Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <MoviePoster movie={movie} />
              
              {/* External Links */}
              {(movie.imdbId || movie.tmdbId) && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-heading font-semibold text-txt-primary">External Links</h4>
                  <div className="space-y-2">
                    {movie.imdbId && (
                      <a
                        href={`https://www.imdb.com/title/tt${movie.imdbId.toString().padStart(7, '0')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-txt-secondary hover:text-accent-gold transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on IMDb
                      </a>
                    )}
                    {movie.tmdbId && (
                      <a
                        href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-txt-secondary hover:text-accent-blue transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on TMDb
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Basic Info */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-txt-primary leading-tight">
                {cleanTitle}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                {year && (
                  <div className="flex items-center gap-2 text-txt-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{year}</span>
                  </div>
                )}
                
                {movie.avg_rating && (
                  <StarRating rating={movie.avg_rating} size="lg" />
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, index) => (
                    <span 
                      key={genre}
                      className="flex items-center gap-1 px-3 py-1.5 bg-accent-blue bg-opacity-20 text-accent-blue rounded-lg font-medium"
                    >
                      <Tag className="w-3 h-3" />
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-semibold text-txt-primary">Overview</h2>
              
              {movie.tags && movie.tags.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-txt-secondary leading-relaxed">
                    This movie has been tagged by users with themes and elements including: {' '}
                    <span className="text-txt-primary">
                      {movie.tags.slice(0, 10).join(', ')}
                    </span>
                    {movie.tags.length > 10 && <span className="text-txt-muted"> and {movie.tags.length - 10} more</span>}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {movie.tags.slice(0, 8).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-bg-hover text-txt-secondary text-sm rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-txt-secondary">
                  No detailed overview available for this movie. Check external links for more information.
                </p>
              )}
            </div>

            {/* Movie Stats */}
            {(movie.rating_count || movie.avg_rating) && (
              <div className="card p-6">
                <h3 className="font-heading font-semibold text-txt-primary mb-4">Movie Statistics</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {movie.rating_count && (
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-heading font-bold text-accent-gold">
                        {movie.rating_count.toLocaleString()}
                      </div>
                      <div className="text-sm text-txt-secondary">Total Ratings</div>
                    </div>
                  )}
                  
                  {movie.avg_rating && (
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-heading font-bold text-accent-red">
                        {movie.avg_rating.toFixed(1)}/5
                      </div>
                      <div className="text-sm text-txt-secondary">Average Rating</div>
                    </div>
                  )}
                  
                  {movie.tags && (
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-heading font-bold text-accent-green">
                        {movie.tags.length}
                      </div>
                      <div className="text-sm text-txt-secondary">User Tags</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Why Recommended Section (Mock) */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-txt-primary mb-6">
            Why This Was Recommended
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <ExplanationCard
              explanation="This movie matches your preference for highly-rated films in your favorite genres."
              level="simple"
              icon={Lightbulb}
              color="accent-gold"
            />
            
            <ExplanationCard
              explanation="Based on collaborative filtering, users with similar tastes to yours have rated this movie highly (4.2+ stars on average)."
              level="intermediate"  
              icon={Brain}
              color="accent-blue"
            />
            
            <ExplanationCard
              explanation="Hybrid score: CF component (0.78) + Content similarity (0.65) weighted by model confidence. Genre overlap with your top preferences: 85%."
              level="advanced"
              icon={Layers}
              color="accent-red"
            />
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-txt-primary mb-6">
              Similar Movies
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similarMovies.map((movie, index) => (
                <div
                  key={movie.movieId}
                  className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <MovieCard movie={movie} showExplanation={false} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;