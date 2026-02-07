"""
ReelSense++ v2.0 - Data Preprocessing Pipeline
Loads, cleans, merges, encodes and splits the MovieLens dataset.
"""
import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import LabelEncoder


def load_data(data_path='data/raw/ml-latest-small'):
    """Load all four MovieLens CSV files."""
    ratings = pd.read_csv(os.path.join(data_path, 'ratings.csv'))
    movies = pd.read_csv(os.path.join(data_path, 'movies.csv'))
    tags = pd.read_csv(os.path.join(data_path, 'tags.csv'))
    links = pd.read_csv(os.path.join(data_path, 'links.csv'))
    print(f"  Ratings: {len(ratings):,} rows")
    print(f"  Movies:  {len(movies):,} rows")
    print(f"  Tags:    {len(tags):,} rows")
    print(f"  Links:   {len(links):,} rows")
    return ratings, movies, tags, links


def merge_data(ratings, movies):
    """Merge ratings with movies on movieId to create a unified dataset."""
    merged = ratings.merge(movies, on='movieId', how='left')
    print(f"  Merged dataset: {len(merged):,} rows")
    return merged


def clean_data(ratings, movies, tags, links):
    """Clean missing values, standardize types."""
    # --- Ratings ---
    ratings = ratings.dropna(subset=['userId', 'movieId', 'rating'])
    ratings['userId'] = ratings['userId'].astype(int)
    ratings['movieId'] = ratings['movieId'].astype(int)
    ratings['rating'] = ratings['rating'].astype(float)
    ratings['timestamp'] = pd.to_datetime(ratings['timestamp'], unit='s')

    # --- Movies ---
    movies = movies.dropna(subset=['movieId', 'title'])
    movies['movieId'] = movies['movieId'].astype(int)
    # Extract year from title e.g. "Toy Story (1995)"
    movies['year'] = movies['title'].str.extract(r'\((\d{4})\)').astype(float)
    # Keep genres as pipe-separated for storage, create list column for processing
    movies['genres_list'] = movies['genres'].apply(
        lambda x: x.split('|') if isinstance(x, str) and x != '(no genres listed)' else []
    )
    movies['genre_str'] = movies['genres_list'].apply(lambda g: ' '.join(g))

    # --- Tags ---
    tags = tags.dropna(subset=['userId', 'movieId', 'tag'])
    tags['tag'] = tags['tag'].str.lower().str.strip()
    tags['timestamp'] = pd.to_datetime(tags['timestamp'], unit='s')

    # --- Links ---
    links = links.dropna(subset=['movieId'])
    links['movieId'] = links['movieId'].astype(int)

    # Merge links into movies for IMDb/TMDB ids
    movies = movies.merge(links[['movieId', 'imdbId', 'tmdbId']], on='movieId', how='left')

    print(f"  After cleaning - Ratings: {len(ratings):,}, Movies: {len(movies):,}, Tags: {len(tags):,}")
    return ratings, movies, tags


def encode_ids(ratings, movies):
    """Encode userId and movieId with LabelEncoders for model compatibility."""
    user_encoder = LabelEncoder()
    movie_encoder = LabelEncoder()

    ratings['user_encoded'] = user_encoder.fit_transform(ratings['userId'])
    ratings['movie_encoded'] = movie_encoder.fit_transform(ratings['movieId'])

    # Also encode movies df for alignment
    known_movie_ids = set(movie_encoder.classes_)
    movies_encoded = movies[movies['movieId'].isin(known_movie_ids)].copy()
    movies_encoded['movie_encoded'] = movie_encoder.transform(movies_encoded['movieId'])

    print(f"  Encoded {len(user_encoder.classes_)} users, {len(movie_encoder.classes_)} movies")
    return ratings, movies_encoded, user_encoder, movie_encoder


def split_data(ratings, test_ratio=0.2, time_based=True):
    """
    Split ratings into train/test.
    - time_based=True: chronological split per user (last 20% of each user's ratings)
    - time_based=False: random 80/20 split
    """
    if time_based:
        ratings = ratings.sort_values(['userId', 'timestamp'])
        train_indices = []
        test_indices = []

        for user_id, group in ratings.groupby('userId'):
            n = len(group)
            split_point = int(n * (1 - test_ratio))
            if split_point < 1:
                split_point = 1
            train_indices.extend(group.iloc[:split_point].index)
            test_indices.extend(group.iloc[split_point:].index)

        train_df = ratings.loc[train_indices]
        test_df = ratings.loc[test_indices]
    else:
        from sklearn.model_selection import train_test_split
        train_df, test_df = train_test_split(ratings, test_size=test_ratio, random_state=42)

    print(f"  Train: {len(train_df):,} | Test: {len(test_df):,} | Ratio: {len(test_df)/len(ratings):.1%}")
    return train_df, test_df


