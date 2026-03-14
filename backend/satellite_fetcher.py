"""
DeepEarth V2 — Satellite Data Pipeline
Fetches Sentinel-2 imagery and computes spectral indices via Google Earth Engine.
Supports both bbox (lat/lon) and GeoJSON polygon geometry for region-specific analysis.
"""

import os
import hashlib
import numpy as np

# GEE import with graceful fallback
try:
    import ee
    EE_AVAILABLE = True
except ImportError:
    EE_AVAILABLE = False

from .utils import SCALE, SPECTRAL_BANDS, TEMPORAL_YEARS


def initialize_ee(project_id: str = None):
    """Initialize Google Earth Engine with project credentials."""
    if not EE_AVAILABLE:
        print("⚠️  earthengine-api not installed. Using mock data.")
        return False

    project_id = project_id or os.getenv("GEE_PROJECT_ID", "deepearth-project")
    try:
        ee.Initialize(project=project_id)
        print(f"✅ Earth Engine initialized: {project_id}")
        return True
    except Exception:
        try:
            ee.Authenticate()
            ee.Initialize(project=project_id)
            print(f"✅ Earth Engine authenticated and initialized")
            return True
        except Exception as e:
            print(f"⚠️  Earth Engine init failed: {e}")
            return False


def _compute_indices(image):
    """Compute 6 spectral indices from Sentinel-2 bands."""
    ndvi  = image.normalizedDifference(["B8", "B4"]).rename("NDVI")
    ndwi  = image.normalizedDifference(["B3", "B8"]).rename("NDWI")
    ndbi  = image.normalizedDifference(["B11", "B8"]).rename("NDBI")
    nbr   = image.normalizedDifference(["B8", "B12"]).rename("NBR")
    evi   = image.expression(
        "2.5*(NIR-RED)/(NIR+6*RED-7.5*BLUE+1)",
        {"NIR": image.select("B8"), "RED": image.select("B4"), "BLUE": image.select("B2")},
    ).rename("EVI")
    mndwi = image.normalizedDifference(["B3", "B11"]).rename("MNDWI")
    return ee.Image.cat([ndvi, ndwi, ndbi, nbr, evi, mndwi])


# ── GEE-backed fetchers ────────────────────────────────────────────────────

def fetch_spectral_indices(
    lat: float, lon: float, year: int, bbox_size: float = 0.3,
    geometry: dict = None,
) -> np.ndarray:
    """
    Fetch 6-channel spectral indices for a region.
    If `geometry` (GeoJSON Polygon) is provided, clips to it.
    Otherwise falls back to bounding box around (lat, lon).
    """
    if not EE_AVAILABLE:
        return _mock_spectral_data(lat=lat, lon=lon, year=year)

    if geometry:
        region = ee.Geometry(geometry)
    else:
        region = ee.Geometry.Rectangle([
            lon - bbox_size, lat - bbox_size,
            lon + bbox_size, lat + bbox_size,
        ])

    img = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(region)
        .filterDate(f"{year}-01-01", f"{year}-12-31")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .median()
        .clip(region)                                  # ← clip to polygon
        .reproject(crs="EPSG:4326", scale=SCALE)
    )

    stack = _compute_indices(img)
    d = stack.sampleRectangle(region=region, defaultValue=0).getInfo()
    arrays = [np.array(d["properties"][b], dtype=np.float32) for b in SPECTRAL_BANDS]
    return np.stack(arrays, axis=-1)


def fetch_static_features(
    lat: float, lon: float, bbox_size: float = 0.3, geometry: dict = None,
) -> np.ndarray:
    """
    Fetch 12-channel feature stack (2019 + 2024) for UNetV3.
    geometry: optional GeoJSON Polygon to clip imagery.
    """
    if not EE_AVAILABLE:
        return _mock_static_features(lat=lat, lon=lon)

    arr_2019 = fetch_spectral_indices(lat, lon, 2019, bbox_size, geometry)
    arr_2024 = fetch_spectral_indices(lat, lon, 2024, bbox_size, geometry)

    H = min(arr_2019.shape[0], arr_2024.shape[0])
    W = min(arr_2019.shape[1], arr_2024.shape[1])
    return np.concatenate([arr_2019[:H, :W, :], arr_2024[:H, :W, :]], axis=-1)


def fetch_temporal_features(
    lat: float, lon: float, bbox_size: float = 0.3, geometry: dict = None,
) -> np.ndarray:
    """
    Fetch 4-year temporal stack for ConvLSTMUNet.
    geometry: optional GeoJSON Polygon to clip imagery.
    """
    if not EE_AVAILABLE:
        return _mock_temporal_features(lat=lat, lon=lon)

    yearly_stacks = [
        fetch_spectral_indices(lat, lon, year, bbox_size, geometry)
        for year in TEMPORAL_YEARS
    ]
    min_h = min(s.shape[0] for s in yearly_stacks)
    min_w = min(s.shape[1] for s in yearly_stacks)
    return np.stack([s[:min_h, :min_w, :] for s in yearly_stacks], axis=0)


