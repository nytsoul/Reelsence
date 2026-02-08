#!/usr/bin/env python3
"""
Test poster functionality directly
"""
import os
import sys
import pandas as pd
import json

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from config import get_processed_file_path

def test_poster_functionality():
    """Test poster cache loading and lookup"""
    print("🧪 Testing Poster Functionality")
    print("=" * 40)
    
    # Load poster cache
    cache_path = get_processed_file_path('poster_cache.json')
    print(f"Cache path: {cache_path}")
    
    if not os.path.exists(cache_path):
        print("❌ Poster cache file not found!")
        return False
        
    with open(cache_path, 'r') as f:
        poster_cache = json.load(f)
    
    print(f"✅ Loaded {len(poster_cache)} poster entries")
    
    # Load movies data
    movies_path = get_processed_file_path('movies_cleaned.csv')
    movies_df = pd.read_csv(movies_path)
    
    # Test a few movies
    test_movies = [
        {'title': 'Adaptation (2002)', 'movieId': 5902, 'expected_tmdb': 2757},
        {'title': 'Forrest Gump (1994)', 'movieId': 356, 'expected_tmdb': 13},
        {'title': 'Shawshank Redemption', 'movieId': 318, 'expected_tmdb': 278}
    ]
    
    def get_poster_path_fixed(tmdb_id):
        """Fixed poster path function"""
        if tmdb_id is None or pd.isna(tmdb_id):
            return None
        try:
            tmdb_id_str = str(int(float(tmdb_id)))
            return poster_cache.get(tmdb_id_str)
        except (ValueError, TypeError):
            return None
    
    print("\n🎬 Testing movie poster lookups:")
    for test_movie in test_movies:
        movie_row = movies_df[movies_df['movieId'] == test_movie['movieId']]
        
        if movie_row.empty:
            print(f"❌ {test_movie['title']} not found in dataset")
            continue
            
        row = movie_row.iloc[0]
        tmdb_id = row.get('tmdbId')
        poster_path = get_poster_path_fixed(tmdb_id)
        
        print(f"🎭 {test_movie['title']}")
        print(f"   TMDB ID: {tmdb_id} (expected: {test_movie['expected_tmdb']})")
        print(f"   Poster: {poster_path}")
        
        if poster_path:
            print(f"   ✅ Full URL: https://image.tmdb.org/t/p/w500{poster_path}")
        else:
            print(f"   ❌ No poster found")
        print()
    
    print("🔧 Testing poster cache keys:")
    sample_keys = list(poster_cache.keys())[:10]
    print(f"Sample cache keys: {sample_keys}")
    
    return True

if __name__ == "__main__":
    test_poster_functionality()