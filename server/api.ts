const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  responseType: "json" | "blob" = "json"
): Promise<T> {
  const res = await fetch(`${API_URL}/api${url}`, {
    ...options,
    credentials: "include", // 🔥 REQUIRED for cookie auth
    headers: {
      ...(responseType === "json" && { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let errorMessage = "Request failed";

    try {
      const data = await res.json();
      errorMessage = data.message || errorMessage;
    } catch {
      const text = await res.text();
      if (text) errorMessage = text;
    }

    // ✅ Do NOT spam console for expected auth errors
    if (res.status !== 401) {
      console.error(`API ERROR → ${url}:`, errorMessage);
    }

    throw new Error(errorMessage);
  }

  if (responseType === "blob") {
    return (await res.blob()) as T;
  }

  return (await res.json()) as T;
}
