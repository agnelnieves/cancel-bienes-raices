"use client"

import { History, MessageSquarePlus, Trash2 } from "lucide-react"

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@cancel/ui"

import { useAssistantStore } from "@/lib/stores/assistant"

function formatRelativeTime(ts: number): string {
  const diffMin = Math.round((Date.now() - ts) / 60_000)
  if (diffMin < 1) return "ahora"
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffH = Math.round(diffMin / 60)
  if (diffH < 24) return `hace ${diffH} h`
  const diffD = Math.round(diffH / 24)
  if (diffD === 1) return "ayer"
  if (diffD < 7) return `hace ${diffD} d`
  return new Intl.DateTimeFormat("es-PR", { day: "numeric", month: "short" }).format(
    new Date(ts)
  )
}

/** Past conversations — resuming one archives whatever is active first. */
export function HistoryMenu() {
  const messages = useAssistantStore((s) => s.messages)
  const history = useAssistantStore((s) => s.history)
  const openSession = useAssistantStore((s) => s.openSession)
  const deleteSession = useAssistantStore((s) => s.deleteSession)
  const clear = useAssistantStore((s) => s.clear)

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Historial de conversaciones"
              className="text-muted-foreground hover:text-foreground"
            >
              <History className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Historial</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onSelect={() => clear()} disabled={messages.length === 0}>
          <MessageSquarePlus className="size-4" />
          Nueva conversación
        </DropdownMenuItem>
        {history.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Recientes</DropdownMenuLabel>
            {history.map((session) => (
              <DropdownMenuItem
                key={session.id}
                onSelect={() => openSession(session.id)}
                className="group/history-item"
              >
                <span className="min-w-0 flex-1 truncate">{session.title}</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {formatRelativeTime(session.updatedAt)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                  aria-label="Eliminar conversación"
                  className={cn(
                    "shrink-0 rounded-lg p-1 text-muted-foreground/60 opacity-0 transition-opacity hover:text-destructive group-hover/history-item:opacity-100"
                  )}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </DropdownMenuItem>
            ))}
          </>
        )}
        {history.length === 0 && (
          <p className="px-3 py-4 text-center text-xs text-muted-foreground">
            Tus conversaciones anteriores aparecerán aquí.
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
