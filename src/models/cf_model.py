import pandas as pd
from surprise import SVD, Dataset, Reader, accuracy
from surprise.model_selection import train_test_split
import pickle
import os

class CFModelSVD:
    def __init__(self):
        self.model = SVD()
        self.reader = Reader(rating_scale=(0.5, 5.0))
        
    def fit(self, train_df):
        # Convert to surprise dataset
        data = Dataset.load_from_df(train_df[['userId', 'movieId', 'rating']], self.reader)
        trainset = data.build_full_trainset()
        print("Training SVD model...")
        self.model.fit(trainset)
        
    def predict(self, user_id, movie_id):
        return self.model.predict(user_id, movie_id).est

    def save_model(self, path='src/models/svd_model.pkl'):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump(self.model, f)
            
    def load_model(self, path='src/models/svd_model.pkl'):
        with open(path, 'rb') as f:
            self.model = pickle.load(f)

if __name__ == "__main__":
    train_df = pd.read_csv('data/processed/train_ratings.csv')
    test_df = pd.read_csv('data/processed/test_ratings.csv')
    
    cf_svd = CFModelSVD()
    cf_svd.fit(train_df)
    cf_svd.save_model()
    
    # Test on a sample
    u, m = test_df.iloc[0]['userId'], test_df.iloc[0]['movieId']
    pred = cf_svd.predict(u, m)
    print(f"Prediction for User {u} on Movie {m}: {pred:.2f} (Actual: {test_df.iloc[0]['rating']})")
