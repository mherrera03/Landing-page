# Despliegue en Vercel: landing y admin en dominios separados

| Dominio | Qué sirve |
|---|---|
| `dominio.com` | Landing pública. `/admin` responde 404. |
| `admin.dominio.com` | Panel administrativo (con login). No sirve páginas públicas. |

## Arquitectura

Es **un solo proyecto de Vercel** con los dos dominios apuntando a él. Landing y admin comparten
código, base de datos y Server Actions; lo que cambia es qué deja pasar cada dominio.

La separación la hace [`src/proxy.ts`](../src/proxy.ts) leyendo el encabezado `Host`, con las reglas
de [`src/lib/hosts.ts`](../src/lib/hosts.ts):

| Petición | En `dominio.com` | En `admin.dominio.com` |
|---|---|---|
| `/`, `/noticias`, `/cursos/...` | Se sirve | `/` → `/admin`; el resto redirige a `dominio.com` |
| `/admin/...` | **404** (no redirige: no delata que existe un panel) | Se sirve, con login |
| `/api/leads` | Se sirve | Redirige a `dominio.com` |
| Archivos estáticos (`/_next`, `/images`) | Se sirven | Se sirven (el panel muestra las imágenes subidas) |

Dentro del subdominio las rutas conservan el prefijo: `admin.dominio.com/admin/cursos`. Así las
mismas URLs funcionan en desarrollo y en Preview, donde no hay subdominio.

Segunda barrera: `requireSession()` y el login vuelven a comprobar el host
(`assertAdminHost()` en [`dal.ts`](../src/server/auth/dal.ts)), porque las Server Actions viajan
como POST a cualquier ruta y el proxy solo filtra por URL.

### Sesión y cookies

- La cookie de sesión **no lleva `Domain`**: queda atada a `admin.dominio.com` y el navegador nunca
  la envía a `dominio.com`.
- En producción se llama `__Host-ugbplus_session`. El prefijo `__Host-` obliga al navegador a exigir
  `Secure`, `Path=/` y sin `Domain`, así que ningún otro subdominio puede sobrescribirla.
- `HttpOnly`, `SameSite=Lax`, 8 horas. Firmada con `SESSION_SECRET` (JWT HS256).
- Rutas `/admin/*` con `X-Robots-Tag: noindex`, `X-Frame-Options: DENY` y
  `Referrer-Policy: same-origin` (ver [`next.config.ts`](../next.config.ts)).

## Variables de entorno (Settings → Environment Variables)

| Variable | Production | Preview | Development |
|---|---|---|---|
| `SESSION_SECRET` | Obligatoria, marcada *Sensitive* | Obligatoria, **valor distinto** al de producción | Opcional |
| `ADMIN_HOST` | `admin.dominio.com` | No definir | No definir (o `admin.localhost:3000` para probar) |
| `PUBLIC_HOST` | `dominio.com` | No definir | No definir (o `localhost:3000`) |

- `SESSION_SECRET`: mínimo 32 caracteres; sin él la app no arranca en producción ni en Preview.
  Generar con `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- Sin `ADMIN_HOST` la separación queda **apagada**: todo responde en el mismo host, con el panel en
  `/admin`. Es lo correcto en Preview (cada despliegue tiene una URL distinta) y en desarrollo.
- Cambiar una variable no afecta a los despliegues existentes: hay que volver a desplegar.

### Los tres entornos

- **Production**: separación activa. Ojo: la URL `proyecto.vercel.app` pasa a comportarse como
  dominio público (su `/admin` da 404); al panel solo se entra por `admin.dominio.com`.
- **Preview**: panel en `https://<url-del-preview>/admin`. Mantener activado *Deployment Protection →
  Vercel Authentication* (Settings → Deployment Protection) para que los Preview no sean públicos.
- **Development**: `http://localhost:3000` y `http://localhost:3000/admin`. Para probar la
  separación, definir en `.env` `ADMIN_HOST=admin.localhost:3000` y `PUBLIC_HOST=localhost:3000`, y
  abrir `http://admin.localhost:3000` (los navegadores resuelven `*.localhost` solos).

## Cuando tengamos el dominio definitivo

### 1. Vercel → Project → Settings → Domains

Agregar los tres al **mismo proyecto**, todos asignados a Production:

1. `dominio.com`
2. `www.dominio.com` → configurarlo como redirección a `dominio.com`
3. `admin.dominio.com`

### 2. DNS (en el proveedor donde se compró el dominio)

Vercel muestra los valores exactos al agregar cada dominio; usar esos. Normalmente son:

| Tipo | Nombre | Valor |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |
| `CNAME` | `admin` | `cname.vercel-dns.com` |

Alternativa: delegar el dominio a los nameservers de Vercel y que él cree los registros. El
certificado HTTPS de cada dominio se emite solo cuando el DNS ya resuelve.

Si el dominio es institucional (p. ej. un subdominio de `ugb.edu.sv`), TI solo necesita crear dos
`CNAME` hacia `cname.vercel-dns.com`: uno para el sitio y otro para `admin.`.

### 3. Activar la separación

1. Definir `ADMIN_HOST` y `PUBLIC_HOST` en **Production** y volver a desplegar.
2. En el panel → Configuración → *URL pública del sitio*: poner `https://dominio.com`.
3. Comprobar: `https://dominio.com/admin` da 404; `https://admin.dominio.com` lleva al login;
   tras iniciar sesión, "Ver la landing" abre `https://dominio.com`.

No hace falta `vercel.json` ni rewrites adicionales.

## Pendiente antes del primer despliegue real

Hoy el proyecto **no puede funcionar en Vercel** por dos motivos ajenos a los dominios:

1. **Base de datos**: usa SQLite en un archivo local (`database/data/ugbplus.db`). En Vercel el
   disco es de solo lectura y no persiste entre peticiones. Hay que migrar a una base gestionada
   (p. ej. Postgres con Neon desde el Marketplace de Vercel).
2. **Imágenes subidas**: [`uploads.ts`](../src/server/storage/uploads.ts) escribe en
   `public/images`. Hay que cambiar `saveImage` para subir a Vercel Blob (u otro almacenamiento).

Además, cambiar la contraseña del usuario de prueba definido en el seed antes de publicar.
