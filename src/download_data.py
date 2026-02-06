import os
import requests
import zipfile
import io

def download_movielens_small(target_dir='data/raw'):
    url = "https://files.grouplens.org/datasets/movielens/ml-latest-small.zip"
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        
    print(f"Downloading dataset from {url}...")
    r = requests.get(url)
    z = zipfile.ZipFile(io.BytesIO(r.content))
    
    print("Extracting files...")
    # The zip contains a folder ml-latest-small
    z.extractall(target_dir)
    print(f"Dataset downloaded and extracted to {target_dir}")

if __name__ == "__main__":
    download_movielens_small()
