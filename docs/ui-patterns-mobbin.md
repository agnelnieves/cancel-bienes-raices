# UI Patterns — research Mobbin (apps/app)

Investigación de patrones de UI en apps reales (vía Mobbin) para elevar el
look & feel de **la plataforma** (`apps/app`). Cada patrón citado fue inspeccionado
visualmente (no solo metadata). Links canónicos a Mobbin incluidos por pantalla.

Filtro de marca aplicado a todo lo que sigue: **cálido, confiable, simple para
inversionistas NO técnicos de PR** — no luxury, no SaaS genérico denso. Teal
`#1D9E75` es el color de trabajo; terracota `#C4593A` se reserva **solo** al
sello de cash deals.

---

## 1. Dashboard (Inicio)

**Referencia clave:** [Monarch — Investments/Holdings](https://mobbin.com/screens/37b0330a-a415-4b48-a6ac-e6a5029a94e7)
(agrégado → detalle, ritmo vertical limpio), [Origin](https://mobbin.com/screens/83c3b3ee-ba90-4d81-a860-84c4dbafcfed).

**Lo que hacen bien:**

- Jerarquía **agrégado → granular**: primero el resumen grande (chart / KPI hero),
  después el detalle (tabla/lista). El usuario entiende "cómo voy" en 2 segundos
  antes de entrar al detalle.
- Cada stat row tiene **identificador + contexto + delta con color** (verde=sube).
  El delta lleva icono direccional, no solo número.
- Section headers separan **definición del contenido (título+info icon) de las
  acciones (dropdown, + add)** — izquierda/derecha.
- Espaciado generoso entre bloques; los grupos (categorías) usan header de grupo
  visualmente distinto de las filas.

**Estado actual de la app:** KPI cards ya tienen label+value+helper en palabras
sencillas (bien para novatos). Falta:

1. **Un hero "resumen del portafolio/mercado"** — un solo chart agrégado (o sparkline
   grande) arriba de los KPIs, como Monarch, que responda "¿cómo va mi mercado?"
   antes de los números sueltos.
2. **Delta direccional consistente** en KPIs que cambian (nuevos comparables,
   cash deals) con flecha + color, no solo texto.
3. **Agrupar "Pulso del mercado" con un header de sección más pesado** (título +
   descripción + acción a la derecha) — ya casi está; endurecer la separación
   visual entre grupos (más `space-y`, hairline).

**Patrones a aplicar:**

- KPI hero con chart agrégado (Recharts AreaChart, ya tenemos lib).
- Delta chips con icono TrendingUp/Down + soft bg semántico.
- Section headers: título+descripción izquierda, acción derecha (consolidar el
  `SectionHeader` actual como el único patrón).

---

## 2. Comparables (búsqueda + mapa + cards)

**Referencia clave:** [Zillow — search results](https://mobbin.com/screens/1899b9a4-752f-483c-9798-3b16ea1b074f),
[Zillow 2](https://mobbin.com/screens/cb967824-d19b-4c81-a0b5-b5270dc3a0d6), [Airbnb](https://mobbin.com/screens/4b9d614f-7f68-47bb-83e6-7fd35efca097).

**Lo que hace bien Zillow:**

- **Cards uniformes** → el ojo escanea la misma posición de dato en cada card sin
  reorientarse. **El precio es lo más grande y bold** (jerarquía #1 para el usuario),
  luego specs en formato estándar `bd | ba | sqft`, luego dirección en gris.
- **Badges sobre la imagen** (top-left) para lo urgente: _Featured_, _Price cut_
  (verde), features clave. Lo importante se ve sin leer el texto pequeño.
- Filtros en **una fila de dropdowns + CTA primaria a la derecha** ("Save search").
  Estado activo del filtro = color de marca.
- Resultados con **count + sort** arriba del grid.

**Estado actual:** las cards tienen jerarquía precio > specs > dirección (bien),
chips de fuente (bien), pero **no hay imagen** — es todo texto, lo que aplana la
jerarquía y hace las cards menos escaneables/emocionales. El filtro ya tiene
search + dropdowns + toggle de mapa (bien).

**Patrones a aplicar (sin volvernos luxury):**

1. **Imagen de propiedad arriba de la card** (placeholder cálido/teal pattern si
   no hay foto real — el demo usa mock data) con **badges overlaid**: cash deal
   (terracota) top-left, "recién listada" (info blue) si aplica, corazón de
   guardar top-right.
2. **Precio más grande** (subir a `text-2xl`) y specs en una sola línea separada
   por `·` para ritmo de escaneo uniforme.
3. **"Price cut" badge** cuando el mock tenga reducción — verde success, como
   Zillow: es un patrón que los inversionistas novatos entienden al instante.
4. Header de resultados con count + sort (ya existe el summary strip; formalizarlo
   como header del grid).

---

## 3. Deals (pipeline kanban)

**Referencia clave:** [HubSpot — Deals kanban](https://mobbin.com/screens/35b26dbf-8d2b-4f6c-a789-738b02d927b1),
[Attio](https://mobbin.com/screens/37ff1181-0cd1-4a35-9888-963786c4029b).

**Lo que hace bien HubSpot:**

- Columnas = etapas; **footer de columna con Total y Weighted** (suma y valor
  ponderado) → ves el valor de la etapa de un vistazo sin sumar a mano.
- Cards con **pocos campos de alta señal**: nombre (link) + Amount + Close date +
  **alertas de salud** ("no activity for X days", priority badge).
- **Etapas vacías visibles** como placeholder (dan contexto del proceso completo)
  sin añadir ruido.
- Scroll horizontal para no aplastar columnas.

**Estado actual:** ya tenemos count por columna + total por etapa, cards con ROI
badge + cash flow + fecha, y hints de columna vacía (¡muy bueno para novatos!).
Falta:

1. **Indicador de "salud del deal"** — deals estancados: "sin tocar hace X días"
   (warning amber) y "sin próximo paso" — como HubSpot. Para inversionista novato
   esto es oro: le dice dónde actuar.
2. **Total + "ponderado" en el footer de la columna** (o al menos reforzar el
   total ya presente con jerarquía visual).
3. **"Próximo paso" por deal** — una línea en la card (`Próximo: llamar al realtor`)
   en lugar de solo `updatedAt`; convierte el tablero en guía de acción.

---

## 4. Calculadora

**Referencia clave:** [Zillow — BuyAbility calculator](https://mobbin.com/screens/4d71c862-1029-4fd9-a48f-e58fe90c1474).

**Lo que hace bien:**

- **Resultado PRIMERO y grande** (el número que importa, en verde, arriba) — los
  inputs debajo. El usuario ve el desenlace antes de tocar nada.
- **Relación input→resultado explícita**: el valor del input ("target payment")
  aparece igual en el resultado ("max payment") → el usuario conecta "esto que
  puse produce esto que veo".
- **Barra de rango** con marcador que contextualiza el resultado dentro del rango
  posible.
- **Callout educativo con icono foco** ("subiendo el down payment llegas más lejos")
  — enseña cómo funciona la herramienta.
- Info icons `(i)` junto a cada input con microcopy explicativo.

**Estado actual:** la calculadora tiene tabs (alquiler/flip/STR), inputs con labels
y el veredicto en palabras sencillas (muy on-brand). Falta:

1. **Hero del resultado arriba** — el número veredicto (cash flow mensual / ROI /
   ganancia flip) grande, teal, arriba de los inputs, con la frase en español
   llano debajo. Hoy el resultado compite con los inputs.
2. **Callout educativo tipo foco**: "Si bajas el precio $10K, tu cash flow sube
   ~$70/mes" — microcopy que enseña sensibilidad del deal.
3. **Info icons con tooltip** en los términos técnicos (cap rate, ARV, ADR) en
   español llano — crítico para no-técnicos.
4. **Visual de rango** (barra) para cash flow o ROI vs. "típico en PR (~8%)".

---

## 5. Comunidad (feed)

**Referencias:** [Threads](https://mobbin.com/screens/b05902e9-b215-47d3-afb7-54346c11af0d),
[Whop](https://mobbin.com/screens/fe15fd11-b0df-4218-868b-b13f7c19be94).

**Patrones:** composer arriba (avatar + "¿qué está pasando en tu mercado?"),
post cards con avatar+nombre+tiempo, contadores de comentarios/likes, separación
por hairline no por cards pesadas (ritmo de lectura). Aplicar: hairline entre
posts en vez de cards encerradas → menos "SaaS denso", más "comunidad cálida".

---

## 6. Onboarding (flujo)

**Referencia:** [Monarch — personalized advice flow (17 pantallas)](https://mobbin.com/flows/adae1760-df5a-4a73-9da8-7c222a14ee8e),
[Zendesk — personalizing trial](https://mobbin.com/flows/88940c17-47db-4279-97a4-b76aa649646e).

**Patrones:** una pregunta por pantalla, progreso visible, opciones como cards
grandes seleccionables (no dropdowns), tono conversacional. El onboarding
determinista actual ya sigue esto; reforzar con **opciones-card grandes con
icono + descripción** y barra de progreso cálida.

---

## Priorización sugerida (impacto × esfuerzo)

| #   | Cambio                                                          | Pantalla    | Impacto | Esfuerzo |
| --- | --------------------------------------------------------------- | ----------- | ------- | -------- |
| 1   | Imagen + badges overlaid en PropertyCard (cash = terracota)     | Comparables | Alto    | Medio    |
| 2   | Hero de resultado arriba + callout educativo + info tooltips    | Calculadora | Alto    | Medio    |
| 3   | Salud del deal ("sin tocar hace X días") + próximo paso en card | Deals       | Alto    | Bajo     |
| 4   | KPI hero con chart agrégado + delta chips                       | Dashboard   | Medio   | Medio    |
| 5   | Footer ponderado/reforzado por columna kanban                   | Deals       | Medio   | Bajo     |
| 6   | Feed por hairline, composer arriba                              | Comunidad   | Medio   | Bajo     |
| 7   | Opciones-card grandes + progreso                                | Onboarding  | Medio   | Bajo     |

> Nota: las imágenes de propiedad son mock — usar placeholders cálidos on-brand
> (gradiente teal/papel con icono de casa) para no fingir fotos reales, o
> integrar fotos cuando llegue la data real de PRMLS/CRIM.

---

## Superficie: decisión de tokens (aplicada)

De la lectura de look-and-feel de Monarch / Zillow / Attio / Origin: las apps
premium corren **frías** y separan la card del fondo con **shadow suave + border
casi invisible** ("quiet luxury" de Attio). Nuestra marca corre **cálida** —
el warm paper es el diferenciador — así que se aplicó la *técnica* (restricción
de superficie) sin copiar la temperatura.

- `--border` `#e6dfd2` → `#eae4d6` (hairline más tenue; la separación la hace
  el `shadow-card`, no la línea). `--input` se quedó en `#e6dfd2` para que los
  campos conserven definición.
- Tints semánticos (`cash-soft`, `info-soft`, `success-soft`) se mantienen
  "greyed down" — no saturar en hover. Terracota `#c4593a` solo para el sello cash.
- Radii: cards `rounded-xl/2xl`, pills solo en badges/chips (no cards en pill).

## Implementado en este pass (branch `feat/ui-polish-mobbin`)

1. **PropertyCard** — placeholder on-brand con badges overlaid (cash terracota,
   price-cut verde, recién-listada azul), corazón de guardar top-right, precio
   `text-2xl` con original tachado, specs en una línea `·`.
2. **Calculadora** — callout educativo de sensibilidad ("bajas $10K → sube ~$X/mes")
   + tooltips `(i)` en cap rate, cash-on-cash, cash necesario, break-even, ARV, ADR, DSCR.
3. **Deals** — indicador de estancado ("Nd sin tocar", 7+ días) en card + footer de
   columna con total y conteo de estancados + campo `nextStep` (editable en el sheet).
4. **Dashboard** — delta chips direccionales en KPIs + separación de secciones `space-y-10`.
5. **Comunidad** — feed por hairlines dentro de una sola superficie (ritmo Threads),
   composer arriba como card.
6. **Onboarding** — opciones como cards grandes con check indicator + barra de
   progreso más gruesa + contador "Paso N de M".
7. **Tokens** — border más tenue (ver arriba).

Data: `Property.originalPrice?` (badge price-cut) y `Deal.nextStep?` añadidos a
`@cancel/data` con 2 listados y 8 deals mock actualizados.
