import pandas as pd

class PopularityRecommender:
    def __init__(self):
        self.popular_movies = None
        
    def fit(self, train_ratings, movies):
        # Calculate popularity: number of ratings and average rating
        stats = train_ratings.groupby('movieId').agg({'rating': ['count', 'mean']})
        stats.columns = ['rating_count', 'mean_rating']
        
        # Merge with movie metadata
        self.popular_movies = stats.merge(movies, on='movieId')
        
        # Sort by count (popularity) and then mean rating
        self.popular_movies = self.popular_movies.sort_values(
            by=['rating_count', 'mean_rating'], ascending=False
        )
        
    def recommend(self, k=10):
        return self.popular_movies.head(k)

if __name__ == "__main__":
    import os
    train = pd.read_csv('data/processed/train_ratings.csv')
    movies = pd.read_csv('data/processed/movies_cleaned.csv')
    
    recommender = PopularityRecommender()
    recommender.fit(train, movies)
    top_k = recommender.recommend(10)
    
    print("Top 10 Popular Movies:")
    print(top_k[['title', 'rating_count', 'mean_rating']])
