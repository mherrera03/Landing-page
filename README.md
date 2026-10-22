# UGB Plus — Landing + Panel Admin

![Versión](https://img.shields.io/badge/versión-0.7.0-c471ed)
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
- [Trabajo en equipo](#trabajo-en-equipo)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo funciona por dentro](#cómo-funciona-por-dentro)
- [Sistema de diseño](#sistema-de-diseño)
- [Accesibilidad](#accesibilidad)
- [Rutas](#rutas)
- [Hoja de ruta](#hoja-de-ruta)
- [Historial de versiones](#historial-de-versiones)

## Tecnologías

| Tecnología | Uso |
|---|---|
| **Next.js 16** | Framework principal (App Router + Turbopack) |
| **React 19** | Componentes de la interfaz y Server Actions |
| **TypeScript** | Código más seguro y mantenible |
| **Tailwind CSS 4** | Diseño responsive con tokens en CSS |
| **Motion for React** | Animaciones de componentes |
| **GSAP + ScrollTrigger** | Animaciones avanzadas y de scroll |
| **Lucide React** | Iconos (SVG, sin emojis) |
| **Lenis** | Scroll suave |
| **Zod** | Validación compartida entre formulario y servidor |
| **node:sqlite** | Base de datos (viene incluido en Node, no se instala) |
| **bcryptjs + jose** | Contraseñas cifradas y sesiones firmadas |

## Cómo correrlo

**Requisito: Node 22.5 o superior** (`node -v`). Si tienes una versión menor, descárgala de [nodejs.org](https://nodejs.org).

```bash
npm install
```
```bash
npm run dev
```

Luego abrir http://localhost:3000 (la landing) o http://localhost:3000/admin (el panel).

> ⚠️ **Ejecuta `npm install` cada vez que bajes cambios** (`git pull`). Si alguien agregó una
> librería y tú no la instalas, verás un error del tipo *"Module not found: Can't resolve ..."*.

No hace falta crear la base de datos: se genera sola la primera vez que arranca el servidor, con
un usuario de prueba y contenido de ejemplo definidos en
[`seed.ts`](src/server/database/migrations/seed.ts). Tampoco hace falta el archivo `.env`: en
desarrollo las sesiones usan un secreto fijo de respaldo. En producción **sí** es obligatorio
definir `SESSION_SECRET`, o el servidor se niega a arrancar.

| Comando | Qué hace |
|---|---|
| `npm install` | Instala o actualiza las dependencias |
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila para producción |
| `npm start` | Sirve la versión compilada |
| `npm run lint` | Revisa el código con ESLint |
| `npm run typecheck` | Verifica los tipos de TypeScript |

## Trabajo en equipo

Varias personas tocan el proyecto a la vez, así que conviene seguir estas reglas:

1. **Antes de empezar**: `git pull` y después `npm install`.
2. **Avisa qué archivos vas a tocar.** Los choques feos no vienen de editar la misma línea, sino de
   que dos personas reescriban el mismo módulo por su cuenta.
3. **Antes de subir**, corre estos dos comandos. Si alguno falla, el proyecto no compila y a tus
   compañeros les va a aparecer la página congelada en la versión anterior:
   ```bash
   npm run typecheck
   ```
   ```bash
   npm run lint
   ```
4. **Después de resolver un conflicto**, vuelve a correrlos. Un merge puede dejar medio módulo con
   una versión y medio con otra, y eso compila mal aunque Git diga que todo está resuelto.

## Estructura del proyecto

```
ugb-plus/
├── public/
│   ├── images/
│   │   ├── branding/        ← Pendiente: logo oficial
│   │   ├── courses/         ← Imágenes de cursos (subidas desde el admin)
│   │   ├── events/          ← Imágenes de eventos
│   │   ├── banners/         ← Imágenes de banners
│   │   └── news, team, placeholders/
│   └── icons/  y  fonts/
│
├── src/
│   ├── proxy.ts                   ← Protege /admin: sin sesión, redirige al login
│   │
│   ├── app/
│   │   ├── (public)/              ← Sitio público
│   │   │   ├── layout.tsx         ← Header + Footer + scroll suave
│   │   │   ├── page.tsx           ← Landing (todas las secciones)
│   │   │   └── gracias/           ← Confirmación tras enviar el formulario
│   │   ├── admin/
│   │   │   ├── login/             ← Inicio de sesión
│   │   │   └── (panel)/           ← Panel, ya autenticado
│   │   │       ├── page.tsx       ← Resumen
│   │   │       ├── cursos/        ← Listado, nuevo, editar
│   │   │       ├── eventos/       ← Listado, nuevo, editar
│   │   │       └── banners/       ← Listado, nuevo, editar
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
│   │   │   ├── events/            ← EventCard, EventGrid, FeaturedEvent, EventStatus
│   │   │   ├── contact/           ← ContactForm, SpecialistCard
│   │   │   ├── announcements/     ← AnnouncementBanner
│   │   │   ├── sections/          ← About, Stats, Services, Audience, Courses, Events, Contact
│   │   │   └── motion/            ← SmoothScroll (Lenis + GSAP), Reveal
│   │   ├── admin/
│   │   │   ├── layout/            ← AdminShell, AdminSidebar, PageHeader
│   │   │   ├── auth/              ← LoginForm
│   │   │   ├── courses/           ← CourseForm, CourseTable, DeleteCourseButton
│   │   │   ├── events/            ← EventForm, EventTable, DeleteEventButton
│   │   │   ├── banners/           ← BannerForm, BannerTable, DeleteBannerButton
│   │   │   ├── dashboard/         ← StatCard
│   │   │   └── ui/                ← ImageUpload, Switch, FlashMessage
│   │   └── ui/                    ← Button, Input, Textarea, Select, Combobox, Field, Badge, Modal
│   │
│   ├── server/                    ← Todo lo que solo corre en el servidor
│   │   ├── auth/                  ← session, session-token, dal, password
│   │   ├── database/
│   │   │   ├── connection.ts      ← Conexión SQLite
│   │   │   ├── migrations/        ← Migraciones + datos iniciales
│   │   │   └── repositories/      ← Consultas de cursos, eventos, banners y usuarios
│   │   ├── actions/               ← Server Actions del admin (crear, editar, borrar)
│   │   └── storage/uploads.ts     ← Subida de imágenes
│   │
│   ├── services/                  ← courses.service, events.service (lo que lee la landing)
│   ├── schemas/                   ← Zod: auth, course, event, banner, lead
│   ├── types/                     ← course.types, event.types, banner.types
│   ├── constants/                 ← site, routes, admin-nav, course-categories,
│   │                                services, audiences, stats, team, countries
│   ├── hooks/                     ← useActiveSection, useScrollToSection
│   ├── lib/                       ← utils, dates, format-event
│   └── styles/                    ← variables, animations, public, admin
│
└── legacy/                        ← Proyecto anterior (Express + HTML/CSS/JS), solo referencia
```

## Cómo funciona por dentro

**La landing lee de la base de datos.** Los cursos y los eventos que se ven en la página salen de
lo que haya en el panel, no de archivos. El recorrido siempre es el mismo:

```
página  →  services/  →  server/database/repositories/  →  SQLite
```

**El panel escribe con Server Actions.** Los formularios del admin no llaman a una API: envían sus
datos a una función del servidor en `server/actions/`, que valida con el esquema Zod correspondiente
y, si todo está bien, guarda y refresca las páginas afectadas.

**La sesión se revisa en dos sitios.** [`proxy.ts`](src/proxy.ts) mira la cookie y redirige al login
si no hay sesión; además, cada página y cada acción del panel llaman a `requireSession()`, que
comprueba contra la base de datos. La primera capa es rápida, la segunda es la que de verdad manda.

**Las imágenes las renombra el servidor.** Cuando subes una imagen desde el panel, se guarda en
`public/images/` con un nombre generado automáticamente: el nombre original podría traer caracteres
raros o rutas. Todo pasa por [`uploads.ts`](src/server/storage/uploads.ts), así que el día que el
proyecto se publique en un sitio sin disco permanente basta con reescribir ese único archivo.

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
- Toda imagen subida desde el panel exige una descripción: la leen quienes usan lector de pantalla.
- Enlace "Saltar al contenido" y anillo de foco visible en toda la página.
- Respeta `prefers-reduced-motion`: desactiva el scroll suave y las animaciones.

## Rutas

### Públicas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Landing |
| GET | `/gracias` | Confirmación tras enviar el formulario |
| POST | `/api/leads` | Recibe y valida una solicitud de contacto |

### Panel admin

Todas piden sesión iniciada, menos el login.

| Ruta | Descripción |
|---|---|
| `/admin/login` | Inicio de sesión |
| `/admin` | Resumen con las cifras del panel |
| `/admin/cursos` · `/nuevo` · `/[id]/editar` | Administrar cursos |
| `/admin/eventos` · `/nuevo` · `/[id]/editar` | Administrar eventos |
| `/admin/banners` · `/nuevo` · `/[id]/editar` | Administrar banners |
| `/admin/usuarios` · `/nuevo` · `/[id]/editar` | Administrar usuarios (**solo rol admin**) |

Las secciones de Noticias, Anuncios, Solicitudes y Configuración aparecen en el menú marcadas
como *Pronto*: todavía no existen.

### Roles

| Rol | Cursos, eventos y banners | Usuarios |
|---|---|---|
| **Administrador** | ✅ | ✅ |
| **Editor** | ✅ | ❌ no ve la sección |

A un editor se le oculta Usuarios del menú y, si escribe la dirección a mano, se le devuelve al
resumen. Hay tres candados pensados para que nadie se quede fuera del panel sin querer: no puedes
quitarte el rol de admin a ti mismo, no puedes desactivar ni eliminar tu propia cuenta, y siempre
tiene que quedar al menos un administrador activo.

Desactivar una cuenta la conserva pero le cierra el paso: no puede iniciar sesión y, si la tenía
abierta, se le cierra en la siguiente página que abra.

## Hoja de ruta

- [x] Landing en Next.js 16 con la arquitectura definida
- [x] Sistema de diseño en tokens + componentes de UI reutilizables
- [x] Animaciones con Motion, GSAP y scroll suave con Lenis
- [x] Formulario validado con Zod (cliente y servidor) + página de gracias
- [x] Base de datos, migraciones y repositorios (`src/server/database/`)
- [x] Panel admin: login, CRUD de cursos, eventos y banners
- [x] La landing lee cursos y eventos desde la base de datos
- [x] Usuarios del panel, con roles y control de acceso por rol
- [ ] Mostrar los banners en la landing (el panel ya los administra, pero no se ven en la página)
- [ ] Guardar las solicitudes de contacto en la base de datos y verlas en el panel
- [ ] Secciones pendientes del panel: Noticias, Anuncios y Configuración
- [ ] Páginas de detalle: `/cursos/[slug]`, `/noticias/[slug]`, `/eventos/[slug]`
- [ ] Limpiar la tabla `eventos`, que quedó sin uso tras unificar el módulo en la 0.7.0
- [ ] Logo oficial, SEO (sitemap, robots, Open Graph) y textos definitivos
- [ ] Confirmar con el cliente las cifras de la landing antes de publicar

<details>
<summary><b>Troubleshooting</b></summary>

**Hice `git pull` pero los cambios no se ven en mi página**
Casi siempre es que el proyecto no compila: Next sigue sirviendo la última versión que le funcionó.
Corre `npm run typecheck` para ver el error de verdad. Pasa sobre todo después de un merge, cuando
media parte del código quedó con una versión y la otra media con otra.

**Module not found: Can't resolve 'bcryptjs' (o jose, zod...)**
Bajaste código nuevo pero no instalaste las dependencias. Ejecuta `npm install` y vuelve a arrancar.

**`npm install` falla con `gyp ERR!` o pide Visual Studio**
Ya no debería pasar: el proyecto usa el SQLite incluido en Node y no compila nada.
Si lo ves, tu `node_modules` es viejo. Borra esa carpeta, haz `git pull` y vuelve a instalar.

**Dice que falta Node 22.5 o aparece `Cannot find module node:sqlite`**
Tu versión de Node es muy antigua. Comprueba con `node -v` e instala Node 22 LTS o superior.

**Aparece "SQLite is an experimental feature"**
Es normal y no afecta nada: así marca Node su módulo de SQLite en la versión 22.

**`no such table: eventos` (o banners, o cursos)**
El servidor tenía la base de datos abierta desde antes de que existiera esa tabla. Páralo con
`Ctrl + C` y arráncalo otra vez.

**No puedo entrar al panel / se me cierra la sesión sola**
Borra la carpeta `database/data` y reinicia el servidor: se vuelve a crear con el usuario de prueba.
Ojo, esto borra también los cursos, eventos y banners que hayas creado.

**El puerto 3000 ya está en uso (`EADDRINUSE`)**
Hay otro servidor corriendo. Ciérralo con `Ctrl + C` en su terminal, o usa otro puerto:
`npm run dev -- -p 3001`.

**`npm run typecheck` se queja de una ruta nueva que sí existe**
Errores del tipo *"does not satisfy the constraint 'AppRoutes'"*. Next genera esa lista al compilar,
y todavía no conoce tu página. Arranca `npm run dev` y abre la ruta una vez; luego vuelve a
intentarlo.

**Las animaciones no se ven**
Si tu sistema tiene activado "reducir movimiento", la página las desactiva a propósito.
</details>

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.7.0 | 2026-10-22 | Administración de banners y de usuarios del panel, con roles (admin / editor) y acceso restringido por rol; se unifica el módulo de eventos, que había quedado partido en dos tras un merge |
| 0.6.0 | 2026-10-08 | Evento destacado con banner, hora y botón de inscripción; primer evento real publicado |
| 0.5.0 | 2026-10-08 | Eventos administrables desde el panel, ahora con fecha, lugar y enlace de inscripción |
| 0.4.1 | 2026-10-01 | Se cambia better-sqlite3 por el SQLite incluido en Node: ya no hace falta compilar nada al instalar |
| 0.4.0 | 2026-10-01 | Panel admin: login con sesión segura, base de datos SQLite con migraciones y CRUD de cursos con subida de imágenes; la landing lee los cursos de la base |
| 0.3.0 | 2026-10-01 | Migración a Next.js 16 + TypeScript + Tailwind 4; landing rediseñada con Motion, GSAP y Lenis; formulario validado con Zod |
| 0.2.0 | 2026-09-23 | Login del admin con JWT + bcrypt (proyecto anterior) |
| 0.1.0 | 2026-09-23 | Reestructuración en backend Express + frontend modular (proyecto anterior) |

---
© 2026 UGB Plus · Universidad Gerardo Barrios
