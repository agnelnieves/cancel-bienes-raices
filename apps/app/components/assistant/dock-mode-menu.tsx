"use client"

import { Check, PanelRight, PictureInPicture2 } from "lucide-react"

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cancel/ui"

import { useAssistantStore, type AssistantDockMode } from "@/lib/stores/assistant"

const MODES: { value: AssistantDockMode; label: string; icon: typeof PanelRight }[] = [
  { value: "sidebar", label: "Anclado", icon: PanelRight },
  { value: "floating", label: "Flotante", icon: PictureInPicture2 },
]

/** Lets the assistant live docked beside the content or floating over it. */
export function DockModeMenu() {
  const dockMode = useAssistantStore((s) => s.dockMode)
  const setDockMode = useAssistantStore((s) => s.setDockMode)
  const ActiveIcon = MODES.find((m) => m.value === dockMode)?.icon ?? PanelRight

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Modo de ventana"
              className="text-muted-foreground hover:text-foreground"
            >
              <ActiveIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Modo de ventana</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-44">
        {MODES.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onSelect={() => setDockMode(value)}>
            <Icon className="size-4" />
            {label}
            {dockMode === value && <Check className="ml-auto size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
