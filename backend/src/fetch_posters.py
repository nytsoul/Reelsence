#!/usr/bin/env python3
"""
Fetch TMDB poster paths for all movies and cache them.
Uses TMDB API to get poster_path for each movie.
"""
import os
import json
import time
import requests
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# TMDB API configuration
# Get a free API key from: https://www.themoviedb.org/settings/api
TMDB_API_KEY = os.environ.get('TMDB_API_KEY', '')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# Cache file path
CACHE_DIR = Path(__file__).parent.parent / 'data' / 'processed'
POSTER_CACHE_FILE = CACHE_DIR / 'poster_cache.json'

# Create a session for connection pooling
session = requests.Session()
session.headers.update({
    'User-Agent': 'ReelSense++ Movie Recommender/2.0',
    'Accept': 'application/json'
})


def load_poster_cache():
    """Load existing poster cache."""
    if POSTER_CACHE_FILE.exists():
        with open(POSTER_CACHE_FILE, 'r') as f:
            return json.load(f)
    return {}


def save_poster_cache(cache):
    """Save poster cache to file."""
    with open(POSTER_CACHE_FILE, 'w') as f:
        json.dump(cache, f, indent=2)


def fetch_poster_from_tmdb(tmdb_id, retries=3, backoff=1.0):
    """Fetch poster path from TMDB API with retry logic."""
    if not TMDB_API_KEY:
        return None
    
    for attempt in range(retries):
        try:
            url = f"{TMDB_BASE_URL}/movie/{tmdb_id}"
            params = {'api_key': TMDB_API_KEY}
            
            # Use session for connection pooling
            response = session.get(url, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('poster_path')
            elif response.status_code == 404:
                return None
            elif response.status_code == 429:
                # Rate limited - wait longer
                wait_time = backoff * (2 ** attempt)
                print(f"  Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            else:
                print(f"  Warning: TMDB API returned {response.status_code} for tmdb_id={tmdb_id}")
                return None
                
        except (requests.exceptions.ConnectionError, 
                requests.exceptions.Timeout,
                ConnectionResetError) as e:
            if attempt < retries - 1:
                wait_time = backoff * (2 ** attempt)
                print(f"  Connection error for tmdb_id={tmdb_id}, retrying in {wait_time}s... (attempt {attempt + 1}/{retries})")
                time.sleep(wait_time)
            else:
                print(f"  Failed to fetch tmdb_id={tmdb_id} after {retries} attempts")
                return None
        except Exception as e:
            print(f"  Unexpected error for tmdb_id={tmdb_id}: {e}")
            return None
    
    return None


def fetch_all_posters(movies_df, batch_size=50, delay=0.5):
    """
    Fetch poster paths for all movies with TMDB IDs.
    Respects rate limits with delay between requests.
    Args:
        batch_size: Save cache every N requests
        delay: Seconds to wait between requests (increased to avoid connection resets)
    """
    cache = load_poster_cache()
    
    # Filter movies with TMDB IDs
    movies_with_tmdb = movies_df[movies_df['tmdbId'].notna()].copy()
    print(f"📽️  Found {len(movies_with_tmdb)} movies with TMDB IDs")
    
    # Count how many are already cached
    cached_count = sum(1 for tmdb_id in movies_with_tmdb['tmdbId'] 
                       if str(int(tmdb_id)) in cache)
    print(f"✅ Already cached: {cached_count}")
    
    to_fetch = len(movies_with_tmdb) - cached_count
    if to_fetch == 0:
        print("All posters are cached!")
        return cache
    
    print(f"🔄 Fetching {to_fetch} posters from TMDB...")
    print(f"⏱️  Using {delay}s delay between requests to avoid connection issues")
    
    fetched = 0
    errors = 0
    
    for idx, row in movies_with_tmdb.iterrows():
        tmdb_id = int(row['tmdbId'])
        tmdb_id_str = str(tmdb_id)
        
        # Skip if already cached
        if tmdb_id_str in cache:
            continue
        
        # Fetch from TMDB with retry logic
        poster_path = fetch_poster_from_tmdb(tmdb_id)
        
        if poster_path:
            cache[tmdb_id_str] = poster_path
            fetched += 1
        else:
            cache[tmdb_id_str] = None  # Cache failures too
            errors += 1
        
        # Progress and save more frequently
        if (fetched + errors) % batch_size == 0:
            print(f"  Progress: {fetched + errors}/{to_fetch} (fetched: {fetched}, errors: {errors})")
            save_poster_cache(cache)  # Save every batch
            print(f"  💾 Cache saved (total: {len(cache)} entries)")
        
        # Rate limiting - wait between requests
        time.sleep(delay)
    
    # Final save
    save_poster_cache(cache)
    print(f"\n✅ Done! Fetched {fetched} posters, {errors} errors")
    print(f"📁 Cache saved to: {POSTER_CACHE_FILE}")
    print(f"📊 Total cached entries: {len(cache)}")
    
    return cache


def get_poster_path(tmdb_id, cache=None):
    """Get poster path for a movie from cache."""
    if cache is None:
        cache = load_poster_cache()
    
    if tmdb_id is None:
        return None
    
    return cache.get(str(int(tmdb_id)))


if __name__ == '__main__':
    print("🎬 TMDB Poster Fetcher")
    print("=" * 50)
    
    if not TMDB_API_KEY:
        print("\n⚠️  TMDB_API_KEY not set!")
        print("To fetch real posters:")
        print("1. Get a free API key from https://www.themoviedb.org/settings/api")
        print("2. Set in .env file: TMDB_API_KEY=your_api_key")
        print("\nFor now, using cached posters only.")
    
    # Load movies data
    movies_path = CACHE_DIR / 'movies_cleaned.csv'
    if not movies_path.exists():
        print(f"❌ Movies file not found: {movies_path}")
        exit(1)
    
    movies_df = pd.read_csv(movies_path)
    print(f"\n📊 Loaded {len(movies_df)} movies")
    
    # Fetch posters
    if TMDB_API_KEY:
        try:
            fetch_all_posters(movies_df)
        except KeyboardInterrupt:
            print("\n\n⏸️  Interrupted by user. Progress has been saved.")
            cache = load_poster_cache()
            print(f"📦 Current cache has {len(cache)} entries")
        finally:
            session.close()
    else:
        cache = load_poster_cache()
        print(f"📦 Current cache has {len(cache)} entries")
