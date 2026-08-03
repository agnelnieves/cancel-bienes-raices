# RoomScan — Escaneo de propiedades con Apple RoomPlan

> **Estado:** idea para el roadmap (no comprometida). Documentada Agosto 2026.
> Ver [ideas.md](../ideas.md) para el resto del idea dump.

## Qué es

Una feature de la app donde el inversionista **escanea una propiedad completa
con el LiDAR de su iPhone/iPad** usando [Apple RoomPlan SDK](https://developer.apple.com/augmented-reality/roomplan/)
y obtiene:

- **Medidas precisas** de cada cuarto (dimensiones, área en pies cuadrados,
  altura de techo) sin usar una cinta métrica.
- **Fotos organizadas por cuarto** — en vez de un camera roll caótico, cada
  foto queda asociada al cuarto donde se tomó.
- Un **plano de planta (floor plan) 3D/paramétrico** generado del escaneo
  (USDZ / JSON paramétrico que RoomPlan exporta).
- Un **"scope package"** listo para enviar al contratista: medidas + fotos por
  cuarto + el plano, para cotizar sin tener que visitar la propiedad solo para
  medir.

## Por qué encaja en Cancel

El flujo natural de la plataforma hoy es:

1. Encontrar un comparable / deal potencial.
2. Analizarlo (calculadora, comparador).
3. Estimar la remodelación (estimador por partidas con precios PR).
4. Contactar un contratista de la red.

El **cuello de botella** entre el paso 3 y 4 es que el contratista necesita
medidas y fotos para cotizar en serio — y hoy eso significa una visita física,
una cinta métrica y fotos desordenadas por WhatsApp. RoomScan elimina ese paso:

- Alimenta el **estimador de remodelación** con `sqft` reales por cuarto (hoy el
  usuario escribe los pies cuadrados a mano).
- Alimenta la **solicitud al contratista** con un paquete profesional (medidas +
  fotos por cuarto + plano) → cotizaciones más rápidas y más precisas.
- Es una **ventaja de data**: con el tiempo, los escaneos reales de propiedades
  de PR se convierten en un activo propietario (distribución de tamaños,
  layouts típicos por urbanización, etc.).

## Cómo funcionaría (alto nivel)

- **Captura:** app nativa iOS (o wrapper) usando `RoomCaptureView` de RoomPlan.
  RoomPlan produce un modelo paramétrico del cuarto: paredes, aperturas
  (puertas/ventanas), superficies y objetos, con dimensiones reales.
  Requiere dispositivo con LiDAR (iPhone Pro / iPad Pro). Para cuartos
  múltiples se usa la captura de varios cuartos y se unen.
- **Fotos por cuarto:** durante el escaneo, el usuario toca "foto" y cada
  imagen queda taggeada al cuarto activo.
- **Estructura de datos (conceptual):**
  - `PropertyScan { id, propertyId?, createdAt, rooms: RoomScan[] }`
  - `RoomScan { id, name?, areaSqFt, dimensions, wallHeight, openings[], photos[], usdzUrl? }`
- **Salida / share:** un "Solicitud a contratista" que empaqueta: dirección,
  medidas por cuarto, fotos por cuarto, partidas del estimador pre-seleccionadas
  y el plano. Se comparte como link o PDF. (En producción: Supabase Storage
  para USDZ/fotos; ver `docs/business/launch-costs.md` para el stack.)
- **Integración con la plataforma:**
  - Estimador → pre-fill `sqft` por cuarto desde el escaneo.
  - Contratistas → adjuntar el scan a la solicitud de cotización.
  - Deals → guardar el scan en la tarjeta del deal como evidencia del estado
    físico de la propiedad.

## Limitaciones y riesgos

- **Solo Apple + LiDAR:** RoomPlan es iOS-only y requiere hardware LiDAR. No hay
  soporte web ni Android. Necesita una app nativa (o un companion app), fuera
  del alcance actual del demo web.
- **Precisión:** buena para dimensiones de cuartos, menos confiable en espacios
  con mucho mueble, espejos o luz difícil. Hay que manejar expectativas
  ("estimado, verifica antes de ordenar materiales").
- **No es para producción inmediata:** es una feature de diferenciación para
  post-lanzamiento. Vale la pena prototiparla una vez el core (comparables +
  herramientas + contratistas) esté validado con usuarios.

## Próximo paso sugerido

Cuando se priorice: spike técnico — app iOS mínima que corra `RoomCaptureView`,
exporte USDZ + JSON paramétrico, y valide la precisión en 2–3 propiedades
reales de PR antes de invertir en la integración completa.
