const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function getRouteSafety(osrmRoute) {
  try {
    const route = osrmRoute.legs[0].steps
      .filter(step => step.name)
      .map(step => ({
        name: step.name,
        coordinates: step.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
      }));

    const response = await fetch(`${BACKEND_URL}/routeSafety`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ route })
    });

    if (!response.ok) throw new Error(`Route safety request failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('getRouteSafety error:', error);
    return null;
  }
}
