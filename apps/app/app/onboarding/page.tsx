"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  PartyPopper,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react"

import { zones } from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import { Logo } from "@/components/shell/logo"
import { type UserProfile, useUserStore } from "@/lib/stores/user"

// ---------------------------------------------------------------------------
// Onboarding conversacional determinista — se siente como IA, es 100% local
// ---------------------------------------------------------------------------

interface Step {
  id: string
  question: string | ((name: string) => string)
  type: "text" | "single" | "multi"
  placeholder?: string
  options?: { id: string; label: string; hint?: string }[]
}

const STEPS: Step[] = [
  {
    id: "name",
    question:
      "¡Hola! 👋 Bienvenido a Cancel. Te voy a dejar tu panel listo en menos de un minuto. ¿Cómo te llamas?",
    type: "text",
    placeholder: "Tu nombre",
  },
  {
    id: "experience",
    question: (name) => `Dale, ${name}. ¿Cuánta experiencia tienes invirtiendo en bienes raíces?`,
    type: "single",
    options: [
      { id: "novato", label: "Estoy empezando", hint: "0 deals todavía" },
      { id: "intermedio", label: "1–3 deals", hint: "Ya tengo algo de cancha" },
      { id: "avanzado", label: "3+ deals", hint: "Soy inversionista activo" },
    ],
  },
  {
    id: "strategies",
    question: "¿Cuál es tu jugada principal? Puedes escoger varias.",
    type: "multi",
    options: [
      { id: "alquiler", label: "Alquiler a largo plazo" },
      { id: "flip", label: "Flip (comprar, remodelar, vender)" },
      { id: "airbnb", label: "Airbnb / corta estancia" },
      { id: "wholesale", label: "Wholesale" },
    ],
  },
  {
    id: "zones",
    question: "¿En qué zonas de Puerto Rico quieres invertir?",
    type: "multi",
    options: zones.map((z) => ({ id: z.id, label: z.name, hint: z.city })),
  },
  {
    id: "budget",
    question: "¿Qué presupuesto tienes en mente por propiedad?",
    type: "single",
    options: [
      { id: "<100k", label: "Menos de $100K" },
      { id: "100-200k", label: "$100K – $200K" },
      { id: "200-350k", label: "$200K – $350K" },
      { id: "350k+", label: "$350K o más" },
    ],
  },
  {
    id: "capital",
    question: "Y por último — ¿cómo piensas financiar tus deals?",
    type: "single",
    options: [
      { id: "credito", label: "Con la jugada de crédito", hint: "Líneas al 0% APR" },
      { id: "cash", label: "Cash propio" },
      { id: "hipoteca", label: "Hipoteca tradicional" },
      { id: "mixto", label: "Mixto / todavía no sé" },
    ],
  },
]

interface Answer {
  stepId: string
  display: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const completeOnboarding = useUserStore((s) => s.completeOnboarding)

  const [stepIndex, setStepIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Answer[]>([])
  const [values, setValues] = React.useState<Record<string, string | string[]>>({})
  const [textInput, setTextInput] = React.useState("")
  const [typing, setTyping] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const endRef = React.useRef<HTMLDivElement>(null)

  const step = STEPS[stepIndex]
  const progress = Math.round(((stepIndex + (done ? 1 : 0)) / STEPS.length) * 100)

  React.useEffect(() => {
    // efecto de "escribiendo…" al entrar cada pregunta
    setTyping(true)
    const t = setTimeout(() => setTyping(false), 850)
    return () => clearTimeout(t)
  }, [stepIndex])

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [answers, typing, stepIndex, done])

  const currentValue = values[step.id]
  const canContinue =
    step.type === "text"
      ? textInput.trim().length > 1
      : step.type === "single"
        ? typeof currentValue === "string"
        : Array.isArray(currentValue) && currentValue.length > 0

