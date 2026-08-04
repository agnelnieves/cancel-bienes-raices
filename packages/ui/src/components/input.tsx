import * as React from "react"

import { cn } from "../lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Calm surface: white fill + hairline border (not a beige fill)
        "h-10 w-full min-w-0 rounded-xl border border-input bg-background px-3.5 py-2 text-base transition-[color,box-shadow,border-color] outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground/70",
        "hover:border-foreground/25",
        "focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-foreground/10",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
