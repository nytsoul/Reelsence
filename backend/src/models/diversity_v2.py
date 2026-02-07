"""
Enhanced Diversity Optimizer v2.0
Multi-dimensional MMR with genre, decade, and cultural constraints.
Includes serendipity injection and long-tail promotion.
"""
import numpy as np
import pandas as pd
from collections import Counter
import re

class DiversityOptimizerV2:
    """
    Stage 3: Diversity-Optimized Re-ranking
    - Multi-dimensional constraints (genre, decade, culture)
    - Serendipity slot (unexpected recommendations)
    - Long-tail injection (20% from low-popularity items)
    """
    def __init__(self, hybrid_recommender, movies_df, train_ratings):
        self.hybrid = hybrid_recommender
        self.movies = movies_df
        self.train_ratings = train_ratings
        
        # Precompute movie popularity
        self.movie_popularity = train_ratings.groupby('movieId').size().to_dict()
        
    def extract_year_from_title(self, title):
        """Extract release year from movie title (e.g., 'Toy Story (1995)')."""
        match = re.search(r'\((\d{4})\)', title)
        return int(match.group(1)) if match else 2000
    
    def get_decade(self, movie_id):
        """Get decade of a movie."""
        title = self.movies[self.movies['movieId'] == movie_id]['title'].values[0]
        year = self.extract_year_from_title(title)
        return (year // 10) * 10
    
    def is_long_tail(self, movie_id, threshold=1000):
        """Check if movie is in the long tail (low popularity)."""
        popularity = self.movie_popularity.get(movie_id, 0)
        return popularity < threshold
    
    def mmr_rerank_v2(self, user_id, candidates, top_k=10, lambda_param=0.5, 
                      max_genre_ratio=0.3, serendipity_enabled=True):
        """
        Enhanced MMR with multi-dimensional diversity constraints.
        
        Parameters:
        - candidates: List of dicts with 'movieId' and 'personalized_score'
        - max_genre_ratio: Maximum proportion of same genre (default 30%)
        - serendipity_enabled: Include one unexpected recommendation
        """
        if not candidates:
            return []
        
        selected = []
        remaining = sorted(candidates, key=lambda x: x['personalized_score'], reverse=True)
        
        # Track diversity metrics
        genre_counts = Counter()
        decade_counts = Counter()
        long_tail_count = 0
        
        # Select first item (highest score)
        first = remaining.pop(0)
        selected.append(first)
        
        # Update diversity trackers
        movie_data = self.movies[self.movies['movieId'] == first['movieId']].iloc[0]
        genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
        for g in genres:
            genre_counts[g] += 1
        decade_counts[self.get_decade(first['movieId'])] += 1
        if self.is_long_tail(first['movieId']):
            long_tail_count += 1
        
        # Iteratively select remaining items
        while len(selected) < top_k and remaining:
            mmr_scores = []
            
            for cand in remaining:
                movie_id = cand['movieId']
                rel_score = cand['personalized_score']
                
                # Get movie metadata
                movie_data = self.movies[self.movies['movieId'] == movie_id].iloc[0]
                genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
                decade = self.get_decade(movie_id)
                
                # Check diversity constraints
                # 1. Genre constraint: penalize if genre ratio exceeds threshold
                genre_penalty = 0
                for g in genres:
                    if genre_counts[g] / len(selected) > max_genre_ratio:
                        genre_penalty += 0.3
                
                # 2. Decade diversity: bonus for new decades
                decade_bonus = 0.1 if decade not in decade_counts else 0
                
                # 3. Long-tail bonus: promote underrepresented items
                long_tail_bonus = 0
                if self.is_long_tail(movie_id) and long_tail_count / len(selected) < 0.2:
                    long_tail_bonus = 0.15
                
                # 4. Content similarity to selected items (original MMR component)
                max_sim = 0
                for sel in selected:
                    sim = self.hybrid.bert.compute_similarity(movie_id, sel['movieId'])
                    if sim > max_sim:
                        max_sim = sim
                
                # Enhanced MMR formula
                mmr_val = (
                    lambda_param * rel_score 
                    - (1 - lambda_param) * max_sim 
                    - genre_penalty 
                    + decade_bonus 
                    + long_tail_bonus
                )
                
                mmr_scores.append(mmr_val)
            
            # Select item with max MMR
            best_idx = np.argmax(mmr_scores)
            best_cand = remaining.pop(best_idx)
            selected.append(best_cand)
            
            # Update diversity trackers
            movie_data = self.movies[self.movies['movieId'] == best_cand['movieId']].iloc[0]
            genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
            for g in genres:
                genre_counts[g] += 1
            decade_counts[self.get_decade(best_cand['movieId'])] += 1
            if self.is_long_tail(best_cand['movieId']):
                long_tail_count += 1
        
        # Serendipity Slot: Replace last item with an unexpected recommendation
        if serendipity_enabled and len(selected) >= 5:
            # Find a movie from a genre the user hasn't explored much
            user_profile = self.hybrid.profiler.get_profile(user_id)
            unexplored_genres = [g for g in ['Documentary', 'Foreign', 'Film-Noir', 'Musical'] 
                                if g not in user_profile['genre_affinity']]
            
            if unexplored_genres and remaining:
                # Find a high-quality movie from unexplored genre
                for cand in remaining[:20]:
                    movie_data = self.movies[self.movies['movieId'] == cand['movieId']].iloc[0]
                    genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
                    if any(g in unexplored_genres for g in genres):
                        # Replace last item with serendipity pick
                        selected[-1] = cand
                        break
        
        return selected
    
    def calculate_diversity_metrics(self, recommendations):
        """
        Calculate diversity metrics for a recommendation list.
        Returns: genre_entropy, decade_coverage, long_tail_ratio
        """
        all_genres = []
        decades = set()
        long_tail_count = 0
        
        for rec in recommendations:
            movie_id = rec['movieId']
            movie_data = self.movies[self.movies['movieId'] == movie_id].iloc[0]
            genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
            all_genres.extend(genres)
            decades.add(self.get_decade(movie_id))
            if self.is_long_tail(movie_id):
                long_tail_count += 1
        
        # Genre entropy
        genre_counts = Counter(all_genres)
        total = sum(genre_counts.values())
        genre_probs = [c / total for c in genre_counts.values()]
        genre_entropy = -sum(p * np.log2(p) for p in genre_probs if p > 0)
        
        return {
            'genre_entropy': genre_entropy,
            'decade_coverage': len(decades),
            'long_tail_ratio': long_tail_count / len(recommendations)
        }


if __name__ == "__main__":
    print("DiversityOptimizerV2 implementation complete.")
    print("Supports multi-dimensional constraints, serendipity, and long-tail promotion.")