  const commitAnswer = (display: string, value: string | string[]) => {
    setValues((v) => ({ ...v, [step.id]: value }))
    setAnswers((a) => [...a, { stepId: step.id, display }])
    setTextInput("")
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      finish({ ...values, [step.id]: value })
    }
  }

  const finish = (allValues: Record<string, string | string[]>) => {
    const name = String(allValues.name ?? "")
    completeOnboarding({
      name,
      experience:
        (allValues.experience as UserProfile["experience"]) ?? "novato",
      strategies: (allValues.strategies as string[]) ?? [],
      zones: (allValues.zones as string[]) ?? [],
      budget: (allValues.budget as string) ?? null,
      capital: (allValues.capital as string) ?? null,
    })
    setDone(true)
  }

  const goBack = () => {
    if (stepIndex === 0) return
    setAnswers((a) => a.slice(0, -1))
    setStepIndex((i) => i - 1)
  }

  const skip = () => {
    completeOnboarding({
      name: "",
      experience: "novato",
      strategies: ["alquiler"],
      zones: ["bayamon", "caguas"],
      budget: "100-200k",
      capital: "credito",
    })
    router.push("/")
  }

  const questionText =
    typeof step.question === "function"
      ? step.question(String(values.name ?? "").split(" ")[0] || "amigo")
      : step.question

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-5 py-4">
        <Logo />
        <button
          onClick={skip}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Configurar después →
        </button>
      </div>
      <div
        className="h-1 bg-muted"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de configuración"
      >
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Contador de paso — refuerza dónde estás */}
      {!done && (
        <p className="px-5 pt-2 text-right text-[10px] font-medium text-muted-foreground">
          Paso {stepIndex + 1} de {STEPS.length}
        </p>
      )}

      {/* Conversación */}
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-8">
        <div className="flex-1 space-y-5">
          {/* Historial */}
          {STEPS.slice(0, stepIndex).map((s, i) => (
            <React.Fragment key={s.id}>
              <BotBubble>
                {typeof s.question === "function"
                  ? s.question(String(values.name ?? "").split(" ")[0] || "amigo")
                  : s.question}
              </BotBubble>
              {answers[i] && <UserBubble>{answers[i].display}</UserBubble>}
            </React.Fragment>
          ))}

          {/* Pregunta activa o resumen */}
          {!done ? (
            <>
              {typing ? (
                <TypingBubble />
              ) : (
                <BotBubble>{questionText}</BotBubble>
              )}

              {!typing && (
                <div className="animate-fade-up space-y-3">
                  {step.type === "text" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (canContinue) commitAnswer(textInput.trim(), textInput.trim())
                      }}
                      className="flex gap-2"
                    >
                      <input
                        autoFocus
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={step.placeholder}
                        aria-label="Tu nombre"
                        className="h-12 flex-1 rounded-2xl border border-input bg-card px-4 text-[15px] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                      />
                      <Button type="submit" size="lg" disabled={!canContinue} aria-label="Continuar">
                        <ArrowRight className="size-4" />
                      </Button>
                    </form>
                  )}

                  {step.type === "single" && (
                    <div className="flex flex-col gap-2">
                      {step.options!.map((opt, i) => (
                        <OptionChip
                          key={opt.id}
                          label={opt.label}
                          hint={opt.hint}
                          index={i}
                          onClick={() => commitAnswer(opt.label, opt.id)}
                        />
                      ))}
                    </div>
                  )}

                  {step.type === "multi" && (
                    <>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {step.options!.map((opt, i) => {
                          const selected =
                            Array.isArray(currentValue) && currentValue.includes(opt.id)
                          return (
                            <OptionChip
                              key={opt.id}
                              label={opt.label}
                              hint={opt.hint}
                              selected={selected}
                              index={i}
                              onClick={() => {
                                const cur = Array.isArray(currentValue)
                                  ? currentValue
                                  : []
                                setValues((v) => ({
                                  ...v,
                                  [step.id]: selected
                                    ? cur.filter((x) => x !== opt.id)
                                    : [...cur, opt.id],
                                }))
                              }}
                            />
                          )
                        })}
                      </div>
                      <Button
                        disabled={!canContinue}
                        onClick={() => {
                          const cur = (currentValue as string[]) ?? []
                          const display = step
                            .options!.filter((o) => cur.includes(o.id))
                            .map((o) => o.label)
                            .join(", ")
                          commitAnswer(display, cur)
                        }}
                      >
                        Continuar
                        <ArrowRight className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <SummaryCard
              name={String(values.name ?? "")}
              values={values}
              onGo={() => router.push("/")}
            />
          )}
          <div ref={endRef} />
        </div>

        {/* Footer */}
        {!done && stepIndex > 0 && (
          <button
            onClick={goBack}
            className="mt-8 inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Atrás
          </button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 animate-fade-up">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Sparkles className="size-4" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 text-[14px] leading-relaxed shadow-soft">
        {children}
      </div>
    </div>
  )
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end animate-fade-up">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[14px] text-primary-foreground shadow-soft">
        {children}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5 animate-fade-in" aria-label="Escribiendo…">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Sparkles className="size-4" />
      </div>
      <div className="flex gap-1 rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3.5 shadow-soft">
        <span className="size-1.5 rounded-full bg-muted-foreground animate-typing" />
        <span className="size-1.5 rounded-full bg-muted-foreground animate-typing [animation-delay:150ms]" />
        <span className="size-1.5 rounded-full bg-muted-foreground animate-typing [animation-delay:300ms]" />
      </div>
    </div>
  )
}

