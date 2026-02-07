# ReelSense++ v2.0 - Frontend Setup Guide

A cyberpunk-themed React frontend for the ReelSense++ movie recommendation system.

## Features

- **Cyberpunk UI Design**: Neon colors, Fira Code font, glowing effects
- **Responsive Layout**: Mobile, tablet, and desktop support
- **Movie Recommendations**: Browse personalized movie recommendations
- **Favorites & Watchlist**: Save movies for later
- **Smart Preferences**: Control accuracy/discovery balance and exclusions
- **Explainable AI**: Multi-level explanations for recommendations
- **Real-time Updates**: Live context switching (weekday/weekend, device type)

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Lucide Icons
- Axios for API calls
- Framer Motion for animations

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── MovieCard.jsx
│   │   ├── RecommendationFeed.jsx
│   │   ├── PreferencesPanel.jsx
│   │   ├── ExplanationCard.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── DiscoverPage.jsx
│   │   ├── FavoritesPage.jsx
│   │   ├── WatchlistPage.jsx
│   │   └── PreferencesPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Pages & Components

### Pages

1. **DiscoverPage** (`/`)
   - Main recommendation feed
   - Context switching (weekday/weekend, device type)
   - Genre filtering
   - Preference controls
   - Movie detail modal

2. **FavoritesPage** (`/favorites`)
   - Display favorite movies
   - Remove from favorites
   - Quick actions

3. **WatchlistPage** (`/watchlist`)
   - Queued movies for later
   - View order and dates added
   - Quick "Watch Now" button

4. **PreferencesPage** (`/preferences`)
   - Profile settings
   - Recommendation controls
   - Privacy settings
   - Display theme selection
   - Account security

### Components

- **Header**: Navigation bar with mobile menu
- **MovieCard**: Individual movie card with ratings and explanations
- **RecommendationFeed**: Grid layout with filtering
- **PreferencesPanel**: Sliders for accuracy/discovery balance
- **ExplanationCard**: Multi-level explanation display
- **Footer**: Site footer with links

## Cyberpunk Theme

### Colors

- **Dark Background**: `#050812` (darker), `#0a0e27` (dark), `#0f1419` (bg)
- **Card Background**: `#1a1f3a`
- **Border/Cyan**: `#00ffff`
- **Accent/Magenta**: `#ff00ff`
- **Accent/Green**: `#00ff00`
- **Text**: `#e0e0ff` (light), `#a0a0c0` (dim)

### Typography

All text uses **Fira Code** monospace font imported from Google Fonts.

### Effects

- Neon glow animations
- Scan line overlays
- Grid background patterns
- Gradient text animations
- Glowing borders on hover

## API Integration

The frontend communicates with the backend via the `services/api.js` module:

### Recommendation API
- `getRecommendations(userId, params)` - Fetch personalized recommendations
- `getMovieDetails(movieId)` - Get full movie information
- `getExplanation(userId, movieId)` - Get recommendation explanation
- `searchMovies(query)` - Search movie database
- `getSimilarMovies(movieId)` - Get similar content

### User API
- `getProfile(userId)` - User profile data
- `updatePreferences(userId, preferences)` - Save user preferences
- `rateMovie(userId, movieId, rating)` - Submit movie rating
- `getWatchHistory(userId)` - User's watch history
- `markAsWatched(userId, movieId)` - Mark movie as watched

### Auth API
- `login(email, password)` - User login
- `register(email, password, name)` - Create new account
- `logout()` - Clear session

## Backend API Requirements

For the frontend to work, the backend needs to provide these endpoints:

```
GET  /api/recommendations/{userId}
GET  /api/movies/{movieId}
GET  /api/explanations/{userId}/{movieId}
GET  /api/movies/search?q={query}
GET  /api/movies/{movieId}/similar
GET  /api/users/{userId}
PUT  /api/users/{userId}/preferences
POST /api/users/{userId}/ratings
GET  /api/users/{userId}/watch-history
POST /api/users/{userId}/watched
POST /api/auth/login
POST /api/auth/register
```

## Customization

### Modify Colors
Edit `tailwind.config.js` to change the cyberpunk color scheme.

### Change Font
Update `index.html` and `tailwind.config.js` to use a different font.

### Add Components
Create new `.jsx` files in `src/components/` and import in parent components.

### Create New Pages
Add new route files in `src/pages/` and add routes in `App.js`.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Environment Variables

```env
REACT_APP_API_URL=http://your-backend-url/api
```

## Known Issues & TODOs

- [ ] Integrate with actual backend API
- [ ] Implement authentication flows
- [ ] Add user rating submissions
- [ ] Implement favorites/watchlist persistence
- [ ] Add search functionality
- [ ] Create user profile page
- [ ] Add movie comparison feature
- [ ] Implement sharing functionality

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Tips

1. Images are lazy-loaded where applicable
2. Use React DevTools for profiling
3. Minimize re-renders with proper key props
4. Consider code-splitting for large bundles

## Contributing

1. Follow the existing code structure
2. Use Fira Code font for consistency
3. Maintain the cyberpunk theme aesthetic
4. Test responsive design on multiple devices
5. Commit messages should be descriptive

## License

Part of the ReelSense++ project.
