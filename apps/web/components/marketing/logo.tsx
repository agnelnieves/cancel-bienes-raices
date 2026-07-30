import { cn } from "@cancel/ui"

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-8 items-center justify-center rounded-[10px] bg-primary font-heading text-[15px] font-extrabold tracking-tight text-primary-foreground">
        C
      </span>
      <span className="font-heading text-[17px] font-bold tracking-tight">
        Cancel
        <span className="text-primary">.</span>
      </span>
    </span>
  )
}
