import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Star, 
  Heart, 
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  BarChart3,
  Zap,
  Film,
  Target,
  Clock,
  Trophy,
  TrendingUp,
  Layers,
  RefreshCw,
  Grid,
  LayoutGrid,
  Flame,
  Eye,
  Award,
  Shuffle
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { recommendationAPI, userAPI } from '../services/api';

const TasteProfile = ({ userProfile, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-bg-hover rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-bg-hover rounded"></div>
            <div className="h-3 bg-bg-hover rounded w-5/6"></div>
            <div className="h-3 bg-bg-hover rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="card p-6 sticky top-24">
      <h3 className="font-heading font-semibold text-txt-primary mb-4 flex items-center gap-2">
        <User className="w-4 h-4" />
        Your Taste Profile
      </h3>

      <div className="space-y-4">
        {/* User Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-txt-secondary text-sm">Movies Rated</span>
            <span className="font-medium text-txt-primary">{userProfile.movies_rated || 0}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-txt-secondary text-sm">Avg Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 star-filled fill-current" />
              <span className="font-medium text-txt-primary">
                {userProfile.avg_rating ? userProfile.avg_rating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Favorite Genres */}
        {userProfile.favorite_genres && userProfile.favorite_genres.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-txt-primary">Favorite Genres</h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.favorite_genres.slice(0, 5).map((genre, index) => (
                <span 
                  key={genre}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    index === 0 ? 'bg-accent-red bg-opacity-20 text-accent-red' :
                    index === 1 ? 'bg-accent-gold bg-opacity-20 text-accent-gold' :
                    index === 2 ? 'bg-accent-green bg-opacity-20 text-accent-green' :
                    'bg-bg-hover text-txt-secondary'
                  }`}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Activity */}
        <div className="pt-4 border-t border-bg-hover">
          <div className="flex items-center gap-2 text-txt-muted text-xs">
            <Calendar className="w-3 h-3" />
            <span>Member since MovieLens dataset</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendationsPage = () => {
  const { userId } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('comfortable'); // 'compact' | 'comfortable'
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'popular' | 'hidden' | 'highrated' | 'diverse'
  const [sortBy, setSortBy] = useState('confidence'); // 'confidence' | 'rating' | 'title'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch recommendations and user profile in parallel
        const [recsResponse, profileResponse] = await Promise.all([
          recommendationAPI.getRecommendations(userId, { top_n: 10 }),
          userAPI.getProfile(userId).catch(() => null) // Don't fail if user profile fails
        ]);

        setRecommendations(recsResponse.data.recommendations || []);
        setUserProfile(profileResponse?.data);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'Failed to load recommendations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Filter and sort recommendations
  const filteredAndSortedRecs = useMemo(() => {
    let filtered = [...recommendations];
    
    // Apply filter mode
    switch (filterMode) {
      case 'popular':
        filtered = filtered.filter(m => m.predicted_rating > 4.2);
        break;
      case 'hidden':
        filtered = filtered.filter(m => m.predicted_rating > 4.0 && m.content_score > 0.5);
        break;
      case 'highrated':
        filtered = filtered.filter(m => m.predicted_rating >= 4.5);
        break;
      case 'diverse':
        // Show movies from different genres
        const seenGenres = new Set();
        filtered = filtered.filter(m => {
          const genre = m.genres?.[0];
          if (!genre || seenGenres.has(genre)) return false;
          seenGenres.add(genre);
          return true;
        });
        break;
      default:
        // 'all' - no filtering
        break;
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.predicted_rating || 0) - (a.predicted_rating || 0));
        break;
      case 'title':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'confidence':
      default:
        filtered.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
        break;
    }
    
    return filtered;
  }, [recommendations, filterMode, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent-red mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-semibold text-txt-primary">
              Generating Your Recommendations
            </h2>
            <p className="text-txt-secondary">
              Our hybrid AI is analyzing your preferences...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-6">
          <AlertCircle className="w-16 h-16 text-accent-red mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-semibold text-txt-primary">
              Oops! Something went wrong
            </h2>
            <p className="text-txt-secondary">{error}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Try Again
            </button>
            <Link to="/" className="btn-secondary w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Compute genre distribution from filtered recommendations
  const genreDistribution = filteredAndSortedRecs.reduce((acc, movie) => {
    (movie.genres || []).forEach(g => { acc[g] = (acc[g] || 0) + 1; });
    return acc;
  }, {});
  const topGenres = Object.entries(genreDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxGenreCount = topGenres.length > 0 ? topGenres[0][1] : 1;

  const avgConfidence = filteredAndSortedRecs.length > 0
    ? (filteredAndSortedRecs.reduce((s, m) => s + (m.confidence || 0), 0) / filteredAndSortedRecs.length * 100).toFixed(0)
    : 0;

  const avgPredictedRating = filteredAndSortedRecs.length > 0
    ? (filteredAndSortedRecs.reduce((s, m) => s + (m.predicted_rating || 0), 0) / filteredAndSortedRecs.length).toFixed(1)
    : 0;

  const filterModes = [
    { id: 'all', label: 'All Movies', icon: Film, color: 'accent-red' },
    { id: 'popular', label: 'Popular', icon: Flame, color: 'accent-gold' },
    { id: 'hidden', label: 'Hidden Gems', icon: Eye, color: 'accent-green' },
    { id: 'highrated', label: 'Top Rated', icon: Award, color: 'accent-purple' },
    { id: 'diverse', label: 'Diverse Mix', icon: Shuffle, color: 'accent-blue' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-txt-muted mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-txt-secondary hover:text-accent-red transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span className="text-txt-muted">/</span>
          <span className="text-txt-primary">Recommendations</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-red bg-opacity-15 text-accent-red text-xs font-semibold">
                <Zap className="w-3 h-3" /> Hybrid AI
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-green bg-opacity-15 text-accent-green text-xs font-semibold">
                <Target className="w-3 h-3" /> Top {recommendations.length}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-txt-primary">
              Your Picks, <span className="gradient-text">User {userId}</span>
            </h1>
            <p className="text-txt-secondary text-sm">
              Personalized recommendations powered by hybrid AI with explanations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-outline flex items-center gap-2 !px-4 !py-2 text-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <Link 
              to="/analytics" 
              className="btn-secondary flex items-center gap-2 !px-4 !py-2 text-sm"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </Link>
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* Filter Mode Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterModes.map(mode => {
              const Icon = mode.icon;
              const isActive = filterMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setFilterMode(mode.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? `bg-${mode.color} bg-opacity-20 text-${mode.color} border border-${mode.color} border-opacity-30` 
                      : 'bg-bg-elevated text-txt-secondary hover:bg-bg-hover border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {mode.label}
                </button>
              );
            })}
          </div>

          {/* View & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-bg-elevated border border-bg-hover rounded-lg text-xs text-txt-primary focus:outline-none focus:border-accent-red"
            >
              <option value="confidence">Sort: Match %</option>
              <option value="rating">Sort: Rating</option>
              <option value="title">Sort: Title</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg">
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded transition-all ${
                  viewMode === 'compact' ? 'bg-accent-red text-white' : 'text-txt-muted hover:text-txt-primary'
                }`}
                title="Compact View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('comfortable')}
                className={`p-1.5 rounded transition-all ${
                  viewMode === 'comfortable' ? 'bg-accent-red text-white' : 'text-txt-muted hover:text-txt-primary'
                }`}
                title="Comfortable View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        {recommendations.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="card px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-red bg-opacity-15 flex items-center justify-center">
                <Film className="w-4 h-4 text-accent-red" />
              </div>
              <div>
                <div className="text-lg font-heading font-bold text-txt-primary">{filteredAndSortedRecs.length}</div>
                <div className="text-xs text-txt-muted">Showing</div>
              </div>
            </div>
            <div className="card px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-gold bg-opacity-15 flex items-center justify-center">
                <Star className="w-4 h-4 text-accent-gold" />
              </div>
              <div>
                <div className="text-lg font-heading font-bold text-txt-primary">{avgPredictedRating}</div>
                <div className="text-xs text-txt-muted">Avg Rating</div>
              </div>
            </div>
            <div className="card px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-green bg-opacity-15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent-green" />
              </div>
              <div>
                <div className="text-lg font-heading font-bold text-txt-primary">{avgConfidence}%</div>
                <div className="text-xs text-txt-muted">Avg Match</div>
              </div>
            </div>
            <div className="card px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-purple bg-opacity-15 flex items-center justify-center">
                <Layers className="w-4 h-4 text-accent-purple" />
              </div>
              <div>
                <div className="text-lg font-heading font-bold text-txt-primary">{new Set(filteredAndSortedRecs.flatMap(m => m.genres || [])).size}</div>
                <div className="text-xs text-txt-muted">Genres</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content - Recommendations */}
          <div className="lg:col-span-3">
            {filteredAndSortedRecs.length === 0 ? (
              <div className="card p-8 text-center space-y-4">
                <Heart className="w-12 h-12 text-txt-muted mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-semibold text-txt-primary">
                    {recommendations.length === 0 ? 'No Recommendations Available' : 'No Movies Match This Filter'}
                  </h3>
                  <p className="text-txt-secondary">
                    {recommendations.length === 0 
                      ? `We couldn't generate recommendations for User ${userId}. This user might not have enough rating history.`
                      : 'Try adjusting your filter or viewing all movies.'}
                  </p>
                </div>
                {recommendations.length === 0 ? (
                  <Link to="/" className="btn-primary">
                    Try Another User ID
                  </Link>
                ) : (
                  <button onClick={() => setFilterMode('all')} className="btn-primary">
                    View All Movies
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Section Label */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-txt-muted uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                    Recommended for you
                  </h2>
                  <span className="text-xs text-txt-muted">{filteredAndSortedRecs.length} results</span>
                </div>

                {/* Recommendations Grid */}
                <div className={`grid gap-4 ${
                  viewMode === 'compact' 
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {filteredAndSortedRecs.map((movie, index) => (
                    <div
                      key={movie.movieId}
                      className={`animate-slide-up stagger-${Math.min(index + 1, 10)} relative`}
                    >
                      {/* Rank Badge */}
                      <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-accent-red flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">#{index + 1}</span>
                      </div>
                      <MovieCard 
                        movie={movie} 
                        showExplanation={true} 
                        compact={viewMode === 'compact'} 
                      />
                    </div>
                  ))}
                </div>

                {/* Recommendation Insights */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Summary Card */}
                  <div className="card p-5 space-y-3">
                    <h3 className="text-sm font-heading font-semibold text-txt-primary flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-accent-gold" />
                      Recommendation Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center space-y-1">
                        <div className="text-xl font-heading font-bold text-accent-red">
                          {filteredAndSortedRecs.filter(m => m.confidence > 0.7).length}
                        </div>
                        <div className="text-xs text-txt-muted">High Confidence</div>
                      </div>
                      <div className="text-center space-y-1">
                        <div className="text-xl font-heading font-bold text-accent-gold">
                          {filteredAndSortedRecs.filter(m => m.predicted_rating >= 4.0).length}
                        </div>
                        <div className="text-xs text-txt-muted">4+ Stars</div>
                      </div>
                      <div className="text-center space-y-1">
                        <div className="text-xl font-heading font-bold text-accent-green">
                          {new Set(filteredAndSortedRecs.flatMap(m => m.genres || [])).size}
                        </div>
                        <div className="text-xs text-txt-muted">Genres</div>
                      </div>
                    </div>
                  </div>

                  {/* Genre Distribution */}
                  <div className="card p-5 space-y-3">
                    <h3 className="text-sm font-heading font-semibold text-txt-primary flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-accent-blue" />
                      Genre Distribution
                    </h3>
                    <div className="space-y-2">
                      {topGenres.map(([genre, count]) => (
                        <div key={genre} className="flex items-center gap-2">
                          <span className="text-xs text-txt-secondary w-20 truncate">{genre}</span>
                          <div className="flex-1 h-2 bg-bg-hover rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-accent-red to-accent-gold rounded-full transition-all duration-700"
                              style={{ width: `${(count / maxGenreCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-txt-muted w-4 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Method Banner */}
                <div className="card p-4 bg-gradient-to-r from-bg-card via-bg-elevated to-bg-card border border-bg-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-red bg-opacity-15 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-accent-red" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-txt-primary">Powered by Hybrid AI Engine</h4>
                      <p className="text-xs text-txt-muted mt-0.5">
                        Combining collaborative filtering, content-based analysis, and popularity signals for accurate predictions.
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-xs text-txt-muted flex-shrink-0">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Taste Profile */}
          <div className="lg:col-span-1">
            <TasteProfile userProfile={userProfile} isLoading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;