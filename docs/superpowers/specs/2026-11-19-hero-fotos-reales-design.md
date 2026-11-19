# Fotos reales en la portada — diseño

Fecha: 2026-11-19 · Tamaño: cambio pequeño

## Intención

La portada "se siente genérica, sin fotos reales de la UGB" (palabras de
Bryan). Y era literal: en todo el hero no había una sola fotografía de la
institución. La mitad derecha era una mancha de color animada, dos pastillas
decorativas escritas a mano y la tarjeta del curso destacado, cuya imagen es
una foto de banco generada con IA.

## Objetivos

- Que lo primero que se vea de UGB Plus sea gente real de UGB Plus.
- Conservar el titular, los botones y las cifras tal cual.

## No objetivos

- Tocar el texto del hero, las llamadas a la acción o las cifras.
- Cambiar la foto de la tarjeta del curso: esa sale del curso marcado en el
  panel y se arregla desde *Cursos*, no desde el código.

## Anti objetivos

- Que la portada pierda el aire limpio que ya tiene y se vuelva un collage
  recargado.
- Que las fotos tapen la tarjeta del curso o desplacen las cifras.

## Restricciones

- Las fotos de la unidad son apaisadas 4:3. Aquí eso juega a favor: es la forma
  que pide la zona, al revés que en el login.
- La mancha lleva un parallax con GSAP enganchado a `[data-hero-blob]`: ese
  atributo no se puede perder.

## Enfoques considerados

| | Enfoque | Compromiso |
|---|---|---|
| **A** | **Mosaico de fotos alrededor de la tarjeta**, con la mancha difuminada de fondo | **Elegido.** Mismo esqueleto y misma animación, pero lo que se ve es gente de la UGB en vez de adornos. |
| B | Tira de fotos a lo ancho debajo de las cifras | El más barato y el de menos riesgo, pero de entrada el hero se sigue viendo igual: la foto aparece cuando ya bajaste la vista. |
| C | Una foto grande de fondo en todo el hero | El que más "se siente de la UGB" de golpe, pero se pierde la mancha y el aire limpio, hay que cuidar mucho el contraste del texto negro, y todo cuelga de que esa foto sea buena. |

## El diseño

En `HeroFeaturedCourse`:

- **Fuera las dos pastillas** ("UGB+ · Aprende·Aplica·Avanza" y "Nuevo · Cupos
  limitados"). Decían poco y eran lo único que se veía además del curso. La
  segunda, además, anunciaba cupos limitados de forma permanente.
- **Tres fotos reales** alrededor de la tarjeta, con rotaciones leves, borde
  blanco y la misma animación de flotar que tenían las pastillas, cada una con
  su retraso.
- **La mancha de marca pasa a ser resplandor**: `opacity-60 blur-2xl`. Sigue
  ahí, sigue animándose y conserva `data-hero-blob`, pero el peso visual ahora
  lo llevan las fotos.
- La tarjeta baja de `24rem` a `21rem` para dejarles sitio.

## Mis decisiones

- **Las fotos no se ven por debajo de `sm`.** La columna es estrecha y taparían
  la tarjeta; en celular se queda solo el curso, como antes.
- **Son decorativas**, con `alt` vacío y `aria-hidden`: lo que cuentan ya lo
  dice el texto del hero.
- **560 × 420 px webp, 99 KB las tres.** Se ven pequeñas, no hace falta más. No
  llevan `preload`: el único que lo lleva sigue siendo la foto del curso, que
  es la que manda en el LCP.
- **Recorte por zona de interés**, no centrado, igual que en el login.

## Pendiente

- La foto de la tarjeta del curso destacado sigue siendo de banco. Subir una
  real desde *Cursos* es lo que más rápido quita la sensación de genérico, y no
  es trabajo de código.
- En el titular dice "Unete" sin tilde. Se corrige desde
  `/admin/configuración`.
- Falta confirmar con el cliente que puede usar fotos con caras reconocibles.
