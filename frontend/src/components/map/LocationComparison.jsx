import { useState, useEffect, useRef } from "react";
import { getSavedLocations } from "../../utils/savedLocations";
import { formatAddress } from "../../utils/formatResponse";

function midpoint(range) {
  if (!range) return null;
  const [min, max] = range.split('-').map(Number);
  return isNaN(max) ? null : (min + max) / 2;
}

function combineDecibels(values) {
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + Math.pow(10, b / 10), 0);
  return 10 * Math.log10(sum);
}

function LocationComparison({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [compareOn, setCompareOn] = useState([]);
  const [results, setResults] = useState(null);
  const compareOrderRef = useRef([]);

  useEffect(() => {
    getSavedLocations().then(setSavedLocations);
  }, []);

  function toggleLocation(id) {
    setSelectedLocations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function toggleCompare(key) {
    setCompareOn(prev => {
      if (prev.includes(key)) {
        compareOrderRef.current = compareOrderRef.current.filter(x => x !== key);
        return prev.filter(x => x !== key);
      } else {
        compareOrderRef.current = [...compareOrderRef.current, key];
        return [...prev, key];
      }
    });
  }

  function handleCompare() {
    if (selectedLocations.length < 2) {
      setError("Select at least 2 locations to compare.");
      return;
    }
    if (compareOn.length === 0) {
      setError("Select at least one comparison criteria.");
      return;
    }
    setError(null);

    const locs = savedLocations.filter(l => selectedLocations.includes(l.locationId));

    const annotated = locs.map(loc => {
      const result = { ...loc };

      if (compareOn.includes('noise')) {
        const n = loc.avgNoiseLevel;
        const noiseValues = [
          midpoint(n?.dayCarNoiseLevel),
          midpoint(n?.nightCarNoiseLevel),
          midpoint(n?.railwayNoiseLevel),
          midpoint(n?.airportNoiseLevel),
        ].filter(v => v !== null);
        result.noiseScore = noiseValues.length > 0 ? combineDecibels(noiseValues) : null;
      }

      if (compareOn.includes('schools')) {
        const routes = loc.routeInfos ?? [];
        const allRoutes = routes.flat().filter(r => !r.error);
        result.shortestRoute = allRoutes.length > 0
          ? Math.min(...allRoutes.map(r => r.duration))
          : null;
      }

      if (compareOn.includes('safety')) {
        const routes = loc.routeInfos ?? [];
        const allRoutes = routes.flat().filter(r => !r.error && r.safety != null);
        result.bestSafety = allRoutes.length > 0
          ? Math.max(...allRoutes.map(r => r.safety))
          : null;
      }

      return result;
    });

    const ranked = [...annotated].sort((a, b) => {
      for (const criterion of compareOrderRef.current) {
        let diff = 0;
        if (criterion === 'noise') {
          if (a.noiseScore === null && b.noiseScore === null) diff = 0;
          else if (a.noiseScore === null) diff = 1;
          else if (b.noiseScore === null) diff = -1;
          else diff = a.noiseScore - b.noiseScore;
        } else if (criterion === 'schools') {
          if (a.shortestRoute === null && b.shortestRoute === null) diff = 0;
          else if (a.shortestRoute === null) diff = 1;
          else if (b.shortestRoute === null) diff = -1;
          else diff = Math.round(a.shortestRoute / 60) - Math.round(b.shortestRoute / 60);
        } else if (criterion === 'safety') {
          if (a.bestSafety === null && b.bestSafety === null) diff = 0;
          else if (a.bestSafety === null) diff = 1;
          else if (b.bestSafety === null) diff = -1;
          else diff = b.bestSafety - a.bestSafety;
        }
        if (diff !== 0) return diff;
      }
      return 0;
    });

    setResults(ranked);
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
      <div className="panel w-96 p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold">Compare locations</p>
          <button onClick={onClose} className=" hover:text-black cursor-pointer">✕</button>
        </div>

        <p className="text-xs font-semibold mb-1">Select locations</p>
        <div className="border rounded p-2 mb-3 flex flex-col gap-1">
          {savedLocations.map((loc, i) => (
            <label key={loc.locationId} className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLocations.includes(loc.locationId)}
                onChange={() => toggleLocation(loc.locationId)}
              />
              {i + 1}. {formatAddress(loc.address) ?? `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}
            </label>
          ))}
        </div>

        <p className="text-xs font-semibold mb-1">Compare on</p>
        <div className="border rounded p-2 mb-3 flex flex-col gap-1">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={compareOn.includes('noise')}
              onChange={() => toggleCompare('noise')}
            />
            Noise levels
          </label>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={compareOn.includes('schools')}
              onChange={() => toggleCompare('schools')}
            />
            Distance to school
          </label>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={compareOn.includes('safety')}
              onChange={() => toggleCompare('safety')}
            />
            Route safety
          </label>
        </div>

        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

        {results && (
          <div className="border rounded p-2 mb-3 flex flex-col gap-1">
            <p className="text-xs font-semibold mb-1">Results (best to worst)</p>
            {results.map((loc, i) => (
              <div key={loc.locationId} className="text-xs flex justify-between">
                <span className="max-w-48 break-words">
                  {savedLocations.findIndex(l => l.locationId === loc.locationId) + 1}. {formatAddress(loc.address) ?? `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}
                </span>
                <span className="ml-2 flex gap-2">
                  {loc.noiseScore !== undefined && <span>{loc.noiseScore?.toFixed(1) ?? 'N/A'} dB</span>}
                  {loc.shortestRoute !== undefined && <span>{loc.shortestRoute !== null ? `${Math.round(loc.shortestRoute / 60)} min` : 'N/A'}</span>}
                  {loc.bestSafety !== undefined && <span>{loc.bestSafety !== null ? `${loc.bestSafety}/100` : 'N/A'}</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleCompare}
          className="mt-2 w-full py-1 rounded bg-primary text-white text-sm cursor-pointer hover:bg-secondary"
          disabled={loading}
        >
          {loading ? 'Comparing locations...' : 'Compare'}
        </button>
      </div>
    </div>
  );
}

export default LocationComparison;
