/* ================= API CONFIG ================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://saas-billz-backend.onrender.com";

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn("Using fallback API URL:", API_URL);
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
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    /* ========== HANDLE 204 ========== */

    if (res.status === 204) {
      return null as T;
    }

    /* ========== SAFE PARSE ========== */

    let data: any = null;

    if (responseType === "blob") {
      data = await res.blob();
    } else {
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error(
          "Invalid server response. Check backend deployment."
        );
      }
    }

    /* ========== HANDLE API ERROR ========== */

    if (!res.ok) {
      const message = data?.message || `Error ${res.status}`;

      const expectedErrors = [
        "Not authorized, please login",
        "Upgrade to access analytics",
        "Upgrade required",
        "Plan limit exceeded",
      ];

      if (!expectedErrors.includes(message) && res.status >= 500) {
        console.error("API ERROR:", message);
      }

      throw new Error(message);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to server. Check backend deployment or API URL."
      );
    }

    throw error;
  }
}
