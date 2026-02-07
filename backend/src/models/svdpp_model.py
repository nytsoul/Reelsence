"""
SVD++ Collaborative Filtering Model
Incorporates implicit feedback (the fact that a user rated a movie)
alongside explicit ratings for improved predictions.
"""
import pandas as pd
import numpy as np
try:
    from surprise import SVDpp, Dataset, Reader
    _HAS_SURPRISE = True
except ImportError:
    _HAS_SURPRISE = False
    print("Warning: 'scikit-surprise' not found. Using fallback SimpleCollaborativeFilter.")

import pickle
import os

class SVDPlusPlusModel:
    def __init__(self, n_factors=100, n_epochs=20, lr_all=0.007, reg_all=0.02):
        """
        SVD++ with implicit feedback.
        Uses fallback if surprise is not available.
        """
        self.use_fallback = not _HAS_SURPRISE
        if self.use_fallback:
            self.model = None
            self.user_means = {}
            self.item_means = {}
            self.global_mean = 0
            return

        self.model = SVDpp(
            n_factors=n_factors,
            n_epochs=n_epochs,
            lr_all=lr_all,
            reg_all=reg_all,
            verbose=True
        )
        self.reader = Reader(rating_scale=(0.5, 5.0))
        self.trainset = None
        
    def fit(self, train_df):
        """
        Train SVD++ on rating data.
        """
        if self.use_fallback:
            print("Training Fallback Model (Mean-based)...")
            self.global_mean = train_df['rating'].mean()
            self.user_means = train_df.groupby('userId')['rating'].mean().to_dict()
            self.item_means = train_df.groupby('movieId')['rating'].mean().to_dict()
            print("Fallback training complete.")
            return

        print("Training SVD++ model...")
        data = Dataset.load_from_df(
            train_df[['userId', 'movieId', 'rating']], 
            self.reader
        )
        self.trainset = data.build_full_trainset()
        self.model.fit(self.trainset)
        print("SVD++ training complete.")
        
    def predict(self, user_id, movie_id):
        """Predict rating for a user-movie pair."""
        if self.use_fallback:
            u_mean = self.user_means.get(user_id, self.global_mean)
            i_mean = self.item_means.get(movie_id, self.global_mean)
            # Simple average of user and item means
            return (u_mean + i_mean) / 2.0

        pred = self.model.predict(user_id, movie_id)
        return pred.est
    
    def get_top_n_recommendations(self, user_id, n=10, candidate_movies=None):
        if self.use_fallback:
            # Fallback logic for top-N
            if candidate_movies is None:
                candidate_movies = list(self.item_means.keys())
            
            predictions = [(mid, self.predict(user_id, mid)) for mid in candidate_movies]
            predictions.sort(key=lambda x: x[1], reverse=True)
            return predictions[:n]

        if candidate_movies is None:
            # Get all movies from trainset
            all_items = [iid for iid in self.trainset.all_items()]
            candidate_movies = [self.trainset.to_raw_iid(iid) for iid in all_items]
        
        # Predict scores for all candidates
        predictions = [(mid, self.predict(user_id, mid)) for mid in candidate_movies]
        
        # Sort by predicted rating
        predictions.sort(key=lambda x: x[1], reverse=True)
        return predictions[:n]
    
    def save_model(self, path='src/models/svdpp_model.pkl'):
        """Save trained model."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump(self.model, f)
        print(f"SVD++ model saved to {path}")
    
    def load_model(self, path='src/models/svdpp_model.pkl'):
        """Load pre-trained model."""
        with open(path, 'rb') as f:
            self.model = pickle.load(f)
        print(f"SVD++ model loaded from {path}")

if __name__ == "__main__":
    # Train and save SVD++ model
    train_df = pd.read_csv('data/processed/train_ratings.csv')
    
    svdpp = SVDPlusPlusModel(n_factors=100, n_epochs=20)
    svdpp.fit(train_df)
    svdpp.save_model()
    
    # Test prediction
    test_user = train_df.iloc[0]['userId']
    test_movie = train_df.iloc[0]['movieId']
    pred = svdpp.predict(test_user, test_movie)
    print(f"\nPrediction for User {test_user} on Movie {test_movie}: {pred:.2f}")
