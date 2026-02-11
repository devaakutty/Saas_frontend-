"use client";

export default function ProfilePage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">
        Profile
      </h1>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">
            Name
          </label>
          <input
            value="Admin User"
            disabled
            className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Email
          </label>
          <input
            value="admin@quickbillz.com"
            disabled
            className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Role
          </label>
          <input
            value="Administrator"
            disabled
            className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
