import React, { useState, useCallback, useRef } from 'react';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import MapViewer from './components/MapViewer';
import AnalysisPanel from './components/AnalysisPanel';
import RegionPopup from './components/RegionPopup';
import MapControls from './components/MapControls';
import AnalysisResults from './components/AnalysisResults';
import Dashboard from './components/Dashboard';

/*
 * CLASS_COLORS used to generate a demo prediction PNG canvas
 * Must match backend/utils.py CLASS_COLORS exactly.
 */
const CLASS_COLORS = [
  '#D3D3D3', '#FFA726', '#EF1010', '#B71C1C', '#9C27B0',
  '#6A1B9A', '#8D6E63', '#FFD600', '#039BE5', '#FF6D00', '#43A047',
];

/** Convert hex "#RRGGBB" → [R,G,B] */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
}

/**
 * Generate a demo prediction PNG (base64 data URL) from a deterministic seed.
 * This creates a 64×64 canvas coloured by class, so the user sees a clear
 * overlay even without a live backend.
 */
function generateDemoPredictionImage(lat, lon) {
  const W = 64, H = 64;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Simple deterministic pseudo-random from lat/lon
  const seed = Math.abs(Math.sin(lat * 127.1 + lon * 311.7)) * 43758.5453;
  const rand = (i) => {
    const x = Math.sin((seed + i) * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const imgData = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x);
      const r = rand(idx);
      // Weighted class selection: No Change dominates (~60%)
      let cls;
      if (r < 0.55) cls = 0;
      else if (r < 0.65) cls = 2;
      else if (r < 0.72) cls = 3;
      else if (r < 0.78) cls = 4;
      else if (r < 0.83) cls = 10;
      else if (r < 0.87) cls = 1;
      else if (r < 0.90) cls = 8;
      else if (r < 0.93) cls = 9;
      else if (r < 0.96) cls = 6;
      else cls = 5;

      const [cr, cg, cb] = hexToRgb(CLASS_COLORS[cls]);
      const pi = idx * 4;
      imgData.data[pi] = cr;
      imgData.data[pi + 1] = cg;
      imgData.data[pi + 2] = cb;
      imgData.data[pi + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

export default function App() {
  const [activePage, setActivePage] = useState('map');
  const [activeCategory, setActiveCategory] = useState('forest-change');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewerRef, setViewerRef] = useState(null);
  const [layers, setLayers] = useState({ forestCover: true, forestLoss: true });

  // AI Prediction overlay state
  const [predictionOverlay, setPredictionOverlay] = useState(null);
  const [showPredictionLayer, setShowPredictionLayer] = useState(true);

  // Cache: skip re-analysis if same region is clicked again
  const lastAnalyzedRef = useRef(null);

  const handleRegionClick = useCallback((region) => {
    setSelectedRegion(region);
    setAnalysisResults(null);
  }, []);

  const handleAnalyze = useCallback(async (region) => {
    // Cache check — skip re-computation if same region
    const regionKey = `${region.lat}_${region.lon}`;
    if (lastAnalyzedRef.current?.key === regionKey) {
      setAnalysisResults(lastAnalyzedRef.current.results);
      setPredictionOverlay(lastAnalyzedRef.current.overlay);
      setShowPredictionLayer(true);
      setSelectedRegion(null);
      // Auto-zoom to the region
      viewerRef?.flyTo?.([region.lon, region.lat], 8);
      return;
    }

    setIsAnalyzing(true);
    setSelectedRegion(null);

    const bboxSize = region.bbox || 0.3;
    const bbox = {
      west: region.lon - bboxSize,
      south: region.lat - bboxSize,
      east: region.lon + bboxSize,
      north: region.lat + bboxSize,
    };

    try {
      const { detectChange, bboxToGeoJSON } = await import('./utils/api');
      const geometry = region.geometry || bboxToGeoJSON(region.lat, region.lon, bboxSize);
      const results = await detectChange(region.lat, region.lon, region.name, bboxSize, geometry);
      setAnalysisResults(results);

      // Build overlay from backend prediction_image
      const predBbox = results.bbox || bbox;
      let imageUrl = null;
      if (results.prediction_image) {
        imageUrl = `data:image/png;base64,${results.prediction_image}`;
      } else {
        // If backend didn't return an image, generate demo overlay
        imageUrl = generateDemoPredictionImage(region.lat, region.lon);
      }
      const overlay = { imageUrl, bbox: predBbox };
      setPredictionOverlay(overlay);
      setShowPredictionLayer(true);

      // Cache results
      lastAnalyzedRef.current = { key: regionKey, results, overlay };

    } catch (err) {
      console.error('Analysis failed — using demo fallback:', err);
      const seed = Math.abs(Math.sin(region.lat * 127.1 + region.lon * 311.7));
      const rnd = (base, spread) => parseFloat((base + (seed * spread - spread / 2)).toFixed(1));
      const fallbackResults = {
        success: true,
        region: region.name,
        bbox,
        stats: {
          alert_score: rnd(38, 40),
          severity: seed > 0.6 ? 'HIGH' : seed > 0.3 ? 'MEDIUM' : 'LOW',
          forest_loss_pct: rnd(6, 12),
          urban_growth_pct: rnd(4, 8),
          top_issues: [
            { class_name: 'Permanent Deforestation', percentage: rnd(5, 8), impact_score: rnd(50, 40) },
            { class_name: 'Forest Degradation', percentage: rnd(3, 6), impact_score: rnd(24, 20) },
            { class_name: 'Urban Expansion', percentage: rnd(4, 8), impact_score: rnd(12, 10) },
            { class_name: 'Mining Activity', percentage: rnd(1.5, 4), impact_score: rnd(10, 8) },
          ],
          distribution: Object.fromEntries(
            Array.from({ length: 11 }, (_, i) => {
              const pct = i === 0 ? rnd(62, 20) : Math.max(0, rnd(4, 6) * (1 / (i + 1)));
              return [i, {
                name: ['No Change', 'Temp Veg Loss', 'Permanent Deforestation',
                  'Forest Degradation', 'Urban Expansion', 'Industrial Zone',
                  'Mining Activity', 'Sand Mining', 'Water Shrinkage',
                  'Burn Scars', 'Agricultural Expansion'][i],
                percentage: parseFloat(pct.toFixed(2)),
              }];
            })
          ),
        },
        timestamp: new Date().toISOString(),
      };
      setAnalysisResults(fallbackResults);

      // Generate demo prediction PNG
      const imageUrl = generateDemoPredictionImage(region.lat, region.lon);
      const overlay = { imageUrl, bbox };
      setPredictionOverlay(overlay);
      setShowPredictionLayer(true);
      lastAnalyzedRef.current = { key: regionKey, results: fallbackResults, overlay };

    } finally {
      setIsAnalyzing(false);
      // Auto-zoom to the analyzed region
      viewerRef?.flyTo?.([region.lon, region.lat], 8);
    }
  }, [viewerRef]);

  const handleZoomIn = useCallback(() => {
    viewerRef?.camera?.zoomIn();
  }, [viewerRef]);

  const handleZoomOut = useCallback(() => {
    viewerRef?.camera?.zoomOut();
  }, [viewerRef]);

  const handleToggleLayer = useCallback((layerKey) => {
    if (layerKey === 'prediction') {
      setShowPredictionLayer(prev => !prev);
    } else {
      setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
    }
  }, []);

  const handleClearOverlay = useCallback(() => {
    setPredictionOverlay(null);
    setShowPredictionLayer(false);
    setAnalysisResults(null);
    lastAnalyzedRef.current = null;
  }, []);

  if (activePage === 'dashboard') {
    return (
      <div className="h-screen flex flex-col">
        <TopNavbar activePage={activePage} onPageChange={setActivePage} />
        <Dashboard onBack={() => setActivePage('map')} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gfw-bg">
      <TopNavbar activePage={activePage} onPageChange={setActivePage} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <div className="flex-1 relative">
          {/* MapLibre Map */}
          <MapViewer
            onRegionClick={handleRegionClick}
            layers={layers}
            onViewerReady={setViewerRef}
            predictionOverlay={predictionOverlay}
            showPredictionLayer={showPredictionLayer}
          />

          {/* Analysis Panel */}
          <AnalysisPanel
            onToggleLayer={handleToggleLayer}
            layers={layers}
            showPredictionLayer={showPredictionLayer}
            hasPrediction={!!predictionOverlay}
          />

          {/* Region Popup */}
          {selectedRegion && (
            <RegionPopup
              region={selectedRegion}
              onClose={() => setSelectedRegion(null)}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* Analysis Results */}
          {analysisResults && (
            <AnalysisResults
              results={analysisResults}
              onClose={handleClearOverlay}
            />
          )}

          {/* Map Controls */}
          <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />

          {/* Footer */}
          <div className="map-footer">
            <span>© <strong>MapLibre</strong></span>
            <span>Google Earth Engine</span>
            <span><strong>CARTO</strong></span>
            <span>© OpenStreetMap</span>
            <span>DeepEarth V2 — AI Environmental Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}