def compute_movie_stats(ratings, movies):
    """Compute aggregate movie statistics for popularity-based features."""
    stats = ratings.groupby('movieId').agg(
        avg_rating=('rating', 'mean'),
        num_ratings=('rating', 'count'),
        rating_std=('rating', 'std')
    ).reset_index()
    stats['rating_std'] = stats['rating_std'].fillna(0)

    movies = movies.merge(stats, on='movieId', how='left')
    movies['avg_rating'] = movies['avg_rating'].fillna(0)
    movies['num_ratings'] = movies['num_ratings'].fillna(0).astype(int)
    movies['rating_std'] = movies['rating_std'].fillna(0)

    print(f"  Movie stats: avg_rating range [{movies['avg_rating'].min():.1f}, {movies['avg_rating'].max():.1f}]")
    print(f"  Most rated movie: {movies.loc[movies['num_ratings'].idxmax(), 'title']} ({movies['num_ratings'].max()} ratings)")
    return movies


def aggregate_tags(tags, movies):
    """Aggregate all tags per movie into a single string."""
    movie_tags = tags.groupby('movieId')['tag'].apply(lambda x: ' '.join(x)).reset_index()
    movie_tags.columns = ['movieId', 'tags_combined']

    movies = movies.merge(movie_tags, on='movieId', how='left')
    movies['tags_combined'] = movies['tags_combined'].fillna('')

    # Create combined content feature (genres + tags) for content-based filtering
    movies['content'] = movies['genre_str'] + ' ' + movies['tags_combined']

    tagged = (movies['tags_combined'] != '').sum()
    print(f"  Movies with tags: {tagged} / {len(movies)}")
    return movies


def run_preprocessing(data_path='data/raw/ml-latest-small', output_path='data/processed'):
    """Run the complete preprocessing pipeline."""
    print("=" * 60)
    print("ReelSense++ v2.0 - Data Preprocessing Pipeline")
    print("=" * 60)

    # Step 1: Load
    print("\n[1/7] Loading CSV files...")
    ratings, movies, tags, links = load_data(data_path)

    # Step 2: Clean
    print("\n[2/7] Cleaning data...")
    ratings, movies, tags = clean_data(ratings, movies, tags, links)

    # Step 3: Merge for exploration
    print("\n[3/7] Merging ratings with movies...")
    merged = merge_data(ratings, movies)

    # Step 4: Encode IDs
    print("\n[4/7] Encoding user and movie IDs...")
    ratings, movies, user_enc, movie_enc = encode_ids(ratings, movies)

    # Step 5: Compute stats
    print("\n[5/7] Computing movie statistics...")
    movies = compute_movie_stats(ratings, movies)

    # Step 6: Aggregate tags
    print("\n[6/7] Aggregating tags...")
    movies = aggregate_tags(tags, movies)

    # Step 7: Train/Test split
    print("\n[7/7] Splitting data (80/20 time-based)...")
    train_df, test_df = split_data(ratings, test_ratio=0.2, time_based=True)

    # --- Save processed data ---
    os.makedirs(output_path, exist_ok=True)

    train_df.to_csv(os.path.join(output_path, 'train_ratings.csv'), index=False)
    test_df.to_csv(os.path.join(output_path, 'test_ratings.csv'), index=False)
    movies.to_csv(os.path.join(output_path, 'movies_cleaned.csv'), index=False)
    tags.to_csv(os.path.join(output_path, 'tags_cleaned.csv'), index=False)

    # Save encoders
    import joblib
    os.makedirs(os.path.join(output_path, 'encoders'), exist_ok=True)
    joblib.dump(user_enc, os.path.join(output_path, 'encoders', 'user_encoder.pkl'))
    joblib.dump(movie_enc, os.path.join(output_path, 'encoders', 'movie_encoder.pkl'))

    print("\n" + "=" * 60)
    print("✅ Preprocessing complete!")
    print(f"  Output directory: {output_path}/")
    print(f"  Train ratings:    {len(train_df):,}")
    print(f"  Test ratings:     {len(test_df):,}")
    print(f"  Movies:           {len(movies):,}")
    print(f"  Tags:             {len(tags):,}")
    print(f"  Users:            {ratings['userId'].nunique()}")
    print(f"  Unique movies:    {ratings['movieId'].nunique()}")
    print("=" * 60)

    return train_df, test_df, movies, tags, user_enc, movie_enc


if __name__ == "__main__":
    run_preprocessing()
