"""
DeepEarth V2 — Automated Monitoring Pipeline
Periodically scans satellite imagery, runs AI analysis, and triggers alerts.

Run as cron job or standalone scheduler:
    python -m scheduler.monitor_pipeline

Default frequency: every 6 hours
"""

import os
import sys
import time
import json
import schedule
from datetime import datetime

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.predict import DeepEarthPredictor
from backend.satellite_fetcher import (
    fetch_static_features,
    fetch_temporal_features,
    initialize_ee,
)
from backend.change_detection import compute_region_stats
from backend.alert_system import send_alert_email, should_trigger_alert


# ── Monitored Regions ────────────────────────────────────────

MONITORED_REGIONS = {
    "Hyderabad": {"lat": 17.45, "lon": 78.45, "bbox": 0.25},
    "Delhi": {"lat": 28.60, "lon": 77.00, "bbox": 0.30},
    "Western Ghats": {"lat": 13.60, "lon": 75.70, "bbox": 0.25},
    "Jharkhand": {"lat": 23.40, "lon": 85.30, "bbox": 0.30},
    "Sundarbans": {"lat": 21.90, "lon": 88.90, "bbox": 0.20},
    "Rajasthan": {"lat": 26.60, "lon": 72.90, "bbox": 0.30},
    "Bellary": {"lat": 15.10, "lon": 76.90, "bbox": 0.30},
    "Assam": {"lat": 26.10, "lon": 93.60, "bbox": 0.30},
    "Kerala Coast": {"lat": 9.80, "lon": 76.30, "bbox": 0.30},
    "Bangalore": {"lat": 13.10, "lon": 77.70, "bbox": 0.30},
    "Mumbai": {"lat": 19.30, "lon": 73.10, "bbox": 0.30},
}


def scan_all_regions(predictor: DeepEarthPredictor):
    """Run AI analysis on all monitored regions."""
    print(f"\n{'='*60}")
    print(f"  🛰️  DeepEarth Monitoring Scan — {datetime.now()}")
    print(f"{'='*60}\n")

    results = []

    for region_name, coords in MONITORED_REGIONS.items():
        print(f"📡 Scanning {region_name}...")
        try:
            features = fetch_static_features(
                coords["lat"], coords["lon"], coords["bbox"]
            )
            pred_map = predictor.predict_static(features)
            stats = compute_region_stats(pred_map)

            print(f"   {_severity_icon(stats['severity'])} "
                  f"{stats['severity']} — Score: {stats['alert_score']}")

            # Trigger alert if needed
            if should_trigger_alert(stats["severity"], stats["forest_loss_pct"]):
                print(f"   🚨 Alert triggered!")
                send_alert_email(
                    region_name=region_name,
                    severity=stats["severity"],
                    alert_score=stats["alert_score"],
                    top_issues=stats["top_issues"],
                    coordinates=coords,
                    forest_loss_pct=stats["forest_loss_pct"],
                )

            results.append({
                "region": region_name,
                "severity": stats["severity"],
                "score": stats["alert_score"],
                "forest_loss_pct": stats["forest_loss_pct"],
            })

        except Exception as e:
            print(f"   ❌ Failed: {e}")

    # Summary
    print(f"\n{'='*60}")
    print(f"  📋 SCAN SUMMARY")
    print(f"{'='*60}")
    for r in sorted(results, key=lambda x: x["score"], reverse=True):
        icon = _severity_icon(r["severity"])
        print(f"  {icon} {r['region']:<20} {r['severity']:<10} "
              f"Score: {r['score']:.1f}")

    # Save results log
    log_path = os.path.join(
        os.path.dirname(__file__),
        f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    )
    with open(log_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n💾 Log saved to {log_path}")


def _severity_icon(severity: str) -> str:
    return {
        "CRITICAL": "🔴", "HIGH": "🟠",
        "MEDIUM": "🟡", "LOW": "🟢", "CLEAR": "✅"
    }.get(severity, "⚪")


def main():
    """Run the monitoring pipeline on a schedule."""
    print("🌍 DeepEarth V2 — Monitoring Pipeline")
    print("   Starting scheduler...\n")

    # Initialize
    ee_ok = initialize_ee()
    if not ee_ok:
        print("⚠️  Running with mock data (no GEE credentials)")

    predictor = DeepEarthPredictor(model_dir="models")

    # Run once immediately
    scan_all_regions(predictor)

    # Schedule periodic scans
    interval_hours = int(os.getenv("SCAN_INTERVAL_HOURS", "6"))
    schedule.every(interval_hours).hours.do(scan_all_regions, predictor)

    print(f"\n⏰ Scheduled to run every {interval_hours} hours")
    print("   Press Ctrl+C to stop\n")

    while True:
        schedule.run_pending()
        time.sleep(60)


if __name__ == "__main__":
    main()
