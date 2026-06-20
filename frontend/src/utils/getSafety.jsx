const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function getSafety(lat, lng, radius) {
  try {
    const res = await fetch(`${BACKEND_URL}/safetyInRadius`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ geoPoint: { lat, lng }, radius }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
