# ReelSense++ v2.0: Implementation Notes

## ⚠️ Important: Dependency Installation

The project requires `scikit-surprise` for collaborative filtering (SVD++). This library may require a C++ compiler on Windows.

### Installation Options

**Option 1: Pre-built Wheels (Recommended)**
```bash
pip install scikit-surprise
```

**Option 2: Conda (If pip fails)**
```bash
conda install -c conda-forge scikit-surprise
```

**Option 3: Alternative CF Implementation**
If installation fails, you can use the alternative implementation in `src/models/cf_model.py` which uses basic SVD from scikit-learn instead of SVD++.

## 🚀 Running the System

### Full Pipeline (Requires scikit-surprise)
```bash
python run_reelsense_v2.py
```

### Architecture Demo (No dependencies required)
```bash
python demo_architecture.py
```

## 📊 Expected Results

Based on MovieLens 100K dataset:

- **Precision@10**: 0.08-0.12
- **NDCG@10**: 0.10-0.15
- **Intra-List Diversity**: 0.85-0.92
- **Discovery Joy**: 15-25%
- **Long-tail Coverage**: 18-22%

## 🏗️ Architecture Highlights

### Stage 1: Multi-Modal Candidate Generation
- **SVD++**: Implicit feedback collaborative filtering
- **BERT**: Semantic embeddings via `sentence-transformers`
- **Hybrid**: 60% CF + 40% Content

### Stage 2: Context-Aware Personalization
- Temporal patterns (weekend vs. weekday)
- Device adaptation (mobile/TV/desktop)
- Dynamic user profiling

### Stage 3: Diversity Optimization
- Multi-dimensional MMR (genre, decade, culture)
- Serendipity slots (unexpected recommendations)
- Long-tail injection (20% quota)

### Stage 4: Explainability
- Multi-layer explanations (simple/intermediate/advanced)
- Trust metrics with confidence scores
- "Why NOT" disclaimers for transparency

## 📁 Key Files

- **`src/reelsense_v2.py`**: Complete four-stage pipeline
- **`src/models/bert_embeddings.py`**: BERT-based semantic understanding
- **`src/models/svdpp_model.py`**: SVD++ collaborative filtering
- **`src/models/hybrid_v2.py`**: Hybrid recommender (Stage 1+2)
- **`src/models/diversity_v2.py`**: Diversity optimizer (Stage 3)
- **`src/evaluation/metrics_v2.py`**: Comprehensive evaluation

## 🎯 Innovation Summary

ReelSense++ v2.0 represents a paradigm shift in recommendation systems:

1. **Ethics-First**: Transparency, fairness, and user agency
2. **Human-Centric**: Measures discovery joy and decision load
3. **Context-Aware**: Adapts to temporal and device patterns
4. **Diversity-Optimized**: Multi-dimensional constraints
5. **Explainable**: Multi-layer explanations with trust metrics

This is not just a recommender—it's an **ethical AI companion** for content discovery.
