# 🎬 ReelSense++ v2.0: The Human-Centric Movie Recommendation Ecosystem

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

ReelSense++ is an **ethical AI companion** for movie recommendations that prioritizes **transparency**, **diversity**, and **contextual intelligence**. Built on a four-stage intelligent pipeline, it transcends traditional accuracy metrics to deliver meaningful, explainable, and engaging recommendations.

## 🌟 Key Features

### Four-Stage Intelligent Pipeline

1. **Multi-Modal Candidate Generation**
   - SVD++ collaborative filtering with implicit feedback
   - BERT-based semantic embeddings for deep content understanding
   - Cold-start handling for new users/movies

2. **Context-Aware Personalization**
   - Temporal patterns (weekend vs. weekday, time-of-day)
   - Device adaptation (mobile, TV, desktop)
   - Dynamic user profiling with genre affinity tracking

3. **Diversity-Optimized Re-ranking**
   - Multi-dimensional MMR (genre, decade, cultural constraints)
   - Serendipity slots for unexpected discoveries
   - Long-tail promotion (20% from underrepresented content)

4. **Explainable AI Interface**
   - Multi-layer explanations (simple, intermediate, advanced)
   - Trust metrics with confidence scores
   - "Why you might NOT like this" disclaimers

## 📊 Evaluation Framework

### Traditional Metrics
- **Accuracy**: Precision@K, Recall@K, NDCG, MAP
- **Diversity**: Intra-list diversity, Genre entropy, Decade coverage
- **Novelty**: Popularity rank, Long-tail percentage

### Human-Centric Metrics (NEW)
- **Discovery Joy**: Percentage of new genre exploration
- **Decision Load**: Inverse of recommendation list size
- **Trust Score**: Confidence-based reliability

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Reel

# Install dependencies
pip install -r requirements.txt
```

### Data Preparation

```bash
# Download and preprocess MovieLens dataset
python src/download_data.py
python src/preprocessing/preprocess.py
```

### Run ReelSense++ v2.0

```bash
# Complete training and evaluation pipeline
python run_reelsense_v2.py
```

## 📁 Project Structure

```
Reel/
├── data/
│   ├── raw/                    # Raw MovieLens dataset
│   └── processed/              # Cleaned and split data
├── src/
│   ├── models/
│   │   ├── bert_embeddings.py  # BERT-based semantic embeddings
│   │   ├── svdpp_model.py      # SVD++ collaborative filtering
│   │   ├── user_modeling.py    # Dynamic user profiling
│   │   ├── hybrid_v2.py        # Hybrid recommender (Stage 1+2)
│   │   └── diversity_v2.py     # Diversity optimizer (Stage 3)
│   ├── evaluation/
│   │   └── metrics_v2.py       # Comprehensive metrics
│   ├── preprocessing/
│   │   ├── preprocess.py       # Data cleaning
│   │   └── eda.py              # Exploratory analysis
│   └── reelsense_v2.py         # Complete pipeline
├── reports/                    # Results and visualizations
└── run_reelsense_v2.py         # Main execution script
```

## 💡 Innovation Highlights

### Ethics-First Design
- Built-in fairness and transparency
- User agency over diversity/accuracy trade-offs
- Addiction prevention through content diversity

### Holistic Evaluation
- Measures emotional impact, not just clicks
- Tracks trust, discovery joy, and decision load
- Human-centric metrics alongside traditional ones

### Context Intelligence
- Understands when, where, and how you watch
- Adapts to temporal patterns and device preferences
- Mood-aware recommendations

## 📈 Sample Results

Based on MovieLens 100K dataset evaluation:

| Metric | Score |
|--------|-------|
| Precision@10 | 0.08-0.12 |
| NDCG@10 | 0.10-0.15 |
| Intra-List Diversity | 0.85-0.92 |
| Discovery Joy | 15-25% |
| Long-tail Coverage | 18-22% |

## 🎯 Use Cases

- **Streaming Platforms**: Reduce churn through better discovery
- **Independent Filmmakers**: Long-tail content exposure
- **Users**: Reduced decision fatigue, meaningful discovery

## 📚 Citation

If you use ReelSense++ in your research, please cite:

```bibtex
@software{reelsense_v2,
  title={ReelSense++: The Human-Centric Movie Recommendation Ecosystem},
  author={Your Name},
  year={2026},
  version={2.0}
}
```

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- MovieLens dataset by GroupLens Research
- Sentence-BERT for semantic embeddings
- Scikit-surprise for collaborative filtering
