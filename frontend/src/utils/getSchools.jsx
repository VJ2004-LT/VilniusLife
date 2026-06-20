const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function getSchools(street, houseNumber, languages, schoolClass) {
  try {
    const res = await fetch(`${BACKEND_URL}/schoolsByAddress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        street,
        houseNumber,
        schoolLanguages: languages,
        schoolClass,
      }),
    });
    const data = await res.json();
    if (!res.ok) return { error: "Server error" };
    if (!data.length) return { error: "No schools found for this address." };
    return data;
  } catch (e) {
    return { error: "Server error." };
  }
}
