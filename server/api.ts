/* ================= API CONFIG ================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  // "http://localhost:5000"; // local fallback
  "https://saas-billz-backend.onrender.com"; // local fallback

if (!API_URL) {
  console.error("NEXT_PUBLIC_API_URL not defined");
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
      credentials: "include", // required for cookies
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

    const contentType = res.headers.get("content-type") || "";

    let data: any = null;

    if (responseType === "blob") {
      data = await res.blob();
    } else if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      // If backend returns HTML (Vercel 404, wrong URL, etc.)
      const text = await res.text();

      throw new Error(
        `Invalid server response. Check backend URL or deployment.`
      );
    }

    /* ================= HANDLE API ERROR ================= */

    if (!res.ok) {
      const message = data?.message || `Error ${res.status}`;
      throw new Error(message);
    }

    return data as T;

  } catch (error: any) {

    /* ================= EXPECTED USER ERRORS ================= */

    const expectedErrors = [
      "Not authorized, please login",
      "Upgrade to access analytics",
      "User already exists",
      "Invalid email or password",
    ];

    if (
      !expectedErrors.includes(error.message) &&
      !(error instanceof TypeError)
    ) {
      console.error("API ERROR:", error.message);
    }

    /* ================= NETWORK ERROR ================= */

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to server. Please check backend deployment."
      );
    }

    throw error;
  }
}
