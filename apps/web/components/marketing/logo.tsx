import { cn } from "@cancel/ui"

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string
  markClassName?: string
  wordmarkClassName?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-[10px] bg-primary font-heading text-[15px] font-bold tracking-tight text-primary-foreground shadow-[0_1px_2px_rgb(29_158_117/0.25)]",
          markClassName
        )}
      >
        C
      </span>
      <span
        className={cn(
          "font-heading text-[17px] font-bold tracking-tight text-foreground",
          wordmarkClassName
        )}
      >
        Cancel
        <span className="text-primary">.</span>
      </span>
    </span>
  )
}
