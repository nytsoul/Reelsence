# ReelSense++ Backend

Flask REST API server for the ReelSense++ movie recommendation system, powered by hybrid ML models trained on MovieLens data.

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── src/                  # Source code
│   ├── models/           # ML models (SVD, Content-Based, Hybrid)
│   ├── preprocessing/    # Data preprocessing pipeline
│   ├── evaluation/       # Model evaluation metrics
│   └── reelsense_v2.py  # Core recommendation engine
└── data/                 # Dataset storage
    ├── raw/              # Original MovieLens data
    └── processed/        # Preprocessed and split data
```

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the Server**
   ```bash
   python app.py
   ```
   Server starts on `http://localhost:5000`

## API Endpoints

### Core Endpoints
- `GET /health` - Health check with model status
- `GET /api/recommendations/<user_id>` - Get personalized recommendations
- `GET /api/movies/<movie_id>` - Get movie details
- `GET /api/movies/<movie_id>/similar` - Get similar movies
- `GET /api/explanations/<user_id>/<movie_id>` - Get recommendation explanations

### Analytics & Search
- `GET /api/analytics` - Live model performance metrics
- `GET /api/stats` - System statistics
- `GET /api/movies/search?q=<query>` - Search movies
- `GET /api/movies/popular` - Popular movies
- `GET /api/movies/top-rated` - Top rated movies

### User Features  
- `GET /api/users/<user_id>` - User profile
- `GET /api/users/<user_id>/history` - Rating history
- `GET /api/genres` - All movie genres
- `POST /api/users/<user_id>/ratings` - Submit rating

## ML Models

- **SVD Collaborative Filtering**: 50 factors, 20 epochs, custom SGD implementation
- **Content-Based**: TF-IDF on genres + tags, cosine similarity
- **Hybrid Recommender**: Weighted combination (CF: 0.7, Content: 0.3)
- **Diversity Optimization**: MMR re-ranking for catalog coverage

## Dataset

- **MovieLens ml-latest-small**: 100,836 ratings, 9,742 movies, 610 users
- **Train/Test Split**: 80/20 time-based (80,419 / 20,417)
- **Performance**: RMSE 0.9036, MAE 0.6955

## Development

The backend is designed to work with the React frontend at `http://localhost:3000`. CORS is enabled for development.

For production deployment, consider using a WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```