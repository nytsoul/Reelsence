import React from 'react';
import { Film, Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-pink-600/30 border-b-pink-600 rounded-full animate-spin opacity-50`} style={{ animationDirection: 'reverse' }} />
      </div>
      <span className="text-slate-300 font-medium">{text}</span>
    </div>
  );
};

const FullPageLoader = ({ text = 'Loading ReelSense...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-deep to-bg-primary flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Animations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative text-center space-y-8 animate-fade-in-up">
        {/* Logo Animation */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/50 animate-float">
              <Film className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -inset-6 border-2 border-indigo-600/20 rounded-3xl animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            {text}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/20">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 rounded-full"
            style={{
              animation: 'progress 2s ease-in-out infinite',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-8 opacity-60">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-indigo-400">10K+</div>
            <div className="text-xs text-slate-400">Movies</div>
          </div>
          <div className="space-y-1 border-l border-r border-white/10 px-8">
            <div className="text-2xl font-bold text-pink-400">98%</div>
            <div className="text-xs text-slate-400">Accuracy</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-orange-400">2.5K</div>
            <div className="text-xs text-slate-400">Users</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

const ButtonLoader = ({ isLoading, children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`${className} ${isLoading ? 'cursor-not-allowed opacity-75' : ''} transition-all duration-300`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

const ContentLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-4 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-white/10 to-transparent rounded w-full" />
          <div className={`h-3 bg-gradient-to-r from-white/5 to-transparent rounded ${i === lines - 1 ? 'w-2/3' : 'w-5/6'}`} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
export { FullPageLoader, ButtonLoader, ContentLoader };