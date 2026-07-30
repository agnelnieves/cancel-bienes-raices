import type { ActivityItem, Channel, CommunityPost, Member } from "./types"

// ============================================================================
// Comunidad — canales, posts, miembros (mock)
// ============================================================================

export const channels: Channel[] = [
  { id: "general", name: "general", description: "Conversación abierta de la comunidad" },
  { id: "deals", name: "deals-pr", description: "Comparte y discute deals en Puerto Rico" },
  { id: "credito", name: "estrategia-credito", description: "Jugadas con líneas de crédito" },
  { id: "exitos", name: "exitos", description: "Celebra tus cierres y milestones" },
  { id: "preguntas", name: "preguntas", description: "Pregunta lo que sea — no hay preguntas tontas" },
  { id: "subastas", name: "subastas", description: "Subastas bancarias y del tribunal" },
]

export const communityPosts: CommunityPost[] = [
  {
    id: "post-001",
    channel: "general",
    author: "Christopher Cancel",
    initials: "CC",
    role: "Fundador",
    time: "Hace 3 horas",
    pinned: true,
    tag: "Anuncio",
    content:
      "¡Bienvenidos a la nueva plataforma! 🎉 Ya tienen acceso al buscador de comparables con data que no existe en ningún otro lado — incluyendo los cash deals que reporta nuestra red de realtors. Empiecen por buscar su zona favorita y corran los números con la calculadora. Cualquier feedback, déjenlo aquí abajo. Esto es de ustedes.",
    likes: 87,
    comments: [
      { id: "c-001", author: "Jorge Medina", initials: "JM", content: "Esto está otro nivel. Encontré 3 comparables cash en Santurce que no salen en ningún lado 🔥", time: "Hace 2 horas" },
      { id: "c-002", author: "Wanda Reyes", initials: "WR", content: "La calculadora de ROI me ahorró como 2 horas de Excel ayer", time: "Hace 1 hora" },
    ],
  },
  {
    id: "post-002",
    channel: "exitos",
    author: "Jorge Medina",
    initials: "JM",
    role: "Pro",
    time: "Hace 5 horas",
    tag: "Cierre",
    content:
      "¡CERRAMOS EL PRIMERO DEL AÑO! 🏠 Casa en Bayamón, comprada en $118K cash con la jugada de 2 líneas al 0%. Remodelación $22K (salió en $24K, siempre sumen el 10% de contingencia 😅). Renta lista en $1,350/mes. Cash flow neto de $890. Gracias a todos los que revisaron los números conmigo en el thread.",
    likes: 64,
    comments: [
      { id: "c-003", author: "Christopher Cancel", initials: "CC", content: "Esto es lo que pasa cuando la data y la ejecución se juntan. ¡Felicidades, Jorge! 🙌", time: "Hace 4 horas" },
      { id: "c-004", author: "Natalia Cruz", initials: "NC", content: "¡Duro! ¿Qué líneas usaste para la remodelación?", time: "Hace 3 horas" },
      { id: "c-005", author: "Jorge Medina", initials: "JM", content: "@Natalia Discover al 0% hasta febrero y la Sapphire. El planner de crédito aquí me ayudó a distribuir sin pasar del 30%", time: "Hace 3 horas" },
    ],
  },
  {
    id: "post-003",
    channel: "deals",
    author: "Wanda Reyes",
    initials: "WR",
    role: "Pro",
    time: "Hace 8 horas",
    content:
      "Ojo con este multifamiliar en Caguas — Carr. 1 Km 30.5. Está en la plataforma como cash deal a $142K. Corrí los números: con las dos unidades alquiladas a $925 c/u el cap rate da como 11%. Lo único es que necesita verificar el título porque viene de herencia. ¿Alguien ha comprado propiedades de herencia? ¿Qué tan largo es el proceso?",
    likes: 23,
    comments: [
      { id: "c-006", author: "Miguel Ángel Soto", initials: "MS", content: "Compré una así en Ponce. Se tardó 4 meses extra por la declaratoria de herederos. Negocia duro porque el vendedor sabe que tarda", time: "Hace 6 horas" },
      { id: "c-007", author: "Wanda Reyes", initials: "WR", content: "Gracias! Voy a ofertar $128K entonces con contingencia de título", time: "Hace 5 horas" },
    ],
  },
  {
    id: "post-004",
    channel: "credito",
    author: "Natalia Cruz",
    initials: "NC",
    role: "Miembro",
    time: "Hace 1 día",
    content:
      "Pregunta para los que han hecho la jugada con 0% APR: ¿cuándo empiezan a pagar el balance? ¿Esperan a que rente la propiedad o van pagando el mínimo desde el día 1? Tengo $18K entre remodelación y cierre y quiero planificar bien el paydown para no dañar el crédito.",
    likes: 31,
    comments: [
      { id: "c-008", author: "Christopher Cancel", initials: "CC", content: "Regla general: nunca pases del 30% de utilización por tarjeta después del mes 3. Usa el Credit Planner para mapear el paydown con el cash flow de la propiedad", time: "Hace 22 horas" },
      { id: "c-009", author: "Jorge Medina", initials: "JM", content: "Yo pago mínimo los primeros 2 meses mientras remodelo, y cuando renta, tiro todo el cash flow al balance. En 8-10 meses quedas limpio", time: "Hace 20 horas" },
    ],
  },
  {
    id: "post-005",
    channel: "preguntas",
    author: "Luis Peña",
    initials: "LP",
    role: "Miembro",
    time: "Hace 1 día",
    content:
      "Soy nuevo — primera semana. ¿Cuál es la diferencia entre el cap rate y el cash-on-cash return? Veo ambos en la calculadora y no sé cuál mirar para decidir si un deal es bueno.",
    likes: 18,
    comments: [
      { id: "c-010", author: "Wanda Reyes", initials: "WR", content: "Cap rate = el retorno de la propiedad sin importar cómo la pagues. Cash-on-cash = lo que TÚ ganas sobre el dinero que TÚ pusiste. Si compras cash, se parecen. Si usas financiamiento o la jugada de crédito, el cash-on-cash es el que manda", time: "Hace 1 día" },
      { id: "c-011", author: "Luis Peña", initials: "LP", content: "Perfecto, gracias! O sea que para la metodología de la comunidad miro el cash-on-cash", time: "Hace 23 horas" },
    ],
  },
  {
    id: "post-006",
    channel: "subastas",
    author: "Miguel Ángel Soto",
    initials: "MS",
    role: "Realtor verificado",
    time: "Hace 2 días",
    tag: "Alerta",
    content:
      "⚠️ Sale a subasta del tribunal el 12 de agosto una propiedad en Playa de Ponce — avalúo CRIM $87K, comparable de la zona vendió en $118K hace 2 meses (está en la plataforma). Depósito requerido 10%. Si alguien la quiere ver antes, mándenme DM. Tengo acceso el sábado.",
    likes: 29,
    comments: [
      { id: "c-012", author: "Luis Peña", initials: "LP", content: "¿Las subastas del tribunal aceptan financiamiento o es cash only?", time: "Hace 2 días" },
      { id: "c-013", author: "Miguel Ángel Soto", initials: "MS", content: "Cash o líneas certificadas. Por eso la jugada de crédito funciona brutal aquí — llegas como comprador cash", time: "Hace 2 días" },
    ],
  },
  {
    id: "post-007",
    channel: "deals",
    author: "Carmen Delgado",
    initials: "CD",
    role: "Pro",
    time: "Hace 2 días",
    content:
      "Análisis rápido de Rincón para los que preguntan por Airbnb: el ADR está en $210-230 y ocupación 74% según la data de la plataforma. Una casa de $385K te da ~$3,800/mes bruto STR vs $2,800 alquiler largo. PERO incluyan los gastos de limpieza y management (25-30%) antes de enamorarse del número grande. Corran ambos escenarios en la calculadora.",
    likes: 41,
    comments: [
      { id: "c-014", author: "Natalia Cruz", initials: "NC", content: "Esto. El STR se ve lindo hasta que sumas limpieza, utilities, plataforma y los meses lentos de sept-oct", time: "Hace 1 día" },
    ],
  },
  {
    id: "post-008",
    channel: "general",
    author: "Christopher Cancel",
    initials: "CC",
    role: "Fundador",
    time: "Hace 3 días",
    content:
      "Recordatorio de por qué la data de cash deals importa tanto: esta semana se vendió una casa en Villa Caparra (Guaynabo) en $112K. Cash. No está en MLS, no está en Zillow, no está en ningún lado — excepto en nuestra plataforma porque un realtor de la red la reportó. Ese es el comparable que necesitas para saber qué vale REALMENTE una propiedad en esa zona. La información es el negocio. 📊",
    likes: 56,
    comments: [
      { id: "c-015", author: "Jorge Medina", initials: "JM", content: "Exacto. Con ese comp sabes que una casa similar listada en $145K está inflada $30K. Eso es dinero real en la negociación", time: "Hace 2 días" },
    ],
  },
]

