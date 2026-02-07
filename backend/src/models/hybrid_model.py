"""
ReelSense++ v2.0 - Hybrid Recommendation Engine
Combines Collaborative Filtering (SVD) + Content-Based Filtering (TF-IDF)
into a unified recommender with the recommend_movies() function.
"""
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import time
import os
import pickle


class ContentBasedModel:
    """Content-based filtering using TF-IDF on genres + tags."""

    def __init__(self):
        self.tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
        self.content_matrix = None
        self.movie_id_to_idx = {}
        self.idx_to_movie_id = {}

    def fit(self, movies_df):
        """Build TF-IDF matrix from movie content (genres + tags)."""
        # Ensure content column exists
        if 'content' not in movies_df.columns:
            genre_str = movies_df.get('genre_str', movies_df.get('genres', pd.Series(dtype=str)))
            tags_str = movies_df.get('tags_combined', pd.Series('', index=movies_df.index))
            movies_df = movies_df.copy()
            movies_df['content'] = genre_str.fillna('') + ' ' + tags_str.fillna('')

        # Build index mapping
        self.movie_id_to_idx = {mid: i for i, mid in enumerate(movies_df['movieId'].values)}
        self.idx_to_movie_id = {i: mid for mid, i in self.movie_id_to_idx.items()}

        # Fit TF-IDF
        self.content_matrix = self.tfidf.fit_transform(movies_df['content'].fillna(''))
        print(f"  Content-based model: {self.content_matrix.shape[0]} movies, "
              f"{self.content_matrix.shape[1]} features")

    def get_similarity(self, movie_id1, movie_id2):
        """Cosine similarity between two movies."""
        if movie_id1 not in self.movie_id_to_idx or movie_id2 not in self.movie_id_to_idx:
            return 0.0
        idx1 = self.movie_id_to_idx[movie_id1]
        idx2 = self.movie_id_to_idx[movie_id2]
        sim = cosine_similarity(
            self.content_matrix[idx1:idx1+1],
            self.content_matrix[idx2:idx2+1]
        )
        return float(sim[0][0])

    def get_similar_movies(self, movie_id, n=10):
        """Find n most similar movies by content."""
        if movie_id not in self.movie_id_to_idx:
            return []
        idx = self.movie_id_to_idx[movie_id]
        sims = cosine_similarity(self.content_matrix[idx:idx+1], self.content_matrix).flatten()
        similar_indices = sims.argsort()[::-1][1:n+1]  # Skip self
        return [(self.idx_to_movie_id[i], float(sims[i])) for i in similar_indices]

    def get_user_content_score(self, user_id, movie_id, train_ratings, top_k=10):
        """
        Content score: avg similarity of candidate movie to user's top-rated movies.
        """
        if movie_id not in self.movie_id_to_idx:
            return 0.0

        user_ratings = train_ratings[train_ratings['userId'] == user_id]
        if user_ratings.empty:
            return 0.0

        # Get user's top-rated movies
        top_movies = user_ratings.nlargest(top_k, 'rating')['movieId'].tolist()

        sims = []
        for rated_mid in top_movies:
            s = self.get_similarity(movie_id, rated_mid)
            sims.append(s)

        return float(np.mean(sims)) if sims else 0.0

    def save(self, path='src/models/saved/content_model.pkl'):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        state = {
            'tfidf': self.tfidf,
            'content_matrix': self.content_matrix,
            'movie_id_to_idx': self.movie_id_to_idx,
            'idx_to_movie_id': self.idx_to_movie_id,
        }
        with open(path, 'wb') as f:
            pickle.dump(state, f)

    def load(self, path='src/models/saved/content_model.pkl'):
        with open(path, 'rb') as f:
            state = pickle.load(f)
        self.tfidf = state['tfidf']
        self.content_matrix = state['content_matrix']
        self.movie_id_to_idx = state['movie_id_to_idx']
        self.idx_to_movie_id = state['idx_to_movie_id']


