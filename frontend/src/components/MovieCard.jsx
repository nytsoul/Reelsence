import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Heart, Share2 } from 'lucide-react';

const MovieCard = ({ movie, showExplanation, compact }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Extracting details with fallbacks
  const title = movie.title || 'Unknown Title';
  const rating = movie.rating || (movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A');
  const genres = movie.genres ? movie.genres.slice(0, 2).map(g => g.name || g).join(', ') : '';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : (movie.year || '');
  const overview = movie.overview || movie.description || '';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : (movie.image || 'https://via.placeholder.com/500x750?text=No+Poster');

  const posterUrlWithRetry = posterUrl ? `${posterUrl}?v=${reloadKey}` : posterUrl;

  const handleFavorite = (e) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  const handleShare = (e) => {
    e.preventDefault();
    setShowShare(!showShare);
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out ${title}!`,
        url: window.location.href,
      });
    }
  };

  return (
    <Link
      to={`/movie/${movie.id || movie.movieId}`}
      className="group relative card-premium aspect-video animate-fade-in-up rounded-xl overflow-hidden cursor-pointer block h-full w-full"
    >
      {/* Poster Image */}
      <img
        src={posterUrlWithRetry}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onLoad={() => setImageError(false)}
        onError={() => setImageError(true)}
      />

      {imageError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-white">
          <span className="text-sm font-semibold">Failed to load image</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setReloadKey((prev) => prev + 1);
              setImageError(false);
            }}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
          >
            Retry
          </button>
        </div>
      )}

      {/* Glass Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />

      {/* Rating Badge */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 backdrop-blur-md bg-bg-deep/70 border border-white/10 px-2 py-0.5 rounded-full">
        <Star className="w-3 h-3 text-accent-warning fill-accent-warning" />
        <span className="text-white font-semibold text-xs">{rating}</span>
      </div>

      {/* Year Badge */}
      {year && (
        <div className="absolute top-2 left-2 z-20">
          <span className="backdrop-blur-md bg-bg-deep/70 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold text-txt-secondary">
            {year}
          </span>
        </div>
      )}

      {/* Content Container */}
      <div className="absolute inset-0 p-3 flex flex-col justify-end transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
        {/* Metadata */}
        {genres && (
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-1">
            {genres}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold leading-tight mb-2 line-clamp-2 text-white group-hover:text-white transition-all duration-300">
          {title}
        </h3>

        {/* Description */}
        {overview && (
          <p className="text-[11px] text-txt-secondary line-clamp-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
            {overview}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-200">
          <button
            onClick={(e) => e.preventDefault()}
            className="flex-1 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md font-semibold text-[11px] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-300"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Details</span>
          </button>
          
          <button
            onClick={handleFavorite}
            className={`w-8 h-8 rounded-md font-bold flex items-center justify-center transition-all duration-300 ${
              isFavorited
                ? 'bg-accent-danger/80 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-md font-bold flex items-center justify-center text-white transition-all duration-300"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-tr from-cyan-500/25 to-blue-600/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
    </Link>
  );
};

export default MovieCard;
