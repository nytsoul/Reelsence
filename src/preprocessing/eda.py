import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

def run_eda(processed_data_path='data/processed'):
    train_ratings = pd.read_csv(os.path.join(processed_data_path, 'train_ratings.csv'))
    movies = pd.read_csv(os.path.join(processed_data_path, 'movies_cleaned.csv'))
    
    # Ensure reports directory exists
    os.makedirs('reports/figures', exist_ok=True)
    
    # 1. Distribution of ratings
    plt.figure(figsize=(10, 6))
    sns.countplot(x='rating', data=train_ratings, palette='viridis')
    plt.title('Distribution of Movie Ratings')
    plt.xlabel('Rating')
    plt.ylabel('Count')
    plt.savefig('reports/figures/rating_distribution.png')
    plt.close()
    
    # 2. Top Genres popularity
    def parse_genres(x):
        try:
            return ast.literal_eval(x)
        except:
            if isinstance(x, str):
                return x.split('|')
            return x

    movies['genres_list'] = movies['genres'].apply(parse_genres)
    all_genres = [genre for sublist in movies['genres_list'] for genre in sublist]
    genre_series = pd.Series(all_genres)
    
    plt.figure(figsize=(12, 8))
    genre_series.value_counts().plot(kind='bar', color='skyblue')
    plt.title('Genre Popularity (Frequency of Genres in Movies)')
    plt.xlabel('Genre')
    plt.ylabel('Number of Movies')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('reports/figures/genre_popularity.png')
    plt.close()
    
    # 3. User Activity Histogram
    user_activity = train_ratings.groupby('userId').size()
    plt.figure(figsize=(10, 6))
    sns.histplot(user_activity, bins=50, kde=True, color='salmon')
    plt.title('User Activity (Number of Ratings per User)')
    plt.xlabel('Number of Ratings')
    plt.ylabel('Frequency')
    plt.savefig('reports/figures/user_activity.png')
    plt.close()
    
    # 4. Long-tail Analysis
    movie_counts = train_ratings.groupby('movieId').size().sort_values(ascending=False)
    plt.figure(figsize=(10, 6))
    plt.plot(range(len(movie_counts)), movie_counts.values, color='purple')
    plt.title('Long-tail Analysis of Movie Popularity')
    plt.xlabel('Movie Rank')
    plt.ylabel('Number of Ratings')
    plt.savefig('reports/figures/long_tail.png')
    plt.close()
    
    print("EDA Visualizations saved to reports/figures/")

if __name__ == "__main__":
    run_eda()
