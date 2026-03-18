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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-3'
      } bg-bg-primary/90 backdrop-blur-xl border-b border-white/5`}
    >
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between h-12 md:h-14 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105 flex-shrink-0"
          >
            <div className="relative">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
                <Film className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-lg font-black text-white uppercase tracking-tight leading-none">
                ReelSense
              </span>
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.18em] font-semibold text-txt-muted hidden sm:inline">
                Prime Picks
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-sm mx-6">
            <MovieSearchBar />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 group ${
                  isActive(path)
                    ? 'text-white bg-cyan-500/15 border border-cyan-400/30'
                    : 'text-txt-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive(path) 
                    ? 'text-cyan-300' 
                    : 'text-txt-muted group-hover:text-cyan-300'
                } transition-colors duration-300`} />
                <span className="hidden lg:inline">{label}</span>
                {isActive(path) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 md:p-2 rounded-lg bg-white/5 text-txt-secondary hover:text-white hover:bg-white/10 transition-all md:hidden"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 text-txt-secondary hover:text-white hover:bg-white/10 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
                    ? 'text-white bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border border-cyan-400/30'
                    : 'text-txt-secondary hover:text-white hover:bg-white/5'
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
