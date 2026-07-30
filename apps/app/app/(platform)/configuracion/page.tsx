"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, RotateCcw, Sun } from "lucide-react"
import { toast } from "sonner"

import { zones } from "@cancel/data"
import {
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
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-in">
      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tu perfil</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Apariencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                  theme === opt.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <opt.icon className="size-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Notificaciones</CardTitle>
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
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Plan */}
      <Card className="border-primary/25">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              Plan Comunidad
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Activo
              </span>
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
          <div>
            <p className="text-sm font-semibold">Restablecer demo</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Borra tu perfil, pipeline, guardados y ajustes locales.
            </p>
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
