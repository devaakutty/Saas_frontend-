"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ===== Dummy chart data ===== */
const chartData = [
  { name: "Jan", projects: 12 },
  { name: "Feb", projects: 19 },
  { name: "Mar", projects: 8 },
  { name: "Apr", projects: 15 },
  { name: "May", projects: 22 },
];

/* ===== Dummy table data ===== */
const projects = [
  { id: "PR-01", name: "Landing Page", status: "Completed" },
  { id: "PR-02", name: "Admin Dashboard", status: "Running" },
  { id: "PR-03", name: "Mobile App UI", status: "Cancelled" },
];

export default function CategoryReportPage({
  params,
}: {
  params: { slug: string };
}) {
  const titleMap: Record<string, string> = {
    design: "Website Design",
    development: "Development",
    branding: "Brand Identity",
    marketing: "Marketing",
  };

  const title = titleMap[params.slug] || "Category";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        {title} Projects
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Total Projects" value="120" />
        <StatCard label="Running" value="42" />
        <StatCard label="Completed" value="78" />
      </div>

      {/* BAR CHART */}
      <div className="bg-white border rounded-xl p-6 h-[320px]">
        <h3 className="font-semibold mb-4">
          Monthly Projects
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="projects" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PROJECT TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Project ID</th>
              <th className="p-3 text-left">Project Name</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : p.status === "Running"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== SMALL CARD ===== */
function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
