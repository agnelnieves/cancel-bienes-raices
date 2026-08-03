# Red de Contratistas — Contractor Network

> Feature central de la plataforma. Estilo "Angie's List" para Puerto Rico:
> descubrir contratistas vetados para remodelar, con precios de referencia
> claros. Este documento define el modelo y la dirección de UX.

## Qué es hoy (demo)

Directorio de contratistas vetados por la comunidad (`/contratistas`):

- **Vetting visible:** cada contratista muestra licencia DACO verificada, seguro
  vigente y referencias reales de miembros. La parte superior de la página
  explica el proceso (3 tarjetas: licencia, seguro, referencias).
- **Filtros simples:** por oficio, municipio, "solo verificados", y orden por
  rating / trabajos / reseñas / precio.
- **Tarjeta de contratista:** oficios, especialidad, rating, trabajos en la red,
  tiempo de respuesta, tier de precio (`$` / `$$` / `$$$`) y botón de contacto.
- **Contacto directo:** diálogo con teléfono + "menciona que vienes de la
  comunidad Cancel" (los contratistas priorizan miembros).

## Precios de referencia (la pieza de "overall pricing")

Para que el usuario entienda **cuánto debería costar** un trabajo antes de
llamar, la data expone precios de referencia por oficio, alineados con las
partidas del estimador de remodelación:

- `packages/data/src/types.ts` → `TradePrice { trade, label, unit, range }`
- `packages/data/src/contractors.ts` → `tradePrices` (rangos típicos con mano de
  obra en PR, 2026) y el helper `tradePrice(trade)`.
- Estos rangos son los mismos números que alimentan el **Estimador** — así el
  usuario ve un precio consistente entre "estimar mi remodelación" y "buscar
  quién la hace".

Dirección UX: mostrar el rango de precio relevante **junto al oficio** en la
tarjeta o el detalle del contratista (ej. "Techos · $2.20–$5.00 /pc"), para que
la cotización que reciba el usuario tenga contexto y pueda detectar cuándo algo
está fuera de rango.

## Flujo integrado (cross-tool)

1. El usuario estima su remodelación en el **Estimador** (por partidas, con
   precios PR).
2. "¿Quién ejecuta el trabajo?" → lo lleva a **Contratistas**, filtrado por el
   oficio relevante.
3. (Roadmap, ver `roomscan-roomplan.md`) adjuntar el escaneo RoomPlan — medidas
   + fotos por cuarto + plano — a la solicitud de cotización para que el
   contratista cotice sin visita de medición.

## Roadmap (de `docs/ideas.md`)

- Vetting más robusto y verificación continua.
- Comunicación contratista ↔ cliente dentro de la plataforma (chat interno o
  números provisionados).
- App para contratistas: fotos, tracking de proyectos, clientes, invoices.
- Exportar data (trabajos, clientes, comunicaciones) en varios formatos.
- Pagos a través de la plataforma (con comisión).
