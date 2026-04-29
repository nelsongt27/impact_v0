"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Slice {
  name: string;
  value: number;
}

// Data-viz palette per design system §73
const PALETTE = [
  "#1D2F5E", // ink-800
  "#F3B230", // amber-400
  "#2275AA", // cobalt
  "#3CB3D6", // cyan
  "#6B7796", // ink-400
  "#F9DC8A", // amber-200
  "#99A3BC", // ink-300
  "#FCEDC2", // amber-100
];

export function FamilyDonut({ data }: { data: Slice[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={88}
          paddingAngle={2}
          stroke="#FBFAF6"
          strokeWidth={1.5}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#0F1A38",
            border: "none",
            borderRadius: 4,
            color: "#FBFAF6",
            fontSize: 12,
            fontFamily: "var(--ax-font-mono)",
          }}
          itemStyle={{ color: "#FBFAF6" }}
        />
        <Legend
          iconType="square"
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--ax-font-mono)" }}
          formatter={(name) => (
            <span className="text-[11px] text-ink-700">{name}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
