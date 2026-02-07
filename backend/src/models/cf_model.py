"""
ReelSense++ v2.0 - Collaborative Filtering with SVD
Matrix Factorization using scipy.sparse.linalg + SGD optimization.
No dependency on scikit-surprise — works on any Python version.
"""
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds
import pickle
import os
import time


class CFModelSVD:
    """
    Collaborative Filtering via truncated SVD on the user-item rating matrix.
    Supports:
      - Truncated SVD decomposition (scipy)
      - SGD-based matrix factorization for better accuracy
      - Bias terms for users and items
    """

    def __init__(self, n_factors=50, n_epochs=20, lr=0.005, reg=0.02, method='sgd'):
        self.n_factors = n_factors
        self.n_epochs = n_epochs
        self.lr = lr
        self.reg = reg
        self.method = method  # 'svd' or 'sgd'

        # Mappings
        self.user_to_idx = {}
        self.idx_to_user = {}
        self.movie_to_idx = {}
        self.idx_to_movie = {}

        # Model parameters (SGD)
        self.P = None  # User factors
        self.Q = None  # Item factors
        self.bu = None  # User biases
        self.bi = None  # Item biases
        self.global_mean = 0

        # Model parameters (SVD)
        self.user_factors = None
        self.sigma = None
        self.item_factors = None
        self.rating_matrix_mean = None

        self.train_time = 0

    def fit(self, train_df):
        """Train the model on the training data."""
        # Build mappings
        users = train_df['userId'].unique()
        movies = train_df['movieId'].unique()

        self.user_to_idx = {u: i for i, u in enumerate(users)}
        self.idx_to_user = {i: u for u, i in self.user_to_idx.items()}
        self.movie_to_idx = {m: i for i, m in enumerate(movies)}
        self.idx_to_movie = {i: m for m, i in self.movie_to_idx.items()}

        n_users = len(users)
        n_movies = len(movies)
        self.global_mean = train_df['rating'].mean()

        print(f"  Matrix size: {n_users} users x {n_movies} movies")
        print(f"  Global mean rating: {self.global_mean:.3f}")
        print(f"  Method: {self.method.upper()}, Factors: {self.n_factors}")

        start = time.time()

        if self.method == 'svd':
            self._fit_svd(train_df, n_users, n_movies)
        else:
            self._fit_sgd(train_df, n_users, n_movies)

        self.train_time = time.time() - start
        print(f"  Training complete in {self.train_time:.1f}s")

    def _fit_svd(self, train_df, n_users, n_movies):
        """Truncated SVD on the sparse rating matrix."""
        rows = train_df['userId'].map(self.user_to_idx).values
        cols = train_df['movieId'].map(self.movie_to_idx).values
        vals = train_df['rating'].values.astype(np.float64)

        # Build sparse matrix
        sparse_matrix = csr_matrix((vals, (rows, cols)), shape=(n_users, n_movies))

        # Compute mean per user for centering
        user_means = np.array(sparse_matrix.sum(axis=1)).flatten()
        user_counts = np.array((sparse_matrix > 0).sum(axis=1)).flatten()
        user_counts[user_counts == 0] = 1
        user_means = user_means / user_counts
        self.rating_matrix_mean = user_means

        # Center the matrix
        for i in range(n_users):
            row_start = sparse_matrix.indptr[i]
            row_end = sparse_matrix.indptr[i + 1]
            sparse_matrix.data[row_start:row_end] -= user_means[i]

        # Truncated SVD
        k = min(self.n_factors, min(n_users, n_movies) - 1)
        print(f"  Computing truncated SVD with k={k}...")
        U, sigma, Vt = svds(sparse_matrix.astype(float), k=k)

        self.user_factors = U
        self.sigma = np.diag(sigma)
        self.item_factors = Vt

    def _fit_sgd(self, train_df, n_users, n_movies):
        """SGD-based matrix factorization with biases (like Funk SVD)."""
        np.random.seed(42)
        self.P = np.random.normal(0, 0.1, (n_users, self.n_factors))
        self.Q = np.random.normal(0, 0.1, (n_movies, self.n_factors))
        self.bu = np.zeros(n_users)
        self.bi = np.zeros(n_movies)

        # Prepare training data as arrays
        user_indices = train_df['userId'].map(self.user_to_idx).values
        movie_indices = train_df['movieId'].map(self.movie_to_idx).values
        ratings = train_df['rating'].values.astype(np.float64)

        n_ratings = len(ratings)

        for epoch in range(self.n_epochs):
            # Shuffle
            perm = np.random.permutation(n_ratings)
            total_loss = 0

            for idx in perm:
                u = user_indices[idx]
                i = movie_indices[idx]
                r = ratings[idx]

                # Predicted rating
                pred = self.global_mean + self.bu[u] + self.bi[i] + np.dot(self.P[u], self.Q[i])
                err = r - pred
                total_loss += err ** 2

                # Update biases
                self.bu[u] += self.lr * (err - self.reg * self.bu[u])
                self.bi[i] += self.lr * (err - self.reg * self.bi[i])

                # Update factors
                P_u = self.P[u].copy()
                self.P[u] += self.lr * (err * self.Q[i] - self.reg * self.P[u])
                self.Q[i] += self.lr * (err * P_u - self.reg * self.Q[i])

            rmse = np.sqrt(total_loss / n_ratings)
            if (epoch + 1) % 5 == 0 or epoch == 0:
                print(f"    Epoch {epoch+1:>2}/{self.n_epochs} - Train RMSE: {rmse:.4f}")

    def predict(self, user_id, movie_id):
        """Predict rating for a (user, movie) pair."""
        u_known = user_id in self.user_to_idx
        m_known = movie_id in self.movie_to_idx

        if self.method == 'sgd':
            if u_known and m_known:
                u = self.user_to_idx[user_id]
                i = self.movie_to_idx[movie_id]
                pred = self.global_mean + self.bu[u] + self.bi[i] + np.dot(self.P[u], self.Q[i])
            elif u_known:
                u = self.user_to_idx[user_id]
                pred = self.global_mean + self.bu[u]
            elif m_known:
                i = self.movie_to_idx[movie_id]
                pred = self.global_mean + self.bi[i]
            else:
                pred = self.global_mean
        else:
            # SVD method
            if u_known and m_known:
                u = self.user_to_idx[user_id]
                i = self.movie_to_idx[movie_id]
                pred = self.rating_matrix_mean[u] + np.dot(
                    np.dot(self.user_factors[u], self.sigma),
                    self.item_factors[:, i]
                )
            elif u_known:
                pred = self.rating_matrix_mean[self.user_to_idx[user_id]]
            else:
                pred = self.global_mean

        return float(np.clip(pred, 0.5, 5.0))

    def predict_batch(self, user_id, movie_ids):
        """Predict ratings for a user on multiple movies."""
        return {mid: self.predict(user_id, mid) for mid in movie_ids}

    def evaluate(self, test_df):
        """Evaluate the model on test data, return RMSE + MAE."""
        print("  Evaluating on test set...")
        predictions = []
        actuals = []

        for _, row in test_df.iterrows():
            pred = self.predict(int(row['userId']), int(row['movieId']))
            predictions.append(pred)
            actuals.append(row['rating'])

        predictions = np.array(predictions)
        actuals = np.array(actuals)

        rmse = np.sqrt(np.mean((predictions - actuals) ** 2))
        mae = np.mean(np.abs(predictions - actuals))

        return rmse, mae, predictions

    def get_top_n_for_user(self, user_id, all_movie_ids, rated_movie_ids, n=10):
        """Get top-N recommendations for a user (excluding already rated)."""
        candidates = [mid for mid in all_movie_ids if mid not in rated_movie_ids]
        scores = [(mid, self.predict(user_id, mid)) for mid in candidates]
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:n]

    def save_model(self, path='src/models/saved/svd_model.pkl'):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        state = {
            'method': self.method,
            'n_factors': self.n_factors,
            'global_mean': self.global_mean,
            'user_to_idx': self.user_to_idx,
            'idx_to_user': self.idx_to_user,
            'movie_to_idx': self.movie_to_idx,
            'idx_to_movie': self.idx_to_movie,
            'P': self.P, 'Q': self.Q,
            'bu': self.bu, 'bi': self.bi,
            'user_factors': self.user_factors,
            'sigma': self.sigma,
            'item_factors': self.item_factors,
            'rating_matrix_mean': self.rating_matrix_mean,
        }
        with open(path, 'wb') as f:
            pickle.dump(state, f)
        print(f"  Model saved to {path}")

    def load_model(self, path='src/models/saved/svd_model.pkl'):
        with open(path, 'rb') as f:
            state = pickle.load(f)
        self.method = state['method']
        self.n_factors = state['n_factors']
        self.global_mean = state['global_mean']
        self.user_to_idx = state['user_to_idx']
        self.idx_to_user = state['idx_to_user']
        self.movie_to_idx = state['movie_to_idx']
        self.idx_to_movie = state['idx_to_movie']
        self.P = state['P']
        self.Q = state['Q']
        self.bu = state['bu']
        self.bi = state['bi']
        self.user_factors = state['user_factors']
        self.sigma = state['sigma']
        self.item_factors = state['item_factors']
        self.rating_matrix_mean = state['rating_matrix_mean']
        print(f"  Model loaded from {path}")


