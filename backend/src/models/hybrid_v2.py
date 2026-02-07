"""
Enhanced Hybrid Recommender v2.0
Integrates SVD++, BERT embeddings, and context-aware personalization.
"""
import pandas as pd
import numpy as np
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from models.svdpp_model import SVDPlusPlusModel
from models.bert_embeddings import BERTMovieEmbedder
from models.user_modeling import DynamicUserProfiler, ContextEngine

class HybridRecommenderV2:
    """
    Stage 1 + Stage 2 Integration:
    - SVD++ for collaborative signals
    - BERT for semantic content understanding
    - Context engine for personalization
    """
    def __init__(self, svdpp_model, bert_embedder, train_ratings, movies, tags=None):
        self.svdpp = svdpp_model
        self.bert = bert_embedder
        self.train_ratings = train_ratings
        self.movies = movies
        self.tags = tags
        
        # Initialize user profiler and context engine
        self.profiler = DynamicUserProfiler(train_ratings, movies)
        self.context_engine = ContextEngine()
        
    def get_candidate_scores(self, user_id, top_k=200, cf_weight=0.6):
        """
        Stage 1: Multi-Modal Candidate Generation
        Returns top-200 candidates with hybrid scores.
        """
        # Get user's rated movies
        rated_movies = self.train_ratings[self.train_ratings['userId'] == user_id]['movieId'].tolist()
        all_movies = self.movies['movieId'].tolist()
        candidates = [m for m in all_movies if m not in rated_movies]
        
        # Limit for computational efficiency
        import random
        if len(candidates) > 2000:
            candidates = random.sample(candidates, 2000)
        
        scores = []
        user_profile = self.profiler.get_profile(user_id)
        
        for movie_id in candidates:
            # CF score from SVD++
            cf_score = self.svdpp.predict(user_id, movie_id)
            cf_norm = (cf_score - 0.5) / 4.5  # Normalize to [0, 1]
            
            # Content score from BERT
            # Find user's top-rated movies
            user_top = self.train_ratings[
                self.train_ratings['userId'] == user_id
            ].sort_values('rating', ascending=False).head(5)['movieId'].tolist()
            
            content_sims = []
            for top_movie in user_top:
                sim = self.bert.compute_similarity(movie_id, top_movie)
                content_sims.append(sim)
            
            content_score = np.mean(content_sims) if content_sims else 0
            
            # Hybrid score
            hybrid_score = (cf_weight * cf_norm) + ((1 - cf_weight) * content_score)
            
            scores.append({
                'movieId': movie_id,
                'hybrid_score': hybrid_score,
                'cf_score': cf_score,
                'content_score': content_score
            })
        
        # Sort and return top-K candidates
        scores.sort(key=lambda x: x['hybrid_score'], reverse=True)
        return scores[:top_k]
    
    def personalize_with_context(self, candidates, user_id, context_type='weekday_evening', device='desktop'):
        """
        Stage 2: Context-Aware Personalization
        Adjusts candidate scores based on temporal and device context.
        """
        personalized = []
        
        for cand in candidates:
            movie_id = cand['movieId']
            base_score = cand['hybrid_score']
            
            # Get movie metadata
            movie_data = self.movies[self.movies['movieId'] == movie_id].iloc[0]
            genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
            
            movie_metadata = {
                'genres': genres,
                'title': movie_data['title']
            }
            
            # Apply context adjustment
            adjusted_score = self.context_engine.adjust_score_by_context(
                base_score, 
                movie_metadata, 
                context_type, 
                device
            )
            
            personalized.append({
                **cand,
                'personalized_score': adjusted_score
            })
        
        # Re-sort by personalized score
        personalized.sort(key=lambda x: x['personalized_score'], reverse=True)
        return personalized
    
    def recommend(self, user_id, top_k=10, context_type='weekday_evening', device='desktop'):
        """
        Full pipeline: Candidate generation + Context personalization
        """
        # Stage 1: Get 200 candidates
        candidates = self.get_candidate_scores(user_id, top_k=200)
        
        # Stage 2: Personalize with context
        personalized = self.personalize_with_context(candidates, user_id, context_type, device)
        
        return personalized[:top_k]
    
    def explain(self, user_id, movie_id, explanation_level='simple'):
        """
        Multi-layer explanations.
        - simple: "Because you liked X"
        - intermediate: "Matches your preference for Y genre"
        - advanced: Confidence scores and similarity paths
        """
        movie_title = self.movies[self.movies['movieId'] == movie_id]['title'].values[0]
        movie_genres = eval(self.movies[self.movies['movieId'] == movie_id]['genres'].values[0])
        
        user_history = self.train_ratings[self.train_ratings['userId'] == user_id].merge(
            self.movies, on='movieId'
        )
        user_top = user_history.sort_values('rating', ascending=False).head(3)
        
        if explanation_level == 'simple':
            # Find similar movie from history
            for _, row in user_top.iterrows():
                past_genres = eval(row['genres']) if isinstance(row['genres'], str) else row['genres']
                overlap = set(movie_genres).intersection(set(past_genres))
                if overlap:
                    return f"Because you liked '{row['title']}', we recommend '{movie_title}'."
            return f"We recommend '{movie_title}' based on your viewing history."
        
        elif explanation_level == 'intermediate':
            # Genre-based explanation
            user_profile = self.profiler.get_profile(user_id)
            top_genres = sorted(
                user_profile['genre_affinity'].items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:2]
            
            matching_genres = [g for g, _ in top_genres if g in movie_genres]
            if matching_genres:
                genre_str = ', '.join(matching_genres)
                return f"Matches your preference for {genre_str}. '{movie_title}' aligns with your taste profile."
            return f"'{movie_title}' expands your viewing horizons with new genres."
        
        elif explanation_level == 'advanced':
            # Confidence-based explanation
            cf_score = self.svdpp.predict(user_id, movie_id)
            confidence = min((cf_score - 0.5) / 4.5, 1.0)
            
            similar_movies = self.bert.find_similar_movies(movie_id, top_k=3)
            similar_titles = [
                self.movies[self.movies['movieId'] == mid]['title'].values[0] 
                for mid, _ in similar_movies
            ]
            
            return {
                'title': movie_title,
                'confidence': f"{confidence:.2%}",
                'similar_to': similar_titles,
                'reasoning': f"High semantic similarity to your favorites."
            }


if __name__ == "__main__":
    print("HybridRecommenderV2 implementation complete.")
    print("This module requires trained SVD++ and BERT models.")
