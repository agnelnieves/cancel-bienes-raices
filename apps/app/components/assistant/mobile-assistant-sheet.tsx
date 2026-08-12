"use client"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@cancel/ui"

import { AssistantPanel } from "./assistant-panel"
import { HistoryMenu } from "./history-menu"
import type { AssistantController } from "./use-assistant-controller"

/**
 * Full-height bottom drawer for viewports too narrow for a docked column or
 * a floating window. Grab handle + spring slide-up feel native, like a
 * native sheet — no dock-mode switcher here, floating has no room to exist.
 */
export function MobileAssistantSheet({
  controller,
}: {
  controller: AssistantController
}) {
  const { open, setOpen } = controller

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[92vh] max-w-none gap-0 border-t-0 p-0 sm:rounded-t-2xl"
      >
        <SheetTitle className="sr-only">Copiloto Cancel</SheetTitle>
        <SheetDescription className="sr-only">
          Tu asistente de inversión
        </SheetDescription>
        <div className="mx-auto shrink-0 pt-2.5 pb-1">
          <div className="h-1 w-9 rounded-full bg-border" />
        </div>
        <AssistantPanel
          controller={controller}
          onRequestClose={() => setOpen(false)}
          headerActions={<HistoryMenu />}
          autoFocus={false}
          className="min-h-0 flex-1"
        />
      </SheetContent>
    </Sheet>
  )
}
