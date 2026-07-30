"use client"

import * as React from "react"

/** Markdown mínimo: **negrita**, saltos de línea y bullets */
export function MarkdownLite({ text }: { text: string }) {
  const lines = text.split("\n")
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />
        const isBullet = line.trim().startsWith("•")
        const content = renderInline(line.trim().replace(/^•\s*/, ""))
        return (
          <p
            key={i}
            className={isBullet ? "flex gap-2" : undefined}
          >
            {isBullet && <span className="text-primary">•</span>}
            <span className="min-w-0">{content}</span>
          </p>
        )
      })}
    </div>
  )
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}
