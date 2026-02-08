import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Film, 
  Sparkles, 
  Brain, 
  Target, 
  BarChart3, 
  Heart,
  ArrowRight,
  Users,
  Trophy
} from 'lucide-react';
import MovieSearchBar from '../components/MovieSearchBar';
import { safeScrollIntoView, devLog } from '../utils/production';

const HomePage = () => {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    if (!userId || userId < 1 || userId > 610) {
      alert('Please enter a valid User ID between 1 and 610');
      return;
    }
    
    setIsLoading(true);
    devLog('Getting recommendations for user:', userId);
    // Simulate a small delay for better UX
    setTimeout(() => {
      navigate(`/recommendations/${userId}`);
      setIsLoading(false);
    }, 500);
  };

  const features = [
    {
      icon: Brain,
      title: 'Hybrid AI',
      description: 'Combines collaborative filtering with content-based recommendations for superior accuracy',
      color: 'accent-red',
    },
    {
      icon: Sparkles,
      title: 'Explanations',
      description: 'Multi-level explanations from simple to advanced, telling you why each movie was recommended',
      color: 'accent-gold',
    },
    {
      icon: Target,
      title: 'Diversity',
      description: 'Optimized for catalog coverage and avoiding popularity bias for long-tail discovery',
      color: 'accent-green',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Real-time model performance metrics, diversity statistics, and recommendation insights',
      color: 'accent-blue',
    },
  ];

  const stats = [
    { label: 'Movies', value: '9,742', icon: Film },
    { label: 'Users', value: '610', icon: Users },
    { label: 'Ratings', value: '100K+', icon: Heart },
    { label: 'Accuracy', value: '90%', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Cinematic Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-black to-orange-950/20">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(ellipse at top right, rgba(229, 9, 20, 0.15) 0%, transparent 50%),
                               radial-gradient(ellipse at bottom left, rgba(255, 140, 0, 0.15) 0%, transparent 50%),
                               radial-gradient(circle at center, rgba(139, 0, 0, 0.05) 0%, transparent 70%)`,
            }}
          />
          {/* Particles effect */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent)',
              backgroundSize: '200px 200px, 150px 150px, 100px 100px',
              animation: 'twinkle 3s ease-in-out infinite'
            }}
          />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Text */}
              <div className="space-y-8 z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-accent-red font-medium animate-fade-in-down delay-200">
                    <Film className="w-5 h-5" />
                    <span>ReelSense++</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-heading font-black leading-tight animate-fade-in-up delay-300">
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text">
                      Explainable AI Movie
                    </span>
                    <br />
                    <span className="text-white">Recommendations</span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-xl leading-relaxed animate-fade-in-up delay-500">
                    Powered by hybrid ML • Diversity aware • Transparent
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <button
                    onClick={() => safeScrollIntoView('get-started')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-red-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-1 overflow-hidden transform"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Film className="w-5 h-5" />
                      Search Movies
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  
                  <button
                    onClick={() => safeScrollIntoView('get-started')}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:border-white/40 transform"
                  >
                    Get Recommendations
                  </button>
                </div>
              </div>

              {/* Hero Visual - Movie Posters Showcase */}
              <div className="relative h-[600px] hidden lg:block animate-fade-in delay-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Center featured poster */}
                  <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-110 transition-all duration-700 z-20 border-2 border-orange-500/50 animate-bounce-in delay-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-red-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-24 h-24 text-white opacity-40" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <h3 className="text-white font-bold text-lg">Featured Movie</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-500 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Left poster */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-72 rounded-xl overflow-hidden shadow-xl transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-700 z-10 opacity-80 hover:opacity-100 animate-slide-in-left delay-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-16 h-16 text-white opacity-30" />
                      </div>
                    </div>
                  </div>

                  {/* Right poster */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-72 rounded-xl overflow-hidden shadow-xl transform rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-700 z-10 opacity-80 hover:opacity-100 animate-slide-in-right delay-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-pink-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-16 h-16 text-white opacity-30" />
                      </div>
                    </div>
                  </div>

                  {/* Top left poster */}
                  <div className="absolute left-12 top-0 w-40 h-60 rounded-xl overflow-hidden shadow-xl transform -rotate-6 opacity-60 hover:opacity-100 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-blue-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-12 h-12 text-white opacity-30" />
                      </div>
                    </div>
                  </div>

                  {/* Top right poster */}
                  <div className="absolute right-12 top-0 w-40 h-60 rounded-xl overflow-hidden shadow-xl transform rotate-6 opacity-60 hover:opacity-100 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 to-orange-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-12 h-12 text-white opacity-30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon }, index) => (
              <div 
                key={label} 
                className={`relative group animate-scale-in delay-${(index + 2) * 100}`}
              >
                <div className="relative bg-gradient-to-br from-red-950/50 to-black border border-red-900/30 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-3xl lg:text-4xl font-heading font-bold text-white mb-1">
                    {value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-gray-400 text-sm font-medium">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4 animate-fade-in-up delay-200">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-txt-primary">
                Discover Your Next Favorite Movie
              </h2>
              <p className="text-txt-secondary text-lg max-w-2xl mx-auto">
                Search for any movie or enter your User ID to get personalized recommendations
              </p>
            </div>

            {/* Search Bar Option */}
            <div className="max-w-xl mx-auto mb-8 animate-fade-in-up delay-400">
              <div className="text-sm text-txt-muted mb-3 flex items-center justify-center gap-2">
                <Film className="w-4 h-4" />
                <span>Search our database of 9,742 movies</span>
              </div>
              <MovieSearchBar />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 max-w-md mx-auto my-8">
              <div className="flex-1 h-px bg-bg-hover"></div>
              <span className="text-txt-muted text-sm">OR</span>
              <div className="flex-1 h-px bg-bg-hover"></div>
            </div>

            {/* User Input Form */}
            <div className="max-w-md mx-auto animate-fade-in-up delay-600">
              <div className="text-sm text-txt-muted mb-3">
                Get AI-powered personalized recommendations
              </div>
              <form onSubmit={handleGetRecommendations} className="space-y-4">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="610"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID (1-610)"
                    className="input-field text-center text-lg"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/30 hover:glow-red"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Get My Recommendations
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </form>
              
              <p className="text-txt-muted text-sm mt-3">
                Try User ID: 1, 15, 42, or 123 for diverse recommendation styles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bg-card">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 animate-fade-in-up delay-200">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-txt-primary">
              Why ReelSense++ is Different
            </h2>
            <p className="text-txt-secondary text-lg max-w-3xl mx-auto">
              Built for the BrainDead2K26 competition with cutting-edge ML techniques and user-centric design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`card p-6 hover:shadow-glow transition-all duration-700 animate-fade-in-up hover:scale-110 hover:-translate-y-3 hover:shadow-2xl group cursor-pointer delay-${(index + 4) * 100}`}
              >
                <div className="space-y-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-500 group-hover:scale-125`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color} group-hover:animate-pulse`} />
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold text-txt-primary group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-txt-secondary text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;