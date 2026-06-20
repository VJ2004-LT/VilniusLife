const BACKEND_URL = import.meta.env.VITE_API_URL;

export function parseSavedLocation(loc) {
  return {
    ...loc,
    address: loc.address && typeof loc.address === 'string' ? JSON.parse(loc.address) : (loc.address ?? null),
    avgNoiseLevel: loc.avgNoiseLevel && typeof loc.avgNoiseLevel === 'string' ? JSON.parse(loc.avgNoiseLevel) : (loc.avgNoiseLevel ?? null),
    schools: loc.schools && typeof loc.schools === 'string' ? JSON.parse(loc.schools) : (loc.schools ?? []),
    routeInfos: loc.routeInfos && typeof loc.routeInfos === 'string' ? JSON.parse(loc.routeInfos) : (loc.routeInfos ?? []),
  };
}

export async function getSavedLocations() {
  const res = await fetch(`${BACKEND_URL}/savedLocations`, { credentials: 'include' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map(parseSavedLocation);
}

export async function saveLocation(lat, lng, category, noiseLevel, safetyLevel, address, schools, routeInfos) {
  const res = await fetch(`${BACKEND_URL}/saveLocation`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      lat, 
      lng, 
      avgNoiseLevel: noiseLevel ? JSON.stringify(noiseLevel) : null,
      riskScore: safetyLevel ? safetyLevel : null,
      address: address ? JSON.stringify(address) : null,
      schools: schools ? JSON.stringify(schools) : null,
      routeInfos: routeInfos ? JSON.stringify(routeInfos) : null,
    })
  });
  if (!res.ok) return null;
  return res.json();

}

export async function deleteSavedLocation(id) {
  const res = await fetch(`${BACKEND_URL}/savedLocations/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return res.ok;

}
