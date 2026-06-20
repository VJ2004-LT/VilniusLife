const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function getAddress(lat, lng) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reverse?lat=${lat}&lon=${lng}`);
    if (!res.ok) return { error: true };
    const data = await res.json();
    return data.features[0]?.properties ?? { error: true };
  } catch (e) {
    return { error: true };
  }
}
