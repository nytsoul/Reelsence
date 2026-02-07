import React from 'react';
import { Film, Heart, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-bg-card border-t border-bg-hover mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-accent-red" />
              <span className="font-heading font-bold text-lg gradient-text">ReelSense++</span>
            </div>
            <p className="text-txt-secondary text-sm leading-relaxed">
              An explainable and diversity-aware movie recommendation system built for the BrainDead2K26 competition. 
              Powered by hybrid AI combining collaborative filtering and content-based approaches.
            </p>
            <div className="flex items-center gap-2 text-xs text-txt-muted">
              <Heart className="w-3 h-3 text-accent-red" />
              <span>Built with passion for better recommendations</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-txt-primary">Key Features</h3>
            <ul className="space-y-2 text-sm text-txt-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-red rounded-full"></span>
                Hybrid AI Recommendations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-gold rounded-full"></span>
                Multi-Level Explanations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-green rounded-full"></span>
                Diversity Optimization
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-blue rounded-full"></span>
                Analytics Dashboard
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-txt-primary">Technology</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Python', 'Flask', 'TailwindCSS', 'MovieLens', 'SVD', 'TF-IDF'].map((tech) => (
                <span 
                  key={tech} 
                  className="px-2 py-1 bg-bg-hover text-txt-secondary text-xs rounded-lg border border-bg-elevated"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-bg-hover flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-txt-muted text-sm">
            © 2024 ReelSense++ | Built as part of BrainDead2K26
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-txt-muted">Powered by MovieLens Dataset</span>
            <div className="flex gap-2">
              <button className="text-txt-muted hover:text-txt-primary transition-colors">
                <Github className="w-4 h-4" />
              </button>
              <button className="text-txt-muted hover:text-txt-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
