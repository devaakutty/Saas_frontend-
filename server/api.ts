/* ================= API CONFIG ================= */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= API FETCH ================= */

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  responseType: "json" | "blob" = "json"
): Promise<T> {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    throw new Error("API configuration error");
  }

  try {
    const res = await fetch(`${API_URL}/api${url}`, {
      ...options,
      credentials: "include", // ✅ required for cookies
      headers: {
        ...(responseType === "json" && {
          "Content-Type": "application/json",
        }),
        ...options.headers,
      },
    });

    let data: any = null;

    try {
      data =
        responseType === "blob"
          ? await res.blob()
          : await res.json();
    } catch {
      data = null;
    }

    /* ================= HANDLE API ERRORS ================= */

    if (!res.ok) {
      const message =
        (data && data.message) || "Request failed";

      // ✅ Only log real server errors (500+)
      if (res.status >= 500) {
        console.error(
          `SERVER ERROR → ${url}:`,
          message
        );
      }

      // Do NOT log 401 or 403 (normal SaaS flow)
      throw new Error(message);
    }

    return data as T;

  } catch (error: any) {
    // ✅ Only log real network failures
    if (error.name === "TypeError") {
      console.error("Network connection error");
    }

    throw error;
  }
}
