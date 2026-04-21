"use client"

import { useTheme } from "next-themes"
import {
  Sun,
  Moon,
  Monitor,
  User,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Crown,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const themeOptions = [
  { value: "light", label: "Claro", icon: Sun, description: "Tema claro" },
  { value: "dark", label: "Oscuro", icon: Moon, description: "Tema oscuro" },
  {
    value: "system",
    label: "Sistema",
    icon: Monitor,
    description: "Sigue la preferencia del sistema",
  },
] as const

export default function ConfiguracionPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <CardTitle className="font-heading text-base">Perfil</CardTitle>
          </div>
          <CardDescription>Tu información personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre</Label>
              <Input defaultValue="Christopher Cancel" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input defaultValue="chris@ejemplo.com" type="email" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Teléfono</Label>
              <Input defaultValue="(787) 555-0123" type="tel" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Ubicación</Label>
              <Input defaultValue="San Juan, Puerto Rico" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm">Guardar cambios</Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-muted-foreground" />
            <CardTitle className="font-heading text-base">
              Apariencia
            </CardTitle>
          </div>
          <CardDescription>
            Personaliza cómo se ve la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const isActive = theme === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2.5 rounded-lg border p-4 text-center transition-colors ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg ${
                      isActive ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <option.icon
                      className={`size-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}
                    >
                      {option.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            <CardTitle className="font-heading text-base">
              Notificaciones
            </CardTitle>
          </div>
          <CardDescription>
            Controla qué notificaciones recibes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            label="Nuevos comparables"
            description="Cuando se añaden comparables en tus zonas de interés"
            defaultOn
          />
          <Separator />
          <ToggleRow
            label="Ventas en efectivo"
            description="Cuando se reporta una venta cash en tu área"
            defaultOn
          />
          <Separator />
          <ToggleRow
            label="Actualizaciones de deals"
            description="Recordatorios sobre tus deals activos"
            defaultOn
          />
          <Separator />
          <ToggleRow
            label="Noticias del mercado"
            description="Resumen semanal del mercado de PR"
          />
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground" />
            <CardTitle className="font-heading text-base">Idioma</CardTitle>
          </div>
          <CardDescription>Preferencia de idioma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-3 text-left">
              <span className="text-lg">🇵🇷</span>
              <div>
                <p className="text-sm font-medium text-primary">Español</p>
                <p className="text-[11px] text-muted-foreground">
                  Idioma actual
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left opacity-50">
              <span className="text-lg">🇺🇸</span>
              <div>
                <p className="text-sm font-medium">English</p>
                <p className="text-[11px] text-muted-foreground">Próximamente</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            <CardTitle className="font-heading text-base">
              Suscripción
            </CardTitle>
          </div>
          <CardDescription>Tu plan actual y facturación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Crown className="size-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">Plan Pro</p>
                  <Badge variant="secondary" className="text-[10px]">
                    Activo
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  $30/mes · Renovación: 15 de mayo, 2026
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Administrar
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-[11px] text-muted-foreground">
                Búsquedas este mes
              </p>
              <p className="mt-0.5 font-heading text-lg font-bold">47</p>
              <p className="text-[10px] text-muted-foreground">Ilimitadas</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-[11px] text-muted-foreground">
                Miembro desde
              </p>
              <p className="mt-0.5 font-heading text-lg font-bold">Mar 2026</p>
              <p className="text-[10px] text-muted-foreground">2 meses</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-[11px] text-muted-foreground">
                Próximo cobro
              </p>
              <p className="mt-0.5 font-heading text-lg font-bold">$30</p>
              <p className="text-[10px] text-muted-foreground">15 mayo 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground" />
            <CardTitle className="font-heading text-base">
              Seguridad
            </CardTitle>
          </div>
          <CardDescription>Contraseña y acceso a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Contraseña</p>
              <p className="text-xs text-muted-foreground">
                Última actualización hace 30 días
              </p>
            </div>
            <Button variant="outline" size="sm">
              Cambiar
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Autenticación de dos pasos</p>
              <p className="text-xs text-muted-foreground">
                Añade una capa adicional de seguridad
              </p>
            </div>
            <Button variant="outline" size="sm">
              Activar
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">
                Eliminar cuenta
              </p>
              <p className="text-xs text-muted-foreground">
                Elimina permanentemente tu cuenta y todos tus datos
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  defaultOn,
}: {
  label: string
  description: string
  defaultOn?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          defaultOn ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform ${
            defaultOn ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  )
}
