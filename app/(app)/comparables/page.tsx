"use client"

import { useState } from "react"
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Calendar,
  BadgeCheck,
  Banknote,
  Grid3X3,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  mockProperties,
  prCities,
  propertyTypes,
  formatCurrency,
  formatNumber,
  type Property,
} from "@/lib/mock-data"

export default function ComparablesPage() {
  const [search, setSearch] = useState("")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState<"grid" | "list">("grid")

  const filtered = mockProperties.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
    const matchesCity =
      cityFilter === "all" ||
      p.city.toLowerCase().includes(cityFilter.toLowerCase())
    const matchesType = typeFilter === "all" || p.type === typeFilter
    return matchesSearch && matchesCity && matchesType
  })

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por dirección, zona o municipio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary text-primary" : ""}
          >
            <SlidersHorizontal className="size-4" />
          </Button>
          <div className="flex rounded-lg border border-border">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none border-0"
              onClick={() => setView("grid")}
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none border-0"
              onClick={() => setView("list")}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="flex flex-wrap gap-3 pt-4">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Municipio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los municipios</SelectItem>
                {prCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCityFilter("all")
                setTypeFilter("all")
                setSearch("")
              }}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} comparables encontrados
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <Banknote className="size-3" />
            {mockProperties.filter((p) => p.cashDeal).length} ventas cash
          </Badge>
        </div>
      </div>

      {/* Results */}
      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((property) => (
            <PropertyListItem key={property.id} property={property} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Search className="size-10 text-muted-foreground/30" />
          <p className="mt-4 text-sm font-medium">
            No se encontraron comparables
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Intenta con otra dirección o ajusta los filtros
          </p>
        </div>
      )}
    </div>
  )
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="group overflow-hidden transition-colors hover:border-primary/30">
      {/* Image placeholder */}
      <div className="relative flex h-36 items-center justify-center bg-muted/50">
        <MapPin className="size-8 text-muted-foreground/20" />
        <div className="absolute right-2 top-2 flex gap-1.5">
          {property.cashDeal && (
            <Badge className="gap-1 bg-amber-500/90 text-[10px] text-white hover:bg-amber-500">
              <Banknote className="size-3" />
              Cash
            </Badge>
          )}
          {property.verified && (
            <Badge className="gap-1 bg-primary/90 text-[10px] text-white hover:bg-primary">
              <BadgeCheck className="size-3" />
              Verificado
            </Badge>
          )}
        </div>
        <Badge
          variant="secondary"
          className="absolute bottom-2 left-2 text-[10px]"
        >
          {property.type}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-heading text-lg font-bold text-primary">
              {formatCurrency(property.price)}
            </p>
            <p className="mt-0.5 text-sm font-medium">{property.address}</p>
            <p className="text-xs text-muted-foreground">{property.city}</p>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <Bed className="size-3.5" />
              <span>{property.bedrooms} hab.</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Bath className="size-3.5" />
            <span>{property.bathrooms} baños</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="size-3.5" />
            <span>{formatNumber(property.sqFt)} p²</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>
              {new Date(property.dateSold).toLocaleDateString("es-PR", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-md bg-muted/50 px-2.5 py-1.5 text-xs">
          <span className="text-muted-foreground">Precio/p²</span>
          <span className="font-medium">
            {formatCurrency(property.pricePerSqFt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function PropertyListItem({ property }: { property: Property }) {
  return (
    <Card className="transition-colors hover:border-primary/30">
      <CardContent className="flex items-center gap-4 p-4">
        {/* Image placeholder */}
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted/50">
          <MapPin className="size-5 text-muted-foreground/20" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{property.address}</p>
            {property.cashDeal && (
              <Badge className="gap-1 bg-amber-500/90 text-[10px] text-white hover:bg-amber-500">
                Cash
              </Badge>
            )}
            {property.verified && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <BadgeCheck className="size-3 text-primary" />
                Verificado
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {property.city} · {property.type}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {property.bedrooms > 0 && <span>{property.bedrooms} hab.</span>}
            <span>{property.bathrooms} baños</span>
            <span>{formatNumber(property.sqFt)} p²</span>
            <span>
              {new Date(property.dateSold).toLocaleDateString("es-PR", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="font-heading text-lg font-bold text-primary">
            {formatCurrency(property.price)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(property.pricePerSqFt)}/p²
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
