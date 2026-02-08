#!/usr/bin/env python3
"""
Test script to verify the recommendation system is working
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

print("Testing ReelSense++ Recommendation System")
print("="*50)

try:
    # Test imports
    print("1. Testing imports...")
    from config import PROCESSED_DATA_DIR, MODEL_DIR
    print(f"   ✅ Configuration loaded")
    print(f"   📁 Data dir: {PROCESSED_DATA_DIR}")
    print(f"   🧠 Model dir: {MODEL_DIR}")
    
    # Test data loading
    print("\n2. Testing data loading...")
    import pandas as pd
    from config import get_processed_file_path
    
    movies_df = pd.read_csv(get_processed_file_path('movies_cleaned.csv'))
    train_df = pd.read_csv(get_processed_file_path('train_ratings.csv'))
    print(f"   ✅ Loaded {len(movies_df):,} movies")
    print(f"   ✅ Loaded {len(train_df):,} ratings")
    
    # Test model loading
    print("\n3. Testing model loading...")
    from src.models.hybrid_model import load_hybrid_system
    
    hybrid, train_df, movies_df = load_hybrid_system()
    print(f"   ✅ Hybrid recommender loaded successfully")
    
    # Test recommendations
    print("\n4. Testing recommendations...")
    test_user_id = 1
    recommendations = hybrid.recommend_movies(test_user_id, top_n=5)
    
    print(f"   🎬 Top 5 recommendations for User {test_user_id}:")
    for i, rec in enumerate(recommendations, 1):
        print(f"      {i}. {rec['title']}")
        print(f"         Rating: {rec['predicted_rating']:.1f}★")
        print(f"         Confidence: {rec['confidence']:.0%}")
        print(f"         Genres: {rec['genres']}")
        print()
    
    print("✅ ALL TESTS PASSED!")
    print("🎉 Your recommendation system is working perfectly!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)
except FileNotFoundError as e:
    print(f"❌ File not found: {e}")
    print("💡 Make sure you've run the preprocessing step first")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)