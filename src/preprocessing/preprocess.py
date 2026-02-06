import pandas as pd
import numpy as np
import os

def load_data(data_path='data/raw/ml-latest-small'):
    ratings = pd.read_csv(os.path.join(data_path, 'ratings.csv'))
    movies = pd.read_csv(os.path.join(data_path, 'movies.csv'))
    tags = pd.read_csv(os.path.join(data_path, 'tags.csv'))
    return ratings, movies, tags

def clean_data(ratings, movies, tags):
    # Convert timestamp to datetime
    ratings['timestamp'] = pd.to_datetime(ratings['timestamp'], unit='s')
    tags['timestamp'] = pd.to_datetime(tags['timestamp'], unit='s')
    
    # Clean genres: convert pipe-separated string to list
    movies['genres'] = movies['genres'].apply(lambda x: x.split('|'))
    
    # Standardize tags: lowercase and strip whitespace
    tags['tag'] = tags['tag'].str.lower().str.strip()
    
    return ratings, movies, tags

def split_data(ratings, test_size=10):
    """
    Time-based split: Leave-last-N ratings per user for testing.
    """
    ratings = ratings.sort_values(['userId', 'timestamp'])
    
    test_indices = []
    for user_id in ratings['userId'].unique():
        user_ratings = ratings[ratings['userId'] == user_id]
        if len(user_ratings) > test_size:
            test_indices.extend(user_ratings.iloc[-test_size:].index)
        else:
            # If user has fewer ratings than test_size, take at least one if possible
            if len(user_ratings) > 1:
                test_indices.append(user_ratings.iloc[-1].index[0])
                
    test_df = ratings.loc[test_indices]
    train_df = ratings.drop(test_indices)
    
    return train_df, test_df

if __name__ == "__main__":
    print("Loading and cleaning data...")
    r, m, t = load_data()
    r, m, t = clean_data(r, m, t)
    
    print("Splitting data...")
    train, test = split_data(r)
    
    # Save processed data
    os.makedirs('data/processed', exist_ok=True)
    train.to_csv('data/processed/train_ratings.csv', index=False)
    test.to_csv('data/processed/test_ratings.csv', index=False)
    m.to_csv('data/processed/movies_cleaned.csv', index=False)
    t.to_csv('data/processed/tags_cleaned.csv', index=False)
    
    print(f"Preprocessing complete. Train size: {len(train)}, Test size: {len(test)}")
