"""
Complete ReelSense++ v2.0 Pipeline
Integrates all four stages: Candidate Generation, Context Personalization, 
Diversity Optimization, and Explainability.
"""
import pandas as pd
import numpy as np
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from models.svdpp_model import SVDPlusPlusModel
from models.bert_embeddings import BERTMovieEmbedder
from models.hybrid_v2 import HybridRecommenderV2
from models.diversity_v2 import DiversityOptimizerV2
from evaluation.metrics_v2 import evaluate_recommendations_v2

class ReelSensePlusPlus:
    """
    Complete ReelSense++ v2.0 System
    Four-stage intelligent pipeline for ethical, explainable recommendations.
    """
    def __init__(self, svdpp_model, bert_embedder, train_ratings, movies, tags=None):
        # Core components
        self.hybrid = HybridRecommenderV2(svdpp_model, bert_embedder, train_ratings, movies, tags)
        self.diversity_optimizer = DiversityOptimizerV2(self.hybrid, movies, train_ratings)
        
        # Data references
        self.movies = movies
        self.train_ratings = train_ratings
        
        # Popularity for novelty metrics
        self.popularity_dict = train_ratings.groupby('movieId').size().to_dict()
    
    def recommend(self, user_id, top_k=10, context_type='weekday_evening', 
                  device='desktop', enable_diversity=True, enable_serendipity=True):
        """
        Full four-stage recommendation pipeline.
        
        Returns: List of recommendations with explanations and trust metrics.
        """
        # Stage 1 + 2: Hybrid recommendation with context
        candidates = self.hybrid.recommend(
            user_id, 
            top_k=200,  # Generate 200 candidates
            context_type=context_type, 
            device=device
        )
        
        # Stage 3: Diversity optimization
        if enable_diversity:
            final_recs = self.diversity_optimizer.mmr_rerank_v2(
                user_id,
                candidates,
                top_k=top_k,
                serendipity_enabled=enable_serendipity
            )
        else:
            final_recs = candidates[:top_k]
        
        # Stage 4: Add explanations and trust metrics
        enriched_recs = []
        for rec in final_recs:
            movie_id = rec['movieId']
            
            # Multi-layer explanation
            simple_exp = self.hybrid.explain(user_id, movie_id, 'simple')
            intermediate_exp = self.hybrid.explain(user_id, movie_id, 'intermediate')
            advanced_exp = self.hybrid.explain(user_id, movie_id, 'advanced')
            
            # Trust metrics
            cf_score = rec['cf_score']
            confidence = min((cf_score - 0.5) / 4.5, 1.0)
            
            # "Why you might NOT like this" (for controversial picks)
            why_not = self._generate_why_not(movie_id, user_id)
            
            enriched_recs.append({
                **rec,
                'explanations': {
                    'simple': simple_exp,
                    'intermediate': intermediate_exp,
                    'advanced': advanced_exp
                },
                'trust_metrics': {
                    'confidence': confidence,
                    'why_not': why_not
                }
            })
        
        return enriched_recs
    
    def _generate_why_not(self, movie_id, user_id):
        """
        Generate "Why you might NOT like this" disclaimer.
        Based on genre mismatch or low user affinity.
        """
        movie_data = self.movies[self.movies['movieId'] == movie_id].iloc[0]
        genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
        
        user_profile = self.hybrid.profiler.get_profile(user_id)
        
        # Check for low-affinity genres
        low_affinity_genres = [
            g for g in genres 
            if g in user_profile['genre_affinity'] and user_profile['genre_affinity'][g] < 3.0
        ]
        
        if low_affinity_genres:
            return f"Contains {', '.join(low_affinity_genres[:2])} which you've rated lower in the past."
        
        # Check for unexplored genres
        unexplored = [g for g in genres if g not in user_profile['genre_affinity']]
        if unexplored:
            return f"This is a {unexplored[0]} film, a genre you haven't explored much."
        
        return None
    
    def evaluate(self, user_id, recommendations, test_ratings):
        """
        Comprehensive evaluation of recommendations.
        """
        actual_items = test_ratings[test_ratings['userId'] == user_id]['movieId'].tolist()
        user_profile = self.hybrid.profiler.get_profile(user_id)
        
        metrics = evaluate_recommendations_v2(
            user_id,
            recommendations,
            actual_items,
            self.hybrid.bert,
            self.movies,
            user_profile,
            self.popularity_dict
        )
        
        # Add diversity metrics from optimizer
        diversity_metrics = self.diversity_optimizer.calculate_diversity_metrics(recommendations)
        metrics.update(diversity_metrics)
        
        return metrics


if __name__ == "__main__":
    print("ReelSense++ v2.0 Complete Pipeline Implementation")
    print("Four-stage system: Candidate Generation → Context Personalization → Diversity → Explainability")
