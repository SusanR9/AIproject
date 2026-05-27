const API_BASE = "https://aiproject-hee3.onrender.com/api";

export async function fetchAllRegistrations() {
  const response = await fetch(`${API_BASE}/registrations/`);

  if (!response.ok) {
    throw new Error("Failed to fetch registrations");
  }

  return await response.json();
}

export async function fetchCompetitions() {
  const response = await fetch(`${API_BASE}/competitions/`);

  if (!response.ok) {
    throw new Error("Failed to fetch competitions");
  }

  return await response.json();
}