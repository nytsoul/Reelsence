import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, BarChart3, Home, Sparkles, Search, Menu, X } from 'lucide-react';
import MovieSearchBar from './MovieSearchBar';

const Header = () => {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/recommendations/1', label: 'Recommendations', icon: Sparkles },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname.startsWith(path.split('/').slice(0, 2).join('/'));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 py-3 md:py-4 ${
        isScrolled ? 'py-2 md:py-3' : 'py-4 md:py-6'
      }`}
      style={{
        background: isScrolled 
          ? 'rgba(26, 26, 46, 0.8)' 
          : 'rgba(26, 26, 46, 0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: isScrolled 
          ? '1px solid rgba(255, 255, 255, 0.08)' 
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105 flex-shrink-0"
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Film className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
              </div>
              <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black gradient-text uppercase tracking-tighter leading-none">
                ReelSense
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400">
                Smart Recommendations
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <MovieSearchBar />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                  isActive(path)
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive(path) 
                    ? 'text-indigo-400' 
                    : 'text-slate-400 group-hover:text-indigo-400'
                } transition-colors duration-300`} />
                <span className="hidden lg:inline">{label}</span>
                {isActive(path) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2.5 md:p-3 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all md:hidden"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="mt-4 pb-4 md:hidden animate-slide-down">
            <MovieSearchBar />
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 animate-slide-down">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive(path)
                    ? 'text-white bg-gradient-to-r from-indigo-600/30 to-pink-600/30 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