export const members: Member[] = [
  { name: "Christopher Cancel", initials: "CC", role: "Fundador", online: true },
  { name: "Jorge Medina", initials: "JM", role: "Pro", online: true },
  { name: "Wanda Reyes", initials: "WR", role: "Pro", online: true },
  { name: "Miguel Ángel Soto", initials: "MS", role: "Realtor verificado", online: true },
  { name: "Natalia Cruz", initials: "NC", role: "Miembro", online: true },
  { name: "Carmen Delgado", initials: "CD", role: "Pro", online: false },
  { name: "Luis Peña", initials: "LP", role: "Miembro", online: true },
  { name: "Sofía Hernández", initials: "SH", role: "Realtor verificado", online: false },
]

// ============================================================================
// Actividad reciente — dashboard
// ============================================================================

export const recentActivity: ActivityItem[] = [
  { id: "act-1", type: "cash", message: "Venta cash reportada en Guaynabo — $112,000", time: "Hace 2 horas" },
  { id: "act-2", type: "comparable", message: "Nuevo comparable en Condado — $690,000", time: "Hace 4 horas" },
  { id: "act-3", type: "deal", message: "Jorge cerró su propiedad en Bayamón 🎉", time: "Hace 6 horas" },
  { id: "act-4", type: "cash", message: "Venta cash reportada en Caguas — $135,000", time: "Hace 1 día" },
  { id: "act-5", type: "comparable", message: "12 nuevos comparables en zona metro", time: "Hace 1 día" },
  { id: "act-6", type: "sistema", message: "Data de CRIM actualizada para Ponce y Mayagüez", time: "Hace 2 días" },
  { id: "act-7", type: "cash", message: "Venta cash reportada en Rincón — $385,000", time: "Hace 2 días" },
  { id: "act-8", type: "deal", message: "Nueva subasta alertada en Ponce — 12 de agosto", time: "Hace 3 días" },
]
