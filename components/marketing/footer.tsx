import Link from "next/link"
import { Building2 } from "lucide-react"

const footerLinks = {
  Producto: [
    { label: "Comparables", href: "/#herramientas" },
    { label: "Calculadora ROI", href: "/#herramientas" },
    { label: "Comparador", href: "/#herramientas" },
    { label: "Deal Tracker", href: "/#herramientas" },
    { label: "Precios", href: "/precios" },
  ],
  Recursos: [
    { label: "Guía de Comparables", href: "#" },
    { label: "Blog", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Comunidad", href: "#" },
  ],
  Legal: [
    { label: "Términos de Uso", href: "#" },
    { label: "Privacidad", href: "#" },
    { label: "Contacto", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="size-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-semibold tracking-tight">
                Bienes Raíces
                <span className="text-primary"> CR</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Herramientas de inversión para el inversionista latino. Data real,
              decisiones informadas.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-sm font-semibold">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Bienes Raíces CR. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho en Puerto Rico
          </p>
        </div>
      </div>
    </footer>
  )
}
