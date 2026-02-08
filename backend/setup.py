#!/usr/bin/env python3
"""
ReelSense++ v2.0 - Setup Script
Runs preprocessing and model training with the configured data path
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from config import RAW_DATA_DIR, PROCESSED_DATA_DIR, MODEL_DIR
import argparse

def check_data_directory():
    """Check if the raw data directory exists and contains the required files"""
    print(f"Checking data directory: {RAW_DATA_DIR}")
    
    if not os.path.exists(RAW_DATA_DIR):
        print(f"❌ Raw data directory not found: {RAW_DATA_DIR}")
        print("Please ensure your MovieLens dataset is located at the configured path.")
        return False
    
    required_files = ['movies.csv', 'ratings.csv', 'tags.csv', 'links.csv']
    missing_files = []
    
    for file in required_files:
        file_path = os.path.join(RAW_DATA_DIR, file)
        if not os.path.exists(file_path):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing required files: {', '.join(missing_files)}")
        print(f"Please ensure all MovieLens files are in: {RAW_DATA_DIR}")
        return False
    
    print("✅ All required data files found!")
    return True

def run_preprocessing():
    """Run the data preprocessing pipeline"""
    print("\n" + "="*60)
    print("STEP 1: DATA PREPROCESSING")
    print("="*60)
    
    # Import and run preprocessing
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
    from preprocessing.preprocess import run_preprocessing
    
    try:
        run_preprocessing()
        print("✅ Preprocessing completed successfully!")
        return True
    except Exception as e:
        print(f"❌ Preprocessing failed: {e}")
        return False

def run_model_training():
    """Run the hybrid model training"""
    print("\n" + "="*60)
    print("STEP 2: MODEL TRAINING")
    print("="*60)
    
    # Check if processed data exists
    processed_files = ['train_ratings.csv', 'movies_cleaned.csv']
    for file in processed_files:
        file_path = os.path.join(PROCESSED_DATA_DIR, file)
        if not os.path.exists(file_path):
            print(f"❌ Required processed file not found: {file}")
            print("Please run preprocessing first.")
            return False
    
    # Import and run model training
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src', 'models'))
    from hybrid_model import build_hybrid_system
    
    try:
        hybrid, train_df, movies_df = build_hybrid_system()
        print("✅ Model training completed successfully!")
        return True
    except Exception as e:
        print(f"❌ Model training failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    parser = argparse.ArgumentParser(description='ReelSense++ Setup Script')
    parser.add_argument('--preprocess-only', action='store_true', 
                      help='Run only data preprocessing')
    parser.add_argument('--train-only', action='store_true', 
                      help='Run only model training (requires preprocessed data)')
    parser.add_argument('--check-only', action='store_true',
                      help='Only check data directory without running setup')
    
    args = parser.parse_args()
    
    print("ReelSense++ v2.0 - Setup Script")
    print("="*60)
    print(f"Raw data directory: {RAW_DATA_DIR}")
    print(f"Processed data directory: {PROCESSED_DATA_DIR}")
    print(f"Model directory: {MODEL_DIR}")
    print("="*60)
    
    # Check data directory
    if not check_data_directory():
        return 1
    
    if args.check_only:
        print("✅ Data directory check completed!")
        return 0
    
    success = True
    
    # Run preprocessing
    if not args.train_only:
        success &= run_preprocessing()
    
    # Run model training  
    if success and not args.preprocess_only:
        success &= run_model_training()
    
    if success:
        print("\n" + "="*60)
        print("🎉 SETUP COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("Your ReelSense++ backend is ready to serve recommendations!")
        print("Run 'python app.py' to start the server.")
        return 0
    else:
        print("\n" + "="*60)
        print("❌ SETUP FAILED")
        print("="*60)
        print("Please check the error messages above and try again.")
        return 1

if __name__ == "__main__":
    sys.exit(main())