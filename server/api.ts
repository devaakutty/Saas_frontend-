/* ================= API CONFIG ================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://saas-billz-backend.onrender.com";

/* ================= API FETCH ================= */

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  responseType: "json" | "blob" = "json"
): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;

  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      credentials: "include", // 🔥 VERY IMPORTANT
      mode: "cors",           // 🔥 EXPLICIT CORS
      cache: "no-store",      // 🔥 disable caching (fix 304 issues)
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      },
      body: options.body,
    });

    /* ========== HANDLE 204 ========== */

    if (res.status === 204) {
      return null as T;
    }

    /* ========== PARSE RESPONSE ========== */

    let data: any = null;

    if (responseType === "blob") {
      data = await res.blob();
    } else {
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Invalid server response.");
      }
    }

    /* ========== HANDLE ERROR ========== */

    if (!res.ok) {
      throw new Error(data?.message || `Error ${res.status}`);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof TypeError) {
      throw new Error("Cannot connect to server.");
    }

    throw error;
  }
}
