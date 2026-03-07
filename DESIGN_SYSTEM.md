# ReelSense UI Design System - Quick Reference

## 🎨 Colors

### Primary Palette
```
Indigo:    #6366f1  (--accent-primary)
Pink:      #ec4899  (--accent-secondary)
Green:     #10b981  (--accent-success)
Amber:     #f59e0b  (--accent-warning)
Red:       #ef4444  (--accent-danger)
```

### Background Palette
```
Deep:      #0f0f1e  (--bg-deep)
Primary:   #1a1a2e  (--bg-primary)
Surface:   #252540  (--bg-surface)
Card:      #1e1e3a  (--bg-card)
Elevated:  #3a3a5c  (--bg-elevated)
```

### Text Palette
```
Primary:   #f1f5f9  (--text-primary)
Secondary: #cbd5e1  (--text-secondary)
Muted:     #94a3b8  (--text-muted)
Dim:       #64748b  (--text-dim)
```

## 🔤 Typography

### Fonts
- **Headings**: Roboto (weights: 700, 900)
- **Body**: Roboto (weights: 400, 500)
- **Mono**: Roboto Mono (for code)

### Font Sizes
```
xs:  0.75rem   (12px)
sm:  0.875rem  (14px)
base: 1rem     (16px)
lg:  1.125rem  (18px)
xl:  1.25rem   (20px)
2xl: 1.5rem    (24px)
3xl: 1.875rem  (30px)
4xl: 2.25rem   (36px)
5xl: 3rem      (48px)
6xl: 3.75rem   (60px)
```

## 🎯 Button Classes

### Primary Button
```jsx
<button className="btn-primary">
  Action Text
</button>
```
**Usage**: Main CTAs, important actions

### Secondary Button
```jsx
<button className="btn-secondary">
  Secondary Action
</button>
```
**Usage**: Alternative actions, secondary CTAs

### Outlined Button
```jsx
<button className="btn-outlined">
  Outlined Action
</button>
```
**Usage**: Tertiary actions, links

## 🎨 Card Styles

### Glass Effect Card
```jsx
<div className="glass-effect p-8 rounded-2xl">
  Content
</div>
```

### Premium Card
```jsx
<div className="card-premium">
  Content
</div>
```

## ✨ Animations

### Available Animations
```
animate-fade-in          - Fade in effect
animate-fade-in-up       - Fade and slide up
animate-slide-up         - Slide up only
animate-slide-in-right   - Slide from right
animate-pulse-slow       - Slow pulsing
animate-float            - Floating motion
animate-shimmer          - Shimmer effect
animate-spin-slow        - Slow rotation
```

## 🎭 Badges

### Badge Primary
```jsx
<div className="badge-primary">
  Primary Badge
</div>
```

### Badge Secondary
```jsx
<div className="badge-secondary">
  Secondary Badge
</div>
```

### Badge Success
```jsx
<div className="badge-success">
  Success Badge
</div>
```

## 🌟 Text Effects

### Gradient Text
```jsx
<h1 className="gradient-text">
  Gradient Heading
</h1>
```

### Gradient Text Alt
```jsx
<h2 className="gradient-text-alt">
  Alt Gradient
</h2>
```

## 🎯 Interactive States

### Hover Lift
```jsx
<div className="hover-lift">
  Lifts on hover
</div>
```

### Hover Glow
```jsx
<div className="hover-glow">
  Glows on hover
</div>
```

## 📱 Responsive Breakpoints

```
sm:  640px   (mobile)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
2xl: 1536px  (extra large)
```

### Usage
```jsx
{/* Hidden on mobile, visible on md and up */}
<div className="hidden md:block">
  Desktop content
</div>

{/* Grid that adapts */}
<div className="grid md:grid-cols-2 lg:grid-cols-3">
  Items
</div>
```

## 🔦 Shadows

### Shadow Variants
```
shadow-card        - Standard card shadow
shadow-card-hover  - Hover card shadow
shadow-glow        - Indigo glow
shadow-glow-pink   - Pink glow
shadow-glow-green  - Green glow
shadow-glow-orange - Orange glow
```

## 🎪 Layout Utilities

### Centering
```jsx
{/* Flexbox center */}
<div className="flex items-center justify-center">
  Centered content
</div>

{/* Grid center */}
<div className="grid place-items-center">
  Centered content
</div>
```

### Spacing
```
p-4   = 1rem padding
m-4   = 1rem margin
gap-4 = 1rem gap
```

## 💫 Glass Morphism

### Glass Effect Small
```jsx
<div className="glass-effect-sm p-4 rounded-lg">
  Content
</div>
```

### Glass Effect Large
```jsx
<div className="glass-effect p-8 rounded-2xl">
  Content
</div>
```

## 🎬 Loading States

### Loading Spinner
```jsx
import LoadingSpinner from '@/components/LoadingSpinner';

<LoadingSpinner text="Loading..." size="medium" />
```

### Full Page Loader
```jsx
import { FullPageLoader } from '@/components/LoadingSpinner';

<FullPageLoader text="Loading..." />
```

### Button Loader
```jsx
import { ButtonLoader } from '@/components/LoadingSpinner';

<ButtonLoader isLoading={loading}>
  Load More
</ButtonLoader>
```

## 🎁 Favorite Features

### Add to Favorites
```jsx
import { favoritesManager } from '@/utils/favorites';

favoritesManager.addFavorite(movie);
```

### Get Favorites
```jsx
const favorites = favoritesManager.getFavorites();
```

### Check if Favorited
```jsx
const isFav = favoritesManager.isFavorited(movieId);
```

## 📋 Common Patterns

### Hero Section
```jsx
<section className="relative min-h-screen flex items-center overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

### Feature Grid
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map(feature => (
    <div key={feature.id} className="glass-effect p-8 rounded-2xl">
      {/* Feature content */}
    </div>
  ))}
</div>
```

### Form Input
```jsx
<input
  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
  placeholder="Search..."
/>
```

## 🚀 Performance Tips

1. Use `animate-fade-in-up` with stagger delays for list items
2. Apply lazy loading to images in MovieCard
3. Use CSS custom properties for consistent theming
4. Leverage Tailwind's size utilities for responsive designs
5. Use `@apply` for custom utility classes if needed

## 📚 Resources

- Roboto Font: https://fonts.google.com/specimen/Roboto
- Tailwind Docs: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

**Version**: 1.0  
**Last Updated**: March 7, 2026  
**Status**: ✅ Active & Ready to Use
