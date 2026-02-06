import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error

def precision_at_k(actual, predicted, k=10):
    act_set = set(actual)
    pred_set = set(predicted[:k])
    if not pred_set: return 0
    return len(act_set & pred_set) / float(k)

def recall_at_k(actual, predicted, k=10):
    act_set = set(actual)
    pred_set = set(predicted[:k])
    if not act_set: return 0
    return len(act_set & pred_set) / float(len(act_set))

def ndcg_at_k(actual, predicted, k=10):
    act_set = set(actual)
    idcg = sum([1.0 / np.log2(i + 2) for i in range(min(len(act_set), k))])
    dcg = sum([1.0 / np.log2(i + 2) if predicted[i] in act_set else 0 for i in range(min(len(predicted), k))])
    return dcg / idcg if idcg > 0 else 0

def intra_list_diversity(movie_ids, hybrid_recommender):
    if len(movie_ids) < 2: return 0
    sims = []
    for i in range(len(movie_ids)):
        for j in range(i + 1, len(movie_ids)):
            sims.append(hybrid_recommender.get_content_similarity(movie_ids[i], movie_ids[j]))
    return 1 - np.mean(sims) # Diversity is 1 - average similarity

def catalog_coverage(all_recommended_ids, total_movies_count):
    unique_recs = set(all_recommended_ids)
    return len(unique_recs) / total_movies_count

if __name__ == "__main__":
    print("Metrics module implemented.")