if __name__ == "__main__":
    print("=" * 60)
    print("ReelSense++ - SVD Collaborative Filtering")
    print("=" * 60)

    train_df = pd.read_csv('data/processed/train_ratings.csv')
    test_df = pd.read_csv('data/processed/test_ratings.csv')

    print(f"\nDataset: {len(train_df):,} train / {len(test_df):,} test ratings")

    # Train with SGD (Funk SVD with biases)
    print("\n[1] Training SGD Matrix Factorization...")
    cf = CFModelSVD(n_factors=50, n_epochs=20, lr=0.005, reg=0.02, method='sgd')
    cf.fit(train_df)

    # Evaluate
    print("\n[2] Evaluating on test set...")
    rmse, mae, preds = cf.evaluate(test_df)
    print(f"  ✅ RMSE: {rmse:.4f}")
    print(f"  ✅ MAE:  {mae:.4f}")

    # Save
    print("\n[3] Saving model...")
    cf.save_model()

    # Sample predictions
    print("\n[4] Sample predictions:")
    sample = test_df.sample(8, random_state=42)
    for _, row in sample.iterrows():
        pred = cf.predict(int(row['userId']), int(row['movieId']))
        print(f"  User {int(row['userId']):>3} | Movie {int(row['movieId']):>5} | "
              f"Actual: {row['rating']:.1f} | Predicted: {pred:.2f}")

    print("\n" + "=" * 60)
