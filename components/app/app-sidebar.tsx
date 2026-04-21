"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  LayoutDashboard,
  Search,
  Calculator,
  ArrowLeftRight,
  Kanban,
  CreditCard,
  Settings,
  LogOut,
  Crown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Comparables",
    href: "/comparables",
    icon: Search,
  },
  {
    label: "Calculadora ROI",
    href: "/calculadora",
    icon: Calculator,
  },
  {
    label: "Comparador",
    href: "/comparador",
    icon: ArrowLeftRight,
  },
  {
    label: "Deal Flow",
    href: "/deals",
    icon: Kanban,
  },
  {
    label: "Crédito",
    href: "/credito",
    icon: CreditCard,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="size-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-semibold leading-tight tracking-tight">
              Bienes Raíces
              <span className="text-primary"> CR</span>
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground">
              Herramientas de Inversión
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Herramientas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Configuración">
                  <Link href="#">
                    <Settings />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="mb-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-2">
            <Crown className="size-4 text-primary" />
            <span className="text-xs font-medium">Plan Pro</span>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              Activo
            </Badge>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Búsquedas ilimitadas · Data exclusiva
          </p>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="gap-3">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  CC
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col truncate">
                <span className="truncate text-sm font-medium">
                  Christopher C.
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  chris@ejemplo.com
                </span>
              </div>
              <LogOut className="size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
