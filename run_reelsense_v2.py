"""
Complete Training and Evaluation Pipeline for ReelSense++ v2.0
Trains all models and runs comprehensive evaluation.
"""
import pandas as pd
import numpy as np
import sys
import os

sys.path.append('src')

from models.bert_embeddings import BERTMovieEmbedder
from models.svdpp_model import SVDPlusPlusModel
from reelsense_v2 import ReelSensePlusPlus

def main():
    print("=" * 80)
    print("ReelSense++ v2.0: Complete Training and Evaluation Pipeline")
    print("=" * 80)
    
    # Load data
    print("\n[1/6] Loading data...")
    train = pd.read_csv('data/processed/train_ratings.csv')
    test = pd.read_csv('data/processed/test_ratings.csv')
    movies = pd.read_csv('data/processed/movies_cleaned.csv')
    tags = pd.read_csv('data/processed/tags_cleaned.csv')
    print(f"  ✓ Train: {len(train)} ratings, Test: {len(test)} ratings")
    print(f"  ✓ Movies: {len(movies)}, Tags: {len(tags)}")
    
    # Train BERT embeddings
    print("\n[2/6] Training BERT embeddings...")
    bert_path = 'data/processed/bert_embeddings.pkl'
    if os.path.exists(bert_path):
        print("  ⚡ Loading pre-computed embeddings...")
        bert = BERTMovieEmbedder()
        bert.load(bert_path)
    else:
        print("  🧠 Generating BERT embeddings (this may take a few minutes)...")
        bert = BERTMovieEmbedder()
        bert.fit(movies)
        bert.save(bert_path)
    print("  ✓ BERT embeddings ready")
    
    # Train SVD++
    print("\n[3/6] Training SVD++ model...")
    svdpp_path = 'src/models/svdpp_model.pkl'
    if os.path.exists(svdpp_path):
        print("  ⚡ Loading pre-trained model...")
        svdpp = SVDPlusPlusModel()
        svdpp.load_model(svdpp_path)
    else:
        print("  🎯 Training SVD++ (this may take several minutes)...")
        svdpp = SVDPlusPlusModel(n_factors=100, n_epochs=10)  # Reduced epochs for speed
        svdpp.fit(train)
        svdpp.save_model(svdpp_path)
    print("  ✓ SVD++ model ready")
    
    # Initialize ReelSense++ v2.0
    print("\n[4/6] Initializing ReelSense++ v2.0 system...")
    reelsense = ReelSensePlusPlus(svdpp, bert, train, movies, tags)
    print("  ✓ Four-stage pipeline initialized")
    
    # Run evaluation on sample users
    print("\n[5/6] Running comprehensive evaluation...")
    test_users = test['userId'].unique()[:30]  # Evaluate on 30 users
    
    all_metrics = []
    
    for i, user_id in enumerate(test_users):
        print(f"  Evaluating user {user_id} ({i+1}/{len(test_users)})...", end='\r')
        
        try:
            # Generate recommendations with full pipeline
            recommendations = reelsense.recommend(
                user_id,
                top_k=10,
                context_type='weekend',
                device='desktop',
                enable_diversity=True,
                enable_serendipity=True
            )
            
            # Evaluate
            metrics = reelsense.evaluate(user_id, recommendations, test)
            all_metrics.append(metrics)
            
        except Exception as e:
            print(f"\n  ⚠ Error for user {user_id}: {e}")
            continue
    
    print("\n  ✓ Evaluation complete")
    
    # Aggregate results
    print("\n[6/6] Aggregating results...")
    
    if all_metrics:
        avg_metrics = {
            key: np.mean([m[key] for m in all_metrics if key in m])
            for key in all_metrics[0].keys()
        }
        
        print("\n" + "=" * 80)
        print("REELSENSE++ v2.0 FINAL RESULTS")
        print("=" * 80)
        
        print("\n📊 ACCURACY METRICS:")
        print(f"  Precision@10:  {avg_metrics['precision@10']:.4f}")
        print(f"  Recall@10:     {avg_metrics['recall@10']:.4f}")
        print(f"  NDCG@10:       {avg_metrics['ndcg@10']:.4f}")
        print(f"  MAP@10:        {avg_metrics['map@10']:.4f}")
        
        print("\n🎨 DIVERSITY METRICS:")
        print(f"  Intra-List Diversity: {avg_metrics['intra_list_diversity']:.4f}")
        print(f"  Genre Entropy:        {avg_metrics['genre_entropy']:.4f}")
        print(f"  Decade Coverage:      {avg_metrics['decade_coverage']:.2f}")
        
        print("\n🌟 NOVELTY METRICS:")
        print(f"  Avg Popularity Rank:  {avg_metrics['avg_popularity_rank']:.1f}")
        print(f"  Long-tail %:          {avg_metrics['long_tail_percentage']:.2%}")
        
        print("\n💡 HUMAN-CENTRIC METRICS:")
        print(f"  Discovery Joy:        {avg_metrics['discovery_joy']:.2%}")
        print(f"  Decision Load:        {avg_metrics['decision_load']:.2f}")
        
        print("\n" + "=" * 80)
        
        # Save results
        os.makedirs('reports', exist_ok=True)
        with open('reports/reelsense_v2_results.txt', 'w') as f:
            f.write("ReelSense++ v2.0 Evaluation Results\n")
            f.write("=" * 80 + "\n\n")
            f.write(f"Evaluated on {len(all_metrics)} users\n\n")
            for key, value in avg_metrics.items():
                f.write(f"{key}: {value:.4f}\n")
        
        print("\n✅ Results saved to reports/reelsense_v2_results.txt")
        
        # Generate sample recommendations with explanations
        print("\n" + "=" * 80)
        print("SAMPLE RECOMMENDATIONS WITH EXPLANATIONS")
        print("=" * 80)
        
        sample_user = test_users[0]
        sample_recs = reelsense.recommend(sample_user, top_k=5, enable_serendipity=True)
        
        print(f"\nRecommendations for User {sample_user}:\n")
        for i, rec in enumerate(sample_recs, 1):
            movie_title = movies[movies['movieId'] == rec['movieId']]['title'].values[0]
            confidence = rec['trust_metrics']['confidence']
            simple_exp = rec['explanations']['simple']
            why_not = rec['trust_metrics']['why_not']
            
            print(f"{i}. {movie_title}")
            print(f"   Confidence: {confidence:.1%}")
            print(f"   Explanation: {simple_exp}")
            if why_not:
                print(f"   ⚠ Why NOT: {why_not}")
            print()
        
        print("=" * 80)
        
    else:
        print("⚠ No metrics collected. Check for errors above.")

if __name__ == "__main__":
    main()
