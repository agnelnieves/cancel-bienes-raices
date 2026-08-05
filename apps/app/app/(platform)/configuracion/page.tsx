"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { BadgeCheck, Check, Monitor, Moon, RotateCcw, Sun, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { zones } from "@cancel/data"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  cn,
} from "@cancel/ui"

import { PageHeader } from "@/components/page-header"
import { useUserStore } from "@/lib/stores/user"

export default function ConfiguracionPage() {
  const { theme, setTheme } = useTheme()
  const { profile, setProfile } = useUserStore()
  const [notifs, setNotifs] = React.useState({
    cashDeals: true,
    dealActivity: true,
    weeklyDigest: false,
  })

  const resetDemo = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("cbr-"))
      .forEach((k) => localStorage.removeItem(k))
    toast.success("Demo restablecido — volviendo al onboarding")
    setTimeout(() => window.location.reload(), 500)
  }

  const themeOptions = [
    { id: "light", label: "Claro", icon: Sun },
    { id: "dark", label: "Oscuro", icon: Moon },
    { id: "system", label: "Sistema", icon: Monitor },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <PageHeader
        title="Configuración"
        description="Tu cuenta y preferencias"
      />

      {/* Perfil */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">Tu perfil</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Con esto personalizamos tu pulso de mercado y las alertas.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ name: e.target.value })}
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Zona principal</Label>
              <Select
                value={profile.zones[0] ?? ""}
                onValueChange={(v) => setProfile({ zones: [v, ...profile.zones.filter((z) => z !== v)] })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escoge una zona" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((z) => (
                    <SelectItem key={z.id} value={z.id}>
                      {z.name}, {z.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tus estrategias:{" "}
            <strong className="text-foreground">
              {profile.strategies.join(", ") || "sin definir"}
            </strong>{" "}
            · Presupuesto:{" "}
            <strong className="text-foreground">{profile.budget ?? "—"}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Apariencia */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">Apariencia</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            “Sistema” sigue el ajuste de tu teléfono o computadora.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Tema">
            {themeOptions.map((opt) => {
              const active = theme === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  aria-pressed={active}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-2.5" />
                    </span>
                  )}
                  <opt.icon className="size-4" />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">Notificaciones</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Solo lo que te ayuda a decidir — nada de ruido.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              { id: "cashDeals", label: "Nuevos cash deals", hint: "Cuando la red reporta una venta en efectivo" },
              { id: "dealActivity", label: "Actividad en tus zonas", hint: "Comparables nuevos en tus zonas de interés" },
              { id: "weeklyDigest", label: "Resumen semanal", hint: "Pulso del mercado cada lunes" },
            ] as const
          ).map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium">{n.label}</p>
                <p className="text-[11px] text-muted-foreground">{n.hint}</p>
              </div>
              <Switch
                checked={notifs[n.id]}
                onCheckedChange={(v) => setNotifs((cur) => ({ ...cur, [n.id]: v }))}
                aria-label={n.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Plan */}
      <Card className="border-success/25 shadow-card">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              Plan Comunidad
              <Badge variant="success">
                <BadgeCheck className="size-3" />
                Activo
              </Badge>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Acceso completo incluido con tu membresía de la comunidad.
            </p>
          </div>
          <Button variant="outline" size="sm" disabled>
            Manejar plan
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Zona de peligro */}
      <Card className="border-destructive/25">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-start gap-2.5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold">Restablecer demo</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Borra tu perfil, pipeline, guardados y ajustes locales. No hay
                vuelta atrás.
              </p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={resetDemo}>
            <RotateCcw className="size-3.5" />
            Restablecer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
