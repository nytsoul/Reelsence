# ReelSense++ Frontend Setup

To get started with the ReelSense++ frontend:

## Quick Start

```bash
cd frontend
npm install
npm start
```

The app will run at `http://localhost:3000`

## What's Included

✅ **Cyberpunk Theme UI**
- Neon cyan, magenta, and green colors
- Fira Code monospace font throughout
- Glowing border effects and scan line animations
- Dark theme optimized for extended viewing

✅ **Core Pages**
- **Discover**: Personalized movie recommendations with explanations
- **Favorites**: Saved favorite movies collection
- **Watchlist**: Movies queued for later viewing
- **Preferences**: User settings and recommendation controls

✅ **Smart Components**
- Responsive movie cards with ratings
- Multi-level explanation system
- Genre filtering
- Context-aware recommendations (time of day, device type)
- Preference sliders (accuracy vs discovery balance)

✅ **API Integration Ready**
- Service layer with Axios
- Authentication interceptors
- All ReelSense++ API endpoints configured

## Cyberpunk Theme Details

**Colors Used:**
- Primary Dark: `#050812`, `#0a0e27`
- Card: `#1a1f3a`
- Neon Cyan: `#00ffff`
- Neon Magenta: `#ff00ff`
- Neon Green: `#00ff00`

**Font:** Fira Code (all text)

**Effects:**
- Animated neon glows
- Scan line overlay
- Gradient animations
- Smooth hover transitions

## Key Features

1. **Responsive Design** - Works on mobile, tablet, desktop
2. **Explainable AI** - Simple, detailed, and advanced explanations
3. **Context Aware** - Recommendations based on time/device/mood
4. **Preference Control** - Sliders to adjust accuracy vs discovery
5. **Trust Metrics** - Confidence scores for recommendations

## Environment Setup

Create a `.env` file in the `frontend/` directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Update this URL to match your backend API location.

## Backend Integration

The frontend expects these API endpoints:

```
GET  /api/recommendations/{userId}
GET  /api/movies/{movieId}
GET  /api/explanations/{userId}/{movieId}
PUT  /api/users/{userId}/preferences
POST /api/users/{userId}/ratings
```

See `src/services/api.js` for all available endpoints.

## File Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Full-page components
│   ├── services/        # API communication
│   ├── App.js           # Main app component
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
├── public/
│   └── index.html       # HTML template
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
└── README.md           # Full documentation
```

## Building for Production

```bash
npm run build
```

Creates optimized production bundle in `build/` directory.

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Connect to your backend API
4. Implement authentication
5. Customize colors/fonts as needed
6. Deploy to production

---

**ReelSense++ v2.0** - The Human-Centric Movie Recommendation Ecosystem
