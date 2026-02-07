"""
ReelSense++ v2.0 - Full System Evaluation
Evaluates CF, Content-Based, and Hybrid models on multiple metrics.
"""
import pandas as pd
import numpy as np
import os
import sys
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from src.models.cf_model import CFModelSVD
from src.models.hybrid_model import HybridRecommender, ContentBasedModel, load_hybrid_system
from src.models.diversity_optim import DiversityOptimizer
from src.evaluation.metrics import precision_at_k, recall_at_k, ndcg_at_k, intra_list_diversity, catalog_coverage


def evaluate_cf_rmse(cf_model, test_df):
    """Evaluate CF model with RMSE and MAE."""
    rmse, mae, preds = cf_model.evaluate(test_df)
    return rmse, mae


def evaluate_recommendations(hybrid, div_opt, test_df, movies_df, n_users=50, top_k=10):
    """Evaluate recommendation quality across multiple users."""
    test_users = test_df['userId'].unique()
    if len(test_users) > n_users:
        np.random.seed(42)
        test_users = np.random.choice(test_users, n_users, replace=False)

    metrics = {
        'Precision@10': [],
        'Recall@10': [],
        'NDCG@10': [],
        'Diversity': [],
        'Diversity_MMR': [],
    }

    all_recs = []
    all_mmr_recs = []

    print(f"  Evaluating on {len(test_users)} users...")
    start = time.time()

    for i, user_id in enumerate(test_users):
        actual = test_df[test_df['userId'] == user_id]['movieId'].tolist()

        # Hybrid recommendations
        hybrid_recs_raw = hybrid.recommend(user_id, top_k=top_k)
        hybrid_ids = [r[0] for r in hybrid_recs_raw]
        all_recs.extend(hybrid_ids)

        # MMR diversity-optimized recommendations
        mmr_recs_raw = div_opt.mmr_rerank(user_id, hybrid_recs_raw, top_k=top_k, lambda_param=0.5)
        mmr_ids = [r[0] for r in mmr_recs_raw]
        all_mmr_recs.extend(mmr_ids)

        # Compute metrics
        metrics['Precision@10'].append(precision_at_k(actual, hybrid_ids, k=top_k))
        metrics['Recall@10'].append(recall_at_k(actual, hybrid_ids, k=top_k))
        metrics['NDCG@10'].append(ndcg_at_k(actual, hybrid_ids, k=top_k))
        metrics['Diversity'].append(intra_list_diversity(hybrid_ids, hybrid))
        metrics['Diversity_MMR'].append(intra_list_diversity(mmr_ids, hybrid))

        if (i + 1) % 10 == 0:
            print(f"    Processed {i+1}/{len(test_users)} users...")

    elapsed = time.time() - start
    print(f"  Evaluation completed in {elapsed:.1f}s")

    # Compute coverage
    coverage_hybrid = catalog_coverage(all_recs, len(movies_df))
    coverage_mmr = catalog_coverage(all_mmr_recs, len(movies_df))

    return metrics, coverage_hybrid, coverage_mmr


def main():
    print("=" * 60)
    print("ReelSense++ v2.0 - Full System Evaluation")
    print("=" * 60)

    # Load data
    print("\n[1] Loading data...")
    train_df = pd.read_csv('data/processed/train_ratings.csv')
    test_df = pd.read_csv('data/processed/test_ratings.csv')
    movies_df = pd.read_csv('data/processed/movies_cleaned.csv')
    print(f"  Train: {len(train_df):,} | Test: {len(test_df):,} | Movies: {len(movies_df):,}")

    # Load hybrid system
    print("\n[2] Loading trained models...")
    hybrid, _, _ = load_hybrid_system()

    # Evaluate CF RMSE
    print("\n[3] Evaluating CF Model (RMSE/MAE)...")
    rmse, mae = evaluate_cf_rmse(hybrid.cf_model, test_df)

    # Evaluate recommendations
    print("\n[4] Evaluating Recommendation Quality...")
    div_opt = DiversityOptimizer(hybrid)
    metrics, coverage_hybrid, coverage_mmr = evaluate_recommendations(
        hybrid, div_opt, test_df, movies_df, n_users=50, top_k=10
    )

    # Print results
    print("\n" + "=" * 60)
    print("📊 FINAL EVALUATION RESULTS")
    print("=" * 60)

    print(f"\n  Rating Prediction:")
    print(f"    RMSE:              {rmse:.4f}")
    print(f"    MAE:               {mae:.4f}")

    print(f"\n  Recommendation Quality (avg over 50 users):")
    for metric_name, values in metrics.items():
        mean_val = np.mean(values)
        std_val = np.std(values)
        print(f"    {metric_name:<20} {mean_val:.4f}  (±{std_val:.4f})")

    print(f"\n  Coverage:")
    print(f"    Hybrid:            {coverage_hybrid:.4f} ({int(coverage_hybrid * len(movies_df))} unique movies)")
    print(f"    MMR (diverse):     {coverage_mmr:.4f} ({int(coverage_mmr * len(movies_df))} unique movies)")

    print("\n" + "=" * 60)

    # Save report
    os.makedirs('reports', exist_ok=True)
    report_path = 'reports/final_metrics.txt'
    with open(report_path, 'w') as f:
        f.write("ReelSense++ v2.0 - Final Evaluation Report\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Dataset: MovieLens Latest Small (100k ratings)\n")
        f.write(f"Train: {len(train_df):,} | Test: {len(test_df):,}\n")
        f.write(f"Users: {train_df['userId'].nunique()} | Movies: {len(movies_df):,}\n\n")

        f.write("Rating Prediction\n")
        f.write(f"  RMSE: {rmse:.4f}\n")
        f.write(f"  MAE:  {mae:.4f}\n\n")

        f.write("Recommendation Quality (50 users, top-10)\n")
        for metric_name, values in metrics.items():
            f.write(f"  {metric_name}: {np.mean(values):.4f} (±{np.std(values):.4f})\n")

        f.write(f"\nCatalog Coverage\n")
        f.write(f"  Hybrid: {coverage_hybrid:.4f}\n")
        f.write(f"  MMR:    {coverage_mmr:.4f}\n")

    print(f"  Report saved to {report_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
