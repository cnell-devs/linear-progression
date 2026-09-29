const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Single place that knows how to attach the token and unwrap an error body,
// so callers can just await a parsed response or catch a real Error.
export const api = async (path, { method = "GET", body, signal } = {}) => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}${path}`, {
    method,
    signal,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  // Sessions now expire, and a token for a deleted user is rejected outright.
  // Clear the dead credential and send them to sign in, rather than letting
  // every screen surface its own confusing error.
  if (response.status === 401 && token) {
    localStorage.removeItem("authToken");
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
    throw new Error("Your session expired. Please log in again.");
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const detail = contentType.includes("application/json")
      ? (await response.json())?.error
      : await response.text();
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  // Tolerate empty bodies (204s, and any handler that answers with no content)
  // rather than throwing an opaque JSON parse error.
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
