import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, BarChart3, Home, Sparkles } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-bg-card border-b border-bg-hover sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-xl font-heading font-bold hover:text-accent-red transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Film className="w-6 h-6 text-accent-red" />
                <Sparkles className="w-3 h-3 text-accent-gold absolute -top-1 -right-1" />
              </div>
              <span className="gradient-text">ReelSense++</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
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
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
