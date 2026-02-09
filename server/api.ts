const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  responseType: "json" | "blob" = "json"
): Promise<T> {
  console.log("API CALL →", `${API_URL}/api${url}`);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_URL}/api${url}`, {
    ...options,
    headers: {
      ...(responseType === "json" && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const msg = await res.text();
    console.error("API ERROR →", url, msg);
    throw new Error(msg || `Request failed (${res.status})`);
  }

  // Support blob if needed later (PDF invoices etc.)
  if (responseType === "blob") {
    return (await res.blob()) as T;
  }

  return (await res.json()) as T;
}
