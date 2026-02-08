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
      <Loader2 
        className={`${sizeClasses[size]} animate-spin text-red-500`} 
      />
      <span className="text-gray-300 font-medium">{text}</span>
    </div>
  );
};

const FullPageLoader = ({ text = 'Loading ReelSense++...' }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 animate-fade-in-up">
        {/* Logo Animation */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <Film className="w-16 h-16 text-red-500 animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-red-500/30 rounded-full animate-spin" 
                 style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            {text}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse" 
               style={{
                 animation: 'progress 2s ease-in-out infinite'
               }} />
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
      className={`${className} ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

const ContentLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-800 rounded w-full shimmer" />
          <div className={`h-4 bg-gray-800 rounded ${i === lines - 1 ? 'w-2/3' : 'w-5/6'} shimmer`} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
export { FullPageLoader, ButtonLoader, ContentLoader };