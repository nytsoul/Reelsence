// Production utility functions
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Console utilities for production
export const devLog = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const devWarn = (...args) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export const devError = (...args) => {
  if (isDevelopment) {
    console.error(...args);
  }
};

// Clear console warnings in production
export const clearProductionWarnings = () => {
  if (isProduction) {
    // Disable console in production
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    
    // Keep essential error logging
    const originalError = console.error;
    console.error = (...args) => {
      // Only log critical errors in production
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Error:')) {
        originalError(...args);
      }
    };
  }
};

// Performance utilities
export const measurePerformance = (name, fn) => {
  if (isDevelopment && window.performance) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
  return fn();
};

// Safe scroll utility
export const safeScrollIntoView = (elementId, options = { behavior: 'smooth', block: 'start' }) => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView(options);
      return true;
    } else {
      devWarn(`Element with ID '${elementId}' not found for scrolling`);
      return false;
    }
  } catch (error) {
    devError('Error scrolling to element:', error);
    return false;
  }
};

// Animation delay utility
export const getAnimationDelay = (index, baseDelay = 100) => ({
  animationDelay: `${index * baseDelay}ms`
});

// Format numbers for display
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Debounce function for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};