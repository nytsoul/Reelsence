"""
Enhanced Evaluation Metrics v2.0
Includes human-centric metrics: Discovery Joy, Trust Score, Decision Load
"""
import pandas as pd
import numpy as np
from collections import Counter
from sklearn.metrics import mean_squared_error, mean_absolute_error

# ===== Traditional Ranking Metrics =====

def precision_at_k(actual, predicted, k=10):
    """Precision@K: Proportion of relevant items in top-K."""
    act_set = set(actual)
    pred_set = set(predicted[:k])
    if not pred_set:
        return 0
    return len(act_set & pred_set) / float(k)

def recall_at_k(actual, predicted, k=10):
    """Recall@K: Proportion of relevant items retrieved."""
    act_set = set(actual)
    pred_set = set(predicted[:k])
    if not act_set:
        return 0
    return len(act_set & pred_set) / float(len(act_set))

def ndcg_at_k(actual, predicted, k=10):
    """Normalized Discounted Cumulative Gain."""
    act_set = set(actual)
    idcg = sum([1.0 / np.log2(i + 2) for i in range(min(len(act_set), k))])
    dcg = sum([1.0 / np.log2(i + 2) if predicted[i] in act_set else 0 
               for i in range(min(len(predicted), k))])
    return dcg / idcg if idcg > 0 else 0

def map_at_k(actual, predicted, k=10):
    """Mean Average Precision."""
    act_set = set(actual)
    score = 0.0
    num_hits = 0.0
    
    for i, p in enumerate(predicted[:k]):
        if p in act_set:
            num_hits += 1.0
            score += num_hits / (i + 1.0)
    
    return score / min(len(act_set), k) if act_set else 0

# ===== Diversity Metrics =====

def intra_list_diversity(movie_ids, bert_embedder):
    """
    Average pairwise dissimilarity in recommendation list.
    Higher = more diverse.
    """
    if len(movie_ids) < 2:
        return 0
    
    sims = []
    for i in range(len(movie_ids)):
        for j in range(i + 1, len(movie_ids)):
            sim = bert_embedder.compute_similarity(movie_ids[i], movie_ids[j])
            sims.append(sim)
    
    return 1 - np.mean(sims)  # Diversity = 1 - similarity

def catalog_coverage(all_recommended_ids, total_movies_count):
    """Percentage of catalog covered by recommendations."""
    unique_recs = set(all_recommended_ids)
    return len(unique_recs) / total_movies_count

def genre_entropy(recommendations, movies_df):
    """
    Shannon entropy of genre distribution.
    Higher = more diverse genres.
    """
    all_genres = []
    for rec in recommendations:
        movie_id = rec['movieId']
        movie_data = movies_df[movies_df['movieId'] == movie_id].iloc[0]
        genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
        all_genres.extend(genres)
    
    genre_counts = Counter(all_genres)
    total = sum(genre_counts.values())
    probs = [c / total for c in genre_counts.values()]
    
    return -sum(p * np.log2(p) for p in probs if p > 0)

# ===== Novelty Metrics =====

def average_popularity_rank(recommendations, popularity_dict):
    """
    Average popularity rank of recommended items.
    Higher rank = more novel (less popular).
    """
    # Create popularity ranking
    sorted_items = sorted(popularity_dict.items(), key=lambda x: x[1], reverse=True)
    rank_dict = {item: rank for rank, (item, _) in enumerate(sorted_items, 1)}
    
    ranks = [rank_dict.get(rec['movieId'], len(rank_dict)) for rec in recommendations]
    return np.mean(ranks)

def long_tail_percentage(recommendations, popularity_dict, threshold=1000):
    """Percentage of recommendations from the long tail."""
    long_tail_count = sum(1 for rec in recommendations 
                         if popularity_dict.get(rec['movieId'], 0) < threshold)
    return long_tail_count / len(recommendations) if recommendations else 0

# ===== Human-Centric Metrics (NEW in v2.0) =====

def discovery_joy_score(recommendations, user_profile, movies_df):
    """
    Measures how many recommendations are from genres the user hasn't explored.
    Proxy for "discovery joy" - finding new content.
    """
    explored_genres = set(user_profile['genre_affinity'].keys())
    new_genre_count = 0
    
    for rec in recommendations:
        movie_id = rec['movieId']
        movie_data = movies_df[movies_df['movieId'] == movie_id].iloc[0]
        genres = eval(movie_data['genres']) if isinstance(movie_data['genres'], str) else movie_data['genres']
        
        if any(g not in explored_genres for g in genres):
            new_genre_count += 1
    
    return new_genre_count / len(recommendations) if recommendations else 0

def trust_score_proxy(recommendations, confidence_threshold=0.7):
    """
    Percentage of recommendations with high confidence scores.
    Proxy for user trust in the system.
    """
    high_confidence = sum(1 for rec in recommendations 
                         if rec.get('confidence', 0) >= confidence_threshold)
    return high_confidence / len(recommendations) if recommendations else 0

def decision_load_reduction(num_recommendations=10):
    """
    Inverse of recommendation list size.
    Smaller lists = less decision fatigue.
    Normalized score where 10 items = 1.0, 20 items = 0.5, etc.
    """
    return 10.0 / num_recommendations

# ===== Comprehensive Evaluation Function =====

def evaluate_recommendations_v2(user_id, recommendations, actual_items, 
                                bert_embedder, movies_df, user_profile, 
                                popularity_dict):
    """
    Comprehensive evaluation combining traditional and human-centric metrics.
    """
    rec_ids = [r['movieId'] for r in recommendations]
    
    metrics = {
        # Accuracy
        'precision@10': precision_at_k(actual_items, rec_ids, k=10),
        'recall@10': recall_at_k(actual_items, rec_ids, k=10),
        'ndcg@10': ndcg_at_k(actual_items, rec_ids, k=10),
        'map@10': map_at_k(actual_items, rec_ids, k=10),
        
        # Diversity
        'intra_list_diversity': intra_list_diversity(rec_ids, bert_embedder),
        'genre_entropy': genre_entropy(recommendations, movies_df),
        
        # Novelty
        'avg_popularity_rank': average_popularity_rank(recommendations, popularity_dict),
        'long_tail_percentage': long_tail_percentage(recommendations, popularity_dict),
        
        # Human-Centric (NEW)
        'discovery_joy': discovery_joy_score(recommendations, user_profile, movies_df),
        'decision_load': decision_load_reduction(len(recommendations))
    }
    
    return metrics


if __name__ == "__main__":
    print("Enhanced Evaluation Metrics v2.0 implemented.")
    print("Includes human-centric metrics: Discovery Joy, Trust Score, Decision Load.")
