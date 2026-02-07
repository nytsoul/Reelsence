"""
Dynamic User Modeling with Context Awareness
Implements temporal, device, and mood-based personalization.
"""
import pandas as pd
import numpy as np
from datetime import datetime

class DynamicUserProfiler:
    """
    Multi-dimensional user profile that adapts to context.
    """
    def __init__(self, train_ratings, movies):
        self.train_ratings = train_ratings
        self.movies = movies
        self.user_profiles = {}
        
    def build_user_profile(self, user_id):
        """
        Create a comprehensive user profile with:
        - Genre affinity
        - Temporal patterns
        - Discovery quotient
        """
        user_data = self.train_ratings[self.train_ratings['userId'] == user_id]
        
        if len(user_data) == 0:
            return None
        
        # Genre affinity
        user_movies = user_data.merge(self.movies, on='movieId')
        genre_scores = {}
        
        for _, row in user_movies.iterrows():
            genres = eval(row['genres']) if isinstance(row['genres'], str) else row['genres']
            for genre in genres:
                if genre not in genre_scores:
                    genre_scores[genre] = []
                genre_scores[genre].append(row['rating'])
        
        genre_affinity = {g: np.mean(scores) for g, scores in genre_scores.items()}
        
        # Discovery quotient: variance in genres rated
        discovery_quotient = len(genre_scores) / 20.0  # Normalized by typical genre count
        
        profile = {
            'user_id': user_id,
            'genre_affinity': genre_affinity,
            'discovery_quotient': min(discovery_quotient, 1.0),
            'avg_rating': user_data['rating'].mean(),
            'rating_count': len(user_data)
        }
        
        self.user_profiles[user_id] = profile
        return profile
    
    def get_profile(self, user_id):
        """Get or create user profile."""
        if user_id not in self.user_profiles:
            return self.build_user_profile(user_id)
        return self.user_profiles[user_id]


class ContextEngine:
    """
    Context-aware recommendation adjustments.
    """
    def __init__(self):
        self.temporal_weights = {
            'weekday_morning': {'light': 1.2, 'heavy': 0.8},
            'weekday_evening': {'light': 1.0, 'heavy': 1.0},
            'weekend': {'epic': 1.3, 'light': 0.9}
        }
        
    def get_temporal_context(self, timestamp=None):
        """
        Determine temporal context from timestamp.
        Returns: 'weekday_morning', 'weekday_evening', or 'weekend'
        """
        if timestamp is None:
            timestamp = datetime.now()
        elif isinstance(timestamp, str):
            timestamp = pd.to_datetime(timestamp)
        
        is_weekend = timestamp.weekday() >= 5
        hour = timestamp.hour
        
        if is_weekend:
            return 'weekend'
        elif hour < 12:
            return 'weekday_morning'
        else:
            return 'weekday_evening'
    
    def get_device_context(self, device='desktop'):
        """
        Device-based preferences.
        - mobile: shorter films, higher engagement
        - tv: epic films, cinematic experiences
        - desktop: niche, foreign cinema
        """
        device_prefs = {
            'mobile': {'runtime_preference': 'short', 'engagement_boost': 1.1},
            'tv': {'runtime_preference': 'long', 'cinematic_boost': 1.2},
            'desktop': {'niche_boost': 1.15}
        }
        return device_prefs.get(device, {})
    
    def adjust_score_by_context(self, base_score, movie_metadata, context_type='weekday_evening', device='desktop'):
        """
        Adjust recommendation score based on context.
        """
        adjusted_score = base_score
        
        # Temporal adjustment (simplified)
        if context_type == 'weekend':
            # Boost epic/long films on weekends
            if 'Action' in movie_metadata.get('genres', []) or 'Adventure' in movie_metadata.get('genres', []):
                adjusted_score *= 1.1
        elif context_type == 'weekday_evening':
            # Boost lighter content on weekday evenings
            if 'Comedy' in movie_metadata.get('genres', []) or 'Romance' in movie_metadata.get('genres', []):
                adjusted_score *= 1.05
        
        # Device adjustment
        device_ctx = self.get_device_context(device)
        if 'niche_boost' in device_ctx:
            # Desktop users prefer niche content
            adjusted_score *= device_ctx['niche_boost']
        
        return adjusted_score


if __name__ == "__main__":
    # Test user profiling
    train = pd.read_csv('data/processed/train_ratings.csv')
    movies = pd.read_csv('data/processed/movies_cleaned.csv')
    
    profiler = DynamicUserProfiler(train, movies)
    profile = profiler.build_user_profile(1)
    
    print("User Profile for User 1:")
    print(f"  Genre Affinity: {profile['genre_affinity']}")
    print(f"  Discovery Quotient: {profile['discovery_quotient']:.2f}")
    print(f"  Avg Rating: {profile['avg_rating']:.2f}")
    
    # Test context engine
    context = ContextEngine()
    temporal_ctx = context.get_temporal_context()
    print(f"\nCurrent Temporal Context: {temporal_ctx}")
