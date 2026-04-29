"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DIMENSION_LABELS, type DimensionKey } from "@/lib/aggregations";
import { formatMonth } from "@/lib/format";

interface Point {
  month: string;
  [key: string]: number | string;
}

interface Props {
  data: Point[];
  dimensions: DimensionKey[];
}

// Data-viz palette per design system §73 — ax-data-1..6
const COLORS: Record<string, string> = {
  relevance: "#1D2F5E", // ax-ink-800
  engagement: "#F3B230", // ax-amber-400
  facilitator_effectiveness: "#2275AA", // ax-cobalt
  applicability: "#3CB3D6", // ax-cyan
  culture_fit: "#6B7796", // ax-ink-400
};

const TICK_STYLE = {
  fontSize: 10,
  fill: "#6B7796",
  fontFamily: "var(--ax-font-mono)",
};

export function DimensionTrendChart({ data, dimensions }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#E6E9F0"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[1, 5]}
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          labelFormatter={formatMonth}
          formatter={(v: number, name: string) => [
            v.toFixed(2),
            DIMENSION_LABELS[name as DimensionKey] ?? name,
          ]}
          contentStyle={{
            background: "#0F1A38",
            border: "none",
            borderRadius: 4,
            color: "#FBFAF6",
            fontSize: 12,
            fontFamily: "var(--ax-font-mono)",
          }}
          itemStyle={{ color: "#FBFAF6" }}
          labelStyle={{ color: "#C8CEDD" }}
        />
        <Legend
          formatter={(name) => (
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-500">
              {DIMENSION_LABELS[name as DimensionKey] ?? name}
            </span>
          )}
          iconType="circle"
          wrapperStyle={{ paddingTop: 12 }}
        />
        {dimensions.map((d) => (
          <Line
            key={d}
            type="monotone"
            dataKey={d}
            stroke={COLORS[d] ?? "#1D2F5E"}
            strokeWidth={1.75}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
