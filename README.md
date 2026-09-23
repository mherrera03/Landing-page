# UGB Plus — Landing + Panel Admin

![Versión](https://img.shields.io/badge/versión-0.2.0-c471ed)
![Estado](https://img.shields.io/badge/estado-prueba-12c2e9)
![Node](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite)

Landing page de **UGB Plus · Formación Continua** (Universidad Gerardo Barrios), administrable desde un panel propio.

> ⚠️ Proyecto en etapa de **prueba**: no está en producción. Los textos, cursos y eventos son de ejemplo.

## Índice
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo correrlo](#cómo-correrlo)
- [Rutas](#rutas)
- [Base de datos](#base-de-datos)
- [Hoja de ruta](#hoja-de-ruta)
- [Historial de versiones](#historial-de-versiones)

## Estructura del proyecto

```
Landing-page/
├── backend/                     ← Servidor Node + Express + SQLite
│   ├── server.js                ← Arranque: sirve la API, la landing y el admin
│   ├── package.json
│   ├── data/                    ← ugbplus.db (se crea solo, no se sube a git)
│   └── src/
│       ├── db.js                ← Esquema, migraciones y datos iniciales
│       ├── auth.js              ← Firma/verificación JWT + middleware requireAuth
│       └── routes/
│           ├── auth.js          ← /api/auth (login, me)
│           ├── cursos.js        ← /api/cursos
│           └── eventos.js       ← /api/eventos
│
├── frontend/
│   ├── shared/                  ← Lo que usan landing y admin
│   │   └── css/variables.css    ← Colores y degradado de marca
│   │
│   ├── landing/                 ← Sitio público  →  http://localhost:3000/
│   │   ├── index.html
│   │   ├── css/
│   │   │   ├── main.css         ← Importa todo en orden (cascada)
│   │   │   ├── base.css         ← Reset y tipografía
│   │   │   ├── layout.css       ← Secciones y encabezados
│   │   │   ├── responsive.css   ← Media queries (siempre al final)
│   │   │   ├── components/      ← buttons, forms, glow-button, modal
│   │   │   └── sections/        ← header, hero, about, courses, events, contact, footer
│   │   ├── js/
│   │   │   ├── main.js          ← Punto de entrada
│   │   │   ├── data/cursos.js   ← Datos temporales del modal
│   │   │   └── modules/         ← menu, filters, modal, contact-form
│   │   └── assets/img/cursos/   ← Imágenes de las tarjetas
│   │
│   └── admin/                   ← Panel administrativo  →  http://localhost:3000/admin/
│       ├── index.html           ← Login
│       ├── dashboard.html       ← Panel (cursos, eventos, solicitudes, configuración)
│       ├── css/admin.css
│       └── js/                  ← api.js (sesión), login.js, dashboard.js
│
└── docs/                        ← Documentación del proyecto
```

## Cómo correrlo

```bash
cd backend
npm install
npm start
```

Luego abrir:
- Landing: http://localhost:3000/
- Admin: http://localhost:3000/admin/

### Usuario de prueba del admin

| Correo | Contraseña |
|---|---|
| `admin@ugb.edu.sv` | `admin123` |

> ⚠️ Es solo para pruebas. Cambiarlo antes de pasar a producción.

> 💡 La landing usa módulos JS (`type="module"`), por eso **debe abrirse desde el servidor** y no con doble clic en el `index.html`.

## Rutas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor responde |
| POST | `/api/auth/login` | Recibe `{ correo, password }` y devuelve un token JWT (8 h) |
| GET | `/api/auth/me` | 🔒 Datos del usuario de la sesión |
| GET | `/api/cursos` | Cursos visibles, ordenados |
| GET | `/api/eventos` | Eventos visibles, ordenados |

## Base de datos

SQLite en `backend/data/ugbplus.db`. Se crea sola al arrancar con datos de ejemplo.

| Tabla | Para qué |
|---|---|
| `usuarios` | Cuentas del panel admin (rol admin / editor) |
| `cursos` | Tarjetas de la sección Programas |
| `eventos` | Tarjetas de Noticias y eventos |
| `solicitudes` | Mensajes del formulario de contacto |
| `configuracion` | Textos y datos generales (correo, títulos del hero…) |

## Hoja de ruta

- [x] Separar la landing en HTML / CSS / JS por secciones
- [x] Backend con Express + SQLite y API de lectura
- [x] Esqueleto del panel admin
- [x] Autenticación del admin (JWT + bcrypt)
- [ ] CRUD de cursos, eventos y configuración desde el admin
- [ ] Landing leyendo cursos y eventos desde la API
- [ ] Formulario de contacto guardando en `solicitudes`
- [ ] Corregir bugs visuales pendientes (modal duplicado, CTA en móvil)

<details>
<summary><b>Troubleshooting</b></summary>

**La página se ve sin estilos o los botones no hacen nada**
Abriste el `index.html` con doble clic. Arranca el servidor (`npm start`) y entra por `http://localhost:3000/`.

**`npm install` falla con better-sqlite3**
Verifica que usas Node 20 o 22 (`node -v`).

**El login dice "Ruta no encontrada" o no deja entrar**
El servidor sigue con el código viejo. Detenlo con `Ctrl + C`, corre `npm install` y vuelve a arrancar con `npm start`.

**Quiero reiniciar la base de datos con los datos de ejemplo**
Detén el servidor, borra `backend/data/ugbplus.db` y vuelve a arrancar.
</details>

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 0.2.0 | 2026-09-23 | Login del admin con JWT + bcrypt, usuario de prueba, dashboard protegido y cierre de sesión |
| 0.1.0 | 2026-09-23 | Reestructuración: landing separada en módulos, backend Express + SQLite, esqueleto del admin |

---
© 2026 UGB Plus · Universidad Gerardo Barrios
