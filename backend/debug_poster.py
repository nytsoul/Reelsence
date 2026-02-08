import pandas as pd
from config import get_processed_file_path
import json

# Load movies data
movies = pd.read_csv(get_processed_file_path('movies_cleaned.csv'))

# Find Adaptation movie
adaptation = movies[movies['title'].str.contains('Adaptation', case=False, na=False)]
print("Adaptation movie details:")
for _, row in adaptation.iterrows():
    print(f"Title: {row['title']}, MovieId: {row['movieId']}, TmdbId: {row['tmdbId']}")

# Load poster cache
cache_path = get_processed_file_path('poster_cache.json')
with open(cache_path) as f:
    cache = json.load(f)

print(f"\nPoster cache has {len(cache)} entries")

# Check if Adaptation's TMDB ID is in cache
if not adaptation.empty:
    tmdb_id = adaptation.iloc[0]['tmdbId']
    if pd.notna(tmdb_id):
        tmdb_id_str = str(int(tmdb_id))
        poster_path = cache.get(tmdb_id_str)
        print(f"TMDB ID {tmdb_id_str} poster path: {poster_path}")
    else:
        print("Adaptation movie has no TMDB ID")