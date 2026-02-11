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
    credentials: "include",
    headers: {
      ...(responseType === "json" && {
        "Content-Type": "application/json",
      }),
      ...options.headers,
    },
  });

  // ✅ READ BODY ONLY ONCE
  let data: any = null;

  try {
    data =
      responseType === "blob"
        ? await res.blob()
        : await res.json();
  } catch {
    data = null;
  }

  // ❌ HANDLE ERRORS USING SAME BODY
  if (!res.ok) {
    const message =
      (data && data.message) || "Request failed";

    if (res.status !== 401) {
      console.error(`API ERROR → ${url}:`, message);
    }

    throw new Error(message);
  }

  return data as T;
}
