import React from 'react';
import { Film, Heart, Github, Mail, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { label: 'Features' },
      { label: 'Pricing' },
      { label: 'API' },
      { label: 'Changelog' },
    ],
    company: [
      { label: 'About' },
      { label: 'Blog' },
      { label: 'Careers' },
      { label: 'Contact' },
    ],
    legal: [
      { label: 'Privacy' },
      { label: 'Terms' },
      { label: 'Security' },
      { label: 'Cookies' },
    ],
  };

  const technologies = [
    'React',
    'Python',
    'Flask',
    'TailwindCSS',
    'MovieLens',
    'SVD++',
    'BERT',
    'Scikit-learn',
  ];

  return (
    <footer className="relative bg-gradient-to-b from-bg-primary to-bg-deep border-t border-white/10">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* Newsletter Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-16 border-b border-white/5">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Stay Updated</h3>
            <p className="text-slate-400">Get the latest updates on new features and movie recommendations.</p>
          </div>
          <form className="flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-500/50 transition-all"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg">ReelSense</div>
                <div className="text-xs text-slate-500 font-semibold">AI Movies</div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Advanced AI-powered movie recommendations using hybrid algorithms for perfect matches tailored to your taste.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span>Loved by {Math.floor(Math.random() * 100 + 50)}K+ movie enthusiasts</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Product</h4>
            <ul className="space-y-3">
              {links.product.map(link => (
                <li key={link.label}>
                  <button onClick={() => {}} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm text-left bg-none border-none p-0 cursor-pointer">
                    <span>{link.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Company</h4>
            <ul className="space-y-3">
              {links.company.map(link => (
                <li key={link.label}>
                  <button onClick={() => {}} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm text-left bg-none border-none p-0 cursor-pointer">
                    <span>{link.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map(link => (
                <li key={link.label}>
                  <button onClick={() => {}} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm text-left bg-none border-none p-0 cursor-pointer">
                    <span>{link.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Tech */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Connect</h4>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all" title="GitHub" onClick={() => {}}>
                  <Github className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all" title="Email" onClick={() => {}}>
                  <Mail className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all" title="External" onClick={() => {}}>
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm">Status</h4>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-300">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="py-12 border-y border-white/5 space-y-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Built with Modern Tech
            </h4>
            <p className="text-slate-400 text-sm">Powered by cutting-edge technologies for the best performance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {technologies.map(tech => (
              <div
                key={tech}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} ReelSense. All rights reserved. | Built for BrainDead2K26
          </p>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <button onClick={() => {}} className="hover:text-white transition-colors bg-none border-none p-0 cursor-pointer text-left">Status</button>
            <span className="text-white/20">•</span>
            <button onClick={() => {}} className="hover:text-white transition-colors bg-none border-none p-0 cursor-pointer text-left">Feedback</button>
            <span className="text-white/20">•</span>
            <button onClick={() => {}} className="hover:text-white transition-colors bg-none border-none p-0 cursor-pointer text-left">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
