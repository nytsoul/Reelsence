"""
Configuration settings for ReelSense++ Backend
Update this file to customize data paths and settings
"""
import os

# ── Data Configuration ──────────────────────────────────────────────────────
# Main data directory containing your MovieLens dataset
DATA_DIR = r"D:\Files\moviedata"

# Raw data directory (MovieLens ml-latest-small)
RAW_DATA_DIR = os.path.join(DATA_DIR, "ml-latest-small")

# Processed data directory (where cleaned files will be stored)
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, "processed")

# Model storage directory
MODEL_DIR = os.path.join(DATA_DIR, "models", "saved")

# Encoder storage directory  
ENCODER_DIR = os.path.join(DATA_DIR, "encoders")

# ── Model Configuration ─────────────────────────────────────────────────────
# SVD parameters for collaborative filtering
SVD_FACTORS = 50
SVD_EPOCHS = 20
SVD_LR = 0.005
SVD_REG = 0.02

# Hybrid model weights
CF_WEIGHT = 0.7  # Collaborative Filtering weight
CB_WEIGHT = 0.3  # Content-Based weight

# ── API Configuration ───────────────────────────────────────────────────────
HOST = "0.0.0.0"
PORT = 5000
DEBUG = True

# ── File Paths ──────────────────────────────────────────────────────────────
def get_raw_file_path(filename):
    """Get path to raw data file"""
    return os.path.join(RAW_DATA_DIR, filename)

def get_processed_file_path(filename):
    """Get path to processed data file"""
    return os.path.join(PROCESSED_DATA_DIR, filename)

def get_model_file_path(filename):
    """Get path to model file"""
    return os.path.join(MODEL_DIR, filename)

def get_encoder_file_path(filename):
    """Get path to encoder file"""
    return os.path.join(ENCODER_DIR, filename)

# Create directories if they don't exist
os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(ENCODER_DIR, exist_ok=True)