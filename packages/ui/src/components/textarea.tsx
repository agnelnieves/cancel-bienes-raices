import * as React from "react"

import { cn } from "../lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm transition-[color,box-shadow,border-color] outline-none",
        "placeholder:text-muted-foreground/70",
        "hover:border-foreground/25",
        "focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-foreground/10",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
