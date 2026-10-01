# UGB Plus — Landing + Panel Admin

![Versión](https://img.shields.io/badge/versión-0.3.0-c471ed)
![Estado](https://img.shields.io/badge/estado-prueba-12c2e9)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

Landing page de **UGB Plus · Formación Continua** (Universidad Gerardo Barrios), administrable desde un panel propio.

> ⚠️ Proyecto en etapa de **prueba**: no está en producción. Los cursos, cifras y fechas son de ejemplo.

## Índice
- [Tecnologías](#tecnologías)
- [Cómo correrlo](#cómo-correrlo)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Sistema de diseño](#sistema-de-diseño)
- [Accesibilidad](#accesibilidad)
- [Rutas](#rutas)
- [Hoja de ruta](#hoja-de-ruta)
- [Historial de versiones](#historial-de-versiones)

## Tecnologías

| Tecnología | Uso |
|---|---|
| **Next.js 16** | Framework principal (App Router + Turbopack) |
| **React 19** | Componentes de la interfaz |
| **TypeScript** | Código más seguro y mantenible |
| **Tailwind CSS 4** | Diseño responsive con tokens en CSS |
| **Motion for React** | Animaciones de componentes |
| **GSAP + ScrollTrigger** | Animaciones avanzadas y de scroll |
| **Lucide React** | Iconos (SVG, sin emojis) |
| **Lenis** | Scroll suave |
| **Zod** | Validación compartida entre formulario y API |

## Cómo correrlo

```bash
npm install
```
```bash
npm run dev
```

Luego abrir http://localhost:3000

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila para producción |
| `npm start` | Sirve la versión compilada |
| `npm run lint` | Revisa el código con ESLint |
| `npm run typecheck` | Verifica los tipos de TypeScript |

## Estructura del proyecto

```
ugb-plus/
├── public/
│   ├── images/
│   │   ├── branding/{logo,isotipo,variants}/   ← Pendiente: logo oficial
│   │   ├── courses/                            ← Imágenes de los cursos
│   │   └── news, events, banners, team, placeholders/
│   ├── icons/  y  fonts/
│
├── src/
│   ├── app/
│   │   ├── (public)/              ← Sitio público
│   │   │   ├── layout.tsx         ← Header + Footer + scroll suave
│   │   │   ├── page.tsx           ← Landing (todas las secciones)
│   │   │   └── gracias/           ← Confirmación tras enviar el formulario
│   │   ├── api/leads/route.ts     ← Recibe las solicitudes de contacto
│   │   ├── layout.tsx             ← Fuente, metadatos y <html>
│   │   ├── not-found.tsx          ← Página 404
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── public/
│   │   │   ├── layout/            ← Header, Navbar, MobileMenu, Footer, Logo
│   │   │   ├── hero/              ← Hero, HeroFeaturedCourse
│   │   │   ├── courses/           ← CourseCard, CourseGrid, CourseFilters, CourseDetail
│   │   │   ├── events/            ← EventCard, EventGrid
│   │   │   ├── announcements/     ← AnnouncementBanner
│   │   │   ├── contact/           ← ContactForm
│   │   │   ├── sections/          ← About, Courses, Events, Contact, SectionHeading
│   │   │   └── motion/            ← SmoothScroll (Lenis + GSAP), Reveal
│   │   └── ui/                    ← Button, Input, Textarea, Select, Field, Badge, Modal
│   │
│   ├── services/                  ← courses.service, events.service (datos de ejemplo)
│   ├── schemas/                   ← lead.schema (Zod: formulario + API)
│   ├── types/                     ← course.types, event.types
│   ├── constants/                 ← site, routes, course-categories
│   ├── hooks/                     ← useActiveSection, useScrollToSection
│   ├── lib/                       ← utils
│   └── styles/                    ← variables, animations, public, admin
│
└── legacy/                        ← Proyecto anterior (Express + HTML/CSS/JS), solo referencia
```

## Sistema de diseño

Los tokens viven en [`src/styles/variables.css`](src/styles/variables.css) y Tailwind genera sus utilidades (`bg-ink`, `text-muted`, `shadow-hard`…).

| Token | Valor | Uso |
|---|---|---|
| `--color-cyan` / `--color-violet` / `--color-coral` | `#12c2e9` `#c471ed` `#f64f59` | Degradado de marca |
| `--color-ink` | `#000120` | Texto principal y fondos oscuros |
| `--color-paper` / `--color-surface` | `#f9f9f9` / `#ffffff` | Fondos |
| `--color-muted` | `#5b6070` | Texto secundario (6:1 de contraste) |
| `--color-violet-deep` | `#7c3daf` | Acento para textos y enlaces |

Dos utilidades propias: `bg-brand` (degradado de fondo) y `text-gradient` (degradado para títulos grandes, con una variante más oscura para que contraste sobre blanco).

## Accesibilidad

- Contraste verificado: todos los pares de color cumplen WCAG AA (4.5:1); el degradado de texto solo se usa en títulos grandes.
- Áreas táctiles de 44px o más en botones, enlaces y campos.
- Formulario con etiquetas visibles, errores junto al campo, `aria-invalid` y foco automático en el primer campo con problema.
- Modal con `role="dialog"`, cierre con Escape, foco atrapado dentro y devuelto al botón que lo abrió.
- Enlace "Saltar al contenido" y anillo de foco visible en toda la página.
- Respeta `prefers-reduced-motion`: desactiva el scroll suave y las animaciones.

## Rutas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Landing |
| GET | `/gracias` | Confirmación tras enviar el formulario |
| POST | `/api/leads` | Recibe y valida una solicitud de contacto |

## Hoja de ruta

- [x] Landing en Next.js 16 con la arquitectura definida
- [x] Sistema de diseño en tokens + componentes de UI reutilizables
- [x] Animaciones con Motion, GSAP y scroll suave con Lenis
- [x] Formulario validado con Zod (cliente y servidor) + página de gracias
- [ ] Base de datos y repositorios (`src/server/database/`)
- [ ] Panel admin en `/admin`: login, CRUD de cursos, eventos y solicitudes
- [ ] Landing leyendo los datos reales desde la base de datos
- [ ] Páginas de detalle: `/cursos/[slug]`, `/noticias/[slug]`, `/eventos/[slug]`
- [ ] Logo oficial, SEO (sitemap, robots, Open Graph) y textos definitivos

<details>
<summary><b>Troubleshooting</b></summary>

**El puerto 3000 ya está en uso (`EADDRINUSE`)**
Hay otro servidor corriendo. Ciérralo con `Ctrl + C` en su terminal, o usa otro puerto: `npm run dev -- -p 3001`.

**`npm run typecheck` dice que no encuentra `LayoutProps`**
Ese tipo lo genera Next al compilar. Corre `npm run build` una vez y vuelve a intentarlo.

**Las animaciones no se ven**
Si tu sistema tiene activado "reducir movimiento", la página las desactiva a propósito.
</details>

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.3.0 | 2026-10-01 | Migración a Next.js 16 + TypeScript + Tailwind 4; landing rediseñada con Motion, GSAP y Lenis; formulario validado con Zod |
| 0.2.0 | 2026-09-23 | Login del admin con JWT + bcrypt (proyecto anterior) |
| 0.1.0 | 2026-09-23 | Reestructuración en backend Express + frontend modular (proyecto anterior) |

---
© 2026 UGB Plus · Universidad Gerardo Barrios
