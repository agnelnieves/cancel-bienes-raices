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
        "flex min-h-24 w-full rounded-2xl border border-input/70 bg-input/40 px-3.5 py-2.5 text-sm shadow-sm transition-[color,box-shadow,background-color,border-color] outline-none placeholder:text-muted-foreground/80 hover:border-input focus-visible:border-ring focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
