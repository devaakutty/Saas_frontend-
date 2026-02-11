"use client";

import { useState } from "react";

/* ================= TYPES ================= */
interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  visible: boolean;
}

/* ================= HELPERS ================= */
const maskKey = (key: string) =>
  "••••••••••••••••" + key.slice(-4);

/* ================= PAGE ================= */
export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production key",
      key: "sk_live_xxxxxxxxxxxxx",
      createdAt: "2024-02-10",
      visible: false,
    },
    {
      id: "2",
      name: "Development key",
      key: "sk_test_xxxxxxxxxxxxx",
      createdAt: "2024-02-12",
      visible: false,
    },
  ]);

  /* ================= ACTIONS ================= */

  const generateKey = () => {
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: "New API key",
      key: `sk_${Math.random().toString(36).substring(2, 22)}`,
      createdAt: new Date().toISOString().split("T")[0],
      visible: false,
    };

    setKeys((prev) => [newKey, ...prev]);
  };

  const toggleVisibility = (id: string) => {
    if (!confirm("Reveal this API key? Keep it secret.")) return;

    setKeys((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, visible: true } : k
      )
    );

    // ⏱ auto-hide after 5 seconds
    setTimeout(() => {
      setKeys((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, visible: false } : k
        )
      );
    }, 5000);
  };

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    alert("API key copied to clipboard");
  };

  const revokeKey = (id: string) => {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">API Keys</h1>

        <button
          onClick={generateKey}
          className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded"
        >
          + Generate key
        </button>
      </div>

      <div className="bg-[#11141c] border border-white/10 rounded-xl overflow-hidden max-w-4xl">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Key</th>
              <th className="p-4 text-center">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {keys.map((key) => (
              <tr
                key={key.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="p-4 font-medium">
                  {key.name}
                </td>

                <td className="p-4 font-mono text-xs">
                  {key.visible ? key.key : maskKey(key.key)}
                </td>

                <td className="p-4 text-center text-gray-400">
                  {key.createdAt}
                </td>

                <td className="p-4 flex gap-3 justify-center">
                  <button
                    onClick={() => toggleVisibility(key.id)}
                    className="text-indigo-400 hover:underline text-xs"
                  >
                    Show
                  </button>

                  <button
                    onClick={() => copyKey(key.key)}
                    className="text-green-400 hover:underline text-xs"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => revokeKey(key.id)}
                    className="text-red-400 hover:underline text-xs"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}

            {keys.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-500"
                >
                  No API keys generated
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SECURITY NOTE */}
      <p className="text-xs text-gray-500 mt-4 max-w-3xl">
        Keep your API keys secret. Do not share them publicly or commit them to
        version control. Keys are shown only briefly for security.
      </p>
    </div>
  );
}
