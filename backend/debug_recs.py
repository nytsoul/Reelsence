import os
import sys
import pandas as pd

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.getcwd(), 'src'))

try:
    from src.models.hybrid_model import load_hybrid_system
    
    print("Loading hybrid system...")
    hybrid, train_df, movies_df = load_hybrid_system(
        data_dir='data/processed',
        model_dir='src/models/saved'
    )
    
    user_id = 100
    print(f"\n--- Testing User {user_id} ---")
    
    # Check if user in training ratings
    user_ratings = train_df[train_df['userId'] == user_id]
    print(f"Ratings in train_df: {len(user_ratings)}")
    
    # Get recommendations
    recs = hybrid.recommend_movies(user_id, top_n=10)
    print(f"Recommendations count: {len(recs)}")
    
    for i, rec in enumerate(recs, 1):
        print(f"  {i}. {rec['title']} (Score: {rec['final_score']})")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
