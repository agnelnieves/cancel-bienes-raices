"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function Sparkline({
  data,
  className,
  id,
}: {
  data: number[]
  className?: string
  id: string
}) {
  const points = data.map((v, i) => ({ i, v }))
  const gradientId = `spark-${id}`
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke="var(--primary)"
            strokeWidth={1.8}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/** shadcn-style area chart — pipeline value over recent months */
export function PipelineAreaChart({
  data,
  valueFormatter,
}: {
  data: { label: string; value: number }[]
  valueFormatter?: (v: number) => string
}) {
  const format = valueFormatter ?? ((v: number) => `$${Math.round(v / 1000)}K`)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="pipeline-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="3 3"
          strokeOpacity={0.7}
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickMargin={4}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickFormatter={(v: number) => format(v)}
        />
        <Tooltip
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--card)",
            boxShadow: "0 4px 16px -4px rgb(34 34 34 / 0.08)",
            fontSize: 12,
            padding: "8px 12px",
          }}
          labelStyle={{ color: "var(--muted-foreground)", marginBottom: 2 }}
          formatter={(value) => [
            format(typeof value === "number" ? value : Number(value)),
            "Pipeline",
          ]}
        />
        <Area
          type="natural"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#pipeline-fill)"
          isAnimationActive
          animationDuration={600}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
