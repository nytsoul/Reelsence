# ReelSense++ Development Guide

Quick reference for developers working on the ReelSense++ movie recommendation system.

## Development Workflow

### 1. Environment Setup (First Time Only)
```bash
# Clone the repository
git clone <repo-url>
cd ReelSense++

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Daily Development

**Start Backend (Terminal 1)**
```bash
cd backend
start.bat  # Windows
# OR manually:
python app.py
```

**Start Frontend (Terminal 2)**
```bash
cd frontend  
npm start
```

### 3. Key URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health
- Analytics: http://localhost:3000/analytics

## Useful Commands

### Backend
```bash
# Run with debug mode
python app.py --debug

# Check API status
curl http://localhost:5000/health

# Get sample recommendations
curl http://localhost:5000/api/recommendations/1
```

### Frontend
```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Project Architecture

### Backend Stack
- **Flask**: Web framework
- **Pandas/NumPy**: Data processing
- **Scikit-learn**: ML utilities (TF-IDF)
- **Custom SVD**: Matrix factorization

### Frontend Stack  
- **React 18**: UI framework
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Recharts**: Analytics charts
- **Lucide React**: Icons

## Key Files

### Backend
- `backend/app.py` - Main Flask application
- `backend/src/models/hybrid_model.py` - Core recommendation engine
- `backend/src/preprocessing/preprocess.py` - Data processing pipeline

### Frontend
- `frontend/src/App.js` - Main React app
- `frontend/src/pages/HomePage.jsx` - Landing page
- `frontend/src/components/MovieCard.jsx` - Movie display component

## Troubleshooting

### Port Conflicts
- Frontend default: 3000 (auto-detects conflicts)
- Backend default: 5000 (change manually in app.py)

### Model Not Loading  
- Check if `backend/data/processed/` contains required CSV files
- Ensure `backend/src/models/saved/` has trained models

### CORS Issues
- Frontend and backend must run on localhost
- Check CORS settings in `backend/app.py`