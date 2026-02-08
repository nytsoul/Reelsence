import pandas as pd
from config import get_processed_file_path
import json

# Load movies data and find Adaptation
movies = pd.read_csv(get_processed_file_path('movies_cleaned.csv'))
adaptation = movies[movies['movieId'] == 5902].iloc[0]

print("Adaptation row data:")
print(f"tmdbId type: {type(adaptation['tmdbId'])}")
print(f"tmdbId value: {adaptation['tmdbId']}")
print(f"tmdbId repr: {repr(adaptation['tmdbId'])}")

# Load poster cache
cache_path = get_processed_file_path('poster_cache.json')
with open(cache_path) as f:
    cache = json.load(f)

print(f"\nPoster cache lookup tests:")
tmdb_raw = adaptation['tmdbId']
print(f"Raw lookup '{tmdb_raw}': {cache.get(str(tmdb_raw))}")
print(f"Int lookup '{int(tmdb_raw)}': {cache.get(str(int(tmdb_raw)))}")
print(f"String lookup '2757': {cache.get('2757')}")

# Test the actual get_poster_path logic
def test_get_poster_path(tmdb_id):
    if tmdb_id is None:
        return None
    return cache.get(str(int(tmdb_id)))

print(f"\nTest get_poster_path function:")
print(f"Result: {test_get_poster_path(adaptation['tmdbId'])}")