function OptionChip({
  label,
  hint,
  selected,
  index = 0,
  onClick,
}: {
  label: string
  hint?: string
  selected?: boolean
  index?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={cn(
        "group flex animate-fade-up items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card text-foreground shadow-card hover:border-primary/50 hover:bg-accent"
      )}
    >
      {/* Check indicator */}
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-primary-foreground/60 bg-primary-foreground/20"
            : "border-border bg-muted group-hover:border-primary/40"
        )}
        aria-hidden
      >
        {selected && <Check className="size-3" />}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold">{label}</span>
        {hint && (
          <span
            className={cn(
              "mt-0.5 block text-[11.5px] font-normal leading-snug",
              selected ? "text-primary-foreground/75" : "text-muted-foreground"
            )}
          >
            {hint}
          </span>
        )}
      </span>
    </button>
  )
}

function labelFor(stepId: string, id: string): string {
  return (
    STEPS.find((s) => s.id === stepId)?.options?.find((o) => o.id === id)?.label ?? id
  )
}

function SummaryCard({
  name,
  values,
  onGo,
}: {
  name: string
  values: Record<string, string | string[]>
  onGo: () => void
}) {
  const zoneNames = ((values.zones as string[]) ?? []).map((z) => labelFor("zones", z))
  const strategies = ((values.strategies as string[]) ?? []).map((s) => labelFor("strategies", s))
  const budget = values.budget ? labelFor("budget", String(values.budget)) : null
  const capital = values.capital ? labelFor("capital", String(values.capital)) : null

  const recap = [
    { icon: MapPin, label: "Tus zonas", value: zoneNames.join(", ") || "—" },
    { icon: Target, label: "Tu jugada", value: strategies.join(", ") || "—" },
    {
      icon: Wallet,
      label: "Presupuesto y financiamiento",
      value: [budget, capital].filter(Boolean).join(" · ") || "—",
    },
  ]

  return (
    <div className="space-y-5 animate-fade-up">
      <BotBubble>
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <PartyPopper className="size-4 text-primary" />
          ¡Listo{name ? `, ${name.split(" ")[0]}` : ""}!
        </span>
        <br />
        Tu panel quedó personalizado con tus zonas y tu jugada. Esto es lo que
        preparé para ti:
      </BotBubble>

      {/* Recap de lo configurado */}
      <div className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-card">
        {recap.map((r) => (
          <div key={r.label} className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success-soft">
              <r.icon className="size-4 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                {r.label}
              </p>
              <p className="truncate text-[13px] font-medium">{r.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary/25 bg-accent p-5">
        <p className="text-sm font-semibold text-accent-foreground">
          Tu próximo paso
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          Entra a tu panel y presiona{" "}
          <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[11px]">⌘K</kbd>{" "}
          — dile al copiloto: <em>“busca casas en mi zona bajo mi presupuesto”</em>{" "}
          y él hace el trabajo por ti.
        </p>
      </div>

      <Button size="lg" className="w-full sm:w-auto" onClick={onGo}>
        Ir a mi panel
        <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}
