"""
ReelSense++ v2.0 - Diversity Optimization
Maximal Marginal Relevance (MMR) for recommendation diversity.
"""
import numpy as np


class DiversityOptimizer:
    def __init__(self, hybrid_recommender):
        self.hybrid = hybrid_recommender

    def mmr_rerank(self, user_id, candidates, top_k=10, lambda_param=0.5):
        """
        Maximal Marginal Relevance (MMR) for diversity optimization.
        candidates: List of (movie_id, score, cf_score, content_score)
        """
        if not candidates:
            return []

        selected_ids = []
        remaining_candidates = sorted(candidates, key=lambda x: x[1], reverse=True)

        # Select the first (highest scoring) candidate
        best_first = remaining_candidates.pop(0)
        selected_ids.append(best_first)

        while len(selected_ids) < top_k and remaining_candidates:
            mmr_scores = []
            for cand in remaining_candidates:
                m_id = cand[0]
                rel_score = cand[1]

                # Max similarity to already selected items
                max_sim = 0
                for sel in selected_ids:
                    sim = self.hybrid.get_content_similarity(m_id, sel[0])
                    if sim > max_sim:
                        max_sim = sim

                # MMR: lambda * Relevance - (1 - lambda) * MaxSimilarity
                mmr_val = lambda_param * rel_score - (1 - lambda_param) * max_sim
                mmr_scores.append(mmr_val)

            best_idx = int(np.argmax(mmr_scores))
            selected_ids.append(remaining_candidates.pop(best_idx))

        return selected_ids
