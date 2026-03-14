"""
DeepEarth V2 — Change Detection Engine
Compares prediction maps to detect environmental changes and compute severity.
"""

import numpy as np
from .utils import NUM_CLASSES, CLASS_NAMES, ALERT_WEIGHTS


def compare_predictions(
    pred_old: np.ndarray, pred_new: np.ndarray
) -> dict:
    """
    Compare two prediction maps to detect environmental changes.

    Args:
        pred_old: (H, W) — prediction map from previous period
        pred_new: (H, W) — prediction map from current period

    Returns:
        dict with change_mask, change_percentage, per-class changes, risk_score
    """
    H = min(pred_old.shape[0], pred_new.shape[0])
    W = min(pred_old.shape[1], pred_new.shape[1])
    pred_old = pred_old[:H, :W]
    pred_new = pred_new[:H, :W]

    # Change mask: pixels that changed class
    change_mask = (pred_old != pred_new).astype(np.int32)
    total_pixels = change_mask.size
    changed_pixels = change_mask.sum()
    change_pct = float(100 * changed_pixels / total_pixels)

    # Per-class analysis
    class_changes = {}
    for cls in range(NUM_CLASSES):
        old_count = int((pred_old == cls).sum())
        new_count = int((pred_new == cls).sum())
        old_pct = 100 * old_count / total_pixels
        new_pct = 100 * new_count / total_pixels
        delta = new_pct - old_pct

        if abs(delta) > 0.5:  # Only report meaningful changes
            class_changes[CLASS_NAMES[cls]] = {
                "old_pct": round(old_pct, 2),
                "new_pct": round(new_pct, 2),
                "delta_pct": round(delta, 2),
                "direction": "increase" if delta > 0 else "decrease",
            }

    # Risk score
    risk_score = compute_alert_score(pred_new)
    severity = classify_severity(risk_score)

    return {
        "change_mask": change_mask,
        "change_percentage": round(change_pct, 2),
        "class_changes": class_changes,
        "risk_score": round(risk_score, 2),
        "severity": severity,
    }


def compute_alert_score(pred_map: np.ndarray) -> float:
    """
    Compute weighted alert score from a prediction map.
    Higher score = more environmental concern.
    """
    total = pred_map.size
    score = 0.0
    for cls in range(NUM_CLASSES):
        pct = 100 * (pred_map == cls).sum() / total
        score += ALERT_WEIGHTS[cls] * pct
    return score


def classify_severity(score: float) -> str:
    """Classify alert severity from score."""
    if score >= 80:
        return "CRITICAL"
    elif score >= 40:
        return "HIGH"
    elif score >= 15:
        return "MEDIUM"
    elif score >= 3:
        return "LOW"
    return "CLEAR"


def compute_region_stats(pred_map: np.ndarray) -> dict:
    """
    Compute comprehensive statistics for a region prediction.

    Returns:
        dict with class distribution, alert score, severity, top issues
    """
    total = pred_map.size
    score = compute_alert_score(pred_map)
    severity = classify_severity(score)

    # Class distribution
    distribution = {}
    for cls in range(NUM_CLASSES):
        pct = float(100 * (pred_map == cls).sum() / total)
        distribution[cls] = {
            "name": CLASS_NAMES[cls],
            "percentage": round(pct, 2),
            "pixel_count": int((pred_map == cls).sum()),
        }

    # Top issues (non-zero classes sorted by weighted impact)
    issues = []
    for cls in range(1, NUM_CLASSES):
        pct = distribution[cls]["percentage"]
        if pct > 0.5:
            issues.append({
                "class_id": cls,
                "class_name": CLASS_NAMES[cls],
                "percentage": pct,
                "impact_score": round(ALERT_WEIGHTS[cls] * pct, 2),
            })
    issues.sort(key=lambda x: x["impact_score"], reverse=True)

    return {
        "alert_score": round(score, 2),
        "severity": severity,
        "distribution": distribution,
        "top_issues": issues[:5],
        "total_pixels": total,
        "forest_loss_pct": round(
            distribution[2]["percentage"] + distribution[3]["percentage"], 2
        ),
        "urban_growth_pct": round(
            distribution[4]["percentage"] + distribution[5]["percentage"], 2
        ),
    }
