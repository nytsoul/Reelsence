import React, { useState, useEffect } from 'react';
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
  BarChart3
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

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-txt-secondary hover:text-txt-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-txt-primary">
                Your Top 10 Movies, <span className="gradient-text">User {userId}</span>
              </h1>
              <p className="text-txt-secondary">
                Personalized recommendations powered by hybrid AI with explanations
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to="/analytics" 
                className="btn-secondary flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - Recommendations */}
          <div className="lg:col-span-3">
            {recommendations.length === 0 ? (
              <div className="card p-8 text-center space-y-4">
                <Heart className="w-12 h-12 text-txt-muted mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-semibold text-txt-primary">
                    No Recommendations Available
                  </h3>
                  <p className="text-txt-secondary">
                    We couldn't generate recommendations for User {userId}. 
                    This user might not have enough rating history.
                  </p>
                </div>
                <Link to="/" className="btn-primary">
                  Try Another User ID
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recommendations Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recommendations.map((movie, index) => (
                    <div
                      key={movie.movieId}
                      className={`animate-slide-up stagger-${Math.min(index + 1, 10)}`}
                    >
                      <MovieCard movie={movie} showExplanation={true} />
                    </div>
                  ))}
                </div>

                {/* Recommendation Summary */}
                <div className="card p-6 space-y-4">
                  <h3 className="font-heading font-semibold text-txt-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-gold" />
                    Recommendation Summary
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-heading font-bold text-accent-red">
                        {recommendations.filter(m => m.confidence > 0.7).length}
                      </div>
                      <div className="text-sm text-txt-secondary">High Confidence</div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-heading font-bold text-accent-gold">
                        {recommendations.filter(m => m.predicted_rating >= 4.0).length}
                      </div>
                      <div className="text-sm text-txt-secondary">4+ Star Ratings</div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-heading font-bold text-accent-green">
                        {new Set(recommendations.flatMap(m => m.genres || [])).size}
                      </div>
                      <div className="text-sm text-txt-secondary">Unique Genres</div>
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