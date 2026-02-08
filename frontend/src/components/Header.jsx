import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, BarChart3, Home, Sparkles, Search } from 'lucide-react';
import MovieSearchBar from './MovieSearchBar';

const Header = () => {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-bg-card border-b border-bg-hover sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-xl font-heading font-bold hover:text-accent-red transition-colors flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Film className="w-6 h-6 text-accent-red" />
                <Sparkles className="w-3 h-3 text-accent-gold absolute -top-1 -right-1" />
              </div>
              <span className="gradient-text">ReelSense++</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <MovieSearchBar />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2 md:space-x-4">
            {/* Search Toggle - Mobile */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-txt-secondary hover:text-txt-primary hover:bg-bg-hover transition-all"
            >
              <Search className="w-4 h-4" />
            </button>

            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'text-accent-red bg-accent-red bg-opacity-10 shadow-glow'
                    : 'text-txt-secondary hover:text-txt-primary hover:bg-bg-hover'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <MovieSearchBar />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
