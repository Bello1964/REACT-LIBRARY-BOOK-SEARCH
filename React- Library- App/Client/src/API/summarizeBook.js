
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function summarizeBook({ title, author }) {
  const response = await fetch(`${API_BASE_URL}/api/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, author }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Could not summarize this book.");
  }

  return data;
}
