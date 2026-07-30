"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  BadgeCheck,
  Clipboard,
  Clock,
  HardHat,
  Phone,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react"
import { toast } from "sonner"

import {
  contractorCities,
  contractors,
  tradeLabel,
  tradeMeta,
  type Contractor,
  type ContractorTrade,
} from "@cancel/data"
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@cancel/ui"

function ContratistasInner() {
  const searchParams = useSearchParams()

  const [query, setQuery] = React.useState("")
  const [trade, setTrade] = React.useState<string>(
    searchParams.get("oficio") ?? "todos"
  )
  const [city, setCity] = React.useState("todas")
  const [onlyVerified, setOnlyVerified] = React.useState(false)
  const [sort, setSort] = React.useState("rating")
  const [contactId, setContactId] = React.useState<string | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = contractors.filter((c) => {
      if (trade !== "todos" && !c.trades.includes(trade as ContractorTrade))
        return false
      if (
        city !== "todas" &&
        !c.zonesServed.includes(city) &&
        !c.zonesServed.includes("Toda la isla")
      )
        return false
      if (onlyVerified && !c.verified) return false
      if (
        q &&
        !`${c.name} ${c.contact} ${c.baseCity} ${c.specialty} ${c.trades.map(tradeLabel).join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false
      return true
    })
    return [...list].sort((a, b) => {
      if (sort === "jobs") return b.jobsDone - a.jobsDone
      if (sort === "precio") return a.priceTier - b.priceTier
      if (sort === "resenas") return b.reviews - a.reviews
      return b.rating - a.rating
    })
  }, [query, trade, city, onlyVerified, sort])

  const contact = contractors.find((c) => c.id === contactId)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Proceso de vetting */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: BadgeCheck,
            title: "Licencia verificada",
            desc: "Confirmamos licencia de contratista vigente ante DACO.",
          },
          {
            icon: ShieldCheck,
            title: "Seguro al día",
            desc: "Póliza de responsabilidad pública activa al momento del vetting.",
          },
          {
            icon: HardHat,
            title: "Referencias reales",
            desc: "Mínimo 2 trabajos validados por miembros de la comunidad.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <item.icon className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-semibold">{item.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por nombre, especialidad u oficio…"
              className="h-11 rounded-full pl-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto">
            <Select value={trade} onValueChange={setTrade}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los oficios</SelectItem>
                {tradeMeta.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Toda PR</SelectItem>
                {contractorCities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Mejor rating</SelectItem>
                <SelectItem value="jobs">Más trabajos</SelectItem>
                <SelectItem value="resenas">Más reseñas</SelectItem>
                <SelectItem value="precio">Más económico</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={onlyVerified ? "default" : "outline"}
              onClick={() => setOnlyVerified((v) => !v)}
              className="w-full"
            >
              <BadgeCheck className="size-4" />
              Verificados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <p className="text-sm text-muted-foreground">
        <strong className="text-foreground">{filtered.length}</strong>{" "}
        {filtered.length === 1 ? "profesional disponible" : "profesionales disponibles"}
        {trade !== "todos" && <> · {tradeLabel(trade as ContractorTrade)}</>}
        {city !== "todas" && <> · {city}</>}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <ContractorCard key={c.id} contractor={c} onContact={() => setContactId(c.id)} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
            <HardHat className="size-8 text-muted-foreground/50" />
            <p className="font-medium">Nadie cubre esos filtros todavía</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              La red crece cada semana. Prueba con otro oficio o municipio — o
              pídele al copiloto que te recomiende uno.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setQuery("")
                setTrade("todos")
                setCity("todas")
                setOnlyVerified(false)
              }}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de contacto */}
      <Dialog open={!!contact} onOpenChange={(v) => !v && setContactId(null)}>
        <DialogContent className="sm:max-w-sm">
          {contact && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {contact.name}
                  {contact.verified && (
                    <BadgeCheck className="size-4 text-primary" />
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-xl bg-muted/60 p-3.5 text-[13px] leading-relaxed text-muted-foreground">
                  Menciona que vienes de la comunidad Cancel — los contratistas
                  de la red priorizan a los miembros.
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
                    <div className="flex items-center gap-2.5">
                      <Phone className="size-4 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">{contact.phone}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {contact.contact}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard?.writeText(contact.phone)
                        toast.success("Número copiado")
                      }}
                    >
                      <Clipboard className="size-3.5" />
                      Copiar
                    </Button>
                  </div>
                  <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                    <Clock className="size-3.5" />
                    Responde en {contact.responseTime} · {contact.baseCity}
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <a href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}>
                    <Phone className="size-4" />
                    Llamar ahora
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---------------------------------------------------------------------------

function ContractorCard({
  contractor: c,
  onContact,
}: {
  contractor: Contractor
  onContact: () => void
}) {
  return (
    <Card className="flex flex-col transition-all hover:shadow-lift">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <Avatar className="size-11 border border-border">
            <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
              {c.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[15px] font-semibold tracking-tight">
                {c.name}
              </h3>
              {c.verified && (
                <BadgeCheck className="size-4 shrink-0 text-primary" />
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {c.baseCity} · {c.yearsExp} años de experiencia
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">
            {"$".repeat(c.priceTier)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.trades.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-secondary-foreground"
            >
              {tradeLabel(t)}
            </span>
          ))}
        </div>

        <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">
          {c.specialty}
        </p>

        <div className="mt-3 flex items-center gap-3 text-[12px]">
          <span className="inline-flex items-center gap-1 font-semibold">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {c.rating.toFixed(1)}
            <span className="font-normal text-muted-foreground">
              ({c.reviews})
            </span>
          </span>
          <span className="text-muted-foreground">
            {c.jobsDone} trabajos en la red
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="size-3" />
          Responde en {c.responseTime}
          <span className="mx-1">·</span>
          <span className="truncate">
            {c.zonesServed.includes("Toda la isla")
              ? "Toda la isla"
              : c.zonesServed.slice(0, 3).join(", ") +
                (c.zonesServed.length > 3 ? ` +${c.zonesServed.length - 3}` : "")}
          </span>
        </div>

        <Button className="mt-4 w-full" variant={c.verified ? "default" : "outline"} onClick={onContact}>
          <Phone className="size-4" />
          Ver contacto
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ContratistasPage() {
  return (
    <Suspense>
      <ContratistasInner />
    </Suspense>
  )
}
