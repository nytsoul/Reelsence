import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import ast

class HybridRecommender:
    def __init__(self, cf_model, train_ratings, movies, tags):
        self.cf_model = cf_model
        self.train_ratings = train_ratings
        self.movies = movies
        self.tags = tags
        self.content_matrix = None
        self._prepare_content_features()
        
    def _prepare_content_features(self):
        # Merge genres and tags for content-based profile
        # Precompute genre tokens
        self.movies['genre_str'] = self.movies['genres'].apply(lambda x: ' '.join(ast.literal_eval(x)) if isinstance(x, str) else ' '.join(x))
        
        # Aggregate tags per movie
        movie_tags = self.tags.groupby('movieId')['tag'].apply(lambda x: ' '.join(x)).reset_index()
        self.movies = self.movies.merge(movie_tags, on='movieId', how='left').fillna({'tag': ''})
        
        # Combined content representation
        self.movies['content'] = self.movies['genre_str'] + ' ' + self.movies['tag']
        
        # TF-IDF Vectorization
        tfidf = TfidfVectorizer(stop_words='english')
        self.content_matrix = tfidf.fit_transform(self.movies['content'])
        self.movie_indices = pd.Series(self.movies.index, index=self.movies['movieId']).drop_duplicates()

    def get_content_similarity(self, movie_id1, movie_id2):
        if movie_id1 not in self.movie_indices or movie_id2 not in self.movie_indices:
            return 0
        idx1 = self.movie_indices[movie_id1]
        idx2 = self.movie_indices[movie_id2]
        sim = cosine_similarity(self.content_matrix[idx1], self.content_matrix[idx2])
        return sim[0][0]

    def recommend(self, user_id, top_k=10, cf_weight=0.7):
        # 1. Get CF scores for all movies the user hasn't rated
        rated_movies = self.train_ratings[self.train_ratings['userId'] == user_id]['movieId'].tolist()
        all_movies = self.movies['movieId'].tolist()
        candidates = [m for m in all_movies if m not in rated_movies]
        
        # Limit candidates for speed in 100k
        import random
        if len(candidates) > 1000:
            candidates = random.sample(candidates, 1000)
            
        scores = []
        for m_id in candidates:
            cf_score = self.cf_model.predict(user_id, m_id)
            # Normalize CF score (0.5 to 5.0) to 0-1
            cf_norm = (cf_score - 0.5) / 4.5
            
            # Simple content bonus: similarity to user's top rated movies
            user_top = self.train_ratings[self.train_ratings['userId'] == user_id].sort_values('rating', ascending=False).head(5)['movieId'].tolist()
            content_sims = [self.get_content_similarity(m_id, top_m) for top_m in user_top]
            content_score = np.mean(content_sims) if content_sims else 0
            
            final_score = (cf_weight * cf_norm) + (1 - cf_weight) * content_score
            scores.append((m_id, final_score, cf_score, content_score))
            
        scores.sort(key=lambda x: x[1], ascending=False)
        return scores[:top_k]

    def explain(self, user_id, movie_id):
        # Find why this movie was recommended
        movie_title = self.movies[self.movies['movieId'] == movie_id]['title'].values[0]
        movie_genres = set(ast.literal_eval(self.movies[self.movies['movieId'] == movie_id]['genres'].values[0]))
        
        user_history = self.train_ratings[self.train_ratings['userId'] == user_id].merge(self.movies, on='movieId')
        user_top = user_history.sort_values('rating', ascending=False).head(3)
        
        for _, row in user_top.iterrows():
            past_genres = set(ast.literal_eval(row['genres']))
            overlap = movie_genres.intersection(past_genres)
            if overlap:
                return f"Because you liked '{row['title']}', we recommend '{movie_title}' which shares the genres: {', '.join(list(overlap)[:2])}."
                
        return f"We recommend '{movie_title}' because it matches your personal movie preferences and popular trends."

if __name__ == "__main__":
    from cf_model import CFModelSVD
    train = pd.read_csv('data/processed/train_ratings.csv')
    test = pd.read_csv('data/processed/test_ratings.csv')
    movies = pd.read_csv('data/processed/movies_cleaned.csv')
    tags = pd.read_csv('data/processed/tags_cleaned.csv')
    
    cf = CFModelSVD()
    cf.load_model()
    
    hybrid = HybridRecommender(cf, train, movies, tags)
    
    user_id = 1
    recs = hybrid.recommend(user_id, top_k=5)
    print(f"Recommendations for user {user_id}:")
    for m_id, final, cf_s, cont_s in recs:
        title = movies[movies['movieId'] == m_id]['title'].values[0]
        explanation = hybrid.explain(user_id, m_id)
        print(f"- {title} (Score: {final:.2f})")
        print(f"  Explanation: {explanation}")
