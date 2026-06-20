const BACKEND_URL = import.meta.env.VITE_API_URL;

export async function getProblems() {
  try {
    const res = await fetch(`${BACKEND_URL}/problems`);
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getProblem(problemId) {
  try {
    const res = await fetch(`${BACKEND_URL}/problem?problemId=${problemId}`);
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}
