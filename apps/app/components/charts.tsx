"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"

/** Tiny area trend for KPI cards — calm, no axes */
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
    <div className={className} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke="var(--primary)"
            strokeWidth={1.6}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
