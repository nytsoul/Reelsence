#!/usr/bin/env python3
"""Test script to debug poster cache loading."""

import os
import json
from config import get_processed_file_path

def test_poster_cache_loading():
    """Test different poster cache loading paths."""
    print("Testing poster cache loading...")
    
    # Test config path
    config_path = get_processed_file_path('poster_cache.json')
    print(f"Config path: {config_path}")
    print(f"Config path exists: {os.path.exists(config_path)}")
    
    # Test local path
    local_path = os.path.join('data', 'processed', 'poster_cache.json')
    print(f"Local path: {local_path}")
    print(f"Local path exists: {os.path.exists(local_path)}")
    
    # Test current directory paths
    print(f"Current working directory: {os.getcwd()}")
    
    # Try to load from whichever exists
    cache = {}
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} entries from config path")
        print(f"Sample entries: {list(cache.items())[:3]}")
    elif os.path.exists(local_path):
        with open(local_path, 'r') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} entries from local path")
        print(f"Sample entries: {list(cache.items())[:3]}")
    else:
        print("No poster cache found!")
    
    # Test movie data loading
    movies_path = get_processed_file_path('movies_cleaned.csv')
    print(f"\nMovies path: {movies_path}")
    print(f"Movies path exists: {os.path.exists(movies_path)}")
    
    if os.path.exists(movies_path):
        import pandas as pd
        movies = pd.read_csv(movies_path)
        toy_story = movies[movies['movieId'] == 1].iloc[0]
        print(f"Toy Story TMDB ID: {toy_story['tmdbId']} (type: {type(toy_story['tmdbId'])})")
        
        # Test get_poster_path logic
        tmdb_id = toy_story['tmdbId']
        if tmdb_id is not None and not pd.isna(tmdb_id):
            tmdb_id_str = str(int(float(tmdb_id)))
            poster_path = cache.get(tmdb_id_str)
            print(f"Poster lookup for '{tmdb_id_str}': {poster_path}")
        else:
            print("Toy Story has no TMDB ID")

if __name__ == '__main__':
    test_poster_cache_loading()