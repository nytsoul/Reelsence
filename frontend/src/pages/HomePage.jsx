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
  Trophy,
  Play,
  Zap,
  TrendingUp,
  Search as SearchIcon,
  Flame,
  Award,
} from 'lucide-react';
import MovieSearchBar from '../components/MovieSearchBar';
import MovieCard from '../components/MovieCard';
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
      <div className="min-h-screen bg-bg-primary selection:bg-cyan-500/30">

    setIsLoading(true);
    devLog('Getting recommendations for user:', userId);
    setTimeout(() => {
      navigate(`/recommendations/${userId}`);
      setIsLoading(false);
    }, 800);
  };

  // Features with new icons and descriptions
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Hybrid models combine collaborative filtering with semantic understanding.',
      gradient: 'from-cyan-500 to-blue-600',
      color: 'text-cyan-300',
    },
    {
      icon: Sparkles,
      title: 'Personalized Discovery',
      description: 'Tailored suggestions based on your unique taste and viewing patterns.',
      gradient: 'from-sky-500 to-cyan-600',
      color: 'text-sky-300',
    },
    {
      icon: Target,
      title: 'Break Through Bubbles',
      description: 'Find hidden gems and curated picks optimized for serendipity.',
      gradient: 'from-blue-500 to-indigo-600',
      color: 'text-blue-300',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track your viewing patterns and discover preference insights.',
      gradient: 'from-emerald-500 to-cyan-600',
      color: 'text-emerald-300',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every recommendation is checked for quality and relevance.',
      gradient: 'from-indigo-500 to-sky-600',
      color: 'text-indigo-300',
    },
    {
      icon: Flame,
      title: 'Trending Now',
      description: 'Stay current with what is trending and worth your time.',
      gradient: 'from-cyan-500 to-blue-700',
      color: 'text-cyan-300',
    },
  ];

  // Statistics
  const stats = [
    { label: 'Movie Library', value: '10K+', icon: Film },
    { label: 'Active Users', value: '2.5K', icon: Users },
    { label: 'Ratings', value: '1M+', icon: Heart },
    { label: 'Accuracy', value: '98%', icon: Trophy },
  ];

  // Sample movies for display
  const sampleMovies = [
    { id: 1, title: "Inception", rating: 4.8, genres: ["Sci-Fi", "Action"], release_date: "2010-07-16", poster_path: "/oYuSqiTvSbeZ0JaC07Gvda7tT2x.jpg" },
    { id: 2, title: "Interstellar", rating: 4.9, genres: ["Sci-Fi", "Drama"], release_date: "2014-11-05", poster_path: "/gEU2QniE6E77NI6lCU6MxlSv7rP.jpg" },
    { id: 3, title: "The Dark Knight", rating: 4.9, genres: ["Action", "Crime"], release_date: "2008-07-18", poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    { id: 4, title: "Pulp Fiction", rating: 4.7, genres: ["Crime", "Drama"], release_date: "1994-09-10", poster_path: "/d5iIl9h9btztU0kz5v9viOfpYnm.jpg" },
  ];

  return (
    <div className="min-h-screen bg-bg-primary selection:bg-cyan-500/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
                <Zap className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Prime-Grade Movie Intelligence</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                  Stream Smarter. <br />
                  <span className="gradient-text">Discover Better</span>
                </h1>
                <p className="text-lg text-txt-secondary max-w-lg leading-relaxed">
                  A Prime-inspired streaming experience with AI picks, curated rails, and detail-rich insights tailored to your taste.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => safeScrollIntoView('discovery')}
                  className="btn-primary"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Discovering
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => safeScrollIntoView('features')}
                  className="btn-secondary"
                >
                  Explore Features
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-8 opacity-80">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-primary overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" loading="lazy" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-txt-secondary">
                  Join <span className="font-bold text-white">50K+</span> movie enthusiasts
                </p>
              </div>
            </div>

            {/* Visual Preview - Desktop Only */}
            <div className="hidden lg:block relative">
              <div className="relative z-10 grid grid-cols-2 gap-4 translate-y-8">
                <div className="space-y-4">
                  <MovieCard movie={sampleMovies[0]} />
                  <MovieCard movie={sampleMovies[2]} />
                </div>
                <div className="space-y-4 -translate-y-12">
                  <MovieCard movie={sampleMovies[1]} />
                  <MovieCard movie={sampleMovies[3]} />
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="row-wrap">
            <div className="flex items-center justify-between mb-3">
              <h2 className="row-title">Indian Crime Action</h2>
              <button className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors">View all</button>
            </div>
            <div className="rail">
              {[...sampleMovies, ...sampleMovies].map((movie) => (
                <div key={`crime-${movie.id}-${movie.title}`} className="rail-item">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>

          <div className="row-wrap">
            <div className="flex items-center justify-between mb-3">
              <h2 className="row-title">Continue Watching for You</h2>
              <button className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors">Manage</button>
            </div>
            <div className="rail">
              {[...sampleMovies, ...sampleMovies].map((movie) => (
                <div key={`continue-${movie.id}-${movie.title}`} className="rail-item">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>

          <div className="row-wrap">
            <div className="flex items-center justify-between mb-3">
              <h2 className="row-title">Escapist Reality TV</h2>
              <button className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors">View all</button>
            </div>
            <div className="rail">
              {[...sampleMovies, ...sampleMovies].map((movie) => (
                <div key={`reality-${movie.id}-${movie.title}`} className="rail-item">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-effect p-6 md:p-7 text-center space-y-3 hover:bg-white/10 transition-all duration-300 animate-fade-in-up rounded-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-txt-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Section */}
      <section id="discovery" className="py-28 bg-gradient-to-b from-bg-primary to-bg-deep relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,168,225,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,168,225,.06)_1px,transparent_1px)] bg-[size:120px_120px]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 mb-20 animate-fade-in-up">
            <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Discovery Methods</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Find Movies Your Way
            </h2>
            <p className="text-txt-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              Search our vast library or let AI discover your next favorite film based on your preferences.
            </p>
          </div>

          {/* Two Discovery Paths */}
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up delay-200">
            {/* Smart Search */}
            <div className="glass-effect p-10 rounded-3xl space-y-8 border border-white/10 hover:border-cyan-500/30 transition-all">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <SearchIcon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Smart Search</h3>
                <p className="text-txt-secondary text-sm leading-relaxed">Browse and search our curated collection of 10,000+ movies with intelligent filtering.</p>
              </div>
              <MovieSearchBar />
            </div>

            {/* AI Personalized */}
            <div className="glass-effect p-10 rounded-3xl space-y-8 border border-cyan-500/30 hover:border-cyan-500/50 transition-all bg-gradient-to-br from-cyan-500/10 to-transparent">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">AI Personalized</h3>
                <p className="text-txt-secondary text-sm leading-relaxed">Enter your User ID to get AI-generated recommendations based on your viewing history.</p>
              </div>

              <form onSubmit={handleGetRecommendations} className="space-y-4">
                <input
                  type="number"
                  min="1"
                  max="610"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID (1-610)"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-txt-muted outline-none focus:bg-white/10 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full rounded-xl h-12"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      Generate Recommendations
                    </>
                  )}
                </button>
              </form>

              {/* Quick Try Options */}
              <div className="flex gap-2">
                {[15, 42, 123].map(id => (
                  <button
                    key={id}
                    onClick={() => setUserId(id)}
                    className="flex-1 text-xs font-bold uppercase tracking-widest text-txt-muted hover:text-cyan-300 py-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Try {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20 animate-fade-in-up">
            <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Powerful Features
            </h2>
            <p className="text-txt-secondary text-lg max-w-2xl mx-auto">
              Everything you need for the ultimate movie discovery experience.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 group transition-all duration-300 animate-fade-in-up h-full flex flex-col justify-between"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-txt-secondary text-sm leading-relaxed">{feature.description}</p>
                <div className="pt-6 flex items-center gap-2 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-3xl p-12 md:p-20 overflow-hidden text-center space-y-10">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/80 via-blue-700/80 to-slate-900/80 opacity-90" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                Ready for Prime-Style <br /> Movie Discovery?
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium mb-10">
                Join thousands of movie enthusiasts who discover their next favorites with ReelSense Prime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => safeScrollIntoView('discovery')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-100 transition-all duration-300 shadow-xl"
                >
                  Start Free Now
                </button>
                <button className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold border border-white/30 hover:bg-white/30 transition-all duration-300 backdrop-blur-md">
                  Learn More
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 animate-float">
              <Sparkles className="w-8 h-8 text-white/20" />
            </div>
            <div className="absolute bottom-10 right-10 animate-float" style={{ animationDelay: '0.7s' }}>
              <Film className="w-12 h-12 text-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-txt-muted">ReelSense © 2026</span>
            </div>
            <div className="flex items-center gap-8">
              {['Privacy', 'Terms', 'Contact', 'API'].map(link => (
                <button key={link} onClick={() => {}} className="text-xs font-bold uppercase tracking-widest text-txt-muted hover:text-white transition-colors bg-none border-none p-0 cursor-pointer">
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
