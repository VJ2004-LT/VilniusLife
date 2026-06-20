const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function getNoise(lat, lng) {
  try {
    const res = await fetch(`${BACKEND_URL}/noiseMeasurement?lat=${lat}&lon=${lng}`, {
      method: "GET",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data ?? null;
  } catch {
    return null;
  }
}
