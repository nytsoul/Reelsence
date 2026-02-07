import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Film, 
  Sparkles, 
  Brain, 
  Target, 
  BarChart3, 
  Heart,
  ArrowRight,
  Users,
  Trophy,
  Zap
} from 'lucide-react';

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
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #e50914 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, #f5c518 0%, transparent 50%)`,
          }} />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Film className="w-8 h-8 text-accent-red" />
                    <Sparkles className="w-4 h-4 text-accent-gold absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <span className="text-accent-red font-medium">Next-Generation Recommendations</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-txt-primary leading-tight">
                  <span className="gradient-text">ReelSense++</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-txt-secondary font-light leading-relaxed">
                  Explainable & Diversity-Aware<br />
                  <span className="text-txt-primary">Movie Recommendations</span>
                </p>
              </div>

              <p className="text-txt-secondary text-lg leading-relaxed max-w-xl">
                Experience the future of movie discovery with our hybrid AI system that combines 
                collaborative filtering and content analysis. Every recommendation comes with 
                clear explanations and optimized diversity.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/analytics" className="btn-primary inline-flex items-center gap-2 justify-center">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <a 
                  href="#get-started" 
                  className="btn-secondary inline-flex items-center gap-2 justify-center"
                >
                  <Zap className="w-4 h-4" />
                  Get Started
                </a>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-slide-in-right">
              <div className="relative bg-gradient-to-br from-bg-card to-bg-elevated rounded-2xl p-8 shadow-card-hover">
                {/* Mock movie grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`aspect-[2/3] rounded-lg bg-gradient-to-br opacity-80 animate-float ${
                        i % 3 === 0 ? 'from-red-900 to-red-700' :
                        i % 3 === 1 ? 'from-blue-900 to-blue-700' :
                        'from-purple-900 to-purple-700'
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-accent-gold">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium text-sm">Personalized for You</span>
                  </div>
                  <p className="text-txt-muted text-xs">10 recommendations with explanations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-bg-hover">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }, index) => (
              <div 
                key={label} 
                className="text-center space-y-3 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-red bg-opacity-20">
                  <Icon className="w-6 h-6 text-accent-red" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl lg:text-3xl font-heading font-bold text-txt-primary">{value}</div>
                  <div className="text-txt-muted text-sm uppercase tracking-wider">{label}</div>
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
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-txt-primary">
                Discover Your Next Favorite Movie
              </h2>
              <p className="text-txt-secondary text-lg max-w-2xl mx-auto">
                Enter your User ID (1-610) to get personalized recommendations powered by 100,000+ ratings
              </p>
            </div>

            {/* User Input Form */}
            <div className="max-w-md mx-auto">
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
                  className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="text-center space-y-4 mb-16">
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
                className={`card p-6 hover:shadow-glow transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color} bg-opacity-20`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold text-txt-primary">
                    {feature.title}
                  </h3>
                  
                  <p className="text-txt-secondary text-sm leading-relaxed">
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