def fetch_region_by_bbox(
    lon_min: float, lat_min: float, lon_max: float, lat_max: float, year: int
) -> np.ndarray:
    """Fetch spectral indices for an explicit bounding box."""
    if not EE_AVAILABLE:
        lat = (lat_min + lat_max) / 2
        lon = (lon_min + lon_max) / 2
        return _mock_spectral_data(lat=lat, lon=lon, year=year)

    region = ee.Geometry.Rectangle([lon_min, lat_min, lon_max, lat_max])
    img = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(region)
        .filterDate(f"{year}-01-01", f"{year}-12-31")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .median()
        .clip(region)
        .reproject(crs="EPSG:4326", scale=SCALE)
    )
    stack  = _compute_indices(img)
    d      = stack.sampleRectangle(region=region, defaultValue=0).getInfo()
    arrays = [np.array(d["properties"][b], dtype=np.float32) for b in SPECTRAL_BANDS]
    return np.stack(arrays, axis=-1)


# ── Mock Data — region-specific via coordinate-derived seed ─────────────────
#
# The seed is derived from lat/lon so that:
#   • The same region always returns the same values (deterministic)
#   • Different regions return DIFFERENT values
# This makes the demo realistic without needing GEE credentials.

def _region_seed(lat: float, lon: float, year: int = 0) -> int:
    """
    Derive an integer seed from (lat, lon, year) so each region
    produces unique but reproducible mock data.
    """
    key = f"{round(lat, 3)}_{round(lon, 3)}_{year}"
    return int(hashlib.md5(key.encode()).hexdigest()[:8], 16) & 0x7FFFFFFF


def _mock_spectral_data(h: int = 64, w: int = 64,
                        lat: float = 20.0, lon: float = 78.0,
                        year: int = 2024) -> np.ndarray:
    """
    Generate realistic mock spectral indices, unique per region.

    The seed is derived from (lat, lon, year) so Telangana, Madhya Pradesh,
    Assam, etc. each get distinct spectral fingerprints.
    """
    seed = _region_seed(lat, lon, year)
    rng  = np.random.default_rng(seed)

    # Region-specific base NDVI (proxy for vegetation health)
    # lat/lon determine what kind of landscape this "is"
    base_ndvi  = float(np.clip(0.3 + 0.4 * np.sin(lat * 0.15) * np.cos(lon * 0.10), 0.1, 0.85))
    base_ndwi  = float(np.clip(-0.1 + 0.3 * np.cos(lat * 0.12), -0.4, 0.4))
    base_ndbi  = float(np.clip(0.05 + 0.2 * np.sin(lon * 0.08), -0.2, 0.4))

    data = np.zeros((h, w, 6), dtype=np.float32)
    spread = 0.15
    data[:, :, 0] = np.clip(rng.normal(base_ndvi,  spread, (h, w)), 0.0,  1.0)   # NDVI
    data[:, :, 1] = np.clip(rng.normal(base_ndwi,  spread, (h, w)), -0.5, 0.5)   # NDWI
    data[:, :, 2] = np.clip(rng.normal(base_ndbi,  spread, (h, w)), -0.3, 0.5)   # NDBI
    data[:, :, 3] = np.clip(rng.normal(base_ndvi * 0.8, spread, (h, w)), 0.0, 0.7)  # NBR
    data[:, :, 4] = np.clip(rng.normal(base_ndvi * 0.6, spread, (h, w)), 0.0, 0.6)  # EVI
    data[:, :, 5] = np.clip(rng.normal(base_ndwi * 0.9, spread, (h, w)), -0.4, 0.4) # MNDWI
    return data


def _mock_static_features(h: int = 64, w: int = 64,
                           lat: float = 20.0, lon: float = 78.0) -> np.ndarray:
    """12-channel (2019 + 2024) feature stack, region-specific."""
    arr_2019 = _mock_spectral_data(h, w, lat=lat, lon=lon, year=2019)
    arr_2024 = _mock_spectral_data(h, w, lat=lat, lon=lon, year=2024)
    return np.concatenate([arr_2019, arr_2024], axis=-1)


def _mock_temporal_features(h: int = 64, w: int = 64,
                             lat: float = 20.0, lon: float = 78.0) -> np.ndarray:
    """(4, H, W, 6) temporal stack, region-specific."""
    return np.stack(
        [_mock_spectral_data(h, w, lat=lat, lon=lon, year=y) for y in TEMPORAL_YEARS],
        axis=0,
    )
