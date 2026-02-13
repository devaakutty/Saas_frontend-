/* ================= API CONFIG ================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"; // fallback for local dev

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn("Using local API fallback:", API_URL);
}

/* ================= API FETCH ================= */

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  responseType: "json" | "blob" = "json"
): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    /* ================= HANDLE NO CONTENT ================= */

    if (res.status === 204) {
      return null as T;
    }

    /* ================= SAFE RESPONSE PARSE ================= */

    let data: any = null;

    if (responseType === "blob") {
      data = await res.blob();
    } else {
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();

        // Backend returned HTML (wrong URL, 404 page, etc.)
        throw new Error(
          "Invalid server response. Check backend URL or deployment."
        );
      }
    }

    /* ================= HANDLE API ERROR ================= */

    if (!res.ok) {
      const message = data?.message || `Error ${res.status}`;

      // Do NOT spam console for normal auth errors
    if (!res.ok) {
      const message = data?.message || `Error ${res.status}`;

      const expectedErrors = [
        "Not authorized, please login",
        "Upgrade to access analytics",
        "Upgrade required",
        "Plan limit exceeded",
      ];

      // Only log real system errors
      if (!expectedErrors.includes(message) && res.status >= 500) {
        console.error("API ERROR:", message);
      }

      throw new Error(message);
    }
      throw new Error(message);
    }

    return data as T;
  } catch (error: any) {
    /* ================= NETWORK ERROR ================= */

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to server. Check backend deployment or API URL."
      );
    }

    throw error;
  }
}
