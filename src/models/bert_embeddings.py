"""
BERT-based semantic embeddings for movies using Sentence Transformers.
Replaces TF-IDF with deep semantic understanding.
"""
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
import pickle
import os
import ast

class BERTMovieEmbedder:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        """
        Initialize BERT embedder with a lightweight sentence transformer.
        all-MiniLM-L6-v2: 384-dim embeddings, fast inference
        """
        print(f"Loading BERT model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        self.movie_embeddings = None
        self.movie_ids = None
        
    def prepare_movie_text(self, movies_df):
        """
        Create rich text representation from movie metadata.
        Combines: title + genres + (optionally tags)
        """
        def parse_genres(x):
            try:
                return ast.literal_eval(x)
            except:
                if isinstance(x, str):
                    return x.split('|')
                return x
        
        movies_df['genres_list'] = movies_df['genres'].apply(parse_genres)
        
        # Create semantic text: "Title. Genres: genre1, genre2, genre3"
        movies_df['semantic_text'] = movies_df.apply(
            lambda row: f"{row['title']}. Genres: {', '.join(row['genres_list'])}", 
            axis=1
        )
        return movies_df
    
    def fit(self, movies_df):
        """
        Generate BERT embeddings for all movies.
        """
        movies_df = self.prepare_movie_text(movies_df)
        
        print(f"Generating BERT embeddings for {len(movies_df)} movies...")
        self.movie_embeddings = self.model.encode(
            movies_df['semantic_text'].tolist(),
            show_progress_bar=True,
            batch_size=32
        )
        self.movie_ids = movies_df['movieId'].values
        
        print(f"Embeddings shape: {self.movie_embeddings.shape}")
        
    def get_embedding(self, movie_id):
        """Get embedding for a specific movie."""
        if movie_id not in self.movie_ids:
            return None
        idx = np.where(self.movie_ids == movie_id)[0][0]
        return self.movie_embeddings[idx]
    
    def compute_similarity(self, movie_id1, movie_id2):
        """Compute cosine similarity between two movies."""
        emb1 = self.get_embedding(movie_id1)
        emb2 = self.get_embedding(movie_id2)
        
        if emb1 is None or emb2 is None:
            return 0.0
        
        # Cosine similarity
        return np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
    
    def find_similar_movies(self, movie_id, top_k=10):
        """Find most similar movies based on BERT embeddings."""
        emb = self.get_embedding(movie_id)
        if emb is None:
            return []
        
        # Compute similarities with all movies
        similarities = np.dot(self.movie_embeddings, emb) / (
            np.linalg.norm(self.movie_embeddings, axis=1) * np.linalg.norm(emb)
        )
        
        # Get top-k (excluding self)
        top_indices = np.argsort(similarities)[::-1][1:top_k+1]
        return [(self.movie_ids[i], similarities[i]) for i in top_indices]
    
    def save(self, path='data/processed/bert_embeddings.pkl'):
        """Save embeddings to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump({
                'embeddings': self.movie_embeddings,
                'movie_ids': self.movie_ids
            }, f)
        print(f"Embeddings saved to {path}")
    
    def load(self, path='data/processed/bert_embeddings.pkl'):
        """Load pre-computed embeddings."""
        with open(path, 'rb') as f:
            data = pickle.load(f)
            self.movie_embeddings = data['embeddings']
            self.movie_ids = data['movie_ids']
        print(f"Embeddings loaded from {path}")

if __name__ == "__main__":
    # Generate and save embeddings
    movies = pd.read_csv('data/processed/movies_cleaned.csv')
    
    embedder = BERTMovieEmbedder()
    embedder.fit(movies)
    embedder.save()
    
    # Test similarity
    test_movie_id = movies.iloc[0]['movieId']
    similar = embedder.find_similar_movies(test_movie_id, top_k=5)
    print(f"\nMovies similar to {movies[movies['movieId']==test_movie_id]['title'].values[0]}:")
    for mid, score in similar:
        title = movies[movies['movieId']==mid]['title'].values[0]
        print(f"  - {title} (similarity: {score:.3f})")