class HybridRecommender:
    """
    Hybrid recommender combining:
      - Collaborative Filtering (SVD with biases)
      - Content-Based Filtering (TF-IDF on genres + tags)
    Provides the main recommend_movies(user_id, top_n) function.
    """

    def __init__(self, cf_model, content_model, train_ratings, movies_df):
        self.cf_model = cf_model
        self.content_model = content_model
        self.train_ratings = train_ratings
        self.movies_df = movies_df

        # Build fast lookup sets
        self.all_movie_ids = set(movies_df['movieId'].tolist())
        self.user_rated = {}
        for uid, group in train_ratings.groupby('userId'):
            self.user_rated[uid] = set(group['movieId'].tolist())

        # Movie info lookup
        self.movie_info = {}
        for _, row in movies_df.iterrows():
            mid = row['movieId']
            self.movie_info[mid] = {
                'title': row.get('title', f'Movie {mid}'),
                'genres': row.get('genres', ''),
                'year': row.get('year', None),
                'avg_rating': row.get('avg_rating', 0),
                'num_ratings': row.get('num_ratings', 0),
            }

    def recommend(self, user_id, top_k=10, cf_weight=0.7, candidate_pool=500):
        """
        Core recommendation with hybrid scoring.
        Returns list of (movie_id, final_score, cf_score, content_score).
        """
        rated = self.user_rated.get(user_id, set())
        candidates = [mid for mid in self.all_movie_ids if mid not in rated]

        # Pre-filter: get CF scores for a larger pool first
        # For efficiency, sample candidates if too many
        if len(candidates) > candidate_pool:
            # Bias towards popular movies
            popular = self.movies_df[
                self.movies_df['movieId'].isin(candidates)
            ].nlargest(candidate_pool, 'num_ratings')['movieId'].tolist()
            candidates = popular

        results = []
        for mid in candidates:
            cf_score = self.cf_model.predict(user_id, mid)
            cf_norm = (cf_score - 0.5) / 4.5  # Normalize 0.5-5.0 → 0-1

            content_score = self.content_model.get_user_content_score(
                user_id, mid, self.train_ratings, top_k=5
            )

            final_score = cf_weight * cf_norm + (1 - cf_weight) * content_score
            results.append((mid, final_score, cf_score, content_score))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

    def recommend_movies(self, user_id, top_n=10, cf_weight=0.7):
        """
        Main interface: returns movie titles as a list.
        Also returns detailed recommendation objects.
        """
        recs = self.recommend(user_id, top_k=top_n, cf_weight=cf_weight)

        results = []
        for movie_id, final_score, cf_score, content_score in recs:
            info = self.movie_info.get(movie_id, {})
            explanation = self.explain(user_id, movie_id)

            confidence = min(1.0, final_score * 1.1)  # Normalized confidence
            why_not = self._generate_why_not(user_id, movie_id, cf_score)

            results.append({
                'movieId': movie_id,
                'title': info.get('title', f'Movie {movie_id}'),
                'genres': info.get('genres', ''),
                'year': info.get('year'),
                'avg_rating': round(info.get('avg_rating', 0), 2),
                'num_ratings': info.get('num_ratings', 0),
                'predicted_rating': round(cf_score, 2),
                'confidence': round(confidence, 3),
                'cf_score': round(cf_score, 2),
                'content_score': round(content_score, 3),
                'final_score': round(final_score, 3),
                'explanation': explanation,
                'why_not': why_not,
            })

        return results

    def explain(self, user_id, movie_id):
        """Generate multi-level explanations for a recommendation."""
        info = self.movie_info.get(movie_id, {})
        title = info.get('title', f'Movie {movie_id}')
        genres = info.get('genres', '')

        # Find overlapping genres with user's favorites
        user_ratings = self.train_ratings[self.train_ratings['userId'] == user_id]
        if user_ratings.empty:
            return {
                'simple': f"'{title}' is a popular movie you might enjoy.",
                'intermediate': f"Based on overall popularity and content features.",
                'advanced': f"Cold-start recommendation using global popularity bias."
            }

        user_top = user_ratings.nlargest(5, 'rating').merge(
            self.movies_df[['movieId', 'title', 'genres']], on='movieId'
        )

        # Find genre overlap
        movie_genres = set(genres.split('|')) if isinstance(genres, str) else set()
        matched_movie = None
        overlap_genres = set()

        for _, row in user_top.iterrows():
            past_genres = set(str(row['genres']).split('|'))
            overlap = movie_genres & past_genres
            if overlap and not matched_movie:
                matched_movie = row['title']
                overlap_genres = overlap

        cf_score = self.cf_model.predict(user_id, movie_id)
        content_score = self.content_model.get_user_content_score(
            user_id, movie_id, self.train_ratings
        )

        if matched_movie and overlap_genres:
            simple = f"Because you liked '{matched_movie}', we think you'll enjoy '{title}'."
            intermediate = (f"'{title}' shares the genre(s) {', '.join(list(overlap_genres)[:3])} "
                          f"with movies you rated highly. Similar users also rated it well.")
        else:
            simple = f"'{title}' is recommended based on your viewing pattern."
            intermediate = f"Users with similar taste rated '{title}' highly."

        advanced = (f"Hybrid score: CF={cf_score:.2f} (weight=0.7), "
                   f"Content={content_score:.3f} (weight=0.3). "
                   f"SVD latent factor alignment with user profile.")

        return {
            'simple': simple,
            'intermediate': intermediate,
            'advanced': advanced
        }

    def _generate_why_not(self, user_id, movie_id, cf_score):
        """Generate 'why you might NOT like this' warning if applicable."""
        info = self.movie_info.get(movie_id, {})

        # Low predicted rating
        if cf_score < 3.0:
            return f"Predicted rating ({cf_score:.1f}) is below average — might not match your taste."

        # Few ratings (unpopular)
        if info.get('num_ratings', 0) < 10:
            return "This is a lesser-known film — limited user data available for prediction."

        # High variance movie
        return None

    def get_content_similarity(self, movie_id1, movie_id2):
        """Proxy for backward compatibility with evaluation/diversity code."""
        return self.content_model.get_similarity(movie_id1, movie_id2)

    def save(self, path='src/models/saved/hybrid_state.pkl'):
        """Save the hybrid recommender state (just metadata, models saved separately)."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        state = {
            'all_movie_ids': list(self.all_movie_ids),
            'movie_info': self.movie_info,
        }
        with open(path, 'wb') as f:
            pickle.dump(state, f)


def build_hybrid_system(data_dir='data/processed', model_dir='src/models/saved'):
    """
    Load data, train all models, build hybrid recommender.
    Returns the trained HybridRecommender instance.
    """
    print("=" * 60)
    print("ReelSense++ - Building Hybrid Recommendation System")
    print("=" * 60)

    # Load preprocessed data
    print("\n[1/4] Loading preprocessed data...")
    train_df = pd.read_csv(os.path.join(data_dir, 'train_ratings.csv'))
    movies_df = pd.read_csv(os.path.join(data_dir, 'movies_cleaned.csv'))
    tags_df = pd.read_csv(os.path.join(data_dir, 'tags_cleaned.csv'))
    print(f"  Train: {len(train_df):,} | Movies: {len(movies_df):,} | Tags: {len(tags_df):,}")

    # Train CF model
    print("\n[2/4] Training Collaborative Filtering (SVD)...")
    from src.models.cf_model import CFModelSVD
    cf = CFModelSVD(n_factors=50, n_epochs=20, lr=0.005, reg=0.02, method='sgd')
    cf.fit(train_df)
    cf.save_model(os.path.join(model_dir, 'svd_model.pkl'))

    # Train content-based model
    print("\n[3/4] Building Content-Based Model (TF-IDF)...")
    cb = ContentBasedModel()
    cb.fit(movies_df)
    cb.save(os.path.join(model_dir, 'content_model.pkl'))

    # Build hybrid
    print("\n[4/4] Assembling Hybrid Recommender...")
    hybrid = HybridRecommender(cf, cb, train_df, movies_df)
    hybrid.save(os.path.join(model_dir, 'hybrid_state.pkl'))

    print("\n✅ Hybrid system built and saved!")
    return hybrid, train_df, movies_df


def load_hybrid_system(data_dir='data/processed', model_dir='src/models/saved'):
    """Load a pre-trained hybrid system from disk."""
    print("Loading pre-trained hybrid system...")

    train_df = pd.read_csv(os.path.join(data_dir, 'train_ratings.csv'))
    movies_df = pd.read_csv(os.path.join(data_dir, 'movies_cleaned.csv'))

    from src.models.cf_model import CFModelSVD
    cf = CFModelSVD()
    cf.load_model(os.path.join(model_dir, 'svd_model.pkl'))

    cb = ContentBasedModel()
    cb.load(os.path.join(model_dir, 'content_model.pkl'))

    hybrid = HybridRecommender(cf, cb, train_df, movies_df)
    print("✅ Hybrid system loaded!")
    return hybrid, train_df, movies_df


if __name__ == "__main__":
    import sys
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

    # Build or load
    model_path = 'src/models/saved/svd_model.pkl'
    if os.path.exists(model_path):
        print("Found existing models, loading...")
        hybrid, train_df, movies_df = load_hybrid_system()
    else:
        print("No existing models, building from scratch...")
        hybrid, train_df, movies_df = build_hybrid_system()

    # Test: recommend_movies for a few users
    test_users = [1, 50, 100, 200, 400]
    for uid in test_users:
        print(f"\n{'='*60}")
        print(f"🎬 Recommendations for User {uid}")
        print(f"{'='*60}")
        recs = hybrid.recommend_movies(uid, top_n=10)
        for i, rec in enumerate(recs, 1):
            print(f"  {i:>2}. {rec['title']}")
            print(f"      Predicted: {rec['predicted_rating']:.1f}★ | "
                  f"Confidence: {rec['confidence']:.0%} | "
                  f"Genres: {rec['genres']}")
            print(f"      💡 {rec['explanation']['simple']}")
            if rec['why_not']:
                print(f"      ⚠️  {rec['why_not']}")
        print()
