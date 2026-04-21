import Link from "next/link"
import { Check, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Precios — Bienes Raíces CR",
  description:
    "Planes diseñados para cada etapa de tu carrera como inversionista.",
}

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  name: string
  price: string
  period: string
  description: string
  cta: string
  ctaVariant: "default" | "outline"
  popular?: boolean
  features: PlanFeature[]
}

const plans: Plan[] = [
  {
    name: "Gratis",
    price: "$0",
    period: "/ mes",
    description: "Para explorar la plataforma y empezar a aprender.",
    cta: "Comenzar Gratis",
    ctaVariant: "outline",
    features: [
      { text: "5 búsquedas de comparables al mes", included: true },
      { text: "Calculadora de ROI básica", included: true },
      { text: "Acceso a data pública", included: true },
      { text: "Data exclusiva de ventas cash", included: false },
      { text: "Comparador de propiedades", included: false },
      { text: "Deal Flow Tracker", included: false },
      { text: "Credit Utilization Planner", included: false },
      { text: "Exportar reportes (PDF/CSV)", included: false },
      { text: "Soporte prioritario", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$30",
    period: "/ mes",
    description:
      "Para el inversionista activo que quiere todas las herramientas.",
    cta: "Comenzar con Pro",
    ctaVariant: "default",
    popular: true,
    features: [
      { text: "Búsquedas ilimitadas de comparables", included: true },
      { text: "Calculadora de ROI completa", included: true },
      { text: "Data pública + data exclusiva", included: true },
      { text: "Data exclusiva de ventas cash", included: true },
      { text: "Comparador de propiedades (hasta 5)", included: true },
      { text: "Deal Flow Tracker", included: true },
      { text: "Credit Utilization Planner", included: true },
      { text: "Exportar reportes (PDF/CSV)", included: true },
      { text: "Soporte prioritario", included: true },
    ],
  },
  {
    name: "Comunidad",
    price: "Incluido",
    period: "con membresía",
    description:
      "Acceso completo para miembros activos de la comunidad privada.",
    cta: "Ya soy miembro",
    ctaVariant: "outline",
    features: [
      { text: "Todo lo incluido en Pro", included: true },
      { text: "Acceso anticipado a nuevas herramientas", included: true },
      { text: "Canal exclusivo de la comunidad", included: true },
      { text: "Sesiones grupales de análisis", included: true },
      { text: "Directorio de realtors verificados", included: true },
      { text: "Networking con otros inversionistas", included: true },
      { text: "Contenido educativo exclusivo", included: true },
      { text: "Precio de fundador garantizado", included: true },
      { text: "Soporte directo por WhatsApp", included: true },
    ],
  },
]

const faqs = [
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí, puedes cancelar tu suscripción cuando quieras. No hay contratos ni penalidades.",
  },
  {
    q: "¿Qué son las ventas en efectivo (cash deals)?",
    a: "Son transacciones de propiedades que se pagan en efectivo y generalmente no se reportan en los sistemas públicos. Nuestra red de realtors nos reporta esta data exclusivamente.",
  },
  {
    q: "¿La data es solo de Puerto Rico?",
    a: "Comenzamos con Puerto Rico. La expansión a Estados Unidos viene en la segunda fase, enfocándonos en mercados con alta población latina.",
  },
  {
    q: "¿Cómo sé que la data es confiable?",
    a: "Cada comparable es verificado por un realtor activo de nuestra red. Los cash deals son reportados directamente por los agentes que participaron en la transacción.",
  },
  {
    q: "¿Qué incluye el plan de Comunidad?",
    a: "Si ya eres miembro de la comunidad privada de Christopher, tienes acceso completo a todas las herramientas como parte de tu membresía existente.",
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Precios simples y transparentes
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Invierte con la información correcta
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Planes diseñados para cada etapa de tu carrera como inversionista.
            Comienza gratis, escala cuando estés listo.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? "relative border-primary shadow-lg shadow-primary/10"
                  : ""
              }
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="shadow-sm">Más popular</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-lg">
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-2">
                  <span className="font-heading text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  variant={plan.ctaVariant}
                  asChild
                >
                  <Link href="/dashboard">
                    {plan.cta}
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
                <Separator />
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      ) : (
                        <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span
                        className={`text-sm ${feature.included ? "" : "text-muted-foreground/60"}`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center font-heading text-2xl font-bold">
            Preguntas frecuentes
          </h2>
          <div className="mt-10 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-heading text-base font-semibold">
                  {faq.q}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
