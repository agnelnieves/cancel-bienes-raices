"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"

import { zones } from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import { Logo } from "@/components/shell/logo"
import { useUserStore } from "@/lib/stores/user"

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
    const t = setTimeout(() => setTyping(false), 900)
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
    setDone(true)
    const name = String(allValues.name ?? "")
    setTimeout(() => {
      completeOnboarding({
        name,
        experience: (allValues.experience as "novato") ?? "novato",
        strategies: (allValues.strategies as string[]) ?? [],
        zones: (allValues.zones as string[]) ?? [],
        budget: (allValues.budget as string) ?? null,
        capital: (allValues.capital as string) ?? null,
      })
    }, 600)
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
      <div className="h-0.5 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

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
                        className="h-12 flex-1 rounded-2xl border border-input bg-card px-4 text-[15px] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                      />
                      <Button type="submit" size="lg" disabled={!canContinue}>
                        <ArrowRight className="size-4" />
                      </Button>
                    </form>
                  )}

                  {step.type === "single" && (
                    <div className="flex flex-wrap gap-2">
                      {step.options!.map((opt) => (
                        <OptionChip
                          key={opt.id}
                          label={opt.label}
                          hint={opt.hint}
                          onClick={() => commitAnswer(opt.label, opt.id)}
                        />
                      ))}
                    </div>
                  )}

                  {step.type === "multi" && (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {step.options!.map((opt) => {
                          const selected =
                            Array.isArray(currentValue) && currentValue.includes(opt.id)
                          return (
                            <OptionChip
                              key={opt.id}
                              label={opt.label}
                              hint={opt.hint}
                              selected={selected}
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
            <SummaryCard name={String(values.name ?? "")} onGo={() => router.push("/")} />
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
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
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
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[14px] text-primary-foreground">
        {children}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5 animate-fade-in">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
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
  onClick,
}: {
  label: string
  hint?: string
  selected?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-full border px-4 py-2.5 text-left text-[13px] font-medium transition-all",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent"
      )}
    >
      {selected && <Check className="size-3.5" />}
      <span>
        {label}
        {hint && (
          <span
            className={cn(
              "block text-[11px] font-normal",
              selected ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {hint}
          </span>
        )}
      </span>
    </button>
  )
}

function SummaryCard({ name, onGo }: { name: string; onGo: () => void }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <BotBubble>
        Tu panel está listo{name ? `, ${name.split(" ")[0]}` : ""}. 🎉 Personalicé
        tu pulso de mercado con tus zonas y estrategias. Desde aquí puedes buscar
        comparables, correr números y empezar a llenar tu pipeline.
      </BotBubble>
      <div className="rounded-2xl border border-primary/25 bg-accent p-5">
        <p className="text-sm font-semibold text-accent-foreground">
          Tip para empezar
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          Presiona <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[11px]">⌘K</kbd> en
          cualquier momento y dile al copiloto:{" "}
          <em>“busca casas en tu zona bajo tu presupuesto”</em>. Él hace el trabajo
          por ti.
        </p>
      </div>
      <Button size="lg" className="w-full sm:w-auto" onClick={onGo}>
        Ir a mi panel
        <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}
