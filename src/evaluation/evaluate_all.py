import pandas as pd
import numpy as np
import os
import sys

# Add src to path
sys.path.append('src')
from models.cf_model import CFModelSVD
from models.hybrid_model import HybridRecommender
from models.diversity_optim import DiversityOptimizer
from evaluation.metrics import precision_at_k, recall_at_k, ndcg_at_k, intra_list_diversity, catalog_coverage

def main():
    print("Starting Final Evaluation...")
    
    # Load data
    train = pd.read_csv('data/processed/train_ratings.csv')
    test = pd.read_csv('data/processed/test_ratings.csv')
    movies = pd.read_csv('data/processed/movies_cleaned.csv')
    tags = pd.read_csv('data/processed/tags_cleaned.csv')
    
    # Load CF Model
    cf = CFModelSVD()
    cf.load_model()
    
    # Init Hybrid & Diversity
    hybrid = HybridRecommender(cf, train, movies, tags)
    div_opt = DiversityOptimizer(hybrid)
    
    # Evaluate on a subset of users for speed
    test_users = test['userId'].unique()[:50]
    
    metrics = {
        'Precision@10': [],
        'Recall@10': [],
        'NDCG@10': [],
        'Diversity': [],
        'Diversity_MMR': []
    }
    
    all_recs = []
    
    for user_id in test_users:
        actual = test[test['userId'] == user_id]['movieId'].tolist()
        
        # 1. Standard Hybrid Recs
        hybrid_recs_raw = hybrid.recommend(user_id, top_k=10)
        hybrid_ids = [r[0] for r in hybrid_recs_raw]
        all_recs.extend(hybrid_ids)
        
        # 2. MMR Reranked Recs
        mmr_recs_raw = div_opt.mmr_rerank(user_id, hybrid_recs_raw, top_k=10, lambda_param=0.5)
        mmr_ids = [r[0] for r in mmr_recs_raw]
        
        # Metrics
        metrics['Precision@10'].append(precision_at_k(actual, hybrid_ids, k=10))
        metrics['Recall@10'].append(recall_at_k(actual, hybrid_ids, k=10))
        metrics['NDCG@10'].append(ndcg_at_k(actual, hybrid_ids, k=10))
        metrics['Diversity'].append(intra_list_diversity(hybrid_ids, hybrid))
        metrics['Diversity_MMR'].append(intra_list_diversity(mmr_ids, hybrid))
        
    # Results
    print("\n--- Final Results (Sample of 50 users) ---")
    for m, vals in metrics.items():
        print(f"{m}: {np.mean(vals):.4f}")
        
    coverage = catalog_coverage(all_recs, len(movies))
    print(f"Catalog Coverage: {coverage:.4f}")
    
    # Write summary report
    with open('reports/final_metrics.txt', 'w') as f:
        f.write("ReelSense Final Metrics Output\n")
        f.write("==============================\n")
        for m, vals in metrics.items():
            f.write(f"{m}: {np.mean(vals):.4f}\n")
        f.write(f"Catalog Coverage: {coverage:.4f}\n")

if __name__ == "__main__":
    main()
