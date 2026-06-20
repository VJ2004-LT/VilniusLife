import { VILNIUS_BOUNDS } from '../constants/mapConfig';

const bbox = `${VILNIUS_BOUNDS[0][1]},${VILNIUS_BOUNDS[0][0]},${VILNIUS_BOUNDS[1][1]},${VILNIUS_BOUNDS[1][0]}`;
const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function getGPS(query) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/geocode?q=${encodeURIComponent(query)}`);
    if (!res.ok) return { error: true };
    const data = await res.json();
    const feature = data.features[0];
    if (!feature) return null;
    return {
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      ...feature.properties,
    };
  } catch (e) {
    return { error: true };
  }
}
