import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Heart, Share2 } from 'lucide-react';

const MovieCard = ({ movie, showExplanation, compact }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Extracting details with fallbacks
  const title = movie.title || 'Unknown Title';
  const rating = movie.rating || (movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A');
  const genres = movie.genres ? movie.genres.slice(0, 2).map(g => g.name || g).join(', ') : '';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : (movie.year || '');
  const overview = movie.overview || movie.description || '';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : (movie.image || 'https://via.placeholder.com/500x750?text=No+Poster');

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
      className="group relative card-premium aspect-[2/3] animate-fade-in-up rounded-2xl overflow-hidden cursor-pointer block h-full w-full max-w-[10rem] sm:max-w-[8rem] mx-auto"
    >
      {/* Poster Image */}
      <img
        src={posterUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Glass Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Rating Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 backdrop-blur-md bg-slate-900/60 border border-yellow-400/30 px-3 py-1.5 rounded-full">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <span className="text-white font-semibold text-sm">{rating}</span>
      </div>

      {/* Year Badge */}
      {year && (
        <div className="absolute top-4 left-4 z-20">
          <span className="backdrop-blur-md bg-slate-900/60 border border-slate-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300">
            {year}
          </span>
        </div>
      )}

      {/* Content Container */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
        {/* Metadata */}
        {genres && (
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-3">
            {genres}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold leading-tight mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
          {title}
        </h3>

        {/* Description */}
        {overview && (
          <p className="text-xs text-slate-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
            {overview}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
          <button
            onClick={(e) => e.preventDefault()}
            className="flex-1 h-11 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 transition-all duration-300"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Details</span>
          </button>
          
          <button
            onClick={handleFavorite}
            className={`w-11 h-11 rounded-lg font-bold flex items-center justify-center transition-all duration-300 ${
              isFavorited
                ? 'bg-red-500/80 text-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="w-11 h-11 bg-white/15 hover:bg-white/25 rounded-lg font-bold flex items-center justify-center text-white transition-all duration-300"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-600/30 to-pink-600/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
    </Link>
  );
};

export default MovieCard;
