# Rediseño del login del panel — diseño

Fecha: 2026-11-19 · Tamaño: cambio pequeño

## Intención

Hoy `/admin/login` es la única pantalla del proyecto que no lleva nada de la
marca: una tarjeta blanca sobre fondo gris que podría ser el login de cualquier
sistema. Bryan quiere que **se sienta de la UGB**. El motivo es visual, no
funcional: el formulario funciona bien y no se toca.

## Objetivos

- Que al abrir el login se reconozca de inmediato que es de UGB Plus /
  Universidad Gerardo Barrios.
- Mantener el tono institucional: serio, no decorativo.
- No perder legibilidad ni accesibilidad en el formulario.

## No objetivos

- Cambiar el flujo de autenticación, los campos, la validación o los mensajes de
  error.
- Tocar `LoginForm`, `Input`, `SubmitButton`, `FormError` ni `loginAction`.
- Añadir "recordarme", "olvidé mi contraseña" o registro.

## Anti objetivos

Sería un fracaso, aunque quedara bonito, si:

- el formulario queda menos legible que ahora (texto sobre degradado, contraste
  por debajo de 4.5:1, campos que no se distinguen del fondo);
- en celular el adorno de marca empuja el formulario fuera de la primera
  pantalla;
- queda llamativo pero poco serio para un panel universitario.

## Restricciones

- Tailwind v4 con los tokens ya definidos en `src/styles/variables.css`
  (`--color-cyan`, `--color-violet`, `--color-coral`, utilidad `bg-brand`). No se
  introducen colores nuevos.
- `public/images/logo.png` es **multicolor** (cian, magenta y negro): no se puede
  invertir a blanco ni colocar sobre el degradado sin ensuciarlo.
- Next.js 16 App Router. La página es un Server Component con `searchParams`
  (`siguiente`), y eso se conserva.

## Enfoques considerados

Se maquetaron tres y Bryan eligió la **B**:

| | Enfoque | Qué cambia | Compromiso |
|---|---|---|---|
| A | **Resplandor** — la tarjeta de hoy con los resplandores cian/violeta de la portada detrás y una franja del degradado en el borde superior | solo estilos | El más barato y seguro, pero el más timidito: sigue leyéndose como una tarjeta genérica con adornos. |
| **B** | **Partido** — mitad panel con el degradado de marca y el nombre de la universidad, mitad formulario sobre blanco | estructura de la página | **Elegido.** Es el formato de los sistemas institucionales. La marca ocupa media pantalla sin tocar el formulario, que se queda sobre blanco. Cuesta una decisión extra: qué hacer en celular. |
| C | **Inmersivo** — pantalla completa de marca, fondo oscuro con manchas de color y el formulario en un panel de cristal | estructura y estilos de los campos | El más impresionante en demo, pero el menos sobrio y obliga a revisar el contraste de cada campo sobre un fondo translúcido. Descartado por el anti objetivo de la seriedad. |

## El diseño

Dos columnas iguales a partir de `lg`. `main` ocupa `min-h-dvh`.

**Panel de marca (izquierda).** Fondo `bg-brand` (el degradado cian → violeta →
coral), con dos manchas blancas translúcidas y desenfocadas encima para que no
sea un degradado plano. Contenido en blanco, distribuido de arriba a abajo:

- arriba: la marca, en texto (ver "Mis decisiones");
- centro: `SITE.tagline` ("Formación Continua") como titular grande, y debajo
  `SITE.university` ("Universidad Gerardo Barrios");
- abajo: una línea tenue, "Acceso restringido al personal autorizado".

**Formulario (derecha).** Centrado sobre `bg-surface` (blanco). El logo real
arriba, luego "Panel administrativo", la línea de descripción, `<LoginForm />`
sin cambios y el enlace "Volver a la landing". El botón de envío ya es
`variant="primary"` (`bg-ink text-white`), que es justo el botón oscuro de la
maqueta: no se toca.

**En celular** (por debajo de `lg`) el panel no desaparece: se convierte en una
franja superior de alto fijo con el degradado y la marca, y el formulario queda
debajo, sobre blanco, visible sin desplazarse.

