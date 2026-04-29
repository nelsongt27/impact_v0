"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Item {
  name: string;
  value: number;
}

interface Props {
  data: Item[];
  height?: number;
  color?: string;
  valueLabel?: string;
  highlightFirst?: boolean;
}

const TICK_LABEL = {
  fontSize: 10,
  fill: "#6B7796",
  fontFamily: "var(--ax-font-mono)",
};
const ROW_LABEL = {
  fontSize: 12,
  fill: "#0F1A38",
  fontFamily: "var(--ax-font-sans-loaded), Albert Sans, sans-serif",
};

export function HorizontalBarChart({
  data,
  height = 320,
  color = "#1D2F5E",
  valueLabel = "value",
  highlightFirst = true,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} stroke="#E6E9F0" />
        <XAxis
          type="number"
          tick={TICK_LABEL}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={170}
          tick={ROW_LABEL}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(v: number) => [v, valueLabel]}
          cursor={{ fill: "rgba(29, 47, 94, 0.04)" }}
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
        <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={10}>
          {data.map((_, idx) => (
            <Cell
              key={idx}
              fill={highlightFirst && idx === 0 ? "#F3B230" : color}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