## Mis decisiones (no las pidió, las tomo yo)

- **La marca del panel va en texto, no con el logo.** `logo.png` es multicolor y
  sobre el degradado se vería sucio; no existe una versión en blanco. El logo
  real se queda en el lado blanco, donde ya funciona. Si más adelante aparece un
  logo monocromo en blanco, sustituirlo es un cambio de una línea.
- **Las manchas del panel son estáticas.** La portada anima su mancha con GSAP;
  aquí no, para que la página de login siga siendo un Server Component sin
  JavaScript de cliente propio.
- **El `aria` y el orden del DOM no cambian:** el formulario va primero en el
  marcado del lado derecho y el panel es decorativo (`aria-hidden` en las
  manchas).

## Qué queda al criterio de quien lo implemente

- Las clases exactas, los tamaños de tipografía y el reparto del espacio dentro
  de cada columna.
- La forma y posición concretas de las manchas translúcidas.
- Si el panel en escritorio es 50/50 o algo tipo `1fr 1fr` con un máximo para el
  formulario.

## Alcance de archivos

- `src/app/admin/login/page.tsx` — reescritura del maquetado. **Es el único
  archivo que cambia.**

---

# Añadido: fotografías pasando en el panel

Fecha: 2026-11-19 · Tamaño: cambio pequeño

## Intención

Que el panel de marca, sin perder el texto, muestre fotografías reales de la
actividad de UGB Plus, pasando solas.

## La restricción que mandó

Las 17 fotos de la carpeta del cliente son **todas horizontales** (4:3 en su
mayoría) y casi todas de grupo. El panel es vertical. Recortar a vertical se
come cerca del 65% del ancho y descabeza a la gente de los extremos.

## Enfoques considerados

| | Enfoque | Compromiso |
|---|---|---|
| A | Recorte vertical a secas | Destroza las fotos de grupo, que son la mayoría. |
| B | Foto completa sobre relleno difuminado de sí misma | No recorta a nadie, pero se nota la banda y la foto queda pequeña. |
| **C** | **Foto de fondo teñida con el degradado de marca** | **Elegido.** Se lee el ambiente, no el detalle, así que el recorte deja de importar; el texto aguanta sobre cualquier foto y la marca se conserva. |

## El diseño

Tres capas en el panel: las fotos (`LoginSlideshow`), el degradado de marca al
55% y un velo de tinta que sube desde el pie (`from-ink/85 from-25%
via-ink/55 via-55% to-transparent`).

**Todo el texto se movió abajo.** Es lo que permite que el velo sea fuerte solo
donde hay que leer y se desvanezca arriba, que es donde se ve la foto. Con el
texto repartido de arriba abajo había que oscurecer el panel entero y las fotos
no se distinguían — se probó y se descartó.

`LoginSlideshow` es un componente de cliente: cambia de foto cada 6 s con un
fundido de 1 s. Con `prefers-reduced-motion: reduce` no pasa sola, se queda en
la primera.

## Mis decisiones

- **Seis fotos, no las diecisiete.** Escogidas por variedad: entrega de
  diplomas, trabajo de campo, grupo institucional, ponencia, ceremonia de
  cierre y el stand de UGB Plus.
- **La macro del taller de costura se descartó.** Bajo el tinte se iba a negro:
  no tiene estructura que leer. Entró en su lugar la de campo abierto, que
  además rompe con tanta foto de aula.
- **Recorte automático por zona de interés** (`sharp.strategy.attention`), no
  centrado: conserva a la gente en vez de la pared.
- **950 × 1520 px, webp.** Unos 590 KB las seis. Como la foto acaba teñida y
  oscurecida, bajar la calidad no se nota; `sizes` fija el ancho real para que
  Next no pida la imagen a 3840 px.
- **Carga progresiva:** al abrir solo se montan dos; entra una más en cada
  vuelta, que es justo cuando hace falta.

## Pendiente del cliente

Son fotos de alumnos y personal identificables. Van en el login del panel, que
no se indexa, pero **falta confirmar con el cliente que puede usarlas**.
